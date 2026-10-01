import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      'gd-design-core': fileURLToPath(new URL('../../design-core/src/index.ts', import.meta.url)),
      'gd-design-library/tokens': fileURLToPath(new URL('../../../dist/libs/ui/tokens/index.js', import.meta.url)),
    },
  },
});
