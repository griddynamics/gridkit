// Generated from libs/ui/src/components/atoms/Skeleton/Skeleton.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Skeleton';
const Skeleton = 'gd-skeleton';
const Typography = 'gd-typography';
const Column = 'Column';
const Row = 'Row';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '\n  The `Skeleton` component is a visual placeholder used to indicate that content is loading.\n  <br/>\n  It provides a better user experience by showing a loading state, preventing layout shifts and giving users a sense of progress.\n  <br/>\n  <br/>\n  <h3>Key Features:</h3>\n  <ul>\n  <li>\n  <b>Customizable Variants</b>\n  <ul>\n  <li>Rounded - Default style for text placeholders</li>\n  <li>Rectangular - For content blocks and images</li>\n  <li>Circular - For avatars and icons</li>\n  </ul>\n  </li>\n  <li>\n  <b>Animation Options</b>\n  <ul>\n  <li>Default theme loading animation</li>\n  <li>Custom animation support</li>\n  <li>Utility class compatibility (e.g. utility CSS)</li>\n  </ul>\n  </li>\n  <li><b>Size Customization</b> - Flexible width and height settings</li>\n  <li><b>Theme-Aware Colors</b> - Supports both raw CSS colors and theme/palette token aliases through the <code>backgroundColor</code> prop</li>\n  <li><b>Child Content Support</b> - Can wrap and animate child elements</li>\n  <li><b>Layout Integration</b> - Works within complex layouts</li>\n  </ul>\n        ',
      },
    },
  },
};
export default meta;
export const Default = {
  args: {
    width: '250px',
    height: '15px',
    variant: 'rounded',
  },
  parameters: {
    docs: {
      description: {
        story: 'The `Default` story shows the standard rounded skeleton, which is ideal for text-line placeholders.',
      },
    },
  },
};
export const Circular = {
  args: {
    width: '80px',
    height: '80px',
    variant: 'circular',
  },
  parameters: {
    docs: {
      description: {
        story: 'The `Circular` variant is perfect for avatar or icon placeholders.',
      },
    },
  },
};
export const Rectangular = {
  args: {
    width: '250px',
    height: '125px',
    variant: 'rectangular',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `Rectangular` variant is suitable for larger content blocks like images, cards, or video placeholders.',
      },
    },
  },
};
export const WithThemeColor = {
  args: {
    width: '250px',
    height: '40px',
    variant: 'rectangular',
    backgroundColor: 'theme.palette.success.main',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story shows the top-level `backgroundColor` prop using a theme-aware palette alias. Raw CSS colors like `#34A853` also work, but token values keep the component aligned with the design system.',
      },
    },
  },
};
export const WithChildren = {
  name: 'Skeleton with Child Content',
  args: {
    width: '250px',
    height: '50px',
    children: demo(Typography, { variant: 'small' }, 'Loading Content...'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Skeleton can also act as a wrapper, applying its loading animation to any child elements. This is useful for creating more complex or custom loading states.',
      },
    },
  },
};
export const ComposedLayout = {
  name: 'Example: Article Placeholder',
  render: () =>
    demo(
      'div',
      { style: { maxWidth: '480px', width: '100%' } },
      demo(
        Column,
        { gutter: 10 },
        demo(
          Row,
          { gutter: 10, justify: 'between', align: 'center' },
          demo(Column, null, demo(Skeleton, { variant: 'circular', styles: { width: '100px', height: '100px' } })),
          demo(
            Column,
            { flex: '1' },
            demo(Typography, { variant: 'h3', styles: { marginBottom: '10px' } }, demo(Skeleton, null)),
            demo(Typography, { variant: 'p', styles: { marginBottom: '10px' } }, demo(Skeleton, null)),
            demo(Typography, { variant: 'small', styles: { marginBottom: '10px' } }, demo(Skeleton, null))
          )
        )
      ),
      demo(
        Row,
        { gutter: 10, align: 'center', styles: { marginTop: '20px' } },
        demo(Typography, { variant: 'p', styles: { width: '100%' } }, demo(Skeleton, null)),
        demo(Typography, { variant: 'p', styles: { width: '100%' } }, demo(Skeleton, null)),
        demo(Typography, { variant: 'p', styles: { marginBottom: '10px', width: '100%' } }, demo(Skeleton, null))
      )
    ),
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a real-world use case by composing multiple skeletons to create a placeholder for a complex layout, such as an article preview or a user profile card. This approach helps maintain the page structure while data is loading, preventing content from shifting.',
      },
    },
  },
};
export const WithAccessibility = {
  ...Default,
  parameters: {
    ...Default.parameters,
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { skeleton: defaultTheme.skeleton } });
DefaultTokens.parameters = {
  layout: 'padded',
};
