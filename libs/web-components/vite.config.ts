import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/web-components',
  plugins: [nxViteTsPaths(), dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') })],
  resolve: {
    // Standalone package: `gd-design-library/tokens` and `/icons` are resolved to libs/ui source in
    // BOTH dev and production, so the published bundle inlines the tokens, the icon catalog and the
    // `@emotion/react` `keyframes` helper the tokens use. Consumers install only `web-components`
    // and never need `gd-design-library`. Dev additionally gets hot reload of libs/ui/src/tokens.
    //
    // The tokens barrel re-exports every file in libs/ui/src/tokens, and those files resolve their
    // OWN internal imports through libs/ui's path aliases (@utils, @assets, etc. — see
    // libs/ui/tsconfig.json). nxViteTsPaths() only reliably resolves this project's own tsconfig
    // paths, not a foreign project's source pulled in transitively, so they are restated here
    // (matching the tsconfig.json `paths` override, added for the same reason).
    alias: {
      'gd-design-library/tokens': path.resolve(__dirname, '../ui/src/tokens/index.ts'),
      'gd-design-library/icons': path.resolve(__dirname, '../ui/src/icons/index.ts'),
      '@utils': path.resolve(__dirname, '../ui/src/utils'),
      '@types': path.resolve(__dirname, '../ui/src/types'),
      '@constants': path.resolve(__dirname, '../ui/src/constants'),
      '@hooks': path.resolve(__dirname, '../ui/src/hooks'),
      '@tokens': path.resolve(__dirname, '../ui/src/tokens'),
      '@components': path.resolve(__dirname, '../ui/src/components'),
      '@assets': path.resolve(__dirname, '../ui/src/assets'),
    },
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
      external: [/^lit(\/.*)?$/, /^zustand(\/.*)?$/],
      output: {
        // Flat, readable file names. The package entry must be `index.js` so it matches `main` in
        // package.json; every other preserved module is flattened to `<path_with_underscores>.js`
        // (libs/ui token modules inlined from the tokens barrel land here too).
        entryFileNames: (chunk) =>
          chunk.name === 'web-components/src/index'
            ? 'index.js'
            : `${chunk.name.replace(/^web-components\/src\//, '').replace(/[^\w.-]/g, '_')}.js`,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
