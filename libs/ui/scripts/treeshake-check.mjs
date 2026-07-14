#!/usr/bin/env node
/**
 * Phase 2: Tree-Shaking Check for libs/ui
 *
 * Checks:
 *   1. Count .js files in dist/libs/ui/
 *   2. sideEffects field validity (array of CSS/SCSS patterns only)
 *   3. Build format inspection (hasCjs, hasMjs, pkgType)
 *   4. Per-component transitive import graph probes (KB footprint,
 *      cross-component deps). The probe set is the union of:
 *        - CURATED_PROBES — fixed list including non-component entries
 *          (hooks/, tokens/). Missing entries here are violations.
 *        - Auto-discovered components/<*>/<*>/<*>.js files where the basename
 *          matches the parent directory (the standard entry-point convention).
 *   5. Violations: missing CJS, sideEffects issues, missing curated probes
 *
 * Usage:
 *   node libs/ui/scripts/treeshake-check.mjs             # console report
 *   node libs/ui/scripts/treeshake-check.mjs --json      # write JSON to scripts/output/
 *   node libs/ui/scripts/treeshake-check.mjs --check     # exit 1 if violations found (CI)
 *   node libs/ui/scripts/treeshake-check.mjs --verbose   # show per-file breakdown
 */

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_DIR = resolve(__dirname, '../../../dist/libs/ui');
const OUTPUT_DIR = resolve(__dirname, 'output');

const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');
const VERBOSE = process.argv.includes('--verbose');

// Curated probes — kept so a renamed/removed core entry surfaces as a
// `missing-probe-entry` violation. Non-component entries (hooks/, tokens/)
// also live here since auto-discovery only walks components/.
const CURATED_PROBES = [
  'components/atoms/Button/Button.js',
  'components/atoms/Input/Input.js',
  'components/atoms/Badge/Badge.js',
  'components/atoms/Typography/Typography.js',
  'components/atoms/Loader/Loader.js',
  'components/atoms/Icon/Icon.js',
  'components/molecules/Dropdown/Dropdown.js',
  'components/molecules/Accordion/Accordion.js',
  'components/molecules/Tooltip/Tooltip.js',
  'components/organisms/Modal/Modal.js',
  'components/organisms/Chart/Chart.js',
  'hooks/useTheme/useTheme.js',
  'tokens/index.js',
];

// Walk dist/components/** and return every entry-point .js file (one whose
// basename matches its parent directory — the same heuristic build-lint uses
// to find the "main" component file vs Styled/types/utils siblings).
function discoverComponentProbes(distRoot) {
  const componentsRoot = resolve(distRoot, 'components');
  if (!existsSync(componentsRoot)) return [];
  const found = [];
  for (const f of walkDir(componentsRoot)) {
    if (!f.endsWith('.js')) continue;
    const parent = basename(dirname(f));
    const file = basename(f, '.js');
    if (parent === file) {
      found.push(relative(distRoot, f));
    }
  }
  return found.sort();
}

// File helpers
function walkDir(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) walkDir(full, results);
    else results.push(full);
  }
  return results;
}

function fileSizeKB(p) {
  try {
    return statSync(p).size / 1024;
  } catch {
    return 0;
  }
}

// Parse all relative import specifiers from a dist .js file
function parseRelativeImports(filePath) {
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    return [];
  }
  const results = [];
  const dir = dirname(filePath);
  const re = /(?:import|export)\s[^'"]*from\s+['"](\.[^'"]+)['"]|import\(\s*['"](\.[^'"]+)['"]\s*\)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const spec = m[1] ?? m[2];
    if (!spec) continue;
    const candidates = [resolve(dir, spec), resolve(dir, spec + '.js'), resolve(dir, spec, 'index.js')];
    for (const c of candidates) {
      if (existsSync(c) && c.endsWith('.js')) {
        results.push(c);
        break;
      }
    }
  }
  return results;
}

// Full transitive closure of .js imports starting from startFile
function traceImports(startFile) {
  const visited = new Set();
  const queue = [startFile];
  while (queue.length) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    if (!existsSync(current)) continue;
    for (const dep of parseRelativeImports(current)) {
      if (!visited.has(dep)) queue.push(dep);
    }
  }
  return visited;
}

// Returns e.g. "components/atoms/Button" for a file inside that directory,
// or null for non-component files
function componentDirOf(filePath) {
  const rel = relative(DIST_DIR, filePath);
  const parts = rel.split('/');
  if (parts[0] === 'components' && parts.length >= 3) {
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }
  return null;
}

