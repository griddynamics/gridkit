const component = {
  name: 'SliderDots',
  import: "import { SliderDots } from 'gd-design-library'",
  description:
    'Dot-based pagination indicator for carousels, image galleries, and step-based flows. Highlights the active dot and supports click navigation.',
  a2uiName: 'slider-dots',
  category: 'Navigation & Structure',
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
    { name: 'count', type: 'number', description: 'Total number of dots to render', required: true },
    { name: 'activeIndex', type: 'number', description: 'Zero-based index of the currently active dot', default: 0 },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger when a dot is clicked.' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the dots container' },
  ],
  examples: [
    '<SliderDots count={5} activeIndex={currentSlide} onDotClick={goToSlide} />',
    '<SliderDots count={images.length} activeIndex={activeImage} />',
  ],
};

const compositionTips: string[] = [
  'Use slider-dots below carousels, galleries, or step-based views to show the current position.',
  'Keep count aligned with the actual number of slides or steps so navigation feedback stays accurate.',
  'Use actions[] when dot clicks should trigger navigation or analytics instead of raw callback props.',
  'Use activeIndex to highlight the current dot and styling for spacing or alignment around the control.',
  'Prefer slider-dots for lightweight pagination cues rather than verbose text when the sequence is already visually obvious.',
];

export default { component, compositionTips };
