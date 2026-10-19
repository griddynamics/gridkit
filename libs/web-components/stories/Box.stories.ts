import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdBox, GdTypography } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { BOX_STYLES_FLEXBOX, BOX_STYLES_POSITION, BOX_STYLES_SIZING, BOX_STYLES_SPACING, cssArg } from './css-arg';
import { formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = Pick<GdBox, 'variant' | 'isBordered' | 'isHighlighted' | 'withShadowHover' | 'tabIndex'> &
  BoxStoryArgs & { children?: string | Node };

type Props = Record<string, unknown>;
type Content = string | Node;

// Building blocks composed by the stories.
const box = (props: object, ...children: Content[]) => {
  const node = element('gd-box', props as Partial<GdBox>);
  node.append(...children);
  return node;
};
// The source stories also pass `styles={{ fontWeight: 600 }}` to some labels, but token styles take
// precedence over Typography `styles`, so those labels render with the regular weight. The extra
// `styles` argument is therefore only used for values the tokens do not set.
const typography = (variant: GdTypography['variant'], text: string, styles?: Props) =>
  element('gd-typography', { variant, ...(styles ? { styles } : {}) } as Partial<GdTypography>, text);
const plainItem = (label: string, extra = '') => {
  const item = document.createElement('div');
  item.style.cssText = `padding:10px;background:#e0e0e0;border-radius:4px;${extra}`;
  item.textContent = label;
  return item;
};

const storyParameters = (description: string, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, description: { story: description } },
});

const SIZING = BOX_STYLES_SIZING;
const SPACING = BOX_STYLES_SPACING;
const FLEXBOX = BOX_STYLES_FLEXBOX;
const POSITION = BOX_STYLES_POSITION;

