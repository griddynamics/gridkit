#!/usr/bin/env node
/**
 * Phase 3: Build Lint & Leak Warnings for libs/ui
 *
 * Checks:
 *   1. Circular imports in source (DFS cycle detection)
 *   2. package.json exports field validity (path existence, types-first order)
 *   3. .d.ts completeness — every dist .js should have a .d.ts
 *   4. Private/internal export leaks (files that shouldn't be in public API)
 *   5. use client directive preservation (source vs dist)
 *   6. Calls publint for standards-compliance checks
 *
 * Usage:
 *   node libs/ui/scripts/build-lint.mjs
 *   node libs/ui/scripts/build-lint.mjs --check    # exit 1 if errors (CI)
 *   node libs/ui/scripts/build-lint.mjs --json     # write JSON report
 *   node libs/ui/scripts/build-lint.mjs --no-publint  # skip publint (faster)
 *   node libs/ui/scripts/build-lint.mjs --graph   # also write static dep-graph.svg
 *                                                 # (off by default — the HTML report
 *                                                 #  renders an interactive cytoscape
 *                                                 #  graph from madge-graph.json,
 *                                                 #  and madgeResult.image() can take
 *                                                 #  10s+ on large graphs)
 */

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, relative, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import madge from 'madge';
import { hasUseClient, getImportSources } from './_shared/ast.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const SRC_ROOT = resolve(LIB_ROOT, 'src');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const CHECK_MODE = process.argv.includes('--check');
const WRITE_JSON = process.argv.includes('--json');
const SKIP_PUBLINT = process.argv.includes('--no-publint');
const LIST_CYCLES = process.argv.includes('--list-cycles');
// Off by default: the HTML report renders the dep graph interactively from
// madge-graph.json (cytoscape). The static SVG is only useful for ad-hoc
// inspection and madgeResult.image() can take 10s+ on large graphs.
const WRITE_SVG = process.argv.includes('--graph') || process.argv.includes('--svg');

// ─── Shared helpers ───────────────────────────────────────────────────────────

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// ─── 1. Circular import detection (madge) ────────────────────────────────────

async function findCircularDepsMadge() {
  const result = await madge(resolve(SRC_ROOT, 'index.ts'), {
    fileExtensions: ['ts', 'tsx'],
    tsConfig: resolve(LIB_ROOT, 'tsconfig.lib.json'),
    detectiveOptions: { ts: { skipTypeImports: true }, tsx: { skipTypeImports: true } },
    excludeRegExp: [/\.(stories|spec|test|visual)\.(ts|tsx)$/, /\/__tests__\//, /\/__mocks__\//],
  });

  // madge returns cycles as arrays of paths relative to its baseDir (libs/ui/src).
  // Convert to absolute paths so downstream classification matches the previous shape.
  const cycles = result.circular().map((cycle) => cycle.map((p) => resolve(SRC_ROOT, p)));
  return { cycles, madge: result };
}

function isBarrelCycle(cycle) {
  return cycle.some((f) => /[/\\]index\.[jt]sx?$/.test(f) || basename(f).startsWith('index.'));
}

async function writeDepGraphSvg(madgeResult, outDir) {
  try {
    const svgPath = resolve(outDir, 'dep-graph.svg');
    mkdirSync(outDir, { recursive: true });
    await madgeResult.image(svgPath);
    return svgPath;
  } catch {
    // graphviz not installed — silently skip; dashboard handles missing svg
    return null;
  }
}

// ─── 2. package.json exports validation ──────────────────────────────────────

function checkExports(pkg, srcRoot) {
  const errors = [];
  const warnings = [];
  const exports = pkg.exports ?? {};

  for (const [exportPath, value] of Object.entries(exports)) {
    if (typeof value === 'string') continue;
    if (exportPath.includes('*')) continue;

    if (typeof value === 'object' && value !== null) {
      const keys = Object.keys(value);
      const typesIdx = keys.indexOf('types');
      const importIdx = keys.indexOf('import');
      if (typesIdx > -1 && importIdx > -1 && typesIdx > importIdx) {
        errors.push({
          path: exportPath,
          message: `"types" condition must come before "import" for TypeScript to resolve it correctly`,
        });
      }
    }

    if (typeof value === 'object' && value.import) {
      const jsPath = value.import.replace(/^\.\//, '').replace(/\.js$/, '');
      const srcCandidates = EXTENSIONS.map((ext) => resolve(srcRoot, jsPath + ext)).concat(
        EXTENSIONS.map((ext) => resolve(srcRoot, jsPath, 'index' + ext))
      );
      const srcExists = srcCandidates.some(existsSync);
      if (!srcExists && !exportPath.endsWith('.css') && !exportPath.endsWith('.txt') && !exportPath.endsWith('.json')) {
        errors.push({
          path: exportPath,
          message: `no source file found for "${value.import}" — this export will produce a missing-file error`,
        });
      }
    }
  }

  if (!pkg.files) {
    warnings.push('No "files" field — entire package contents will be published');
  }

  return { errors, warnings };
}

// ─── 3. .d.ts completeness ────────────────────────────────────────────────────

function checkDtsCompleteness(distRoot) {
  const errors = [];
  const SVG_ASSET_RE = /\/assets\/svg\//;

  function scan(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        scan(full);
      } else if (full.endsWith('.js') && !SVG_ASSET_RE.test(full)) {
        const dts = full.replace(/\.js$/, '.d.ts');
        if (!existsSync(dts)) {
          errors.push({ jsFile: relative(distRoot, full), missing: relative(distRoot, dts) });
        }
      }
    }
  }

  scan(distRoot);
  return errors;
}

