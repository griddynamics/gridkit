const component = {
  name: 'Slider',
  import: "import { Slider } from 'gd-design-library'",
  description:
    'Range input component for selecting numeric values within a defined range with visual feedback and accessibility support.',
  a2uiName: 'slider',
  category: 'Forms & Input',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~2KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    { name: 'value', type: 'number', description: 'Current value of the slider (controlled)' },
    { name: 'min', type: 'number', description: 'Minimum value of the slider' },
    { name: 'max', type: 'number', description: 'Maximum value of the slider' },
    { name: 'step', type: 'number', description: 'Step increment for the slider' },
    { name: 'disabled', type: 'boolean', description: 'Whether the slider is disabled' },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger on value change.' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the slider' },
  ],
  examples: [
    '<Slider min={0} max={100} value={50} onChange={handleChange} />',
    '<Slider min={1} max={10} value={5} disabled={isLoading} />',
    '<Slider min={0} max={255} value={brightness} onChange={setBrightness} styles={{width: "300px"}} />',
    '<Slider min={18} max={65} value={age} onChange={handleAgeChange} />',
  ],
};

const compositionTips: string[] = [
  'Use slider for bounded numeric ranges where drag interaction is easier than typing.',
  'Set min, max, step, and value at the top level so the allowed range is explicit in the JSON.',
  'Use actions[] for value changes instead of raw onChange callbacks.',
  'Use styling for width or spacing around the slider without hiding the numeric range configuration.',
  'Pair slider with nearby text only when the user needs to see the exact numeric value while adjusting it.',
];

export default { component, compositionTips };
