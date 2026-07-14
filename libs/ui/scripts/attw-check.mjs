#!/usr/bin/env node
/**
 * Phase 6: Are The Types Wrong (attw) check for libs/ui dist.
 *
 * Runs @arethetypeswrong/cli against dist/libs/ui in --pack mode and reports:
 *   - per-entrypoint resolution status across node10 / node16-cjs / node16-esm / bundler
 *   - problem kinds with severity classification
 *
 * Usage:
 *   node libs/ui/scripts/attw-check.mjs
 *   node libs/ui/scripts/attw-check.mjs --json     # write JSON to scripts/output/
 *   node libs/ui/scripts/attw-check.mjs --check    # exit 1 on errors
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { readPackageJson, walkExports } from './_shared/exports-walker.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const OUTPUT_DIR = resolve(__dirname, 'output');

const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');

// attw problem kinds → severity. Errors = real bugs, Warnings = friction.
const ERROR_KINDS = new Set([
  'NoResolution',
  'UntypedResolution',
  'FalseCJS',
  'FalseESM',
  'CJSResolvesToESM',
  'InternalResolutionError',
  'UnexpectedModuleSyntax',
]);

const WARN_KINDS = new Set([
  'FallbackCondition',
  'CJSOnlyExportsDefault',
  'NamedExports',
  'FalseExportDefault',
  'MissingExportEquals',
]);

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  Are The Types Wrong?    ║');
console.log('╚══════════════════════════════════════════════════╝\n');

if (!existsSync(DIST_ROOT)) {
  console.log('  ✗ dist not found — run `nx build ui` first.\n');
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'attw-report.json'),
      JSON.stringify({ errors: [{ kind: 'dist-missing' }], warnings: [], problems: [], resolutions: {} }, null, 2)
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

const distPkg = readPackageJson({ distRoot: DIST_ROOT, libRoot: LIB_ROOT });
const excluded = walkExports(distPkg).nonJsEntries.map((e) => e.name);

console.log(`▶ Running attw --pack ${DIST_ROOT} --format json...`);
if (excluded.length) console.log(`  Excluded non-JS entrypoints: ${excluded.join(', ')}`);

const attwArgs = ['--yes', 'attw', '--pack', DIST_ROOT, '--format', 'json'];
if (excluded.length) attwArgs.push('--exclude-entrypoints', ...excluded);

const result = spawnSync('npx', attwArgs, {
  encoding: 'utf-8',
  timeout: 120_000,
  maxBuffer: 50 * 1024 * 1024,
});

let parsed;
try {
  parsed = JSON.parse((result.stdout ?? '').trim());
} catch {
  console.log('  ✗ Could not parse attw JSON output.');
  console.log('  stderr:', (result.stderr ?? '').slice(0, 300));
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

// ─── Normalize ────────────────────────────────────────────────────────────────

const problemsByKind = parsed.problems ?? {};
const entrypoints = parsed.analysis?.entrypoints ?? {};

const flatProblems = [];
for (const [kind, list] of Object.entries(problemsByKind)) {
  for (const p of list ?? []) {
    const severity = ERROR_KINDS.has(kind) ? 'error' : WARN_KINDS.has(kind) ? 'warn' : 'info';
    flatProblems.push({
      kind,
      severity,
      entrypoint: p.entrypoint ?? null,
      resolutionKind: p.resolutionKind ?? null,
      message: buildMessage(kind, p),
      typesFileName: p.typesFileName ?? null,
      implementationFileName: p.implementationFileName ?? null,
    });
  }
}

function buildMessage(kind, p) {
  switch (kind) {
    case 'FalseESM':
      return `Types declare ESM but implementation is CJS (${p.implementationFileName ?? '?'})`;
    case 'FalseCJS':
      return `Types declare CJS but implementation is ESM (${p.implementationFileName ?? '?'})`;
    case 'CJSResolvesToESM':
      return `CJS resolution unexpectedly leads to ESM file`;
    case 'NoResolution':
      return `No types resolution for ${p.entrypoint ?? '?'} under ${p.resolutionKind ?? '?'}`;
    case 'UntypedResolution':
      return `Resolution succeeded but no .d.ts at ${p.fileName ?? '?'}`;
    case 'InternalResolutionError':
      return `Internal resolution error: '${p.moduleSpecifier ?? '?'}' from ${p.fileName ?? '?'} (${
        p.resolutionOption ?? '?'
      })`;
    case 'NamedExports':
      return `CJS named exports may not work in some bundlers`;
    case 'FallbackCondition':
      return `Resolved via fallback condition — entrypoint may need explicit "import"/"require" entries`;
    case 'CJSOnlyExportsDefault':
      return `CJS module only exposes a default export`;
    case 'UnexpectedModuleSyntax':
      return `File contains module syntax that disagrees with its declared kind`;
    default:
      return p.message ?? JSON.stringify(p).slice(0, 120);
  }
}

const errors = flatProblems.filter((p) => p.severity === 'error');
const warnings = flatProblems.filter((p) => p.severity === 'warn');

// Per-entrypoint summary table
const resolutions = {};
for (const [name, ep] of Object.entries(entrypoints)) {
  const row = {};
  for (const [kind, res] of Object.entries(ep.resolutions ?? {})) {
    if (Array.isArray(res?.visibleProblems) && res.visibleProblems.length > 0) {
      row[kind] = res.visibleProblems.map((p) => p.kind).join(',');
    } else if (res?.resolution) {
      row[kind] = 'ok';
    } else {
      row[kind] = '–';
    }
  }
  resolutions[name] = row;
}

// ─── Console report ───────────────────────────────────────────────────────────

console.log(`\n  Problems found    : ${flatProblems.length}  (${errors.length} errors, ${warnings.length} warnings)`);
console.log(`  Entrypoints       : ${Object.keys(entrypoints).length}`);

if (flatProblems.length === 0) {
  console.log('\n  ✓ All resolutions match expected types.\n');
} else {
  console.log('');
  flatProblems.slice(0, 20).forEach((p, i) => {
    const mark = p.severity === 'error' ? '✗' : p.severity === 'warn' ? '⚠' : 'ℹ';
    console.log(`  ${mark} [${p.kind.padEnd(24)}] ${p.message}`);
  });
  if (flatProblems.length > 20) console.log(`     … and ${flatProblems.length - 20} more`);
}

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Errors    : ${errors.length}`);
console.log(`  Warnings  : ${warnings.length}`);

// ─── JSON output ──────────────────────────────────────────────────────────────

if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const report = {
    errors,
    warnings,
    problems: flatProblems,
    resolutions,
    summary: {
      total: flatProblems.length,
      byKind: Object.fromEntries(Object.entries(problemsByKind).map(([k, v]) => [k, (v ?? []).length])),
      packageName: parsed.analysis?.packageName,
      packageVersion: parsed.analysis?.packageVersion,
    },
  };
  writeFileSync(resolve(OUTPUT_DIR, 'attw-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n  JSON written → scripts/output/attw-report.json`);
}

const hasErrors = errors.length > 0;
console.log(
  '\n' +
    (hasErrors
      ? '✗ attw found type-resolution errors.'
      : warnings.length
        ? '⚠ attw found type-resolution warnings.'
        : '✓ attw passed.') +
    '\n'
);

if (CHECK_MODE && hasErrors) process.exit(1);
