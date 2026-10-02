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
export async function checkNativeStories(page, base) {
  const index = await (await page.request.get(`${base}/web-components/index.json`)).json();
  for (const [component, sourceArgTypes] of Object.entries(reactArgTypes)) {
    const title = `${component === 'Counter' || component === 'Menu' ? 'Molecules' : 'Atoms'}/${component}`;
    const entry = Object.values(index.entries).find(
      (candidate) => candidate.type === 'story' && candidate.title === title
    );
    assert.ok(entry, `${title} must have a Web Component story`);
    await page.goto(`${base}/web-components/iframe.html?id=${entry.id}&viewMode=story`);
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
  const badgeIcons = index.entries['atoms-badge--with-icons'];
  assert.ok(badgeIcons, 'Atoms/Badge WithIcons must exist');
  await page.goto(`${base}/web-components/iframe.html?id=${badgeIcons.id}&viewMode=story`);
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
  await page.goto(`${base}/iframe.html?id=react-atoms-badge--with-icons&viewMode=story`);
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
      assert.ok(Math.abs(web.icons[iconIndex].centerOffset) < 1, `Badge ${index + 1} icon must be vertically centered`);
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
    await page.goto(`${base}/web-components/iframe.html?id=${story.id}&viewMode=story`);
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
    await page.goto(`${base}/web-components/iframe.html?id=${story.id}&viewMode=story`);
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
    await page.goto(`${base}/web-components/iframe.html?id=${id}&viewMode=story`);
    await page.locator('#storybook-root').waitFor();
  };
  const event = async (detail) =>
    page
      .locator('output')
      .filter({ hasText: JSON.stringify(detail) })
      .waitFor();
  await open('atoms-button--disabled');
  await page.getByRole('button', { name: 'Button', exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'Button', exact: true }).isDisabled());
  await open('atoms-input--default');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('Updated value');
  await event({ value: 'Updated value' });
  await open('atoms-input--read-only');
  assert.ok(
    await page
      .getByRole('textbox', { name: 'Label', exact: true })
      .isEditable()
      .then((value) => !value)
  );
  await open('atoms-checkbox--default');
  // The native input is visually hidden; users activate its visible label.
  await page.locator('gd-checkbox label').click();
  await event({ checked: true });
  await page.locator('gd-checkbox label').click();
  await event({ checked: false });
  await open('atoms-select--default');
  await page.getByRole('button', { name: 'Choose an option' }).click();
  await page.getByRole('option', { name: 'Beta' }).click();
  await event({ value: { name: 'Beta', value: 'b' } });
  await page.getByRole('listbox').waitFor({ state: 'hidden' });
  await open('atoms-select--multiple');
  await page.getByRole('button', { name: 'Alpha, Gamma' }).click();
  await page.getByRole('option', { name: 'Beta' }).click();
  await event({
    value: [
      { name: 'Alpha', value: 'a' },
      { name: 'Gamma', value: 'c' },
      { name: 'Beta', value: 'b' },
    ],
  });
  await page.getByRole('listbox').waitFor();
  await open('atoms-select--searchable');
  await page.getByRole('button', { name: 'Choose an option' }).click();
  await page.getByRole('searchbox', { name: 'Search options' }).fill('bet');
  await page.getByRole('option', { name: 'Beta' }).waitFor();
  assert.equal(await page.getByRole('option', { name: 'Alpha' }).count(), 0);
  await open('atoms-typography--all-variants');
  assert.equal(await page.locator('gd-typography').count(), 18);
  assert.deepEqual(
    await page
      .locator('gd-typography')
      .evaluateAll((elements) =>
        elements.map((element) => element.shadowRoot?.firstElementChild?.tagName.toLowerCase())
      ),
    [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'small',
      'div',
      'span',
      'strong',
      'i',
      'code',
      'kbd',
      'span',
      'header',
      'sup',
      'sub',
    ]
  );
  await open('atoms-typography--display-sizes');
  const displayFontSizes = await page
    .locator('gd-typography')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element.shadowRoot.firstElementChild).fontSize)
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
  await open('molecules-counter--default');
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
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await event({ data: { name: 'Edit', value: 'edit' }, value: 'edit' });
  await menuClosed();
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'Edit', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await menuClosed();
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'Edit', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Outside menu' }).click();
  await menuClosed();
  await open('molecules-menu--keep-open-on-select');
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await event({ data: { name: 'Archive', value: 'archive' }, value: 'archive' });
  await page.getByRole('button', { name: 'Edit', exact: true }).waitFor();
  console.log(
    `Verified ${stories.length} native component stories and representative interactions for every interactive atom and molecule.`
  );
}
