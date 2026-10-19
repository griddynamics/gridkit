import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import type { GdSelect, GdSelectOption } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { flexContainer, row, storyParameters, text } from './form-story-helpers';
import {
  defaultActions,
  multipleSelectActions,
  withAdornmentsAndResetOptionStoryActions,
  withCustomInitiatorAndSelectedOutputValueActions,
  usingRefComponentWithCustomPlaceholderActions,
  withFileInputAndCustomDropdownActions,
  customItemIdentifierComponentActions,
  disabledActions,
  emptyItemsActions,
} from './Select.stories.play';

type Option = GdSelectOption;
type Props = Record<string, unknown>;

type Args = Partial<
  Pick<
    GdSelect,
    | 'items'
    | 'value'
    | 'multiple'
    | 'placeholder'
    | 'itemStringifier'
    | 'itemIdentifier'
    | 'renderOption'
    | 'width'
    | 'minWidth'
    | 'maxWidth'
    | 'dropdownMaxHeight'
    | 'disabled'
    | 'autoOpen'
    | 'activeIndex'
    | 'itemsCount'
    | 'styles'
    | 'color'
    | 'searchable'
    | 'searchPlaceholder'
  >
> & {
  onSelect?: (detail: { data?: Option; index?: number }) => void;
  onChange?: (value: Option | Option[] | null) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onInitiatorClick?: (event: Event) => void;
  // Documented only: these are provided as slots or through the element reference.
  adornmentStart?: Node;
  adornmentEnd?: Node;
  initiator?: Node;
  children?: Node;
  emptyItemsResult?: Node;
  ref?: GdSelect;
};

const eventProps = ['onSelect', 'onChange', 'onKeyDown', 'onInitiatorClick'] as const;

/** Create a select from story args. Callback args become listeners of the element's events. */
const selectNode = (args: Args & Props = {}) => {
  const { onSelect, onChange, onKeyDown, onInitiatorClick, ...props } = args;
  for (const name of eventProps) delete (props as Props)[name];
  const node = element('gd-select', props as Partial<GdSelect>);
  // Only handle the select's own events: slotted content (input, file input) emits `gd-change` too.
  node.addEventListener('gd-select', (event) => {
    if (event.target === node) onSelect?.((event as CustomEvent).detail);
  });
  node.addEventListener('gd-change', (event) => {
    if (event.target === node) onChange?.((event as CustomEvent<{ value: Option | Option[] | null }>).detail.value);
  });
  if (onKeyDown) node.addEventListener('keydown', onKeyDown);
  if (onInitiatorClick) node.addEventListener('gd-initiator-click', onInitiatorClick);
  return node;
};

const slotted = <T extends HTMLElement>(node: T, slot: string) => {
  node.slot = slot;
  return node;
};

/** Dropdown content only exists while the dropdown is open, so slotted dropdown content follows the open state. */
const whileOpen = (control: GdSelect, ...nodes: Array<Node & ChildNode>) => {
  control.addEventListener('gd-open', () => control.append(...nodes));
  control.addEventListener('gd-close', () => nodes.forEach((node) => node.remove()));
};

const selectItemsList: Option[] = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: { test: 'option2' } },
  { name: 'Option 3', value: 'option3' },
];

