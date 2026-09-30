import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  staticDirs: [{ from: '../../ui/src/assets', to: '/' }],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    // A preview is not a library build: do not run declaration generation or
    // inherit the library output/externalization settings.
    options: { builder: { viteConfigPath: '.storybook/vite.config.ts' } },
  },
};

export default config;
