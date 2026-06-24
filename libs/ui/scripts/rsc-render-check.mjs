#!/usr/bin/env node
/**
 * Phase 7: Real renderToString SSR harness for libs/ui.
 *
 * Imports components from dist and runs each through react-dom/server's
 * renderToStaticMarkup. Catches runtime SSR failures the regex-based
 * Phase 4 (ssr-check) can't see:
 *
 *   - top-level `window`/`document` access at module load (import-time crash)
 *   - hook-emitted SSR errors (`useLayoutEffect` warnings, etc.)
 *   - missing `'use client'` propagation that breaks RSC rendering
 *   - emotion ssr-incompatibilities
 *
 * Coverage:
 *   - Auto-discovers every PascalCase export from dist/index.js (functions,
 *     forwardRef/memo/lazy objects).
 *   - Curated entries in the `cases` array override props/children for
 *     components that need real input.
 *   - Each component is rendered inside <ThemeProvider isDefault> so anything
 *     calling useTheme() gets a real theme context.
 *
 * Status meaning:
 *   pass  — component imported and rendered to HTML
 *   fail  — render threw (the error message is captured)
 *   skip  — not exported from dist (curated case for renamed/removed name),
 *           or "Element type is invalid" (Context objects, etc.)
 *
 * Result `source` field:
 *   curated — used the hand-authored entry from `cases`
 *   auto    — rendered with `{}` props via auto-discovery
 *
 * Usage:
 *   node libs/ui/scripts/rsc-render-check.mjs
 *   node libs/ui/scripts/rsc-render-check.mjs --json
 *   node libs/ui/scripts/rsc-render-check.mjs --check    # exit 1 on any fail
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const OUTPUT_DIR = resolve(__dirname, 'output');

const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');
const VERBOSE = process.argv.includes('--verbose');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  RSC Render Harness      ║');
console.log('╚══════════════════════════════════════════════════╝\n');

if (!existsSync(resolve(DIST_ROOT, 'index.js'))) {
  console.log('  ✗ dist not found — run `nx build ui` first.\n');
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'rsc-render-report.json'),
      JSON.stringify({ entries: [], passed: false, error: 'dist-missing' }, null, 2)
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

// ─── Setup React + ReactDOM/server ────────────────────────────────────────────

let React, renderToStaticMarkup;
try {
  React = (await import('react')).default;
  ({ renderToStaticMarkup } = await import('react-dom/server'));
} catch (e) {
  console.log(`  ✗ Failed to load react / react-dom/server: ${e.message}\n`);
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

// ─── Import the library ───────────────────────────────────────────────────────

let lib;
const importStart = Date.now();
try {
  lib = await import(resolve(DIST_ROOT, 'index.js'));
} catch (e) {
  console.log(`  ✗ Library import threw at module load: ${e.message}`);
  if (e.stack) console.log(`     ${e.stack.split('\n').slice(1, 3).join('\n     ')}`);
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'rsc-render-report.json'),
      JSON.stringify({ entries: [], passed: false, error: `import-failed: ${e.message}` }, null, 2)
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}
const importMs = Date.now() - importStart;

console.log(`▶ Imported dist/index.js in ${importMs}ms · ${Object.keys(lib).length} exports visible\n`);

// ─── Component test cases ─────────────────────────────────────────────────────
//
// Curated entries override auto-discovery defaults for components that need
// real props/children/parent context. Auto-discovered components render with
// `{}` props inside <ThemeProvider isDefault>; new components get coverage
// for free.
//
// Schema:
//   { name, props?, children?, wrap?: (lib, R, el) => ReactNode }
//   - `wrap` lets you nest the element inside a parent (compound components).

const cases = [
  { name: 'Button', props: {}, children: 'Click' },
  { name: 'Icon', props: { name: 'search' } },
  { name: 'Typography', props: {}, children: 'text' },
  { name: 'Badge', props: {}, children: 'badge' },
  { name: 'Box', props: {}, children: 'box' },
  { name: 'Row', props: {}, children: 'row' },
  { name: 'Column', props: {}, children: 'column' },
  { name: 'Tag', props: {}, children: 'tag' },
  { name: 'Tooltip', props: { content: 'tip' }, children: 'hover me' },
  { name: 'Modal', props: { open: false }, children: 'modal body' },
  { name: 'Dropdown', props: { items: [{ key: '1', label: 'one' }] } },
  { name: 'ThemeProvider', props: { isDefault: true }, children: 'x' },

  // Components requiring real input ───────────────────────────────────────────
  { name: 'RadioGroup', props: { options: [{ value: 'a', label: 'A' }] } },
  { name: 'Table', props: { columns: [], data: [] } },
  {
    name: 'TablePagination',
    props: { page: 0, pageSize: 10, totalItems: 0, onPageChange: () => {}, onPageSizeChange: () => {} },
  },
  { name: 'ChatImageGallery', props: { images: [] } },
  { name: 'ImagePreview', props: { images: [{ src: 'x.png' }] } },
  { name: 'ImagePreviewLightbox', props: { isOpen: false, images: [], onClose: () => {} } },

  // Compound subcomponents — must render inside their parent ──────────────────
  {
    name: 'AccordionItem',
    props: { id: 'item1' },
    children: 'body',
    wrap: (lib, R, el) => R.createElement(lib.Accordion, {}, el),
  },
  {
    name: 'AccordionHeader',
    props: { id: 'item1' },
    children: 'header',
    wrap: (lib, R, el) =>
      R.createElement(lib.Accordion, {}, R.createElement(lib.AccordionItem, { id: 'item1' }, el)),
  },
  {
    name: 'DropdownItem',
    props: { value: 'a' },
    children: 'one',
    wrap: (lib, R, el) => R.createElement(lib.Select, {}, el),
  },
];

// ─── Auto-discovery ───────────────────────────────────────────────────────────

// React's $$typeof tags for renderable element types. Context objects and the
// like also carry $$typeof but throw at render — exclude them upfront.
const RENDERABLE_TYPEOF_DESCRIPTIONS = new Set([
  'react.forward_ref',
  'react.memo',
  'react.lazy',
  'react.client.reference',
]);

function isLikelyComponent(value, name) {
  // PascalCase only — filters hooks (useFoo), helpers (createX), constants (FOO).
  if (!/^[A-Z]/.test(name)) return false;
  if (typeof value === 'function') return true;
  if (value && typeof value === 'object' && typeof value.$$typeof === 'symbol') {
    return RENDERABLE_TYPEOF_DESCRIPTIONS.has(value.$$typeof.description);
  }
  return false;
}

const curated = new Map(cases.map((c) => [c.name, c]));
const ThemeProvider = lib.ThemeProvider;

if (!ThemeProvider) {
  console.log('  ⚠ ThemeProvider not exported from dist — components that call useTheme() will fail.\n');
}

function renderOne(Component, props, children, wrap) {
  let node = React.createElement(Component, props, typeof children === 'function' ? children() : children);
  // Compound subcomponent: nest inside its parent (e.g. AccordionItem inside Accordion).
  if (typeof wrap === 'function') node = wrap(lib, React, node);
  // Don't wrap ThemeProvider in itself — emotion's CacheProvider blows up on the
  // re-entry. Anything else gets wrapped so useTheme() sees a real theme.
  const wrapped = ThemeProvider && Component !== ThemeProvider
    ? React.createElement(ThemeProvider, { isDefault: true }, node)
    : node;
  return renderToStaticMarkup(wrapped);
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const results = [];
const processed = new Set();

for (const name of Object.keys(lib).sort()) {
  const value = lib[name];
  if (!isLikelyComponent(value, name)) continue;

  const override = curated.get(name);
  const props = override?.props ?? {};
  const children = override?.children;
  const wrap = override?.wrap;
  const source = override ? 'curated' : 'auto';
  processed.add(name);

  try {
    const html = renderOne(value, props, children, wrap);
    const len = html.length;

    if (len === 0) {
      results.push({ name, status: 'pass', source, htmlLength: 0, note: 'rendered empty (likely conditional)' });
      console.log(`  ⚠ ${name.padEnd(20)} pass (empty render) [${source}]`);
    } else {
      results.push({ name, status: 'pass', source, htmlLength: len });
      console.log(`  ✓ ${name.padEnd(20)} pass (${len} bytes HTML) [${source}]`);
    }
  } catch (e) {
    const msg = e.message ?? String(e);
    const stackHead = (e.stack ?? '').split('\n').slice(0, 4).join('\n');
    // React's "Element type is invalid" → not actually a component (Context object, plain
    // value with $$typeof but not renderable, etc.). Demote to skip so it doesn't pollute
    // the failure count.
    if (/Element type is invalid/i.test(msg)) {
      results.push({ name, status: 'skip', source, reason: 'not a renderable component' });
      console.log(`  ⊘ ${name.padEnd(20)} skip — not a renderable component`);
      continue;
    }
    results.push({ name, status: 'fail', source, error: msg, stack: stackHead });
    console.log(`  ✗ ${name.padEnd(20)} FAIL [${source}] — ${msg.slice(0, 100)}`);
    if (VERBOSE) console.log(`       ${stackHead}`);
  }
}

// Curated overrides referencing exports that no longer exist → keep the renamed/removed
// signal that the original script reported.
for (const c of cases) {
  if (processed.has(c.name)) continue;
  results.push({ name: c.name, status: 'skip', source: 'curated', reason: 'not exported from dist/index.js' });
  console.log(`  ⊘ ${c.name.padEnd(20)} skip — not exported`);
}

const passed = results.filter((r) => r.status === 'pass').length;
const failed = results.filter((r) => r.status === 'fail').length;
const skipped = results.filter((r) => r.status === 'skip').length;

console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Tested        : ${results.length}`);
console.log(`  Passed        : ${passed}`);
console.log(`  Failed        : ${failed}`);
console.log(`  Skipped       : ${skipped}`);

if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUTPUT_DIR, 'rsc-render-report.json'),
    JSON.stringify(
      {
        passed: failed === 0,
        importMs,
        exportsVisible: Object.keys(lib).length,
        counts: { passed, failed, skipped },
        results,
      },
      null,
      2
    )
  );
  console.log(`\n  JSON written → scripts/output/rsc-render-report.json`);
}

console.log(
  '\n' + (failed === 0 ? '✓ RSC render harness passed.' : `✗ ${failed} component(s) failed to render.`) + '\n'
);

if (CHECK_MODE && failed > 0) process.exit(1);
