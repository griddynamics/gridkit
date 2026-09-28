import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';
import remarkGfm from 'remark-gfm';
// Build-time workspace tooling, not a dependency of the shipped UI library.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { legacyRedirectHead } from '../../../bin/storybook/routes.mjs';

const config: StorybookConfig = {
  stories: [
    { directory: '../src', files: '**/*.mdx', titlePrefix: 'React' },
    { directory: '../src', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)', titlePrefix: 'React' },
  ],
  refs: (_config, { configType }) => ({
    'web-components': {
      title: 'Web Components',
      url: configType === 'DEVELOPMENT' ? 'http://localhost:6007' : './web-components/',
    },
  }),
  managerHead: (head) => `${legacyRedirectHead()}${head}`,
  previewHead: (head) => `${legacyRedirectHead()}${head}`,
  staticDirs: ['public', '../src/assets'],
  addons: [
    '@storybook/addon-onboarding',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          remarkPlugins: [remarkGfm],
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    // Storybook strips `build` from the user's vite config before merging, leaving
    // config.build.outDir at Vite's default 'dist'. nxCopyAssetsPlugin would then
    // resolve the output dir as 'libs/ui/dist' instead of 'dist/libs/ui'.
    // Remove it here — asset copying only matters for the library build (nx build ui).
    //
    // Important: do NOT flatten or remove entries that lack a `name` property.
    // Storybook's addon-docs adds the MDX plugin as an async function call
    // (i.e. a Promise), which has no `name` property. Filtering it out would
    // strip the MDX transform and cause Vite to fail on raw .mdx content.
    config.plugins = (config.plugins ?? []).filter((p) => {
      if (!p || typeof p !== 'object' || !('name' in p)) return true;
      return (p as Plugin).name !== 'nx-copy-assets-plugin';
    });

    return config;
  },
};
export default config;
