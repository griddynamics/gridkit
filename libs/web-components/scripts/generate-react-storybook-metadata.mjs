#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';
import { translateStorybookMetadata } from './translate-storybook-metadata.mjs';

const packageRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(packageRoot, '../..');
const parity = JSON.parse(await readFile(resolve(packageRoot, 'react-parity.json'), 'utf8'));
const outputPath = resolve(packageRoot, 'stories/react-storybook-arg-types.generated.ts');
const snapshotPath = resolve(packageRoot, 'stories/react-storybook-arg-types.snapshot.json');

const knownExpressions = new Map([
  ['Object.keys(WrapperVariant)', ['Inline', 'Section', 'FullPage']],
  ['WrapperVariant.Inline', 'inline'],
  ['Object.values(TextareaResize)', ['none', 'both', 'horizontal', 'vertical']],
  ['Object.values(Orientation)', ['vertical', 'horizontal']],
  ['Object.values(SizeVariant)', ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']],
  ['Object.values(SeparatorVariant)', ['solid', 'dashed', 'dotted']],
  ['Object.values(SeparatorLabelPosition)', ['start', 'center', 'end']],
  ['SkeletonVariant.Rounded', 'rounded'],
  ['Object.values(LinkVariant)', ['primary', 'secondary', 'inverted', 'inherit']],
  ['Object.values(LinkTarget)', ['_blank', '_self', '_parent', '_top', 'framename']],
  ['Object.values(SizeVariant).filter((size) => size !== SizeVariant.Xxl)', ['xs', 'sm', 'md', 'lg', 'xl']],
  ['Object.values(WrapperVariant)', ['inline', 'section', 'fullPage']],
  ['Object.values(ButtonTypes)', ['button', 'submit', 'reset']],
  ['ButtonTypes.Button', 'button'],
  ['Object.values(ButtonVariant)', ['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit']],
  ['Object.values(ButtonRole)', ['button', 'link', 'checkbox', 'switch', 'tab']],
  ['ButtonRole.Button', 'button'],
  [
    'Object.values(InputVariantType)',
    [
      'text',
      'password',
      'email',
      'search',
      'url',
      'tel',
      'date',
      'time',
      'month',
      'week',
      'color',
      'range',
      'number',
      'radio',
      'checkbox',
    ],
  ],
  ['InputVariantType.Text', 'text'],
  ['Object.values(InputRole)', ['textbox', 'spinbutton', 'checkbox', 'radio', 'radiogroup', 'combobox']],
  ['InputRole.Textbox', 'textbox'],
]);

const propertyName = (node) =>
  ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node) ? node.text : undefined;

function extractArgTypes(fileName, source) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const variables = new Map();
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer)
        variables.set(declaration.name.text, declaration.initializer);
    }
  }

  let argTypes;
  const visit = (node) => {
    if (
      !argTypes &&
      ts.isPropertyAssignment(node) &&
      propertyName(node.name) === 'argTypes' &&
      ts.isObjectLiteralExpression(node.initializer)
    )
      argTypes = node.initializer;
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  const evaluate = (node, seen = []) => {
    if (!node) return undefined;
    const sourceText = node.getText(sourceFile);
    if (knownExpressions.has(sourceText)) return knownExpressions.get(sourceText);
    if (sourceText.startsWith('Object.keys(SkeletonVariant).map(')) return ['rectangular', 'rounded', 'circular'];
    if (sourceText === 'Object.keys(IconsList)') return undefined; // The target story supplies the shared catalog.
    if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node))
      return evaluate(node.expression, seen);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isIdentifier(node)) {
      if (node.text === 'undefined') return undefined;
      if (variables.has(node.text) && !seen.includes(node.text))
        return evaluate(variables.get(node.text), [...seen, node.text]);
      return undefined;
    }
    if (ts.isArrayLiteralExpression(node)) return node.elements.map((element) => evaluate(element, seen));
    if (ts.isObjectLiteralExpression(node)) {
      const value = {};
      for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const child = evaluate(property.initializer, seen);
        if (child !== undefined) value[propertyName(property.name)] = child;
      }
      return value;
    }
    if (ts.isPrefixUnaryExpression(node)) {
      const value = evaluate(node.operand, seen);
      return node.operator === ts.SyntaxKind.MinusToken ? -value : value;
    }
    return undefined;
  };

  return Object.fromEntries(
    (argTypes?.properties ?? [])
      .filter(ts.isPropertyAssignment)
      .map((property) => [propertyName(property.name), evaluate(property.initializer)])
  );
}

const sourceMetadata = JSON.parse(await readFile(snapshotPath, 'utf8'));
for (const [tag, contract] of Object.entries(parity)) {
  const category = tag === 'gd-counter' || tag === 'gd-menu' ? 'molecules' : 'atoms';
  const fileName = resolve(
    repoRoot,
    'libs/ui/src/components',
    category,
    contract.react,
    `${contract.react}.stories.tsx`
  );
  const explicitArgTypes = extractArgTypes(fileName, await readFile(fileName, 'utf8'));
  const publishedArgTypes = sourceMetadata[contract.react];
  if (!publishedArgTypes) throw new Error(`${contract.react} is missing from the published Storybook snapshot.`);
  const missing = Object.keys(explicitArgTypes).filter((control) => !(control in publishedArgTypes));
  if (missing.length)
    throw new Error(`${contract.react} published Storybook snapshot is missing controls: ${missing.join(', ')}.`);
}
const metadata = translateStorybookMetadata(sourceMetadata);

const output = `/* This file is generated from the React Storybook metadata. Do not edit it by hand. */\nexport const reactStorybookArgTypes = ${JSON.stringify(
  metadata,
  null,
  2
)} as const;\n`;

if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  const serialized = current.match(/reactStorybookArgTypes = ([\s\S]+) as const;/)?.[1];
  const currentMetadata = serialized ? Function(`"use strict"; return (${serialized});`)() : undefined;
  if (!currentMetadata || JSON.stringify(currentMetadata) !== JSON.stringify(metadata))
    throw new Error('React Storybook metadata is stale. Run generate-react-storybook-metadata.mjs.');
} else {
  await writeFile(outputPath, output);
}
