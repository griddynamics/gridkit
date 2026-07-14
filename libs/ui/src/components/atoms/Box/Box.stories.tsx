import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Typography } from '@components';
import { defaultTheme } from '@tokens';
import { TypographyVariant } from '@types';

import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Atoms/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    // ============================================================================
    // Core Props
    // ============================================================================
    children: {
      description: 'Box content (any React node)',
      control: 'text',
      table: {
        category: 'Core Props',
        type: { summary: 'ReactNode' },
      },
    },
    variant: {
      description: 'Box orientation variant',
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      table: {
        category: 'Core Props',
        defaultValue: { summary: 'vertical' },
        type: { summary: "'horizontal' | 'vertical'" },
      },
    },

    // ============================================================================
    // Visual Style
    // ============================================================================
    isBordered: {
      description: 'Adds border to the box',
      control: 'boolean',
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    isHighlighted: {
      description: 'Enables highlight effect on hover (adds outline on hover)',
      control: 'boolean',
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    withShadowHover: {
      description: 'Adds box shadow on hover for elevation effect',
      control: 'boolean',
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },

    // ============================================================================
    // Box Styles - Layout & Sizing
    // ============================================================================
    width: {
      description: 'CSS width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    height: {
      description: 'CSS height property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    maxHeight: {
      description: 'CSS max-height property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Spacing
    // ============================================================================
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Flexbox
    // ============================================================================
    flexDirection: {
      description: 'CSS flex-direction property',
      control: { type: 'select' },
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: { type: 'select' },
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: { type: 'select' },
      options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Position & Display
    // ============================================================================
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },

    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description: 'Custom styles object',
      control: 'object',
      table: {
        category: 'Custom Styling',
        type: { summary: 'CSSProperties' },
      },
    },

    // ============================================================================
    // Accessibility
    // ============================================================================
    tabIndex: {
      description: 'Tab index for keyboard navigation',
      control: 'number',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Box\` component is a foundational layout primitive that provides a flexible container with built-in support for flexbox, spacing, and sizing. It serves as the base for more complex components like Card.

<br/>
<br/>

<h3>🎨 Key Features</h3>
<ul>
<li><b>Flexible Container:</b> Display flex by default, perfect for layout composition</li>
<li><b>Box Model Props:</b> Full control over width, height, padding, margin, and more</li>
<li><b>Flexbox Support:</b> Built-in flexbox properties for alignment and distribution</li>
<li><b>Focus Management:</b> Automatic focus-visible styles for accessibility</li>
<li><b>Theme Integration:</b> Seamless integration with the design system</li>
<li><b>Composable:</b> Can be used as a base for other components</li>
</ul>

<br/>

<h3>🎯 Common Use Cases</h3>
<ul>
<li><b>Layout Containers:</b> Wrapper for creating flexible layouts</li>
<li><b>Card Base:</b> Foundation for card-like components</li>
<li><b>Sections:</b> Semantic sections with consistent spacing</li>
<li><b>Custom Components:</b> Base for building domain-specific components</li>
</ul>

<br/>

<h3>💡 Best Practices</h3>
<ul>
<li><b>Semantic HTML:</b> Box renders as a div, use it for layout purposes</li>
<li><b>Composition:</b> Combine with other components for complex UIs</li>
<li><b>Accessibility:</b> Use tabIndex when the box needs to be focusable</li>
<li><b>Performance:</b> Prefer Box props over inline styles for better optimization</li>
</ul>
        `,
      },
    },
  },
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof Box>;

// ============================================================================
// Interactive Stories
// ============================================================================

export const Default: Story = {
  args: {
    variant: 'vertical',
    children: 'Box Content',
    padding: '20px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic Box with default vertical variant. Use the controls to experiment with different properties.',
      },
    },
  },
};

export const Bordered: Story = {
  args: {
    variant: 'vertical',
    isBordered: true,
    padding: '20px',
    children: 'Bordered Box',
  },
  parameters: {
    docs: {
      description: {
        story: 'Box with `isBordered` enabled, adding a border from theme tokens.',
      },
    },
  },
};

