import { readFileSync } from 'node:fs';

// Frozen from the pre-migration Storybook index. Do not regenerate from the new
// index: that would hide accidentally removed stories and break old bookmarks.
export const legacyReactIds = JSON.parse(readFileSync(new URL('./legacy-react-ids.json', import.meta.url), 'utf8'));
// Explicitly reviewed framework-neutral pages; other documentation stays React-scoped.
export const sharedDocs = JSON.parse(readFileSync(new URL('./shared-docs.json', import.meta.url), 'utf8'));
export const sharedDocIds = Object.values(sharedDocs);
export const storybookOrigin = 'https://storybook.cto-rnd-system-design.griddynamics.net';

/** Canonical React ID for a frozen legacy ID (tier groups live under Components). */
export function migratedReactId(id) {
  return `react-${id}`.replace(
    /^react-(atoms|molecules|organisms|layout-structure|templates)-/,
    'react-components-$1-'
  );
}

/** Resolve legacy manager, iframe and bare /docs links without dropping URL state. */
export function legacyRedirect(href, ids, sharedIds = []) {
  const url = new URL(href);
  const known = new Set(ids);
  const shared = new Set(sharedIds);
  // Atomic tiers moved under a Components parent: atoms-button -> components-atoms-button.
  const tiers = '(atoms|molecules|organisms|layout-structure|templates)';
  const nest = (id) => id.replace(new RegExp(`^(react-|web-components_)?${tiers}-`), '$1components-$2-');
  const upgrade = (id) => {
    if (shared.has(id)) return id;
    if (id.startsWith('react-') && shared.has(id.slice(6))) return id.slice(6);
    return known.has(id) ? nest(`react-${id}`) : nest(id);
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
  return `<script>var migratedStorybookUrl = (${legacyRedirect.toString()})(location.href, ${JSON.stringify(legacyReactIds)}, ${JSON.stringify(sharedDocIds)}); if (migratedStorybookUrl) location.replace(migratedStorybookUrl);</script>`;
}

/** Redirect pre-Components Web Components URLs opened directly on the child Storybook. */
export function webComponentsRedirect(href) {
  const url = new URL(href);
  const upgrade = (id) => id.replace(/^(atoms|molecules|layout-structure)-/, 'components-$1-');
  const original = url.href;
  const path = url.searchParams.get('path');
  if (path) {
    url.searchParams.set(
      'path',
      path.replace(/^(\/(?:docs|story)\/)([^#?]+)/, (_, prefix, id) => prefix + upgrade(id))
    );
  }
  const id = url.searchParams.get('id');
  if (id) url.searchParams.set('id', upgrade(id));
  const before = new URL(original);
  return url.searchParams.get('path') !== before.searchParams.get('path') ||
    url.searchParams.get('id') !== before.searchParams.get('id')
    ? url.href
    : null;
}

export function webComponentsRedirectHead() {
  return `<script>var migratedWebComponentsUrl = (${webComponentsRedirect.toString()})(location.href); if (migratedWebComponentsUrl) location.replace(migratedWebComponentsUrl);</script>`;
}
