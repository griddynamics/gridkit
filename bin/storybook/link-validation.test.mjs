import assert from 'node:assert/strict';
import test from 'node:test';
import { validateLinks } from './link-validation.mjs';

const indexes = {
  react: {
    entries: {
      'react-components-atoms-button--docs': { type: 'docs' },
      'theme-tokens-colors--docs': { type: 'docs' },
    },
  },
  webComponents: {
    entries: {
      'introduction-overview--overview': { type: 'story' },
      'components-atoms-button--default': { type: 'story' },
    },
  },
};

test('validates canonical, composed and child deep links', () => {
  const result = validateLinks(
    `
    [Button](?path=/docs/react-components-atoms-button--docs)
    [Colors](?path=/docs/theme-tokens-colors--docs)
    https://storybook.cto-rnd-system-design.griddynamics.net/web-components/?path=/story/introduction-overview--overview
    ?path=/story/web-components_introduction-overview--overview
    ?path=/story/web-components_components-atoms-button--default
    iframe.html?id=react-components-atoms-button--docs&viewMode=docs
  `,
    indexes
  );
  assert.equal(result.checked, 6);
  assert.deepEqual(result.errors, []);
});

test('catches stale, nonexistent, incorrectly typed and bare routes', () => {
  for (const href of [
    '?path=/docs/atoms-button--docs',
    '?path=/docs/react-atoms-button--docs',
    '?path=/story/web-components_atoms-button--default',
    '?path=/docs/react-nonexistent--docs',
    '?path=/docs/react-theme-tokens-colors--docs',
    '?path=/story/react-components-atoms-button--docs',
    '/docs/react-components-atoms-button--docs',
  ])
    assert.ok(validateLinks(href, indexes).errors.length > 0, href);
});

test('ignores example application links, external Storybooks, and portal roots', () => {
  assert.deepEqual(
    validateLinks(
      `
    <Link href="/docs/api">API</Link>
    https://example.com/?path=/docs/external--docs
    https://storybook.cto-rnd-system-design.griddynamics.net/
  `,
      indexes
    ),
    { checked: 0, errors: [] }
  );
});
