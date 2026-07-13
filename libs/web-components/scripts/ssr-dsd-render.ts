/**
 * CTORNDSD-581 exit artifact — SSR / Declarative Shadow DOM (DSD) smoke check for
 * `gd-button` and `gd-typography`. Uses Lit's own SSR tooling (`@lit-labs/ssr`), added only
 * to this package's own package.json.
 *
 * Loaded via Vite's `ssrLoadModule` (see run-ssr-dsd-check.mjs) rather than run directly
 * under a generic Node/TS runner, so the `gd-design-core` bare-specifier import resolves
 * exactly the way it does in this package's real dev/build (via `nxViteTsPaths()` in
 * vite.config.ts) instead of falling back to a plain Node module-resolution algorithm that
 * doesn't understand the Nx workspace's TS path mappings.
 */
import '@lit-labs/ssr/lib/install-global-dom-shim.js';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import '../src/components/gd-button/gd-button';
import '../src/components/gd-typography/gd-typography';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runSsrDsdCheck() {
  const template = html`
    <gd-button variant="primary">Submit</gd-button>
    <gd-typography variant="h1" as="h1">Heading</gd-typography>
  `;

  const result = render(template);
  let out = '';
  for await (const chunk of result) out += chunk;

  const hasButtonDSD = /<gd-button[^>]*>\s*<template shadowroot="open" shadowrootmode="open">/.test(out);
  const hasTypographyDSD = /<gd-typography[^>]*>\s*<template shadowroot="open" shadowrootmode="open">/.test(out);

  const staticHtmlPath = resolve(__dirname, '../harness/ssr-dsd-static.html');
  writeFileSync(
    staticHtmlPath,
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SSR/DSD static reproduction (CTORNDSD-581) — NO client JS on this page</title>
  </head>
  <body>
    <p>This page has <strong>zero</strong> client-side JavaScript. If the button below is
    visibly styled (dark pill, not unstyled text), the browser attached the Declarative Shadow
    Root from the raw SSR HTML natively, with no hydration required.</p>
    ${out}
  </body>
</html>
`
  );

  const hydratedHtmlPath = resolve(__dirname, '../harness/ssr-dsd-hydrated.html');
  writeFileSync(
    hydratedHtmlPath,
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SSR/DSD hydration reproduction (CTORNDSD-581)</title>
  </head>
  <body>
    <p>Same server-rendered DSD markup as ssr-dsd-static.html, but this page DOES load Lit's
    client JS afterward — see ssr-dsd-hydrate-check.ts for what's actually checked.</p>
    ${out}
    <script type="module" src="./ssr-dsd-hydrate-check.ts"></script>
  </body>
</html>
`
  );

  return { out, hasButtonDSD, hasTypographyDSD, staticHtmlPath, hydratedHtmlPath };
}
