#!/usr/bin/env node
/**
 * Phase 4: SSR / Node.js Import Safety Check for libs/ui
 *
 * Checks:
 *   1. Node.js import test — library must not crash on import (no top-level browser globals)
 *   2. Browser global audit — classify each usage as safe / guarded / unguarded
 *   3. RSC readiness — 'use client' coverage for hook-using components
 *   4. Emotion SSR note — documents what consumers need for CSS extraction
 *
 * Usage:
 *   node libs/ui/scripts/ssr-check.mjs
 *   node libs/ui/scripts/ssr-check.mjs --check    # exit 1 on unguarded globals (CI)
 *   node libs/ui/scripts/ssr-check.mjs --json     # write JSON report
 *   node libs/ui/scripts/ssr-check.mjs --verbose  # show all file details
 *
 * Requires the library to be built first: nx build ui
 */

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { findUnguardedGlobals, hasUseClient, hasReactHook } from './_shared/ast.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const SRC_ROOT = resolve(LIB_ROOT, 'src');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const CHECK_MODE = process.argv.includes('--check');
const WRITE_JSON = process.argv.includes('--json');
const VERBOSE = process.argv.includes('--verbose');

const BROWSER_GLOBALS = ['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'location'];

const SKIP_GLOBAL_DIRS = new Set(['ai']);

const SKIP_DIRS = new Set(['stories', '__tests__', 'node_modules', 'play', '__mocks__']);
const SKIP_FILES_RE = /\.(spec|test|stories|visual|stories\.play)\.(ts|tsx|js|jsx)$/;

function collectSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) files.push(...collectSourceFiles(full));
    } else if (['.ts', '.tsx'].includes(extname(full)) && !SKIP_FILES_RE.test(full)) {
      files.push(full);
    }
  }
  return files;
}

function classifyGlobals(filePath) {
  const rel = relative(SRC_ROOT, filePath);
  const useClient = hasUseClient(filePath);
  const findings = findUnguardedGlobals(filePath, BROWSER_GLOBALS);
  return { file: rel, hasUseClient: useClient, findings };
}

function checkRscReadiness(sourceFiles) {
  const hasClient = [];
  const missing = [];

  for (const file of sourceFiles) {
    const rel = relative(SRC_ROOT, file);
    if (rel.startsWith('ai/')) continue;
    // internal component hooks and utility helpers don't need 'use client' —
    // they are always imported by entry-point files that already carry the directive
    if (rel.startsWith('utils/')) continue;
    if (rel.startsWith('components/') && rel.includes('/hooks/')) continue;
    const useClient = hasUseClient(file);
    const usesHooks = hasReactHook(file);

    if (usesHooks) {
      if (useClient) hasClient.push(rel);
      else missing.push(rel);
    } else if (useClient) {
      hasClient.push(rel);
    }
  }

  return { hasClient: hasClient.length, missing };
}

