const component = {
  name: 'Box',
  import: "import { Box } from 'gd-design-library'",
  a2uiName: 'box',
  description:
    'Foundational layout primitive providing a flexible container with built-in flexbox support, focus management, and interaction states. Serves as the base for Card and other complex components.',
  category: 'Layout & Structure',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Lightweight',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1.5KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'variant',
      type: "'horizontal' | 'vertical'",
      description: 'Box orientation variant controlling flex direction',
      default: 'vertical',
      enum: ['horizontal', 'vertical'],
    },
    {
      name: 'isBordered',
      type: 'boolean',
      description: 'Adds border to the box from theme tokens',
      default: false,
    },
    {
      name: 'isHighlighted',
      type: 'boolean',
      description: 'Enables highlight effect on hover with outline appearance',
      default: false,
    },
    {
      name: 'withShadowHover',
      type: 'boolean',
      description: 'Adds box shadow on hover for elevation/lift effect',
      default: false,
    },
    {
      name: 'children',
      type: 'Component[]',
      description: 'Nested A2UI child components rendered inside the box.',
      required: true,
    },
    {
      name: 'tabIndex',
      type: 'number',
      description: 'Tab index for keyboard navigation when box is focusable',
      default: 0,
    },
    {
      name: 'styling',
      type: 'object',
      description:
        'CSS style overrides for layout concerns such as gap, padding, margin, width, height, overflow, and flex alignment.',
    },
  ],
  quickStart: {
    basic: '<Box variant="vertical" padding="20px">Content</Box>',
    horizontal: '<Box variant="horizontal" gap="10px"><div>Item 1</div><div>Item 2</div></Box>',
    bordered: '<Box variant="vertical" isBordered padding="20px">Bordered content</Box>',
    interactive: '<Box variant="vertical" withShadowHover padding="20px" styles={{ cursor: "pointer" }}>Hover me</Box>',
    centered: '<Box variant="vertical" justifyContent="center" alignItems="center" height="200px">Centered</Box>',
  },
  commonPatterns: {
    'Card Container': {
      code: '<Box variant="vertical" isBordered withShadowHover padding="20px" gap="10px"><Typography variant="h6">Title</Typography><Typography variant="small">Content</Typography></Box>',
      useCase: 'Card-like container with hover elevation effect',
    },
    'Horizontal Layout': {
      code: '<Box variant="horizontal" gap="10px" alignItems="center"><Icon name="info" /><Typography>Information</Typography></Box>',
      useCase: 'Horizontal arrangement of items with alignment',
    },
    'Vertical Stack': {
      code: '<Box variant="vertical" gap="10px"><Box isBordered padding="15px">Item 1</Box><Box isBordered padding="15px">Item 2</Box></Box>',
      useCase: 'Vertically stacked items with consistent spacing',
    },
    'Centered Content': {
      code: '<Box variant="vertical" justifyContent="center" alignItems="center" height="100vh">Centered content</Box>',
      useCase: 'Full viewport centered content layout',
    },
    'Dashboard Section': {
      code: '<Box variant="vertical" isBordered padding="20px" gap="15px"><Typography variant="h5">Section Title</Typography><Box variant="horizontal" gap="10px"><Box isBordered padding="10px" styles={{ flex: 1 }}>Metric 1</Box><Box isBordered padding="10px" styles={{ flex: 1 }}>Metric 2</Box></Box></Box>',
      useCase: 'Dashboard section with nested horizontal metrics',
    },
  },
  examples: [
    '<Box variant="vertical" padding="20px">Simple container</Box>',
    '<Box variant="horizontal" gap="10px"><Button>Action 1</Button><Button>Action 2</Button></Box>',
    '<Box variant="vertical" isBordered padding="20px" gap="10px"><Typography variant="h6">Card Title</Typography><Typography variant="small">Card content</Typography></Box>',
    '<Box variant="vertical" withShadowHover padding="20px" styles={{ cursor: "pointer", backgroundColor: "#fff" }}>Hover for shadow</Box>',
    '<Box variant="horizontal" justifyContent="space-between" alignItems="center" padding="15px"><Typography>Title</Typography><Button>Action</Button></Box>',
    '<Box variant="vertical" gap="20px" padding="30px" maxWidth="600px"><Box isBordered padding="20px">Section 1</Box><Box isBordered padding="20px">Section 2</Box></Box>',
  ],
  troubleshooting: {
    'Children not aligning correctly': 'Check variant prop and ensure flexDirection matches your layout needs',
    'Hover effects not working': 'Verify withShadowHover or isHighlighted is set and cursor style is pointer',
    'Border not showing': 'Ensure isBordered={true} and theme has border tokens defined',
    'Gap not working': 'Gap requires display flex (default) and works between direct children',
    'Focus ring not visible': 'Box has built-in focus-visible styles, ensure tabIndex is set for focusable boxes',
  },
  bestPractices: [
    'Use variant="vertical" (default) for stacking content, variant="horizontal" for side-by-side layouts',
    'Apply isBordered for visual boundaries and separation',
    'Use withShadowHover for interactive card-like elements that users can click',
    'Combine isHighlighted with isBordered for subtle outline hover effects',
    'Use gap property instead of margins between children for cleaner spacing',
    'Set tabIndex={0} when Box needs to be focusable for keyboard navigation',
    'Apply consistent padding values across similar Box components for visual harmony',
    'Use Box as a base for building domain-specific components like Cards',
    'Leverage flexbox props (justifyContent, alignItems, gap) for responsive layouts',
    'Combine Box with Typography for structured content sections',
    'Use nested Box components to create complex layouts without custom CSS',
    'Apply withShadowHover with backgroundColor for better shadow visibility',
    'Use Box instead of div for all layout needs to maintain design system consistency',
    'Set explicit width/maxWidth for controlling container sizes',
    'Combine Box variants to create dashboard-style layouts with metrics and sections',
  ],
};

const compositionTips: string[] = [
  'Use box as the default generic container when you need a lightweight layout wrapper in A2UI.',
  'Use children[] for nested components and styling for spacing, padding, and flex alignment.',
  'Set tabIndex only when the box should become keyboard-focusable.',
  'Pair withShadowHover with styling.cursor for interactive card-like surfaces.',
  'Prefer variant="vertical" for stacked layouts and variant="horizontal" for inline groups.',
];

export default { component, compositionTips };
