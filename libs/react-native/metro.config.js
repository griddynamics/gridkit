const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * `gd-design-core` is resolved straight to its TS source (`libs/design-core/src`), the same
 * single-source-of-truth approach `libs/web-components`'s vite config uses for `gd-design-library`
 * (see that project's `vite.config.ts` dev-server alias) — no build step in between, and editing a
 * token resolver is reflected immediately. Metro has no tsconfig-paths awareness, so the mapping
 * is restated here via `resolver.extraNodeModules`, mirroring `tsconfig.json`'s `paths` entry.
 */
const designCoreSrc = path.resolve(__dirname, '../design-core/src');
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'gd-design-core': designCoreSrc,
};
// Metro refuses to *read* files outside `projectRoot` unless they fall under an explicit
// `watchFolders` entry, even once the resolver is willing to point there. Narrowly scoped to the
// one source tree actually consumed — NOT the whole monorepo root, which would pull the main
// repo's own `node_modules` (a second React/RN copy, duplicate haste-module names) into Metro's
// watch/crawl set.
// `dist/libs/ui` is the same kind of narrowly-scoped exception, for the same reason — App.tsx's
// harness-only `dist/libs/ui/styles.css` import (real Fira Sans font + reset, for visual-fidelity
// comparison against the real gd-design-library web render) needs it, and it doesn't exist
// otherwise.
const uiDist = path.resolve(__dirname, '../../dist/libs/ui');
config.watchFolders = [...(config.watchFolders ?? []), designCoreSrc, uiDist];

/**
 * `react-native` itself is hoisted to the monorepo root (no version conflict there, unlike
 * `react`), so its internals resolve `require('react')` via normal hierarchical node_modules
 * lookup starting from `<root>/node_modules/react-native`, landing one directory up on the
 * root's `react@18.3.1` — a *different* copy than the one this package's own pinned
 * `react@18.2.0` resolves to for `App.tsx`/GdButton components. Two React copies means two hooks
 * dispatchers, causing "Invalid hook call" / "Cannot read property 'useState' of null" at runtime
 * (the same root cause the README's Jest `moduleNameMapper` fixes for tests).
 *
 * `resolver.extraNodeModules` can't fix this — it's a fallback consulted only when normal
 * hierarchical lookup *fails*, and lookup for `react` always succeeds (at the root copy) before
 * reaching it. `resolver.resolveRequest` is the actual override hook, so intercept `react` and
 * its subpath imports (e.g. `react/jsx-runtime`) here and force them to this package's own copy,
 * regardless of which file in the dependency graph is requiring them.
 */
const localReactDir = path.resolve(__dirname, 'node_modules/react');
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    const redirected = path.join(localReactDir, moduleName.slice('react'.length));
    return (defaultResolveRequest ?? context.resolveRequest)(context, redirected, platform);
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
