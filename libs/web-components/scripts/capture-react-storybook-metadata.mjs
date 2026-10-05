#!/usr/bin/env node
import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const packageRoot = resolve(import.meta.dirname, '..');
const parity = JSON.parse(await readFile(resolve(packageRoot, 'react-parity.json'), 'utf8'));
const sourceUrl =
  process.argv.find((argument) => argument.startsWith('--url='))?.slice('--url='.length) ??
  'https://storybook.cto-rnd-system-design.griddynamics.net';
const index = await (await fetch(`${sourceUrl}/index.json`)).json();
const entries = Object.values(index.entries);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const snapshot = {};

try {
  for (const [tag, contract] of Object.entries(parity)) {
    const group = tag === 'gd-counter' || tag === 'gd-menu' ? 'Molecules' : 'Atoms';
    const title = `${group}/${contract.react}`;
    const entry = entries.find(
      (candidate) => candidate.type === 'story' && (candidate.title === title || candidate.title === `React/${title}`)
    );
    if (!entry) throw new Error(`The source Storybook does not contain ${title}.`);
    const storyUrl = new URL('/iframe.html', sourceUrl);
    storyUrl.searchParams.set('id', entry.id);
    storyUrl.searchParams.set('viewMode', 'story');
    await page.goto(storyUrl.toString(), {
      waitUntil: 'networkidle',
      timeout: 60_000,
    });
    snapshot[contract.react] = await page.evaluate(async (storyId) => {
      const preview = window.__STORYBOOK_PREVIEW__;
      await preview.storeInitializationPromise;
      const story = await preview.storyStoreValue.loadStory({ storyId });
      return JSON.parse(JSON.stringify(story.argTypes ?? {}));
    }, entry.id);
  }
} finally {
  await browser.close();
}

await writeFile(
  resolve(packageRoot, 'stories/react-storybook-arg-types.snapshot.json'),
  `${JSON.stringify(snapshot, null, 2)}\n`
);
console.log(
  `Captured resolved React argTypes for ${Object.keys(snapshot).length} migrated components from ${sourceUrl}.`
);
