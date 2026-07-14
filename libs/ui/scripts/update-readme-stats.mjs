#!/usr/bin/env node
/**
 * Counts component directories under src/components/{atoms,molecules,organisms,layout,widget}
 * and updates the component count in README.md.
 *
 * Usage:
 *   node libs/ui/scripts/update-readme-stats.mjs           # update README in place
 *   node libs/ui/scripts/update-readme-stats.mjs --check   # exit 1 if README is out of date (no writes)
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const CHECK_MODE = process.argv.includes('--check');

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const COMPONENTS_DIR = resolve(LIB_ROOT, 'src/components');
const README_PATH = resolve(LIB_ROOT, 'README.md');

const COMPONENT_FOLDERS = ['atoms', 'molecules', 'organisms', 'layout', 'widget'];

function countComponents() {
  let total = 0;
  const breakdown = {};

  for (const folder of COMPONENT_FOLDERS) {
    const dir = resolve(COMPONENTS_DIR, folder);
    try {
      const entries = readdirSync(dir).filter((name) => statSync(resolve(dir, name)).isDirectory());
      breakdown[folder] = entries.length;
      total += entries.length;
    } catch {
      breakdown[folder] = 0;
    }
  }

  return { total, breakdown };
}

const { total, breakdown } = countComponents();

console.log('Component counts:');
for (const [folder, count] of Object.entries(breakdown)) {
  console.log(`  ${folder}: ${count}`);
}
console.log(`  total: ${total}`);

const readme = readFileSync(README_PATH, 'utf8');
const updated = readme.replace(
  /\d+\+? modular components \(atoms, molecules, organisms, layout\)/,
  `${total} modular components (atoms, molecules, organisms, layout)`
);

if (updated === readme) {
  console.log('\nREADME already up to date or pattern not found.');
} else if (CHECK_MODE) {
  console.error(`\nREADME is out of date (expected count: ${total}). Run \`yarn update-readme-stats\` to fix.`);
  process.exit(1);
} else {
  writeFileSync(README_PATH, updated, 'utf8');
  console.log(`\nREADME updated: component count set to ${total}`);
}
