import ts from 'typescript';
import prettier from 'prettier';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const formatOptions = (await prettier.resolveConfig(new URL('../../../.prettierrc', import.meta.url).pathname)) ?? {};
const root = fileURLToPath(new URL('../../../', import.meta.url));
const parity = JSON.parse(await readFile(resolve(root, 'libs/web-components/react-parity.json'), 'utf8'));
export const fixtureComponents = [
  'Avatar',
  'Badge',
  'Box',
  'Button',
  'Counter',
  'InputFile',
  'Label',
  'Link',
  'Loader',
  'Skeleton',
  'Typography',
  'Wrapper',
];
const nativeDescriptions = {
  Avatar: 'Avatar with image, fallback initials or icon, badge, color, size, and accessible labeling.',
  Badge: 'Status badge with variants, appearances, sizes, disabled state, icon positions, and style overrides.',
  Box: 'Layout container with orientation, border, hover highlight, shadow, accessibility, and custom styling.',
  Button:
    'Button with variants, icons, loading state, width, rounding, disabled behavior, custom styling, and accessibility.',
  Counter:
    'Counter with minimum, maximum, initial value, external change handling, disabled state, and accessible native controls.',
  InputFile:
    'File picker with accepted file types, capture, multiple selection, disabled and icon-label states, button customization, native events, and accessible controls.',
  Label:
    'Native label with slotted content, child icons, custom styling, control association, and accessibility semantics.',
  Link: 'Native anchor with variants, sizes, underline modes, colors, disabled behavior, targets, custom styling, accessibility, and child composition.',
  Loader:
    'Loading indicator with circle and dots animations, five sizes, rounding, inline, section and full-page layouts, custom timing, content, styling, and status accessibility.',
  Skeleton:
    'Loading placeholder with rounded, rectangular and circular variants, theme colors, child content, composed layouts, and accessibility semantics.',
  Typography:
    'Typography with semantic overrides, combined style variants, disclaimer, display, heading, body, color, alignment, and accessibility options.',
  Wrapper:
    'Layout wrapper with inline, section and full-page variants, semantic element selection, slotted content, and custom styling.',
};
const componentFiles = await readdir(resolve(root, 'libs/ui/src/components'), { recursive: true });
const enums = new Map();
for (const file of await readdir(resolve(root, 'libs/ui/src/types'))) {
  if (!file.endsWith('.ts')) continue;
  const source = ts.createSourceFile(file, await readFile(resolve(root, 'libs/ui/src/types', file), 'utf8'), 99, true);
  for (const node of source.statements) {
    if (!ts.isEnumDeclaration(node)) continue;
    for (const member of node.members) {
      if (member.initializer && ts.isStringLiteral(member.initializer))
        enums.set(`${node.name.text}.${member.name.getText(source)}`, member.initializer.text);
    }
  }
}
let stale = false;
for (const component of fixtureComponents) {
  const relative = componentFiles.find((file) => file.endsWith(`/${component}.stories.tsx`));
  const sourcePath = `libs/ui/src/components/${relative}`;
  const source = ts.createSourceFile(
    sourcePath,
    await readFile(resolve(root, sourcePath), 'utf8'),
    99,
    true,
    ts.ScriptKind.TSX
  );
  const contract = Object.values(parity).find((entry) => entry.react === component);
  const excludedStories = new Set(contract?.excludedStories ?? []);
  const names = source.statements
    .filter((n) => ts.isVariableStatement(n) && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
    .flatMap((n) => n.declarationList.declarations.map((d) => d.name.getText(source)))
    .filter((name) => !excludedStories.has(name));
  const displayNames = new Map();
  for (const node of source.statements) {
    if (!ts.isVariableStatement(node)) continue;
    for (const declaration of node.declarationList.declarations) {
      let value = declaration.initializer;
      while (value && (ts.isAsExpression(value) || ts.isSatisfiesExpression(value))) value = value.expression;
      if (!value || !ts.isObjectLiteralExpression(value)) continue;
      const name = value.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(source) === 'name');
      if (name && ts.isStringLiteral(name.initializer))
        displayNames.set(declaration.name.getText(source), name.initializer.text);
    }
  }
  const tags = new Set([component]);
  const transformed = ts.transform(source, [
    (context) => (rootNode) =>
      ts.visitNode(rootNode, function visit(node) {
        if (ts.isImportDeclaration(node)) return undefined;
        if (ts.isVariableStatement(node)) {
          const declarations = node.declarationList.declarations.filter(
            (declaration) => !excludedStories.has(declaration.name.getText(source))
          );
          if (!declarations.length) return undefined;
          if (declarations.length !== node.declarationList.declarations.length) {
            return ts.factory.updateVariableStatement(
              node,
              node.modifiers,
              ts.factory.updateVariableDeclarationList(node.declarationList, declarations)
            );
          }
        }
        if (
          ts.isExpressionStatement(node) &&
          [...excludedStories].some((name) => node.expression.getText(source).startsWith(`${name}.`))
        )
          return undefined;
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
          const text = node.text.replace(/tailwind(?: css)?/gi, 'utility CSS');
          if (text !== node.text) return ts.factory.createStringLiteral(text);
        }
        if (
          component === 'Loader' &&
          ts.isVariableDeclaration(node) &&
          ['LoaderSectionVariant', 'SectionLoaderButtonVariant', 'InlineLoaderButtonVariant'].includes(
            node.name.getText(source)
          )
        )
          return ts.factory.updateVariableDeclaration(
            node,
            node.name,
            undefined,
            undefined,
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier('loaderStories'),
              node.name.getText(source)
            )
          );
        if (ts.isPropertyAssignment(node) && ['argTypes', 'play', 'code'].includes(node.name.getText(source)))
          return undefined;
        if (
          ts.isExpressionStatement(node) &&
          ts.isBinaryExpression(node.expression) &&
          /\.play$/.test(node.expression.left.getText(source))
        )
          return undefined;
        if (ts.isPropertyAccessExpression(node) && enums.has(node.getText(source)))
          return ts.factory.createStringLiteral(enums.get(node.getText(source)));
        if (
          ts.isPropertyAccessExpression(node) &&
          [...enums.keys()].some((key) => key.startsWith(node.expression.getText(source) + '.'))
        )
          return ts.factory.createIdentifier('undefined');
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          /^[A-Z]/.test(node.tagName.getText(source))
        )
          tags.add(node.tagName.getText(source));
        // Polymorphic Row uses a native flex div in the Web Component API.
        if (
          ts.isPropertyAssignment(node) &&
          node.name.getText(source) === 'as' &&
          node.initializer.getText(source) === 'Row'
        )
          return ts.factory.updatePropertyAssignment(node, node.name, ts.factory.createStringLiteral('div'));
        return ts.visitEachChild(node, visit, context);
      }),
  ]).transformed[0];
  const code = ts.transpileModule(ts.createPrinter().printFile(transformed), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      jsxFactory: 'demo',
      jsxFragmentFactory: 'Fragment',
      removeComments: true,
    },
  }).outputText;
  if (/\b(useState|useRef|useEffect|useCallback)\(/.test(code))
    throw new Error(`${component}: interactive stories require an explicit native port`);
  const tagDeclarations = [...tags]
    .map(
      (tag) =>
        `const ${tag} = '${
          tag === 'TokenViewer' || tag === 'Row' || tag === 'Column'
            ? tag
            : `gd-${tag.replace(/[A-Z]/g, (c, i) => `${i ? '-' : ''}${c.toLowerCase()}`)}`
        }';`
    )
    .join('\n');
  const result = `// Generated from ${sourcePath}. Run npm run generate:web-component-stories.\n// Native DOM recipes only: no React runtime or React component implementation is imported.\nimport { demo, Fragment } from '../native-story';\nimport { defaultTheme } from 'gd-design-library/tokens';\nimport { fn } from 'storybook/test';\nimport { action } from 'storybook/actions';\n${
    component === 'Loader' ? "import { loaderStories } from '../loader-examples';\n" : ''
  }const COMPONENT_NAME = '${component}';\n${tagDeclarations}\n${code}`;
  // CSF indexes static object-literal names. Hiding name inside nativeStory()
  // preserves runtime metadata but silently changes the sidebar's published name.
  const wrapper = `// Generated from ${sourcePath}; edit the source example or native-story adapter.\nimport * as fixtures from './fixtures/${component}.generated.js';\nimport { nativeMeta, nativeStory } from './native-story';\nimport { sectionedArgTypes } from './helpers';\n\nconst sourceMeta = nativeMeta(fixtures.default, sectionedArgTypes('${component}', {}));\nconst meta = {\n  title: '${
    component === 'Counter' ? 'Molecules' : 'Atoms'
  }/${component}',\n  tags: ['autodocs'],\n  args: sourceMeta.args,\n  parameters: {\n    layout: 'centered',\n    docs: {\n      description: { component: ${JSON.stringify(
    nativeDescriptions[component]
  )} },\n    },\n  },\n  argTypes: sourceMeta.argTypes,\n  render: sourceMeta.render,\n};\nexport default meta;\n${names
    .map(
      (name) =>
        `export const ${name} = { ...nativeStory(fixtures.${name}, meta)${
          displayNames.has(name) ? `, name: ${JSON.stringify(displayNames.get(name))}` : ''
        } };`
    )
    .join('\n')}\n`;
  for (const [relativePath, rawContents] of [
    [`stories/fixtures/${component}.generated.js`, result],
    [`stories/${component}.stories.ts`, wrapper],
  ]) {
    const file = resolve(root, 'libs/web-components', relativePath);
    const contents = await prettier.format(rawContents, { ...formatOptions, filepath: file });
    if (process.argv.includes('--check')) {
      if ((await readFile(file, 'utf8').catch(() => '')) !== contents) {
        console.error(`Stale story fixture: ${relativePath}`);
        stale = true;
      }
    } else await writeFile(file, contents);
  }
}
if (stale) process.exitCode = 1;
else console.log(`Verified native fixtures for ${fixtureComponents.length} React story files.`);
