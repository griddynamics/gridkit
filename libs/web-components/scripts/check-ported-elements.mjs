#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageRoot = resolve(import.meta.dirname, '..');
const componentsRoot = resolve(packageRoot, 'src/components');

// This is the deliberately supported Web Component surface. It used to live in
// `migration-ir`, which was removed along with the other one-off migration
// artifacts. Keep the inventory here so this check can continue to catch an
// accidental missing port, public export, or SSR fixture.
const ports = [
  { tag: 'gd-avatar', category: 'atoms' },
  { tag: 'gd-button', category: 'atoms' },
  { tag: 'gd-checkbox', category: 'atoms' },
  { tag: 'gd-input', category: 'atoms' },
  { tag: 'gd-select', category: 'atoms' },
  { tag: 'gd-typography', category: 'atoms' },
  { tag: 'gd-counter', category: 'molecules' },
  { tag: 'gd-menu', category: 'molecules' },
];

const discovered = [];
for (const category of ['atoms', 'molecules']) {
  for (const entry of await readdir(resolve(componentsRoot, category), { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith('gd-')) discovered.push({ tag: entry.name, category });
  }
}

const expected = new Set(ports.map(({ tag, category }) => `${category}/${tag}`));
const actual = new Set(discovered.map(({ tag, category }) => `${category}/${tag}`));
const missingFromManifest = [...actual].filter((entry) => !expected.has(entry));
const missingFromSource = [...expected].filter((entry) => !actual.has(entry));
if (missingFromManifest.length || missingFromSource.length) {
  throw new Error(
    `Port manifest mismatch. Missing manifest: ${missingFromManifest.join(', ') || 'none'}; missing source: ${missingFromSource.join(', ') || 'none'}.`
  );
}

const [index, ssr] = await Promise.all([
  readFile(resolve(packageRoot, 'src/index.ts'), 'utf8'),
  readFile(resolve(packageRoot, 'scripts/ssr-dsd-render.ts'), 'utf8'),
]);
for (const { tag, category } of ports) {
  const modulePath = `./components/${category}/${tag}/${tag}`;
  if (!index.includes(modulePath)) throw new Error(`Missing public export for ${tag}: ${modulePath}`);
  if (!ssr.includes(`<${tag}`)) throw new Error(`SSR harness does not render ${tag}.`);
}

console.log(`Verified ${ports.length} Web Component ports: ${ports.map(({ tag }) => tag).join(', ')}`);
