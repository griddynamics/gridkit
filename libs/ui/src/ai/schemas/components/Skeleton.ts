const component = {
  name: 'Skeleton',
  import: "import { Skeleton } from 'gd-design-library'",
  description:
    'Loading placeholder component that displays animated shapes to indicate content is being loaded, improving perceived performance by showing the structure of upcoming content.',
  a2uiName: 'skeleton',
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
      name: 'variant',
      type: 'string',
      description: 'Shape variant of the skeleton element',
      enum: ['rounded', 'circular', 'rectangular'] as const,
    },
    { name: 'width', type: 'string', description: 'Width of the skeleton element (e.g. "100%", "200px")' },
    { name: 'height', type: 'string', description: 'Height of the skeleton element (e.g. "40px", "1em")' },
    {
      name: 'backgroundColor',
      type: 'string',
      description:
        'Fill color of the skeleton element. Prefer theme color token paths or palette-style aliases (e.g. "bg.fill.success.primary.default", "brand.500", "theme.palette.success.main"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'animationName',
      type: 'string',
      description:
        'Animation keyframe name. Accepts theme animation token names such as "blinkKeyframes", raw CSS animation names, or null to disable the built-in animation.',
    },
    { name: 'animationProps', type: 'string', description: 'Custom animation CSS value for advanced customization' },
    {
      name: 'children',
      type: 'Component[]',
      description: 'Nested A2UI child placeholders for complex loading layouts.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the skeleton element' },
  ],
  examples: [
    '<Skeleton variant="rectangular" width="100%" height="200px" />',
    '<Skeleton variant="circular" width="40px" height="40px" backgroundColor="theme.palette.success.main" />',
    '<Skeleton variant="rounded" width="250px" height="20px" animationName="blinkKeyframes" />',
    '<Skeleton styles={{backgroundColor: "#f0f0f0", borderRadius: "8px"}}><Column gap="8px"><Skeleton height="20px" /><Skeleton height="20px" width="80%" /></Column></Skeleton>',
  ],
};

const compositionTips: string[] = [
  'Use skeleton when the final layout is known but real data is still loading.',
  'Match width, height, and variant to the final content shape to reduce layout shift.',
  'Use backgroundColor, animationName, and animationProps at the top level for placeholder styling and motion.',
  'Use children[] only when you need a nested placeholder structure instead of a single simple shape.',
  'Prefer lightweight placeholder shapes over detailed mock content so the loading state stays calm and readable.',
];

export default { component, compositionTips };
