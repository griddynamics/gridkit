const component = {
  name: 'DropdownItem',
  import: "import { DropdownItem } from 'gd-design-library'",
  description:
    'Selectable menu option used inside Dropdown or Menu content. Supports keyboard selection, disabled state, and Select context integration.',
  a2uiName: 'dropdown-item',
  category: 'Navigation & Structure',
  complexity: 'Low',
  props: [
    { name: 'label', type: 'string', description: 'Human-readable display text for the dropdown item', required: true },
    { name: 'value', type: 'string | number', description: 'Underlying option value returned on selection' },
    { name: 'disabled', type: 'boolean', description: 'Prevents selection and keyboard activation' },
    {
      name: 'actions',
      type: 'string[]',
      description: 'Action IDs from ui.actions to trigger when this dropdown item is selected',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the dropdown item' },
  ],
  examples: [
    '<DropdownItem name="Delete" value="delete" />',
    '<DropdownItem name="Export" value="export"><Icon name="contentCopy" /> Export</DropdownItem>',
  ],
};

const compositionTips = [
  'Use DropdownItem inside Dropdown or Menu content, not as a standalone action row.',
  'Prefer name for simple textual items and children for richer layouts with icons or badges.',
  'Mark destructive or unavailable actions with disabled instead of hiding them when discoverability matters.',
];

export default { component, compositionTips };