// ─── 4. Private/internal export leak detection ────────────────────────────────

function checkPrivateLeak(pkg, distRoot) {
  const warnings = [];
  const PRIVATE_PATTERNS = [/_internal/, /\/internal\//, /\/private\//, /\/__/];

  for (const [exportPath] of Object.entries(pkg.exports ?? {})) {
    if (PRIVATE_PATTERNS.some((p) => p.test(exportPath))) {
      warnings.push(`Export "${exportPath}" looks like an internal path — may be accidental`);
    }
  }

  const TEST_PATTERNS = [/test-utils/, /\.stories\./, /\.spec\./, /\.test\./];
  const distJsFiles = [];
  function collectDist(dir) {
    for (const e of readdirSync(dir)) {
      const f = resolve(dir, e);
      if (statSync(f).isDirectory()) collectDist(f);
      else if (f.endsWith('.js') || f.endsWith('.d.ts')) distJsFiles.push(relative(distRoot, f));
    }
  }
  collectDist(distRoot);

  const leakedTestFiles = distJsFiles.filter((f) => TEST_PATTERNS.some((p) => p.test(f)));
  for (const f of leakedTestFiles) {
    warnings.push(`Test/story file in dist: "${f}" — should not be published`);
  }

  return warnings;
}

// ─── 5. use client directive check ───────────────────────────────────────────

function checkUseClientDirectives(distRoot) {
  const warnings = [];
  let withDirective = 0;
  let withoutDirective = 0;
  const componentRe = /\/components\//;

  function scan(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        scan(full);
      } else if (full.endsWith('.js') && componentRe.test(full)) {
        // only check entry-point files (ComponentName/ComponentName.js), not Styled/types/utils
        const fileName = entry.replace('.js', '');
        const parentDir = basename(dir);
        if (fileName !== parentDir) continue;
        const hasJsx = getImportSources(full).includes('@emotion/react/jsx-runtime');
        if (!hasJsx) continue;
        if (hasUseClient(full)) {
          withDirective++;
        } else {
          withoutDirective++;
          warnings.push(`Component file missing "use client" directive: ${relative(distRoot, full)}`);
        }
      }
    }
  }

  scan(distRoot);
  return { withDirective, withoutDirective, warnings };
}

// ─── 6. publint ───────────────────────────────────────────────────────────────

