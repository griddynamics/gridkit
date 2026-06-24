#!/usr/bin/env node
/**
 * Post-build type-fixup for libs/ui dist.
 *
 * Fixes two attw-flagged issues that vite-plugin-dts emits by default:
 *
 *   1. InternalResolutionError under node16 ESM
 *      Cause: dist .d.ts files use bare relative re-exports
 *               export * from './hooks';
 *      Fix:   rewrite to explicit JS extension or directory index
 *               export * from './hooks/index.js';
 *
 *   2. FalseESM (dual-package hazard)
 *      Cause: package.json `exports.require` points to .cjs but
 *             `exports.types` resolves to a .d.ts file that the CJS
 *             resolver interprets as ESM (because pkg.type = "module").
 *      Fix:   for every .d.ts emit a .d.cts companion (identical content)
 *             and add `exports[path].require.types` pointing to it.
 *
 * Run as part of build:ui after nx build + package.json copy.
 */

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_ROOT = resolve(__dirname, '../../../dist/libs/ui');

if (!existsSync(DIST_ROOT)) {
  console.error(`postbuild-types: dist not found at ${DIST_ROOT}`);
  process.exit(1);
}

// ─── 1. Collect dist .d.ts files ──────────────────────────────────────────────

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = resolve(dir, e);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (full.endsWith('.d.ts') || full.endsWith('.d.cts')) out.push(full);
  }
  return out;
}

const dtsFiles = walk(DIST_ROOT);

// ─── 2. Rewrite re-exports / imports to add .js extensions ───────────────────
//
// Three patterns to catch in .d.ts files:
//   from './foo'               (re-exports, type imports)
//   import('./foo').X          (dynamic import type queries — emitted by TS for inferred types)
//   typeof import('./foo')     (covered by the import() form)

const FROM_RE = /(\bfrom\s+['"])(\.\.?(?:\/[^'"]*)?)(['"])/g;
const IMPORT_FN_RE = /(\bimport\(\s*['"])(\.\.?(?:\/[^'"]*)?)(['"]\s*\))/g;

function resolveRelative(spec, fromFile) {
  const fromDir = dirname(fromFile);
  const abs = resolve(fromDir, spec);

  // Already has an extension
  if (/\.(js|cjs|mjs|json)$/.test(spec)) return spec;

  // "." / ".." resolve to current/parent directory's index
  if (spec === '.' || spec === '..') {
    if (existsSync(resolve(abs, 'index.d.ts'))) return `${spec}/index.js`;
  }

  // Bare path → look for .d.ts file or directory with index.d.ts
  if (existsSync(`${abs}.d.ts`)) return `${spec}.js`;
  if (statSync(abs, { throwIfNoEntry: false })?.isDirectory() && existsSync(resolve(abs, 'index.d.ts'))) {
    return `${spec}/index.js`;
  }
  // Could not resolve — leave it (attw will still flag, but build doesn't break)
  return spec;
}

function rewriteWithRegex(src, file, regex, counts) {
  return src.replace(regex, (m, pre, spec, post) => {
    const newSpec = resolveRelative(spec, file);
    if (newSpec !== spec) {
      counts.specs++;
      return `${pre}${newSpec}${post}`;
    }
    return m;
  });
}

const counts = { specs: 0, files: 0 };

for (const file of dtsFiles) {
  const src = readFileSync(file, 'utf-8');
  let out = rewriteWithRegex(src, file, FROM_RE, counts);
  out = rewriteWithRegex(out, file, IMPORT_FN_RE, counts);
  if (out !== src) {
    writeFileSync(file, out, 'utf-8');
    counts.files++;
  }
}

const rewroteCount = counts.files;
const rewroteSpecCount = counts.specs;

console.log(`▶ Rewrote ${rewroteSpecCount} relative spec(s) across ${rewroteCount} .d.ts file(s).`);

// ─── 3. Emit .d.cts companions (after rewrite) ────────────────────────────────

let cwroteCount = 0;
for (const file of dtsFiles) {
  const cts = file.replace(/\.d\.ts$/, '.d.cts');
  if (existsSync(cts)) continue;
  writeFileSync(cts, readFileSync(file, 'utf-8'), 'utf-8');
  cwroteCount++;
}
console.log(`▶ Emitted ${cwroteCount} .d.cts companion(s).`);

// ─── 4. Update dist/package.json exports map ──────────────────────────────────

const pkgPath = resolve(DIST_ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

function updateConditional(value, exportPath) {
  if (typeof value !== 'object' || value === null) return value;

  // wildcard pattern
  if (exportPath.includes('*')) {
    if (value.types && value.types.endsWith('.d.ts')) {
      value = {
        types: value.types,
        import: value.import,
        require: { types: value.types.replace(/\.d\.ts$/, '.d.cts'), default: value.require },
      };
    }
    return value;
  }

  if (value.import && value.require && value.types) {
    // Already has a `types` at top — split into per-condition types.
    const importTypes = value.types;
    const requireTypes = value.types.replace(/\.d\.ts$/, '.d.cts');
    return {
      import: { types: importTypes, default: value.import },
      require: { types: requireTypes, default: value.require },
    };
  }
  return value;
}

if (pkg.exports) {
  const newExports = {};
  for (const [exportPath, value] of Object.entries(pkg.exports)) {
    newExports[exportPath] = updateConditional(value, exportPath);
  }
  pkg.exports = newExports;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log('▶ Updated dist/package.json exports with per-condition types (.d.ts + .d.cts).');
}

console.log('✓ postbuild-types complete.\n');