// Probe one predefined entry point
function runProbe(probeRelPath) {
  const absPath = resolve(DIST_DIR, probeRelPath);
  const exists = existsSync(absPath);
  if (!exists) return { probe: probeRelPath, exists: false };

  const transitive = traceImports(absPath);
  const files = [...transitive];

  const totalFiles = files.length;
  const totalKB = Math.round(files.reduce((sum, f) => sum + fileSizeKB(f), 0) * 10) / 10;
  const internalFiles = totalFiles;
  const componentFiles = files.filter((f) => relative(DIST_DIR, f).startsWith('components/')).length;
  const utilFiles = totalFiles - componentFiles;

  const probeDir = componentDirOf(absPath);
  const crossSet = new Set();
  for (const f of files) {
    const dir = componentDirOf(f);
    if (dir && dir !== probeDir) crossSet.add(dir);
  }
  const crossComponentDeps = [...crossSet].sort();

  if (VERBOSE && crossComponentDeps.length > 0) {
    console.log(`     [${probeRelPath}] cross-component deps:`);
    crossComponentDeps.forEach((d) => console.log(`       + ${d}`));
  }

  return {
    probe: probeRelPath,
    exists: true,
    totalFiles,
    totalKB,
    internalFiles,
    utilFiles,
    componentFiles,
    crossComponentDeps,
  };
}

// Main
console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  Tree-Shaking Check     ║');
console.log('╚══════════════════════════════════════════════════╝\n');

console.log('▶ 1/4  Counting dist output files...');

if (!existsSync(DIST_DIR)) {
  console.log('  ✗ dist not found — run `nx build ui` first.\n');
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'treeshake-report.json'),
      JSON.stringify(
        {
          distFiles: 0,
          sideEffects: null,
          buildFormats: null,
          probes: [],
          violations: [{ type: 'dist-missing', message: 'dist/libs/ui not found — run nx build ui first' }],
        },
        null,
        2
      )
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

const allDistFiles = walkDir(DIST_DIR);
const jsFiles = allDistFiles.filter((f) => f.endsWith('.js'));
const cjsFiles = allDistFiles.filter((f) => f.endsWith('.cjs'));
const mjsFiles = allDistFiles.filter((f) => f.endsWith('.mjs'));
const distFiles = jsFiles.length;

console.log(`  Total files in dist : ${allDistFiles.length}`);
console.log(`  .js  (ESM)          : ${jsFiles.length}`);
console.log(`  .cjs (CJS)          : ${cjsFiles.length}`);
console.log(`  .mjs                : ${mjsFiles.length}`);

// 2. sideEffects
console.log('\n▶ 2/4  Checking sideEffects field...');
const pkg = JSON.parse(readFileSync(resolve(LIB_ROOT, 'package.json'), 'utf-8'));
const sideEffectsRaw = pkg.sideEffects;
let sideEffectsStatus, sideEffectsCssOnly;
const sideEffectsIssues = [];

if (sideEffectsRaw === false) {
  sideEffectsStatus = 'false (all files are side-effect-free)';
  sideEffectsCssOnly = true;
  console.log('  ✓ sideEffects: false — all files treated as pure');
} else if (Array.isArray(sideEffectsRaw)) {
  const nonCss = sideEffectsRaw.filter((p) => !/\*\*\/\*\.(css|scss)$/.test(p));
  sideEffectsCssOnly = nonCss.length === 0;
  sideEffectsStatus = `array (${sideEffectsRaw.join(', ')})`;
  if (sideEffectsCssOnly) {
    console.log(`  ✓ sideEffects is CSS/SCSS-only array — correct for a component library`);
  } else {
    console.log(`  ⚠  sideEffects has ${nonCss.length} non-CSS/SCSS pattern(s):`);
    nonCss.forEach((p) => {
      console.log(`     - ${p}`);
      sideEffectsIssues.push({ pattern: p, message: `Non-CSS/SCSS sideEffects pattern "${p}" may block tree-shaking` });
    });
  }
} else if (sideEffectsRaw === true) {
  sideEffectsStatus = 'true (all files have side effects — disables tree-shaking)';
  sideEffectsCssOnly = false;
  sideEffectsIssues.push({ pattern: 'true', message: 'sideEffects: true disables all tree-shaking for consumers' });
  console.log('  ✗ sideEffects: true — disables all tree-shaking');
} else {
  sideEffectsStatus = 'missing';
  sideEffectsCssOnly = false;
  sideEffectsIssues.push({ message: 'No sideEffects field — bundlers assume every file has side effects' });
  console.log('  ⚠  No sideEffects field in package.json');
}

