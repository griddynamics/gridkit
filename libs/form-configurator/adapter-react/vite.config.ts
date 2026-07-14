import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/form-configurator/adapter-react',
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'), pathsToAliases: false }),
  ] as any,
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, '../../../libs/ui/src/utils'),
      '@constants': path.resolve(__dirname, '../../../libs/ui/src/constants'),
      '@types': path.resolve(__dirname, '../../../libs/ui/src/types'),
      '@hooks': path.resolve(__dirname, '../../../libs/ui/src/hooks'),
      '@tokens': path.resolve(__dirname, '../../../libs/ui/src/tokens'),
      '@components': path.resolve(__dirname, '../../../libs/ui/src/components'),
      '@assets': path.resolve(__dirname, '../../../libs/ui/src/assets'),
    },
  },
  build: {
    outDir: '../../../dist/libs/form-configurator/adapter-react',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'form-configurator-adapter-react',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'gd-form-configurator',
        'ajv',
        'ajv-formats',
        'zustand',
        'core-js',
        'use-sync-external-store',
      ],
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
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/form-configurator/adapter-react',
      provider: 'v8' as const,
    },
    setupFiles: ['./vitest.setup.ts'],
  },
} as any);
