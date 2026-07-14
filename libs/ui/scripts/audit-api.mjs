#!/usr/bin/env node
/**
 * Phase 1 Audit: Public API Map + Dependency Analysis for libs/ui
 *
 * Generates:
 *   1. public-api-map.json  — all exported symbols with their source file
 *   2. deps-map.json        — actual imports vs declared dependencies
 *
 * Usage:
 *   node libs/ui/scripts/audit-api.mjs           # console report
 *   node libs/ui/scripts/audit-api.mjs --json    # also write JSON to scripts/output/
 *   node libs/ui/scripts/audit-api.mjs --check   # exit 1 if warnings found (CI mode)
 *
 * Note: verify:ui:ci does NOT pass --check here; all warnings land in
 * deps-map.json#warnings and are aggregated by build-summary --check.
 * Use --check only when running this script standalone.
 */

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, relative, extname, join } from 'path';
import { fileURLToPath } from 'url';
import { getExports, getNodeModuleImports } from './_shared/ast.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const SRC_ROOT = resolve(LIB_ROOT, 'src');
const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');

// ─── Load package.json ────────────────────────────────────────────────────────

const pkg = JSON.parse(readFileSync(resolve(LIB_ROOT, 'package.json'), 'utf-8'));
const allDeclaredDeps = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);

// Rollup external patterns (mirrors vite.config.ts)
const ROLLUP_EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  /^@emotion\/.+/,
  /^@visx\/.+/,
  /^d3-.+/,
  /^embla-.+/,
  'uuid',
];

function isRollupExternal(pkg) {
  return ROLLUP_EXTERNAL.some((e) => (e instanceof RegExp ? e.test(pkg) : e === pkg));
}

// ─── Path alias resolution (mirrors tsconfig.lib.json) ────────────────────────

const ALIASES = {
  '@types': resolve(SRC_ROOT, 'types'),
  '@constants': resolve(SRC_ROOT, 'constants'),
  '@utils': resolve(SRC_ROOT, 'utils'),
  '@hooks': resolve(SRC_ROOT, 'hooks'),
  '@tokens': resolve(SRC_ROOT, 'tokens'),
  '@components': resolve(SRC_ROOT, 'components'),
  '@assets': resolve(SRC_ROOT, 'assets'),
  '@templates': resolve(SRC_ROOT, 'components/domainSpecific/Templates'),
  '@testUtils': resolve(SRC_ROOT, 'test-utils.tsx'),
  '@playUtils': resolve(SRC_ROOT, 'utils/play'),
};

function resolveAlias(importPath) {
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (importPath === alias) return target;
    if (importPath.startsWith(alias + '/')) return resolve(target, importPath.slice(alias.length + 1));
  }
  return null;
}

// ─── File resolution ──────────────────────────────────────────────────────────

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function resolveFile(importPath, fromDir) {
  const aliased = resolveAlias(importPath);
  if (aliased) return tryResolve(aliased);
  if (importPath.startsWith('.')) return tryResolve(resolve(fromDir, importPath));
  return null; // node_modules
}

function tryResolve(abs) {
  if (extname(abs) && existsSync(abs)) return abs;
  for (const ext of EXTENSIONS) {
    if (existsSync(abs + ext)) return abs + ext;
  }
  for (const ext of EXTENSIONS) {
    const idx = resolve(abs, 'index' + ext);
    if (existsSync(idx)) return idx;
  }
  return null;
}

// ─── Export tracing (AST-backed via _shared/ast.mjs) ─────────────────────────

const traceCache = new Map();

function traceExports(filePath, chain = []) {
  if (traceCache.has(filePath)) return traceCache.get(filePath);

  // Sentinel to break cycles
  traceCache.set(filePath, new Map());

  const result = new Map();
  const { reExports, directExports } = getExports(filePath);
  const dir = dirname(filePath);

  for (const name of directExports) {
    result.set(name, { sourceFile: filePath, via: [...chain] });
  }

  for (const { path: importPath, names } of reExports) {
    const resolved = resolveFile(importPath, dir);
    if (!resolved) continue;

    const nested = traceExports(resolved, [...chain, filePath]);

    if (names === '*') {
      for (const [name, info] of nested) {
        if (!result.has(name)) result.set(name, info);
      }
    } else {
      for (const name of names) {
        const info = nested.get(name);
        if (info && !result.has(name)) result.set(name, info);
        else if (!result.has(name)) result.set(name, { sourceFile: resolved, via: [...chain, filePath] });
      }
    }
  }

  traceCache.set(filePath, result);
  return result;
}

// ─── Dependency scanning ──────────────────────────────────────────────────────

const SKIP_DIRS = new Set(['stories', '__tests__', 'node_modules', 'play', '__mocks__']);
const SKIP_EXTENSIONS = /\.(spec|test|stories|visual|stories\.play)\.(ts|tsx|js|jsx)$/;
// Files excluded from the public build (tsconfig.lib.json exclude list)
const SKIP_FILES = new Set(['test-utils.tsx']);

function collectSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) files.push(...collectSourceFiles(full));
    } else if (EXTENSIONS.includes(extname(full)) && !SKIP_EXTENSIONS.test(full) && !SKIP_FILES.has(entry)) {
      files.push(full);
    }
  }
  return files;
}

function getPackageName(specifier) {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }
  return specifier.split('/')[0];
}

// Internal alias prefixes — these are tsconfig path aliases, not npm packages
const INTERNAL_ALIAS_PREFIXES = Object.keys(ALIASES)
  .map((a) => a + '/')
  .concat(Object.keys(ALIASES));

function isInternalAlias(specifier) {
  return INTERNAL_ALIAS_PREFIXES.some(
    (prefix) => specifier === prefix.replace(/\/$/, '') || specifier.startsWith(prefix)
  );
}

function extractNodeModuleImports(filePath) {
  return getNodeModuleImports(filePath, isInternalAlias);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║     gd-design-library  ·  Phase 1 API Audit     ║');
console.log('╚══════════════════════════════════════════════════╝\n');

// 1. Trace all public exports
console.log('▶ Tracing public exports from src/index.ts...');
const entry = resolve(SRC_ROOT, 'index.ts');
const allExports = traceExports(entry);

const byCategory = {};
for (const [name, { sourceFile, via }] of allExports) {
  const rel = relative(SRC_ROOT, sourceFile);
  const cat = rel.split('/')[0];
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push({
    name,
    sourceFile: rel,
    via: via.map((f) => relative(SRC_ROOT, f)),
  });
}

console.log(`\n  Total public exports : ${allExports.size}`);
for (const [cat, items] of Object.entries(byCategory)) {
  console.log(`  ${cat.padEnd(12)}: ${items.length}`);
}

// 2. Scan all source files for node_module imports
console.log('\n▶ Scanning source files for dependency usage...');
const sourceFiles = collectSourceFiles(SRC_ROOT);
const depUsage = new Map(); // pkgName → Set<relPath>

for (const file of sourceFiles) {
  for (const pkgName of extractNodeModuleImports(file)) {
    if (!depUsage.has(pkgName)) depUsage.set(pkgName, new Set());
    depUsage.get(pkgName).add(relative(SRC_ROOT, file));
  }
}

console.log(`  Source files scanned : ${sourceFiles.length}`);
console.log(`  Unique packages used : ${depUsage.size}`);

// ─── Analysis ─────────────────────────────────────────────────────────────────

const warnings = [];

// A. Undeclared — used in source but absent from all dep fields
const SELF_NAME = pkg.name;
const undeclared = [...depUsage.keys()].filter((p) => !allDeclaredDeps.has(p) && p !== SELF_NAME);

// B. Unused direct deps — declared in `dependencies` but never imported
const unusedDeps = Object.keys(pkg.dependencies ?? {}).filter((d) => !depUsage.has(d));

// C. Bundled direct deps — in `dependencies`, NOT in rollup external → will be inlined
const bundledDeps = Object.keys(pkg.dependencies ?? {}).filter((d) => !isRollupExternal(d));

// D. External but in dependencies (not peerDeps)
const externalInDeps = Object.keys(pkg.dependencies ?? {}).filter((d) => isRollupExternal(d));

// E. Package.json exports gap
const exportsGap = [];
for (const [exportPath, exportValue] of Object.entries(pkg.exports ?? {})) {
  if (exportPath.includes('*')) continue;
  if (typeof exportValue !== 'object' || !exportValue.import) continue;
  const jsPath = exportValue.import.replace(/^\.\//, '').replace(/\.js$/, '');
  const srcExists =
    EXTENSIONS.some((ext) => existsSync(resolve(SRC_ROOT, jsPath + ext))) ||
    existsSync(resolve(SRC_ROOT, jsPath, 'index.ts')) ||
    existsSync(resolve(SRC_ROOT, jsPath, 'index.tsx'));
  if (!srcExists) exportsGap.push({ exportPath, resolvedTo: exportValue.import });
}

// F. Deprecated routing
const DEPRECATED_DIRS = ['components/core', 'components/domainSpecific'];
const deprecatedRouted = [...allExports.entries()].filter(([, { via }]) =>
  via.some((f) => DEPRECATED_DIRS.some((d) => relative(SRC_ROOT, f).startsWith(d)))
);

// ─── Report ───────────────────────────────────────────────────────────────────

console.log('\n── Dependency Map ──────────────────────────────────\n');

console.log('  dependencies (declared):');
for (const [dep, ver] of Object.entries(pkg.dependencies ?? {})) {
  const used = depUsage.has(dep);
  const ext = isRollupExternal(dep) ? 'external' : 'bundled';
  const mark = used ? '✓' : '✗';
  console.log(`    ${mark} ${dep}@${ver}  [${ext}]${used ? '' : '  ← UNUSED'}`);
}

console.log('\n  peerDependencies (declared):');
for (const [dep, ver] of Object.entries(pkg.peerDependencies ?? {})) {
  console.log(`    ~ ${dep}@${ver}`);
}

console.log('\n  All packages imported in source:');
for (const [p, files] of [...depUsage.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const inDep = pkg.dependencies?.[p] ? 'dep' : null;
  const inPeer = pkg.peerDependencies?.[p] ? 'peer' : null;
  const inDev = pkg.devDependencies?.[p] ? 'dev' : null;
  const status = inDep ?? inPeer ?? inDev ?? '⚠ UNDECLARED';
  console.log(`    [${status.padEnd(12)}] ${p}  (${files.size} file${files.size !== 1 ? 's' : ''})`);
}

console.log('\n── Warnings ────────────────────────────────────────');
let hasWarnings = false;

if (undeclared.length) {
  hasWarnings = true;
  console.log(`\n  ⚠  UNDECLARED (${undeclared.length}) — used in source but missing from package.json:`);
  for (const p of undeclared) {
    const files = [...(depUsage.get(p) ?? [])];
    console.log(`     - ${p}`);
    files.slice(0, 2).forEach((f) => console.log(`         ${f}`));
    if (files.length > 2) console.log(`         … and ${files.length - 2} more`);
  }
  warnings.push(...undeclared.map((p) => ({ type: 'undeclared', package: p })));
}

if (unusedDeps.length) {
  hasWarnings = true;
  console.log(`\n  ⚠  UNUSED DEPS (${unusedDeps.length}) — in dependencies but never imported:`);
  unusedDeps.forEach((p) => console.log(`     - ${p}`));
  warnings.push(...unusedDeps.map((p) => ({ type: 'unused-dep', package: p })));
}

if (bundledDeps.length) {
  hasWarnings = true;
  console.log(
    `\n  ⚠  BUNDLED DEPS (${bundledDeps.length}) — in dependencies but NOT in rollup external → will be inlined:`
  );
  bundledDeps.forEach((p) => console.log(`     - ${p}  (consumers who also use this may get duplicate copies)`));
  warnings.push(...bundledDeps.map((p) => ({ type: 'bundled-dep', package: p })));
}

if (externalInDeps.length) {
  console.log(
    `\n  ℹ  EXTERNAL-IN-DEPS (${externalInDeps.length}) — marked external but listed in dependencies (not peerDependencies):`
  );
  console.log('     These are excluded from the bundle but installed transitively via npm.');
  externalInDeps.forEach((p) => console.log(`     - ${p}`));
}

if (exportsGap.length) {
  hasWarnings = true;
  console.log(`\n  ⚠  EXPORTS GAP (${exportsGap.length}) — package.json export paths with no matching source:`);
  exportsGap.forEach(({ exportPath, resolvedTo }) =>
    console.log(`     - "${exportPath}" → ${resolvedTo}  (no source found)`)
  );
  warnings.push(...exportsGap.map((g) => ({ type: 'exports-gap', ...g })));
}

if (deprecatedRouted.length) {
  console.log(`\n  ℹ  DEPRECATED ROUTING — ${deprecatedRouted.length} exports pass through core/ or domainSpecific/`);
  console.log('     These still work but add indirection. Consider removing the compat shims when ready.');
}

if (!hasWarnings) {
  console.log('\n  ✓ No warnings found.');
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Public exports       : ${allExports.size}`);
console.log(`  Source files scanned : ${sourceFiles.length}`);
console.log(`  Packages in source   : ${depUsage.size}`);
console.log(`  Warnings             : ${warnings.length}`);
console.log(`  Info notices         : ${(externalInDeps.length > 0 ? 1 : 0) + (deprecatedRouted.length > 0 ? 1 : 0)}`);

// ─── JSON output ──────────────────────────────────────────────────────────────

if (WRITE_JSON) {
  const outDir = resolve(__dirname, 'output');
  mkdirSync(outDir, { recursive: true });

  const apiMap = {
    totalExports: allExports.size,
    byCategory: Object.fromEntries(Object.entries(byCategory).map(([cat, items]) => [cat, items.length])),
    exports: Object.fromEntries(
      [...allExports.entries()].map(([name, { sourceFile, via }]) => [
        name,
        {
          sourceFile: relative(SRC_ROOT, sourceFile),
          via: via.map((f) => relative(SRC_ROOT, f)),
        },
      ])
    ),
  };

  const depsMap = {
    declared: {
      dependencies: pkg.dependencies ?? {},
      peerDependencies: pkg.peerDependencies ?? {},
      devDependencies: pkg.devDependencies ?? {},
    },
    actual: Object.fromEntries([...depUsage.entries()].map(([p, files]) => [p, [...files].sort()])),
    analysis: {
      undeclared,
      unusedDeps,
      bundledDeps,
      externalInDeps,
      exportsGap,
      deprecatedRoutedCount: deprecatedRouted.length,
    },
    warnings,
  };

  writeFileSync(resolve(outDir, 'public-api-map.json'), JSON.stringify(apiMap, null, 2));
  writeFileSync(resolve(outDir, 'deps-map.json'), JSON.stringify(depsMap, null, 2));
  console.log(`\n  JSON written → scripts/output/public-api-map.json`);
  console.log(`              → scripts/output/deps-map.json`);
}

console.log('\n' + (hasWarnings ? '✗ Audit completed with warnings.' : '✓ Audit completed.') + '\n');

if (CHECK_MODE && hasWarnings) process.exit(1);
