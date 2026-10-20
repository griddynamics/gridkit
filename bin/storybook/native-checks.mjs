import assert from 'node:assert/strict';

/** Trusted browser input is required for native popover light-dismiss. */
export async function checkNativeStories(page, base) {
  const index = await (await page.request.get(`${base}/web-components/index.json`)).json();
  const stories = Object.values(index.entries).filter(
    (entry) =>
      entry.type === 'story' &&
      (/^Components\/(Atoms|Molecules)\//.test(entry.title) ||
        entry.title.startsWith('Components/Layout & Structure/')) &&
      !entry.id.endsWith('--default-tokens')
  );
  const names = new Set();
  const tags = {
    chatcontainer: 'chat-container',
    flexcontainer: 'flex-container',
    inputfile: 'input-file',
    sliderdots: 'slider-dots',
  };
  for (const story of stories) {
    const name = story.title.split('/')[2].toLowerCase();
    names.add(name);
    await page.goto(`${base}/web-components/iframe.html?id=${story.id}&viewMode=story`);
    const tag = `gd-${tags[name] ?? name}`;
    if (name === 'portal') await page.getByText('Show Portal', { exact: true }).click();
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
    'chatcontainer',
    'checkbox',
    'column',
    'counter',
    'flexcontainer',
    'icon',
    'image',
    'input',
    'inputfile',
    'label',
    'link',
    'loader',
    'menu',
    'portal',
    'row',
    'scroll',
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
  assert.equal(tokenStories.length, 29, 'Every React token story port should render Web Component tokens');
  const open = async (id) => {
    await page.goto(`${base}/web-components/iframe.html?id=${id}&viewMode=story`);
    await page.locator('#storybook-root').waitFor();
    // Wait for the story's play function to finish; it drives the same controls the checks drive next.
    await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished');
    // Source stories render no <output> for events, so record the `gd-*` custom events the components dispatch.
    await page.evaluate(() => {
      window.__gdEvents = [];
      const dispatch = EventTarget.prototype.dispatchEvent;
      EventTarget.prototype.dispatchEvent = function (event) {
        if (event instanceof CustomEvent && event.type.startsWith('gd-')) {
          window.__gdEvents.push(JSON.stringify(event.detail));
        }
        return dispatch.call(this, event);
      };
    });
  };
  // Match when every key in `detail` equals the recorded event detail's value (other keys are ignored).
  const event = (detail) =>
    page.waitForFunction(
      (expected) =>
        window.__gdEvents.some((recorded) => {
          const actual = JSON.parse(recorded);
          return Object.entries(expected).every(
            ([key, value]) => JSON.stringify(actual?.[key]) === JSON.stringify(value)
          );
        }),
      detail
    );
  await open('components-layout-structure-chatcontainer--interactive-demo');
  const chatContainer = page.locator('gd-chat-container');
  await page.waitForFunction(() => document.querySelector('gd-chat-container')?.isOpen === true);
  await chatContainer.evaluate((element) => element.close());
  assert.equal(await chatContainer.evaluate((element) => element.isOpen), false);
  await chatContainer.evaluate((element) => element.open());
  assert.equal(await chatContainer.evaluate((element) => element.isOpen), true);
  const toggleEvent = chatContainer.evaluate(
    (element) =>
      new Promise((resolve) => {
        element.addEventListener('gd-toggle-sidebar', (event) => resolve(event.detail), { once: true });
        element.toggle();
      })
  );
  assert.deepEqual(await toggleEvent, { open: false });
  await open('components-layout-structure-column--default');
  assert.equal(
    await page
      .locator('gd-column')
      .first()
      .evaluate((element) => getComputedStyle(element.shadowRoot.querySelector('[part="root"]')).flexDirection),
    'column'
  );
  await open('components-layout-structure-row--default');
  assert.equal(await page.locator('gd-row').evaluate((element) => element.getAttribute('display')), 'inline-flex');
  await open('components-layout-structure-flexcontainer--default');
  assert.equal(
    await page
      .locator('gd-flex-container')
      .evaluate((element) => getComputedStyle(element.shadowRoot.querySelector('[part="root"]')).display),
    'flex'
  );
  await open('components-layout-structure-portal--rendering-in-target');
  await page.getByText('Show Portal', { exact: true }).click();
  assert.equal(
    await page
      .locator('#custom-portal-container')
      .getByText('This content is inside a portal, rendered within the green container.')
      .count(),
    1
  );
  assert.equal(await page.locator('gd-portal').evaluate((element) => element.portalRoot), null);
  await open('components-layout-structure-portal--with-wrapper-as-tag-main');
  await page.getByText('Show Portal', { exact: true }).click();
  assert.equal(await page.locator('gd-portal').evaluate((element) => element.portalRoot?.tagName), 'MAIN');
  assert.deepEqual(
    await page
      .locator('gd-portal')
      .evaluate((element) => [...element.portalRoot.children].map((child) => child.tagName)),
    ['GD-TYPOGRAPHY', 'GD-LINK'],
    'Wrapped Portal stories should preserve the React child structure without an extra demo section'
  );
  await page.getByText('Hide', { exact: true }).click();
  assert.equal(await page.locator('gd-portal').count(), 0);
  await open('components-layout-structure-scroll--interactive-example');
  const scroll = page.locator('gd-scroll');
  await page.waitForFunction(() => {
    const element = document.querySelector('gd-scroll');
    return element?.shadowRoot?.querySelectorAll('[part~="scrollbar"]').length === 2;
  });
  assert.deepEqual(
    await scroll.evaluate((element) => ({
      host: [element.getBoundingClientRect().width, element.getBoundingClientRect().height],
      client: [element.clientWidth, element.clientHeight],
      extent: [element.scrollWidth, element.scrollHeight],
      border: getComputedStyle(element).borderWidth,
      bars: [
        element.shadowRoot.querySelector('[part="scrollbars"]').getBoundingClientRect().width,
        element.shadowRoot.querySelector('[part="scrollbars"]').getBoundingClientRect().height,
      ],
      verticalTrack: [
        element.shadowRoot.querySelector('[part~="vertical-scrollbar"]').getBoundingClientRect().width,
        element.shadowRoot.querySelector('[part~="vertical-scrollbar"]').getBoundingClientRect().height,
      ],
      horizontalTrack: [
        element.shadowRoot.querySelector('[part~="horizontal-scrollbar"]').getBoundingClientRect().width,
        element.shadowRoot.querySelector('[part~="horizontal-scrollbar"]').getBoundingClientRect().height,
      ],
    })),
    {
      host: [300, 200],
      client: [298, 198],
      extent: [600, 700],
      border: '1px',
      bars: [297, 197],
      verticalTrack: [8, 189],
      horizontalTrack: [289, 8],
    }
  );
  await scroll.hover();
  await page.mouse.wheel(0, 80);
  await page.waitForFunction(() => document.querySelector('gd-scroll').scrollTop > 0);
  const wheelTop = await scroll.evaluate((element) => element.scrollTop);
  await scroll.evaluate((element) => (element.tabIndex = 0));
  await scroll.focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction((previousTop) => document.querySelector('gd-scroll').scrollTop > previousTop, wheelTop);
  // Chromium animates the native keyboard scroll. Let it settle before checking an
  // independent imperative scroll so the in-flight key action cannot overwrite it.
  await page.waitForTimeout(350);
  await scroll.evaluate((element) => element.scrollTo({ top: 100, left: 100 }));
  await page.waitForFunction(() => {
    const element = document.querySelector('gd-scroll');
    return (
      element.scrollTop === 100 &&
      element.scrollLeft === 100 &&
      Number.parseFloat(element.shadowRoot.querySelector('[part~="vertical-thumb"]').style.top) > 0 &&
      Number.parseFloat(element.shadowRoot.querySelector('[part~="horizontal-thumb"]').style.left) > 0
    );
  });
  await scroll.evaluate((element) => element.scrollTo({ top: 0, left: 0 }));
  await page.waitForFunction(() => document.querySelector('gd-scroll').scrollTop === 0);
  const verticalThumb = scroll.locator('[part~="vertical-thumb"]');
  const verticalTrack = scroll.locator('[part~="vertical-scrollbar"]');
  const [thumbBox, trackBox] = await Promise.all([verticalThumb.boundingBox(), verticalTrack.boundingBox()]);
  assert.ok(thumbBox && trackBox, 'Scroll thumb and track should have browser geometry');
  await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(trackBox.x + trackBox.width / 2, trackBox.y + trackBox.height - 2);
  await page.mouse.up();
  await page.waitForFunction(() => document.querySelector('gd-scroll').scrollTop > 100);
  await open('components-layout-structure-scroll--vertical-scroll-only');
  await page.waitForFunction(() => document.querySelector('gd-scroll')?.scrollHeight > 198);
  assert.deepEqual(
    await page.locator('gd-scroll').evaluate((element) => ({
      extent: [element.scrollWidth, element.scrollHeight],
      vertical: Boolean(element.shadowRoot.querySelector('[part~="vertical-scrollbar"]')),
      horizontal: Boolean(element.shadowRoot.querySelector('[part~="horizontal-scrollbar"]')),
    })),
    { extent: [298, 500], vertical: true, horizontal: false }
  );
  await open('components-layout-structure-scroll--horizontal-scroll-only');
  await page.waitForFunction(() => document.querySelector('gd-scroll')?.scrollWidth > 298);
  assert.deepEqual(
    await page.locator('gd-scroll').evaluate((element) => ({
      extent: [element.scrollWidth, element.scrollHeight],
      vertical: Boolean(element.shadowRoot.querySelector('[part~="vertical-scrollbar"]')),
      horizontal: Boolean(element.shadowRoot.querySelector('[part~="horizontal-scrollbar"]')),
    })),
    { extent: [1020, 198], vertical: false, horizontal: true }
  );
  await open('components-layout-structure-scroll--auto-hide-scrollbars');
  await page.waitForFunction(() =>
    document.querySelector('gd-scroll')?.shadowRoot?.querySelector('[part~="vertical-scrollbar"]')
  );
  await page.mouse.move(0, 0);
  const autoHideScrollbar = page.locator('gd-scroll').locator('[part~="vertical-scrollbar"]');
  // The story's parity play function performs a keyboard scroll before finishing.
  // Wait for that activity's auto-hide timer rather than assuming an untouched story.
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector('gd-scroll').shadowRoot.querySelector('[part~="vertical-scrollbar"]'))
        .opacity === '0'
  );
  assert.equal(await autoHideScrollbar.evaluate((element) => getComputedStyle(element).opacity), '0');
  await page.locator('gd-scroll').evaluate((element) => element.scrollTo({ top: 40 }));
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector('gd-scroll').shadowRoot.querySelector('[part~="vertical-scrollbar"]'))
        .opacity === '0.2'
  );
  await page.waitForTimeout(1250);
  assert.equal(await autoHideScrollbar.evaluate((element) => getComputedStyle(element).opacity), '0');
  await open('components-layout-structure-scroll--auto-hide-vertical-only');
  await page.waitForFunction(() => document.querySelector('gd-scroll')?.scrollHeight === 980);
  assert.deepEqual(
    await page.locator('gd-scroll').evaluate((element) => ({
      extent: [element.scrollWidth, element.scrollHeight],
      vertical: Boolean(element.shadowRoot.querySelector('[part~="vertical-scrollbar"]')),
      horizontal: Boolean(element.shadowRoot.querySelector('[part~="horizontal-scrollbar"]')),
    })),
    { extent: [298, 980], vertical: true, horizontal: false }
  );
  await open('components-atoms-button--disabled-button');
  await page.getByRole('button', { name: 'Disabled Button', exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'Disabled Button', exact: true }).isDisabled());
  await open('components-atoms-input--primary-default-with-label-and-helper-text');
  // The story's play function types "hello" after render; wait for it so it cannot overwrite the fill below.
  await page.waitForFunction(
    () => document.querySelector('gd-input')?.shadowRoot?.querySelector('input')?.value === 'hello'
  );
  // The wrapping <label> also contains the helper text, so the accessible name is "Label Helper text".
  await page.getByRole('textbox', { name: /^Label/ }).fill('Updated value');
  await event({ value: 'Updated value' });
  await open('components-atoms-input--read-only');
  assert.ok(
    await page
      .getByRole('textbox')
      .isEditable()
      .then((value) => !value)
  );
  await open('components-atoms-checkbox--default');
  // The native input is visually hidden; users activate its visible label.
  // The story's play function leaves the checkbox checked, so the first click unchecks it.
  await page.locator('gd-checkbox label').click();
  await event({ checked: false });
  await page.locator('gd-checkbox label').click();
  await event({ checked: true });
  // Select triggers are named by their current value, so address them through the gd-select host.
  const openSelect = async () => {
    await page.waitForFunction(() => document.querySelector('gd-select')?.shadowRoot?.querySelector('.trigger'));
    await openSelect();
  };
  await open('components-atoms-select--default');
  await openSelect();
  await page.getByRole('option', { name: 'Option 3' }).click();
  await event({ value: { name: 'Option 3', value: 'option3' } });
  await page.getByRole('listbox').waitFor({ state: 'hidden' });
  await open('components-atoms-select--multiple-select');
  await openSelect();
  await page.getByRole('option', { name: /Option 3/ }).click();
  await event({
    value: [
      { name: 'Option 2', value: { test: 'option2' } },
      { name: 'Option 3', value: 'option3' },
    ],
  });
  await page.getByRole('listbox').waitFor();
  await open('components-atoms-select--searchable');
  await openSelect();
  await page.getByRole('textbox', { name: 'Search fruits...' }).fill('ban');
  await page.getByRole('option', { name: 'Banana' }).waitFor();
  assert.equal(await page.getByRole('option', { name: 'Apple' }).count(), 0);
  await open('components-atoms-typography--heading');
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
  await open('components-atoms-typography--display');
  const displayFontSizes = await page
    .locator('gd-typography')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element.shadowRoot.firstElementChild).fontSize)
    );
  assert.equal(new Set(displayFontSizes).size, 5);
  await open('components-atoms-slider--default');
  const slider = page.getByRole('slider', { name: 'Slider' });
  await slider.fill('55');
  await event({ value: 55 });
  await open('components-atoms-sliderdots--default');
  await page.getByRole('tab', { name: 'Go to slide 3' }).click();
  await event({ index: 2 });
  await open('components-atoms-switch--default');
  await page.locator('gd-switch label').click();
  await event({ checked: true });
  await open('components-atoms-textarea--default');
  await page.getByRole('textbox').fill('Updated comment');
  await event({ value: 'Updated comment' });
  await open('components-atoms-toggle--default');
  await page.getByRole('button', { name: 'Option 2', exact: true }).click();
  await event({ value: 'Option 2' });
  await open('components-atoms-truncate--line-truncation');
  assert.equal(
    await page
      .locator('gd-truncate')
      .evaluate((element) => getComputedStyle(element.shadowRoot.querySelector('[part="content"]')).webkitLineClamp),
    '2'
  );
  await open('components-atoms-wrapper--custom-tag-wrapper');
  assert.equal(
    await page.locator('gd-wrapper').evaluate((element) => element.shadowRoot.firstElementChild.tagName),
    'SECTION'
  );
  await open('components-molecules-counter--default');
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
  await open('components-molecules-menu--default');
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
  await open('components-molecules-menu--close-on-select-false');
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await event({ data: { name: 'Archive', value: 'archive' }, value: 'archive' });
  await page.getByRole('button', { name: 'Edit', exact: true }).waitFor();
  console.log(
    `Verified ${stories.length} native component stories and representative interactions for every interactive atom and molecule.`
  );
}
