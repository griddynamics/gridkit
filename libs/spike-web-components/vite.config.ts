import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/spike-web-components',
  plugins: [nxViteTsPaths(), dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') })],
  build: {
    outDir: '../../dist/libs/spike-web-components',
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: 'src/index.ts',
      name: 'spike-web-components',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit(\/.*)?$/, /^gd-design-core(\/.*)?$/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
