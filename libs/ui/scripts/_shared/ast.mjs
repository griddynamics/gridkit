/**
 * Shared @babel/parser pass for libs/ui verify pipeline.
 *
 * Exposes:
 *   parseFile(path)           → AST (cached by path+mtime), or null on parse error
 *   getExports(path)          → { directExports, reExports }
 *   getNodeModuleImports(p,…) → Set<packageName>
 *   findUnguardedGlobals(…)   → [{ glob, lineNum, lineContent, context }]
 *   hasUseClient(path)        → boolean
 *   hasReactHook(path)        → boolean
 *   clearAstCache()           → flushes the parsed-file cache
 *
 * Replaces hand-rolled regex scanners in audit-api.mjs, ssr-check.mjs, and
 * build-lint.mjs's "use client" check.
 */

import { readFileSync, statSync } from 'fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

// @babel/traverse is a CJS package; its default export lives on .default when
// loaded from ESM. Older versions expose the function directly.
const traverse = typeof _traverse === 'function' ? _traverse : _traverse.default;

const PARSE_OPTS = {
  sourceType: 'module',
  allowReturnOutsideFunction: true,
  errorRecovery: true,
  plugins: [
    'typescript',
    'jsx',
    'decorators-legacy',
    'classProperties',
    'classPrivateProperties',
    'topLevelAwait',
    'importAttributes',
  ],
};

const cache = new Map(); // path → { mtimeMs, ast, src }

export function clearAstCache() {
  cache.clear();
}

