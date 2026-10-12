import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
function exportsOf(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  return source.statements
    .filter(
      (node) => ts.isVariableStatement(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    )
    .flatMap((node) => node.declarationList.declarations.map((d) => d.name.getText(source)));
}

/** Source ASTs, rather than a hand-maintained list, define the paired inventory. */
export async function checkStoryInventory() {
  const sourceFiles = await readdir(`${root}libs/ui/src/components`, { recursive: true });
  const contracts = JSON.parse(await readFile(`${root}libs/web-components/react-parity.json`, 'utf8'));
  const targetFiles = await readdir(`${root}libs/web-components/stories`);
  for (const contract of Object.values(contracts)) {
    assert.ok(targetFiles.includes(`${contract.react}.stories.ts`), `${contract.react}: missing native story file`);
  }
  let count = 0;
  for (const targetFile of targetFiles) {
    if (!targetFile.endsWith('.stories.ts') || targetFile === 'Overview.stories.ts') continue;
    const component = targetFile.replace('.stories.ts', '');
    const sourceFile = sourceFiles.find((file) => file.endsWith(`/${component}.stories.tsx`));
    assert.ok(sourceFile, `No React counterpart for ${targetFile}`);
    const [source, target] = await Promise.all([
      readFile(`${root}libs/ui/src/components/${sourceFile}`, 'utf8'),
      readFile(`${root}libs/web-components/stories/${targetFile}`, 'utf8'),
    ]);
    const excluded = Object.values(contracts).find((contract) => contract.react === component)?.excludedStories ?? [];
    const expected = exportsOf(sourceFile, source)
      .filter((name) => !excluded.includes(name))
      .sort();
    assert.deepEqual(
      exportsOf(targetFile, target).sort(),
      expected,
      `${component}: stories must match React one for one (no extra aliases)`
    );
    count += expected.length;
  }
  return count;
}

// Walk the composed tree: slot content must be compared at its painted position,
// and hidden popovers/fallback slots must not count as visible example content.
export function canvasInventory() {
  const texts = [];
  const inputs = [];
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (text && node.parentElement && getComputedStyle(node.parentElement).visibility !== 'hidden') {
        const range = document.createRange();
        range.selectNodeContents(node);
        if ([...range.getClientRects()].some((r) => r.width && r.height)) texts.push(text);
      }
      return;
    }
    if (node instanceof HTMLSlotElement) {
      const assigned = node.assignedNodes({ flatten: true });
      (assigned.length ? assigned : [...node.childNodes]).forEach(walk);
      return;
    }
    if (node instanceof Element) {
      if (
        ['SCRIPT', 'STYLE'].includes(node.tagName) ||
        (getComputedStyle(node).display !== 'contents' && !node.checkVisibility({ checkVisibilityCSS: true }))
      )
        return;
      if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement)
        inputs.push({
          type: node.type,
          value: ['checkbox', 'radio'].includes(node.type) ? undefined : node.value,
          checked: node instanceof HTMLInputElement ? node.checked : undefined,
          disabled: node.disabled,
        });
      if (node.shadowRoot) {
        [...node.shadowRoot.childNodes].forEach(walk);
        return;
      }
    }
    [...node.childNodes].forEach(walk);
  };
  walk(document.querySelector('#storybook-root'));
  return { text: texts.join(' ').replace(/\s+/g, ' ').trim(), inputs };
}

