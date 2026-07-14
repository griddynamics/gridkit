import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    ignores: ['storybook-static/**/*', 'scripts/**'],
  },
  {
    // files to which the restriction applies
    files: ['src/utils/**/*.{ts,tsx,js,jsx}', 'src/hooks/**/*.{ts,tsx,js,jsx}', 'src/tokens/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@components', '@components/**'],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // Warn about deprecated import paths
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['@components/core', '@components/core/*'],
              message:
                'DEPRECATED: @components/core will be removed in v2.0.0. Use @components/atoms, @components/molecules, or @components/organisms instead.',
            },
            {
              group: ['@components/domainSpecific', '@components/domainSpecific/*'],
              message:
                'DEPRECATED: @components/domainSpecific will be removed in v2.0.0. Use @components/atoms, @components/molecules, or @components/organisms instead.',
            },
          ],
        },
      ],
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.base.json', 'apps/*/tsconfig.*.json', 'libs/*/tsconfig.*.json'],
        },
      },
    },
  },
];
