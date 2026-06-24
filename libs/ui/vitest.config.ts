import { defineConfig } from 'vitest/config';
import * as path from 'path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { sharedAlias } from './vitest.alias';
import { fetchA2uiSpecCommand } from './src/utils/commands/vitest-a2ui-llm-command';
import { validateA2uiSpecCommand } from './src/utils/commands/vitest-a2ui-schema-command';
import { judgeA2uiSpecCommand } from './src/utils/commands/vitest-a2ui-judge-command';
import { checkA11yCommand } from './src/utils/commands/vitest-a11y-command';

const a2uiLlmConfigured = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        '.storybook/',
        'storybook-static/',
        'node_modules/',
        'src/assets/',
        'src/types/',
        'src/utils/play/',
        'src/**/index.{js,ts,jsx,tsx}',
        'src/**/constants.{js,ts,jsx,tsx}',
        'src/**/Styled*.{js,ts,jsx,tsx}',
        'src/**/*.stories.{js,ts,jsx,tsx}',
        'src/**/*.play.{js,ts,jsx,tsx}',
        'src/**/*.test.{js,ts,jsx,tsx}',
        'src/**/types.{js,ts}',
        'src/**/*.types.{js,ts}',
        'src/**/*.integration.{js,ts,jsx,tsx}',
      ],
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          css: true,
          globals: true,
          // Add this to ensure CSS-in-JS works in tests
          deps: {
            inline: ['@emotion/css'],
          },
          include: ['**/*.{test,spec}.{ts,tsx}'],
          exclude: ['.storybook/', 'node_modules/', 'src/assets/', 'src/**/*.stories.{js,ts,jsx,tsx}'],
        },
        resolve: {
          alias: sharedAlias,
        },
      },
      {
        test: {
          name: 'visual',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                slowMo: 100,
              },
            }),
            instances: [
              {
                browser: 'chromium',
              },
            ],
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch',
              },
            },
          },
          environment: 'jsdom',
          css: true,
          globals: true,
          // Add this to ensure CSS-in-JS works in tests and prevent React version conflicts
          deps: {
            inline: ['@emotion/css', 'react', 'react-dom', 'react/jsx-runtime'],
          },
          include: ['**/*.visual.{ts,tsx}'],
          exclude: ['.storybook/', 'node_modules/', 'src/assets/', 'src/**/*.stories.{js,ts,jsx,tsx}'],
        },
        resolve: {
          alias: {
            ...sharedAlias,
            // Force React to resolve from workspace root to prevent multiple versions
            react: path.resolve(__dirname, '../../node_modules/react'),
            'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
            'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
          },
          dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
        },
      },
      {
        plugins: [
          storybookTest({
            configDir: path.resolve(__dirname, '.storybook'),
            tags: {
              include: process.env.STORYBOOK_TAG ? [process.env.STORYBOOK_TAG] : [],
            },
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                slowMo: 100,
              },
            }),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
          testTimeout: 30000,
          hookTimeout: 30000,
        },
        optimizeDeps: {
          include: ['react', 'react-dom', 'react/jsx-runtime'],
        },
        resolve: {
          alias: sharedAlias,
          dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
        },
      },
      {
        test: {
          name: 'a2ui-integration',
          attachmentsDir: '.vitest-artifacts/attachments',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                slowMo: 100,
              },
            }),
            trace: {
              enabled: true,
              tracesDir: '.vitest-artifacts/traces',
            },
            instances: [
              {
                browser: 'chromium',
              },
            ],
            commands: {
              fetchA2uiSpec: fetchA2uiSpecCommand,
              validateA2uiSpec: validateA2uiSpecCommand,
              judgeA2uiSpec: judgeA2uiSpecCommand,
              checkA11y: checkA11yCommand,
            },
          },
          environment: 'jsdom',
          css: true,
          globals: true,
          deps: {
            inline: ['@emotion/css', 'react', 'react-dom', 'react/jsx-runtime'],
          },
          include: ['**/*.a2ui.integration.{ts,tsx}'],
          exclude: ['.storybook/', 'node_modules/', 'src/assets/', 'src/**/*.stories.{js,ts,jsx,tsx}'],
          testTimeout: 15_000,
          hookTimeout: 15_000,
        },
        define: {
          __A2UI_LLM_CONFIGURED__: JSON.stringify(a2uiLlmConfigured),
        },
        optimizeDeps: {
          include: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@emotion/react',
            '@emotion/react/jsx-dev-runtime',
            '@emotion/css',
          ],
        },
        resolve: {
          alias: {
            ...sharedAlias,
            react: path.resolve(__dirname, '../../node_modules/react'),
            'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
            'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
          },
          dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
        },
      },
    ],
  },
});
