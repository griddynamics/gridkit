import { readFileSync } from 'node:fs';

// Frozen from the pre-migration Storybook index. Do not regenerate from the new
// index: that would hide accidentally removed stories and break old bookmarks.
export const legacyReactIds = JSON.parse(readFileSync(new URL('./legacy-react-ids.json', import.meta.url), 'utf8'));
// Explicitly reviewed framework-neutral pages; other documentation stays React-scoped.
export const sharedDocs = JSON.parse(readFileSync(new URL('./shared-docs.json', import.meta.url), 'utf8'));
export const sharedDocIds = Object.values(sharedDocs);
// Retired stories keep explicit aliases so frozen legacy URLs remain valid
// without keeping obsolete scenes in the current Storybook inventory.
export const legacyRouteAliases = {
  'atoms-loader--inline-loader-button-variant': 'react-atoms-loader--default',
  'atoms-loader--loader-section-variant': 'react-atoms-loader--default',
  'atoms-loader--section-loader-button-variant': 'react-atoms-loader--default',
};
export const storybookOrigin = 'https://storybook.cto-rnd-system-design.griddynamics.net';

/** Resolve legacy manager, iframe and bare /docs links without dropping URL state. */
export function legacyRedirect(href, ids, sharedIds = [], aliases = {}) {
  const url = new URL(href);
  const known = new Set(ids);
  const shared = new Set(sharedIds);
  const upgrade = (id) => {
    const legacyId = id.startsWith('react-') ? id.slice(6) : id;
    if (aliases[legacyId]) return aliases[legacyId];
    if (shared.has(id)) return id;
    if (id.startsWith('react-') && shared.has(id.slice(6))) return id.slice(6);
    return known.has(id) ? `react-${id}` : id;
  };
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
  if (id) url.searchParams.set('id', upgrade(id));
  // URLSearchParams may normalize encoding even when no route changed.
  const before = new URL(original);
  return url.pathname !== before.pathname ||
    url.searchParams.get('path') !== before.searchParams.get('path') ||
    url.searchParams.get('id') !== before.searchParams.get('id')
    ? url.href
    : null;
}

export function legacyRedirectHead() {
  return `<script>var migratedStorybookUrl = (${legacyRedirect.toString()})(location.href, ${JSON.stringify(legacyReactIds)}, ${JSON.stringify(sharedDocIds)}, ${JSON.stringify(legacyRouteAliases)}); if (migratedStorybookUrl) location.replace(migratedStorybookUrl);</script>`;
}
