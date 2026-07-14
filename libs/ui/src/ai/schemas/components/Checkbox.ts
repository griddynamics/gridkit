const component = {
  name: 'Checkbox',
  import: "import { Checkbox } from 'gd-design-library'",
  description:
    'Standalone checkbox atom with indeterminate state, size variants, and accessible labeling. Use for boolean toggles in forms and settings. In A2UI specs, represent checkboxes as { type: "input", variant: "checkbox" } — do NOT emit { type: "checkbox" }.',
  category: 'Forms & Input',
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
    { name: 'checked', type: 'boolean', description: 'Whether the checkbox is checked', default: false },
    {
      name: 'indeterminate',
      type: 'boolean',
      description: 'Whether the checkbox shows an indeterminate (mixed) state',
      default: false,
    },
    { name: 'disabled', type: 'boolean', description: 'Disables the checkbox interaction', default: false },
    { name: 'name', type: 'string', description: 'HTML name attribute for form submission' },
    { name: 'value', type: 'string', description: 'Value associated with the checkbox for form data' },
    { name: 'size', type: "'sm' | 'md'", description: 'Size variant of the checkbox', default: 'md' },
    { name: 'label', type: 'string', description: 'Visible label rendered next to the checkbox control.' },
    {
      name: 'actions',
      type: 'string[]',
      description: 'Action IDs from ui.actions to trigger when the checkbox changes.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the checkbox container' },
  ],
  examples: [
    '<Checkbox checked={agreed} onValueChange={setAgreed}>I agree to the terms</Checkbox>',
    '<Checkbox size="sm" disabled>Unavailable option</Checkbox>',
    '<Checkbox indeterminate={hasPartialSelection} onValueChange={handleSelectAll}>Select all</Checkbox>',
  ],
};

const compositionTips: string[] = [
  'In A2UI specs, ALWAYS use { type: "input", variant: "checkbox" } — NEVER { type: "checkbox" }.',
  'Use label for the visible checkbox text and checked for the boolean state.',
  'Use indeterminate for partial-selection states such as parent checkboxes.',
  'Wire changes through actions[] instead of raw onValueChange callbacks.',
  'Use size="sm" only in dense layouts such as tables or compact filter rows.',
];

export default { component, compositionTips };