function testNodeImport() {
  if (!existsSync(DIST_ROOT)) {
    return { status: 'skipped', reason: 'dist not found — run nx build ui first' };
  }

  const entryPath = resolve(DIST_ROOT, 'index.js');
  if (!existsSync(entryPath)) {
    return { status: 'skipped', reason: 'dist/index.js not found' };
  }

  const script = `
    try {
      const lib = await import('${entryPath}');
      const count = Object.keys(lib).length;
      console.log(JSON.stringify({ ok: true, exports: count }));
    } catch(e) {
      console.log(JSON.stringify({ ok: false, error: e.message, stack: e.stack?.split('\\n')[1] }));
    }
  `;

  const result = spawnSync(process.execPath, ['--input-type=module'], {
    input: script,
    encoding: 'utf-8',
    timeout: 30_000,
  });

  if (result.error) {
    return { status: 'error', error: result.error.message };
  }

  try {
    const parsed = JSON.parse(result.stdout.trim());
    return parsed.ok
      ? { status: 'pass', exports: parsed.exports }
      : { status: 'fail', error: parsed.error ?? 'unknown', stack: parsed.stack };
  } catch {
    const stderr = result.stderr?.trim();
    return { status: 'error', error: stderr || `exit code ${result.status}`, stdout: result.stdout };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const errors = [];
const warnings = [];

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║    gd-design-library  ·  SSR Safety Check       ║');
console.log('╚══════════════════════════════════════════════════╝\n');

console.log('▶ 1/4  Testing Node.js import (no top-level browser globals)...');
const importResult = testNodeImport();

if (importResult.status === 'pass') {
  console.log(`  ✓ Import succeeded — ${importResult.exports} named exports visible in Node.js`);
} else if (importResult.status === 'skipped') {
  console.log(`  ⚠  Skipped: ${importResult.reason}`);
  warnings.push({ type: 'import-test-skipped', reason: importResult.reason });
} else {
  console.log(`  ✗ Import FAILED: ${importResult.error}`);
  console.log(`     ${importResult.stack ?? ''}`);
  errors.push({ type: 'import-crash', ...importResult });
}

console.log('\n▶ 2/4  Auditing browser global usage in source...');
const sourceFiles = collectSourceFiles(SRC_ROOT);
const auditResults = sourceFiles
  .filter((f) => !SKIP_GLOBAL_DIRS.has(relative(SRC_ROOT, f).split('/')[0]))
  .map(classifyGlobals);

const withBrowserGlobals = auditResults.filter((r) => r.findings.length > 0);
const unguardedFiles = withBrowserGlobals.filter((r) => r.findings.some((f) => f.context === 'unguarded'));
const guardedFiles = withBrowserGlobals.filter((r) => r.findings.every((f) => f.context !== 'unguarded'));

const allUnguarded = withBrowserGlobals.flatMap((r) =>
  r.findings.filter((f) => f.context === 'unguarded').map((f) => ({ ...f, file: r.file, hasUseClient: r.hasUseClient }))
);

console.log(`  Files using browser globals  : ${withBrowserGlobals.length}`);
console.log(`  All in safe context (effects/handlers): ${guardedFiles.length}`);
console.log(`  Potentially unguarded        : ${unguardedFiles.length}`);

// Aggregate per-line findings into one entry per file so the dashboard and
// summary counts reflect distinct issues rather than every individual line.
const byFile = new Map();
for (const u of allUnguarded) {
  if (!byFile.has(u.file)) {
    byFile.set(u.file, {
      file: u.file,
      hasUseClient: u.hasUseClient,
      globals: new Set(),
      lines: [],
    });
  }
  const entry = byFile.get(u.file);
  entry.globals.add(u.glob);
  entry.lines.push({ glob: u.glob, lineNum: u.lineNum, lineContent: u.lineContent });
}
const unguardedByFile = [...byFile.values()].map((f) => ({
  file: f.file,
  hasUseClient: f.hasUseClient,
  globals: [...f.globals],
  count: f.lines.length,
  lines: f.lines.sort((a, b) => a.lineNum - b.lineNum),
}));

if (unguardedByFile.length === 0) {
  console.log('\n  ✓ No unguarded browser globals found.');
} else {
  const rscsafeFiles = unguardedByFile.filter((f) => f.hasUseClient);
  const riskyFiles = unguardedByFile.filter((f) => !f.hasUseClient);

  if (rscsafeFiles.length) {
    console.log(
      `\n  ℹ  ${rscsafeFiles.length} file(s) with 'use client' contain unguarded globals — safe for RSC but would fail in non-RSC SSR:`
    );
    rscsafeFiles.slice(0, 8).forEach((f) => console.log(`     ${f.file} (${f.count}× ${f.globals.join(', ')})`));
    warnings.push(...rscsafeFiles.map((f) => ({ type: 'browser-global-rsc-only', ...f })));
  }

  if (riskyFiles.length) {
    console.log(`\n  ✗  ${riskyFiles.length} file(s) with unguarded globals lacking 'use client' — will crash in any SSR:`);
    for (const f of riskyFiles) {
      console.log(`\n     ${f.file} (${f.count}× ${f.globals.join(', ')})`);
      f.lines.slice(0, 3).forEach((l) => console.log(`       :${l.lineNum}  ${l.glob} — ${l.lineContent}`));
      if (f.lines.length > 3) console.log(`       … and ${f.lines.length - 3} more`);
    }
    errors.push(...riskyFiles.map((f) => ({ type: 'unguarded-browser-global', ...f })));
  }
}

if (VERBOSE) {
  console.log('\n  All files with browser globals:');
  for (const r of withBrowserGlobals) {
    const contexts = [...new Set(r.findings.map((f) => f.context))].join(', ');
    const mark = r.findings.some((f) => f.context === 'unguarded') ? '⚠' : '✓';
    console.log(`  ${mark} ${r.file}  [${contexts}]${r.hasUseClient ? '  ← use client' : ''}`);
  }
}

console.log('\n▶ 3/4  Checking RSC readiness ("use client" coverage)...');
const rscResult = checkRscReadiness(sourceFiles);

console.log(`  Files with "use client"      : ${rscResult.hasClient}`);
console.log(`  Hook-using files missing it  : ${rscResult.missing.length}`);

if (rscResult.missing.length === 0) {
  console.log('  ✓ All hook-using files have "use client" directive.');
} else {
  console.log(`\n  ⚠  ${rscResult.missing.length} file(s) use React hooks but lack "use client":`);
  rscResult.missing.slice(0, 10).forEach((f) => console.log(`     ${f}`));
  if (rscResult.missing.length > 10) console.log(`     … and ${rscResult.missing.length - 10} more`);
  warnings.push(...rscResult.missing.map((f) => ({ type: 'missing-use-client', file: f })));
}

console.log('\n▶ 4/4  Emotion CSS-in-JS SSR guidance...');
console.log(`
  This library uses @emotion/react for styling. In SSR contexts:

  ┌─ Next.js App Router (RSC) ─────────────────────────────────────────────┐
  │  All component files have 'use client' → rendered client-side only.    │
  │  No CSS extraction needed. Works out of the box. ✓                     │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ Next.js Pages Router / traditional renderToString ────────────────────┐
  │  Emotion needs server-side CSS extraction to avoid FOUC:               │
  │                                                                         │
  │    import createEmotionServer from '@emotion/server/create-instance';  │
  │    import createCache from '@emotion/cache';                           │
  │                                                                         │
  │  See: https://emotion.sh/docs/ssr                                      │
  │  Required package: @emotion/server (not currently in deps)             │
  └────────────────────────────────────────────────────────────────────────┘`);

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Source files scanned         : ${sourceFiles.length}`);
console.log(`  Files with browser globals   : ${withBrowserGlobals.length}`);
console.log(`  Unguarded (no use client)    : ${errors.filter((e) => e.type === 'unguarded-browser-global').length}`);
console.log(`  RSC-safe (has use client)    : ${rscResult.hasClient}`);
console.log(`  Missing use client (hooks)   : ${rscResult.missing.length}`);
console.log(`  Node.js import               : ${importResult.status}`);
console.log(`  Errors                       : ${errors.length}`);
console.log(`  Warnings                     : ${warnings.length}`);

if (WRITE_JSON) {
  const outDir = resolve(__dirname, 'output');
  mkdirSync(outDir, { recursive: true });

  const report = {
    nodeImport: importResult,
    browserGlobals: {
      filesTotal: withBrowserGlobals.length,
      safeFiles: guardedFiles.length,
      unguardedFiles: unguardedFiles.length,
      unguardedByFile,
    },
    rsc: {
      filesWithUseClient: rscResult.hasClient,
      missingUseClient: rscResult.missing,
    },
    errors,
    warnings,
  };

  writeFileSync(resolve(outDir, 'ssr-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n  JSON written → scripts/output/ssr-report.json`);
}

const hasErrors = errors.length > 0;
console.log(
  '\n' +
    (hasErrors
      ? '✗ SSR check completed with errors.'
      : warnings.length
        ? '⚠ SSR check passed with warnings.'
        : '✓ SSR check passed.') +
    '\n'
);

if (CHECK_MODE && hasErrors) process.exit(1);
