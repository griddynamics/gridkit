import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { translateStorybookMetadata } from '../../libs/web-components/scripts/translate-storybook-metadata.mjs';

const reactArgTypes = translateStorybookMetadata(
  JSON.parse(
    await readFile(
      new URL('../../libs/web-components/stories/react-storybook-arg-types.snapshot.json', import.meta.url),
      'utf8'
    )
  )
);

/** Trusted browser input is required for native popover light-dismiss. */
export async function checkNativeStories(page, base, webBase = `${base}/web-components`) {
  const visit = async (url) => {
    await page.goto(url);
    await page.locator('#storybook-root > *').first().waitFor({ state: 'attached' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
    });
  };
  const index = await (await page.request.get(`${webBase}/index.json`)).json();
  for (const [component, sourceArgTypes] of Object.entries(reactArgTypes)) {
    const title = `${component === 'Counter' || component === 'Menu' ? 'Molecules' : 'Atoms'}/${component}`;
    const entry = Object.values(index.entries).find(
      (candidate) => candidate.type === 'story' && candidate.title === title
    );
    assert.ok(entry, `${title} must have a Web Component story`);
    assert.ok(
      Object.values(index.entries).some((candidate) => candidate.type === 'docs' && candidate.title === title),
      `${title} must expose an autodocs entry`
    );
    await visit(`${webBase}/iframe.html?id=${entry.id}&viewMode=story`);
    const targetArgTypes = await page.evaluate(async (storyId) => {
      const preview = window.__STORYBOOK_PREVIEW__;
      await preview.storeInitializationPromise;
      const story = await preview.storyStoreValue.loadStory({ storyId });
      return JSON.parse(JSON.stringify(story.argTypes ?? {}));
    }, entry.id);
    assert.deepEqual(
      Object.keys(targetArgTypes).sort(),
      Object.keys(sourceArgTypes).sort(),
      `${title} control inventory must match React`
    );
    for (const [name, source] of Object.entries(sourceArgTypes)) {
      const target = targetArgTypes[name];
      assert.equal(target.description, source.description, `${title}.${name} description must match React`);
      assert.deepEqual(target.options, source.options, `${title}.${name} options must match React`);
      assert.deepEqual(target.table, source.table, `${title}.${name} table metadata must match React`);
      assert.deepEqual(target.if, source.if, `${title}.${name} conditional visibility must match React`);
    }
  }
  await visit(`${webBase}/iframe.html?id=atoms-inputfile--default&viewMode=story`);
  await page.locator('gd-input-file').waitFor({ state: 'attached' });
  const webInputFileButton = await page.evaluate(() => {
    const inputFile = document.querySelector('gd-input-file');
    const button = inputFile.shadowRoot.querySelector('gd-button').shadowRoot.querySelector('button');
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return {
      width: rect.width,
      height: rect.height,
      color: style.color,
      background: style.backgroundColor,
      border: style.border,
      padding: style.padding,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    };
  });
  await visit(`${base}/iframe.html?id=react-atoms-inputfile--default&viewMode=story`);
  await page.locator('#storybook-root button').waitFor({ state: 'attached' });
  const reactInputFileButton = await page.evaluate(() => {
    const button = document.querySelector('#storybook-root button');
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return {
      width: rect.width,
      height: rect.height,
      color: style.color,
      background: style.backgroundColor,
      border: style.border,
      padding: style.padding,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    };
  });
  assert.ok(
    Math.abs(webInputFileButton.width - reactInputFileButton.width) < 0.25,
    `InputFile button width must match React (Web ${webInputFileButton.width}px, React ${reactInputFileButton.width}px)`
  );
  assert.ok(
    Math.abs(webInputFileButton.height - reactInputFileButton.height) < 0.25,
    `InputFile button height must match React (Web ${webInputFileButton.height}px, React ${reactInputFileButton.height}px)`
  );
  for (const property of ['color', 'background', 'border', 'padding', 'fontSize', 'fontWeight', 'lineHeight']) {
    assert.equal(
      webInputFileButton[property],
      reactInputFileButton[property],
      `InputFile button ${property} must match React`
    );
  }
  assert.equal(
    reactArgTypes.Checkbox.children.table.category,
    'Content',
    'Checkbox children must remain in the Content group'
  );
  await visit(`${webBase}/iframe.html?id=atoms-icon--registering-custom-icons&viewMode=story`);
  await page.locator('gd-icon[name="projectOrbit"]').waitFor({ state: 'attached' });
  const customIconExample = await page.evaluate(async () => {
    const icon = document.querySelector('gd-icon[name="projectOrbit"]');
    await icon.updateComplete;
    const preview = window.__STORYBOOK_PREVIEW__;
    await preview.storeInitializationPromise;
    const story = await preview.storyStoreValue.loadStory({ storyId: 'atoms-icon--registering-custom-icons' });
    return {
      viewBox: icon.shadowRoot.querySelector('svg')?.getAttribute('viewBox'),
      hasCircle: Boolean(icon.shadowRoot.querySelector('circle')),
      source: story.parameters.docs.source.code,
    };
  });
  assert.equal(customIconExample.viewBox, '0 0 24 24');
  assert.equal(customIconExample.hasCircle, true, 'Custom icon example must render its registered SVG');
  assert.match(customIconExample.source, /registerCustomIcons/);
  assert.match(customIconExample.source, /<gd-icon name="projectOrbit"/);
  await visit(`${webBase}/iframe.html?id=atoms-icon--all-icons&viewMode=story`);
  await page.locator('.icon-library-item').first().waitFor({ state: 'attached' });
  const webIconLibrary = await page.evaluate(() => {
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    };
    return {
      container: rect(document.querySelector('.icon-library')),
      names: [...document.querySelectorAll('.icon-library-item gd-typography')].map((label) => label.textContent),
      items: [...document.querySelectorAll('.icon-library-item')].map(rect),
      icons: [...document.querySelectorAll('.icon-library-item gd-icon')].map((icon) =>
        rect(icon.shadowRoot.querySelector('svg'))
      ),
      labels: [...document.querySelectorAll('.icon-library-item gd-typography')].map((label) =>
        rect(label.shadowRoot.querySelector('small'))
      ),
    };
  });
  await visit(`${base}/iframe.html?id=react-atoms-icon--all-icons&viewMode=story`);
  await page.locator('[data-testid="Column"]').first().waitFor({ state: 'attached' });
  const reactIconLibrary = await page.evaluate(() => {
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    };
    return {
      container: rect(document.querySelector('[data-testid="FlexContainer"]')),
      names: [...document.querySelectorAll('[data-testid="Column"] [data-testid="typography"]')].map(
        (label) => label.textContent
      ),
      items: [...document.querySelectorAll('[data-testid="Column"]')].map(rect),
      icons: [...document.querySelectorAll('[data-testid="Column"] svg')].map(rect),
      labels: [...document.querySelectorAll('[data-testid="Column"] [data-testid="typography"]')].map(rect),
    };
  });
  assert.deepEqual(webIconLibrary.names, reactIconLibrary.names, 'Icon library names and order must match React');
  const assertRects = (webRects, reactRects, label) => {
    assert.equal(webRects.length, reactRects.length, `${label} count must match React`);
    webRects.forEach((webRect, index) => {
      for (const key of ['x', 'y', 'width', 'height'])
        assert.ok(
          Math.abs(webRect[key] - reactRects[index][key]) < 0.25,
          `${label} ${index + 1} ${key} must match React`
        );
    });
  };
  assertRects([webIconLibrary.container], [reactIconLibrary.container], 'Icon library container');
  assertRects(webIconLibrary.items, reactIconLibrary.items, 'Icon library item');
  assertRects(webIconLibrary.icons, reactIconLibrary.icons, 'Icon library SVG');
  assertRects(webIconLibrary.labels, reactIconLibrary.labels, 'Icon library label');
  const badgeIcons = index.entries['atoms-badge--with-icons'];
  assert.ok(badgeIcons, 'Atoms/Badge WithIcons must exist');
  await visit(`${webBase}/iframe.html?id=${badgeIcons.id}&viewMode=story`);
  await page.locator('gd-badge').first().waitFor({ state: 'attached' });
  await page.waitForFunction(() => document.querySelectorAll('gd-badge').length === 5);
  const badgeIconParity = await page.evaluate(() => ({
    labels: [...document.querySelectorAll('gd-badge')].map((badge) =>
      [...badge.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join('')
        .trim()
    ),
    variants: [...document.querySelectorAll('gd-badge')].map((badge) => badge.getAttribute('variant') ?? 'primary'),
    icons: [...document.querySelectorAll('gd-badge')].map((badge) =>
      [...badge.querySelectorAll('gd-icon')].map((icon) => ({
        name: icon.getAttribute('name'),
        size: icon.getAttribute('size'),
        slot: icon.getAttribute('slot'),
      }))
    ),
  }));
  assert.deepEqual(badgeIconParity, {
    labels: ['With Start Icon', 'With End Icon', 'Both Icons', 'Quaternary with Icon', 'Quinary with Icon'],
    variants: ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'],
    icons: [
      [{ name: 'success', size: 'md', slot: 'icon-start' }],
      [{ name: 'warning', size: 'md', slot: 'icon-end' }],
      [
        { name: 'info', size: 'md', slot: 'icon-start' },
        { name: 'arrowRight', size: 'md', slot: 'icon-end' },
      ],
      [{ name: 'error', size: 'md', slot: 'icon-start' }],
      [{ name: 'accountCircle', size: 'md', slot: 'icon-start' }],
    ],
  });
  const webBadgeGeometry = await page.evaluate(() =>
    [...document.querySelectorAll('gd-badge')].map((badge) => {
      const root = badge.shadowRoot.querySelector('[part="root"]').getBoundingClientRect();
      const content = badge.shadowRoot.querySelector('[part="content"]').getBoundingClientRect();
      const icons = [...badge.querySelectorAll('gd-icon')].map((icon) => {
        const rect = icon.shadowRoot.querySelector('svg').getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          centerOffset: rect.top + rect.height / 2 - (root.top + root.height / 2),
        };
      });
      return {
        width: root.width,
        height: root.height,
        contentCenterOffset: content.top + content.height / 2 - (root.top + root.height / 2),
        icons,
      };
    })
  );
  await visit(`${base}/iframe.html?id=react-atoms-badge--with-icons&viewMode=story`);
  await page.locator('[data-testid="Badge"]').first().waitFor({ state: 'attached' });
  const reactBadgeGeometry = await page.evaluate(() =>
    [...document.querySelectorAll('[data-testid="Badge"]')].map((badge) => {
      const root = badge.getBoundingClientRect();
      const content = badge.querySelector('[data-testid="Badge-content"]').getBoundingClientRect();
      const icons = [...badge.querySelectorAll('svg')].map((icon) => {
        const rect = icon.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          centerOffset: rect.top + rect.height / 2 - (root.top + root.height / 2),
        };
      });
      return {
        width: root.width,
        height: root.height,
        contentCenterOffset: content.top + content.height / 2 - (root.top + root.height / 2),
        icons,
      };
    })
  );
  assert.equal(webBadgeGeometry.length, reactBadgeGeometry.length, 'Badge WithIcons example count must match React');
  for (let index = 0; index < reactBadgeGeometry.length; index += 1) {
    const web = webBadgeGeometry[index];
    const react = reactBadgeGeometry[index];
    assert.ok(
      Math.abs(web.width - react.width) < 1,
      `Badge ${index + 1} width must match React within 1px (Web ${web.width}px, React ${react.width}px)`
    );
    assert.ok(
      Math.abs(web.height - react.height) < 1,
      `Badge ${index + 1} height must match React within 1px (Web ${web.height}px, React ${react.height}px)`
    );
    assert.ok(Math.abs(web.contentCenterOffset) < 1, `Badge ${index + 1} text must be vertically centered`);
    assert.equal(web.icons.length, react.icons.length, `Badge ${index + 1} icon count must match React`);
    for (let iconIndex = 0; iconIndex < react.icons.length; iconIndex += 1) {
      assert.ok(Math.abs(web.icons[iconIndex].width - react.icons[iconIndex].width) < 0.5);
      assert.ok(Math.abs(web.icons[iconIndex].height - react.icons[iconIndex].height) < 0.5);
      assert.ok(
        Math.abs(web.icons[iconIndex].centerOffset - react.icons[iconIndex].centerOffset) < 0.25,
        `Badge ${index + 1} inner SVG must match the React SVG vertical center`
      );
    }
  }
  const stories = Object.values(index.entries).filter(
    (entry) =>
      entry.type === 'story' && /^(Atoms|Molecules)\//.test(entry.title) && !entry.id.endsWith('--default-tokens')
  );
  const names = new Set();
  const tags = { inputfile: 'input-file', sliderdots: 'slider-dots' };
  for (const story of stories) {
    const name = story.title.split('/')[1].toLowerCase();
    names.add(name);
    await visit(`${webBase}/iframe.html?id=${story.id}&viewMode=story`);
    if (
      [
        'atoms-loader--loader-section-variant',
        'atoms-loader--section-loader-button-variant',
        'atoms-loader--inline-loader-button-variant',
      ].includes(story.id)
    )
      continue;
    const tag = `gd-${tags[name] ?? name}`;
    await page.locator(tag).first().waitFor({ state: 'attached' });
    await page.waitForFunction((tag) => {
      const el = document.querySelector(tag);
      return el?.shadowRoot?.childElementCount > 0;
    }, tag);
  }
  assert.deepEqual([...names].sort(), [
    'avatar',
    'badge',
    'box',
    'button',
    'checkbox',
    'counter',
    'icon',
    'image',
    'input',
    'inputfile',
    'label',
    'link',
    'loader',
    'menu',
    'select',
    'separator',
    'skeleton',
    'slider',
    'sliderdots',
    'switch',
    'textarea',
    'toggle',
    'truncate',
    'typography',
    'wrapper',
  ]);
  const tokenStories = Object.values(index.entries).filter(
    (entry) => entry.type === 'story' && entry.id.endsWith('--default-tokens')
  );
  for (const story of tokenStories) {
    await visit(`${webBase}/iframe.html?id=${story.id}&viewMode=story`);
    const viewer = page.getByRole('region', { name: 'Token viewer' });
    await viewer.waitFor();
    const text = await viewer.textContent();
    assert.ok(text.length > 50, `${story.id} should render its theme token values`);
    assert.doesNotMatch(text, /^defaultTheme\./, `${story.id} should not render a token placeholder`);
    const branch = viewer.getByRole('button').first();
    await branch.click();
    assert.equal(await branch.getAttribute('aria-expanded'), 'false');
  }
  assert.equal(tokenStories.length, 24, 'Every React token story port should render Web Component tokens');
  const open = async (id) => {
    await visit(`${webBase}/iframe.html?id=${id}&viewMode=story`);
    await page.locator('#storybook-root').waitFor();
    await page.evaluate(() => {
      window.__nativeEvents = [];
      for (const name of ['gd-change', 'gd-input'])
        document.addEventListener(name, (event) => window.__nativeEvents.push(event.detail));
    });
  };
  const event = async (detail) =>
    page.waitForFunction(
      (expected) => window.__nativeEvents.some((value) => JSON.stringify(value) === JSON.stringify(expected)),
      detail
    );
  await open('atoms-button--disabled-button');
  await page.getByRole('button', { name: 'Disabled Button', exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'Disabled Button', exact: true }).isDisabled());
  await open('atoms-input--primary-default-with-label-and-helper-text');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('Updated value');
  await event({ value: 'Updated value' });
  await open('atoms-input--read-only');
  assert.ok(
    await page
      .getByRole('textbox')
      .isEditable()
      .then((value) => !value)
  );
  await open('atoms-checkbox--default');
  // The native input is visually hidden; users activate its visible label.
  await page.locator('gd-checkbox label').click();
  await event({ checked: true });
  await page.locator('gd-checkbox label').click();
  await event({ checked: false });
  await open('atoms-checkbox--controlled');
  await page.locator('gd-checkbox label').click();
  await page.getByText('Current state: Checked', { exact: true }).waitFor();
  await open('atoms-input--radio-group-with-label');
  await page.getByText('Label 2', { exact: true }).click();
  assert.deepEqual(
    await page.locator('input[type="radio"]').evaluateAll((nodes) => nodes.map((node) => node.checked)),
    [false, true, false]
  );
  await open('atoms-input--with-end-adornment-as-icon');
  await page.locator('[slot="adornment-end"]').click();
  assert.equal(await page.locator('input').getAttribute('type'), 'text');
  await open('atoms-select--default');
  await page.getByRole('button', { name: 'Select', exact: true }).click();
  await page.getByRole('option', { name: 'Option 2', exact: true }).click();
  await event({ value: { name: 'Option 2', value: { test: 'option2' } } });
  await page.getByRole('listbox').waitFor({ state: 'hidden' });
  await open('atoms-select--multiple-select');
  await page.getByRole('button', { name: 'Select multiple options' }).click();
  await page.getByRole('option').filter({ hasText: 'Option 2' }).click();
  await event({ value: [{ name: 'Option 2', value: { test: 'option2' } }] });
  await page.getByRole('listbox').waitFor();
  await open('atoms-select--searchable');
  await page.getByRole('button', { name: 'Select a fruit' }).click();
  await page.getByRole('searchbox', { name: 'Search fruits...' }).fill('ban');
  await page.getByRole('option', { name: 'Banana' }).waitFor();
  assert.equal(await page.getByRole('option', { name: 'Apple' }).count(), 0);
  await open('atoms-typography--heading');
  await page.locator('gd-typography').first().waitFor();
  assert.deepEqual(
    await page
      .locator('gd-typography')
      .evaluateAll((elements) =>
        elements.map((element) => element.shadowRoot?.firstElementChild?.tagName.toLowerCase())
      ),
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  );
  await open('atoms-typography--display');
  await page.waitForFunction(() =>
    [...document.querySelectorAll('gd-typography')].some((element) => element.variant === 'div')
  );
  const displayFontSizes = await page
    .locator('gd-typography')
    .evaluateAll((elements) =>
      elements
        .filter((element) => element.variant === 'div')
        .map((element) => getComputedStyle(element.shadowRoot.firstElementChild).fontSize)
    );
  assert.equal(new Set(displayFontSizes).size, 5);
  await open('atoms-slider--default');
  const slider = page.getByRole('slider', { name: 'Slider' });
  await slider.fill('55');
  await event({ value: 55 });
  await open('atoms-sliderdots--default');
  await page.getByRole('tab', { name: 'Go to slide 3' }).click();
  await event({ index: 2 });
  await open('atoms-switch--default');
  await page.locator('gd-switch label').click();
  await event({ checked: true });
  await open('atoms-switch--with-loading');
  await page.locator('gd-switch label').click();
  await page.getByText('Loading: Yes (3 seconds)', { exact: true }).waitFor();
  assert.ok(await page.locator('input').isDisabled());
  await page.getByText('Current state: ON', { exact: true }).waitFor();
  await page.getByText('Loading: No', { exact: true }).waitFor();
  await open('atoms-textarea--default');
  await page.getByRole('textbox').fill('Updated comment');
  await event({ value: 'Updated comment' });
  await open('atoms-toggle--default');
  await page.getByRole('button', { name: 'Option 2', exact: true }).click();
  await event({ value: 'Option 2' });
  await open('atoms-truncate--line-truncation');
  assert.equal(
    await page
      .locator('gd-truncate')
      .evaluate((element) => getComputedStyle(element.shadowRoot.querySelector('[part="content"]')).webkitLineClamp),
    '2'
  );
  await open('atoms-wrapper--custom-tag-wrapper');
  assert.equal(
    await page.locator('gd-wrapper').evaluate((element) => element.shadowRoot.firstElementChild.tagName),
    'SECTION'
  );
  await open('molecules-counter--adjusted-max-value-5');
  await page.getByRole('button', { name: 'Increment counter', exact: true }).click();
  await event({ value: 2 });
  await page.getByRole('button', { name: 'Decrement counter', exact: true }).click();
  await event({ value: 1 });
  assert.ok(await page.getByRole('button', { name: 'Decrement counter', exact: true }).isDisabled());
  await page.getByRole('spinbutton', { name: 'Quantity value' }).fill('99');
  await page.getByRole('spinbutton', { name: 'Quantity value' }).press('Tab');
  await event({ value: 5 });
  assert.ok(await page.getByRole('button', { name: 'Increment counter', exact: true }).isDisabled());
  const menuClosed = () =>
    page.waitForFunction(() => {
      const menu = document.querySelector('gd-menu');
      const content = menu?.shadowRoot.querySelector('[popover]');
      return (
        menu &&
        content &&
        !menu.open &&
        !content.matches(':popover-open') &&
        getComputedStyle(content).display === 'none'
      );
    });
  await open('molecules-menu--default');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await event({ data: { name: 'Profile', value: 'profile' }, value: 'profile' });
  await menuClosed();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await menuClosed();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).waitFor();
  await page.mouse.click(1270, 890);
  await menuClosed();
  await open('molecules-menu--close-on-select-false');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await event({ data: { name: 'Settings', value: 'settings' }, value: 'settings' });
  await page.getByRole('button', { name: 'Profile', exact: true }).waitFor();
  await open('molecules-menu--with-edit-and-delete-modals');
  for (const action of ['Edit', 'Delete']) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('button', { name: action, exact: true }).click();
    await page.getByRole('dialog').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: action, exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
  }
  console.log(
    `Verified ${stories.length} native component stories and representative interactions for every interactive atom and molecule.`
  );
}
