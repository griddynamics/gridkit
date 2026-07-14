const component = {
  name: 'Separator',
  import: "import { Separator } from 'gd-design-library'",
  description:
    'Visual divider between sections. Horizontal by default; supports optional inline text label (e.g. "OR").',
  a2uiName: 'separator',
  category: 'Layout & Structure',
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
      name: 'orientation',
      type: 'string',
      description: 'Separator direction: horizontal (default) or vertical',
      enum: ['horizontal', 'vertical'] as const,
      default: 'horizontal',
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Line style of the separator',
      enum: ['solid', 'dashed', 'dotted'] as const,
      default: 'solid',
    },
    { name: 'label', type: 'string', description: 'Optional inline text displayed with the line (e.g. "OR")' },
    {
      name: 'labelPosition',
      type: 'string',
      description: 'Position of the label along the separator',
      enum: ['start', 'center', 'end'] as const,
      default: 'center',
    },
    {
      name: 'color',
      type: 'string',
      description:
        'Color of the separator line. Prefer theme color token paths (e.g. "border.default", "border.error"). Palette-style aliases like "brand.500" and "theme.palette.warning.main" are also accepted. Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'labelColor',
      type: 'string',
      description:
        'Color of the label text. Prefer theme color token paths (e.g. "text.caption", "text.warning"). Palette-style aliases like "brand.500" and "theme.palette.warning.main" are also accepted. Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'size',
      type: 'string',
      description: 'Thickness/size of the separator line',
      enum: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
    },
    {
      name: 'length',
      type: 'string',
      description:
        'Explicit separator length. Especially useful for vertical separators (for example "40px" or "100%").',
    },
    { name: 'as', type: 'string', description: 'HTML element to render as', enum: ['div', 'hr', 'span'] as const },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the separator' },
  ],
  examples: [
    '<Separator />',
    '<Separator variant="dashed" color="border.default" />',
    '<Separator orientation="vertical" length="40px" color="brand.500" />',
    '<Separator label="OR" labelPosition="center" />',
    '<Separator variant="dotted" size="sm" color="border.primary" />',
    '<Separator as="hr" styling={{margin: "20px 0"}} />',
  ],
};

const compositionTips: string[] = [
  'Use separator to divide related content blocks without introducing extra container structure.',
  'Keep the default horizontal orientation for stacked layouts and switch to vertical only when separating inline groups.',
  'Use label and labelPosition for contextual dividers such as "OR" between alternative actions.',
  'Use length for vertical separators and use color or labelColor with theme-aware values when emphasis matters.',
  'Use as="hr" only when the divider should also carry semantic section-break meaning.',
];

export default { component, compositionTips };
