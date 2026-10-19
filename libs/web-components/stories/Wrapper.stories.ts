import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdWrapper } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { defined, typography } from './text-atoms-helpers';

type Args = Pick<GdWrapper, 'variant' | 'as' | 'styles' | 'display' | 'position'> & {
  children?: string;
  className?: string;
};

const wrapper = ({ children, className, ...props }: Args, ...nested: Node[]) => {
  const node = element('gd-wrapper', defined(props) as Partial<GdWrapper>);
  if (className) node.className = className;
  if (children) node.append(children);
  node.append(...nested);
  return node;
};

const meta = {
  title: 'Atoms/Wrapper',
  component: 'gd-wrapper',
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


  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — No abstraction — shared utility CSS.</b> Zero behavior and no visual surface of its own. Utility classes over the same tokens deliver the same result at zero runtime cost.
`,
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'Overrides the default wrapper HTML element used for rendering (e.g., "div", "section", "article").',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap' },
      },
    },
    variant: {
      control: { type: 'select' },
      // Same options as the source story: the keys of the variant enum.
      options: ['Inline', 'Section', 'FullPage'],
      description: 'Determines the semantic HTML element and associated styles for different layout contexts.',
      table: {
        defaultValue: { summary: 'inline' },
        type: { summary: 'WrapperVariant' },
      },
    },
    children: {
      control: 'text',
      description: 'Content to be rendered inside the wrapper (default slot). Can be text, elements, or other nodes.',
      table: {
        type: { summary: 'Node' },
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
  render: (args: Args) => wrapper(args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const InteractiveExample: Story = {
  name: 'Interactive Example',
  args: {
    variant: 'inline',
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
};

export const SectionWrapper: Story = {
  name: 'Variant: Section',
  render: ({ children, ...args }: Args) => wrapper(args, typography({}, children ?? '')),
  args: {
    variant: 'section',
    children:
      'This content is semantically grouped within a `section` element, which is ideal for thematically related content.',
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
};

export const InlineWrapper: Story = {
  name: 'Variant: Inline (Span)',
  render: ({ children, ...args }: Args) =>
    typography({}, 'This is a line of text, and ', wrapper({ ...args, children }), ' is used for inline content.'),
  args: {
    variant: 'inline',
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
};

export const FullPageWrapper: Story = {
  name: 'Variant: Full Page',
  // The source story asks for white text through the typography `styles`, which the typography tokens override,
  // so the text keeps the default color there as well.
  render: ({ children, ...args }: Args) => wrapper(args, typography({}, children ?? '')),
  args: {
    variant: 'fullPage',
    children: 'This wrapper covers the entire viewport, perfect for modals or overlays.',
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
};

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
};

export const WithAccessibility: Story = {
  args: InteractiveExample.args,
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

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('wrapper'),
  parameters: {
    layout: 'padded',
  },
};
