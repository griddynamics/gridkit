#!/usr/bin/env node
/**
 * CTORNDSD-646c — bundle-size regression gate.
 *
 * `libs/ui` has `size-check` as one of its 10 `verify:ui` phases; this package had no equivalent, so
 * a size regression here would have gone unnoticed. Consumes the JSON that
 * `measure-bundle-size.mjs` already emits rather than re-measuring.
 *
 *   node libs/web-components/scripts/check-bundle-size.mjs            # check against the baseline
 *   node libs/web-components/scripts/check-bundle-size.mjs --update   # accept current as baseline
 *
 * Requires `npm run measure:web-components-size` to have produced the report first.
 *
 * TOLERANCE is a percentage, deliberately not zero: Rollup redistributes shared-helper bytes between
 * chunks when any one chunk changes size, so an untouched component's reported gzip size shifts by a
 * few hundred bytes for reasons unrelated to it — documented in `FINDINGS.md` §13 and observed again
 * in §17.5. A zero-tolerance gate would fail on that noise and get disabled, which is worse than a
 * gate with an honest threshold.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PKG = join(here, '..');
const REPORT = join(PKG, 'bundle-size-report.json');
const BASELINE = join(PKG, 'bundle-size-baseline.json');
const TOLERANCE_PCT = 10;

if (!existsSync(REPORT)) {
  console.error(`✗ ${REPORT} not found. Run: npm run measure:web-components-size`);
  process.exit(1);
}

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

/** The report shape has evolved; pull the per-atom gzip figures defensively. */
function extractSizes(r) {
  const out = {};
  const rows = Array.isArray(r) ? r : (r.atoms ?? r.components ?? r.rows ?? []);
  for (const row of rows) {
    const name = row.name ?? row.atom ?? row.component;
    const gzip = row.litGzip ?? row.lit ?? row.gzip;
    if (typeof name === 'string' && typeof gzip === 'number') out[name] = gzip;
  }
  if (Object.keys(out).length === 0 && r && typeof r === 'object') {
    for (const [k, v] of Object.entries(r)) {
      if (typeof v === 'number') out[k] = v;
      else if (v && typeof v === 'object' && typeof v.litGzip === 'number') out[k] = v.litGzip;
    }
  }
  return out;
}

const current = extractSizes(report);
if (Object.keys(current).length === 0) {
  console.error('✗ Could not read per-atom gzip sizes from the report. Report shape:');
  console.error(JSON.stringify(report, null, 2).slice(0, 800));
  process.exit(1);
}

if (process.argv.includes('--update') || !existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
  console.log(`✓ baseline ${existsSync(BASELINE) ? 'updated' : 'created'} → ${BASELINE}`);
  for (const [k, v] of Object.entries(current)) console.log(`    ${k.padEnd(12)} ${v} B`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
const failures = [];
const notes = [];

for (const [name, size] of Object.entries(current)) {
  const before = baseline[name];
  if (typeof before !== 'number') {
    notes.push(`+ ${name}: ${size} B (new, not in baseline)`);
    continue;
  }
  const deltaPct = ((size - before) / before) * 100;
  const line = `${name.padEnd(12)} ${before} → ${size} B (${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%)`;
  if (deltaPct > TOLERANCE_PCT) failures.push(line);
  else notes.push(`  ${line}`);
}

for (const name of Object.keys(baseline)) {
  if (!(name in current)) notes.push(`- ${name}: missing from the current report`);
}

console.log(`Bundle size vs baseline (tolerance ${TOLERANCE_PCT}%):`);
notes.forEach((n) => console.log(n));

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} bundle-size regression(s) beyond ${TOLERANCE_PCT}%:`);
  failures.forEach((f) => console.error(`  ${f}`));
  console.error('\nIf the growth is intended, re-run with --update and explain it in the commit.');
  process.exit(1);
}

console.log('\n✓ no bundle-size regressions');
