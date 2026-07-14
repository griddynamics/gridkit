const component = {
  name: 'FlexContainer',
  import: "import { FlexContainer } from 'gd-design-library'",
  description:
    'General-purpose flexbox container with direct support for gap, flexDirection, alignItems, justifyContent, and additional box-style layout overrides.',
  a2uiName: 'flex-container',
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
    { name: 'gap', type: 'string', description: 'CSS gap between flex items (e.g. "8px", "1rem")' },
    {
      name: 'flexDirection',
      type: 'string',
      description: 'Direction of the flex container layout',
      enum: ['row', 'column', 'row-reverse', 'column-reverse'] as const,
      default: 'row',
    },
    { name: 'alignItems', type: 'string', description: 'CSS align-items value (e.g. "center", "flex-start")' },
    {
      name: 'justifyContent',
      type: 'string',
      description: 'CSS justify-content value (e.g. "space-between", "center")',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Nested A2UI child components rendered inside the flex container',
      required: true,
    },
    {
      name: 'styling',
      type: 'object',
      description: 'CSS style overrides for sizing, spacing, overflow, and other flex-related presentation details',
    },
  ],
  examples: ['<FlexContainer gap="12px" flexDirection="column" alignItems="center">...</FlexContainer>'],
};

const compositionTips: string[] = [
  'Use FlexContainer with flexDirection="row" for horizontal layouts and "column" for vertical stacks.',
  'Apply gap prop in FlexContainer to maintain consistent spacing between child elements.',
  'Combine FlexContainer alignItems and justifyContent for precise content alignment.',
  'Set FlexContainer overflow="auto" for scrollable areas with fixed dimensions.',
  'Use FlexContainer position="relative" as a positioning context for absolute children.',
  'Apply padding to FlexContainer for internal spacing, margin for external spacing.',
  'Leverage FlexContainer minWidth/maxWidth for responsive layouts that adapt to screen size.',
  'Use FlexContainer with width="100%" and maxWidth for full-width responsive containers.',
  'Nest FlexContainers with different flexDirection values for complex grid-like layouts.',
  'Apply FlexContainer className for reusable styling patterns across the application.',
  'Use Column for vertical layouts instead of FlexContainer with flexDirection="column" for cleaner code.',
];

export default { component, compositionTips };
