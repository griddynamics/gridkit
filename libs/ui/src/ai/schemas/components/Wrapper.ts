const component = {
  name: 'Wrapper',
  import: "import { Wrapper } from 'gd-design-library'",
  a2uiName: 'wrapper',
  description:
    'Flexible container component that provides semantic HTML element wrapping with customizable layout variants and styling. Useful for creating layout contexts, semantic sections, and responsive containers.',
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
      name: 'as',
      type: 'string',
      description: 'Overrides the default wrapper HTML element used for rendering (e.g., "div", "section", "article")',
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Determines the wrapper preset used for semantic layout contexts',
      default: 'inline',
      enum: ['inline', 'section', 'fullPage'] as const,
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Nested A2UI child components rendered inside the wrapper.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS class names to be applied to the wrapper element',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the wrapper' },
  ],
  examples: [
    '<Wrapper variant="section" as="section">Main content section</Wrapper>',
    '<Wrapper variant="inline" styling={{display: "flex", gap: "16px"}}>{children}</Wrapper>',
    '<Wrapper variant="fullPage" position="fixed">{overlayContent}</Wrapper>',
    '<Wrapper as="article" className="content-wrapper">{articleContent}</Wrapper>',
  ],
};

const compositionTips: string[] = [
  'Use wrapper for semantic container tags such as section, article, nav, or aside.',
  'Use children[] for nested A2UI components and styling for spacing or layout overrides.',
  'Use className only when the host application intentionally relies on an external CSS hook.',
  'Prefer as for semantic HTML and variant for broad layout intent.',
  'Wrapper variants are limited to inline, section, and fullPage in GridKit.',
  'Use wrapper instead of raw container markup when semantic structure matters but no stronger layout primitive is needed.',
];

export default { component, compositionTips };
