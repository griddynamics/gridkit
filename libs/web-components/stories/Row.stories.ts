import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { RowAlign, RowJustify, GdRow } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = BoxStoryArgs & {
  as?: keyof HTMLElementTagNameMap;
  align?: RowAlign;
  justify?: RowJustify;
  gutter?: number | string;
  isWrap?: boolean;
  isReversed?: boolean;
};

function item(label: string, background: string) {
  const child = document.createElement('div');
  child.style.cssText = `background:${background};color:#fff;padding:20px`;
  child.textContent = label;
  return child;
}

const argTypes: NonNullable<Meta<Args>['argTypes']> = {
  as: {
    control: 'text',
    description:
      'Selects the semantic HTML element rendered inside gd-row while preserving all Row styles. Accepts HTML tag names (e.g., "div", "section", "nav"). Useful for semantic HTML and accessibility.',
    table: { defaultValue: { summary: 'div' }, type: { summary: 'keyof HTMLElementTagNameMap' }, category: 'Behavior' },
  },
  align: {
    control: 'select',
    options: ['start', 'center', 'end', 'stretch'],
    description: 'Cross-axis alignment of items',
    table: { defaultValue: { summary: 'stretch' }, type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  justify: {
    control: 'select',
    options: ['start', 'center', 'end', 'space-between', 'space-around'],
    description: 'Main-axis distribution of items',
    table: { defaultValue: { summary: 'start' }, type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  gutter: {
    control: 'number',
    description: 'Space between child elements',
    table: { defaultValue: { summary: '0' }, type: { summary: 'number | string' }, category: 'Box Styles - Flexbox' },
  },
  isWrap: {
    control: 'boolean',
    description: 'Enable wrapping of child elements to next line',
    table: { defaultValue: { summary: 'true' }, type: { summary: 'boolean' }, category: 'Box Styles - Flexbox' },
  },
  isReversed: {
    control: 'boolean',
    description: 'Reverse the order of items visually',
    table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' }, category: 'Box Styles - Flexbox' },
  },
  flex: {
    control: 'text',
    description: 'CSS flex property value for the container',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  width: {
    control: 'text',
    description: 'Sets the width of the row container',
    table: { defaultValue: { summary: 'auto' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  height: {
    control: 'text',
    description: 'Sets the height of the row container',
    table: { defaultValue: { summary: 'auto' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  minWidth: {
    control: 'text',
    description: 'Sets the minimum width constraint',
    table: { type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  minHeight: {
    control: 'text',
    description: 'Sets the minimum height constraint',
    table: { type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  maxWidth: {
    control: 'text',
    description: 'Sets the maximum width constraint',
    table: { type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  maxHeight: {
    control: 'text',
    description: 'Sets the maximum height constraint',
    table: { type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  margin: {
    control: 'text',
    description: 'Sets the margin spacing for all sides',
    table: { type: { summary: 'string' }, category: 'Box Styles - Spacing' },
  },
  marginTop: {
    control: 'text',
    description: 'CSS margin-top property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginRight: {
    control: 'text',
    description: 'CSS margin-right property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginBottom: {
    control: 'text',
    description: 'CSS margin-bottom property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginLeft: {
    control: 'text',
    description: 'CSS margin-left property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  padding: {
    control: 'text',
    description: 'Sets the padding spacing for all sides',
    table: { type: { summary: 'string' }, category: 'Box Styles - Spacing' },
  },
  paddingTop: {
    control: 'text',
    description: 'CSS padding-top property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingRight: {
    control: 'text',
    description: 'CSS padding-right property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingBottom: {
    control: 'text',
    description: 'CSS padding-bottom property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingLeft: {
    control: 'text',
    description: 'CSS padding-left property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  flexDirection: {
    control: 'text',
    description: 'CSS flex-direction property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  justifyContent: {
    control: 'text',
    description: 'CSS justify-content property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  justifySelf: {
    control: 'text',
    description: 'CSS justify-self property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  alignItems: {
    control: 'text',
    description: 'CSS align-items property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  alignSelf: {
    control: 'text',
    description: 'CSS align-self property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  alignContent: {
    control: 'text',
    description: 'CSS align-content property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  flexWrap: {
    control: 'text',
    description: 'CSS flex-wrap property',
    table: { type: { summary: 'string' }, category: 'Box Styles - Flexbox' },
  },
  flexGrow: {
    control: 'text',
    description: 'CSS flex-grow property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  flexShrink: {
    control: 'text',
    description: 'CSS flex-shrink property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  flexBasis: {
    control: 'text',
    description: 'CSS flex-basis property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  order: {
    control: 'text',
    description: 'CSS order property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  gap: {
    control: 'text',
    description: 'CSS gap property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  display: {
    control: { type: 'select' },
    options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
    description: 'CSS display property to control the layout behavior',
    table: { type: { summary: 'string' }, category: 'Box Styles - Position & Display' },
  },
  position: {
    control: 'text',
    description: 'Sets the CSS position property',
    table: {
      defaultValue: { summary: 'relative' },
      type: { summary: 'string' },
      category: 'Box Styles - Position & Display',
    },
  },
  top: {
    control: 'text',
    description: 'CSS top property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Position & Display' },
  },
  right: {
    control: 'text',
    description: 'CSS right property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Position & Display' },
  },
  bottom: {
    control: 'text',
    description: 'CSS bottom property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Position & Display' },
  },
  left: {
    control: 'text',
    description: 'CSS left property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Position & Display' },
  },
  overflow: {
    control: 'text',
    description: 'Controls content overflow behavior',
    table: {
      defaultValue: { summary: 'visible' },
      type: { summary: 'string' },
      category: 'Box Styles - Position & Display',
    },
  },
  zIndex: {
    control: 'text',
    description: 'CSS z-index property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Position & Display' },
  },
  styles: {
    control: 'object',
    description: 'Custom styles for the row container',
    table: { type: { summary: 'CSSProperties' }, category: 'Custom Styling' },
  },
};
const description =
  '\n  The `Row` component is a versatile horizontal layout container based on Flexbox principles that provides structured alignment and spacing for content.\n  <br/>\n  <br/>\n  <h3>Key Features:</h3>\n  <ul>\n  <li>\n  <b>Flexible Layout</b>\n  <ul>\n  <li>Horizontal content arrangement</li>\n  <li>Configurable item spacing</li>\n  <li>Responsive wrapping support</li>\n  </ul>\n  </li>\n  <li>\n  <b>Alignment Control</b>\n  <ul>\n  <li>Vertical alignment options</li>\n  <li>Horizontal distribution settings</li>\n  <li>Reversible item order</li>\n  </ul>\n  </li>\n  <li><b>Accessibility</b> – Semantic structure</li>\n  <li><b>Responsiveness</b> – Fluid layouts</li>\n  </ul>\n  <br/>\n  <h3>Layout Props:</h3>\n  <ul>\n  <li><b>Dimensions</b>\n  <ul>\n  <li><code>width/height</code>: Exact dimensions</li>\n  <li><code>minWidth/minHeight</code>: Minimum constraints</li>\n  <li><code>maxWidth/maxHeight</code>: Maximum constraints</li>\n  </ul>\n  </li>\n  <li><b>Spacing</b>\n  <ul>\n  <li><code>margin/padding</code>: Overall spacing</li>\n  <li><code>marginTop/paddingTop</code>: Top spacing</li>\n  <li><code>marginRight/paddingRight</code>: Right spacing</li>\n  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>\n  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>\n  </ul>\n  </li>\n  <li><code>position</code>: CSS position property</li>\n  <li><code>overflow</code>: Content overflow behavior</li>\n  </ul>\n  ';

const meta = {
  title: 'Layout & Structure/Row',
  component: 'gd-row',
  tags: ['autodocs'],
  argTypes,
  parameters: {
    layout: 'centered',
    docs: { description: { component: description } },
  },
  args: { as: 'div', align: 'stretch', justify: 'start', gutter: 0, isWrap: true, isReversed: false },
  render: (args: Args) => {
    const container = element('gd-flex-container', {
      width: '300px',
      height: '100px',
      padding: '10px',
      overflow: 'auto',
      styles: { backgroundColor: '#f0f0f0' },
    });
    const row = element('gd-row', {
      ...args,
      width: '300px',
      height: '300px',
      paddingTop: '20px',
      paddingBottom: '20px',
      display: 'inline-flex',
    } as Partial<GdRow>);
    row.append(item('Item 1', '#991b1b'), item('Item 2', '#1e40af'), item('Item 3', '#166534'));
    container.append(row);
    return container;
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: formattedSource(`
<gd-flex-container
  width="300px"
  height="100px"
  padding="10px"
  overflow="auto"
>
  <gd-row
    width="300px"
    height="300px"
    padding-top="20px"
    padding-bottom="20px"
    display="inline-flex"
  
  >
    <div style="background: #991b1b; color: #fff; padding: 20px">Item 1</div>
    <div style="background: #1e40af; color: #fff; padding: 20px">Item 2</div>
    <div style="background: #166534; color: #fff; padding: 20px">Item 3</div>
  </gd-row>
</gd-flex-container>

<script type="module">
  document.querySelector('gd-flex-container').styles = {
    backgroundColor: '#f0f0f0',
  };
</script>
  `),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('row'),
  parameters: {
    layout: 'padded',
    ...formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.row);
    `),
  },
};
