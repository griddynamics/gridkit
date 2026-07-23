#!/usr/bin/env node
/**
 * Bundle-size comparison of the 5 Lit-ported atoms against their React+Emotion equivalents
 * already tracked by libs/ui/.size-limit.budgets.json.
 *
 * Both sides are measured the same way (gzip, per-export/per-chunk, shared runtime
 * externalized) so the numbers are comparable:
 *   - Lit side: gzip size of each component's own chunk in dist/libs/web-components
 *     (`lit` and `gd-design-core` externalized, same as this package's vite.config.ts).
 *   - React side: libs/ui/scripts/size-check.mjs's per-export gzip size (`react`,
 *     `react-dom`, `@emotion/react`, `@emotion/styled` externalized/ignored).
 *
 * Usage: node libs/web-components/scripts/measure-bundle-size.mjs [--json]
 * Requires: `nx build web-components` and a built libs/ui dist (`nx build ui`) first.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { gzipSync } from 'zlib';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const LIT_DIST = resolve(REPO_ROOT, 'dist/libs/web-components');
const UI_SIZE_REPORT = resolve(REPO_ROOT, 'libs/ui/scripts/output/size-limit-report.json');

/** Regex used to identify which component a preserveModules chunk belongs to. */
const COMPONENT_SNIFFERS = {
  Button: /resolveButtonVariantStyle|GdButton/,
  Checkbox: /resolveCheckboxStyle|GdCheckbox/,
  Typography: /resolveTypographyStyle|GdTypography/,
  Input: /resolveInputStyle|GdInput/,
  Select: /resolveSelectStyle|GdSelect/,
};

function gzipBytes(buf) {
  return gzipSync(buf, { level: 9 }).length;
}

function measureLitAtoms() {
  if (!existsSync(LIT_DIST)) {
    console.error(`✗ ${LIT_DIST} not found — run \`nx build web-components\` first.`);
    process.exit(1);
  }

  const files = readdirSync(LIT_DIST).filter((f) => f.endsWith('.js'));
  const results = {};
  let sharedHelperGzip = 0;

  for (const file of files) {
    const content = readFileSync(resolve(LIT_DIST, file));
    const gzip = gzipBytes(content);
    const text = content.toString('utf-8');

    const matchedComponent = Object.entries(COMPONENT_SNIFFERS).find(([, re]) => re.test(text))?.[0];
    if (matchedComponent) {
      results[matchedComponent] = { file, gzip };
    } else {
      // Barrel (index.ts) + shared decorator-metadata helpers, paid once regardless of
      // how many of the 5 atoms a consumer actually imports.
      sharedHelperGzip += gzip;
    }
  }

  return { results, sharedHelperGzip };
}

function measureReactAtoms() {
  if (!existsSync(UI_SIZE_REPORT)) {
    console.log('  (no cached libs/ui size report — running `node libs/ui/scripts/size-check.mjs --json`...)');
    execFileSync('node', ['libs/ui/scripts/size-check.mjs', '--json'], { cwd: REPO_ROOT, stdio: 'inherit' });
  }
  const report = JSON.parse(readFileSync(UI_SIZE_REPORT, 'utf-8'));
  const byName = Object.fromEntries(report.entries.map((e) => [e.name, e.size]));
  return {
    Button: byName.Button,
    Checkbox: byName.Checkbox,
    Typography: byName.Typography,
    Input: byName.Input,
    Select: byName.Select,
  };
}

/** One-time runtime cost a React-only consumer app newly pays to adopt any Lit component —
 *  analogous to the ~17-19kB Emotion/theme baseline already inside every React figure below,
 *  except an existing React app already has Emotion loaded, whereas `lit` would be net-new. */
function measureLitRuntimeCost() {
  const litEntry = `
    import { LitElement, html, css } from 'lit';
    import { customElement, property, state, query } from 'lit/decorators.js';
    import { styleMap } from 'lit/directives/style-map.js';
    export { LitElement, html, css, customElement, property, state, query, styleMap };
  `;
  const tmpDir = resolve(REPO_ROOT, '.tmp-litsize');
  const entryPath = resolve(tmpDir, 'entry.mjs');
  const outPath = resolve(tmpDir, 'out.js');
  try {
    execFileSync('mkdir', ['-p', tmpDir]);
    writeFileSync(entryPath, litEntry);
    execFileSync(
      'node',
      [
        '-e',
        `require('esbuild').buildSync({entryPoints:['${entryPath}'],bundle:true,minify:true,format:'esm',outfile:'${outPath}'})`,
      ],
      { cwd: REPO_ROOT }
    );
    return gzipBytes(readFileSync(outPath));
  } finally {
    execFileSync('rm', ['-rf', tmpDir]);
  }
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

const { results: litAtoms, sharedHelperGzip } = measureLitAtoms();
const reactAtoms = measureReactAtoms();
const litRuntimeCost = measureLitRuntimeCost();

console.log('\n╔═════════════════════════════════════════════════════╗');
console.log('║  Lit vs. React+Emotion bundle size (gzip, per atom) ║');
console.log('╚═════════════════════════════════════════════════════╝\n');

const rows = [];
for (const name of Object.keys(COMPONENT_SNIFFERS)) {
  const lit = litAtoms[name]?.gzip;
  const react = reactAtoms[name];
  const ratio = lit && react ? (react / lit).toFixed(1) : 'n/a';
  rows.push({ name, lit, react, ratio });
  console.log(
    `  ${name.padEnd(11)} Lit: ${lit ? fmt(lit).padStart(9) : 'MISSING'.padStart(9)}   React+Emotion: ${react ? fmt(react).padStart(9) : 'n/a'.padStart(9)}   (${ratio}x)`
  );
}

console.log(`\n  Shared Lit chunk helpers (barrel + decorator metadata, paid once): ${fmt(sharedHelperGzip)}`);
console.log(`  \`lit\` runtime itself (net-new dep for a React-only consumer):        ${fmt(litRuntimeCost)}`);
console.log(
  `  React figures above already include libs/ui's shared Emotion/theme baseline (~17-19kB per\n  export) that an existing React+Emotion app has already paid once — the Lit side's equivalent\n  one-time cost is the ${fmt(litRuntimeCost)} \`lit\` runtime line above, which most React apps have NOT\n  already paid. Compare "5 atoms + shared cost" totals, not just the per-atom rows in isolation.`
);

const litTotal = Object.values(litAtoms).reduce((sum, { gzip }) => sum + gzip, 0) + sharedHelperGzip;
const reactTotal = Object.values(reactAtoms).reduce((sum, size) => sum + (size ?? 0), 0);
console.log(`\n  5-atom total, Lit (incl. shared helpers, excl. \`lit\` runtime): ${fmt(litTotal)}`);
console.log(`  5-atom total, Lit (incl. \`lit\` runtime, one-time):             ${fmt(litTotal + litRuntimeCost)}`);
console.log(`  5-atom total, React+Emotion (per-export, not de-duplicated):    ${fmt(reactTotal)}`);

if (process.argv.includes('--json')) {
  const outFile = resolve(__dirname, '../bundle-size-report.json');
  writeFileSync(
    outFile,
    JSON.stringify(
      { rows, sharedHelperGzip, litRuntimeCost, litTotal, litTotalWithRuntime: litTotal + litRuntimeCost, reactTotal },
      null,
      2
    )
  );
  console.log(`\n  JSON written → ${outFile}`);
}
