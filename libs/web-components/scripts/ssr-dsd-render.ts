/**
 * SSR / Declarative Shadow DOM (DSD) smoke check for `gd-button` and `gd-typography`. Uses
 * Lit's own SSR tooling (`@lit-labs/ssr`), added only to this package's own package.json.
 *
 * Loaded via Vite's `ssrLoadModule` (see run-ssr-dsd-check.mjs) rather than run directly
 * under a generic Node/TS runner, so the `gd-design-core` bare-specifier import resolves
 * exactly the way it does in this package's real dev/build (via `nxViteTsPaths()` in
 * vite.config.ts) instead of falling back to a plain Node module-resolution algorithm that
 * doesn't understand the Nx workspace's TS path mappings.
 */
import '@lit-labs/ssr/lib/install-global-dom-shim.js';
import './patch-emotion-ssr-shim';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defaultTheme } from 'gd-design-library/tokens';
import '../src/components/gd-button/gd-button';
import '../src/components/gd-typography/gd-typography';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runSsrDsdCheck() {
  // `.theme` must be bound explicitly. Every real token file's own `get(theme, path, fallback)`
  // fallback is a Storybook-facing placeholder that happens to be the token path itself — so a
  // themeless SSR render emits literally `font-family:theme.font.family;font-size:font.size.h1`,
  // which is invalid CSS the browser discards, and the page renders as an unstyled default button
  // in Times. That is the real components' own themeless behavior (FINDINGS.md Sections 13, 16),
  // not an SSR defect — but it makes this page contradict its own "visibly styled" instruction,
  // so the check is meaningless without a theme. Matches how every other harness supplies it
  // (`fidelity-check.tsx`, `form-participation-check.ts`).
  const template = html`
    <gd-button variant="primary" .theme=${defaultTheme}>Submit</gd-button>
    <gd-typography variant="h1" as="h1" .theme=${defaultTheme}>Heading</gd-typography>
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
    <title>SSR/DSD static reproduction — NO client JS on this page</title>
  </head>
  <body>
    <p>This page has <strong>zero</strong> client-side JavaScript. Both elements below were
    server-rendered as Declarative Shadow DOM and attached by the browser natively, with no
    hydration.</p>
    <p><strong>The heading is the positive result.</strong> It should render in Fira Sans at
    48px &mdash; not Times. That is theme-resolved CSS surviving SSR into a shadow root with no
    JavaScript at all.</p>
    <p><strong>The button is a known limitation, not a bug in this page.</strong> It renders as
    an unstyled browser default on purpose. <code>gd-button</code> is the one atom that applies
    its theme CSS through a runtime <em>constructable stylesheet</em>
    (<code>adoptedStyleSheets</code>) rather than inline styles. Only <code>static styles</code>
    and inline <code>style</code> attributes can be serialized into a
    <code>&lt;template shadowrootmode&gt;</code>; an adopted stylesheet cannot, and with zero JS
    nothing ever runs to adopt one. The other four atoms use inline styles and do not have this
    gap. See FINDINGS.md Section 2.</p>
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
    <title>SSR/DSD hydration reproduction</title>
  </head>
  <body>
    <p>Same server-rendered DSD markup as ssr-dsd-static.html, but this page DOES load Lit's
    client JS afterward — see ssr-dsd-hydrate-check.ts for what's actually checked.</p>
    <p>Unlike the static page, the button below <strong>should be fully styled</strong>: once
    client JS runs it adopts its constructable stylesheet. The results block records its
    background before and after, which is the clearest evidence of what DSD alone can and cannot
    carry.</p>
    ${out}
    <script type="module" src="./ssr-dsd-hydrate-check.ts"></script>
  </body>
</html>
`
  );

  return { out, hasButtonDSD, hasTypographyDSD, staticHtmlPath, hydratedHtmlPath };
}
