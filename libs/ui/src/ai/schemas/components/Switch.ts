const component = {
  name: 'Switch',
  import: "import { Switch } from 'gd-design-library'",
  description: 'Toggle switch for binary on/off states. Ideal for settings, preferences, and feature toggles.',
  a2uiName: 'switch',
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
    { name: 'checked', type: 'boolean', description: 'Checked/on state of the switch (controlled)' },
    { name: 'disabled', type: 'boolean', description: 'Whether the switch is disabled' },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows a loading overlay on the switch and disables interaction during async operations',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Text label content displayed next to the switch toggle (rendered as children).',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'LabelPosition — which side of the toggle the text appears on. Valid values: "left" | "right" (default "right"). NEVER use this for text content; put text in value.',
      enum: ['left', 'right'] as const,
      default: 'right',
    },
    { name: 'name', type: 'string', description: 'HTML name attribute for form submission' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the switch' },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger on toggle' },
  ],
  examples: [
    '{ "type": "switch", "id": "notifications_switch", "value": "Enable notifications" }',
    '{ "type": "switch", "id": "dark_mode_switch", "value": "Dark mode", "label": "left", "checked": false }',
    '{ "type": "switch", "id": "autosave_switch", "value": "Auto-save", "disabled": true }',
    '{ "type": "switch", "id": "loading_switch", "value": "Feature toggle", "isLoading": true }',
  ],
};

const compositionTips: string[] = [
  'Use value for the visible switch text (maps to children) and label for left/right placement (LabelPosition).',
  'NEVER put a position string ("left", "right") in value — that is the text shown next to the toggle.',
  'NEVER put label text in label — label is LabelPosition, not text content.',
  'Use checked for the boolean state and isLoading when a toggle waits on async work.',
  'Wire changes through actions[] instead of raw onValueChange callbacks.',
  'Keep switch text explicit so users can tell what enabling the toggle will do.',
];

export default { component, compositionTips };
