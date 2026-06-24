import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          ['Welcome', 'Getting Started', 'Theme Tokens Usage', 'Logging and Debugging', '*'],
          'Theme & Tokens',
          [
            'Theme',
            'Colors',
            'Fonts',
            'Spacing',
            'Radius',
            'zIndex',
            'Breakpoints',
            'Shadows',
            'Values',
            'Animations',
            '*',
          ],
          'Support & Questions',
          'Form Configurator',
          ['Getting Started', 'Data Schema', 'Controls', 'UI Schema & Layouts', 'Logger', 'Custom Controls', '*'],
          'Atoms',
          'Molecules',
          'Organisms',
          'Layout & Structure',
          'Templates',
          'Patterns & Best Practices',
          ['AI Experience', 'Prompt Engineering & AI Integration', '*'],
          'Domain Solutions',
          '*',
        ],
      },
    },
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more. Typically, this is the CSS selector for the part of the DOM you want to analyze.
       */
      context: 'body',
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {
        // WCAG 2.1 Level AA compliance
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        rules: {
          // Disable page-level rules that don't apply to component stories
          'page-has-heading-one': { enabled: false },
          'landmark-one-main': { enabled: false },
          region: { enabled: false },
        },
        // Only fail on serious or higher impact violations
        impactLevels: ['critical', 'serious'],
      },

      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      // Global default: 'todo' mode (report violations without failing)
      // Individual accessibility test stories override to 'error' to enforce audits
      test: 'todo',
    },
  },
};

export default preview;
