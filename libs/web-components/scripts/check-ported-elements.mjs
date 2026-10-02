#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

const packageRoot = resolve(import.meta.dirname, '..');
const componentsRoot = resolve(packageRoot, 'src/components');
const repoRoot = resolve(packageRoot, '../..');

const propertyName = (node) =>
  ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node) ? node.text : undefined;
const unwrapExpression = (node) => (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) ? node.expression : node);

function objectProperty(object, name) {
  return object?.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name
  )?.initializer;
}

function findObject(sourceFile, name) {
  let result;
  const visit = (node) => {
    if (
      !result &&
      ts.isVariableDeclaration(node) &&
      propertyName(node.name) === name &&
      ts.isObjectLiteralExpression(unwrapExpression(node.initializer))
    )
      result = unwrapExpression(node.initializer);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return result;
}

function storyArgTypes(source, fileName) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  let result;
  const visit = (node) => {
    if (!result && ts.isPropertyAssignment(node) && propertyName(node.name) === 'argTypes') {
      if (ts.isObjectLiteralExpression(node.initializer)) result = node.initializer;
      if (
        ts.isCallExpression(node.initializer) &&
        node.initializer.arguments[1] &&
        ts.isObjectLiteralExpression(node.initializer.arguments[1])
      )
        result = node.initializer.arguments[1];
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return new Map(
    (result?.properties ?? []).filter(ts.isPropertyAssignment).map((property) => {
      const table = ts.isObjectLiteralExpression(property.initializer)
        ? objectProperty(property.initializer, 'table')
        : undefined;
      const category = table && ts.isObjectLiteralExpression(table) ? objectProperty(table, 'category') : undefined;
      const subcategory =
        table && ts.isObjectLiteralExpression(table) ? objectProperty(table, 'subcategory') : undefined;
      return [
        propertyName(property.name),
        {
          category: category && ts.isStringLiteral(category) ? category.text : undefined,
          subcategory: subcategory && ts.isStringLiteral(subcategory) ? subcategory.text : undefined,
        },
      ];
    })
  );
}

function sectionMap(source) {
  const sourceFile = ts.createSourceFile('helpers.ts', source, ts.ScriptTarget.Latest, true);
  const sections = findObject(sourceFile, 'reactArgTypeSections');
  return new Map(
    (sections?.properties ?? []).filter(ts.isPropertyAssignment).map((component) => {
      const controls = ts.isObjectLiteralExpression(component.initializer) ? component.initializer.properties : [];
      return [
        propertyName(component.name),
        new Map(
          controls
            .filter(ts.isPropertyAssignment)
            .map((control) => [
              propertyName(control.name),
              ts.isStringLiteral(control.initializer) ? control.initializer.text : undefined,
            ])
        ),
      ];
    })
  );
}
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

const [index, ssr, parityText, publishedAuditText, storyHelpers] = await Promise.all([
  readFile(resolve(packageRoot, 'src/index.ts'), 'utf8'),
  readFile(resolve(packageRoot, 'scripts/ssr-dsd-render.ts'), 'utf8'),
  readFile(resolve(packageRoot, 'react-parity.json'), 'utf8'),
  readFile(resolve(packageRoot, 'published-atoms-audit.json'), 'utf8'),
  readFile(resolve(packageRoot, 'stories/helpers.ts'), 'utf8'),
]);
const parity = JSON.parse(parityText);
const publishedAudit = JSON.parse(publishedAuditText);
const sections = sectionMap(storyHelpers);
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
    const reactControls = storyArgTypes(reactStories, `${contract.react}.stories.tsx`);
    const targetControls = storyArgTypes(stories, `${storyName}.stories.ts`);
    const targetSections = sections.get(storyName) ?? new Map();
    for (const control of targetControls.keys()) {
      const sourceSection = reactControls.get(control)?.category;
      const targetSection = targetSections.get(control);
      if (sourceSection !== targetSection) {
        throw new Error(
          `${tag} Storybook section mismatch for ${control}: React=${sourceSection ?? 'unsectioned'}, Web Component=${
            targetSection ?? 'unsectioned'
          }.`
        );
      }
    }
    for (const control of targetSections.keys()) {
      if (!targetControls.has(control)) throw new Error(`${tag} has a stale Storybook section for ${control}.`);
    }
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
