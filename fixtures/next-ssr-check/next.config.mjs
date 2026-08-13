import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, '../..');

/**
 * CTORNDSD-646b.
 *
 * Aliases mirror `libs/web-components/vite.config.ts`'s dev-server aliases: the Lit components
 * import the REAL token objects from `gd-design-library/tokens`, and that barrel's files resolve
 * their own internal imports through `libs/ui`'s path aliases.
 *
 * Finding worth recording: Turbopack's `resolveAlias` values are resolved **relative to
 * `turbopack.root`**, not as absolute filesystem paths. Passing an absolute path produced
 * `Can't resolve './Users/...'` plus "server relative imports are not implemented yet" — Turbopack
 * had prefixed `./` to it. Vite's `resolve.alias` accepts absolute paths, so this is a real
 * porting difference between the two bundlers, not a config typo.
 */
const nextConfig = {
  turbopack: {
    root: REPO,
    resolveAlias: {
      'gd-design-library/tokens': '../../dist/libs/ui/tokens/index.js',
      'gd-design-core': '../../dist/libs/design-core/index.js',
      // The BUILT Lit package, not its TypeScript source. See the comment above.
      'gd-design-web': '../../dist/libs/web-components/web-components.js',
    },
  },
};

export default nextConfig;