const meta = {
  title: 'Atoms/Box',
  component: 'gd-box',
  tags: ['autodocs'],
  argTypes: {
    // ============================================================================
    // Core Props
    // ============================================================================
    children: {
      description: 'Box content (default slot)',
      control: 'text',
      table: {
        category: 'Core Props',
        type: { summary: 'Node' },
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
    width: cssArg('width', SIZING),
    height: cssArg('height', SIZING),
    minWidth: cssArg('min-width', SIZING),
    minHeight: cssArg('min-height', SIZING),
    maxWidth: cssArg('max-width', SIZING),
    maxHeight: cssArg('max-height', SIZING),

    // ============================================================================
    // Box Styles - Spacing
    // ============================================================================
    padding: cssArg('padding', SPACING),
    paddingTop: cssArg('padding-top', SPACING),
    paddingRight: cssArg('padding-right', SPACING),
    paddingBottom: cssArg('padding-bottom', SPACING),
    paddingLeft: cssArg('padding-left', SPACING),
    margin: cssArg('margin', SPACING),
    marginTop: cssArg('margin-top', SPACING),
    marginRight: cssArg('margin-right', SPACING),
    marginBottom: cssArg('margin-bottom', SPACING),
    marginLeft: cssArg('margin-left', SPACING),

    // ============================================================================
    // Box Styles - Flexbox
    // ============================================================================
    flexDirection: cssArg('flex-direction', FLEXBOX, {
      control: { type: 'select' },
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      type: 'string',
    }),
    justifyContent: cssArg('justify-content', FLEXBOX, {
      control: { type: 'select' },
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      type: 'string',
    }),
    alignItems: cssArg('align-items', FLEXBOX, {
      control: { type: 'select' },
      options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      type: 'string',
    }),
    alignContent: cssArg('align-content', FLEXBOX, { type: 'string' }),
    flexWrap: cssArg('flex-wrap', FLEXBOX, { type: 'string' }),
    gap: cssArg('gap', FLEXBOX),
    flex: cssArg('flex', FLEXBOX),
    flexGrow: cssArg('flex-grow', FLEXBOX),
    flexShrink: cssArg('flex-shrink', FLEXBOX),
    flexBasis: cssArg('flex-basis', FLEXBOX),

    // ============================================================================
    // Box Styles - Position & Display
    // ============================================================================
    position: cssArg('position', POSITION, { type: 'string' }),
    overflow: cssArg('overflow', POSITION, { type: 'string' }),

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
  render: ({ children, ...props }: Args) => {
    const node = element('gd-box', props as Props);
    if (children) node.append(children);
    return node;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

// ============================================================================
// Interactive Stories
// ============================================================================

export const Default: Story = {
  args: {
    variant: 'vertical',
    children: 'Box Content',
    padding: '20px',
  },
  parameters: storyParameters(
    'Basic Box with default vertical variant. Use the controls to experiment with different properties.',
    `<gd-box variant="vertical" padding="20px">Box Content</gd-box>`
  ),
};

export const Bordered: Story = {
  args: {
    variant: 'vertical',
    isBordered: true,
    padding: '20px',
    children: 'Bordered Box',
  },
  parameters: storyParameters(
    'Box with `isBordered` enabled, adding a border from theme tokens.',
    `<gd-box variant="vertical" is-bordered padding="20px">Bordered Box</gd-box>`
  ),
};

export const Highlighted: Story = {
  args: {
    variant: 'vertical',
    isHighlighted: true,
    isBordered: true,
    padding: '20px',
    children: 'Hover over me to see the highlight effect!',
  },
  parameters: storyParameters(
    'Box with `isHighlighted` enabled. When you hover over it, an outline appears. This is useful for interactive card-like containers.',
    `<gd-box variant="vertical" is-highlighted is-bordered padding="20px">
  Hover over me to see the highlight effect!
</gd-box>`
  ),
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
  parameters: storyParameters(
    'Box with `withShadowHover` enabled. When you hover over it, a box shadow appears creating an elevation effect. Perfect for cards that lift on hover.',
    `<gd-box variant="vertical" with-shadow-hover padding="20px">
  Hover over me to see the shadow effect!
</gd-box>

<script type="module">
  document.querySelector('gd-box').styles = { backgroundColor: '#fff' };
</script>`
  ),
};

export const VerticalLayout: Story = {
  args: {
    variant: 'vertical',
    gap: '10px',
    padding: '20px',
    isBordered: true,
  },
  render: (args) => {
    return box(args, plainItem('Item 1'), plainItem('Item 2'), plainItem('Item 3'));
  },
  parameters: storyParameters(
    'Vertical variant stacks children in a column with gap spacing. Default flexDirection is column.',
    `<gd-box variant="vertical" gap="10px" padding="20px" is-bordered>
  <div style="padding: 10px; background: #e0e0e0; border-radius: 4px">Item 1</div>
  <div style="padding: 10px; background: #e0e0e0; border-radius: 4px">Item 2</div>
  <div style="padding: 10px; background: #e0e0e0; border-radius: 4px">Item 3</div>
</gd-box>`
  ),
};

export const HorizontalLayout: Story = {
  args: {
    variant: 'horizontal',
    gap: '10px',
    padding: '20px',
    isBordered: true,
  },
  render: (args) => {
    return box(args, plainItem('Item 1', 'flex:1;'), plainItem('Item 2', 'flex:1;'), plainItem('Item 3', 'flex:1;'));
  },
  parameters: storyParameters(
    'Horizontal variant arranges children in a row with gap spacing. Default flexDirection is row.',
    `<gd-box variant="horizontal" gap="10px" padding="20px" is-bordered>
  <div style="padding: 10px; background: #e0e0e0; border-radius: 4px; flex: 1">Item 1</div>
  <div style="padding: 10px; background: #e0e0e0; border-radius: 4px; flex: 1">Item 2</div>
  <div style="padding: 10px; background: #e0e0e0; border-radius: 4px; flex: 1">Item 3</div>
</gd-box>`
  ),
};

export const CenteredContent: Story = {
  args: {
    variant: 'vertical',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '200px',
    isBordered: true,
  },
  render: (args) => {
    return box(
      args,
      typography('h5', 'Centered'),
      typography('small', 'Content is centered both horizontally and vertically')
    );
  },
  parameters: storyParameters(
    'Box with centered content using flexbox alignment properties.',
    `<gd-box
  variant="vertical"
  justify-content="center"
  align-items="center"
  width="300px"
  height="200px"
  is-bordered
>
  <gd-typography variant="h5">Centered</gd-typography>
  <gd-typography variant="small">Content is centered both horizontally and vertically</gd-typography>
</gd-box>`
  ),
};

// ============================================================================
// Showcase Stories
// ============================================================================

const examples = () => {
  return box(
    { variant: 'vertical', gap: '40px', padding: '20px' },
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h3', 'Box Component Examples'),
      typography('p', 'Various use cases demonstrating the flexibility of the Box component')
    ),

    // Variants Comparison
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h5', 'Vertical vs Horizontal Variants'),
      box(
        { variant: 'vertical', gap: '10px' },
        box(
          { variant: 'vertical', gap: '10px', padding: '20px', isBordered: true },
          typography('small', 'Vertical (Default)'),
          typography('small', 'Stacks children vertically')
        ),
        box(
          { variant: 'horizontal', gap: '10px', padding: '20px', isBordered: true },
          typography('small', 'Horizontal'),
          typography('small', 'Arranges children horizontally')
        )
      )
    ),

    // Border & Hover Effects
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h5', 'Border & Hover Effects'),
      typography('small', 'Hover over each box to see different effects', { marginBottom: '10px' }),
      box(
        { variant: 'horizontal', gap: '10px' },
        box(
          { variant: 'vertical', padding: '20px', styles: { backgroundColor: '#f5f5f5' } },
          typography('small', 'Default'),
          typography('small', 'No hover effect')
        ),
        box(
          { variant: 'vertical', padding: '20px', isBordered: true },
          typography('small', 'Bordered'),
          typography('small', 'Static border')
        ),
        box(
          { variant: 'vertical', padding: '20px', isBordered: true, isHighlighted: true },
          typography('small', 'Highlighted'),
          typography('small', 'Outline on hover')
        ),
        box(
          { variant: 'vertical', padding: '20px', withShadowHover: true, styles: { backgroundColor: '#fff' } },
          typography('small', 'Shadow Hover'),
          typography('small', 'Shadow on hover')
        ),
        box(
          {
            variant: 'vertical',
            padding: '20px',
            isBordered: true,
            withShadowHover: true,
            styles: { backgroundColor: '#fff' },
          },
          typography('small', 'Combined'),
          typography('small', 'Border + shadow')
        )
      )
    ),

    // Horizontal Layout
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h5', 'Horizontal Layout with Gap'),
      box(
        { variant: 'horizontal', gap: '10px' },
        ...['Box 1', 'Box 2', 'Box 3'].map((label) =>
          box({ variant: 'vertical', padding: '20px', isBordered: true, styles: { flex: 1 } }, label)
        )
      )
    ),

    // Vertical Stack
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h5', 'Vertical Stack'),
      box(
        { variant: 'vertical', gap: '10px', width: '300px' },
        ...['Item 1', 'Item 2', 'Item 3'].map((label) =>
          box({ variant: 'vertical', padding: '15px', isBordered: true }, label)
        )
      )
    ),

    // Interactive Cards
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h5', 'Interactive Card-like Containers'),
      box(
        { variant: 'horizontal', gap: '15px' },
        box(
          { variant: 'vertical', gap: '15px', padding: '20px', width: '280px', isBordered: true, isHighlighted: true },
          typography('h6', 'Outline Effect'),
          typography('small', 'Uses `isBordered` and `isHighlighted` for outline hover effect.')
        ),
        box(
          {
            variant: 'vertical',
            gap: '15px',
            padding: '20px',
            width: '280px',
            withShadowHover: true,
            styles: { backgroundColor: '#fff', border: '1px solid #e0e0e0' },
          },
          typography('h6', 'Elevation Effect'),
          typography('small', 'Uses `withShadowHover` for shadow elevation on hover.')
        )
      )
    ),

    // Complex Nested Layout
    box(
      { variant: 'vertical', gap: '10px' },
      typography('h5', 'Complex Nested Layout'),
      box(
        { variant: 'vertical', gap: '10px', padding: '20px', isBordered: true },
        typography('h6', 'Dashboard Section'),
        box(
          { variant: 'horizontal', gap: '10px' },
          box(
            { variant: 'vertical', gap: '5px', padding: '15px', isBordered: true },
            typography('small', 'Metric 1'),
            typography('p', '1,234')
          ),
          box(
            { variant: 'vertical', gap: '5px', padding: '15px', isBordered: true },
            typography('small', 'Metric 2'),
            typography('p', '5,678')
          )
        )
      )
    )
  );
};

