import { readFileSync } from 'node:fs';

// Frozen from the pre-migration Storybook index. Do not regenerate from the new
// index: that would hide accidentally removed stories and break old bookmarks.
export const legacyReactIds = JSON.parse(readFileSync(new URL('./legacy-react-ids.json', import.meta.url), 'utf8'));
export const storybookOrigin = 'https://storybook.cto-rnd-system-design.griddynamics.net';

/** Resolve legacy manager, iframe and bare /docs links without dropping URL state. */
export function legacyRedirect(href, ids) {
  const url = new URL(href);
  const known = new Set(ids);
  const upgrade = (id) => (known.has(id) ? `react-${id}` : id);
  const original = url.href;
  const path = url.searchParams.get('path');
  if (path) {
    url.searchParams.set(
      'path',
      path.replace(/^(\/(?:docs|story)\/)([^#?]+)/, (_, prefix, id) => prefix + upgrade(id))
    );
  } else {
    const bare = url.pathname.match(/^\/(docs|story)\/([^/]+)$/);
    if (bare && (known.has(bare[2]) || bare[2].startsWith('react-'))) {
      url.pathname = '/';
      url.searchParams.set('path', `/${bare[1]}/${upgrade(bare[2])}`);
    }
  }
  const id = url.searchParams.get('id');
  if (id && known.has(id)) url.searchParams.set('id', upgrade(id));
  // URLSearchParams may normalize encoding even when no route changed.
  const before = new URL(original);
  return url.pathname !== before.pathname ||
    url.searchParams.get('path') !== before.searchParams.get('path') ||
    url.searchParams.get('id') !== before.searchParams.get('id')
    ? url.href
    : null;
}

export function legacyRedirectHead() {
  return `<script>var migratedStorybookUrl = (${legacyRedirect.toString()})(location.href, ${JSON.stringify(legacyReactIds)}); if (migratedStorybookUrl) location.replace(migratedStorybookUrl);</script>`;
}
