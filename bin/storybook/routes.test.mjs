import assert from 'node:assert/strict';
import test from 'node:test';
import { legacyReactIds, legacyRedirect, legacyRedirectHead } from './routes.mjs';

const origin = 'https://storybook.example';

test('every legacy story and docs route redirects to its React ID', () => {
  for (const id of legacyReactIds) {
    const kind = id.endsWith('--docs') ? 'docs' : 'story';
    const result = new URL(
      legacyRedirect(`${origin}/?path=/${kind}/${id}&args=size:sm&globals=theme:dark#example`, legacyReactIds)
    );
    assert.equal(result.searchParams.get('path'), `/${kind}/react-${id}`);
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
  assert.equal(result.searchParams.get('id'), 'react-atoms-button--docs');
  assert.equal(result.searchParams.get('viewMode'), 'docs');
  assert.equal(result.searchParams.get('args'), 'size:sm');
});

test('bare docs links become manager routes', () => {
  const result = new URL(legacyRedirect(`${origin}/docs/introduction-welcome--docs#intro`, legacyReactIds));
  assert.equal(result.pathname, '/');
  assert.equal(result.searchParams.get('path'), '/docs/react-introduction-welcome--docs');
  assert.equal(result.hash, '#intro');
});

test('canonical, composed, unrelated and unknown routes are not redirected', () => {
  for (const path of [
    '/?path=/docs/react-introduction-welcome--docs',
    '/?path=/story/web-components_introduction-overview--overview',
    '/web-components/?path=/story/introduction-overview--overview',
    '/?path=/docs/unknown--docs',
    '/docs/api',
    '/',
  ])
    assert.equal(legacyRedirect(origin + path, legacyReactIds), null);
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
