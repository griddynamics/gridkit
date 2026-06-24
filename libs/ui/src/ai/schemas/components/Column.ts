const component = {
  name: 'Column',
  import: "import { Column } from 'gd-design-library'",
  description:
    'Vertical flex layout container. Arranges children top to bottom with configurable spacing, alignment, wrapping, reversal, and flex sizing.',
  a2uiName: 'column',
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
      name: 'gutter',
      type: 'string | number',
      description:
        'Gap between direct children. Accepts a number (pixels) or a real CSS value such as "16px" or "1rem".',
      default: 0,
    },
    {
      name: 'align',
      type: 'string',
      description: 'Cross-axis alignment for children in the column',
      enum: ['start', 'center', 'end', 'stretch'] as const,
    },
    {
      name: 'justify',
      type: 'string',
      description: 'Main-axis distribution for the vertical flow',
      enum: ['start', 'center', 'end', 'space-between', 'space-around'] as const,
    },
    {
      name: 'isWrap',
      type: 'boolean',
      description: 'Whether children may wrap onto additional columns when space is constrained',
      default: true,
    },
    {
      name: 'isReversed',
      type: 'boolean',
      description: 'Reverses the visual direction so children flow bottom-to-top instead of top-to-bottom',
      default: false,
    },
    {
      name: 'flex',
      type: 'string',
      description: 'CSS flex shorthand applied to the column when it is placed inside a flex parent',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Nested A2UI child components rendered inside the column',
      required: true,
    },
    {
      name: 'as',
      type: 'string',
      description: 'Underlying HTML element to render, such as "section", "main", "article", "aside", or "header"',
    },
    {
      name: 'styling',
      type: 'object',
      description: 'CSS style overrides for sizing, spacing, overflow, and other presentational adjustments',
    },
  ],
  examples: [
    '<Column gutter={16} align="center" justify="start">...</Column>',
    '<Column as="main" gutter="1rem">...</Column>',
    '<Column isReversed flex="1 1 auto">...</Column>',
  ],
};

const compositionTips: string[] = [
  'Set Column gutter for consistent vertical spacing between direct children (default 0).',
  'Use Column align="center" to center content vertically within each row of the column.',
  'Apply Column justify="space-between" to distribute items evenly with space between them.',
  'Set Column isReversed={true} to reverse the visual order of items without changing DOM structure.',
  'Use Column with fixed height and justify="center" to vertically center content in a container.',
  'Set Column isWrap={false} to prevent wrapping (isWrap defaults to true, NOT wrap property).',
  'Apply Column flex="1 1 auto" to make it fill available space in a flex parent container.',
  'Use nested Columns with different gutter values for hierarchical content organization.',
  'Set Column minWidth to prevent content from becoming too narrow on small screens.',
  'Use Column align="stretch" (default) to make children fill the available cross-axis space.',
  'Apply Column padding for internal spacing without affecting the gutter between items.',
  'Combine Column with Card component for well-organized form layouts with proper spacing.',
  'Use Column justify="end" to push content to the bottom of a fixed-height container.',
  'Set Column width="100%" with maxWidth for responsive full-width layouts with constraints.',
  'Use Column as="main" or as="section" for semantic HTML and better accessibility.',
  'Use Column as prop to render as any HTML element or React component while maintaining Column styling.',
];

export default { component, compositionTips };