const meta = {
  title: 'Atoms/Select',
  component: 'gd-select',

  argTypes: {
    // Core Props
    items: {
      description: 'Array of items to be displayed in the select dropdown',
      table: {
        category: 'Core',
        type: {
          summary: '(never | Option)[]',
          detail: 'Option { name: string;  value: unknown; }',
        },
        defaultValue: { summary: '[]' },
      },
    },
    value: {
      description: 'Currently selected value (Option for single select, Option[] for multiple select)',
      table: {
        category: 'Core',
        type: { summary: 'Option | Option[] | null' },
        defaultValue: { summary: 'undefined' },
      },
    },
    multiple: {
      description: 'Enable multiple selection mode',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: 'boolean',
    },
    placeholder: {
      description: 'Text to display when no value is selected',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: 'Select' },
      },
    },

    // Event Handlers
    onSelect: {
      description: 'Event (gd-select) fired when an item is selected',
      action: 'selected',
      table: {
        category: 'Events',
        type: {
          summary: 'SelectOnSelect = (props: OnSelectProps) => void',
          detail: 'OnSelectProps {\n  data?: Option;\n  index?: number;\n}',
        },
      },
    },
    onChange: {
      description:
        'Event (gd-change) fired when value changes (receives Option for single select, Option[] for multiple select)',
      table: {
        category: 'Events',
        type: { summary: '(data: Option | Option[]) => void', detail: 'Option { name: string;  value: unknown; }' },
      },
    },
    onKeyDown: {
      description: 'Native keydown event fired on keyboard events',
      table: {
        category: 'Events',
        type: { summary: '(event: KeyboardEvent) => void' },
      },
    },
    onInitiatorClick: {
      description: 'Event (gd-initiator-click) fired when initiator is clicked',
      table: {
        category: 'Events',
        type: { summary: '(event: CustomEvent) => void' },
      },
    },

    // Customization
    renderOption: {
      description: 'Custom renderer for option items',
      table: {
        category: 'Customization',
        type: {
          summary: '(value: renderOptionType) => Node | string',
          detail:
            'renderOptionType = {\n  item: Option;\n  index: number;\n  isActiveItem: boolean;\n  className: string;\n};',
        },
      },
    },
    itemStringifier: {
      description: 'Function to convert item value to display string',
      table: {
        category: 'Customization',
        type: { summary: '(data: Option) => string', detail: 'Option { name: string;  value: unknown; }' },
      },
    },
    itemIdentifier: {
      description: 'Function to compare items for equality',
      table: {
        category: 'Customization',
        type: {
          summary: 'ItemIdentifier',
          detail: 'ItemIdentifier = (selected: Option, current: Option) => boolean',
        },
      },
    },

    // Layout & Appearance
    width: {
      description: 'Width of the select component',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    minWidth: {
      description: 'Minimum width of the select component',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    maxWidth: {
      description: 'Maximum width of the select component',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'initial' },
      },
    },
    dropdownMaxHeight: {
      description: 'Maximum height of the dropdown list',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: '240px' },
      },
    },
    adornmentStart: {
      description: 'Element to be rendered at the start of the select (adornment-start slot)',
      table: {
        category: 'Layout',
        type: { summary: 'Node' },
      },
    },
    adornmentEnd: {
      description: 'Element to be rendered at the end of the select (adornment-end slot)',
      table: {
        category: 'Layout',
        type: { summary: 'Node' },
      },
    },

    // State & Behavior
    disabled: {
      description: 'Whether the select is disabled',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    autoOpen: {
      description: 'Whether to automatically open the dropdown',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
      },
    },
    activeIndex: {
      description: 'Currently active item index',
      table: {
        category: 'State',
        type: { summary: 'string | number' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Advanced Props
    ref: {
      description:
        'Element reference that provides access to container methods: `isOpen`, `open()`, `close()`, `toggle() and selectOption()`.',
      table: {
        category: 'Advanced',
        type: {
          summary: 'GdSelect',
          detail:
            '{ isOpen: boolean; open: () => void; close: () => void; toggle: () => void;  selectOption: (data: Option, index?: number) => void}',
        },
      },
    },
    initiator: {
      description: 'Custom initiator element to trigger the dropdown (initiator slot)',
      table: {
        category: 'Advanced',
        type: { summary: 'Node' },
      },
    },
    children: {
      description: 'Child elements of the select component (default slot)',
      table: {
        category: 'Advanced',
        type: { summary: 'Node' },
      },
    },
    emptyItemsResult: {
      description: 'Text or Component to display when no items are available (empty slot)',
      table: {
        category: 'Advanced',
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
      },
    },
    itemsCount: {
      description: 'Number of items in the select',
      table: {
        category: 'Advanced',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      description: 'Custom styles object for the select',
      control: 'object',
      table: {
        category: 'Appearance & Styling',
        type: { summary: 'BoxCssComponentProps<HTMLDivElement>' },
      },
    },
    color: {
      description: 'Color variant of the select',
      control: 'select',
      options: ['primary', 'success', 'warning', 'error'],
      table: {
        category: 'Appearance & Styling',
        type: { summary: 'InputColorVariant' },
        defaultValue: { summary: "'primary'" },
      },
    },
  },

  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Select\` component is a versatile dropdown selector that provides various interaction patterns and customization options. It supports both simple selection scenarios and complex use cases with custom rendering and advanced state management.

  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Selection Modes</b>
  <ul>
  <li>Single select with controlled/uncontrolled value</li>
  <li>Multiple select with \`multiple\` prop - supports selecting multiple items with array values</li>
  <li>Custom item rendering and formatting</li>
  <li>Disabled state and items</li>
  </ul>
  </li>
  <li>
  <b>Advanced Customization</b>
  <ul>
  <li>Custom initiator elements (input, button etc)</li>
  <li>Flexible dropdown content with custom components</li>
  <li>Start/end adornments support</li>
  <li>Custom item comparison logic</li>
  <li>Custom value formatting</li>
  </ul>
  </li>
  <li>
  <b>State Management</b>
  <ul>
  <li>Controlled mode with value/gd-change</li>
  <li>Uncontrolled mode with default value</li>
  <li>Open/closed state control</li>
  <li>Active item tracking</li>
  </ul>
  </li>
  <li>
  <b>Element API Methods</b>
  <ul>
  <li><code>isOpen</code> - Check dropdown state</li>
  <li><code>open()</code> - Open dropdown</li>
  <li><code>close()</code> - Close dropdown</li>
  <li><code>toggle()</code> - Toggle dropdown state</li>
  <li><code>selectOption()</code> - Programmatically select item</li>
  </ul>
  </li>
  <li>
  <b>Accessibility</b>
  <ul>
  <li>ARIA attributes for roles and states</li>
  <li>Keyboard navigation (arrows, enter, escape)</li>
  <li>Focus management</li>
  <li>Screen reader support</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
  render: (args: Args) => selectNode(args),
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

const wrap = (...children: Node[]) => flexContainer({ gap: '10px', minWidth: '306px' }, ...children);
const wrapColumn = (...children: Node[]) =>
  flexContainer({ gap: '10px', minWidth: '306px', flexDirection: 'column' }, ...children);

export const Default: Story = {
  render: (args) => wrap(selectNode({ items: selectItemsList, maxWidth: '400px', ...args })),
  play: defaultActions,
  parameters: storyParameters(
    undefined,
    `<gd-select placeholder="Choose an option"></gd-select>

<script type="module">
  const select = document.querySelector('gd-select');
  select.items = [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' },
    { name: 'Option 3', value: 'option3' },
  ];
  select.addEventListener('gd-change', (event) => {
    console.log('Selected:', event.detail.value);
  });
</script>`
  ),
};

export const MultipleSelect: Story = {
  render: (args) => {
    const customItemStringifier = (option: Option): string =>
      `${option.name} (${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value})`;

    // The native title stands in for the tooltip: it shows the full list once 2+ items are selected.
    const tooltip = document.createElement('div');
    const control = selectNode({
      ...args,
      multiple: true,
      items: selectItemsList,
      value: [],
      placeholder: 'Select multiple options',
      itemStringifier: customItemStringifier,
      onChange: (data) => {
        args.onChange?.(data);
        if (Array.isArray(data)) {
          const displayText = data.map((s) => customItemStringifier(s)).join(', ');
          if (data.length > 1) tooltip.title = displayText;
          else tooltip.removeAttribute('title');
        }
      },
    });
    tooltip.append(control);
    return flexContainer({ gap: '10px', width: '306px', flexDirection: 'column' }, tooltip);
  },
  play: multipleSelectActions,
  parameters: storyParameters(
    `
This story demonstrates the multiple select functionality with custom item stringifier and Tooltip. When \`multiple\` prop is enabled:
- Users can select multiple items by clicking them
- Selected items are toggled (click again to deselect)
- The dropdown stays open after selection (unlike single select)
- When 0 items selected: shows placeholder
- When 1+ items selected: shows all formatted items using \`itemStringifier\`, joined with commas
- Tooltip wraps the Select to show full list when 2+ items are selected
- The \`value\` prop accepts an array of \`Option[]\` objects
- The \`gd-change\` event receives an array of selected options
- Custom \`itemStringifier\` handles both primitive and object values, using JSON.stringify for objects
      `,
    `<gd-flex-container gap="10px" width="306px" flex-direction="column">
  <div id="tooltip">
    <gd-select multiple placeholder="Select multiple options"></gd-select>
  </div>
</gd-flex-container>

<script type="module">
  const select = document.querySelector('gd-select');
  const tooltip = document.querySelector('#tooltip');

  select.items = [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: { test: 'option2' } },
    { name: 'Option 3', value: 'option3' },
  ];

  // Custom item stringifier to format how items are displayed
  // Handles both primitive and object values
  select.itemStringifier = (option) =>
    \`\${option.name} (\${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value})\`;

  select.addEventListener('gd-change', (event) => {
    const selected = event.detail.value;
    // Show the full list as a tooltip when 2+ items are selected
    tooltip.title = selected.length > 1 ? selected.map(select.itemStringifier).join(', ') : '';
  });

  // Display behavior:
  // - 0 items: shows placeholder
  // - 1+ items: shows all formatted items using itemStringifier, joined with commas
  // - The tooltip shows the full list when 2+ items are selected
</script>`
  ),
};

export const WithAdornmentsAndResetOptionStory: Story = {
  name: 'With Adornments And Reset Option',
  render: (args) => {
    let selected: unknown = null;
    const output = text({ as: 'div', variant: 'small' }, 'Selected value: ', JSON.stringify(selected));

    const start = slotted(element('gd-icon', { name: 'folder', fill: "green['50']" }), 'adornment-start');
    start.addEventListener('click', action('On adornmentStart clicked!'));
    const end = slotted(text({ variant: 'small', color: 'icon.success' }, '(k)') as HTMLElement, 'adornment-end');
    end.addEventListener('click', action('On adornmentEnd clicked!'));

    const control = selectNode({
      ...args,
      items: [{ name: 'Reset', value: null }, ...selectItemsList],
      onSelect: (detail) => {
        args.onSelect?.(detail);
        selected = detail.data?.value ?? null;
        (output.lastChild as Text).data = JSON.stringify(selected);
      },
    });
    control.append(start, end);
    return wrap(control, output);
  },
  play: withAdornmentsAndResetOptionStoryActions,
  parameters: storyParameters(
    `
This story demonstrates how to create a Select component with start and end adornments and reset functionality. 
The example shows:
- Adding a reset option to the items list
- Using start adornment with icon
- Using end adornment with text
- Handling selection events 
- Displaying selected value output
- Custom styling of adornments
      `,
    `<gd-select id="adornments">
  <gd-icon slot="adornment-start" name="folder" fill="green"></gd-icon>
  <gd-typography slot="adornment-end" variant="small" color="icon.success">(k)</gd-typography>
</gd-select>

<script type="module">
  const select = document.querySelector('#adornments');
  select.items = [
    { name: 'Reset', value: null },
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' },
  ];
  select.addEventListener('gd-select', (event) => {
    console.log(event.detail.data?.value || null);
  });
</script>`
  ),
};

// Story: Custom Initiator with an input
export const WithCustomInitiatorAndSelectedOutputValue: Story = {
  render: (args) => {
    let selected: Option | null | undefined = null;
    const output = text({ as: 'div', variant: 'small' }, 'Output: ', JSON.stringify(selected));

    const input = slotted(
      element('gd-input', {
        placeholder: 'Choose an option',
        value: 'Choose an option',
        readOnly: true,
        width: '100%',
      }),
      'initiator'
    );
    const adornment = (slot: string, padding: string, content: string) => {
      const node = slotted(document.createElement('div'), slot);
      node.style.cssText = `padding: ${padding}; display: flex; color: #838383`;
      node.textContent = content;
      return node;
    };
    input.append(adornment('adornment-start', '0 0 0 10px', '€'), adornment('adornment-end', '0 10px 0 0', '.00'));

    const control = selectNode({
      ...args,
      items: selectItemsList,
      onSelect: ({ data }) => {
        args.onSelect?.({ data });
        input.value = data?.name ?? 'Select an item';
        selected = data;
        (output.lastChild as Text).data = JSON.stringify(selected);
      },
    });
    control.append(input);
    return wrap(control, output);
  },
  play: withCustomInitiatorAndSelectedOutputValueActions,
  parameters: storyParameters(
    undefined,
    `<gd-select id="custom-initiator">
  <gd-input slot="initiator" placeholder="Choose an option" value="Choose an option" width="100%" read-only>
    <div slot="adornment-start">€</div>
    <div slot="adornment-end">.00</div>
  </gd-input>
</gd-select>

<script type="module">
  const select = document.querySelector('#custom-initiator');
  const input = select.querySelector('gd-input');
  select.items = [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' },
  ];
  select.addEventListener('gd-select', ({ detail }) => {
    input.value = detail.data?.name || 'Select an item';
  });
</script>`
  ),
};

// Story: UsingRef Component
export const UsingRefComponentWithCustomPlaceholder: Story = {
  render: (args) => {
    const control = selectNode({ placeholder: 'Placeholder', items: selectItemsList, ...args });
    const button = (label: string, handler: () => void) => {
      const node = document.createElement('button');
      node.textContent = label;
      node.addEventListener('click', handler);
      return node;
    };
    return wrap(
      button('Close', () => control.close()),
      control,
      button('Open', () => control.open())
    );
  },
  play: usingRefComponentWithCustomPlaceholderActions,
  parameters: storyParameters(
    undefined,
    `<button id="close">Close</button>
<gd-select placeholder="Placeholder"></gd-select>
<button id="open">Open</button>

<script type="module">
  const select = document.querySelector('gd-select');
  select.items = [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' },
  ];
  document.querySelector('#close').addEventListener('click', () => select.close());
  document.querySelector('#open').addEventListener('click', () => select.open());
</script>`
  ),
};

// Story: Component for the custom dropdown story
export const WithFileInputAndCustomDropdown: Story = {
  name: 'With File Input And Custom Dropdown',
  render: (args) => {
    const customOptions: Option[] = [
      { name: 'Custom Opt 1', value: { id: 2 } },
      { name: 'Disabled Option', value: { id: 4 }, disabled: true },
    ];
    const control = selectNode({
      ...args,
      items: customOptions,
      renderOption: ({ item }) => {
        const image = element('gd-image', {
          src: 'https://picsum.photos/100/100',
          alt: item.name === 'Disabled Option' ? 'Custom Option 4' : 'Custom Option 2',
          width: 20,
          placeholder: '...',
        });
        return row({ gap: '10px', align: 'center' }, image, document.createTextNode(item.name));
      },
    });

    const inputFile = element('gd-input-file', { isIcon: true, buttonVariant: 'inherit' });
    inputFile.append(element('gd-icon', { name: 'attachment' }), document.createTextNode('Select file'));
    inputFile.addEventListener('gd-change', (event) => {
      event.stopPropagation();
      const files = (event as CustomEvent<{ files: Array<{ name: string }> }>).detail.files;
      action('onInputFileChanged')(files[0]);
      control.selectOption({ name: files[0]?.name ?? 'No file selected', value: { id: 1 } });
    });
    whileOpen(control, inputFile);
    return wrap(control);
  },
  play: withFileInputAndCustomDropdownActions,
  parameters: storyParameters(
    `
This story demonstrates how to create a Select component with a custom file input initiator and custom dropdown options. 
The example shows:
- Using a file input as a dropdown option
- Custom rendering of dropdown items with images
- Handling file selection events
- Disabled dropdown options
- Custom item stringifier for selected value display
        `,
    `<gd-select id="custom-dropdown">
  <gd-input-file is-icon button-variant="inherit">
    <gd-icon name="attachment"></gd-icon>
    Select file
  </gd-input-file>
</gd-select>

<script type="module">
  const select = document.querySelector('#custom-dropdown');
  select.items = [
    { name: 'Custom Opt 1', value: { id: 2 } },
    { name: 'Disabled Option', value: { id: 4 }, disabled: true },
  ];
  // Custom rendering of the dropdown items with images
  select.renderOption = ({ item }) => {
    const row = document.createElement('gd-row');
    row.gap = '10px';
    row.align = 'center';
    row.innerHTML = \`<gd-image src="/image.jpg" alt="Custom Option" width="20"></gd-image>\${item.name}\`;
    return row;
  };
  select.querySelector('gd-input-file').addEventListener('gd-change', (event) => {
    const files = event.detail.files;
    if (files[0]) select.selectOption({ name: files[0].name, value: { id: 1 } });
  });
</script>`
  ),
};

// Story: Component for CustomItemIdentifier story
export const CustomItemIdentifierComponent: Story = {
  render: (args) => {
    const customObjects = [
      { value: 1, name: 'Object 1' },
      {
        value: 2,
        name: 'The Select component is a versatile dropdown selector that provides various interaction patterns and customization options. It supports both simple selection scenarios ',
      },
      { value: 3, name: 'Object 3' },
    ];
    let selected: Option | null = null;
    const output = text({ as: 'div', variant: 'small' }, 'Selected value: ', JSON.stringify(selected));

    const control = selectNode({
      ...args,
      value: selected,
      placeholder: 'Select an item',
      items: customObjects.map((item) => ({ name: item.name, value: item })),
      renderOption: ({ item }) => {
        const custom = item.value as { value: number; name: string };
        return ['ID: ', String(custom.value), ' - ', custom.name];
      },
      itemIdentifier: (current, option) => {
        if (!current || !option) return false;
        return (
          ((current as Option).value as { value?: unknown })?.value ===
          ((option as Option).value as { value?: unknown })?.value
        );
      },
      onChange: (data) => {
        args.onChange?.(data);
        selected = (Array.isArray(data) ? data[0] : data) || null;
        (output.lastChild as Text).data = JSON.stringify(selected);
      },
    });

    return flexContainer(
      { gap: '10px', width: '306px' },
      control,
      flexContainer({ gap: '10px', width: '306px' }, output)
    );
  },
  play: customItemIdentifierComponentActions,
  parameters: storyParameters(
    undefined,
    `<gd-select id="identifier" placeholder="Select an item"></gd-select>

<script type="module">
  const customObjects = [
    { value: 1, name: 'Object 1' },
    { value: 2, name: 'Object 2' },
    { value: 3, name: 'Object 3' },
  ];

  const select = document.querySelector('#identifier');
  select.items = customObjects.map((item) => ({ name: item.name, value: item }));
  select.renderOption = ({ item }) => \`ID: \${item.value.value} - \${item.name}\`;
  select.itemIdentifier = (selected, current) => {
    if (!selected || !current) return false;
    return selected.value?.value === current.value?.value;
  };
  select.addEventListener('gd-change', (event) => {
    const data = event.detail.value;
    console.log(Array.isArray(data) ? data[0] || null : data || null);
  });
</script>`
  ),
};

export const WithAccessibility: Story = {
  render: (args) => wrap(selectNode({ items: selectItemsList, placeholder: 'Select an option', ...args })),
  tags: ['a11y'],
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
};

export const Disabled: Story = {
  render: (args) => {
    const selected: Option | null = null;
    return wrapColumn(
      selectNode({
        ...args,
        items: selectItemsList,
        value: selected,
        disabled: true,
        placeholder: 'Select an option (disabled)',
      }),
      text(
        { as: 'div', variant: 'small' },
        'This Select is disabled and cannot be interacted with. Click events and keyboard navigation are blocked.'
      )
    );
  },
  play: disabledActions,
  parameters: storyParameters(
    `
This story demonstrates the disabled state of the Select component. When \`disabled={true}\`:
- The Select component appears visually disabled (grayed out)
- Click events on the initiator are blocked
- Keyboard navigation (Arrow keys, Enter) is disabled
- The dropdown cannot be opened
- The component cannot receive focus
- This is useful for form states where the field should not be editable (e.g., during form submission, based on other field dependencies)
      `,
    `<gd-select disabled placeholder="Select an option (disabled)"></gd-select>

<script type="module">
  const select = document.querySelector('gd-select');
  select.items = [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' },
    { name: 'Option 3', value: 'option3' },
  ];
  select.addEventListener('gd-change', (event) => {
    console.log('Selected:', event.detail.value);
  });
</script>`
  ),
};

export const EmptyItems: Story = {
  render: (args) => {
    const emptyItems: Option[] = [];
    const control = selectNode({ ...args, items: emptyItems, placeholder: 'No options available' });
    whileOpen(
      control,
      slotted(
        row(
          { gap: '8px', padding: '16px', align: 'center', justify: 'center' },
          text({ variant: 'small', color: 'text.secondary' }, 'No items available. Please add items to the list.')
        ),
        'empty'
      )
    );
    return wrapColumn(
      control,
      text(
        { as: 'div', variant: 'small' },
        'This Select has an empty items array. The `emptyItemsResult` prop provides custom content to display when no items are available, offering better user guidance than an empty dropdown.'
      )
    );
  },
  play: emptyItemsActions,
  parameters: storyParameters(
    `
This story demonstrates the Select component with an empty items array and custom empty state. When \`items\` is empty or undefined:
- The dropdown can still be opened
- The \`emptyItemsResult\` prop displays custom content instead of an empty dropdown
- This provides better UX by guiding users when no options are available
- Useful for dynamic data scenarios where items might be loading or filtered out
- The empty state can include icons, text, or any Node for rich messaging
      `,
    `<gd-select placeholder="No options available">
  <gd-row slot="empty" gap="8px" padding="16px" align="center" justify="center">
    <gd-icon name="info"></gd-icon>
    <gd-typography variant="small" color="text.secondary">
      No items available. Please add items to the list.
    </gd-typography>
  </gd-row>
</gd-select>`
  ),
};

const colorStory = (color: NonNullable<Args['color']>, placeholder: string, description: string): Story => ({
  render: (args) => wrap(selectNode({ items: selectItemsList, color, placeholder, ...args })),
  parameters: storyParameters(description),
});

export const ColorPrimary: Story = colorStory(
  'primary',
  'Primary color select',
  'Select component with primary color variant (default).'
);

export const ColorSuccess: Story = colorStory(
  'success',
  'Success color select',
  'Select component with success color variant for valid input indication.'
);

export const ColorWarning: Story = colorStory(
  'warning',
  'Warning color select',
  'Select component with warning color variant for caution states.'
);

export const ColorError: Story = colorStory(
  'error',
  'Error color select',
  'Select component with error color variant for validation errors.'
);

export const Searchable: Story = {
  render: (args) => {
    const longItemsList: Option[] = [
      { name: 'Apple', value: 'apple' },
      { name: 'Banana', value: 'banana' },
      { name: 'Cherry', value: 'cherry' },
      { name: 'Date', value: 'date' },
      { name: 'Elderberry', value: 'elderberry' },
      { name: 'Fig', value: 'fig' },
      { name: 'Grape', value: 'grape' },
      { name: 'Honeydew', value: 'honeydew' },
    ];
    return wrap(
      selectNode({
        items: longItemsList,
        searchable: true,
        searchPlaceholder: 'Search fruits...',
        placeholder: 'Select a fruit',
        ...args,
      })
    );
  },
  parameters: storyParameters(
    `
This story demonstrates the searchable Select component. When \`searchable={true}\`:
- A search input appears at the top of the dropdown
- Items are filtered in real-time as the user types
- The search input auto-focuses when the dropdown opens
- Search text is cleared when the dropdown closes
- Use \`searchPlaceholder\` to customize the placeholder text
      `,
    `<gd-select searchable search-placeholder="Search fruits..." placeholder="Select a fruit"></gd-select>

<script type="module">
  document.querySelector('gd-select').items = [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
    { name: 'Cherry', value: 'cherry' },
  ];
</script>`
  ),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('select'),
  parameters: {
    layout: 'padded',
  },
};
