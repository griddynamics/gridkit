import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { FlexDirection } from '@types';

import { defaultTheme } from '@tokens';
import { FlexContainer } from './';

const meta: Meta<typeof FlexContainer> = {
  title: 'Layout & Structure/FlexContainer',
  component: FlexContainer,
  argTypes: {
    flexDirection: {
      options: Object.values(FlexDirection),
      control: {
        type: 'select',
      },
      description: 'Direction of the flex container layout',
      table: {
        defaultValue: { summary: 'Column' },
        type: { summary: 'FlexDirection' },
        category: 'Box Styles - Flexbox',
      },
    },
    gap: {
      control: 'text',
      description: 'Space between flex items',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    justifyContent: {
      control: 'text',
      description: 'CSS justify-content property',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    justifySelf: {
      control: 'text',
      description: 'CSS justify-self property',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    alignItems: {
      control: 'text',
      description: 'CSS align-items property',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    alignSelf: {
      control: 'text',
      description: 'CSS align-self property',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    alignContent: {
      control: 'text',
      description: 'CSS align-content property',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    flexWrap: {
      control: 'text',
      description: 'CSS flex-wrap property',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    flexGrow: {
      control: 'text',
      description: 'CSS flex-grow property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    flexShrink: {
      control: 'text',
      description: 'CSS flex-shrink property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    flexBasis: {
      control: 'text',
      description: 'CSS flex-basis property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    flex: {
      control: 'text',
      description: 'CSS flex property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    order: {
      control: 'text',
      description: 'CSS order property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    width: {
      control: 'text',
      description: 'Width of the container',
      table: {
        defaultValue: { summary: 'auto' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    height: {
      control: 'text',
      description: 'Height of the container',
      table: {
        defaultValue: { summary: 'auto' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    minWidth: {
      control: 'text',
      description: 'Minimum width of the container',
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    minHeight: {
      control: 'text',
      description: 'Minimum height of the container',
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the container',
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of the container',
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    margin: {
      control: 'text',
      description: 'Margin around the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginTop: {
      control: 'text',
      description: 'Top margin of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginRight: {
      control: 'text',
      description: 'Right margin of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginBottom: {
      control: 'text',
      description: 'Bottom margin of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginLeft: {
      control: 'text',
      description: 'Left margin of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    padding: {
      control: 'text',
      description: 'Padding inside the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingTop: {
      control: 'text',
      description: 'Top padding of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingRight: {
      control: 'text',
      description: 'Right padding of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingBottom: {
      control: 'text',
      description: 'Bottom padding of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingLeft: {
      control: 'text',
      description: 'Left padding of the container',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    display: {
      control: { type: 'select' },
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property to control the layout behavior',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Position & Display',
      },
    },
    position: {
      control: 'select',
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      description: 'CSS position property',
      table: {
        defaultValue: { summary: 'static' },
        type: { summary: 'string' },
        category: 'Box Styles - Position & Display',
      },
    },
    top: {
      control: 'text',
      description: 'CSS top property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Position & Display',
      },
    },
    right: {
      control: 'text',
      description: 'CSS right property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Position & Display',
      },
    },
    bottom: {
      control: 'text',
      description: 'CSS bottom property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Position & Display',
      },
    },
    left: {
      control: 'text',
      description: 'CSS left property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Position & Display',
      },
    },
    overflow: {
      control: 'select',
      options: ['visible', 'hidden', 'scroll', 'auto'],
      description: 'Content overflow behavior',
      table: {
        defaultValue: { summary: 'visible' },
        type: { summary: 'string' },
        category: 'Box Styles - Position & Display',
      },
    },
    zIndex: {
      control: 'text',
      description: 'CSS z-index property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Position & Display',
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
        category: 'Custom Styling',
      },
    },
    styles: {
      control: 'object',
      description: 'Custom inline styles for the container',
      table: {
        defaultValue: { summary: '{}' },
        type: { summary: 'CSSProperties' },
        category: 'Custom Styling',
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`FlexContainer\` component is a versatile layout wrapper that provides structured and flexible containment for content using CSS Flexbox.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Layout Control</b>
  <ul>
  <li>Flexible direction management</li>
  <li>Customizable item spacing</li>
  <li>Responsive design support</li>
  </ul>
  </li>
  <li>
  <b>Styling Flexibility</b>
  <ul>
  <li>Custom class support</li>
  <li>Inline style overrides</li>
  <li>Theme integration</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – Semantic HTML structure</li>
  <li><b>Responsiveness</b> – Fluid and adaptable layouts</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Exact dimensions</li>
  <li><code>minWidth/minHeight</code>: Minimum constraints</li>
  <li><code>maxWidth/maxHeight</code>: Maximum constraints</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Overall spacing</li>
  <li><code>marginTop/paddingTop</code>: Top spacing</li>
  <li><code>marginRight/paddingRight</code>: Right spacing</li>
  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>
  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>
  </ul>
  </li>
  <li><code>position</code>: CSS position property</li>
  <li><code>overflow</code>: Content overflow behavior</li>
  </ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — No abstraction — shared utility CSS.</b> Zero behavior and no visual surface of its own. Per-instance custom-element upgrade cost scales with exactly the elements used most.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
} as Meta<typeof FlexContainer>;

export default meta;

type Story = StoryObj<typeof FlexContainer>;

export const Default: Story = {
  args: {
    gap: '8px',
    minWidth: '60vw',
    padding: '10px',
    className: 'bg-gray-100 border border-gray-300',
  },
  render: (args) => (
    <FlexContainer {...args}>
      <p>1. This is a container with maxWidth set to {args.maxWidth}</p>
      <p>2. This is a container with maxWidth set to {args.maxWidth}</p>
      <p>3. This is a container with maxWidth set to {args.maxWidth}</p>
    </FlexContainer>
  ),
} as Story;

export const JustifyStart: Story = {
  args: {
    gap: '8px',
    minWidth: '420px',
    padding: '10px',
    flexDirection: FlexDirection.Row,
    className: 'bg-gray-100 border border-gray-300',
  },
  render: (args) => (
    <FlexContainer {...args} justifyContent="flex-start">
      <div style={{ padding: '6px 10px', background: '#eef2ff', borderRadius: 6 }}>Left</div>
      <div style={{ padding: '6px 10px', background: '#e0f2fe', borderRadius: 6 }}>Aligned</div>
      <div style={{ padding: '6px 10px', background: '#dcfce7', borderRadius: 6 }}>To Start</div>
    </FlexContainer>
  ),
  parameters: {
    docs: {
      source: {
        code: `<FlexContainer flexDirection="row" justifyContent="flex-start" gap="8px" minWidth="420px" padding="10px">
  <div>Left</div>
  <div>Aligned</div>
  <div>To Start</div>
</FlexContainer>`,
      },
      description: {
        story:
          "Demonstrates horizontal alignment using raw CSS `justify-content: flex-start` on a flex row. Across layout utilities you may also encounter the semantic `JustifyType` ('start' | 'center' | 'end' | 'between' | 'around'), which is mapped to CSS values by `calculateJustify()`. For Box-style props like this, pass raw CSS values such as `flex-start`.",
      },
    },
  },
} as Story;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ flexContainer: defaultTheme.flexContainer }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
