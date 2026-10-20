import assert from 'node:assert/strict';
import test from 'node:test';
import {
  legacyReactIds,
  sharedDocIds,
  legacyRedirect,
  legacyRedirectHead,
  migratedReactId,
  webComponentsRedirect,
  webComponentsRedirectHead,
} from './routes.mjs';

const origin = 'https://storybook.example';

test('every legacy story and docs route resolves to its canonical root', () => {
  for (const id of legacyReactIds) {
    const kind = id.endsWith('--docs') ? 'docs' : 'story';
    const href = `${origin}/?path=/${kind}/${id}&args=size:sm&globals=theme:dark#example`;
    const result = new URL(legacyRedirect(href, legacyReactIds, sharedDocIds) || href);
    assert.equal(result.searchParams.get('path'), `/${kind}/${sharedDocIds.includes(id) ? id : migratedReactId(id)}`);
    assert.equal(result.searchParams.get('args'), 'size:sm');
    assert.equal(result.searchParams.get('globals'), 'theme:dark');
    assert.equal(result.hash, '#example');
  }
});

test('iframe links retain their view mode and args', () => {
  const result = new URL(
    legacyRedirect(`${origin}/iframe.html?id=atoms-button--docs&viewMode=docs&args=size:sm`, legacyReactIds)
  );
  assert.equal(result.pathname, '/iframe.html');
  assert.equal(result.searchParams.get('id'), 'react-components-atoms-button--docs');
  assert.equal(result.searchParams.get('viewMode'), 'docs');
  assert.equal(result.searchParams.get('args'), 'size:sm');
});

test('bare docs links become manager routes', () => {
  const result = new URL(
    legacyRedirect(`${origin}/docs/introduction-welcome--docs#intro`, legacyReactIds, sharedDocIds)
  );
  assert.equal(result.pathname, '/');
  assert.equal(result.searchParams.get('path'), '/docs/introduction-welcome--docs');
  assert.equal(result.hash, '#intro');
});

test('canonical, composed, unrelated and unknown routes are not redirected', () => {
  for (const path of [
    '/?path=/docs/introduction-welcome--docs',
    '/?path=/docs/react-introduction-getting-started--docs',
    '/?path=/story/web-components_introduction-overview--overview',
    '/?path=/docs/react-components-atoms-button--docs',
    '/?path=/docs/web-components_components-atoms-button--docs',
    '/web-components/?path=/story/introduction-overview--overview',
    '/?path=/docs/unknown--docs',
    '/docs/api',
    '/',
  ])
    assert.equal(legacyRedirect(origin + path, legacyReactIds, sharedDocIds), null);
});

test('all interim React shared-doc links redirect once, including iframe and bare routes', () => {
  for (const id of sharedDocIds) {
    for (const path of [`/?path=/docs/react-${id}`, `/iframe.html?id=react-${id}`, `/docs/react-${id}`]) {
      const href = `${origin}${path}&args=size:sm#section`;
      // Bare routes have no query marker yet.
      const input = path.startsWith('/docs/') ? href.replace('&args=', '?args=') : href;
      const result = new URL(legacyRedirect(input, legacyReactIds, sharedDocIds));
      assert.equal(
        result.searchParams.get('id') || result.searchParams.get('path'),
        path.startsWith('/iframe') ? id : `/docs/${id}`
      );
      assert.equal(result.searchParams.get('args'), 'size:sm');
      assert.equal(result.hash, '#section');
      assert.equal(legacyRedirect(result.href, legacyReactIds, sharedDocIds), null);
    }
  }
});

test('early head script also redirects shared pages without external dependencies', () => {
  const calls = [];
  const script = legacyRedirectHead().replace(/^<script>|<\/script>$/g, '');
  new Function('location', script)({
    href: `${origin}/?path=/docs/react-introduction-welcome--docs`,
    replace: (url) => calls.push(url),
  });
  assert.equal(new URL(calls[0]).searchParams.get('path'), '/docs/introduction-welcome--docs');
});

test('early head script is self-contained', () => {
  const calls = [];
  const script = legacyRedirectHead().replace(/^<script>|<\/script>$/g, '');
  new Function('location', script)({
    href: `${origin}/?path=/docs/atoms-button--docs`,
    replace: (url) => calls.push(url),
  });
  assert.equal(new URL(calls[0]).searchParams.get('path'), '/docs/react-components-atoms-button--docs');
});

test('interim React and Web Components tier links move under Components', () => {
  for (const [from, to] of [
    ['react-atoms-button--docs', 'react-components-atoms-button--docs'],
    ['react-layout-structure-row--default', 'react-components-layout-structure-row--default'],
    ['web-components_atoms-button--docs', 'web-components_components-atoms-button--docs'],
    ['web-components_molecules-counter--default', 'web-components_components-molecules-counter--default'],
  ]) {
    const kind = from.endsWith('--docs') ? 'docs' : 'story';
    const result = new URL(legacyRedirect(`${origin}/?path=/${kind}/${from}`, legacyReactIds, sharedDocIds));
    assert.equal(result.searchParams.get('path'), `/${kind}/${to}`);
  }
});

test('direct Web Components child links move under Components', () => {
  const base = `${origin}/web-components`;
  for (const [href, key, expected] of [
    [
      `${base}/?path=/story/atoms-button--default&args=variant:secondary`,
      'path',
      '/story/components-atoms-button--default',
    ],
    [`${base}/?path=/docs/molecules-counter--docs`, 'path', '/docs/components-molecules-counter--docs'],
    [
      `${base}/iframe.html?id=layout-structure-row--default&viewMode=story`,
      'id',
      'components-layout-structure-row--default',
    ],
  ])
    assert.equal(new URL(webComponentsRedirect(href)).searchParams.get(key), expected);
  assert.equal(
    new URL(
      webComponentsRedirect(`${base}/?path=/story/atoms-button--default&args=variant:secondary`)
    ).searchParams.get('args'),
    'variant:secondary'
  );
  for (const path of [
    '/?path=/story/components-atoms-button--default',
    '/?path=/story/introduction-overview--overview',
    '/iframe.html?id=introduction-overview--overview',
    '/',
  ])
    assert.equal(webComponentsRedirect(base + path), null);
});

test('Web Components early head script is self-contained', () => {
  const calls = [];
  const script = webComponentsRedirectHead().replace(/^<script>|<\/script>$/g, '');
  new Function('location', script)({
    href: `${origin}/web-components/iframe.html?id=atoms-button--default`,
    replace: (url) => calls.push(url),
  });
  assert.equal(new URL(calls[0]).searchParams.get('id'), 'components-atoms-button--default');
});

test('iframe links with legacy and interim tier IDs resolve to the Components IDs', () => {
  for (const id of ['atoms-button--default', 'react-atoms-button--default']) {
    const result = new URL(legacyRedirect(`${origin}/iframe.html?id=${id}&viewMode=story`, ['atoms-button--default']));
    assert.equal(result.searchParams.get('id'), 'react-components-atoms-button--default');
  }
});
