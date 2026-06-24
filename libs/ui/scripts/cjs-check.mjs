#!/usr/bin/env node
/**
 * Phase 5: CJS Usage Verification for libs/ui
 *
 * Checks:
 *   1. CJS output exists (.cjs files in dist)
 *   2. CJS entry can be require()'d in Node.js without errors
 *   3. package.json exports has "require" conditions
 *   4. Key components accessible via require()
 *   5. package.json exports/main/types consistency
 *
 * Usage:
 *   node libs/ui/scripts/cjs-check.mjs
 *   node libs/ui/scripts/cjs-check.mjs --check    # exit 1 on failures (CI)
 *   node libs/ui/scripts/cjs-check.mjs --json     # write JSON report
 *
 * Requires the library to be built first: nx build ui
 */

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const CHECK_MODE = process.argv.includes('--check');
const WRITE_JSON = process.argv.includes('--json');

const errors = [];
const warnings = [];

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║    gd-design-library  ·  CJS Verification       ║');
console.log('╚══════════════════════════════════════════════════╝\n');

console.log('▶ 1/5  Checking CJS output files exist...');

if (!existsSync(DIST_ROOT)) {
  console.log('  ✗ dist not found — run `nx build ui` first.');
  errors.push({ type: 'dist-missing' });
} else {
  const allFiles = [];
  function collect(dir) {
    for (const e of readdirSync(dir)) {
      const f = resolve(dir, e);
      if (statSync(f).isDirectory()) collect(f);
      else allFiles.push(f);
    }
  }
  collect(DIST_ROOT);

  const cjsFiles = allFiles.filter((f) => f.endsWith('.cjs'));
  const esmFiles = allFiles.filter((f) => f.endsWith('.js') && !f.endsWith('.d.ts'));

  console.log(`  ESM files (.js)   : ${esmFiles.length}`);
  console.log(`  CJS files (.cjs)  : ${cjsFiles.length}`);

  if (cjsFiles.length === 0) {
    console.log('  ✗ No .cjs files found — CJS build is not being generated.');
    console.log('    Fix: update vite.config.ts rollupOptions.output to array with CJS format and .cjs extension.');
    errors.push({ type: 'no-cjs-output', esmFiles: esmFiles.length });
  } else {
    const ratio = (cjsFiles.length / esmFiles.length).toFixed(2);
    console.log(`  ✓ CJS output exists (${ratio}x ratio vs ESM)`);

    const indexCjs = resolve(DIST_ROOT, 'index.cjs');
    if (!existsSync(indexCjs)) {
      console.log('  ✗ dist/index.cjs missing — CJS entry point not found.');
      errors.push({ type: 'missing-cjs-entry', path: 'index.cjs' });
    } else {
      console.log('  ✓ dist/index.cjs exists');
    }

    const mismatched = cjsFiles.filter((f) => {
      if (f.includes('/_virtual/')) return false; // bundler-internal helpers (e.g. rolldown runtime)
      const esmEquivalent = f.replace(/\.cjs$/, '.js');
      return !existsSync(esmEquivalent);
    });
    if (mismatched.length > 0) {
      console.log(`  ⚠  ${mismatched.length} .cjs files have no .js counterpart`);
      warnings.push({ type: 'cjs-esm-mismatch', count: mismatched.length });
    }
  }
}

console.log('\n▶ 2/5  Testing require() in Node.js CJS context...');

function testRequire(scriptBody) {
  const result = spawnSync(process.execPath, ['--eval', scriptBody], {
    encoding: 'utf-8',
    timeout: 15_000,
  });
  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    return { ok: false, error: result.stderr?.trim() || 'no output', stdout: result.stdout };
  }
}

const indexCjsPath = resolve(DIST_ROOT, 'index.cjs');

if (!existsSync(indexCjsPath)) {
  console.log('  ⚠  Skipped — dist/index.cjs not found');
  warnings.push({ type: 'require-test-skipped', reason: 'no index.cjs' });
} else {
  const requireResult = testRequire(`
    try {
      const lib = require(${JSON.stringify(indexCjsPath)});
      const count = Object.keys(lib).length;
      console.log(JSON.stringify({ ok: true, exports: count }));
    } catch(e) {
      console.log(JSON.stringify({ ok: false, error: e.message }));
    }
  `);

  if (requireResult.ok) {
    console.log(`  ✓ require() succeeded — ${requireResult.exports} named exports`);
  } else {
    console.log(`  ✗ require() failed: ${requireResult.error}`);
    errors.push({ type: 'require-crash', error: requireResult.error });
  }

  const buttonCjsPath = resolve(DIST_ROOT, 'components/atoms/Button/Button.cjs');
  if (existsSync(buttonCjsPath)) {
    const buttonResult = testRequire(`
      try {
        const m = require(${JSON.stringify(buttonCjsPath)});
        const hasButton = typeof m.Button !== 'undefined' || typeof m.default !== 'undefined';
        console.log(JSON.stringify({ ok: true, hasExport: hasButton, keys: Object.keys(m).slice(0,5) }));
      } catch(e) {
        console.log(JSON.stringify({ ok: false, error: e.message }));
      }
    `);
    if (buttonResult.ok) {
      console.log(`  ✓ Single component require() works (Button: keys=${buttonResult.keys?.join(', ')})`);
    } else {
      console.log(`  ⚠  Single component require() failed: ${buttonResult.error}`);
      warnings.push({ type: 'component-require-failed', component: 'Button', error: buttonResult.error });
    }
  }
}

