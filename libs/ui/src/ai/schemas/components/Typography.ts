const component = {
  name: 'Typography',
  import: "import { Typography } from 'gd-design-library'",
  description:
    'All text: headings (h1–h6), body paragraphs, caption-styled metadata, code snippets. Accepts box model props (margin, padding, width) directly — no wrapper needed. IMPORTANT: variant="caption" renders a real <caption> element by default, so outside table captions pair it with as="div" or as="span".',
  category: 'Content & Text',
  a2uiName: 'typography',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant - Semantic HTML elements, proper heading hierarchy, screen reader optimized',
  performance: 'Lightweight - Minimal runtime overhead, theme-based styling with CSS-in-JS optimization',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1KB gzipped',
  browserSupport: 'All modern browsers (Chrome, Firefox, Safari, Edge)',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Text content to display (also accepted as value)',
      required: true,
    },
    {
      name: 'variant',
      type: 'string',
      description:
        'Semantic HTML element. Valid values: h1|h2|h3|h4|h5|h6|p|span|small|strong|i|code|kbd|caption|header|sup|sub|div. NEVER use body1, body2, inherit, display, subtitle1, subtitle2 — these are enum key names, not valid variant values. IMPORTANT: variant="caption" renders a real <caption> element by default; outside tables use as="div" or as="span".',
      enum: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'small',
        'strong',
        'i',
        'code',
        'kbd',
        'caption',
        'header',
        'sup',
        'sub',
        'div',
      ] as const,
    },
    {
      name: 'color',
      type: 'string',
      description:
        'Text color. Prefer theme color token paths (e.g. "text.secondary", "text.warning", "text.default"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'align',
      type: 'string',
      description: 'Text alignment',
      enum: ['start', 'end', 'left', 'center', 'right', 'justify'] as const,
    },
    {
      name: 'styleVariant',
      type: 'string | string[]',
      description: 'Additional style modifiers (can be combined as array)',
      enum: [
        'bold',
        'semibold',
        'normal',
        'light',
        'italic',
        'small',
        'underline',
        'uppercase',
        'lowercase',
        'strike',
      ] as const,
    },
    {
      name: 'size',
      type: 'string',
      description: 'Size override for the text',
      enum: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
    },
    {
      name: 'as',
      type: 'string',
      description:
        'Override the rendered HTML element (e.g. render h2 styles on an h1 element). Use as="div" or as="span" with variant="caption" outside table captions.',
    },
    {
      name: 'styling',
      type: 'object',
      description: 'CSS style overrides including textAlign, color, and other CSS properties',
    },
  ],
  examples: [
    '// Basic heading with alignment\n<Typography variant="h1" align="center">Welcome to Our Platform</Typography>',

    '// Body text with color and style variants\n<Typography variant="p" color="text.secondary" styleVariant={["italic"]}>Last updated: 2 hours ago</Typography>',

    '// Hero display text with large size\n<Typography variant="div" size="xl" align="center" styleVariant={["bold"]}>\n  Start Building Amazing Products\n</Typography>',

    '// Nested typography for rich formatting\n<Typography variant="p">\n  By clicking Sign Up, you agree to our <Typography variant="span" styleVariant={["bold", "underline"]}>Terms of Service</Typography>\n</Typography>',

    '// Polymorphic rendering (h2 styles on h1 element)\n<Typography variant="h2" as="h1">Page Title</Typography>',

    '// Caption-styled metadata in normal layouts\n<Typography variant="caption" as="div" styleVariant={["uppercase", "semibold"]} color="text.caption">\n  Featured\n</Typography>',

    '// Code block with monospace font\n<Typography variant="code">npm install gd-design-library</Typography>',

    '// Custom styled paragraph\n<Typography \n  variant="p" \n  styles={{ \n    maxWidth: "600px", \n    marginBottom: "24px",\n    lineHeight: 1.6 \n  }}\n>\n  This is a custom styled paragraph with additional CSS properties.\n</Typography>',

    '// Combined style variants for emphasis\n<Typography variant="small" styleVariant={["italic", "strike"]} color="text.caption">\n  $99.00\n</Typography>\n<Typography variant="p" styleVariant={["bold"]} color="text.secondary">\n  $79.00\n</Typography>',

    '// Display text as custom component\n<Typography variant="h3" as={Link} href="/about">\n  Learn More →\n</Typography>',

    '// Box model props - Apply spacing directly without wrapper elements\n<Typography variant="h2" marginTop="32px" marginBottom="16px">\n  Section Heading\n</Typography>',

    '// Multiple box model props for layout control\n<Typography \n  variant="p" \n  marginLeft="8px" \n  padding="12px 16px"\n  maxWidth="600px"\n  width="100%"\n>\n  Text with direct spacing and sizing props\n</Typography>',

    '// Box model props replace wrapper divs\n// Instead of: <div style={{ marginTop: "24px" }}><Typography>Text</Typography></div>\n// Do this:\n<Typography variant="p" marginTop="24px">Text with margin</Typography>',
  ],
};

const compositionTips: string[] = [
  'Use top-level label or value for text content instead of nesting raw text children in A2UI JSON.',
  'Use variant to choose the semantic text role, and set as="div" or as="span" when caption styling is needed outside tables.',
  'Use styleVariant as a string or array to layer emphasis such as bold, italic, underline, uppercase, or strike on top of the base variant.',
  'Use size, align, color, and styling for presentation while keeping the text semantics clear.',
  'Prefer typography over anonymous text wrappers when the UI needs readable, structured copy or headings.',
];

export default { component, compositionTips };
