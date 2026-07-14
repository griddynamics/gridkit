const component = {
  name: 'Image',
  import: "import { Image } from 'gd-design-library'",
  description:
    'Responsive image component with loading states, fallback support, and optional caption for displaying visual content.',
  a2uiName: 'image',
  category: 'Content & Media',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    { name: 'src', type: 'string', description: 'URL of the image to display', required: true },
    { name: 'alt', type: 'string', description: 'Alternative text for accessibility' },
    { name: 'width', type: 'number', description: 'Width of the image in pixels' },
    { name: 'height', type: 'number', description: 'Height of the image in pixels' },
    { name: 'caption', type: 'string', description: 'Caption text displayed below the image' },
    {
      name: 'objectFit',
      type: 'string',
      description: 'CSS object-fit value for how the image fills its box',
      enum: ['cover', 'contain', 'fill', 'none', 'scale-down'] as const,
    },
    {
      name: 'as',
      type: 'string',
      description: 'HTML element to wrap the image in (e.g. "figure" for semantic markup with caption)',
    },
    { name: 'captionAs', type: 'string', description: 'HTML element to use for the caption (default: "figcaption")' },
    {
      name: 'actions',
      type: 'string[]',
      description: 'Action IDs from ui.actions to trigger when the image is clicked.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the image container' },
  ],
  examples: [
    '<Image src="/photo.jpg" alt="Product photo" width={400} height={300} />',
    '<Image src={imageUrl} alt="User avatar" caption="Profile picture" onClick={handleImageClick} />',
    '<Image src="/hero.jpg" alt="Hero image" placeholder="Loading..." fallbackComponent={<Icon name="image" />} />',
    '<Image src="/photo.jpg" alt="Product photo" as="figure" caption="Semantic image with figure wrapper" />',
    '<Image src="/photo.jpg" alt="Product photo" caption="Custom caption" captionAs="p" />',
  ],
};

const compositionTips: string[] = [
  'Use image for direct asset URLs only, never for page URLs or search-result links.',
  'Use caption with as="figure" or captionAs when the image needs semantic supporting text.',
  'Use objectFit together with explicit width/height or styling for predictable cropping.',
  'Wire image interactions through actions[] instead of raw onClick handlers.',
  'Always provide alt text unless the image is purely decorative.',
];

export default { component, compositionTips };