export const Highlighted: Story = {
  args: {
    variant: 'vertical',
    isHighlighted: true,
    isBordered: true,
    padding: '20px',
    children: 'Hover over me to see the highlight effect!',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Box with `isHighlighted` enabled. When you hover over it, an outline appears. This is useful for interactive card-like containers.',
      },
    },
  },
};

export const WithShadowHover: Story = {
  args: {
    variant: 'vertical',
    withShadowHover: true,
    padding: '20px',
    children: 'Hover over me to see the shadow effect!',
    styles: {
      backgroundColor: '#fff',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Box with `withShadowHover` enabled. When you hover over it, a box shadow appears creating an elevation effect. Perfect for cards that lift on hover.',
      },
    },
  },
};

export const VerticalLayout: Story = {
  args: {
    variant: 'vertical',
    gap: '10px',
    padding: '20px',
    isBordered: true,
    children: (
      <>
        <div style={{ padding: '10px', background: '#e0e0e0', borderRadius: '4px' }}>Item 1</div>
        <div style={{ padding: '10px', background: '#e0e0e0', borderRadius: '4px' }}>Item 2</div>
        <div style={{ padding: '10px', background: '#e0e0e0', borderRadius: '4px' }}>Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical variant stacks children in a column with gap spacing. Default flexDirection is column.',
      },
    },
  },
};

export const HorizontalLayout: Story = {
  args: {
    variant: 'horizontal',
    gap: '10px',
    padding: '20px',
    isBordered: true,
    children: (
      <>
        <div style={{ padding: '10px', background: '#e0e0e0', borderRadius: '4px', flex: 1 }}>Item 1</div>
        <div style={{ padding: '10px', background: '#e0e0e0', borderRadius: '4px', flex: 1 }}>Item 2</div>
        <div style={{ padding: '10px', background: '#e0e0e0', borderRadius: '4px', flex: 1 }}>Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal variant arranges children in a row with gap spacing. Default flexDirection is row.',
      },
    },
  },
};

export const CenteredContent: Story = {
  args: {
    variant: 'vertical',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '200px',
    isBordered: true,
    children: (
      <>
        <Typography variant={TypographyVariant.H5}>Centered</Typography>
        <Typography variant={TypographyVariant.Body2}>Content is centered both horizontally and vertically</Typography>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Box with centered content using flexbox alignment properties.',
      },
    },
  },
};

// ============================================================================
// Showcase Stories
// ============================================================================

