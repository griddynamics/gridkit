const component = {
  name: 'Loader',
  import: "import { Loader } from 'gd-design-library'",
  description:
    'Loading indicator component that displays animated spinners or dots to communicate loading states, with flexible wrapper options and size variants. A2UI SPEC: use top-level "name" for animation type ("circle" or "dots"), plus top-level "size", optional "rounded" for dots, "variant", and "withWrapper".',
  a2uiName: 'loader',
  category: 'Feedback & Status',
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
      name: 'name',
      type: 'string',
      description: 'Animation type of the loader',
      enum: ['circle', 'dots'] as const,
      default: 'circle',
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Display variant controlling loader positioning and layout',
      enum: ['inline', 'block', 'flex', 'absolute', 'fixed', 'fullPage'] as const,
      default: 'inline',
    },
    {
      name: 'size',
      type: 'string',
      description: 'Size variant of the loader',
      enum: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
    },
    {
      name: 'rounded',
      type: 'string',
      description: 'Border radius for dots animation (only applies when name="dots")',
      enum: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'] as const,
    },
    {
      name: 'withWrapper',
      type: 'boolean',
      description: 'Whether to wrap loader in a container element',
      default: true,
    },
    {
      name: 'animationProps',
      type: 'string',
      description: 'Custom CSS animation shorthand for fine-grained loader motion control.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the loader' },
  ],
  examples: [
    '<Loader name="circle" size="md" />',
    '<Loader name="dots" variant="block" size="lg" />',
    '<Loader name="circle" size="sm" withWrapper={false} />',
    '<Loader name="dots" size="md" rounded="md" />',
    '<Loader name="dots" variant="flex" size="xl"><Typography>Loading content...</Typography></Loader>',
    '<Loader name="circle" variant="absolute" styles={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} />',
    '<Loader name="dots" size="lg" rounded="lg" className="custom-loader" WrapperView="div" />',
  ],
};

const compositionTips: string[] = [
  'Use name="circle" for standalone loading states and name="dots" for lighter inline feedback.',
  'Use variant and withWrapper to control how the loader is positioned in the layout.',
  'Use rounded only when name="dots" so dot shapes stay intentional.',
  'Use size to match the emphasis of the loading state, and animationProps only for deliberate motion overrides.',
  'Use styling for layout or color adjustments without changing the core loader contract.',
];

export default { component, compositionTips };
