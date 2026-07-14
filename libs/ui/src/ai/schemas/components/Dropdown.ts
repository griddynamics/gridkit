const component = {
  name: 'Dropdown',
  import: "import { Dropdown } from 'gd-design-library'",
  description:
    'Keyboard-navigable dropdown container used to group focusable option content, typically inside Menu or Select-style experiences.',
  a2uiName: 'dropdown',
  category: 'Navigation & Structure',
  complexity: 'Medium',
  props: [
    { name: 'width', type: 'string', description: 'CSS width for the dropdown container (e.g. "240px")' },
    { name: 'maxHeight', type: 'string', description: 'Maximum height for scrollable menus (e.g. "300px")' },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Dropdown-item elements or other focusable content',
      required: true,
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the dropdown surface' },
  ],
  examples: [
    '<Dropdown><DropdownItem name="Profile" value="profile" /></Dropdown>',
    '<Dropdown styles={{ minWidth: "240px" }}>{menuItems}</Dropdown>',
  ],
};

const compositionTips = [
  'Use Dropdown as the focus-managed container for menu-like option lists.',
  'Pair Dropdown with DropdownItem so arrow key navigation works consistently.',
  'Wrap Dropdown inside Menu or other popover primitives rather than mounting it inline without a trigger.',
];

export default { component, compositionTips };
