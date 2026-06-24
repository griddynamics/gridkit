import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { TokenViewer } from '@stories/components/TokenViewer';
import { SkeletonVariant, TypographyVariant } from '@types';
import { Row, Column, Typography } from '@components';
import { defaultTheme } from '@tokens';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],

  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(SkeletonVariant).map(
        (value: string) => SkeletonVariant[value as keyof typeof SkeletonVariant]
      ),
      description: 'Controls the shape of the skeleton.',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: SkeletonVariant.Rounded },
      },
    },
    width: {
      control: 'text',
      description: 'Sets the width of the skeleton. Accepts any valid CSS width value.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
      },
    },
    height: {
      control: 'text',
      description: 'Sets the height of the skeleton. Accepts any valid CSS height value.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
      },
    },
    backgroundColor: {
      control: 'text',
      description:
        'Sets the skeleton fill color. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path / palette-style alias (e.g., "bg.fill.success.primary.default", "brand.500", "theme.palette.success.main").',
      table: {
        type: { summary: 'string' },
      },
    },
    animationName: {
      control: 'text',
      description:
        'Overrides the default animation keyframe name. Accepts theme animation token names such as "blinkKeyframes", raw CSS animation names, or `null` to disable the built-in animation.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'blinkKeyframes' },
      },
    },
    animationProps: {
      control: 'text',
      description:
        'Custom animation timing string appended to `animationName` (for example "1200ms ease-in-out 0ms infinite").',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: 'Provides a way to apply custom CSS classes, such as Tailwind utility classes for animations.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    children: {
      control: 'object',
      description: 'Content to be rendered inside the skeleton wrapper.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS properties to apply to the skeleton.',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
      subControls: {
        backgroundColor: {
          control: 'color',
          description: 'Background color of the skeleton.',
          table: {
            type: { summary: 'string' },
          },
        },
        borderRadius: {
          control: 'text',
          description: 'Border radius of the skeleton.',
          table: {
            type: { summary: 'string' },
          },
        },
        opacity: {
          control: 'number',
          description: 'Opacity of the skeleton.',
          table: {
            type: { summary: 'number' },
          },
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  The \`Skeleton\` component is a visual placeholder used to indicate that content is loading.
  <br/>
  It provides a better user experience by showing a loading state, preventing layout shifts and giving users a sense of progress.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Customizable Variants</b>
  <ul>
  <li>Rounded - Default style for text placeholders</li>
  <li>Rectangular - For content blocks and images</li>
  <li>Circular - For avatars and icons</li>
  </ul>
  </li>
  <li>
  <b>Animation Options</b>
  <ul>
  <li>Default theme loading animation</li>
  <li>Custom animation support</li>
  <li>Utility class compatibility (e.g. Tailwind)</li>
  </ul>
  </li>
  <li><b>Size Customization</b> - Flexible width and height settings</li>
  <li><b>Theme-Aware Colors</b> - Supports both raw CSS colors and theme/palette token aliases through the <code>backgroundColor</code> prop</li>
  <li><b>Child Content Support</b> - Can wrap and animate child elements</li>
  <li><b>Layout Integration</b> - Works within complex layouts</li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '250px',
    height: '15px',
    variant: SkeletonVariant.Rounded,
  },
  parameters: {
    docs: {
      description: {
        story: 'The `Default` story shows the standard rounded skeleton, which is ideal for text-line placeholders.',
      },
    },
  },
} as Story;

export const Circular: Story = {
  args: {
    width: '80px',
    height: '80px',
    variant: SkeletonVariant.Circular,
  },
  parameters: {
    docs: {
      description: {
        story: 'The `Circular` variant is perfect for avatar or icon placeholders.',
      },
    },
  },
} as Story;

export const Rectangular: Story = {
  args: {
    width: '250px',
    height: '125px',
    variant: SkeletonVariant.Rectangular,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `Rectangular` variant is suitable for larger content blocks like images, cards, or video placeholders.',
      },
    },
  },
} as Story;

export const WithThemeColor: Story = {
  args: {
    width: '250px',
    height: '40px',
    variant: SkeletonVariant.Rectangular,
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
} as Story;

export const WithCustomAnimation: Story = {
  name: 'Animation with Tailwind Class',
  args: {
    width: '250px',
    height: '15px',
    animationName: null,
    className: 'animate-pulse',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates how to use utility classes (like Tailwind CSS) to apply a custom animation. Here, `animate-pulse` creates a gentle pulsing effect. The default animation is disabled by setting `animationName` to `null`.',
      },
    },
  },
} as Story;

export const WithChildren: Story = {
  name: 'Skeleton with Child Content',
  args: {
    width: '250px',
    height: '50px',
    children: <Typography variant={TypographyVariant.Body2}>Loading Content...</Typography>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Skeleton can also act as a wrapper, applying its loading animation to any child elements. This is useful for creating more complex or custom loading states.',
      },
    },
  },
} as Story;

export const ComposedLayout: Story = {
  name: 'Example: Article Placeholder',
  render: () => (
    <div style={{ maxWidth: '480px', width: '100%' }}>
      <Column gutter={10}>
        <Row gutter={10} justify="between" align="center">
          <Column>
            <Skeleton variant={SkeletonVariant.Circular} styles={{ width: '100px', height: '100px' }} />
          </Column>
          <Column flex="1">
            <Typography variant={TypographyVariant.H3} styles={{ marginBottom: '10px' }}>
              <Skeleton />
            </Typography>
            <Typography variant={TypographyVariant.Body1} styles={{ marginBottom: '10px' }}>
              <Skeleton />
            </Typography>
            <Typography variant={TypographyVariant.Body2} styles={{ marginBottom: '10px' }}>
              <Skeleton />
            </Typography>
          </Column>
        </Row>
      </Column>
      <Row gutter={10} align="center" styles={{ marginTop: '20px' }}>
        <Typography variant={TypographyVariant.Body1} styles={{ width: '100%' }}>
          <Skeleton />
        </Typography>
        <Typography variant={TypographyVariant.Body1} styles={{ width: '100%' }}>
          <Skeleton />
        </Typography>
        <Typography variant={TypographyVariant.Body1} styles={{ marginBottom: '10px', width: '100%' }}>
          <Skeleton />
        </Typography>
      </Row>
    </div>
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

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ skeleton: defaultTheme.skeleton }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
