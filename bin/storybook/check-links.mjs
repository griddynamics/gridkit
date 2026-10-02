import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyReactIds, sharedDocIds } from './routes.mjs';
import { validateLinks } from './link-validation.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const built = process.argv.includes('--built');
const checkPackage = built || process.argv.includes('--package');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
let indexes;
if (built) {
  indexes = {
    react: readJson(join(root, 'libs/ui/storybook-static/index.json')),
    webComponents: readJson(join(root, 'libs/ui/storybook-static/web-components/index.json')),
  };
} else {
  // Indexing does not build the UI or either preview. Package builds can check
  // links without creating a UI -> Storybook -> UI build dependency cycle.
  const temporary = mkdtempSync(join(tmpdir(), 'gridkit-storybook-index-'));
  try {
    indexes = {};
    for (const [catalog, project] of [
      ['react', 'ui'],
      ['webComponents', 'web-components'],
    ]) {
      const output = join(temporary, `${catalog}.json`);
      execFileSync(
        process.execPath,
        [
          join(root, 'node_modules/storybook/dist/bin/dispatcher.js'),
          'index',
          '-c',
          '.storybook',
          '-o',
          output,
          '--disable-telemetry',
        ],
        { cwd: join(root, 'libs', project), stdio: 'inherit' }
      );
      indexes[catalog] = readJson(output);
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

const errors = [];
for (const id of legacyReactIds) {
  const canonical = sharedDocIds.includes(id) ? id : `react-${id}`;
  if (!indexes.react.entries[canonical]) errors.push(`Missing migrated entry: ${canonical}`);
}
for (const id of sharedDocIds) {
  if (!indexes.react.entries[id]) errors.push(`Missing shared documentation: ${id}`);
  if (indexes.react.entries[`react-${id}`]) errors.push(`Shared documentation duplicated under React: ${id}`);
}
for (const entry of Object.values(indexes.react.entries)) {
  if (!entry.title.startsWith('React/') && !sharedDocIds.includes(entry.id))
    errors.push(`Unclassified entry outside the React root: ${entry.id}`);
}
if (built) {
  // The built index applies preview.storySort; shared docs must precede React.
  const firstEntries = Object.values(indexes.react.entries).slice(0, sharedDocIds.length);
  if (firstEntries.some((entry) => !sharedDocIds.includes(entry.id)))
    errors.push('Shared documentation must appear before React in the built sidebar order');
}
if (!indexes.webComponents.entries['introduction-overview--overview']) errors.push('Missing Web Components overview');

// Docs is the component landing format in both catalogs: it keeps the overview,
// controls, source, and initial example together. Default remains an example
// story only where the source component defines one.
for (const [catalog, index] of Object.entries(indexes)) {
  const componentEntries = Object.values(index.entries).filter((entry) => {
    const title = entry.title.replace(/^React\//, '');
    return /^(Atoms|Molecules|Organisms|Layout & Structure|Templates)\//.test(title);
  });
  const titles = [...new Set(componentEntries.map((entry) => entry.title))];
  for (const title of titles) {
    const entries = componentEntries.filter((entry) => entry.title === title);
    const docs = entries.find((entry) => entry.type === 'docs');
    if (!docs) errors.push(`${catalog}: ${title} is missing its Docs landing entry`);
    if (built && docs && entries[0]?.id !== docs.id)
      errors.push(`${catalog}: ${title} must open with Docs before its example stories`);
  }
}
for (const [group, names] of [
  ['atoms', ['avatar', 'button', 'checkbox', 'input', 'select', 'typography']],
  ['molecules', ['counter', 'menu']],
]) {
  for (const name of names) {
    for (const variant of ['docs']) {
      const id = `${group}-${name}--${variant}`;
      if (!indexes.webComponents.entries[id]) errors.push(`Missing native Web Components entry: ${id}`);
    }
  }
}

const excluded = new Set(['node_modules', '.git', 'dist', 'storybook-static', 'coverage', 'output', '.nx']);
const extensions = new Set([
  '.md',
  '.mdx',
  '.txt',
  '.json',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.html',
  '.yml',
  '.yaml',
]);
function filesIn(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isSymbolicLink() || excluded.has(entry.name)) return [];
    const file = join(path, entry.name);
    return entry.isDirectory() ? filesIn(file) : extensions.has(extname(file)) ? [file] : [];
  });
}

// The frozen migration registry and its tests intentionally contain old IDs.
const sourceFiles = ['README.md', 'CLAUDE.md']
  .map((file) => join(root, file))
  .filter(existsSync)
  .concat(
    ...['libs', '.github'].map((dir) => filesIn(join(root, dir))),
    filesIn(join(root, 'bin')).filter((file) => !file.startsWith(join(root, 'bin', 'storybook') + sep))
  );
const packageFiles = [];
if (checkPackage) {
  for (const file of ['llms.txt', 'ai/README.md']) {
    if (!existsSync(join(root, 'dist/libs/ui', file))) errors.push(`Missing package artifact: ${file}`);
  }
  packageFiles.push(...filesIn(join(root, 'dist/libs/ui/ai')));
  for (const file of readdirSync(join(root, 'dist/libs/ui'))) {
    if (/\.(md|txt)$/.test(file)) packageFiles.push(join(root, 'dist/libs/ui', file));
  }
}
let checked = 0;
for (const file of [...sourceFiles, ...packageFiles]) {
  const result = validateLinks(readFileSync(file, 'utf8'), indexes);
  checked += result.checked;
  errors.push(...result.errors.map(({ line, message }) => `${relative(root, file)}:${line}: ${message}`));
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${legacyReactIds.length} migrated entries and ${checked} Storybook links in source${checkPackage ? ' and built package artifacts' : ''}.`
  );
}
