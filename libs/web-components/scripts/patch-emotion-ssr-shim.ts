/**
 * `gd-button`/`gd-typography` resolve their tokens from the REAL `gd-design-library/tokens`
 * barrel, which transitively imports `@emotion/react`'s `keyframes` (tokens/utils.ts, used by
 * unrelated sibling tokens like the loader spinner) even though neither component's own token
 * slice touches it. `@emotion/react`'s default cache checks `typeof document !== 'undefined'`
 * to decide it's running in a browser, which `@lit-labs/ssr`'s dom-shim satisfies — but the
 * shim's `Document` class has no `querySelectorAll` (it only implements what Lit's own
 * rendering needs), so Emotion's SSR-style-tag migration call crashes. There's no real
 * pre-rendered page here to migrate styles from, so a no-op is exactly correct, not a
 * workaround — must be its own module (not inline in ssr-dsd-render.ts) since ESM imports are
 * fully evaluated before any of an importing module's own top-level statements run, regardless
 * of source-order interleaving; only a separate side-effect import, sequenced before the
 * gd-button/gd-typography imports, actually runs first.
 */
(globalThis.document as unknown as { querySelectorAll: () => unknown[] }).querySelectorAll = () => [];
