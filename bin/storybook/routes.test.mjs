import assert from 'node:assert/strict';
import test from 'node:test';
import { legacyReactIds, legacyRouteAliases, sharedDocIds, legacyRedirect, legacyRedirectHead } from './routes.mjs';

const origin = 'https://storybook.example';

test('every legacy story and docs route resolves to its canonical root', () => {
  for (const id of legacyReactIds) {
    const kind = id.endsWith('--docs') ? 'docs' : 'story';
    const href = `${origin}/?path=/${kind}/${id}&args=size:sm&globals=theme:dark#example`;
    const result = new URL(legacyRedirect(href, legacyReactIds, sharedDocIds, legacyRouteAliases) || href);
    const canonical = legacyRouteAliases[id] ?? (sharedDocIds.includes(id) ? id : `react-${id}`);
    assert.equal(result.searchParams.get('path'), `/${kind}/${canonical}`);
    assert.equal(result.searchParams.get('args'), 'size:sm');
    assert.equal(result.searchParams.get('globals'), 'theme:dark');
    assert.equal(result.hash, '#example');
  }
});

test('retired Loader scenes redirect to the current default scene', () => {
  for (const id of Object.keys(legacyRouteAliases)) {
    for (const route of [`/?path=/story/${id}`, `/?path=/story/react-${id}`, `/iframe.html?id=${id}`]) {
      const result = new URL(legacyRedirect(origin + route, legacyReactIds, sharedDocIds, legacyRouteAliases));
      assert.equal(
        (result.searchParams.get('path') || result.searchParams.get('id')).replace(/^\/story\//, ''),
        'react-atoms-loader--default'
      );
    }
  }
});

test('iframe links retain their view mode and args', () => {
  const result = new URL(
    legacyRedirect(`${origin}/iframe.html?id=atoms-button--docs&viewMode=docs&args=size:sm`, legacyReactIds)
  );
  assert.equal(result.pathname, '/iframe.html');
  assert.equal(result.searchParams.get('id'), 'react-atoms-button--docs');
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
  assert.equal(new URL(calls[0]).searchParams.get('path'), '/docs/react-atoms-button--docs');
});
