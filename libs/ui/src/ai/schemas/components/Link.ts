const component = {
  name: 'Link',
  import: "import { Link } from 'gd-design-library'",
  description:
    'Accessible anchor component for navigation with support for internal and absolute URL destinations, multiple visual variants, and proper security attributes. A2UI SPEC: use top-level "label" for text, plus top-level "href", "variant", "underline", "target", and "rel". Do NOT use "children" or put href inside "attributes". For custom hover colors, use the top-level "styling" object with standard CSS values. Figma color tokens: gds.color.text.link → color.text.link.default (#53B7E8) for default link state; gds.color.text.link.hover → color.text.link.hover (#278CBF) — pass default via the top-level "color" prop and hover via styling["&:hover"].color.',
  a2uiName: 'link',
  category: 'Navigation & Structure',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Lightweight',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'A2UI: link text. Use top-level label instead of children.',
      required: true,
    },
    { name: 'href', type: 'string', description: 'URL destination for the link. Top-level field in A2UI.' },
    {
      name: 'target',
      type: 'string',
      description: 'Browsing context: "_blank" to open in new tab, "_self" for same tab. Top-level field in A2UI.',
      enum: ['_blank', '_self', '_parent', '_top'] as const,
    },
    {
      name: 'rel',
      type: 'string',
      description:
        'Relationship attribute (e.g. "noopener noreferrer" for links opened in a new tab). Top-level field in A2UI.',
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Visual style variant of the link. Top-level field in A2UI.',
      enum: ['primary', 'secondary', 'inverted', 'inherit'] as const,
    },
    {
      name: 'size',
      type: 'string',
      description: 'Size variant of the link text. Top-level field in A2UI.',
      enum: ['sm', 'md', 'lg'] as const,
    },
    {
      name: 'underline',
      type: 'string',
      description: 'Underline style for the link. Top-level field in A2UI.',
      enum: ['default', 'highlight', 'none'] as const,
    },
    { name: 'disabled', type: 'boolean', description: 'Whether the link is disabled (prevents click interaction)' },
    {
      name: 'cursor',
      type: 'string',
      description: 'CSS cursor style override. Defaults to pointer for active links and default for disabled ones.',
      enum: [
        'default',
        'pointer',
        'text',
        'move',
        'wait',
        'crosshair',
        'not-allowed',
        'help',
        'zoom-in',
        'zoom-out',
        'grab',
        'grabbing',
      ] as const,
    },
    {
      name: 'color',
      type: 'string',
      description:
        'Text color override. Accepts any CSS color value or GridKit theme token path (e.g. "color.text.error", "text.default"). Token paths are resolved through the theme at render time. Figma-map canonical tokens: color.text.link.default (#53B7E8) for the default state (Figma var gds.color.text.link), color.text.link.hover (#278CBF) for hover (Figma var gds.color.text.link.hover — pass via styling["&:hover"].color). When set, overrides the variant\'s default color.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      description: 'Accessible label for icon-only links or when link text needs clarification',
    },
    { name: 'tabIndex', type: 'number', description: 'Keyboard navigation order for the link.' },
    {
      name: 'role',
      type: 'string',
      description: 'ARIA role override — e.g. "button" when a link triggers an action rather than navigating.',
    },
    {
      name: 'styling',
      type: 'object',
      description:
        'CSS style overrides for the link. All color values in styling — including inside nested pseudo-selectors like "&:hover" — accept both raw CSS colors and GridKit theme token paths (e.g. "color.text.error", "text.default"). Token paths are resolved through the theme at render time. Example: {"&:hover":{"color":"color.text.error","&::after":{"borderBottomColor":"color.text.error"}}}.',
    },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger on click' },
  ],
  examples: [
    '<Link href="/about" variant="primary">About Us</Link>',
    '<Link href="https://example.com" target="_blank" rel="noopener noreferrer">Outbound Site</Link>',
    '<Link href="/dashboard" variant="primary" underline="highlight">Go to Dashboard</Link>',
    '<Link href="/dashboard" variant="primary" underline="highlight" color="color.text.error" styling={{ "&:hover": { color: "color.text.error", "&::after": { borderBottomColor: "color.text.error" } } }}>Go to Dashboard</Link>',
  ],
};

const compositionTips: string[] = [
  'Use top-level label and href for link content and destination instead of children or attributes.href.',
  'Use target with rel for new-tab links so navigation stays secure and predictable.',
  'Use variant, size, and underline to communicate link hierarchy without custom renderers.',
  'Use actions[] only when the link should also trigger application behavior alongside its normal navigation intent.',
  'Use styling for hover polish or spacing, including matching text color and underline color when customizing hover states.',
  'Figma color resolution: gds.color.text.link → color.text.link.default (#53B7E8) maps to the color prop for the default link state; gds.color.text.link.hover → color.text.link.hover (#278CBF) maps to styling["&:hover"].color and styling["&:hover"]["&::after"].borderBottomColor to keep text and underline in sync.',
  'For icon links, gds.color.icon.link → color.icon.link.default (#53B7E8) resolves the same way via the color prop; gds.color.icon.link.hover → color.icon.link.hover (#278CBF) via styling["&:hover"].color.',
  'Theme token paths are resolved recursively in the styling object — use "color.text.error" or "text.error" directly as a color value anywhere in styling (including nested "&:hover" and "&::after" selectors); the render layer converts them to the correct hex at runtime.',
];

export default { component, compositionTips };
