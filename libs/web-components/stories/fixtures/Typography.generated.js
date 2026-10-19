// Generated from libs/ui/src/components/atoms/Typography/Typography.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Typography';
const Typography = 'gd-typography';
const Column = 'Column';
const Row = 'Row';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Typography',
  component: Typography,
  tags: ['autodocs'],
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
<li><b>Box Model Props Support</b> – Apply layout styles directly without wrappers: \`<Typography marginLeft="8px" padding="16px" width="100%">\`. Supports all spacing, sizing, and positioning props (margin, padding, width, height, maxWidth, etc.)</li>
<li><b>Dynamic Element Rendering</b> – Use the \`as\` prop to render any HTML element or React component while preserving all Typography styles (e.g., h1 styles on a span)</li>
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
<li>Apply the \`as\` prop when you need different visual styles than semantic meaning (e.g., \`variant="h2" as="h3"\`)</li>
<li>Combine \`styleVariant\` for rich text formatting (e.g., \`["bold", "italic"]\`)</li>
<li>Use \`display\` variant with size control for impactful hero text and headlines</li>
<li>Leverage theme color tokens through the \`color\` prop for consistent brand colors</li>
</ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — Native element + shared token CSS.</b> The clearest verdict in the analysis, and the only one with direct measured support. Zero behavior — its whole job is mapping a variant to token-driven CSS. As a custom element it hides a real &lt;h1&gt; from every light-DOM query (confirmed: document.querySelector(&#39;h1&#39;) finds nothing), while a shared stylesheet delivers the same byte saving and keeps the heading discoverable.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
};
export default meta;
const Template = (args) => demo(Typography, { ...args });
export const Default = Template.bind({});
Default.args = {
  children: 'This is a default body1 text',
  variant: 'p',
  align: 'start',
};
Default.parameters = {
  docs: {
    source: {},
    description: {
      story: `
