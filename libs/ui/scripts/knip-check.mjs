#!/usr/bin/env node
/**
 * Phase 1 add-on: knip-backed unused code scan for libs/ui.
 *
 * Detects:
 *   - Unused files that aren't reachable from any entry
 *   - Unused exports (declared but no consumer in the project graph)
 *   - Unused declared dependencies
 *
 * Usage:
 *   node libs/ui/scripts/knip-check.mjs           # console + always exit 0
 *   node libs/ui/scripts/knip-check.mjs --json    # write JSON to scripts/output/knip-report.json
 *   node libs/ui/scripts/knip-check.mjs --check   # exit 1 if findings
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(__dirname, 'output');
const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  Knip Unused-Code Scan   ║');
console.log('╚══════════════════════════════════════════════════╝\n');

console.log('▶ Running knip --reporter json (this may take 10–30s)...\n');

const result = spawnSync('npx', ['--yes', 'knip', '--no-progress', '--cache', '--reporter', 'json'], {
  cwd: LIB_ROOT,
  encoding: 'utf-8',
  timeout: 180_000,
  maxBuffer: 50 * 1024 * 1024,
});

// knip exits 1 when it finds issues — that's expected, not an error
if (result.error) {
  console.log(`  ✗ knip failed to spawn: ${result.error.message}`);
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

const stdout = (result.stdout ?? '').trim();
let parsed;
try {
  parsed = JSON.parse(stdout);
} catch (e) {
  console.log('  ✗ Could not parse knip JSON output:');
  console.log(stdout.slice(0, 500));
  console.log('  stderr:', (result.stderr ?? '').slice(0, 500));
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

// Knip's --reporter json shape (v6):
//   { issues: PerFileIssue[] }
// Each PerFileIssue has shape:
//   { file, files, exports, types, enumMembers, classMembers, namespaceMembers,
//     duplicates, dependencies, devDependencies, optionalPeerDependencies,
//     unlisted, unresolved, binaries, catalog }
// Where every category is a flat array of { name, line?, col?, pos?, namespace? }
// `files` is non-empty only when the whole file is unused.

const unusedFiles = [];
const unusedExports = [];
const unusedTypes = [];
const unusedDuplicates = [];
const unusedClassMembers = [];
const unusedEnumMembers = [];
const unusedDependenciesSet = new Set();
const unusedDevDependenciesSet = new Set();
const unlistedDependenciesSet = new Set();

const issues = Array.isArray(parsed.issues) ? parsed.issues : [];
for (const issue of issues) {
  const file = issue.file ?? '';

  for (const f of issue.files ?? []) {
    unusedFiles.push(typeof f === 'string' ? f : (f.name ?? file));
  }
  for (const e of issue.exports ?? []) {
    unusedExports.push({ name: e.name ?? String(e), file, line: e.line ?? null });
  }
  for (const t of issue.types ?? []) {
    unusedTypes.push({ name: t.name ?? String(t), file, line: t.line ?? null });
  }
  for (const m of issue.classMembers ?? []) {
    unusedClassMembers.push({ name: m.name ?? String(m), file, line: m.line ?? null });
  }
  for (const m of issue.enumMembers ?? []) {
    unusedEnumMembers.push({
      name: m.namespace ? `${m.namespace}.${m.name}` : (m.name ?? String(m)),
      file,
      line: m.line ?? null,
    });
  }
  for (const d of issue.duplicates ?? []) {
    unusedDuplicates.push({ symbols: d.symbols ?? d.name ?? d, file });
  }
  for (const d of issue.dependencies ?? []) {
    unusedDependenciesSet.add(typeof d === 'string' ? d : (d.name ?? String(d)));
  }
  for (const d of issue.devDependencies ?? []) {
    unusedDevDependenciesSet.add(typeof d === 'string' ? d : (d.name ?? String(d)));
  }
  for (const d of issue.unlisted ?? []) {
    unlistedDependenciesSet.add(typeof d === 'string' ? d : (d.name ?? String(d)));
  }
}

const unusedDependencies = [...unusedDependenciesSet];
const unusedDevDependencies = [...unusedDevDependenciesSet];
const unlistedDependencies = [...unlistedDependenciesSet];

// ─── Console report ───────────────────────────────────────────────────────────

const summary = [
  ['Unused files', unusedFiles.length],
  ['Unused exports', unusedExports.length],
  ['Unused types', unusedTypes.length],
  ['Unused class members', unusedClassMembers.length],
  ['Unused enum members', unusedEnumMembers.length],
  ['Duplicate exports', unusedDuplicates.length],
  ['Unused dependencies', unusedDependencies.length],
  ['Unused devDependencies', unusedDevDependencies.length],
  ['Unlisted (used but undeclared) deps', unlistedDependencies.length],
];

for (const [label, count] of summary) {
  const mark = count > 0 ? '⚠' : '✓';
  console.log(`  ${mark} ${label.padEnd(36)} : ${count}`);
}

if (unusedFiles.length > 0) {
  console.log(`\n  Unused files (first 10):`);
  unusedFiles.slice(0, 10).forEach((f) => console.log(`     ${f}`));
  if (unusedFiles.length > 10) console.log(`     … and ${unusedFiles.length - 10} more`);
}

if (unusedExports.length > 0) {
  console.log(`\n  Unused exports (first 10):`);
  unusedExports
    .slice(0, 10)
    .forEach((e) => console.log(`     ${e.name.padEnd(40)} ${e.file}${e.line ? `:${e.line}` : ''}`));
  if (unusedExports.length > 10) console.log(`     … and ${unusedExports.length - 10} more`);
}

if (unusedDependencies.length > 0) {
  console.log(`\n  Unused dependencies:`);
  unusedDependencies.forEach((d) => console.log(`     - ${d}`));
}

const totalFindings =
  unusedFiles.length +
  unusedExports.length +
  unusedTypes.length +
  unusedClassMembers.length +
  unusedEnumMembers.length +
  unusedDependencies.length;

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Total findings : ${totalFindings}`);

// ─── JSON output ──────────────────────────────────────────────────────────────

if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const report = {
    unusedFiles,
    unusedExports,
    unusedTypes,
    unusedClassMembers,
    unusedEnumMembers,
    unusedDuplicates,
    unusedDependencies,
    unusedDevDependencies,
    unlistedDependencies,
    totalFindings,
  };
  writeFileSync(resolve(OUTPUT_DIR, 'knip-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n  JSON written → scripts/output/knip-report.json`);
}

console.log('\n' + (totalFindings > 0 ? '⚠ Knip found dead code.' : '✓ Knip found no dead code.') + '\n');

if (CHECK_MODE && totalFindings > 0) process.exit(1);
