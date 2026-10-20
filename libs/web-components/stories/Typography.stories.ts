import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdTypography } from '../src';
import { defaultTokenViewer } from './helpers';
import { column, row, storyParameters, typography } from './text-atoms-helpers';

type Args = Pick<GdTypography, 'variant' | 'as' | 'size' | 'align' | 'color' | 'styleVariant' | 'styles'> & {
  children?: string;
};

const meta = {
  title: 'Atoms/Typography',
  component: 'gd-typography',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'small',
        'div',
        'span',
        'strong',
        'i',
        'code',
        'kbd',
        'caption',
        'header',
        'sup',
        'sub',
      ],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'p' },
        category: 'Appearance',
      },
      description:
        'Determines the semantic HTML element and corresponding typography styles. Options include headings (h1-h6), body text (p, small), display (div), code (code, kbd), and special elements (span, strong, i, caption, header). Each variant maps to theme tokens for consistent styling.',
    },
    color: {
      control: {
        type: 'color',
      },
      table: {
        defaultValue: { summary: 'text.default' },
        category: 'Appearance',
      },
      description:
        'Controls the text color. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path (e.g., "text.primary", "brand.500"). Defaults to theme token "colors.text.default" for consistent theming. Use "inherit" to inherit color from parent elements.',
    },
    styles: {
      control: {
        type: 'object',
      },
      table: {
        defaultValue: { summary: '{}' },
        category: 'Appearance',
      },
      description:
        'Custom CSS styles object for one-off styling needs. Use sparingly—prefer variant and styleVariant props for consistent design. Accepts a CSS object with camelCase property names.',
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'md' },
        category: 'Appearance',
      },
      description:
        'Controls font size and line height for Display variant (variant="div") ONLY. Available sizes: xs, sm, md (default), lg, xl. This enables fine-grained control over hero text and marketing headlines. Ignored for all other variants.',
    },
    align: {
      options: [
        'start',
        'end',
        'center',
        'left',
        'right',
        'justify',
        'match-parent',
        'inherit',
        'initial',
        'revert',
        'revert-layer',
        'unset',
      ],
      control: { type: 'select' },
      table: {
        defaultValue: { summary: 'start' },
        category: 'Layout',
      },
      description:
        'Sets text-align CSS property. Options include "start" (default, respects RTL/LTR), "end", "center", "left", "right", "justify", "match-parent", and CSS keywords (initial, inherit, revert, unset). Use logical values (start/end) for international layouts.',
    },
    styleVariant: {
      options: [
        'light',
        'normal',
        'semibold',
        'bold',
        'italic',
        'small',
        'uppercase',
        'lowercase',
        'underline',
        'strike',
      ],
      control: { type: 'multi-select' },
      table: {
        defaultValue: { summary: '[]' },
        category: 'Appearance',
      },
      description:
        'Applies one or more style modifiers to enhance text appearance. Options: "light" (lighter weight), "normal" (normal weight), "semibold" (medium weight), "bold" (bold weight), "italic" (italic style), "small" (smaller font size), "uppercase", "lowercase", "underline", "strike" (strikethrough). Multiple values can be combined for rich formatting (e.g., ["bold", "italic", "uppercase"]).',
    },
    as: {
      control: { type: 'text' },
      table: {
        category: 'Behavior',
      },
      description:
        'Polymorphic prop that changes the rendered element while preserving all Typography styles. Accepts HTML tag names ("div", "span", "label"). Useful for maintaining visual consistency across different semantic elements (e.g., h1 styles on a div for SEO flexibility).',
    },
    children: {
      control: { type: 'text' },
      table: {
        category: 'Content',
      },
      description:
        'The content to render inside the Typography component (default slot). Accepts text or other typography elements for nested styling. Typography elements can be nested to create rich text formatting with different styles.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Typography\` component is a powerful and flexible text element designed to provide consistent, theme-aware typography across your application.
It serves as the foundation for all text rendering, offering comprehensive control over styling, semantics, and accessibility.
<br/><br/>

<h3>🎯 Core Features</h3>

<ul>
<li><b>Semantic HTML Variants</b> – Built-in variants map to semantic HTML elements: \`h1\`-\`h6\` (headings), \`p\` (body1), \`small\` (body2), \`code\`/\`kbd\` (code blocks), \`span\` (inherit), \`div\` (display), \`strong\` (bold), \`i\` (italic), \`caption\`, and \`header\`</li>
<li><b>Style Overrides</b> – Apply layout styles directly without wrappers through the \`styles\` property: \`typography.styles = { marginLeft: '8px', padding: '16px', width: '100%' }\`. Supports all spacing, sizing, and positioning properties (margin, padding, width, height, maxWidth, etc.)</li>
<li><b>Dynamic Element Rendering</b> – Use the \`as\` property to render any HTML element while preserving all Typography styles (e.g., h1 styles on a span)</li>
<li><b>Flexible Display Sizing</b> – The \`Display\` variant supports independent size control (xs, sm, md, lg, xl) for hero text and marketing content</li>
<li><b>Composable Style Variants</b> – Apply multiple style modifiers simultaneously: \`light\`, \`normal\`, \`semibold\`, \`bold\`, \`italic\`, \`small\`, \`uppercase\`, \`lowercase\`, \`underline\`, \`strike\`</li>
<li><b>Theme Integration</b> – Fully integrated with design tokens, supporting customizable colors, font families, sizes, weights, and line heights through the theme system</li>
<li><b>Text Alignment Control</b> – Supports all standard CSS text alignments: \`start\`, \`end\`, \`center\`, \`left\`, \`right\`, \`justify\`, and more</li>
<li><b>Accessibility First</b> – Proper semantic HTML rendering ensures screen reader compatibility and keyboard navigation support</li>
</ul>

<h3>📋 Typography Variants</h3>
<ul>
<li><b>Headings:</b> \`h1\`, \`h2\`, \`h3\`, \`h4\`, \`h5\`, \`h6\` – Semantic heading hierarchy with automatic margins and sizing</li>
<li><b>Body Text:</b> \`p\` (body1), \`small\` (body2) – Primary and secondary body text for content</li>
<li><b>Display:</b> \`div\` – Large display text with size variants (xs-xl) for hero sections and marketing content</li>
<li><b>Code:</b> \`code\`, \`kbd\` – Monospace code blocks with specialized font family</li>
<li><b>Special:</b> \`caption\`, \`header\`, \`span\` (inherit), \`strong\`, \`i\` – Specialized text elements</li>
</ul>

<h3>💡 Best Practices</h3>
<ul>
<li>Use semantic variants (\`h1\`-\`h6\`) for headings to maintain proper document structure</li>
<li>Reserve \`h1\` for page titles (one per page) for SEO and accessibility</li>
<li>Use \`body1\` for primary content and \`body2\` for supporting/secondary text</li>
<li>Apply the \`as\` property when you need different visual styles than semantic meaning (e.g., \`variant="h2" as="h3"\`)</li>
<li>Combine \`styleVariant\` for rich text formatting (e.g., \`["bold", "italic"]\`)</li>
<li>Use \`display\` variant with size control for impactful hero text and headlines</li>
<li>Leverage theme color tokens through the \`color\` property for consistent brand colors</li>
</ul>
`,
      },
    },
  },
  render: ({ children, ...props }: Args) => typography(props, ...(children ? [children] : [])),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    children: 'This is a default body1 text',
    variant: 'p',
    align: 'start',
  },
  parameters: storyParameters(
    `
The default Typography component renders as a \`<p>\` tag with standard body text styling.
<br/><br/>
**Key Features:**
- Uses theme tokens for consistent typography
- Inherits parent color by default
- Supports box model styles (margin, padding, etc.) directly through the \`styles\` property without needing a wrapper
      `,
    `<gd-typography variant="p" align="start">This is a default body1 text</gd-typography>`
  ),
};

