import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { iconCatalog } from 'gd-design-library/icons';
import { registerCustomIcons, type GdIcon, type GdTypography } from '../src';
import {
  BOX_STYLES_FLEXBOX as FLEXBOX,
  BOX_STYLES_POSITION as POSITION,
  BOX_STYLES_SIZING as SIZING,
  BOX_STYLES_SPACING as SPACING,
  cssArg,
} from './css-arg';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = Partial<Pick<GdIcon, 'name' | 'size' | 'fill' | 'fillSvg' | 'width' | 'height'>> &
  Omit<BoxStoryArgs, 'width' | 'height'> & { onClick?: (event: MouseEvent) => void };

type Props = Record<string, unknown>;

const names = Object.keys(iconCatalog);

// Building blocks composed by the stories.
const typography = (variant: GdTypography['variant'], text: string) => element('gd-typography', { variant }, text);
const layout = (tag: 'gd-flex-container' | 'gd-row' | 'gd-column', props: Props, ...children: Node[]) => {
  const node = element(tag, props);
  node.append(...children);
  return node;
};

const storyParameters = (description: string, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, description: { story: description } },
});

const meta = {
  title: 'Atoms/Icon',
  component: 'gd-icon',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Icon\` component is a comprehensive, production-ready SVG icon system that provides a unified interface for displaying icons across your application. Built with flexibility and performance in mind, it supports both a rich built-in icon library and custom icon registration for maximum adaptability.

<br/>
<br/>

<h3>🎨 Icon Library (50+ Icons)</h3>
The component ships with an extensive collection of professionally designed icons organized into logical categories:

<ul>
<li><b>Status & Feedback:</b> \`cross\`, \`success\`, \`error\`, \`warning\`, \`info\`, \`dot\`, \`check\`, \`errorOutline\`</li>
<li><b>Navigation & Direction:</b> \`arrowDown\`, \`arrowRight\`, \`arrowLeft\`, \`arrowForward\`, \`keyboardArrowDown\`, \`keyboardArrowUp\`</li>
<li><b>UI & Interface:</b> \`mobileMenu\`, \`home\`, \`slash\`</li>
<li><b>E-commerce & Shopping:</b> \`localShipping\`, \`favorite\`, \`favoriteOutlined\`, \`shoppingBag\`, \`paymentCard\`</li>
<li><b>User & Account:</b> \`accountCircle\`, \`portrait\`</li>
<li><b>Actions & Operations:</b> \`deleteOutlined\`, \`minus\`, \`plus\`, \`edit\`, \`search\`, \`filter\`, \`ruler\`</li>
<li><b>File & Document:</b> \`attachment\`, \`upload\`, \`folder\`, \`folderOpen\`, \`contentCopy\`, \`fileCopy\`</li>
<li><b>Media & Communication:</b> \`eye\`, \`volumeUp\`, \`send\`, \`chat\`, \`chatBubble\`, \`phone\`</li>
<li><b>System & Technical:</b> \`processing\`, \`wifiTethering\`</li>
<li><b>Rating & Feedback:</b> \`star\`, \`starOutlined\`, \`thumbUp\`, \`thumbDown\`, \`thumbUpFilled\`, \`thumbDownFilled\`</li>
</ul>

<br/>

<h3>⚙️ Key Features</h3>
<ul>
<li><b>Dual Sizing System:</b> Use predefined size variants (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`, \`xxl\`) for consistency, or specify exact pixel dimensions for precise control</li>
<li><b>Advanced Color Control:</b> \`fillSvg\` for single-color icons, \`fill\` for multi-path icons with different colored elements</li>
<li><b>Theme Integration:</b> Automatic color inheritance from theme tokens, with fallback to \`currentColor\` for seamless text integration</li>
<li><b>Box Layout Support:</b> Full Box component properties support for flexible layout control - use \`margin\`, \`padding\`, \`position\`, \`flex\`, \`gap\`, and more for precise positioning and spacing</li>
<li><b>Custom Icon Support:</b> \`registerCustomIcons()\` function allows runtime registration of project-specific or third-party icon sets</li>
<li><b>Interactive Capabilities:</b> Native \`click\` event support for creating clickable icons and interactive elements</li>
<li><b>Accessibility Ready:</b> Systematic \`data-testid\` implementation and proper ARIA support for screen readers</li>
<li><b>Performance Optimized:</b> SVG-based rendering with efficient re-rendering and minimal bundle impact</li>
</ul>

<br/>

<h3>🎯 Common Use Cases</h3>
<ul>
<li><b>Navigation Elements:</b> Use \`arrowRight\`, \`arrowLeft\` for pagination, \`home\` for main navigation</li>
<li><b>Action Buttons:</b> Combine with \`Button\` component using the \`icon-start\` or \`icon-end\` slots</li>
<li><b>Status Indicators:</b> \`success\`, \`error\`, \`warning\` for form validation and system feedback</li>
<li><b>Interactive Elements:</b> \`search\` in search bars, \`filter\` in data tables, \`edit\` in content management</li>
<li><b>Communication Features:</b> \`chat\`, \`chatBubble\`, \`phone\` for messaging and contact interfaces</li>
<li><b>File Operations:</b> \`upload\`, \`download\`, \`attachment\` for document management systems</li>
</ul>

<br/>

<h3>💡 Best Practices</h3>
<ul>
<li><b>Consistent Sizing:</b> Use size variants (\`sm\`, \`md\`, \`lg\`) for visual consistency across your application</li>
<li><b>Color Harmony:</b> Leverage \`fillSvg="currentColor"\` to inherit text color, or use theme color tokens for brand consistency</li>
<li><b>Accessibility:</b> Always pair icons with text labels or use \`aria-label\` for icon-only buttons</li>
<li><b>Performance:</b> Register custom icons once at application startup rather than per-component</li>
<li><b>Interactive Icons:</b> Ensure clickable icons have adequate touch targets (minimum 44px) and clear visual feedback</li>
<li><b>Semantic Usage:</b> Choose icons that clearly communicate their function to users across different cultures and contexts</li>
</ul>

<br/>

<h3>🔧 Technical Implementation</h3>
The component renders a native \`<svg>\` element inside its shadow root and integrates with the theme system through the \`theme\` property or the nearest theme provider. Custom icons are merged with the default set at runtime, providing a flexible architecture that supports both static and dynamic icon requirements.

        `,
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'select' },
      options: names,
      description: 'The name of the icon to display from the registered list.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Icon Selection',
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Predefined size variants that set both width and height according to the theme configuration.',
      table: {
        type: { summary: 'SizeVariant' },
        defaultValue: { summary: 'undefined' },
        category: 'Size & Dimensions',
      },
    },
    width: {
      control: { type: 'number' },
      description: 'Sets the width of the icon in pixels.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Size & Dimensions',
      },
    },
    height: {
      control: { type: 'number' },
      description: 'Sets the height of the icon in pixels.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Size & Dimensions',
      },
    },
    fillSvg: {
      control: { type: 'color' },
      description:
        'Sets the `fill` color of the SVG element itself (fill-svg attribute). Useful for single-color icons.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'none' },
        category: 'Styling & Colors',
      },
    },
    fill: {
      control: { type: 'color' },
      description: 'Sets the `fill` color for specific paths within the SVG that are designed to inherit it.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'currentColor' },
        category: 'Styling & Colors',
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Event handler for click events on the icon.',
      table: {
        type: { summary: 'MouseEventHandler<SVGElement>' },
        defaultValue: { summary: 'undefined' },
        category: 'Interactions',
      },
    },

    // ============================================================================
    // Box Styles - Layout & Sizing
    // ============================================================================
    minWidth: cssArg('min-width', SIZING),
    maxWidth: cssArg('max-width', SIZING),
    minHeight: cssArg('min-height', SIZING),
    maxHeight: cssArg('max-height', SIZING),

    // ============================================================================
    // Box Styles - Spacing
    // ============================================================================
    margin: cssArg('margin', SPACING),
    marginTop: cssArg('margin-top', SPACING),
    marginRight: cssArg('margin-right', SPACING),
    marginBottom: cssArg('margin-bottom', SPACING),
    marginLeft: cssArg('margin-left', SPACING),
    padding: cssArg('padding', SPACING),
    paddingTop: cssArg('padding-top', SPACING),
    paddingRight: cssArg('padding-right', SPACING),
    paddingBottom: cssArg('padding-bottom', SPACING),
    paddingLeft: cssArg('padding-left', SPACING),

    // ============================================================================
    // Box Styles - Flexbox
    // ============================================================================
    flexDirection: cssArg('flex-direction', FLEXBOX, { type: 'string' }),
    justifyContent: cssArg('justify-content', FLEXBOX, { type: 'string' }),
    alignItems: cssArg('align-items', FLEXBOX, { type: 'string' }),
    alignContent: cssArg('align-content', FLEXBOX, { type: 'string' }),
    flexWrap: cssArg('flex-wrap', FLEXBOX, { type: 'string' }),
    gap: cssArg('gap', FLEXBOX),
    flex: cssArg('flex', FLEXBOX),
    flexGrow: cssArg('flex-grow', FLEXBOX),
    flexShrink: cssArg('flex-shrink', FLEXBOX),
    flexBasis: cssArg('flex-basis', FLEXBOX),
    alignSelf: cssArg('align-self', FLEXBOX, { type: 'string' }),
    justifySelf: cssArg('justify-self', FLEXBOX, { type: 'string' }),
    order: cssArg('order', FLEXBOX),

    // ============================================================================
    // Box Styles - Position & Display
    // ============================================================================
    position: cssArg('position', POSITION, { type: 'string' }),
    top: cssArg('top', POSITION),
    right: cssArg('right', POSITION),
    bottom: cssArg('bottom', POSITION),
    left: cssArg('left', POSITION),
    overflow: cssArg('overflow', POSITION, { type: 'string' }),
    zIndex: cssArg('z-index', POSITION),
    border: cssArg('border', POSITION, { type: 'string' }),

    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description: 'Custom styles object for the icon',
      control: 'object',
      table: {
        category: 'Custom Styling',
        type: { summary: 'CSSProperties' },
      },
    },
  },
  render: ({ onClick, ...props }: Args) => {
    const icon = element('gd-icon', props as Partial<GdIcon>);
    if (onClick) icon.addEventListener('click', onClick);
    return icon;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

const allIcons = () =>
  layout(
    'gd-flex-container',
    { minWidth: '480px', maxWidth: '800px' },
    layout(
      'gd-row',
      { gutter: 10, align: 'center', justify: 'center' },
      ...names.map((name) =>
        layout(
          'gd-column',
          { gutter: 10, align: 'center', minWidth: '80px', marginBottom: '10px', padding: '5px' },
          element('gd-icon', { name: name as GdIcon['name'], size: 'md' }),
          typography('small', name)
        )
      )
    )
  );

export const AllIcons: Story = {
  name: 'Icons Library',
  render: allIcons,
  parameters: storyParameters(
    'This story displays all the icons available in the default icon library. It serves as a visual reference guide, making it easy to browse and find the icon you need.',
    `<gd-flex-container min-width="480px" max-width="800px">
  <gd-row gutter="10" align="center" justify="center">
    <gd-column gutter="10" align="center" min-width="80px" margin-bottom="10px" padding="5px">
      <gd-icon name="cross" size="md"></gd-icon>
      <gd-typography variant="small">cross</gd-typography>
    </gd-column>
    <gd-column gutter="10" align="center" min-width="80px" margin-bottom="10px" padding="5px">
      <gd-icon name="success" size="md"></gd-icon>
      <gd-typography variant="small">success</gd-typography>
    </gd-column>
    <!-- One column for every icon name in the library -->
  </gd-row>
</gd-flex-container>`,
    { controls: { hideNoControlsWarning: true } }
  ),
};

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'check',
  },
  parameters: storyParameters(
    'This is the default interactive story. Use the controls in the Addons panel to see how the `Icon` component behaves with different props. You can change the icon, adjust its size, and modify its colors.',
    `<gd-icon name="check"></gd-icon>`
  ),
};

