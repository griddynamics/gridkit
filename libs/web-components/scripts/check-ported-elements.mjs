#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageRoot = resolve(import.meta.dirname, '..');
const componentsRoot = resolve(packageRoot, 'src/components');
const repoRoot = resolve(packageRoot, '../..');
const fullStoryParity = new Set([
  'gd-avatar',
  'gd-box',
  'gd-badge',
  'gd-button',
  'gd-checkbox',
  'gd-image',
  'gd-icon',
  'gd-input',
  'gd-input-file',
  'gd-label',
  'gd-link',
  'gd-loader',
  'gd-separator',
  'gd-skeleton',
  'gd-slider',
  'gd-slider-dots',
  'gd-switch',
  'gd-textarea',
  'gd-toggle',
  'gd-truncate',
  'gd-wrapper',
  'gd-select',
  'gd-typography',
  'gd-counter',
  'gd-menu',
]);

// This is the deliberately supported Web Component surface. It used to live in
// `migration-ir`, which was removed along with the other one-off migration
// artifacts. Keep the inventory here so this check can continue to catch an
// accidental missing port, public export, or SSR fixture.
const ports = [
  { tag: 'gd-avatar', category: 'atoms' },
  { tag: 'gd-badge', category: 'atoms' },
  { tag: 'gd-box', category: 'atoms' },
  { tag: 'gd-button', category: 'atoms' },
  { tag: 'gd-checkbox', category: 'atoms' },
  { tag: 'gd-input', category: 'atoms' },
  { tag: 'gd-image', category: 'atoms' },
  { tag: 'gd-icon', category: 'atoms' },
  { tag: 'gd-input-file', category: 'atoms' },
  { tag: 'gd-label', category: 'atoms' },
  { tag: 'gd-link', category: 'atoms' },
  { tag: 'gd-loader', category: 'atoms' },
  { tag: 'gd-separator', category: 'atoms' },
  { tag: 'gd-skeleton', category: 'atoms' },
  { tag: 'gd-slider', category: 'atoms' },
  { tag: 'gd-slider-dots', category: 'atoms' },
  { tag: 'gd-switch', category: 'atoms' },
  { tag: 'gd-textarea', category: 'atoms' },
  { tag: 'gd-toggle', category: 'atoms' },
  { tag: 'gd-truncate', category: 'atoms' },
  { tag: 'gd-wrapper', category: 'atoms' },
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
    `Port manifest mismatch. Missing manifest: ${missingFromManifest.join(', ') || 'none'}; missing source: ${
      missingFromSource.join(', ') || 'none'
    }.`
  );
}

const [index, ssr, parityText, publishedAuditText] = await Promise.all([
  readFile(resolve(packageRoot, 'src/index.ts'), 'utf8'),
  readFile(resolve(packageRoot, 'scripts/ssr-dsd-render.ts'), 'utf8'),
  readFile(resolve(packageRoot, 'react-parity.json'), 'utf8'),
  readFile(resolve(packageRoot, 'published-atoms-audit.json'), 'utf8'),
]);
const parity = JSON.parse(parityText);
const publishedAudit = JSON.parse(publishedAuditText);
const atomTags = ports.filter(({ category }) => category === 'atoms').map(({ tag }) => tag);
const publishedAtomTags = Object.keys(publishedAudit.components);
const missingPublishedAtoms = publishedAtomTags.filter((tag) => !atomTags.includes(tag));
const unpublishedPorts = atomTags.filter((tag) => !publishedAtomTags.includes(tag));
if (missingPublishedAtoms.length || unpublishedPorts.length) {
  throw new Error(
    `Published Atoms inventory mismatch. Missing ports: ${
      missingPublishedAtoms.join(', ') || 'none'
    }; unverified ports: ${unpublishedPorts.join(', ') || 'none'}.`
  );
}
for (const { tag, category } of ports) {
  const modulePath = `./components/${category}/${tag}/${tag}`;
  if (!index.includes(modulePath)) throw new Error(`Missing public export for ${tag}: ${modulePath}`);
  if (!ssr.includes(`<${tag}`)) throw new Error(`SSR harness does not render ${tag}.`);
}

for (const { tag, category } of ports) {
  const contract = parity[tag];
  if (!contract) throw new Error(`Missing React parity contract for ${tag}.`);
  const source = await readFile(resolve(componentsRoot, category, tag, `${tag}.ts`), 'utf8');
  const storyName = tag.slice(3).replace(/(^|-)([a-z])/g, (_match, _separator, letter) => letter.toUpperCase());
  const stories = await readFile(resolve(packageRoot, 'stories', `${storyName}.stories.ts`), 'utf8');
  if (fullStoryParity.has(tag) && !stories.includes('description:'))
    throw new Error(`${tag} Storybook docs are missing component/prop descriptions.`);
  for (const needle of contract.source) {
    if (!source.includes(needle)) throw new Error(`${tag} is missing React ${contract.react} API mapping: ${needle}`);
  }
  for (const story of contract.stories) {
    if (!stories.includes(`export const ${story}`)) throw new Error(`${tag} is missing parity story: ${story}`);
  }
  if (fullStoryParity.has(tag)) {
    const reactStories = await readFile(
      resolve(repoRoot, 'libs/ui/src/components', category, contract.react, `${contract.react}.stories.tsx`),
      'utf8'
    );
    const exported = [...reactStories.matchAll(/^export const (\w+)/gm)].map((match) => match[1]);
    const missing = exported.filter((story) => !contract.stories.includes(story));
    const stale = contract.stories.filter((story) => !exported.includes(story));
    if (missing.length || stale.length) {
      throw new Error(
        `${tag} React Storybook inventory mismatch. Missing: ${missing.join(', ') || 'none'}; stale: ${
          stale.join(', ') || 'none'
        }.`
      );
    }
    if (category === 'atoms' && publishedAudit.components[tag] !== contract.stories.length) {
      throw new Error(
        `${tag} published Storybook count mismatch: expected ${publishedAudit.components[tag]}, recorded ${contract.stories.length}.`
      );
    }
  }
}

console.log(
  `Verified ${ports.length} Web Component ports and React parity contracts: ${ports.map(({ tag }) => tag).join(', ')}`
);