export const AsCustomComponent: Story = {
  args: {
    children: 'H4 styles rendered as Row component',
    variant: 'h4',
    as: 'div',
  },
  // The source story renders the H4 styles on a `Row`, which is a flex row container.
  render: ({ children, ...props }: Args) =>
    typography(
      {
        ...props,
        styles: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', ...props.styles },
      },
      ...(children ? [children] : [])
    ),
  parameters: storyParameters(
    `
The \`as\` property enables polymorphic rendering—apply Typography styles to any element.
<br/><br/>
This example shows \`h4\` typography styles applied to a flex row container, combining text styling with layout capabilities. Perfect for creating styled headings that also serve as flex containers.
      `,
    `<gd-typography
  variant="h4"
  as="div"
  .styles=\${{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch' }}
>H4 styles rendered as Row component</gd-typography>`
  ),
};

export const AsCustomHtmlTag: Story = {
  args: {
    children: 'H3 styles rendered as paragraph',
    variant: 'h3',
    as: 'p',
  },
  parameters: storyParameters(
    `
Separate visual presentation from semantic meaning using the \`as\` property.
<br/><br/>
This renders a \`<p>\` tag with \`h3\` visual styling. Useful when you need specific visual hierarchy but different semantic HTML (e.g., for SEO or accessibility when you already have an h1/h2 on the page).
      `,
    `<gd-typography variant="h3" as="p">H3 styles rendered as paragraph</gd-typography>`
  ),
};

