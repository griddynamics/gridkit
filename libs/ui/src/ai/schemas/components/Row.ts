const component = {
  name: 'Row',
  import: "import { Row } from 'gd-design-library'",
  description:
    'Horizontal flex layout container. Arranges children side by side with configurable spacing, alignment, wrapping, reversal, and flex sizing.',
  a2uiName: 'row',
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
      description: 'Cross-axis alignment for children in the row',
      enum: ['start', 'center', 'end', 'stretch'] as const,
    },
    {
      name: 'justify',
      type: 'string',
      description: 'Main-axis distribution for the horizontal flow',
      enum: ['start', 'center', 'end', 'space-between', 'space-around'] as const,
    },
    {
      name: 'isWrap',
      type: 'boolean',
      description: 'Whether children may wrap onto additional lines when space is constrained',
      default: true,
    },
    {
      name: 'isReversed',
      type: 'boolean',
      description: 'Reverses the visual direction so children flow right-to-left instead of left-to-right',
      default: false,
    },
    {
      name: 'flex',
      type: 'string',
      description: 'CSS flex shorthand applied to the row when it is placed inside a flex parent',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Nested A2UI child components rendered inside the row',
      required: true,
    },
    {
      name: 'as',
      type: 'string',
      description: 'Underlying HTML element to render, such as "section", "nav", "main", "article", or "header"',
    },
    {
      name: 'styling',
      type: 'object',
      description: 'CSS style overrides for sizing, spacing, overflow, and other presentational adjustments',
    },
  ],
  examples: [
    '<Row justify="space-between" align="center" isWrap gutter={16}>...</Row>',
    '<Row width="100%" padding="16px" position="relative">...</Row>',
    '<Row as="nav" justify="space-between" align="center">...</Row>',
    '<Row isReversed flex="1 1 auto">...</Row>',
  ],
};

const compositionTips: string[] = [
  'Use Row for horizontal layouts where items should be placed side by side.',
  'Use isWrap={false} to prevent wrapping (isWrap defaults to true, NOT wrap property).',
  'Set Row width="100%" to create full-width horizontal containers that span the parent.',
  'Apply Row padding for consistent internal spacing without affecting child alignment.',
  'Use Row with overflow="auto" and maxWidth for horizontally scrollable content areas.',
  'Combine Row position="relative" as a positioning context for absolutely positioned children.',
  'Set Row minHeight to ensure consistent height even with varying content.',
  'Use nested Row components within Column for complex grid-like layouts.',
  'Apply Row margin for external spacing between row containers and other elements.',
  'Use Row maxHeight with overflow="scroll" for fixed-height scrollable horizontal lists.',
  'Combine Row with FlexContainer children for precise control over item distribution.',
  'Set Row height to create uniform height containers across different content sections.',
  'Use Row position="sticky" for horizontal navigation bars that stick during scroll.',
  'Apply Row minWidth to prevent content from collapsing below a certain width.',
  'Combine multiple Row components with consistent padding for aligned multi-row layouts.',
  'Use Row styling prop for one-off custom styling without creating new CSS classes.',
  'Use Row as="nav" or as="header" for semantic HTML and better accessibility.',
  'Use Row as prop to render as any HTML element or React component while maintaining Row styling.',
];

export default { component, compositionTips };