console.log('\n▶ 3/5  Validating package.json exports "require" conditions...');

const pkg = JSON.parse(readFileSync(resolve(LIB_ROOT, 'package.json'), 'utf-8'));
const exportsMap = pkg.exports ?? {};
const exportEntries = Object.entries(exportsMap).filter(([p]) => !p.includes('*') && typeof exportsMap[p] === 'object');

let requireConditionCount = 0;
let missingRequireCount = 0;

for (const [exportPath, value] of exportEntries) {
  if (typeof value !== 'object') continue;
  if (exportPath.endsWith('.css') || exportPath.endsWith('.txt') || exportPath.endsWith('.json')) continue;

  if (value.require) {
    requireConditionCount++;
    const cjsPath = resolve(DIST_ROOT, value.require.replace(/^\.\//, ''));
    if (!existsSync(cjsPath)) {
      console.log(`  ⚠  exports["${exportPath}"].require → ${value.require} (file missing in dist)`);
      warnings.push({ type: 'require-path-missing', exportPath, path: value.require });
    }
  } else {
    missingRequireCount++;
    console.log(`  ⚠  exports["${exportPath}"] has no "require" condition`);
    warnings.push({ type: 'missing-require-condition', exportPath });
  }
}

if (requireConditionCount > 0 && missingRequireCount === 0) {
  console.log(`  ✓ All ${requireConditionCount} export entries have "require" condition`);
} else if (requireConditionCount > 0) {
  console.log(`  ⚠  ${requireConditionCount} have "require", ${missingRequireCount} missing it`);
}

console.log('\n▶ 4/5  Verifying .cjs files use CommonJS syntax...');

if (existsSync(indexCjsPath)) {
  const indexCjsContent = readFileSync(indexCjsPath, 'utf-8').slice(0, 500);
  const hasRequire = indexCjsContent.includes('require(') || indexCjsContent.includes('exports.');
  const hasImport = /^import\s/.test(indexCjsContent) || /\bfrom\s+['"]/.test(indexCjsContent.slice(0, 100));

  if (hasRequire && !hasImport) {
    console.log('  ✓ index.cjs uses CommonJS syntax (require/exports)');
  } else if (hasImport) {
    console.log('  ✗ index.cjs still contains ESM import syntax — CJS build failed');
    errors.push({ type: 'cjs-contains-esm' });
  } else {
    console.log('  ⚠  Could not confirm CJS syntax (file may be minimal)');
    warnings.push({ type: 'cjs-syntax-uncertain' });
  }
}

console.log('\n▶ 5/5  Checking "main" field for CJS consumers...');

const mainField = pkg.main;
if (!mainField) {
  console.log('  ⚠  No "main" field — legacy require("gd-design-library") without exports support will fail');
  warnings.push({ type: 'missing-main-field' });
} else if (mainField.endsWith('.cjs')) {
  console.log(`  ✓ "main": "${mainField}" points to CJS`);
} else if (mainField.endsWith('.js')) {
  console.log(`  ⚠  "main": "${mainField}" points to .js — update to .cjs for legacy CJS consumers`);
  console.log('     (Bundlers using "exports" field will use the "require" condition correctly)');
  warnings.push({ type: 'main-not-cjs', main: mainField });
}

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Errors   : ${errors.length}`);
console.log(`  Warnings : ${warnings.length}`);

if (WRITE_JSON) {
  const outDir = resolve(__dirname, 'output');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'cjs-report.json'), JSON.stringify({ errors, warnings }, null, 2));
  console.log(`\n  JSON written → scripts/output/cjs-report.json`);
}

const hasErrors = errors.length > 0;
console.log(
  '\n' +
    (hasErrors
      ? '✗ CJS check completed with errors.'
      : warnings.length
        ? '⚠ CJS check passed with warnings.'
        : '✓ CJS check passed.') +
    '\n'
);

if (CHECK_MODE && hasErrors) process.exit(1);
