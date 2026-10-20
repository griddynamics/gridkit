#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageRoot = resolve(import.meta.dirname, '..');
const componentsRoot = resolve(packageRoot, 'src/components');
const repoRoot = resolve(packageRoot, '../..');
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
  { tag: 'gd-column', category: 'layout' },
  { tag: 'gd-chat-container', category: 'layout' },
  { tag: 'gd-flex-container', category: 'layout' },
  { tag: 'gd-portal', category: 'layout' },
  { tag: 'gd-row', category: 'layout' },
  { tag: 'gd-scroll', category: 'layout' },
];

const discovered = [];
for (const category of ['atoms', 'molecules', 'layout']) {
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
const storyFiles = (await readdir(resolve(packageRoot, 'stories'))).filter((file) => file.endsWith('.stories.ts'));
for (const file of storyFiles) {
  const source = await readFile(resolve(packageRoot, 'stories', file), 'utf8');
  if (/\bReact(?:Node)?\b|\bmigrat(?:e|ed|es|ing|ion|ions)\b/i.test(source)) {
    throw new Error(`${file} must describe Web Components without React or migration language.`);
  }
}
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
  if (/\bisLoading\b/.test(source) && !source.includes('<gd-loader')) {
    throw new Error(`${tag} implements a loading state without composing the shared <gd-loader>.`);
  }
  if (tag === 'gd-image' && !source.includes('<gd-skeleton')) {
    throw new Error('gd-image must compose the shared <gd-skeleton> for its loading placeholder.');
  }
  if (tag !== 'gd-loader' && /@keyframes\s+[\w-]*(?:spin|loader)/i.test(source)) {
    throw new Error(`${tag} owns loading keyframes instead of composing the shared <gd-loader>.`);
  }
  const storyName = tag.slice(3).replace(/(^|-)([a-z])/g, (_match, _separator, letter) => letter.toUpperCase());
  const stories = await readFile(resolve(packageRoot, 'stories', `${storyName}.stories.ts`), 'utf8');
  if (!stories.includes('description:'))
    throw new Error(`${tag} Storybook docs are missing component/prop descriptions.`);
  for (const needle of contract.source) {
    if (!source.includes(needle)) throw new Error(`${tag} is missing React ${contract.react} API mapping: ${needle}`);
  }
  for (const story of contract.stories) {
    if (!stories.includes(`export const ${story}`)) throw new Error(`${tag} is missing parity story: ${story}`);
  }
  const reactStories = await readFile(
    resolve(repoRoot, 'libs/ui/src/components', category, contract.react, `${contract.react}.stories.tsx`),
    'utf8'
  );
  const reactTitle = reactStories.match(/title:\s*['\"]([^'\"]+)['\"]/)?.[1];
  const webComponentTitle = stories.match(/title:\s*['\"]([^'\"]+)['\"]/)?.[1];
  if (reactTitle !== webComponentTitle) {
    throw new Error(`${tag} Storybook title mismatch: React=${reactTitle}; Web Components=${webComponentTitle}.`);
  }
  const reactExports = [...reactStories.matchAll(/^export const (\w+)/gm)].map((match) => match[1]);
  const webComponentExports = [...stories.matchAll(/^export const (\w+)/gm)].map((match) => match[1]);
  const missingContractStories = reactExports.filter((story) => !contract.stories.includes(story));
  const staleContractStories = contract.stories.filter((story) => !reactExports.includes(story));
  const missingWebComponentStories = reactExports.filter((story) => !webComponentExports.includes(story));
  const extraWebComponentStories = webComponentExports.filter((story) => !reactExports.includes(story));
  if (
    missingContractStories.length ||
    staleContractStories.length ||
    missingWebComponentStories.length ||
    extraWebComponentStories.length
  ) {
    throw new Error(
      `${tag} Storybook inventory mismatch. Contract missing: ${missingContractStories.join(', ') || 'none'}; ` +
        `contract stale: ${staleContractStories.join(', ') || 'none'}; Web Components missing: ${
          missingWebComponentStories.join(', ') || 'none'
        }; Web Components extra: ${extraWebComponentStories.join(', ') || 'none'}.`
    );
  }
  if (category === 'atoms' && publishedAudit.components[tag] !== contract.stories.length) {
    throw new Error(
      `${tag} published Storybook count mismatch: expected ${publishedAudit.components[tag]}, recorded ${contract.stories.length}.`
    );
  }
}

console.log(
  `Verified ${ports.length} Web Component ports and React parity contracts: ${ports.map(({ tag }) => tag).join(', ')}`
);