export const Examples: StoryFn = () => {
  return (
    <Box variant="vertical" gap="40px" padding="20px">
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H3}>Box Component Examples</Typography>
        <Typography variant={TypographyVariant.Body1}>
          Various use cases demonstrating the flexibility of the Box component
        </Typography>
      </Box>

      {/* Variants Comparison */}
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H5}>Vertical vs Horizontal Variants</Typography>
        <Box variant="vertical" gap="10px">
          <Box variant="vertical" gap="10px" padding="20px" isBordered>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Vertical (Default)
            </Typography>
            <Typography variant={TypographyVariant.Body2}>Stacks children vertically</Typography>
          </Box>
          <Box variant="horizontal" gap="10px" padding="20px" isBordered>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Horizontal
            </Typography>
            <Typography variant={TypographyVariant.Body2}>Arranges children horizontally</Typography>
          </Box>
        </Box>
      </Box>

      {/* Border & Hover Effects */}
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H5}>Border & Hover Effects</Typography>
        <Typography variant={TypographyVariant.Body2} styles={{ marginBottom: '10px' }}>
          Hover over each box to see different effects
        </Typography>
        <Box variant="horizontal" gap="10px">
          <Box variant="vertical" padding="20px" styles={{ backgroundColor: '#f5f5f5' }}>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Default
            </Typography>
            <Typography variant={TypographyVariant.Body2}>No hover effect</Typography>
          </Box>
          <Box variant="vertical" padding="20px" isBordered>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Bordered
            </Typography>
            <Typography variant={TypographyVariant.Body2}>Static border</Typography>
          </Box>
          <Box variant="vertical" padding="20px" isBordered isHighlighted>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Highlighted
            </Typography>
            <Typography variant={TypographyVariant.Body2}>Outline on hover</Typography>
          </Box>
          <Box variant="vertical" padding="20px" withShadowHover styles={{ backgroundColor: '#fff' }}>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Shadow Hover
            </Typography>
            <Typography variant={TypographyVariant.Body2}>Shadow on hover</Typography>
          </Box>
          <Box variant="vertical" padding="20px" isBordered withShadowHover styles={{ backgroundColor: '#fff' }}>
            <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
              Combined
            </Typography>
            <Typography variant={TypographyVariant.Body2}>Border + shadow</Typography>
          </Box>
        </Box>
      </Box>

      {/* Horizontal Layout */}
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H5}>Horizontal Layout with Gap</Typography>
        <Box variant="horizontal" gap="10px">
          <Box variant="vertical" padding="20px" isBordered styles={{ flex: 1 }}>
            Box 1
          </Box>
          <Box variant="vertical" padding="20px" isBordered styles={{ flex: 1 }}>
            Box 2
          </Box>
          <Box variant="vertical" padding="20px" isBordered styles={{ flex: 1 }}>
            Box 3
          </Box>
        </Box>
      </Box>

      {/* Vertical Stack */}
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H5}>Vertical Stack</Typography>
        <Box variant="vertical" gap="10px" width="300px">
          <Box variant="vertical" padding="15px" isBordered>
            Item 1
          </Box>
          <Box variant="vertical" padding="15px" isBordered>
            Item 2
          </Box>
          <Box variant="vertical" padding="15px" isBordered>
            Item 3
          </Box>
        </Box>
      </Box>

      {/* Interactive Cards */}
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H5}>Interactive Card-like Containers</Typography>
        <Box variant="horizontal" gap="15px">
          <Box variant="vertical" gap="15px" padding="20px" width="280px" isBordered isHighlighted>
            <Typography variant={TypographyVariant.H6}>Outline Effect</Typography>
            <Typography variant={TypographyVariant.Body2}>
              Uses `isBordered` and `isHighlighted` for outline hover effect.
            </Typography>
          </Box>
          <Box
            variant="vertical"
            gap="15px"
            padding="20px"
            width="280px"
            withShadowHover
            styles={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant={TypographyVariant.H6}>Elevation Effect</Typography>
            <Typography variant={TypographyVariant.Body2}>
              Uses `withShadowHover` for shadow elevation on hover.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Complex Nested Layout */}
      <Box variant="vertical" gap="10px">
        <Typography variant={TypographyVariant.H5}>Complex Nested Layout</Typography>
        <Box variant="vertical" gap="10px" padding="20px" isBordered>
          <Typography variant={TypographyVariant.H6}>Dashboard Section</Typography>
          <Box variant="horizontal" gap="10px">
            <Box variant="vertical" gap="5px" padding="15px" isBordered>
              <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
                Metric 1
              </Typography>
              <Typography variant={TypographyVariant.Body1}>1,234</Typography>
            </Box>
            <Box variant="vertical" gap="5px" padding="15px" isBordered>
              <Typography variant={TypographyVariant.Body2} styles={{ fontWeight: 600 }}>
                Metric 2
              </Typography>
              <Typography variant={TypographyVariant.Body1}>5,678</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

Examples.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story: 'Collection of examples showing different ways to use the Box component for various layout needs.',
    },
  },
};

export const WithAccessibility = {
  render: Examples,
  parameters: {
    a11y: {
      test: 'error',
      options: {
        rules: {
          'heading-order': { enabled: false },
        },
      },
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ box: defaultTheme.box }} />;
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'View the default theme tokens used by the Box component. These tokens control the base display and focus styles.',
    },
  },
};
