import { PropsWithChildren } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Column, Row } from '@components';
import { defaultTheme } from '@tokens';

import { Typography, type TypographyProps } from './';

const meta = {
  title: 'Atoms/Typography',
  component: Typography,
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
        'Custom CSS styles object for one-off styling needs. Use sparingly—prefer variant and styleVariant props for consistent design. Accepts Emotion CSS object syntax with support for nested selectors, pseudo-classes, and media queries.',
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
        'Polymorphic prop that changes the rendered element/component while preserving all Typography styles. Accepts HTML tag names ("div", "span", "label") or React components (Row, Column, Link). Useful for maintaining visual consistency across different semantic elements (e.g., h1 styles on a div for SEO flexibility).',
    },
    children: {
      control: { type: 'text' },
      table: {
        category: 'Content',
      },
      description:
        'The content to render inside the Typography component. Accepts text strings, numbers, React elements, or other Typography components for nested styling. Typography components can be nested to create rich text formatting with different styles.',
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
} satisfies Meta<typeof Typography>;

export default meta;

const Template: StoryFn<PropsWithChildren<TypographyProps>> = (args) => <Typography {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'This is a default body1 text',
  variant: 'p',
  align: 'start',
};
Default.parameters = {
  docs: {
    source: {
      code: `<Typography variant="p" align="start">This is a default body1 text</Typography>`,
    },
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
  as: Row,
};
AsCustomComponent.parameters = {
  docs: {
    source: {
      code: `<Typography variant="h4" as={Row}>H4 styles rendered as Row component</Typography>`,
    },
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
    source: {
      code: `<Typography variant="h3" as="p">H3 styles rendered as paragraph</Typography>`,
    },
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
    source: {
      code: `<Typography styleVariant={["italic", "semibold", "strike"]}>
  This is a combined style variant text: italic, semibold, strike
</Typography>`,
    },
    description: {
      story: `
Combine multiple \`styleVariant\` modifiers to create rich text formatting.
<br/><br/>
The \`styleVariant\` prop accepts an array of style modifiers that are applied simultaneously. This example combines italic style, semibold weight, and strikethrough decoration. Great for creating distinctive text treatments without custom CSS.
      `,
    },
  },
};

export const Disclaimers: StoryFn = () => {
  return (
    <Column>
      <Typography styleVariant={['italic', 'semibold', 'strike']}>Italic SemiBold Strike Text</Typography>
      <Typography styleVariant="semibold">Semibold Text</Typography>
      <Typography styleVariant="normal">Normal Text</Typography>
      <Typography styleVariant="light">Light Text</Typography>
      <Typography styleVariant="underline">Underline Text</Typography>
      <Typography styleVariant="strike">Strike Text</Typography>
      <Typography styleVariant="uppercase">Uppercase Text</Typography>
      <Typography styleVariant="lowercase">Lowercase Text</Typography>
      <Typography styleVariant="small">Small Text</Typography>
    </Column>
  );
};
Disclaimers.parameters = {
  docs: {
    source: {
      code: `<Column>
  <Typography styleVariant={["italic", "semibold", "strike"]}>Italic SemiBold Strike Text</Typography>
  <Typography styleVariant="semibold">Semibold Text</Typography>
  <Typography styleVariant="normal">Normal Text</Typography>
  <Typography styleVariant="light">Light Text</Typography>
  <Typography styleVariant="underline">Underline Text</Typography>
  <Typography styleVariant="strike">Strike Text</Typography>
  <Typography styleVariant="uppercase">Uppercase Text</Typography>
  <Typography styleVariant="lowercase">Lowercase Text</Typography>
  <Typography styleVariant="small">Small Text</Typography>
</Column>`,
    },
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
export const Display: StoryFn = () => {
  return (
    <>
      <Row styles={{ paddingBottom: '30px' }}>
        <Typography variant="h3">Display(tag - span) - variant + size(only for Display variant)</Typography>
      </Row>

      <Row>
        <Typography variant="div" size="xl">
          Size - xl
        </Typography>
      </Row>
      <Row>
        <Typography variant="div" size="xl">
          <Typography variant="strong">Size - xl</Typography>
        </Typography>
      </Row>

      <Row>
        <Typography variant="div" size="lg">
          Size - lg
        </Typography>
      </Row>
      <Row>
        <Typography variant="div" size="lg">
          <Typography variant="strong">Size - lg</Typography>
        </Typography>
      </Row>

      <Row>
        <Typography variant="div" size="md">
          Size - md
        </Typography>
      </Row>
      <Row>
        <Typography variant="div" size="md">
          <Typography variant="strong">Size - md</Typography>
        </Typography>
      </Row>

      <Row>
        <Typography variant="div" size="sm">
          Size - sm
        </Typography>
      </Row>
      <Row>
        <Typography variant="div" size="sm">
          <Typography variant="strong">Size - sm</Typography>
        </Typography>
      </Row>

      <Row>
        <Typography variant="div" size="xs">
          Size - xs
        </Typography>
      </Row>
      <Row>
        <Typography variant="div" size="xs">
          <Typography variant="strong">Size - xs</Typography>
        </Typography>
      </Row>
    </>
  );
};
Display.parameters = {
  docs: {
    source: {
      code: `<>
  <Row styles={{ paddingBottom: '30px' }}>
    <Typography variant="h3">Display(tag - span) - variant + size(only for Display variant)</Typography>
  </Row>
  <Row>
    <Typography variant="div" size="xl">Size - xl</Typography>
  </Row>
  <Row>
    <Typography variant="div" size="xl">
      <Typography variant="strong">Size - xl</Typography>
    </Typography>
  </Row>
  <Row>
    <Typography variant="div" size="lg">Size - lg</Typography>
  </Row>
  <Row>
    <Typography variant="div" size="lg">
      <Typography variant="strong">Size - lg</Typography>
    </Typography>
  </Row>
  <Row>
    <Typography variant="div" size="md">Size - md</Typography>
  </Row>
  <Row>
    <Typography variant="div" size="md">
      <Typography variant="strong">Size - md</Typography>
    </Typography>
  </Row>
  <Row>
    <Typography variant="div" size="sm">Size - sm</Typography>
  </Row>
  <Row>
    <Typography variant="div" size="sm">
      <Typography variant="strong">Size - sm</Typography>
    </Typography>
  </Row>
  <Row>
    <Typography variant="div" size="xs">Size - xs</Typography>
  </Row>
  <Row>
    <Typography variant="div" size="xs">
      <Typography variant="strong">Size - xs</Typography>
    </Typography>
  </Row>
</>`,
    },
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

export const Heading: StoryFn = () => {
  return (
    <>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </>
  );
};
Heading.parameters = {
  docs: {
    source: {
      code: `<>
  <Typography variant="h1">Heading 1</Typography>
  <Typography variant="h2">Heading 2</Typography>
  <Typography variant="h3">Heading 3</Typography>
  <Typography variant="h4">Heading 4</Typography>
  <Typography variant="h5">Heading 5</Typography>
  <Typography variant="h6">Heading 6</Typography>
</>`,
    },
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

export const Body: StoryFn = () => {
  return (
    <Column>
      <Typography variant="p">Body1(tag - p) - Default Text</Typography>
      <Typography variant="p">
        Body1 - with <Typography variant="sup">Sup Text</Typography>
      </Typography>
      <Typography variant="p">
        Body1 - with <Typography variant="sub">Sub Text</Typography>
      </Typography>
      <Typography variant="small">Body2 </Typography>
      <Typography variant="caption" as="div">
        Caption Text
      </Typography>
      <Typography variant="i">Inherit Italic Text</Typography>
      <Typography variant="strong">Bold Text</Typography>
    </Column>
  );
};
Body.parameters = {
  docs: {
    source: {
      code: `<Column>
  <Typography variant="p">Body1(tag - p) - Default Text</Typography>
  <Typography variant="p">
    Body1 - with <Typography variant="sup">Sup Text</Typography>
  </Typography>
  <Typography variant="p">
    Body1 - with <Typography variant="sub">Sub Text</Typography>
  </Typography>
  <Typography variant="small">Body2 </Typography>
  <Typography variant="caption" as="div">Caption Text</Typography>
  <Typography variant="i">Inherit Italic Text</Typography>
  <Typography variant="strong">Bold Text</Typography>
</Column>`,
    },
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

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ typography: defaultTheme.typography }} />;
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    source: {
      code: `<TokenViewer tokens={{ typography: defaultTheme.typography }} />`,
    },
    description: {
      story: `
Explore all typography design tokens used by the Typography component.
<br/><br/>
These tokens define font sizes, weights, line heights, and spacing for each variant. Tokens are fully customizable through the theme system, allowing for brand-specific typography scales.
      `,
    },
  },
};
