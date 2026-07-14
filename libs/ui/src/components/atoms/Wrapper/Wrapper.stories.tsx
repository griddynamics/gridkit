import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { TokenViewer } from '@stories/components/TokenViewer';
import { WrapperVariant } from '@types';
import { Typography } from '@components';
import { defaultTheme } from '@tokens';

import Wrapper from './Wrapper';

const meta: Meta<typeof Wrapper> = {
  title: 'Atoms/Wrapper',
  component: Wrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  <h3>Overview</h3>
  The \`Wrapper\` component serves as a foundational building block for creating flexible and accessible layouts. It encapsulates common container patterns while providing a rich API for customization and semantic structure.

  This versatile container adapts to different contexts through its variant system while maintaining consistent behavior and accessibility standards. It's designed to work seamlessly within your component hierarchy, whether you need a simple inline wrapper or a full-page overlay.

  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Layout Control</b>
  <ul>
  <li>Flexible container sizing with responsive options</li>
  <li>Direct theme integration for consistent styling</li>
  <li>Predictable nesting behavior</li>
  </ul>
  </li>
  <br/>
  <li><b>Composability</b> - Works seamlessly with other components</li>
  <li><b>Semantic HTML</b> - Appropriate element selection for accessibility</li>
  </ul>

  <h3>Accessibility</h3>
  <ul>
  <li>Semantic HTML elements for improved screen reader navigation</li>
  <li>ARIA attributes automatically applied based on variant</li>
  <li>Keyboard focus management for interactive variants</li>
  </ul>

  <h3>Layout Props:</h3>
 <br/>
  <b>Dimensions</b>
  <br/>
  <ul>
  <li><code>width/height</code>: Set container size with various units (px, rem, %, vh/vw)</li>
  <li><code>minWidth/minHeight</code>: Define minimum size constraints</li>
  <li><code>maxWidth/maxHeight</code>: Set maximum size limits</li>
  </ul>

  <b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Control inner and outer spacing</li>
  <li><code>border</code>: Comprehensive border customization</li>
  <li><code>position</code>: Adjust element positioning (relative, absolute, fixed)</li>
  <li><code>display</code>: Control layout behavior (flex, block, inline-flex)</li>
  </ul>
        `,
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'Overrides the default wrapper HTML element used for rendering (e.g., "div", "section", "article").',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: Object.keys(WrapperVariant),
      description: 'Determines the semantic HTML element and associated styles for different layout contexts.',
      table: {
        defaultValue: { summary: WrapperVariant.Inline },
        type: { summary: 'WrapperVariant' },
      },
    },
    children: {
      control: 'text',
      description: 'Content to be rendered inside the wrapper. Can be text, components, or other elements.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to be applied to the wrapper element.',
      table: {
        type: { summary: 'string' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS styles object to override or extend default wrapper styling.',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
    display: {
      control: { type: 'select' },
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid'],
      description: 'CSS display property to control the layout behavior of the wrapper.',
      table: {
        type: { summary: 'string' },
      },
    },
    position: {
      control: { type: 'select' },
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      description: 'CSS position property to control the positioning context of the wrapper.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} as Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof Wrapper>;

export const InteractiveExample: Story = {
  name: 'Interactive Example',
  render: (args) => <Wrapper {...args} />,
  args: {
    variant: WrapperVariant.Inline,
    children: 'This is a basic div wrapper. Change the variant in the controls to see different wrapper types.',
    styles: {
      padding: '20px',
      border: '2px dashed #007bff',
      borderRadius: '8px',
      backgroundColor: '#f0f8ff',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story provides an interactive demonstration of the `Wrapper` component. Use the controls in the Addons panel to change the `variant` and see how it affects the underlying HTML element and its appearance.',
      },
    },
  },
} as Story;

export const SectionWrapper: Story = {
  name: 'Variant: Section',
  args: {
    variant: WrapperVariant.Section,
    children: (
      <Typography>
        This content is semantically grouped within a `section` element, which is ideal for thematically related
        content.
      </Typography>
    ),
    styles: {
      padding: '20px',
      width: '400px',
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `Section` variant renders a `<section>` HTML element. It is a block-level container used for grouping content that has a common theme or purpose, such as a chapter, a header, or a footer.',
      },
    },
  },
} as Story;

export const InlineWrapper: Story = {
  name: 'Variant: Inline (Span)',
  render: (args) => (
    <Typography>
      This is a line of text, and <Wrapper {...args} /> is used for inline content.
    </Typography>
  ),
  args: {
    variant: WrapperVariant.Inline,
    children: 'this part is wrapped in a span',
    styles: {
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#fffbe6',
      color: '#856404',
      fontWeight: 'bold',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `Inline` variant renders a `<span>` HTML element. It is used for wrapping small pieces of content within a larger block of text, without creating a line break. This is useful for applying styles or behavior to a specific word or phrase.',
      },
    },
  },
} as Story;

export const FullPageWrapper: Story = {
  name: 'Variant: Full Page',
  args: {
    variant: WrapperVariant.FullPage,
    children: (
      <Typography styles={{ color: 'white' }}>
        This wrapper covers the entire viewport, perfect for modals or overlays.
      </Typography>
    ),
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The `FullPage` variant is designed to create a container that spans the entire viewport. It is typically used as a background for modal dialogs, loading spinners, or other UI elements that need to overlay the entire page content.',
      },
    },
  },
} as Story;

export const CustomTagWrapper: Story = {
  name: 'Custom tag Wrapper',
  args: {
    as: 'section',
    children: 'Custom tag Wrapper',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The `FullPage` variant is designed to create a container that spans the entire viewport. It is typically used as a background for modal dialogs, loading spinners, or other UI elements that need to overlay the entire page content.',
      },
    },
  },
} as Story;

export const WithAccessibility = {
  ...InteractiveExample,
  parameters: {
    ...InteractiveExample.parameters,
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ wrapper: defaultTheme.wrapper }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