The default Typography component renders as a \`<p>\` tag with standard body text styling.
<br/><br/>
**Key Features:**
- Uses theme tokens for consistent typography
- Inherits parent color by default
- Supports all box model props (margin, padding, etc.) directly without needing a wrapper
      `,
    },
  },
};
export const AsCustomComponent = Template.bind({});
AsCustomComponent.args = {
  children: 'H4 styles rendered as Row component',
  variant: 'h4',
  as: 'div',
};
AsCustomComponent.parameters = {
  docs: {
    source: {},
    description: {
      story: `
The \`as\` prop enables polymorphic rendering—apply Typography styles to any React component.
<br/><br/>
This example shows \`h4\` typography styles applied to a \`Row\` component, combining text styling with layout capabilities. Perfect for creating styled headings that also serve as flex containers.
      `,
    },
  },
};
export const AsCustomHtmlTag = Template.bind({});
AsCustomHtmlTag.args = {
  children: 'H3 styles rendered as paragraph',
  variant: 'h3',
  as: 'p',
};
AsCustomHtmlTag.parameters = {
  docs: {
    source: {},
    description: {
      story: `
Separate visual presentation from semantic meaning using the \`as\` prop.
<br/><br/>
This renders a \`<p>\` tag with \`h3\` visual styling. Useful when you need specific visual hierarchy but different semantic HTML (e.g., for SEO or accessibility when you already have an h1/h2 on the page).
      `,
    },
  },
};
export const CombinedStyleVariant = Template.bind({});
CombinedStyleVariant.args = {
  children: 'This is a combined style variant text: italic, semibold, strike',
  styleVariant: ['italic', 'semibold', 'strike'],
};
CombinedStyleVariant.parameters = {
  docs: {
    source: {},
    description: {
      story: `
Combine multiple \`styleVariant\` modifiers to create rich text formatting.
<br/><br/>
The \`styleVariant\` prop accepts an array of style modifiers that are applied simultaneously. This example combines italic style, semibold weight, and strikethrough decoration. Great for creating distinctive text treatments without custom CSS.
      `,
    },
  },
};
export const Disclaimers = () => {
  return demo(
    Column,
    null,
    demo(Typography, { styleVariant: ['italic', 'semibold', 'strike'] }, 'Italic SemiBold Strike Text'),
    demo(Typography, { styleVariant: 'semibold' }, 'Semibold Text'),
    demo(Typography, { styleVariant: 'normal' }, 'Normal Text'),
    demo(Typography, { styleVariant: 'light' }, 'Light Text'),
    demo(Typography, { styleVariant: 'underline' }, 'Underline Text'),
    demo(Typography, { styleVariant: 'strike' }, 'Strike Text'),
    demo(Typography, { styleVariant: 'uppercase' }, 'Uppercase Text'),
    demo(Typography, { styleVariant: 'lowercase' }, 'Lowercase Text'),
    demo(Typography, { styleVariant: 'small' }, 'Small Text')
  );
};
Disclaimers.parameters = {
  docs: {
    source: {},
    description: {
      story: `
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
    },
  },
};
export const Display = () => {
  return demo(
    Fragment,
    null,
    demo(
      Row,
      { styles: { paddingBottom: '30px' } },
      demo(Typography, { variant: 'h3' }, 'Display(tag - span) - variant + size(only for Display variant)')
    ),
    demo(Row, null, demo(Typography, { variant: 'div', size: 'xl' }, 'Size - xl')),
    demo(
      Row,
      null,
      demo(Typography, { variant: 'div', size: 'xl' }, demo(Typography, { variant: 'strong' }, 'Size - xl'))
    ),
    demo(Row, null, demo(Typography, { variant: 'div', size: 'lg' }, 'Size - lg')),
    demo(
      Row,
      null,
      demo(Typography, { variant: 'div', size: 'lg' }, demo(Typography, { variant: 'strong' }, 'Size - lg'))
    ),
    demo(Row, null, demo(Typography, { variant: 'div', size: 'md' }, 'Size - md')),
    demo(
      Row,
      null,
      demo(Typography, { variant: 'div', size: 'md' }, demo(Typography, { variant: 'strong' }, 'Size - md'))
    ),
    demo(Row, null, demo(Typography, { variant: 'div', size: 'sm' }, 'Size - sm')),
    demo(
      Row,
      null,
      demo(Typography, { variant: 'div', size: 'sm' }, demo(Typography, { variant: 'strong' }, 'Size - sm'))
    ),
    demo(Row, null, demo(Typography, { variant: 'div', size: 'xs' }, 'Size - xs')),
    demo(
      Row,
      null,
      demo(Typography, { variant: 'div', size: 'xs' }, demo(Typography, { variant: 'strong' }, 'Size - xs'))
    )
  );
};
Display.parameters = {
  docs: {
    source: {},
    description: {
      story: `
The \`Display\` variant (\`variant="div"\`) is designed for large, impactful text like hero headlines and marketing content.
<br/><br/>
**Key Features:**
- Renders as a \`<div>\` element
- Supports fine-grained size control via the \`size\` prop (xs, sm, md, lg, xl)
- Each size maps to specific font-size and line-height tokens
- Can be combined with \`styleVariant\` for bold or other effects
- Ideal for landing page headers, hero sections, and call-to-action text
<br/><br/>
**Note:** The \`size\` prop ONLY works with \`variant="div"\` (Display variant) and is ignored for all other variants.
      `,
    },
  },
};
export const Heading = () => {
  return demo(
    Fragment,
    null,
    demo(Typography, { variant: 'h1' }, 'Heading 1'),
    demo(Typography, { variant: 'h2' }, 'Heading 2'),
    demo(Typography, { variant: 'h3' }, 'Heading 3'),
    demo(Typography, { variant: 'h4' }, 'Heading 4'),
    demo(Typography, { variant: 'h5' }, 'Heading 5'),
    demo(Typography, { variant: 'h6' }, 'Heading 6')
  );
};
Heading.parameters = {
  docs: {
    source: {},
    description: {
      story: `
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
**Pro Tip:** Apply box model props directly for spacing, e.g., \`<Typography variant="h2" marginBottom="24px">\`
      `,
    },
  },
};
export const Body = () => {
  return demo(
    Column,
    null,
    demo(Typography, { variant: 'p' }, 'Body1(tag - p) - Default Text'),
    demo(Typography, { variant: 'p' }, 'Body1 - with ', demo(Typography, { variant: 'sup' }, 'Sup Text')),
    demo(Typography, { variant: 'p' }, 'Body1 - with ', demo(Typography, { variant: 'sub' }, 'Sub Text')),
    demo(Typography, { variant: 'small' }, 'Body2 '),
    demo(Typography, { variant: 'caption', as: 'div' }, 'Caption Text'),
    demo(Typography, { variant: 'i' }, 'Inherit Italic Text'),
    demo(Typography, { variant: 'strong' }, 'Bold Text')
  );
};
Body.parameters = {
  docs: {
    source: {},
    description: {
      story: `
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
**Layout Props:** Typography accepts all box model props directly (margin, padding, width, etc.), eliminating the need for wrapper elements:
\`\`\`tsx
<Typography variant="p" marginTop="16px" paddingLeft="8px">
  Text with spacing
</Typography>
\`\`\`
      `,
    },
  },
};
export const WithAccessibility = {
  render: Disclaimers,
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
export const DefaultTokens = () => demo(TokenViewer, { tokens: { typography: defaultTheme.typography } });
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    source: {},
    description: {
      story: `
Explore all typography design tokens used by the Typography component.
<br/><br/>
These tokens define font sizes, weights, line heights, and spacing for each variant. Tokens are fully customizable through the theme system, allowing for brand-specific typography scales.
      `,
    },
  },
};
