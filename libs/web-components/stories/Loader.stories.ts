import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdLoader, GdTypography } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';

type Args = Pick<
  GdLoader,
  'name' | 'variant' | 'size' | 'rounded' | 'withWrapper' | 'WrapperView' | 'animationProps' | 'styles'
> & { children?: string; className?: string };

type Props = Record<string, unknown>;

// Building blocks composed by the source stories (Row, Column, Typography).
// The source stories use `TypographyVariant.P` / `TypographyVariant.Small`, which are not members of the
// variant enum (the members are `Body1` / `Body2`), so those texts render as the inherited `span` variant.
// `span` here reproduces exactly what the source renders.
const typography = (variant: GdTypography['variant'], text: string) => element('gd-typography', { variant }, text);
const row = (props: Props, ...children: Node[]) => {
  const node = element('gd-row', props);
  node.append(...children);
  return node;
};
const column = (props: Props, ...children: Node[]) => {
  const node = element('gd-column', props);
  node.append(...children);
  return node;
};
const loader = (props: Props = {}) => element('gd-loader', props);
const labelled = (loaderNode: HTMLElement, label: string) =>
  column({ gap: '8px', align: 'center' }, loaderNode, typography('span', label));

const storyParameters = (description: string, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, description: { story: description } },
});

const meta = {
  title: 'Atoms/Loader',
  component: 'gd-loader',
  tags: ['autodocs'],
  args: {
    withWrapper: true,
    name: 'circle',
    variant: 'inline',
    size: 'md',
  },
  argTypes: {
    // ============================================================================
    // Appearance
    // ============================================================================
    name: {
      description:
        'Type of loader animation to display. "circle" provides a smooth rotating animation, while "dots" offers a rhythmic pulsing sequence',
      options: ['circle', 'dots'],
      control: { type: 'select' },
      table: {
        category: 'Appearance',
        type: { summary: '"circle" | "dots"' },
        defaultValue: { summary: 'circle' },
      },
    },
    size: {
      description:
        'Size variant of the loader. Controls both the loader animation size and wrapper dimensions. Available sizes: xs, sm, md (default), lg, xl',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      table: {
        category: 'Appearance',
        type: { summary: 'SizeVariant' },
        defaultValue: { summary: 'SizeVariant.Md' },
      },
    },
    rounded: {
      description:
        'Border radius style for the loader. Available options: none, default, round, xs, sm, md, lg, xl. Note: Only applies to "dots" animation type, not "circle"',
      options: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      table: {
        category: 'Appearance',
        type: { summary: "'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'none' },
      },
    },
    // ============================================================================
    // Layout & Positioning
    // ============================================================================
    variant: {
      description:
        'Layout wrapper variant that determines positioning and container behavior. Inline: flows naturally in content, Section: absolute positioned overlay within container, FullPage: fixed position full-screen overlay with portal',
      options: ['inline', 'section', 'fullPage'],
      control: { type: 'select' },
      table: {
        category: 'Layout & Positioning',
        type: { summary: 'inline | section | fullPage' },
        defaultValue: { summary: 'inline' },
      },
    },
    withWrapper: {
      description:
        'Whether to wrap the loader in a container element. When false, the loader renders directly without wrapper styling. Useful for embedding loaders in buttons or other custom containers',
      control: 'boolean',
      table: {
        category: 'Layout & Positioning',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    WrapperView: {
      description:
        'HTML element type to use for the wrapper container (wrapper-view attribute). Defaults to "span" for inline usage. Use semantic elements like "div", "section", or custom elements for better accessibility',
      control: 'text',
      table: {
        category: 'Layout & Positioning',
        type: { summary: 'keyof HTMLElementTagNameMap' },
        defaultValue: { summary: 'span' },
      },
    },
    // ============================================================================
    // Content & Customization
    // ============================================================================
    children: {
      description:
        'Custom content to replace the default loader animation (default slot). Use this to create custom loading indicators while maintaining Loader wrapper and positioning functionality',
      control: 'text',
      table: {
        category: 'Content & Customization',
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
      },
    },
    animationProps: {
      description:
        'Custom CSS animation properties string. Overrides default animation timing and easing for advanced customization. Use sparingly—prefer size and variant props for standard use cases',
      control: 'text',
      table: {
        category: 'Content & Customization',
        type: { summary: 'string' },
        defaultValue: { summary: 'BASE_ANIMATION' },
      },
    },
    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description:
        'Custom CSS styles object to override default theme tokens. Use for one-off styling needs. Prefer theme tokens and component props for consistent design system styling',
      control: 'object',
      table: {
        category: 'Custom Styling',
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    className: {
      description:
        'Additional CSS class names to apply to the loader element. Use for custom styling, state management, or integration with CSS frameworks',
      control: 'text',
      table: {
        category: 'Custom Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Loader\` component is a versatile loading indicator designed to provide visual feedback during asynchronous operations.
  It seamlessly integrates into any part of your application to enhance user experience by clearly showing loading states.
  <br/><br/>

  <h3>🎯 Core Features</h3>
  <ul>
  <li><b>Multiple Animation Types</b> – Two built-in animations: "circle" (smooth rotation) and "dots" (rhythmic pulsing). Support for custom animations via slotted content</li>
  <li><b>Flexible Positioning</b> – Three wrapper variants: Inline (natural flow), Section (overlay within container), FullPage (full-screen overlay)</li>
  <li><b>Size Variants</b> – Five responsive sizes (xs, sm, md, lg, xl) for different contexts from inline text to full-page overlays</li>
  <li><b>Border Radius Control</b> – Rounded prop for styling dots animation with border radius (none, default, round, xs, sm, md, lg, xl). Note: Only applies to "dots", not "circle"</li>
  <li><b>Wrapper Control</b> – Optional wrapper container with customizable HTML element for semantic flexibility</li>
  <li><b>Theme Integration</b> – Full theme customization with design tokens for colors, sizes, and animations</li>
  <li><b>Custom Content</b> – Replace default animations with custom slotted content while maintaining wrapper functionality</li>
  </ul>

  <h3>📋 Usage Patterns</h3>
  <ul>
  <li><b>Inline Loading</b> – Use \`variant="inline"\` for text replacements and inline content: \`<gd-loader name="circle" size="sm"></gd-loader>\`</li>
  <li><b>Section Overlay</b> – Use \`variant="section"\` for container-level loading states with absolute positioning</li>
  <li><b>Full Page</b> – Use \`variant="fullPage"\` for modal-style full-screen loading overlays rendered in the top layer</li>
  <li><b>Button Integration</b> – Use \`withWrapper = false\` and \`size="sm"\` for compact button loaders: \`<gd-loader size="sm"></gd-loader>\`</li>
  <li><b>Custom Animations</b> – Pass custom content as children of the element for branded loading animations</li>
  </ul>

  <h3>💡 Best Practices</h3>
  <ul>
  <li>Use "circle" animation for general loading states and "dots" for more playful or casual interfaces</li>
  <li>Choose size based on context: xs/sm for inline, md for buttons, lg/xl for section/full-page</li>
  <li>Use \`rounded\` prop to style dots animation corners when desired (does not apply to circle)</li>
  <li>Set \`withWrapper = false\` when embedding in buttons or custom containers to avoid wrapper styling</li>
  <li>Use Section variant with relative positioned containers for localized loading states</li>
  <li>Prefer theme tokens over custom styles for consistent design system integration</li>
  </ul>
        `,
      },
    },
  },
  render: ({ children, ...props }: Args) => {
    const node = element('gd-loader', props);
    if (children) node.append(children);
    return node;
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: { name: 'circle', size: 'md', variant: 'inline' },
  parameters: storyParameters(
    'Default loader with circle animation, medium size, and inline variant. This is the standard loading indicator for most use cases.',
    `<gd-loader name="circle" size="md" variant="inline"></gd-loader>`
  ),
};

export const LoaderNames: Story = {
  render: () =>
    row(
      { gap: '30px', align: 'center' },
      column({ gap: '10px' }, typography('h6', 'Circle Animation'), loader({ name: 'circle', size: 'md' })),
      column({ gap: '10px' }, typography('h6', 'Dots Animation'), loader({ name: 'dots', size: 'md' }))
    ),
  parameters: storyParameters(
    'Two animation types available: "circle" provides a smooth rotating animation ideal for general loading states, while "dots" offers a rhythmic pulsing sequence suitable for more playful interfaces.',
    `<gd-row gap="30px" align="center">
  <gd-column gap="10px">
    <gd-typography variant="h6">Circle Animation</gd-typography>
    <gd-loader name="circle" size="md"></gd-loader>
  </gd-column>
  <gd-column gap="10px">
    <gd-typography variant="h6">Dots Animation</gd-typography>
    <gd-loader name="dots" size="md"></gd-loader>
  </gd-column>
</gd-row>`
  ),
};

export const LoaderSizes: Story = {
  render: () =>
    column(
      { gap: '20px' },
      column(
        { gap: '10px' },
        typography('h5', 'Loader Sizes'),
        typography('span', 'Five size variants from extra small to extra large')
      ),
      row(
        { gap: '20px', align: 'center' },
        ...(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) =>
          labelled(loader({ name: 'circle', size }), size.toUpperCase())
        )
      )
    ),
  parameters: storyParameters(
    'Five size variants available: xs (extra small) for inline text, sm (small) for buttons, md (medium) for standard use, lg (large) for sections, and xl (extra large) for full-page overlays.',
    `<gd-row gap="20px" align="center">
  <gd-loader name="circle" size="xs"></gd-loader>
  <gd-loader name="circle" size="sm"></gd-loader>
  <gd-loader name="circle" size="md"></gd-loader>
  <gd-loader name="circle" size="lg"></gd-loader>
  <gd-loader name="circle" size="xl"></gd-loader>
</gd-row>`,
    { layout: 'padded' }
  ),
};

export const LoaderRounded: Story = {
  render: () =>
    column(
      { gap: '20px' },
      column(
        { gap: '10px' },
        typography('h5', 'Loader with Rounded Border'),
        typography(
          'span',
          'The rounded prop controls border radius for dots animation. Note: rounded prop only applies to "dots" animation type, not "circle"'
        )
      ),
      row(
        { gap: '20px', align: 'center' },
        ...(
          [
            ['none', 'None'],
            ['xs', 'XS'],
            ['sm', 'SM'],
            ['md', 'MD'],
            ['lg', 'LG'],
            ['xl', 'XL'],
            ['round', 'Round'],
          ] as const
        ).map(([rounded, label]) => labelled(loader({ name: 'dots', size: 'md', rounded }), label))
      )
    ),
  parameters: storyParameters(
    'Rounded prop controls the border radius of dots animation. Available options: none, default, round, xs, sm, md, lg, xl. **Important**: The rounded prop only applies to "dots" animation type. Circle animations are always circular and do not use border radius.',
    `<gd-row gap="20px" align="center">
  <gd-loader name="dots" size="md" rounded="none"></gd-loader>
  <gd-loader name="dots" size="md" rounded="xs"></gd-loader>
  <gd-loader name="dots" size="md" rounded="sm"></gd-loader>
  <gd-loader name="dots" size="md" rounded="md"></gd-loader>
  <gd-loader name="dots" size="md" rounded="lg"></gd-loader>
  <gd-loader name="dots" size="md" rounded="xl"></gd-loader>
  <gd-loader name="dots" size="md" rounded="round"></gd-loader>
</gd-row>`,
    { layout: 'padded' }
  ),
};

export const LoaderVariantsWithWrapperViewAsHeaderTag: Story = {
  args: { variant: 'inline', WrapperView: 'header' },
  parameters: storyParameters(
    'Customize the wrapper element using WrapperView prop. Use semantic HTML elements like "header", "section", "div", or custom elements for better accessibility and structure.',
    `<gd-loader variant="inline" wrapper-view="header"></gd-loader>`
  ),
};

export const WithAccessibility: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; gap: 40px';
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-label', 'Loading content');
    wrapper.append(
      column({ gap: '10px' }, loader({ name: 'circle', size: 'md' })),
      column({ gap: '10px' }, loader({ name: 'dots', size: 'md' }))
    );
    return wrapper;
  },
  parameters: {
    a11y: { test: 'error' },
    docs: { disable: true },
  },
  tags: ['a11y'],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('loader'),
  parameters: storyParameters(
    'View the default theme tokens used by the Loader component. These tokens control colors, sizes, animations, and spacing for all loader variants.',
    `<!-- Rendered with the TokenViewer helper from the default theme -->
<script type="module">
  import { defaultTheme } from 'gd-design-library/tokens';
  console.log({ loader: defaultTheme.loader });
</script>`,
    { layout: 'padded' }
  ),
};
