import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const fromHere = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

// Storybook dev server: resolve tokens/icons straight from libs/ui source so that editing
// libs/ui/src/tokens/*.ts hot-reloads the web-components stories, without rebuilding dist/libs/ui.
// Same approach as libs/web-components/vite.config.ts.
const liveSourceAlias: Record<string, string> = {
  'gd-design-library/tokens': fromHere('../../ui/src/tokens/index.ts'),
  'gd-design-library/icons': fromHere('../../ui/src/icons/index.ts'),
  // libs/ui token files resolve their own internal imports via libs/ui path aliases.
  '@utils': fromHere('../../ui/src/utils'),
  '@types': fromHere('../../ui/src/types'),
  '@constants': fromHere('../../ui/src/constants'),
  '@hooks': fromHere('../../ui/src/hooks'),
  '@tokens': fromHere('../../ui/src/tokens'),
  '@components': fromHere('../../ui/src/components'),
  '@assets': fromHere('../../ui/src/assets'),
};

// Static build (`build-storybook`): use the production UI build, which `npm run build-storybook`
// produces first via `export-theme`.
const builtAlias: Record<string, string> = {
  'gd-design-library/tokens': fromHere('../../../dist/libs/ui/tokens/index.js'),
  'gd-design-library/icons': fromHere('../../../dist/libs/ui/icons/index.js'),
};

export default defineConfig(({ command }) => ({
  resolve: {
    alias: command === 'serve' ? liveSourceAlias : builtAlias,
  },
}));
