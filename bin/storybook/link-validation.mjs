import { storybookOrigin } from './routes.mjs';

// Only Storybook routes, not example application URLs such as /docs/api.
const links =
  /https?:\/\/[^\s<>"'`)\]}]+|(?:\.\/)?\?path=\/(?:docs|story)\/[^\s<>"'`)\]}]+|\/(?:docs|story)\/[a-z0-9-]+--[a-z0-9-]+|(?:\.\/|\/)?iframe\.html\?[^\s<>"'`)\]}]+/g;

export function validateLinks(text, indexes) {
  const errors = [];
  let checked = 0;
  for (const match of text.matchAll(links)) {
    const href = match[0].replaceAll('&amp;', '&');
    let url;
    try {
      url = new URL(href, storybookOrigin);
    } catch {
      // Other tools' URL templates (e.g. localhost:${PORT}) are not links.
      if (href.startsWith(storybookOrigin))
        errors.push({ line: text.slice(0, match.index).split('\n').length, href, message: 'Malformed Storybook URL' });
      continue;
    }
    if (url.origin !== storybookOrigin && !/^http:\/\/localhost:600[67]$/.test(url.origin)) continue;
    const path = url.searchParams.get('path') || url.pathname;
    const route = path.match(/^\/(docs|story)\/([^#?]+)/);
    let id = route?.[2] || url.searchParams.get('id');
    if (!id) continue;
    checked++;
    const line = text.slice(0, match.index).split('\n').length;
    let catalog = url.pathname.startsWith('/web-components/') || url.port === '6007' ? 'webComponents' : 'react';
    if (id.startsWith('web-components_')) {
      catalog = 'webComponents';
      id = id.slice('web-components_'.length);
    }
    const entry = indexes[catalog].entries[id];
    if (!entry) errors.push({ line, href, message: `Unknown or stale ${catalog} story ID: ${id}` });
    else if (route && entry.type !== route[1])
      errors.push({ line, href, message: `Expected ${entry.type} route for ${id}` });
    if (route && !url.searchParams.has('path')) {
      errors.push({ line, href, message: 'Use a manager ?path= URL, not a bare /docs/ or /story/ URL' });
    }
  }
  return { checked, errors };
}
