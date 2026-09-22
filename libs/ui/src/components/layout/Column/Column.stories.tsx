import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { FlexContainer } from '@components';

import { defaultTheme } from '@tokens';
import { Column } from './Column';

export default {
  title: 'Layout & Structure/Column',
  component: Column,
  argTypes: {
    as: {
      control: 'text',
      description:
        'Polymorphic prop that changes the rendered element/component while preserving all Column styles. Accepts HTML tag names (e.g., "div", "section", "main") or React components. Useful for semantic HTML and accessibility.',
      table: {
        defaultValue: { summary: 'div' },
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
        category: 'Behavior',
      },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Vertical alignment of items within the column',
      table: {
        defaultValue: { summary: 'stretch' },
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between', 'space-around'],
      description: 'Horizontal distribution of items',
      table: {
        defaultValue: { summary: 'start' },
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    gutter: {
      control: 'number',
      description: 'Space between items in pixels',
      table: {
        defaultValue: { summary: '16' },
        type: { summary: 'number' },
        category: 'Box Styles - Flexbox',
      },
    },
    isWrap: {
      control: 'boolean',
      description: 'Enable content wrapping',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: 'Box Styles - Flexbox',
      },
    },
    flex: {
      control: 'text',
      description: 'CSS flex property value',
      table: {
        defaultValue: { summary: '1 1 auto' },
        type: { summary: 'string' },
        category: 'Box Styles - Flexbox',
      },
    },
    isReversed: {
      control: 'boolean',
      description: 'Reverse the order of items',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Box Styles - Flexbox',
      },
    },
    minWidth: {
      control: 'text',
      description: 'Minimum width of the column',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    width: {
      control: 'text',
      description: 'Width of the column',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    height: {
      control: 'text',
      description: 'Height of the column',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    padding: {
      control: 'text',
      description: 'Padding around the column content',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingTop: {
      control: 'text',
      description: 'CSS padding-top property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingRight: {
      control: 'text',
      description: 'CSS padding-right property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingBottom: {
      control: 'text',
      description: 'CSS padding-bottom property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    paddingLeft: {
      control: 'text',
      description: 'CSS padding-left property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    margin: {
      control: 'text',
      description: 'Margin around the column',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Spacing',
      },
    },
    marginTop: {
      control: 'text',
      description: 'CSS margin-top property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginRight: {
      control: 'text',
      description: 'CSS margin-right property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginBottom: {
      control: 'text',
      description: 'CSS margin-bottom property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    marginLeft: {
      control: 'text',
      description: 'CSS margin-left property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Spacing',
      },
    },
    flexDirection: {
      control: 'text',
      description: 'CSS flex-direction property',
      table: {
        type: { summary: 'string' },
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
    order: {
      control: 'text',
      description: 'CSS order property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
      },
    },
    gap: {
      control: 'text',
      description: 'CSS gap property',
      table: {
        type: { summary: 'string | number' },
        category: 'Box Styles - Flexbox',
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
      control: 'text',
      description: 'CSS position property',
      table: {
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
      control: 'text',
      description: 'CSS overflow property',
      table: {
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
    maxWidth: {
      control: 'text',
      description: 'Sets the maximum width constraint',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    maxHeight: {
      control: 'text',
      description: 'Sets the maximum height constraint',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    minHeight: {
      control: 'text',
      description: 'Sets the minimum height constraint',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Layout & Sizing',
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS styles',
      table: {
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
  The \`Column\` component is a fundamental building block for creating vertical layouts with flexible alignment and spacing options.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Flexible Layout Control</b>
  <ul>
  <li>Vertical content arrangement</li>
  <li>Customizable spacing and gutters</li>
  <li>Reversible direction</li>
  <li>Wrap control for overflow</li>
  </ul>
  </li>
  <li>
  <b>Alignment Options</b>
  <ul>
  <li>Vertical alignment modes</li>
  <li>Horizontal content distribution</li>
  <li>Flexible item spacing</li>
  </ul>
  </li>
  <li><b>Responsive Design</b> – Adapts to different screen sizes</li>
  <li><b>Nesting Support</b> – Can contain other layout components</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Column size</li>
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
<b>Verdict — No abstraction — shared utility CSS.</b> Zero behavior. Shadow DOM actively fights flex layout: a percentage width on a shadow child resolves against an auto-width host, and the symptom is a child rendering at 0px rather than an error.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
} as Meta<typeof Column>;

const Template: StoryFn<typeof Column> = (args) => (
  <FlexContainer height="400px" styles={{ backgroundColor: '#f0f0f0' }}>
    <Column
      {...args}
      align="stretch"
      width="300px"
      height="300px"
      paddingTop="20px"
      paddingBottom="20px"
      isReversed={false}
      isWrap={false}
    >
      <div style={{ background: 'red', padding: '20px' }}>Item 1</div>
      <div style={{ background: 'blue', padding: '20px' }}>Item 2</div>
      <div style={{ background: 'green', padding: '20px' }}>Item 3</div>
    </Column>
  </FlexContainer>
);
export const Default = Template.bind({});
Default.args = {};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ column: defaultTheme.column }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
