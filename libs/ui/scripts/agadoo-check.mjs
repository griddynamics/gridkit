#!/usr/bin/env node
/**
 * Phase 2 add-on: agadoo-style tree-shake test for libs/ui dist.
 *
 * Algorithm (same as github.com/Rich-Harris/agadoo):
 *   1. Wrap the dist entry in a virtual module: `import "<dist-path>"`
 *   2. Roll it up with the side-effects-free defaults (treeshake.moduleSideEffects = false)
 *   3. Generate ESM output
 *   4. If the output contains any non-import statements, the lib is NOT fully tree-shakable
 *
 * We use the project's own rollup (^4) instead of the version vendored by agadoo
 * because agadoo's bundled acorn rejects modern syntax (`??=`, class fields, etc.)
 * present in our dist.
 *
 * By default tests every JS entry declared in package.json `exports` (e.g. `.`
 * and `./ai`). The overall result is `passed = entries.every(passed)`.
 *
 * Usage:
 *   node libs/ui/scripts/agadoo-check.mjs
 *   node libs/ui/scripts/agadoo-check.mjs --json
 *   node libs/ui/scripts/agadoo-check.mjs --check          # exit 1 if not shakable
 *   node libs/ui/scripts/agadoo-check.mjs --entry path     # test only this single entry
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';
import { readPackageJson, walkExports } from './_shared/exports-walker.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const OUTPUT_DIR = resolve(__dirname, 'output');

const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');
const VERBOSE = process.argv.includes('--verbose');

const entryArgIdx = process.argv.indexOf('--entry');
const SINGLE_ENTRY = entryArgIdx > -1 ? resolve(process.argv[entryArgIdx + 1]) : null;

function discoverEntries() {
  const pkg = readPackageJson({ distRoot: DIST_ROOT, libRoot: LIB_ROOT });
  const { jsEntries } = walkExports(pkg, { distRoot: DIST_ROOT });
  return jsEntries.map((e) => ({ name: e.name, path: e.absPath }));
}

const VIRTUAL_ID = '\0agadoo-virtual';

function makeVirtualPlugin(entryPath) {
  return {
    name: 'agadoo-virtual',
    resolveId(id) {
      if (id === '__agadoo__') return VIRTUAL_ID;
      return null;
    },
    load(id) {
      if (id === VIRTUAL_ID) return `import ${JSON.stringify(entryPath)};\n`;
      return null;
    },
  };
}

async function checkOne(entryPath, label) {
  if (!existsSync(entryPath)) {
    return { name: label, entry: entryPath, passed: false, survivorsCount: 0, unshakable: [], error: 'entry-missing' };
  }

  try {
    const bundle = await rollup({
      input: '__agadoo__',
      plugins: [makeVirtualPlugin(entryPath)],
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      onwarn(warning, handle) {
        if (warning.code === 'EMPTY_BUNDLE') return;
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        handle(warning);
      },
    });

    const { output } = await bundle.generate({ format: 'esm' });
    const code = output[0].code ?? '';

    const stripped = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/^\s*import\s[^;]*;?\s*$/gm, '')
      .replace(/^\s*export\s*\{\s*\}\s*;?\s*$/gm, '')
      .trim();

    const passed = stripped.length === 0;
    const unshakable = passed
      ? []
      : stripped
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .slice(0, 50);

    await bundle.close();

    return {
      name: label,
      entry: entryPath,
      passed,
      survivorsCount: unshakable.length,
      unshakable,
      error: null,
      ...(VERBOSE ? { fullOutput: code } : {}),
    };
  } catch (e) {
    return {
      name: label,
      entry: entryPath,
      passed: false,
      survivorsCount: 0,
      unshakable: [],
      error: e.message,
    };
  }
}

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  Agadoo Tree-Shake Test  ║');
console.log('╚══════════════════════════════════════════════════╝\n');

const targets = SINGLE_ENTRY ? [{ name: SINGLE_ENTRY, path: SINGLE_ENTRY }] : discoverEntries();

if (targets.length === 0) {
  console.log('  ⚠  No JS entries found in package.json exports (or dist missing).\n');
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'agadoo-report.json'),
      JSON.stringify({ passed: false, entries: [], error: 'no-entries' }, null, 2)
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

console.log(`▶ Testing ${targets.length} entry/entries:`);
targets.forEach((t) => console.log(`   • ${t.name}  (${t.path})`));
console.log();

const results = [];
for (const t of targets) {
  const res = await checkOne(t.path, t.name);
  results.push(res);

  if (res.error) {
    console.log(`  ✗ ${res.name.padEnd(20)} ERROR: ${res.error}`);
  } else if (res.passed) {
    console.log(`  ✓ ${res.name.padEnd(20)} fully tree-shakable`);
  } else {
    console.log(`  ✗ ${res.name.padEnd(20)} ${res.survivorsCount} survivor(s)`);
    res.unshakable.slice(0, 5).forEach((l) => console.log(`        ${l.slice(0, 110)}`));
  }
}

const allPassed = results.every((r) => r.passed);
const totalSurvivors = results.reduce((sum, r) => sum + r.survivorsCount, 0);
const allUnshakable = results.flatMap((r) => r.unshakable);
const firstError = results.find((r) => r.error)?.error ?? null;

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Entries tested  : ${results.length}`);
console.log(`  Tree-shakable   : ${allPassed ? '✓ all' : `✗ ${results.filter((r) => !r.passed).length} failing`}`);
if (totalSurvivors > 0) console.log(`  Survivors total : ${totalSurvivors}`);

if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUTPUT_DIR, 'agadoo-report.json'),
    JSON.stringify(
      {
        passed: allPassed,
        entries: results,
        // legacy/flat fields kept for the dashboard
        survivorsCount: totalSurvivors,
        unshakable: allUnshakable,
        error: firstError,
      },
      null,
      2
    )
  );
  console.log(`\n  JSON written → scripts/output/agadoo-report.json`);
}

console.log(
  '\n' +
    (allPassed
      ? '✓ Tree-shake check passed.'
      : firstError
        ? '✗ Tree-shake check errored.'
        : '⚠ Not fully tree-shakable.') +
    '\n'
);

if (CHECK_MODE && !allPassed) process.exit(1);