export const WithDefinedSize: Story = {
  args: {
    name: 'check',
    size: 'lg',
    padding: '3px',
  },
  parameters: storyParameters(
    'This story demonstrates using predefined size variants for consistent icon scaling. The `size` property uses values of the size scale (xs, sm, md, lg, xl, xxl) which automatically set both width and height according to the theme configuration. This approach ensures visual consistency across the application.',
    `<gd-icon name="check" size="lg" padding="3px"></gd-icon>`
  ),
};

export const RegisteringCustomIcons: Story = {
  name: 'Registering a Custom Icon',
  render: (args) => {
    registerCustomIcons({
      person: {
        viewBox: '0 0 24 24',
        body: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" fill="var(--gd-icon-fill)"></path>',
      },
    });
    return meta.render({ ...args, name: 'person', size: 'lg' });
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how to extend the icon library using the \`registerCustomIcons\` function. 
<br/>
The best place to add icons is in your app's initialization code (e.g., main.ts) so they are available throughout your application.
<br/>
<ol>
<li>1.  An SVG definition (\`viewBox\` and markup) for a 'person' icon is defined. </li>
<li>2.  It's then passed to \`registerCustomIcons\` with the key \`'person'\`. </li>
<li>3.  Finally, the \`<gd-icon>\` element can render the new icon by setting its \`name\` property to \`'person'\`. </li>
</ol>
<p>This feature is powerful for integrating project-specific or custom-designed icons without modifying the core component.</p>
        `,
      },
      source: {
        code: `
<gd-icon name="person" size="lg"></gd-icon>

<script type="module">
  import { registerCustomIcons } from 'web-components';

  registerCustomIcons({
    person: {
      viewBox: '0 0 24 24',
      body: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" fill="var(--gd-icon-fill)"></path>',
    },
  });
</script>
        `,
        language: 'html',
        transform: (source: string) => source,
      },
    },
  },
};

export const WithAccessibility: Story = {
  ...AllIcons,
  parameters: {
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
  render: () => defaultTokenViewer('icon'),
  parameters: {
    layout: 'padded',
  },
};
