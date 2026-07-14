#!/usr/bin/env node
/**
 * Phase 2 add-on: size-limit budget enforcement for libs/ui.
 *
 * Auto-discovers every named export from dist/libs/ui/index.js and
 * dist/libs/ui/ai/index.js, generates libs/ui/.size-limit.json with per-export
 * budgets (defaults + hand-tuned overrides from .size-limit.budgets.json),
 * then runs size-limit against the freshly generated config.
 *
 * Output:
 *   - libs/ui/.size-limit.json  (regenerated each run, gitignored)
 *   - console summary table
 *   - scripts/output/size-limit-report.json
 *
 * Usage:
 *   node libs/ui/scripts/size-check.mjs
 *   node libs/ui/scripts/size-check.mjs --json     # write JSON report
 *   node libs/ui/scripts/size-check.mjs --check    # exit 1 on budget overruns
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const OUTPUT_DIR = resolve(__dirname, 'output');
const SIZE_LIMIT_PATH = resolve(LIB_ROOT, '.size-limit.json');
const BUDGETS_PATH = resolve(LIB_ROOT, '.size-limit.budgets.json');

const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  Size-Limit Budgets      ║');
console.log('╚══════════════════════════════════════════════════╝\n');

if (!existsSync(DIST_ROOT)) {
  console.log('  ✗ dist not found — run `nx build ui` first.\n');
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'size-limit-report.json'),
      JSON.stringify({ entries: [], passed: false, error: 'dist-missing' }, null, 2)
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

const budgets = existsSync(BUDGETS_PATH)
  ? JSON.parse(readFileSync(BUDGETS_PATH, 'utf-8'))
  : { ignore: [], defaults: { single: '40 kB', ai: '120 kB', wholeLibrary: '350 kB', wholeAI: '250 kB' }, overrides: {} };

const IGNORE = budgets.ignore ?? ['react', 'react-dom', '@emotion/react', '@emotion/styled'];
const DEFAULTS = budgets.defaults ?? {};
const OVERRIDES = budgets.overrides ?? {};

async function listExports(distRelPath) {
  const abs = resolve(DIST_ROOT, distRelPath);
  if (!existsSync(abs)) return [];
  const mod = await import(pathToFileURL(abs).href);
  return Object.keys(mod).filter((n) => n !== 'default').sort();
}

// We bundle one entry per export, which gets expensive past ~150 entries.
// Components are the thing teams actually budget; helpers/constants/types are
// either inlined into components or so small they don't move the needle.
// Filter to UpperCamelCase exports (components) + use* (hooks) + anything
// explicitly listed in overrides — the maintainer's escape hatch.
function looksLikeComponent(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}
function looksLikeHook(name) {
  return /^use[A-Z]/.test(name);
}
function shouldBudget(name, overrideKey) {
  if (overrideKey in OVERRIDES) return true;
  return looksLikeComponent(name) || looksLikeHook(name);
}

async function generateSizeLimitConfig() {
  const entries = [];

  for (const name of await listExports('index.js')) {
    if (!shouldBudget(name, name)) continue;
    entries.push({
      name,
      path: '../../dist/libs/ui/index.js',
      import: `{ ${name} }`,
      limit: OVERRIDES[name] ?? DEFAULTS.single ?? '40 kB',
      ignore: IGNORE,
    });
  }

  if (existsSync(resolve(DIST_ROOT, 'ai/index.js'))) {
    for (const name of await listExports('ai/index.js')) {
      const key = `ai/${name}`;
      if (!shouldBudget(name, key)) continue;
      entries.push({
        name: key,
        path: '../../dist/libs/ui/ai/index.js',
        import: `{ ${name} }`,
        limit: OVERRIDES[key] ?? DEFAULTS.ai ?? '120 kB',
        ignore: IGNORE,
      });
    }
    entries.push({
      name: 'ai/Whole AI subentry',
      path: '../../dist/libs/ui/ai/index.js',
      limit: OVERRIDES['ai/Whole AI subentry'] ?? DEFAULTS.wholeAI ?? '250 kB',
      ignore: IGNORE,
    });
  }

  entries.push({
    name: 'Whole library (tree-shaken)',
    path: '../../dist/libs/ui/index.js',
    limit: OVERRIDES['Whole library (tree-shaken)'] ?? DEFAULTS.wholeLibrary ?? '350 kB',
    ignore: IGNORE,
  });

  return entries;
}

const generatedConfig = await generateSizeLimitConfig();
writeFileSync(SIZE_LIMIT_PATH, JSON.stringify(generatedConfig, null, 2));
console.log(`▶ Generated .size-limit.json — ${generatedConfig.length} entries (${Object.keys(OVERRIDES).length} hand-tuned)`);
console.log('▶ Running size-limit (esbuild + gzip + per-entry tree-shake)…\n');

const result = spawnSync('npx', ['size-limit', '--json'], {
  cwd: LIB_ROOT,
  encoding: 'utf-8',
  timeout: 120_000,
  maxBuffer: 50 * 1024 * 1024,
});

const stdout = (result.stdout ?? '').trim();

let entries;
try {
  entries = JSON.parse(stdout);
} catch {
  console.log('  ✗ Could not parse size-limit JSON output.');
  console.log('  stderr:', (result.stderr ?? '').slice(0, 400));
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

// ─── Console table ─────────────────────────────────────────────────────────────

const fmt = (bytes) => (bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} kB`);
const pct = (size, limit) => Math.round((size / limit) * 100);

let allPassed = true;
const overruns = [];

for (const e of entries) {
  const mark = e.passed ? '✓' : '✗';
  const ratio = pct(e.size, e.sizeLimit);
  const ratioColor = ratio > 95 ? '⚠' : '';
  console.log(
    `  ${mark} ${e.name.padEnd(32)}  ${fmt(e.size).padStart(9)}  /  ${fmt(e.sizeLimit).padStart(9)}  (${ratio}%) ${ratioColor}`
  );
  if (!e.passed) {
    allPassed = false;
    overruns.push({ name: e.name, size: e.size, limit: e.sizeLimit, overage: e.size - e.sizeLimit });
  }
}

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Entries tested  : ${entries.length}`);
console.log(`  Budget overruns : ${overruns.length}`);

if (overruns.length === 0) {
  console.log('  ✓ All within budget.\n');
} else {
  console.log('\n  Overruns:');
  for (const o of overruns) {
    console.log(`    ${o.name}: ${fmt(o.size)} > ${fmt(o.limit)} (+${fmt(o.overage)})`);
  }
  console.log();
}

// ─── JSON output ──────────────────────────────────────────────────────────────

if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUTPUT_DIR, 'size-limit-report.json'),
    JSON.stringify({ passed: allPassed, entries, overruns, totalEntries: entries.length }, null, 2)
  );
  console.log(`  JSON written → scripts/output/size-limit-report.json\n`);
}

if (CHECK_MODE && !allPassed) process.exit(1);
