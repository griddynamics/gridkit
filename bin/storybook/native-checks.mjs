import assert from 'node:assert/strict';

/** Trusted browser input is required for native popover light-dismiss. */
export async function checkNativeStories(page, base) {
  const index = await (await page.request.get(`${base}/web-components/index.json`)).json();
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