export async function checkRenderedStoryParity(browser, reactBase, webBase, filter = '') {
  const reactIndex = await (await fetch(`${reactBase}/index.json`)).json();
  const webIndex = await (await fetch(`${webBase}/index.json`)).json();
  const pages = await Promise.all([
    browser.newPage({ viewport: { width: 1280, height: 900 } }),
    browser.newPage({ viewport: { width: 1280, height: 900 } }),
  ]);
  for (const page of pages) {
    page.setDefaultTimeout(15000);
    await page.route('https://picsum.photos/**', (route) =>
      route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#91b8d8"/></svg>',
      })
    );
  }
  const failures = [];
  let count = 0;
  try {
    for (const target of Object.values(webIndex.entries).filter(
      (entry) =>
        entry.type === 'story' &&
        /^(Atoms|Molecules)\//.test(entry.title) &&
        !entry.id.endsWith('--default-tokens') &&
        (!filter || entryMatches(entry, filter))
    )) {
      const source = Object.values(reactIndex.entries).find(
        (entry) =>
          entry.type === 'story' &&
          entry.title.replace(/^React\//, '') === target.title &&
          entry.id.split('--')[1] === target.id.split('--')[1]
      );
      if (!source) {
        failures.push(`${target.id}: no React counterpart`);
        continue;
      }
      try {
        const results = await Promise.allSettled(
          pages.map(async (page, i) => {
            const entry = i ? target : source;
            await page.goto(`${i ? webBase : reactBase}/iframe.html?id=${entry.id}&viewMode=story&embed=true`, {
              waitUntil: 'domcontentloaded',
            });
            await page.waitForFunction(
              () =>
                document.querySelector('#storybook-root')?.childNodes.length ||
                document.querySelector('body.sb-show-errordisplay')
            );
            await page.evaluate(async () => {
              await document.fonts.ready;
              for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame);
            });
            const error = (await page.locator('.sb-errordisplay').isVisible())
              ? await page.locator('.sb-errordisplay').textContent()
              : '';
            if (error) throw new Error(error);
            return page.evaluate(canvasInventory);
          })
        );
        const failed = results.find((result) => result.status === 'rejected');
        if (failed) throw failed.reason;
        const inventories = results.map((result) => result.value);
        assert.deepEqual(inventories[1], inventories[0]);
        assert.equal(target.name, source.name, 'Story display name differs');
        // Text equality cannot catch a checkbox rendered with text-field chrome.
        // Measure the painted controls, not the deliberately hidden Checkbox input.
        if (
          /^atoms-input--(checkbox-with-label|radio.*with-label|primary-default-with-label-and-helper-text)$/.test(
            target.id
          ) ||
          /^atoms-checkbox--(default|disabled|sizes|indeterminate)$/.test(target.id)
        ) {
          const isCheckbox = target.id.startsWith('atoms-checkbox--');
          const geometry = await Promise.all(
            pages.map((page, index) =>
              page
                .locator(
                  isCheckbox
                    ? index
                      ? 'gd-checkbox [part="indicator"]'
                      : '[data-testid="Checkbox-indicator"]'
                    : 'input'
                )
                .evaluateAll((nodes) =>
                  nodes.map((node) => {
                    const rect = node.getBoundingClientRect();
                    const style = getComputedStyle(node);
                    return {
                      x: rect.x,
                      y: rect.y,
                      width: rect.width,
                      height: rect.height,
                      appearance: style.appearance,
                      background: style.backgroundColor,
                      image: style.backgroundImage,
                      border: style.border,
                    };
                  })
                )
            )
          );
          assert.equal(geometry[1].length, geometry[0].length, 'Painted control count');
          geometry[0].forEach((expected, i) => {
            const actual = geometry[1][i];
            for (const field of ['x', 'y', 'width', 'height'])
              assert.ok(
                Math.abs(actual[field] - expected[field]) <= 0.6,
                `Control ${i} ${field}: ${actual[field]} differs from React ${expected[field]}`
              );
            for (const field of ['appearance', 'background', 'image', 'border'])
              assert.equal(actual[field], expected[field], `Control ${i} ${field}`);
          });
        }
      } catch (error) {
        failures.push(`${target.id}: ${error.message}`);
        console.log(`Difference: ${target.id}`);
      }
      count++;
      if (count % 25 === 0) console.log(`Compared ${count} stories (${failures.length} differences so far).`);
    }
  } finally {
    await Promise.all(pages.map((page) => page.close()));
  }
  return { count, failures };
}
function entryMatches(entry, filter) {
  return entry.title.toLowerCase().includes(filter.toLowerCase());
}
