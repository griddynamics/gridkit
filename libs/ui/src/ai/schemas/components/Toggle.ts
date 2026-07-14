const component = {
  name: 'Toggle',
  import: "import { Toggle } from 'gd-design-library'",
  description:
    'Multi-option toggle component for selecting between multiple values with customizable rendering and keyboard support. Ideal for view switchers, filters, and mode selectors.',
  a2uiName: 'toggle',
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
    {
      name: 'options',
      type: 'Array<{ label: string; value: unknown; disabled?: boolean; icon?: string }>',
      description: 'Toggle options using the shared A2UI option shape.',
      required: true,
    },
    { name: 'value', type: 'unknown', description: 'Currently selected value (controlled)' },
    { name: 'disabled', type: 'boolean', description: 'Whether the toggle is disabled' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the toggle' },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger on value change' },
  ],
  examples: [
    '<Toggle items={["List", "Grid", "Gallery"]} value={viewMode} onValueChange={setViewMode} />',
    '<Toggle items={[{label: "Day", value: "day"}, {label: "Week", value: "week"}, {label: "Month", value: "month"}]} value={period} onValueChange={setPeriod} />',
    '<Toggle items={options} renderItemContent={(item) => <FlexContainer gap="4px"><Icon name={item.icon} />{item.label}</FlexContainer>} value={selected} onValueChange={handleChange} />',
    '<Toggle items={["Light", "Dark", "Auto"]} value={theme} onValueChange={setTheme} disabled={isLoading} />',
  ],
};

const compositionTips: string[] = [
  'Use toggle for a small set of mutually exclusive options that should stay visible at all times.',
  'Use options[] with labels and values; include option icons only when they improve scanning.',
  'Use value for the active option and actions[] for change handling.',
  'Prefer toggle over select when all choices comfortably fit in the available width.',
  'Keep the option count small so each toggle stays tappable and legible.',
];

export default { component, compositionTips };
