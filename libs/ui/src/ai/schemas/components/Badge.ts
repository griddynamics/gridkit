const component = {
  name: 'Badge',
  import: "import { Badge } from 'gd-design-library'",
  description:
    'Badge component for displaying small pieces of information, status indicators, counts, or labels. Supports multiple variants and visual options with icon support. A2UI SPEC: use top-level "label" for badge text, top-level "iconStart" for the leading badge icon, and top-level "iconEnd" for the trailing badge icon. Legacy top-level "icon" is still accepted as a fallback alias for "iconStart". The renderer maps those icon names to the underlying Badge `iconStart?: ReactNode` and `iconEnd?: ReactNode` props internally, so do not pass raw React nodes in the A2UI payload.',
  a2uiName: 'badge',
  category: 'Display & Content',
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
    { name: 'label', type: 'string', description: 'Badge text or count to display (maps to children)', required: true },
    {
      name: 'variant',
      type: 'string',
      description: 'Visual style variant of the badge',
      enum: ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'] as const,
    },
    {
      name: 'size',
      type: 'string',
      description: 'Size of the badge',
      enum: ['xs', 'sm', 'md', 'lg'] as const,
    },
    {
      name: 'appearance',
      type: 'string',
      description: 'Visual fill style of the badge',
      enum: ['filled', 'filledLight', 'outline', 'outlineFilledLight'] as const,
    },
    { name: 'disabled', type: 'boolean', description: 'Whether the badge is disabled' },
    {
      name: 'iconStart',
      type: 'string',
      description:
        'Leading icon name from the shared A2UI icon catalog. The renderer converts this to the underlying Badge `iconStart?: ReactNode` prop. Preferred over the legacy `icon` alias.',
    },
    {
      name: 'iconEnd',
      type: 'string',
      description:
        'Trailing icon name from the shared A2UI icon catalog. The renderer converts this to the underlying Badge `iconEnd?: ReactNode` prop.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the badge' },
  ],
  examples: [
    '<Badge>New</Badge>',
    '<Badge variant="primary" appearance="filled">Primary Badge</Badge>',
    '<Badge variant="secondary" appearance="outline">Secondary Outline</Badge>',
    '<Badge variant="tertiary" appearance="filled">Tertiary Badge</Badge>',
    '<Badge variant="quaternary" appearance="filled">Quaternary Badge</Badge>',
    '<Badge variant="quinary" appearance="filled">Quinary Badge</Badge>',
    '<Badge variant="primary" appearance="filled" size="xs">Extra Small Badge</Badge>',
    '<Badge variant="primary" appearance="filled" size="sm">Small Badge</Badge>',
    '<Badge variant="primary" appearance="filled" size="md">Medium Badge</Badge>',
    '<Badge variant="primary" appearance="filled" iconStart={<Icon name="check" size="xs" />}>With Icon</Badge>',
    '<Badge variant="primary" appearance="filled" disabled>Disabled Badge</Badge>',
    '<Badge variant="primary" appearance="filled" margin="8px" padding="4px 8px">Custom Spacing</Badge>',
  ],
};

const compositionTips: string[] = [
  'Use badges for short metadata such as status, count, tag, or category labels.',
  'Use appearance for fill treatment and variant for semantic color family.',
  'Use top-level `iconStart` / `iconEnd` string names from the shared icon catalog in A2UI specs. Legacy `icon` is still accepted as a fallback alias for `iconStart`.',
  'Prefer styling for spacing or one-off size adjustments instead of React-only layout props.',
  'Keep badge text short so the component remains scannable in dense UIs.',
];

export default { component, compositionTips };