export function parseFile(filePath) {
  let mtimeMs;
  try {
    mtimeMs = statSync(filePath).mtimeMs;
  } catch {
    return null;
  }
  const hit = cache.get(filePath);
  if (hit && hit.mtimeMs === mtimeMs) return hit;

  let src;
  try {
    src = readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }

  let ast;
  try {
    ast = parse(src, PARSE_OPTS);
  } catch {
    // best-effort: leave entry but mark ast null so callers can detect
    const entry = { mtimeMs, ast: null, src };
    cache.set(filePath, entry);
    return entry;
  }

  const entry = { mtimeMs, ast, src };
  cache.set(filePath, entry);
  return entry;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

function specifierName(spec) {
  // Prefer the exported name (handles `Foo as Bar` → 'Bar')
  if (spec.exported) {
    return spec.exported.name ?? spec.exported.value;
  }
  return spec.local?.name ?? null;
}

function declarationNames(decl) {
  if (!decl) return [];
  switch (decl.type) {
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
    case 'TSInterfaceDeclaration':
    case 'TSTypeAliasDeclaration':
    case 'TSEnumDeclaration':
    case 'TSModuleDeclaration':
      return decl.id ? [decl.id.name] : [];
    case 'VariableDeclaration':
      return decl.declarations.flatMap((d) => collectIdNames(d.id));
    default:
      return [];
  }
}

function collectIdNames(node) {
  if (!node) return [];
  switch (node.type) {
    case 'Identifier':
      return [node.name];
    case 'ObjectPattern':
      return node.properties.flatMap((p) =>
        p.type === 'RestElement' ? collectIdNames(p.argument) : collectIdNames(p.value)
      );
    case 'ArrayPattern':
      return node.elements.flatMap((e) => collectIdNames(e));
    case 'AssignmentPattern':
      return collectIdNames(node.left);
    case 'RestElement':
      return collectIdNames(node.argument);
    default:
      return [];
  }
}

export function getExports(filePath) {
  const entry = parseFile(filePath);
  const directExports = [];
  const reExports = [];
  if (!entry?.ast) return { directExports, reExports };

  for (const node of entry.ast.program.body) {
    if (node.type === 'ExportAllDeclaration') {
      // export * from '…'   or   export * as ns from '…'
      reExports.push({
        path: node.source.value,
        names: node.exported ? [node.exported.name ?? node.exported.value] : '*',
      });
    } else if (node.type === 'ExportNamedDeclaration') {
      if (node.source) {
        // re-export: export { A, B as C } from '…' (incl. type-only)
        const names = (node.specifiers ?? []).map(specifierName).filter(Boolean);
        if (names.length) reExports.push({ path: node.source.value, names });
      } else if (node.declaration) {
        // export const/function/class/type/interface/enum
        directExports.push(...declarationNames(node.declaration));
      } else if (node.specifiers?.length) {
        // export { A, B as C }
        directExports.push(...node.specifiers.map(specifierName).filter(Boolean));
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      directExports.push('default');
    }
  }

  return { directExports, reExports };
}

// ─── Node-module imports ──────────────────────────────────────────────────────

function isExternalSpecifier(specifier, isInternalAlias) {
  if (!specifier) return false;
  if (specifier.startsWith('.')) return false;
  if (isInternalAlias && isInternalAlias(specifier)) return false;
  return true;
}

function packageNameOf(specifier) {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }
  return specifier.split('/')[0];
}

export function getNodeModuleImports(filePath, isInternalAlias) {
  const entry = parseFile(filePath);
  const pkgs = new Set();
  if (!entry?.ast) return pkgs;

  traverse(entry.ast, {
    ImportDeclaration(p) {
      const v = p.node.source.value;
      if (isExternalSpecifier(v, isInternalAlias)) pkgs.add(packageNameOf(v));
    },
    ExportNamedDeclaration(p) {
      const v = p.node.source?.value;
      if (v && isExternalSpecifier(v, isInternalAlias)) pkgs.add(packageNameOf(v));
    },
    ExportAllDeclaration(p) {
      const v = p.node.source?.value;
      if (v && isExternalSpecifier(v, isInternalAlias)) pkgs.add(packageNameOf(v));
    },
    CallExpression(p) {
      if (p.node.callee.type !== 'Import') return;
      const arg = p.node.arguments[0];
      if (arg?.type !== 'StringLiteral') return;
      if (isExternalSpecifier(arg.value, isInternalAlias)) pkgs.add(packageNameOf(arg.value));
    },
  });

  return pkgs;
}

// ─── Browser-global scope analysis ────────────────────────────────────────────

const HOOK_CALLEE = /^use(Effect|LayoutEffect|Callback|Memo|ImperativeHandle|InsertionEffect)$/;

function hasEarlyReturnGuard(refPath, globName) {
  // Look for `if (typeof <globName> === 'undefined') return …` (or throw) appearing
  // textually BEFORE this reference, inside any enclosing block. Mirrors the regex
  // version's `earlyReturnRe` heuristic but anchored to the global's actual name.
  const refPos = refPath.node.loc?.start;
  if (!refPos) return false;

  // Walk up enclosing functions/program looking at statement lists.
  for (let cur = refPath.parentPath; cur; cur = cur.parentPath) {
    const node = cur.node;
    const body = node.type === 'BlockStatement' ? node.body : node.type === 'Program' ? node.body : null;
    if (!body) continue;
    for (const stmt of body) {
      const end = stmt.loc?.end;
      if (!end) continue;
      // Only consider statements that fully precede the reference.
      if (end.line > refPos.line || (end.line === refPos.line && end.column >= refPos.column)) break;
      if (statementGuardsGlobal(stmt, globName)) return true;
    }
  }
  return false;
}

function statementGuardsGlobal(stmt, globName) {
  if (stmt.type !== 'IfStatement') return false;
  // Test must reference `typeof <globName>`
  let testMentions = false;
  const walk = (n) => {
    if (!n || testMentions) return;
    if (
      n.type === 'UnaryExpression' &&
      n.operator === 'typeof' &&
      n.argument?.type === 'Identifier' &&
      n.argument.name === globName
    ) {
      testMentions = true;
      return;
    }
    for (const k of Object.keys(n)) {
      const v = n[k];
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object' && v.type) walk(v);
    }
  };
  walk(stmt.test);
  if (!testMentions) return false;
  // Consequent must short-circuit (return / throw), so execution never falls
  // through to a later use of the global when it's undefined.
  const c = stmt.consequent;
  if (!c) return false;
  if (c.type === 'ReturnStatement' || c.type === 'ThrowStatement') return true;
  if (c.type === 'BlockStatement') {
    return c.body.some((s) => s.type === 'ReturnStatement' || s.type === 'ThrowStatement');
  }
  return false;
}

function classifyContext(path, globName) {
  // First: any earlier `if (typeof X === 'undefined') return …` in an enclosing block
  // means later references to X are safe — execution returns before reaching them.
  if (hasEarlyReturnGuard(path, globName)) return 'guarded';

  // Then walk ancestors looking for a wrapping construct that makes this reference safe.
  for (let cur = path.parentPath; cur; cur = cur.parentPath) {
    const node = cur.node;

    // typeof X
    if (node.type === 'UnaryExpression' && node.operator === 'typeof') {
      return 'guarded';
    }

    // if (typeof X === 'undefined') { … }
    if (node.type === 'IfStatement' && containsTypeofGuard(node.test)) {
      return 'guarded';
    }

    // useEffect(() => { window.x }, [])  — inside a hook callback. Check any
    // argument position so useImperativeHandle(ref, () => …) also matches.
    if (
      (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') &&
      cur.parentPath?.isCallExpression() &&
      cur.parentPath.node.arguments.includes(node)
    ) {
      const callee = cur.parentPath.node.callee;
      const calleeName =
        callee.type === 'Identifier'
          ? callee.name
          : callee.type === 'MemberExpression' && callee.property.type === 'Identifier'
            ? callee.property.name
            : null;
      if (calleeName && HOOK_CALLEE.test(calleeName)) return 'safe';
    }

    // const handleClick = () => { window.x }   |   const onSubmit = () => …
    if (
      (node.type === 'ArrowFunctionExpression' ||
        node.type === 'FunctionExpression' ||
        node.type === 'FunctionDeclaration') &&
      isEventHandlerName(eventHandlerNameFor(cur))
    ) {
      return 'safe';
    }

    // JSX attribute: onClick={() => window.x}
    if (
      (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') &&
      cur.parentPath?.isJSXExpressionContainer() &&
      cur.parentPath.parentPath?.isJSXAttribute()
    ) {
      const attrName = cur.parentPath.parentPath.node.name?.name ?? '';
      if (/^on[A-Z]/.test(attrName)) return 'safe';
    }
  }
  return 'unguarded';
}

function eventHandlerNameFor(funcPath) {
  const node = funcPath.node;
  if (node.type === 'FunctionDeclaration' && node.id) return node.id.name;
  // const X = () => …
  const parent = funcPath.parentPath?.node;
  if (parent?.type === 'VariableDeclarator' && parent.id?.type === 'Identifier') return parent.id.name;
  // X: () => …  (object property / class method shorthand)
  if (parent?.type === 'ObjectProperty' && parent.key?.type === 'Identifier') return parent.key.name;
  if (parent?.type === 'ClassMethod' && parent.key?.type === 'Identifier') return parent.key.name;
  return null;
}

function isEventHandlerName(name) {
  if (!name) return false;
  return /^handle[A-Z]/.test(name) || /^on[A-Z]/.test(name);
}

function containsTypeofGuard(testNode) {
  // Recognize: typeof X === 'undefined' / !== 'undefined' / === 'object' / etc.
  // Anywhere inside the test (handles &&, ||, parens).
  if (!testNode) return false;
  let found = false;
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (
      node.type === 'BinaryExpression' &&
      (node.operator === '===' || node.operator === '!==' || node.operator === '==' || node.operator === '!=') &&
      ((node.left.type === 'UnaryExpression' && node.left.operator === 'typeof') ||
        (node.right.type === 'UnaryExpression' && node.right.operator === 'typeof'))
    ) {
      found = true;
      return;
    }
    if (node.type === 'UnaryExpression' && node.operator === 'typeof') {
      found = true;
      return;
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object' && v.type) walk(v);
    }
  };
  walk(testNode);
  return found;
}

export function findUnguardedGlobals(filePath, globalNames) {
  const entry = parseFile(filePath);
  const found = [];
  if (!entry?.ast) return found;
  const lines = entry.src.split('\n');
  const targets = new Set(globalNames);
  const seen = new Set();

  traverse(entry.ast, {
    Identifier(path) {
      const name = path.node.name;
      if (!targets.has(name)) return;
      // Skip property accesses (e.g. obj.window, obj.location)
      if (
        path.parentPath.isMemberExpression() &&
        path.parentPath.node.property === path.node &&
        !path.parentPath.node.computed
      ) {
        return;
      }
      // Skip object-property keys (e.g. { window: 1 })
      if (
        path.parentPath.isObjectProperty() &&
        path.parentPath.node.key === path.node &&
        !path.parentPath.node.computed
      ) {
        return;
      }
      // Skip declarations (function param, variable declarator, etc.)
      if (path.parentPath.isVariableDeclarator() && path.parentPath.node.id === path.node) return;
      if (path.parentPath.isFunction() && path.listKey === 'params') return;
      // If this identifier resolves to an in-scope binding, it shadows the global.
      if (path.scope.hasBinding(name)) return;

      const lineNum = path.node.loc?.start.line ?? 0;
      const key = `${name}:${lineNum}`;
      if (seen.has(key)) return;
      seen.add(key);

      const context = classifyContext(path, name);
      const lineContent = (lines[lineNum - 1] ?? '').trim().slice(0, 80);
      found.push({ glob: name, lineNum, lineContent, context });
    },
  });

  return found;
}

// ─── Raw import-source list ───────────────────────────────────────────────────

export function getImportSources(filePath) {
  const entry = parseFile(filePath);
  const out = [];
  if (!entry?.ast) return out;
  for (const node of entry.ast.program.body) {
    if (node.type === 'ImportDeclaration') out.push(node.source.value);
    else if ((node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') && node.source) {
      out.push(node.source.value);
    }
  }
  return out;
}

// ─── 'use client' & React-hook detection ──────────────────────────────────────

export function hasUseClient(filePath) {
  const entry = parseFile(filePath);
  if (!entry?.ast) return false;
  const dirs = entry.ast.program.directives ?? [];
  return dirs.some((d) => d.value?.value === 'use client');
}

const REACT_HOOK_NAMES = new Set([
  'useState',
  'useEffect',
  'useLayoutEffect',
  'useReducer',
  'useCallback',
  'useMemo',
  'useRef',
  'useContext',
  'useImperativeHandle',
  'useDebugValue',
  'useTransition',
  'useDeferredValue',
  'useId',
  'useSyncExternalStore',
]);

export function hasReactHook(filePath) {
  const entry = parseFile(filePath);
  if (!entry?.ast) return false;
  let found = false;
  traverse(entry.ast, {
    CallExpression(path) {
      if (found) {
        path.stop();
        return;
      }
      const callee = path.node.callee;
      const name =
        callee.type === 'Identifier'
          ? callee.name
          : callee.type === 'MemberExpression' && callee.property.type === 'Identifier'
            ? callee.property.name
            : null;
      if (name && REACT_HOOK_NAMES.has(name)) {
        found = true;
        path.stop();
      }
    },
  });
  return found;
}
