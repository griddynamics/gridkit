import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { copyFileSync } from 'fs';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/form-configurator',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
    {
      name: 'copy-css',
      writeBundle() {
        const sourceFile = path.join(__dirname, '../styles/general.css');
        const destFile = path.join(__dirname, '../../../dist/libs/form-configurator/index.css');
        copyFileSync(sourceFile, destFile);
        console.log('✓ Copied general.css to index.css');
      },
    },
  ],
  build: {
    outDir: '../../../dist/libs/form-configurator',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'form-configurator',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['ajv', 'ajv-formats', 'zustand', 'core-js'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
  optimizeDeps: {
    include: ['zustand', 'ajv', 'ajv-formats', 'core-js'],
  },
});
