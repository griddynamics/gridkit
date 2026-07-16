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
config.watchFolders = [...(config.watchFolders ?? []), designCoreSrc];

module.exports = config;
