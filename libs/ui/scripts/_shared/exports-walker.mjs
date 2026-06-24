/**
 * Walks a package.json `exports` field and partitions entries by target type.
 *
 * Returns:
 *   {
 *     jsEntries:    [{ name, target, absPath }]   // .js / .cjs / .mjs targets
 *     nonJsEntries: [{ name, target }]            // .css / .txt / .json / images / etc.
 *   }
 *
 * Wildcard patterns ("./ai/*") are skipped since attw / agadoo can't resolve them
 * to a single concrete file without enumeration.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const JS_EXT_RE = /\.(js|cjs|mjs)$/;

export function readPackageJson({ distRoot, libRoot }) {
  if (distRoot) {
    const distPkgPath = resolve(distRoot, 'package.json');
    if (existsSync(distPkgPath)) return JSON.parse(readFileSync(distPkgPath, 'utf-8'));
  }
  if (libRoot) {
    return JSON.parse(readFileSync(resolve(libRoot, 'package.json'), 'utf-8'));
  }
  throw new Error('readPackageJson: provide distRoot or libRoot');
}

// Resolve an exports[path] value to a single string target — handles all four shapes:
//   "./foo.js"
//   { import: "./foo.js", require: "./foo.cjs", types: "./foo.d.ts" }
//   { import: { types, default }, require: { types, default } }   (post-FalseESM-fix)
function resolveTarget(value) {
  if (typeof value === 'string') return value;
  if (!value) return null;
  // Prefer import; fall back to default. Each may itself be string or {types, default}.
  const pick = (cond) => (typeof cond === 'string' ? cond : (cond?.default ?? cond?.import ?? null));
  return pick(value.import) ?? pick(value.default) ?? pick(value.require) ?? null;
}

export function walkExports(pkg, { distRoot } = {}) {
  const jsEntries = [];
  const nonJsEntries = [];

  for (const [exportPath, value] of Object.entries(pkg.exports ?? {})) {
    if (exportPath.includes('*')) continue;

    const target = resolveTarget(value);
    if (!target) continue;

    const entry = {
      name: exportPath,
      target,
      absPath: distRoot ? resolve(distRoot, target.replace(/^\.\//, '')) : null,
    };

    if (JS_EXT_RE.test(target)) jsEntries.push(entry);
    else nonJsEntries.push({ name: exportPath, target });
  }

  return { jsEntries, nonJsEntries };
}