// 3. Build formats
console.log('\n▶ 3/4  Checking build formats...');
const viteConfig = existsSync(resolve(LIB_ROOT, 'vite.config.ts'))
  ? readFileSync(resolve(LIB_ROOT, 'vite.config.ts'), 'utf-8')
  : '';
const viteHasCjsFormat = /format\s*:\s*['"]cjs['"]/.test(viteConfig);
const hasCjs = cjsFiles.length > 0;
const hasMjs = mjsFiles.length > 0;
const pkgType = pkg.type ?? 'commonjs';

console.log(`  package.json "type" : "${pkgType}"`);
console.log(`  CJS output (.cjs)   : ${hasCjs ? `✓ ${cjsFiles.length} files` : '✗ none'}`);
console.log(`  MJS output (.mjs)   : ${hasMjs ? `✓ ${mjsFiles.length} files` : '– none'}`);
console.log(`  ESM output (.js)    : ✓ ${jsFiles.length} files`);

// 4. Probe component entry points — curated list + auto-discovered
const autoDiscovered = discoverComponentProbes(DIST_DIR);
const probeSet = new Set([...CURATED_PROBES, ...autoDiscovered]);
const PROBES = [...probeSet].sort();
const curatedSet = new Set(CURATED_PROBES);

console.log(
  `\n▶ 4/4  Probing component entry points (transitive import graph) · ${PROBES.length} probes (${CURATED_PROBES.length} curated + ${autoDiscovered.length} auto)...`
);
const probeResults = [];
for (const probe of PROBES) {
  const result = runProbe(probe);
  result.curated = curatedSet.has(probe);
  probeResults.push(result);
  if (!result.exists) {
    console.log(`  ✗ NOT FOUND  ${probe}`);
  } else {
    const crossStr =
      result.crossComponentDeps.length > 0
        ? `  cross: [${result.crossComponentDeps.map((d) => d.split('/').pop()).join(', ')}]`
        : '';
    console.log(
      `  ✓ ${probe.padEnd(50)} ${String(result.totalFiles).padStart(4)} files  ${String(result.totalKB).padStart(
        7
      )} KB${crossStr}`
    );
  }
}

// Violations
const violations = [];
if (viteHasCjsFormat && !hasCjs) {
  violations.push({
    type: 'missing-cjs',
    message: 'vite.config.ts has CJS format in rollupOptions.output but no .cjs files found in dist',
  });
}
for (const issue of sideEffectsIssues) {
  violations.push({ type: 'sideEffects-issue', message: issue.message });
}
const missingProbes = probeResults.filter((p) => !p.exists && p.curated);
if (missingProbes.length > 0) {
  violations.push({
    type: 'missing-probe-entry',
    message: `${missingProbes.length} curated probe entry point(s) missing: ${missingProbes.map((p) => p.probe).join(', ')}`,
  });
}

// Summary
console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Dist .js files     : ${distFiles}`);
console.log(`  CJS files          : ${cjsFiles.length}`);
console.log(
  `  Probes found       : ${probeResults.filter((p) => p.exists).length} / ${PROBES.length}  (${CURATED_PROBES.length} curated + ${autoDiscovered.length} auto)`
);
console.log(`  Violations         : ${violations.length}`);
if (violations.length > 0) {
  console.log('\n  Violations:');
  violations.forEach((v, i) => console.log(`    ${i + 1}. [${v.type}] ${v.message}`));
}

// JSON output
if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUTPUT_DIR, 'treeshake-report.json'),
    JSON.stringify(
      {
        distFiles,
        sideEffects: { status: sideEffectsStatus, cssOnly: sideEffectsCssOnly, issues: sideEffectsIssues },
        buildFormats: { pkgType, hasCjs, hasMjs, jsFiles: jsFiles.length },
        probes: probeResults,
        violations,
      },
      null,
      2
    )
  );
  console.log(`\n  JSON written → scripts/output/treeshake-report.json`);
}

const hasViolations = violations.length > 0;
console.log(
  '\n' + (hasViolations ? '✗ Tree-shaking check completed with violations.' : '✓ Tree-shaking check passed.') + '\n'
);
if (CHECK_MODE && hasViolations) process.exit(1);