export const CombinedStyleVariant: Story = {
  args: {
    children: 'This is a combined style variant text: italic, semibold, strike',
    styleVariant: ['italic', 'semibold', 'strike'],
  },
  parameters: storyParameters(
    `
Combine multiple \`styleVariant\` modifiers to create rich text formatting.
<br/><br/>
The \`styleVariant\` property accepts an array of style modifiers that are applied simultaneously. This example combines italic style, semibold weight, and strikethrough decoration. Great for creating distinctive text treatments without custom CSS.
      `,
    `<gd-typography style-variant="italic,semibold,strike">
  This is a combined style variant text: italic, semibold, strike
</gd-typography>

<script type="module">
  document.querySelector('gd-typography').styleVariant = ['italic', 'semibold', 'strike'];
</script>`
  ),
};

export const Disclaimers: Story = {
  render: () =>
    column(
      {},
      typography({ styleVariant: ['italic', 'semibold', 'strike'] }, 'Italic SemiBold Strike Text'),
      typography({ styleVariant: 'semibold' }, 'Semibold Text'),
      typography({ styleVariant: 'normal' }, 'Normal Text'),
      typography({ styleVariant: 'light' }, 'Light Text'),
      typography({ styleVariant: 'underline' }, 'Underline Text'),
      typography({ styleVariant: 'strike' }, 'Strike Text'),
      typography({ styleVariant: 'uppercase' }, 'Uppercase Text'),
      typography({ styleVariant: 'lowercase' }, 'Lowercase Text'),
      typography({ styleVariant: 'small' }, 'Small Text')
    ),
  parameters: storyParameters(
    `
All available \`styleVariant\` options demonstrated in one place.
<br/><br/>
**Available Style Variants:**
- \`light\`, \`normal\`, \`semibold\`, \`bold\` - Font weight modifiers
- \`italic\` - Italic font style
- \`small\` - Smaller font size
- \`uppercase\`, \`lowercase\` - Text transformation
- \`underline\`, \`strike\` - Text decoration
<br/><br/>
Mix and match these modifiers to create custom text treatments. Each variant applies specific CSS properties via design tokens.
      `,
    `<gd-column>
  <gd-typography style-variant="italic,semibold,strike">Italic SemiBold Strike Text</gd-typography>
  <gd-typography style-variant="semibold">Semibold Text</gd-typography>
  <gd-typography style-variant="normal">Normal Text</gd-typography>
  <gd-typography style-variant="light">Light Text</gd-typography>
  <gd-typography style-variant="underline">Underline Text</gd-typography>
  <gd-typography style-variant="strike">Strike Text</gd-typography>
  <gd-typography style-variant="uppercase">Uppercase Text</gd-typography>
  <gd-typography style-variant="lowercase">Lowercase Text</gd-typography>
  <gd-typography style-variant="small">Small Text</gd-typography>
</gd-column>`
  ),
};

const displayRow = (size: 'xl' | 'lg' | 'md' | 'sm' | 'xs', nested: boolean) =>
  row(
    {},
    typography(
      { variant: 'div', size },
      nested ? typography({ variant: 'strong' }, `Size - ${size}`) : `Size - ${size}`
    )
  );

export const Display: Story = {
  render: () => {
    const fragment = document.createDocumentFragment();
    fragment.append(
      row(
        { styles: { paddingBottom: '30px' } },
        typography({ variant: 'h3' }, 'Display(tag - span) - variant + size(only for Display variant)')
      ),
      ...(['xl', 'lg', 'md', 'sm', 'xs'] as const).flatMap((size) => [displayRow(size, false), displayRow(size, true)])
    );
    return fragment as unknown as HTMLElement;
  },
  parameters: storyParameters(
    `
The \`Display\` variant (\`variant="div"\`) is designed for large, impactful text like hero headlines and marketing content.
<br/><br/>
**Key Features:**
- Renders as a \`<div>\` element
- Supports fine-grained size control via the \`size\` property (xs, sm, md, lg, xl)
- Each size maps to specific font-size and line-height tokens
- Can be combined with \`styleVariant\` for bold or other effects
- Ideal for landing page headers, hero sections, and call-to-action text
<br/><br/>
**Note:** The \`size\` property ONLY works with \`variant="div"\` (Display variant) and is ignored for all other variants.
      `,
    `<gd-row .styles=\${{ paddingBottom: '30px' }}>
  <gd-typography variant="h3">Display(tag - span) - variant + size(only for Display variant)</gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="xl">Size - xl</gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="xl">
    <gd-typography variant="strong">Size - xl</gd-typography>
  </gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="lg">Size - lg</gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="lg">
    <gd-typography variant="strong">Size - lg</gd-typography>
  </gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="md">Size - md</gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="md">
    <gd-typography variant="strong">Size - md</gd-typography>
  </gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="sm">Size - sm</gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="sm">
    <gd-typography variant="strong">Size - sm</gd-typography>
  </gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="xs">Size - xs</gd-typography>
</gd-row>
<gd-row>
  <gd-typography variant="div" size="xs">
    <gd-typography variant="strong">Size - xs</gd-typography>
  </gd-typography>
</gd-row>`
  ),
};

