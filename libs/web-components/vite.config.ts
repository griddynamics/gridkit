import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({ command }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/web-components',
  plugins: [nxViteTsPaths(), dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') })],
  resolve: {
    // Dev-server-only live-source aliasing for true single-source-of-truth: resolves straight
    // to libs/ui/src/tokens (source, hot-reloaded) instead of gd-design-library's real package
    // export map, which only resolves once libs/ui is built (dist/libs/ui/tokens). This is what
    // makes editing libs/ui/src/tokens/button.ts instantly reflect in gd-button.ts without a
    // `build:ui` step in between. Gated to `command === 'serve'` so the production build (below,
    // `external: [/^gd-design-library(\/.*)?$/]`) still externalizes the real package instead of
    // inlining the whole libs/ui source tree — the point of the dev alias is hot-reload
    // ergonomics, not a production bundling strategy.
    alias:
      command === 'serve'
        ? {
            'gd-design-library/tokens': path.resolve(__dirname, '../ui/src/tokens/index.ts'),
            // The tokens barrel (above) re-exports every file in libs/ui/src/tokens, and those
            // files resolve their OWN internal imports through libs/ui's own path aliases
            // (@utils, @assets, etc. — see libs/ui/tsconfig.json). nxViteTsPaths() only
            // reliably resolves this project's own tsconfig paths, not a foreign project's
            // source pulled in transitively, so these are restated here (matching the
            // tsconfig.json `paths` override, added for the same reason).
            '@utils': path.resolve(__dirname, '../ui/src/utils'),
            '@types': path.resolve(__dirname, '../ui/src/types'),
            '@constants': path.resolve(__dirname, '../ui/src/constants'),
            '@hooks': path.resolve(__dirname, '../ui/src/hooks'),
            '@tokens': path.resolve(__dirname, '../ui/src/tokens'),
            '@components': path.resolve(__dirname, '../ui/src/components'),
            '@assets': path.resolve(__dirname, '../ui/src/assets'),
          }
        : {},
  },
  build: {
    outDir: '../../dist/libs/web-components',
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: 'src/index.ts',
      name: 'web-components',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit(\/.*)?$/, /^gd-design-core(\/.*)?$/, /^gd-design-library(\/.*)?$/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
}));