function runPublint(distRoot) {
  if (SKIP_PUBLINT) return { skipped: true };
  if (!existsSync(distRoot)) return { error: 'dist not found' };

  const result = spawnSync('npx', ['--yes', 'publint', '--pack', 'false', distRoot], {
    encoding: 'utf-8',
    cwd: LIB_ROOT,
    timeout: 60_000,
  });

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.status,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const pkg = JSON.parse(readFileSync(resolve(LIB_ROOT, 'package.json'), 'utf-8'));
const distPkg = existsSync(resolve(DIST_ROOT, 'package.json'))
  ? JSON.parse(readFileSync(resolve(DIST_ROOT, 'package.json'), 'utf-8'))
  : null;

const errors = [];
const warnings = [];

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║     gd-design-library  ·  Build Lint Check      ║');
console.log('╚══════════════════════════════════════════════════╝\n');

// ── Check 1: Circular deps (madge) ────────────────────────────────────────────

console.log('▶ 1/6  Scanning for circular imports in source (via madge)...');
const { cycles, madge: madgeResult } = await findCircularDepsMadge();
const sourceFileCount = Object.keys(madgeResult.obj() ?? {}).length;
const depGraphSvgPath = WRITE_SVG ? await writeDepGraphSvg(madgeResult, resolve(__dirname, 'output')) : null;

const KNOWN_CYCLES = [['Avatar', 'AvatarUser']];

function isKnownCycle(cycle) {
  return KNOWN_CYCLES.some((known) => known.every((name) => cycle.some((f) => f.includes(name))));
}

const knownCycles = cycles.filter(isKnownCycle);
const barrelCycles = cycles.filter((c) => !isKnownCycle(c) && isBarrelCycle(c));
const structuralCycles = cycles.filter((c) => !isKnownCycle(c) && !isBarrelCycle(c));

if (structuralCycles.length === 0) {
  console.log(`  ✓ No structural circular imports found.`);
} else {
  console.log(`\n  ✗  ${structuralCycles.length} structural circular import(s) — non-barrel files cycling directly:`);
  for (const cycle of structuralCycles) {
    const names = cycle.map((f) => relative(SRC_ROOT, f));
    console.log(`\n     Cycle: ${names.join('\n          → ')}`);
    errors.push({ type: 'circular-dep-structural', cycle: names });
  }
}

if (barrelCycles.length) {
  console.log(`  ℹ  ${barrelCycles.length} barrel-file cycle(s) — common in TS monorepos, not build-breaking`);
  if (LIST_CYCLES) {
    barrelCycles.forEach((cycle, i) => {
      const names = cycle.map((f) => relative(SRC_ROOT, f));
      console.log(`     ${(i + 1).toString().padStart(2)}. ${names.join(' → ')}`);
    });
  }
}
if (knownCycles.length) {
  console.log(`  ℹ  ${knownCycles.length} known intentional cycle(s) (Avatar ↔ AvatarUser compound component)`);
}

const cyclesAsNames = (list) => list.map((cycle) => cycle.map((f) => relative(SRC_ROOT, f)));

// ── Check 2: package.json exports ─────────────────────────────────────────────

console.log('\n▶ 2/6  Validating package.json exports...');
const exportsResult = checkExports(pkg, SRC_ROOT);

if (exportsResult.errors.length === 0 && exportsResult.warnings.length === 0) {
  console.log('  ✓ All exports entries are valid.');
} else {
  for (const err of exportsResult.errors) {
    console.log(`\n  ✗  exports["${err.path}"]: ${err.message}`);
    errors.push({ type: 'exports-error', ...err });
  }
  for (const w of exportsResult.warnings) {
    console.log(`  ⚠  ${w}`);
    warnings.push({ type: 'exports-warning', message: w });
  }
}

// ── Check 3: .d.ts completeness ───────────────────────────────────────────────

console.log('\n▶ 3/6  Checking .d.ts completeness in dist...');
if (!existsSync(DIST_ROOT)) {
  console.log('  ⚠  dist not found — skipping (run `nx build ui` first)');
  warnings.push({ type: 'dist-missing' });
} else {
  const dtsErrors = checkDtsCompleteness(DIST_ROOT);
  if (dtsErrors.length === 0) {
    console.log('  ✓ Every .js file has a corresponding .d.ts');
  } else {
    console.log(`\n  ⚠  ${dtsErrors.length} .js file(s) missing .d.ts:`);
    for (const e of dtsErrors) {
      console.log(`     ${e.jsFile}  →  missing: ${e.missing}`);
    }
    warnings.push(...dtsErrors.map((e) => ({ type: 'missing-dts', ...e })));
  }
}

// ── Check 4: Private/internal export leaks ────────────────────────────────────

console.log('\n▶ 4/6  Checking for private/internal export leaks...');
const leakWarnings = existsSync(DIST_ROOT) ? checkPrivateLeak(distPkg ?? pkg, DIST_ROOT) : [];

if (leakWarnings.length === 0) {
  console.log('  ✓ No private/internal leaks detected.');
} else {
  for (const w of leakWarnings) {
    console.log(`  ⚠  ${w}`);
    warnings.push({ type: 'private-leak', message: w });
  }
}

// ── Check 5: use client directives ────────────────────────────────────────────

console.log('\n▶ 5/6  Checking "use client" directive consistency...');
if (!existsSync(DIST_ROOT)) {
  console.log('  ⚠  dist not found — skipping');
} else {
  const { withDirective, withoutDirective, warnings: ucWarnings } = checkUseClientDirectives(DIST_ROOT);
  if (withoutDirective === 0) {
    console.log(`  ✓ All ${withDirective} JSX component files have "use client" directive.`);
  } else {
    console.log(`  ⚠  ${withoutDirective} JSX component file(s) missing "use client":`);
    ucWarnings.slice(0, 5).forEach((w) => console.log(`     ${w}`));
    if (ucWarnings.length > 5) console.log(`     … and ${ucWarnings.length - 5} more`);
    warnings.push(...ucWarnings.map((m) => ({ type: 'missing-use-client', message: m })));
  }
}

// ── Check 6: publint ──────────────────────────────────────────────────────────

console.log('\n▶ 6/6  Running publint standards check...');
if (SKIP_PUBLINT) {
  console.log('  (skipped via --no-publint)');
} else if (!existsSync(DIST_ROOT)) {
  console.log('  ⚠  dist not found — skipping');
} else {
  const pl = runPublint(DIST_ROOT);
  if (pl.skipped || pl.error) {
    console.log(`  ⚠  ${pl.error ?? 'skipped'}`);
  } else {
    const output = (pl.stdout ?? '').trim();
    const lines = output.split('\n');
    const isPackNoise = (l) => l.includes('not published') || l.includes('pkg.files');
    const relevant = lines.filter(
      (l) => l.trim() && !l.startsWith('Running') && !l.startsWith('Packing') && !l.includes('Linting')
    );
    const actionable = relevant.filter((l) => !isPackNoise(l));
    actionable.forEach((l) => console.log(`  ⚠ ${l.trim()}`));
    if (relevant.length !== actionable.length) {
      const suppressed = relevant.length - actionable.length;
      console.log(
        `  ℹ ${suppressed} "not published" publint noise suppressed (no pkg.files field — run from dist/ gives false positives)`
      );
    }
    const realErrors = actionable.filter((l) => /^\d+\./.test(l.trim()));
    if (pl.exitCode !== 0 && realErrors.length > 0) {
      errors.push({ type: 'publint', exitCode: pl.exitCode, issues: realErrors });
    }
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Source files scanned : ${sourceFileCount}`);
console.log(
  `  Circular cycles      : ${cycles.length} total  (${knownCycles.length} known, ${barrelCycles.length} barrel, ${structuralCycles.length} structural)`
);
console.log(`  Errors               : ${errors.length}`);
console.log(`  Warnings             : ${warnings.length}`);

// ─── JSON output ──────────────────────────────────────────────────────────────

if (WRITE_JSON) {
  const outDir = resolve(__dirname, 'output');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, 'build-lint-report.json'),
    JSON.stringify(
      {
        sourceFiles: sourceFileCount,
        circularDeps: {
          total: cycles.length,
          known: knownCycles.length,
          barrel: barrelCycles.length,
          structural: structuralCycles.length,
          barrelList: cyclesAsNames(barrelCycles),
          structuralList: cyclesAsNames(structuralCycles),
        },
        errors,
        warnings,
      },
      null,
      2
    )
  );
  console.log(`\n  JSON written → scripts/output/build-lint-report.json`);

  writeFileSync(
    resolve(outDir, 'madge-graph.json'),
    JSON.stringify(
      {
        graph: madgeResult.obj() ?? {},
        structuralCycles: cyclesAsNames(structuralCycles),
        barrelCycles: cyclesAsNames(barrelCycles),
        knownCycles: cyclesAsNames(knownCycles),
      },
      null,
      2
    )
  );
}

const hasErrors = errors.length > 0;
console.log(
  '\n' +
    (hasErrors
      ? '✗ Build lint completed with errors.'
      : warnings.length
        ? '⚠ Build lint completed with warnings.'
        : '✓ Build lint passed.') +
    '\n'
);

if (CHECK_MODE && hasErrors) process.exit(1);