export const Heading: Story = {
  render: () => {
    const fragment = document.createDocumentFragment();
    fragment.append(
      ...(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((variant, index) =>
        typography({ variant }, `Heading ${index + 1}`)
      )
    );
    return fragment as unknown as HTMLElement;
  },
  parameters: storyParameters(
    `
All six semantic heading levels demonstrated with their default styling.
<br/><br/>
**Semantic Heading Hierarchy:**
- \`h1\` - Page title (use only once per page)
- \`h2\` - Major section headings
- \`h3\` - Subsection headings
- \`h4\` - Sub-subsection headings
- \`h5\` - Minor headings
- \`h6\` - Smallest heading level
<br/><br/>
Each heading variant includes automatic margins and sizing from design tokens. Maintain proper heading order (h1 → h2 → h3) for SEO and accessibility.
<br/><br/>
**Pro Tip:** Apply box model styles directly for spacing, e.g., \`<gd-typography variant="h2" .styles=\${{ marginBottom: '24px' }}>\`
      `,
    `<gd-typography variant="h1">Heading 1</gd-typography>
<gd-typography variant="h2">Heading 2</gd-typography>
<gd-typography variant="h3">Heading 3</gd-typography>
<gd-typography variant="h4">Heading 4</gd-typography>
<gd-typography variant="h5">Heading 5</gd-typography>
<gd-typography variant="h6">Heading 6</gd-typography>`
  ),
};

export const Body: Story = {
  render: () =>
    column(
      {},
      typography({ variant: 'p' }, 'Body1(tag - p) - Default Text'),
      typography({ variant: 'p' }, 'Body1 - with ', typography({ variant: 'sup' }, 'Sup Text')),
      typography({ variant: 'p' }, 'Body1 - with ', typography({ variant: 'sub' }, 'Sub Text')),
      typography({ variant: 'small' }, 'Body2 '),
      typography({ variant: 'caption', as: 'div' }, 'Caption Text'),
      typography({ variant: 'i' }, 'Inherit Italic Text'),
      typography({ variant: 'strong' }, 'Bold Text')
    ),
  parameters: storyParameters(
    `
Body text and special text variants for everyday content.
<br/><br/>
**Body Text Variants:**
- \`p\` (Body1) - Primary body text, renders as \`<p>\` tag
- \`small\` (Body2) - Secondary text, renders as \`<small>\` tag
- \`caption\` - Small caption text for labels and metadata
- \`strong\` - Bold emphasis, renders as \`<strong>\` tag
- \`i\` - Italic emphasis, renders as \`<i>\` tag
- \`sup\` - Superscript text
- \`sub\` - Subscript text
<br/><br/>
**Layout Props:** Typography accepts box model styles directly through the \`styles\` property (margin, padding, width, etc.), eliminating the need for wrapper elements:
\`\`\`html
<gd-typography variant="p" .styles=\${{ marginTop: '16px', paddingLeft: '8px' }}>
  Text with spacing
</gd-typography>
\`\`\`
      `,
    `<gd-column>
  <gd-typography variant="p">Body1(tag - p) - Default Text</gd-typography>
  <gd-typography variant="p">
    Body1 - with <gd-typography variant="sup">Sup Text</gd-typography>
  </gd-typography>
  <gd-typography variant="p">
    Body1 - with <gd-typography variant="sub">Sub Text</gd-typography>
  </gd-typography>
  <gd-typography variant="small">Body2 </gd-typography>
  <gd-typography variant="caption" as="div">Caption Text</gd-typography>
  <gd-typography variant="i">Inherit Italic Text</gd-typography>
  <gd-typography variant="strong">Bold Text</gd-typography>
</gd-column>`
  ),
};

export const WithAccessibility: Story = {
  render: Disclaimers.render,
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
  render: () => defaultTokenViewer('typography'),
  parameters: storyParameters(
    `
Explore all typography design tokens used by the Typography component.
<br/><br/>
These tokens define font sizes, weights, line heights, and spacing for each variant. Tokens are fully customizable through the theme system, allowing for brand-specific typography scales.
      `,
    `<!-- Rendered with the TokenViewer helper from the default theme -->
<script type="module">
  import { defaultTheme } from 'gd-design-library/tokens';
  console.log({ typography: defaultTheme.typography });
</script>`,
    { layout: 'padded' }
  ),
};
