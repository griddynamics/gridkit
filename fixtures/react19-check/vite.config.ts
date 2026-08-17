import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const REPO = path.resolve(__dirname, '../..');

/**
 * CTORNDSD-646b — isolated React 19 fixture.
 *
 * `react` / `react-dom` resolve from THIS directory's own `node_modules` (19.x), while the Lit
 * components, `gd-design-core`, and `gd-design-library/tokens` resolve from the repo's workspace
 * source. That split is the whole point: the repo root stays pinned at React 18.3.1, so the
 * React 19 question can be answered without touching it.
 *
 * The `@utils`/`@types`/... aliases exist for the same reason `libs/web-components/vite.config.ts`
 * declares them: the `libs/ui/src/tokens` barrel re-exports every token file, and those files
 * resolve their own internal imports through `libs/ui`'s path aliases.
 */
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'gd-design-library/tokens': path.resolve(REPO, 'libs/ui/src/tokens/index.ts'),
      'gd-design-core': path.resolve(REPO, 'libs/design-core/src/index.ts'),
      '@utils': path.resolve(REPO, 'libs/ui/src/utils'),
      '@types': path.resolve(REPO, 'libs/ui/src/types'),
      '@constants': path.resolve(REPO, 'libs/ui/src/constants'),
      '@hooks': path.resolve(REPO, 'libs/ui/src/hooks'),
      '@tokens': path.resolve(REPO, 'libs/ui/src/tokens'),
      '@components': path.resolve(REPO, 'libs/ui/src/components'),
      '@assets': path.resolve(REPO, 'libs/ui/src/assets'),
    },
  },
  server: { fs: { allow: [REPO] } },
});
