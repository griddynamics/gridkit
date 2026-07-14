const component = {
  name: 'Select',
  import: "import { Select } from 'gd-design-library'",
  description:
    'Dropdown selection component with customizable options and behavior. Supports both single and multiple selection modes.',
  a2uiName: 'select',
  category: 'Forms & Input',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~3KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'options',
      type: 'Array<{ label: string; value: unknown; disabled?: boolean; icon?: string }>',
      description: 'Dropdown options shown in the menu. Each option uses the shared A2UI option shape.',
      required: true,
    },
    {
      name: 'value',
      type: 'unknown | unknown[] | null',
      description: 'Currently selected option value. Use an array when multiple=true.',
    },
    { name: 'placeholder', type: 'string', description: 'Text to display when no value is selected' },
    { name: 'disabled', type: 'boolean', description: 'Whether the select is disabled' },
    { name: 'multiple', type: 'boolean', description: 'Whether to allow multiple selection' },
    { name: 'searchable', type: 'boolean', description: 'Whether to show a search input for filtering options' },
    {
      name: 'searchPlaceholder',
      type: 'string',
      description: 'Placeholder text for the internal search input when searchable is true',
    },
    {
      name: 'color',
      type: 'string',
      description: 'Color state for validation feedback',
      enum: ['primary', 'error', 'success', 'warning'] as const,
    },
    { name: 'autoOpen', type: 'boolean', description: 'Whether the dropdown opens automatically on render' },
    {
      name: 'activeIndex',
      type: 'string | number',
      description: 'Index or value of the item that should appear active/highlighted',
    },
    {
      name: 'icon',
      type: 'string',
      description: 'Leading icon name rendered before the current select value.',
    },
    {
      name: 'iconEnd',
      type: 'string',
      description: 'Trailing icon name rendered after the current select value.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the select' },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger on selection change' },
  ],
  examples: [
    '<Select items={[{name: "Option 1", value: "1"}]} value={selectedValue} onChange={handleChange} placeholder="Choose an option" />',
    '<Select multiple items={options} value={selectedValues} onChange={(data) => Array.isArray(data) && setSelectedValues(data)} placeholder="Select multiple" itemStringifier={(opt) => `${opt.name} (${opt.value})`} />',
    '<Select items={options} color="error" placeholder="Select with error state" />',
    '<Select items={options} color="success" placeholder="Select with success state" />',
  ],
};

const compositionTips: string[] = [
  'Use options[] with the shared { label, value, disabled?, icon? } shape instead of React-only items arrays.',
  'Use multiple when the UI should keep several selections active at once.',
  'Use searchable and searchPlaceholder for long option lists that benefit from filtering.',
  'Use icon and iconEnd for lightweight select adornments without custom React renderers.',
  'Wire selection changes through actions[] instead of raw onChange/onSelect callbacks.',
];

export default { component, compositionTips };