const examplesSource = `<gd-box variant="vertical" gap="40px" padding="20px">
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h3">Box Component Examples</gd-typography>
    <gd-typography variant="p">Various use cases demonstrating the flexibility of the Box component</gd-typography>
  </gd-box>

  <!-- Variants Comparison -->
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h5">Vertical vs Horizontal Variants</gd-typography>
    <gd-box variant="vertical" gap="10px">
      <gd-box variant="vertical" gap="10px" padding="20px" is-bordered>
        <gd-typography variant="small">Vertical (Default)</gd-typography>
        <gd-typography variant="small">Stacks children vertically</gd-typography>
      </gd-box>
      <gd-box variant="horizontal" gap="10px" padding="20px" is-bordered>
        <gd-typography variant="small">Horizontal</gd-typography>
        <gd-typography variant="small">Arranges children horizontally</gd-typography>
      </gd-box>
    </gd-box>
  </gd-box>

  <!-- Border & Hover Effects -->
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h5">Border & Hover Effects</gd-typography>
    <gd-typography variant="small">Hover over each box to see different effects</gd-typography>
    <gd-box variant="horizontal" gap="10px">
      <gd-box variant="vertical" padding="20px">Default / No hover effect</gd-box>
      <gd-box variant="vertical" padding="20px" is-bordered>Bordered / Static border</gd-box>
      <gd-box variant="vertical" padding="20px" is-bordered is-highlighted>Highlighted / Outline on hover</gd-box>
      <gd-box variant="vertical" padding="20px" with-shadow-hover>Shadow Hover / Shadow on hover</gd-box>
      <gd-box variant="vertical" padding="20px" is-bordered with-shadow-hover>Combined / Border + shadow</gd-box>
    </gd-box>
  </gd-box>

  <!-- Horizontal Layout -->
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h5">Horizontal Layout with Gap</gd-typography>
    <gd-box variant="horizontal" gap="10px">
      <gd-box variant="vertical" padding="20px" is-bordered>Box 1</gd-box>
      <gd-box variant="vertical" padding="20px" is-bordered>Box 2</gd-box>
      <gd-box variant="vertical" padding="20px" is-bordered>Box 3</gd-box>
    </gd-box>
  </gd-box>

  <!-- Vertical Stack -->
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h5">Vertical Stack</gd-typography>
    <gd-box variant="vertical" gap="10px" width="300px">
      <gd-box variant="vertical" padding="15px" is-bordered>Item 1</gd-box>
      <gd-box variant="vertical" padding="15px" is-bordered>Item 2</gd-box>
      <gd-box variant="vertical" padding="15px" is-bordered>Item 3</gd-box>
    </gd-box>
  </gd-box>

  <!-- Interactive Card-like Containers -->
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h5">Interactive Card-like Containers</gd-typography>
    <gd-box variant="horizontal" gap="15px">
      <gd-box variant="vertical" gap="15px" padding="20px" width="280px" is-bordered is-highlighted>
        <gd-typography variant="h6">Outline Effect</gd-typography>
        <gd-typography variant="small">Uses \`isBordered\` and \`isHighlighted\` for outline hover effect.</gd-typography>
      </gd-box>
      <gd-box variant="vertical" gap="15px" padding="20px" width="280px" with-shadow-hover>
        <gd-typography variant="h6">Elevation Effect</gd-typography>
        <gd-typography variant="small">Uses \`withShadowHover\` for shadow elevation on hover.</gd-typography>
      </gd-box>
    </gd-box>
  </gd-box>

  <!-- Complex Nested Layout -->
  <gd-box variant="vertical" gap="10px">
    <gd-typography variant="h5">Complex Nested Layout</gd-typography>
    <gd-box variant="vertical" gap="10px" padding="20px" is-bordered>
      <gd-typography variant="h6">Dashboard Section</gd-typography>
      <gd-box variant="horizontal" gap="10px">
        <gd-box variant="vertical" gap="5px" padding="15px" is-bordered>
          <gd-typography variant="small">Metric 1</gd-typography>
          <gd-typography variant="p">1,234</gd-typography>
        </gd-box>
        <gd-box variant="vertical" gap="5px" padding="15px" is-bordered>
          <gd-typography variant="small">Metric 2</gd-typography>
          <gd-typography variant="p">5,678</gd-typography>
        </gd-box>
      </gd-box>
    </gd-box>
  </gd-box>
</gd-box>`;

export const Examples: Story = {
  render: examples,
  parameters: storyParameters(
    'Collection of examples showing different ways to use the Box component for various layout needs.',
    examplesSource,
    { layout: 'padded' }
  ),
};

export const WithAccessibility: Story = {
  render: examples,
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

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('box'),
  parameters: storyParameters(
    'View the default theme tokens used by the Box component. These tokens control the base display and focus styles.',
    `<!-- Rendered with the TokenViewer helper from the default theme -->
<script type="module">
  import { defaultTheme } from 'gd-design-library/tokens';
  console.log({ box: defaultTheme.box });
</script>`,
    { layout: 'padded' }
  ),
};
