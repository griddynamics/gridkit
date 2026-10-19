import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = BoxStoryArgs & { className?: string };

const argTypes: NonNullable<Meta<Args>['argTypes']> = {
  flexDirection: {
    options: ['row', 'row-reverse', 'column', 'column-reverse'],
    control: { type: 'select' },
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
  flex: {
    control: 'text',
    description: 'CSS flex property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  order: {
    control: 'text',
    description: 'CSS order property',
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Flexbox' },
  },
  width: {
    control: 'text',
    description: 'Width of the container',
    table: { defaultValue: { summary: 'auto' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  height: {
    control: 'text',
    description: 'Height of the container',
    table: { defaultValue: { summary: 'auto' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  minWidth: {
    control: 'text',
    description: 'Minimum width of the container',
    table: { defaultValue: { summary: 'none' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  minHeight: {
    control: 'text',
    description: 'Minimum height of the container',
    table: { defaultValue: { summary: 'none' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  maxWidth: {
    control: 'text',
    description: 'Maximum width of the container',
    table: { defaultValue: { summary: 'none' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  maxHeight: {
    control: 'text',
    description: 'Maximum height of the container',
    table: { defaultValue: { summary: 'none' }, type: { summary: 'string' }, category: 'Box Styles - Layout & Sizing' },
  },
  margin: {
    control: 'text',
    description: 'Margin around the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginTop: {
    control: 'text',
    description: 'Top margin of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginRight: {
    control: 'text',
    description: 'Right margin of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginBottom: {
    control: 'text',
    description: 'Bottom margin of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  marginLeft: {
    control: 'text',
    description: 'Left margin of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  padding: {
    control: 'text',
    description: 'Padding inside the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingTop: {
    control: 'text',
    description: 'Top padding of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingRight: {
    control: 'text',
    description: 'Right padding of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingBottom: {
    control: 'text',
    description: 'Bottom padding of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  paddingLeft: {
    control: 'text',
    description: 'Left padding of the container',
    table: { defaultValue: { summary: '0' }, type: { summary: 'string | number' }, category: 'Box Styles - Spacing' },
  },
  display: {
    control: { type: 'select' },
    options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
    description: 'CSS display property to control the layout behavior',
    table: { type: { summary: 'string' }, category: 'Box Styles - Position & Display' },
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
    table: { type: { summary: 'string | number' }, category: 'Box Styles - Position & Display' },
  },
  className: {
    control: 'text',
    description: 'Additional CSS classes to apply',
    table: {
      defaultValue: {
        summary:
          "Demonstrates horizontal alignment using raw CSS `justify-content: flex-start` on a flex row. Across layout utilities you may also encounter the semantic `JustifyType` ('start' | 'center' | 'end' | 'between' | 'around'), which is mapped to CSS values by `calculateJustify()`. For Box-style props like this, pass raw CSS values such as `flex-start`.",
      },
      type: { summary: 'string' },
      category: 'Custom Styling',
    },
  },
  styles: {
    control: 'object',
    description: 'Custom inline styles for the container',
    table: { defaultValue: { summary: '{}' }, type: { summary: 'CSSProperties' }, category: 'Custom Styling' },
  },
};
const description =
  '\n  The `FlexContainer` component is a versatile layout wrapper that provides structured and flexible containment for content using CSS Flexbox.\n  <br/>\n  <br/>\n  <h3>Key Features:</h3>\n  <ul>\n  <li>\n  <b>Layout Control</b>\n  <ul>\n  <li>Flexible direction management</li>\n  <li>Customizable item spacing</li>\n  <li>Responsive design support</li>\n  </ul>\n  </li>\n  <li>\n  <b>Styling Flexibility</b>\n  <ul>\n  <li>Custom class support</li>\n  <li>Inline style overrides</li>\n  <li>Theme integration</li>\n  </ul>\n  </li>\n  <li><b>Accessibility</b> – Semantic HTML structure</li>\n  <li><b>Responsiveness</b> – Fluid and adaptable layouts</li>\n  </ul>\n  <br/>\n  <h3>Layout Props:</h3>\n  <ul>\n  <li><b>Dimensions</b>\n  <ul>\n  <li><code>width/height</code>: Exact dimensions</li>\n  <li><code>minWidth/minHeight</code>: Minimum constraints</li>\n  <li><code>maxWidth/maxHeight</code>: Maximum constraints</li>\n  </ul>\n  </li>\n  <li><b>Spacing</b>\n  <ul>\n  <li><code>margin/padding</code>: Overall spacing</li>\n  <li><code>marginTop/paddingTop</code>: Top spacing</li>\n  <li><code>marginRight/paddingRight</code>: Right spacing</li>\n  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>\n  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>\n  </ul>\n  </li>\n  <li><code>position</code>: CSS position property</li>\n  <li><code>overflow</code>: Content overflow behavior</li>\n  </ul>\n  ';

const meta = {
  title: 'Layout & Structure/FlexContainer',
  component: 'gd-flex-container',
  tags: ['autodocs'],
  argTypes,
  parameters: {
    layout: 'centered',
    docs: { description: { component: description } },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const justifyStartSource = `<gd-flex-container
  class="bg-gray-100 border border-gray-300"
  flex-direction="row"
  justify-content="flex-start"
  gap="8px"
  min-width="420px"
  padding="10px"
>
  <div style="padding: 6px 10px; background: #eef2ff; border-radius: 6px">Left</div>
  <div style="padding: 6px 10px; background: #e0f2fe; border-radius: 6px">Aligned</div>
  <div style="padding: 6px 10px; background: #dcfce7; border-radius: 6px">To Start</div>
</gd-flex-container>`;

export const Default: Story = {
  args: {
    gap: '8px',
    minWidth: '60vw',
    padding: '10px',
    className: 'bg-gray-100 border border-gray-300',
  },
  render: (args) => {
    const container = element('gd-flex-container', args);
    for (let index = 1; index <= 3; index += 1) {
      const paragraph = document.createElement('p');
      paragraph.textContent = `${index}. This is a container with maxWidth set to ${args.maxWidth ?? ''}`;
      container.append(paragraph);
    }
    return container;
  },
  parameters: formattedSource(`
<gd-flex-container
  class="bg-gray-100 border border-gray-300"
  gap="8px"
  min-width="60vw"
  padding="10px"
>
  <p>1. This is a container with maxWidth set to </p>
  <p>2. This is a container with maxWidth set to </p>
  <p>3. This is a container with maxWidth set to </p>
</gd-flex-container>
  `),
};

export const JustifyStart: Story = {
  args: {
    gap: '8px',
    minWidth: '420px',
    padding: '10px',
    flexDirection: 'row',
    className: 'bg-gray-100 border border-gray-300',
  },
  render: (args) => {
    const container = element('gd-flex-container', { ...args, justifyContent: 'flex-start' });
    for (const [label, background] of [
      ['Left', '#eef2ff'],
      ['Aligned', '#e0f2fe'],
      ['To Start', '#dcfce7'],
    ]) {
      const child = document.createElement('div');
      child.style.cssText = `padding:6px 10px;background:${background};border-radius:6px`;
      child.textContent = label;
      container.append(child);
    }
    return container;
  },
  parameters: {
    docs: {
      description: {
        story: '',
      },
      source: formattedSource(justifyStartSource).docs.source,
    },
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('flexContainer'),
  parameters: {
    layout: 'padded',
    ...formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.flexContainer);
    `),
  },
};
