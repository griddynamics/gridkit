import React, { useRef, useState, useCallback, type ChangeEvent } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { get } from '@utils';
import {
  Select,
  DropdownItem,
  Input,
  Row,
  Image,
  Typography,
  InputFile,
  Icon,
  type SelectRef,
  Option,
  FlexContainer,
  SelectOnSelect,
  Tooltip,
} from '@components';
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

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,

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
      description: 'Callback when item is selected',
      action: 'selected',
      table: {
        category: 'Events',
        type: {
          summary: 'SelectOnSelect = <T = HTMLDivElement>(props: OnSelectProps<T>) => void',
          detail:
            'OnSelectProps<T = HTMLDivElement> {\n  event: MouseEvent<T> | KeyboardEvent<T> | ChangeEvent<T>;\n  data?: Option;\n  index?: number;\n}',
        },
      },
    },
    onChange: {
      description:
        'Callback fired when value changes (receives Option for single select, Option[] for multiple select)',
      table: {
        category: 'Events',
        type: { summary: '(data: Option | Option[]) => void', detail: 'Option { name: string;  value: unknown; }' },
      },
    },
    onKeyDown: {
      description: 'Callback fired on keyboard events',
      table: {
        category: 'Events',
        type: { summary: 'ReactEventHandler<HTMLElement>' },
      },
    },
    onInitiatorClick: {
      description: 'Callback fired when initiator is clicked',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent<HTMLElement>) => void' },
      },
    },

    // Customization
    renderOption: {
      description: 'Custom renderer for option items',
      table: {
        category: 'Customization',
        type: {
          summary: '(value: renderOptionType) => ReactNode',
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
      description: 'Element to be rendered at the start of the select',
      table: {
        category: 'Layout',
        type: { summary: 'ReactNode' },
      },
    },
    adornmentEnd: {
      description: 'Element to be rendered at the end of the select',
      table: {
        category: 'Layout',
        type: { summary: 'ReactNode' },
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
        'Forwarded ref that provides access to container methods: `isOpen`, `open()`, `close()`, `toggle() and onSelect()`.',
      table: {
        category: 'Advanced',
        type: {
          summary: 'Ref<SelectRef>',
          detail:
            '{ isOpen: boolean; open: () => void; close: () => void; toggle: () => void;  onSelect: <T = HTMLDivElement>(event: MouseEvent<T> | KeyboardEvent<T> | ChangeEvent<T>, data: Option) => void}',
        },
      },
    },
    initiator: {
      description: 'Custom initiator element to trigger the dropdown',
      table: {
        category: 'Advanced',
        type: { summary: 'ReactNode' },
      },
    },
    children: {
      description: 'Child elements of the select component',
      table: {
        category: 'Advanced',
        type: { summary: 'ReactNode' },
      },
    },
    emptyItemsResult: {
      description: 'Text or Component to display when no items are available',
      table: {
        category: 'Advanced',
        type: { summary: 'ReactNode' },
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
  } as any,

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
  <li>Controlled mode with value/onChange</li>
  <li>Uncontrolled mode with default value</li>
  <li>Open/closed state control</li>
  <li>Active item tracking</li>
  </ul>
  </li>
  <li>
  <b>Ref API Methods</b>
  <ul>
  <li><code>isOpen()</code> - Check dropdown state</li>
  <li><code>open()</code> - Open dropdown</li>
  <li><code>close()</code> - Close dropdown</li>
  <li><code>toggle()</code> - Toggle dropdown state</li>
  <li><code>onSelect()</code> - Programmatically select item</li>
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
};

export default meta;

const selectItemsList = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: { test: 'option2' } },
  { name: 'Option 3', value: 'option3' },
];

export const Default: StoryFn = (args) => {
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select items={selectItemsList} maxWidth="400px" {...args} />
    </FlexContainer>
  );
};
Default.play = defaultActions;
Default.parameters = {
  docs: {
    source: {
      code: `import { Select, Option } from 'gd-design-library';

const selectItems: Option[] = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: 'option2' },
  { name: 'Option 3', value: 'option3' },
];

<Select 
  items={selectItems} 
  placeholder="Choose an option"
  onChange={(data) => {
    console.log('Selected:', data);
  }}
/>`,
    },
  },
};

export const MultipleSelect: StoryFn = (args) => {
  const [selected, setSelected] = useState<Option[]>([]);

  const customItemStringifier = (option: Option): string => {
    return `${option.name} (${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value})`;
  };

  const displayText = selected.map((s) => customItemStringifier(s)).join(', ');

  return (
    <FlexContainer gap="10px" width="306px" flexDirection="column">
      <Tooltip content={selected.length > 1 ? displayText : null}>
        <Select
          {...args}
          multiple
          items={selectItemsList}
          value={selected}
          onChange={(data) => {
            if (Array.isArray(data)) {
              setSelected(data);
            }
          }}
          placeholder="Select multiple options"
          itemStringifier={customItemStringifier}
        />
      </Tooltip>
    </FlexContainer>
  );
};
MultipleSelect.play = multipleSelectActions;
MultipleSelect.parameters = {
  docs: {
    description: {
      story: `
This story demonstrates the multiple select functionality with custom item stringifier and Tooltip. When \`multiple\` prop is enabled:
- Users can select multiple items by clicking them
- Selected items are toggled (click again to deselect)
- The dropdown stays open after selection (unlike single select)
- When 0 items selected: shows placeholder
- When 1+ items selected: shows all formatted items using \`itemStringifier\`, joined with commas
- Tooltip wraps the Select to show full list when 2+ items are selected
- The \`value\` prop accepts an array of \`Option[]\` objects
- The \`onChange\` callback receives an array of selected options
- Custom \`itemStringifier\` handles both primitive and object values, using JSON.stringify for objects
      `,
    },
    source: {
      code: `import { useState } from 'react';
import { Select, Option, Tooltip, FlexContainer } from 'gd-design-library';

const selectItems: Option[] = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: { test: 'option2' } },
  { name: 'Option 3', value: 'option3' },
];

const [selected, setSelected] = useState<Option[]>([]);

// Custom item stringifier to format how items are displayed
// Handles both primitive and object values
const itemStringifier = (option: Option): string => {
  return \`\${option.name} (\${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value})\`;
};

// Generate display text for tooltip
const displayText = selected.map((s) => itemStringifier(s)).join(', ');

<FlexContainer gap="10px" width="306px" flexDirection="column">
  <Tooltip content={selected.length > 1 ? displayText : null}>
    <Select
      multiple
      items={selectItems}
      value={selected}
      onChange={(data) => {
        if (Array.isArray(data)) {
          setSelected(data);
        }
      }}
      placeholder="Select multiple options"
      itemStringifier={itemStringifier}
    />
  </Tooltip>
</FlexContainer>

{/* 
  Display behavior:
  - 0 items: shows placeholder
  - 1+ items: shows all formatted items using itemStringifier, joined with commas
  - Tooltip shows full list when 2+ items are selected
  - itemStringifier handles both primitive and object values
*/}`,
    },
  },
};

const WithAdornmentsAndResetOption: StoryFn = (args) => {
  const [selected, setSelected] = useState<Option | null>(null);
  const onSelect: SelectOnSelect = useCallback((selected) => {
    setSelected(get(selected, 'data.value', null));
  }, []);

  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select
        {...args}
        onSelect={onSelect}
        items={[{ name: 'Reset', value: null }, ...selectItemsList]}
        adornmentStart={<Icon name="folder" fill="green['50']" onClick={action('On adornmentStart clicked!')} />}
        adornmentEnd={
          <Typography onClick={action('On adornmentEnd clicked!')} variant="small" color="icon.success">
            (k)
          </Typography>
        }
      />
      <Typography as="div" variant="small">
        Selected value: {JSON.stringify(selected)}
      </Typography>
    </FlexContainer>
  );
};
export const WithAdornmentsAndResetOptionStory = {
  name: 'With Adornments And Reset Option',
  render: WithAdornmentsAndResetOption,
  play: withAdornmentsAndResetOptionStoryActions,
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how to create a Select component with start and end adornments and reset functionality. 
The example shows:
- Adding a reset option to the items list
- Using start adornment with icon
- Using end adornment with text
- Handling selection events 
- Displaying selected value output
- Custom styling of adornments
      `,
      },
      source: {
        code: `import { useState, useCallback } from 'react';
import { Select, Icon, Typography, Option, SelectOnSelect } from 'gd-design-library';

const selectItems: Option[] = [
  { name: 'Reset', value: null },
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: 'option2' },
];

const [selected, setSelected] = useState<Option | null>(null);
const onSelect: SelectOnSelect = useCallback((data) => {
  setSelected(data.data?.value || null);
}, []);

<Select
  items={selectItems}
  onSelect={onSelect}
  adornmentStart={<Icon name="folder" fill="green" />}
  adornmentEnd={
    <Typography variant="small" color="icon.success">
      (k)
    </Typography>
  }
/>`,
      },
    },
  },
} as unknown as StoryFn<typeof Select>;

// Story: Custom Initiator with an input
export const WithCustomInitiatorAndSelectedOutputValue: StoryFn = (args) => {
  const [value, setValue] = useState<string>('Choose an option');
  const [selected, setSelectedValue] = useState<Option | null>(null);
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select
        {...args}
        items={selectItemsList}
        onSelect={({ data }) => {
          setValue(get(data, 'name', 'Select an item'));
          setSelectedValue(data);
        }}
        initiator={
          <Input
            placeholder="Choose an option"
            value={value}
            adornmentStart={<div style={{ padding: '0 0 0 10px', display: 'flex', color: '#838383' }}>€</div>}
            adornmentEnd={<div style={{ padding: '0 10px 0 0', display: 'flex', color: '#838383' }}>.00</div>}
            readOnly
          />
        }
      />
      <Typography as="div" variant="small">
        Output: {JSON.stringify(selected)}
      </Typography>
    </FlexContainer>
  );
};
WithCustomInitiatorAndSelectedOutputValue.play = withCustomInitiatorAndSelectedOutputValueActions;
WithCustomInitiatorAndSelectedOutputValue.parameters = {
  docs: {
    source: {
      code: `import { useState } from 'react';
import { Select, Input, Option } from 'gd-design-library';

const selectItems: Option[] = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: 'option2' },
];

const [value, setValue] = useState<string>('Choose an option');
const [selected, setSelected] = useState<Option | null>(null);

<Select
  items={selectItems}
  onSelect={({ data }) => {
    setValue(data?.name || 'Select an item');
    setSelected(data);
  }}
  initiator={
    <Input
      placeholder="Choose an option"
      value={value}
      adornmentStart={<div>€</div>}
      adornmentEnd={<div>.00</div>}
      readOnly
    />
  }
/>`,
    },
  },
};

// Story: UsingRef Component
export const UsingRefComponentWithCustomPlaceholder: StoryFn = (args) => {
  const selectRef = useRef<SelectRef>(null);

  return (
    <FlexContainer gap="10px" minWidth="306px">
      <button onClick={() => selectRef.current?.close()}>Close</button>
      <Select placeholder="Placeholder" ref={selectRef} items={selectItemsList} {...args} />
      <button onClick={() => selectRef.current?.open()}>Open</button>
    </FlexContainer>
  );
};
UsingRefComponentWithCustomPlaceholder.play = usingRefComponentWithCustomPlaceholderActions;
UsingRefComponentWithCustomPlaceholder.parameters = {
  docs: {
    source: {
      code: `import { useRef } from 'react';
import { Select, SelectRef, Option } from 'gd-design-library';

const selectItems: Option[] = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: 'option2' },
];

const selectRef = useRef<SelectRef>(null);

<>
  <button onClick={() => selectRef.current?.close()}>Close</button>
  <Select 
    placeholder="Placeholder" 
    ref={selectRef} 
    items={selectItems}
  />
  <button onClick={() => selectRef.current?.open()}>Open</button>
</>`,
    },
  },
};

// Story: Component for WithCustomDropdownItems story
const WithFileInputAndCustomDropdownOptionsComponent: StoryFn = (args) => {
  const selectRef = useRef<SelectRef>(null);
  const onInputFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const files = get(event, 'target.files', []);
    action('onInputFileChanged')(files[0]);
    selectRef?.current?.onSelect({ event, data: { name: get(files, '0.name', 'No file selected'), value: { id: 1 } } });
  };

  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select {...args} ref={selectRef}>
        <InputFile
          isIcon
          onChange={(e) => onInputFileChanged(e)}
          buttonProps={{
            variant: 'inherit',
            color: 'secondary',
            fullWidth: true,
          }}
        >
          <Icon name="attachment" />
          Select file
        </InputFile>

        <DropdownItem name="Custom Opt 1" value={{ id: 2 }}>
          <Row gap="10px" align="center">
            <Image src="https://picsum.photos/100/100" alt="Custom Option 2" width={20} placeholder="..." />
            Custom Opt 1
          </Row>
        </DropdownItem>
        <DropdownItem value={{ id: 4 }} disabled>
          <Row gap="10px" align="center">
            <Image src="https://picsum.photos/100/100" alt="Custom Option 4" width={20} placeholder="..." />
            Disabled Option
          </Row>
        </DropdownItem>
      </Select>
    </FlexContainer>
  );
};

export const WithFileInputAndCustomDropdown = {
  name: 'With File Input And Custom Dropdown',
  render: WithFileInputAndCustomDropdownOptionsComponent,
  play: withFileInputAndCustomDropdownActions,
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how to create a Select component with a custom file input initiator and custom dropdown options. 
The example shows:
- Using a file input as a dropdown option
- Custom rendering of dropdown items with images
- Handling file selection events
- Disabled dropdown options
- Custom item stringifier for selected value display
        `,
      },
      source: {
        code: `import { useRef, type ChangeEvent } from 'react';
import { Select, DropdownItem, Row, Image, InputFile, Icon, SelectRef } from 'gd-design-library';

const selectRef = useRef<SelectRef>(null);

const onInputFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files && files[0]) {
    selectRef.current?.onSelect({ 
      event, 
      data: { 
        name: files[0].name, 
        value: { id: 1 } 
      } 
    });
  }
};

<Select ref={selectRef}>
  <InputFile
    isIcon
    onChange={onInputFileChanged}
    buttonProps={{
      variant: 'inherit',
      color: 'secondary',
      fullWidth: true,
    }}
  >
    <Icon name="attachment" />
    Select file
  </InputFile>

  <DropdownItem name="Custom Opt 1" value={{ id: 2 }}>
    <Row gap="10px" align="center">
      <Image src="/image.jpg" alt="Custom Option" width={20} />
      Custom Opt 1
    </Row>
  </DropdownItem>
  <DropdownItem value={{ id: 4 }} disabled>
    <Row gap="10px" align="center">
      <Image src="/image.jpg" alt="Disabled Option" width={20} />
      Disabled Option
    </Row>
  </DropdownItem>
</Select>`,
      },
    },
  },
} as unknown as StoryFn<typeof Select>;

// Story: Component for CustomItemIdentifier story
export const CustomItemIdentifierComponent: StoryFn = (args) => {
  const [selected, setSelected] = useState<Option | null>(null);

  const customObjects = [
    { value: 1, name: 'Object 1' },
    {
      value: 2,
      name: 'The Select component is a versatile dropdown selector that provides various interaction patterns and customization options. It supports both simple selection scenarios ',
    },
    { value: 3, name: 'Object 3' },
  ];

  return (
    <FlexContainer gap="10px" width="306px">
      <Select
        {...args}
        value={selected}
        placeholder="Select an item"
        onChange={(data) => {
          if (Array.isArray(data)) {
            setSelected(data[0] || null);
          } else {
            setSelected(data || null);
          }
        }}
        itemIdentifier={(selected, current) => {
          if (!selected || !current) return false;
          return get(selected, 'value.value', '') === get(current, 'value.value', '');
        }}
      >
        {customObjects.map((item) => (
          <DropdownItem key={item.value} name={item.name} value={item}>
            ID: {item.value} - {item.name}
          </DropdownItem>
        ))}
      </Select>

      <FlexContainer gap="10px" width="306px">
        <Typography as="div" variant="small">
          Selected value: {JSON.stringify(selected)}
        </Typography>
      </FlexContainer>
    </FlexContainer>
  );
};
CustomItemIdentifierComponent.play = customItemIdentifierComponentActions;
CustomItemIdentifierComponent.parameters = {
  docs: {
    source: {
      code: `import { useState } from 'react';
import { Select, DropdownItem, Option } from 'gd-design-library';
import { get } from '@utils';

const customObjects = [
  { value: 1, name: 'Object 1' },
  { value: 2, name: 'Object 2' },
  { value: 3, name: 'Object 3' },
];

const [selected, setSelected] = useState<Option | null>(null);

<Select
  value={selected}
  placeholder="Select an item"
  onChange={(data) => {
    if (Array.isArray(data)) {
      setSelected(data[0] || null);
    } else {
      setSelected(data || null);
    }
  }}
  itemIdentifier={(selected, current) => {
    if (!selected || !current) return false;
    return get(selected, 'value.value', '') === get(current, 'value.value', '');
  }}
>
  {customObjects.map((item) => (
    <DropdownItem key={item.value} name={item.name} value={item}>
      ID: {item.value} - {item.name}
    </DropdownItem>
  ))}
</Select>`,
    },
  },
};

export const WithAccessibility: StoryFn = (args) => {
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select items={selectItemsList} placeholder="Select an option" {...args} />
    </FlexContainer>
  );
};
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};

export const Disabled: StoryFn = (args) => {
  const [selected, setSelected] = useState<Option | null>(null);

  return (
    <FlexContainer gap="10px" minWidth="306px" flexDirection="column">
      <Select
        {...args}
        items={selectItemsList}
        value={selected}
        disabled
        placeholder="Select an option (disabled)"
        onChange={(data) => {
          if (!Array.isArray(data)) {
            setSelected(data);
          }
        }}
      />
      <Typography as="div" variant="small">
        This Select is disabled and cannot be interacted with. Click events and keyboard navigation are blocked.
      </Typography>
    </FlexContainer>
  );
};
Disabled.play = disabledActions;
Disabled.parameters = {
  docs: {
    description: {
      story: `
This story demonstrates the disabled state of the Select component. When \`disabled={true}\`:
- The Select component appears visually disabled (grayed out)
- Click events on the initiator are blocked
- Keyboard navigation (Arrow keys, Enter) is disabled
- The dropdown cannot be opened
- The component cannot receive focus
- This is useful for form states where the field should not be editable (e.g., during form submission, based on other field dependencies)
      `,
    },
    source: {
      code: `import { Select, Option } from 'gd-design-library';

const selectItems: Option[] = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: 'option2' },
  { name: 'Option 3', value: 'option3' },
];

<Select 
  items={selectItems} 
  disabled
  placeholder="Select an option (disabled)"
  onChange={(data) => {
    console.log('Selected:', data);
  }}
/>`,
    },
  },
};

export const EmptyItems: StoryFn = (args) => {
  const emptyItems: Option[] = [];

  return (
    <FlexContainer gap="10px" minWidth="306px" flexDirection="column">
      <Select
        {...args}
        items={emptyItems}
        placeholder="No options available"
        emptyItemsResult={
          <Row gap="8px" padding="16px" align="center" justify="center">
            <Typography variant="small" color="text.secondary">
              No items available. Please add items to the list.
            </Typography>
          </Row>
        }
      />
      <Typography as="div" variant="small">
        This Select has an empty items array. The `emptyItemsResult` prop provides custom content to display when no
        items are available, offering better user guidance than an empty dropdown.
      </Typography>
    </FlexContainer>
  );
};
EmptyItems.play = emptyItemsActions;
EmptyItems.parameters = {
  docs: {
    description: {
      story: `
This story demonstrates the Select component with an empty items array and custom empty state. When \`items\` is empty or undefined:
- The dropdown can still be opened
- The \`emptyItemsResult\` prop displays custom content instead of an empty dropdown
- This provides better UX by guiding users when no options are available
- Useful for dynamic data scenarios where items might be loading or filtered out
- The empty state can include icons, text, or any ReactNode for rich messaging
      `,
    },
    source: {
      code: `import { Select, Option, Row, Icon, Typography } from 'gd-design-library';

const emptyItems: Option[] = [];

<Select 
  items={emptyItems}
  placeholder="No options available"
  emptyItemsResult={
    <Row gap="8px" padding="16px" align="center" justify="center">
      <Icon name="info" />
      <Typography variant="small" color="text.secondary">
        No items available. Please add items to the list.
      </Typography>
    </Row>
  }
/>`,
    },
  },
};

export const ColorPrimary: StoryFn = (args) => {
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select items={selectItemsList} color="primary" placeholder="Primary color select" {...args} />
    </FlexContainer>
  );
};
ColorPrimary.parameters = {
  docs: {
    description: {
      story: 'Select component with primary color variant (default).',
    },
  },
};

export const ColorSuccess: StoryFn = (args) => {
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select items={selectItemsList} color="success" placeholder="Success color select" {...args} />
    </FlexContainer>
  );
};
ColorSuccess.parameters = {
  docs: {
    description: {
      story: 'Select component with success color variant for valid input indication.',
    },
  },
};

export const ColorWarning: StoryFn = (args) => {
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select items={selectItemsList} color="warning" placeholder="Warning color select" {...args} />
    </FlexContainer>
  );
};
ColorWarning.parameters = {
  docs: {
    description: {
      story: 'Select component with warning color variant for caution states.',
    },
  },
};

export const ColorError: StoryFn = (args) => {
  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select items={selectItemsList} color="error" placeholder="Error color select" {...args} />
    </FlexContainer>
  );
};
ColorError.parameters = {
  docs: {
    description: {
      story: 'Select component with error color variant for validation errors.',
    },
  },
};

export const Searchable: StoryFn = (args) => {
  const longItemsList = [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
    { name: 'Cherry', value: 'cherry' },
    { name: 'Date', value: 'date' },
    { name: 'Elderberry', value: 'elderberry' },
    { name: 'Fig', value: 'fig' },
    { name: 'Grape', value: 'grape' },
    { name: 'Honeydew', value: 'honeydew' },
  ];

  return (
    <FlexContainer gap="10px" minWidth="306px">
      <Select
        items={longItemsList}
        searchable
        searchPlaceholder="Search fruits..."
        placeholder="Select a fruit"
        {...args}
      />
    </FlexContainer>
  );
};
Searchable.parameters = {
  docs: {
    description: {
      story: `
This story demonstrates the searchable Select component. When \`searchable={true}\`:
- A search input appears at the top of the dropdown
- Items are filtered in real-time as the user types
- The search input auto-focuses when the dropdown opens
- Search text is cleared when the dropdown closes
- Use \`searchPlaceholder\` to customize the placeholder text
      `,
    },
    source: {
      code: `import { Select, Option } from 'gd-design-library';

const items: Option[] = [
  { name: 'Apple', value: 'apple' },
  { name: 'Banana', value: 'banana' },
  { name: 'Cherry', value: 'cherry' },
];

<Select
  items={items}
  searchable
  searchPlaceholder="Search fruits..."
  placeholder="Select a fruit"
/>`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ select: defaultTheme.select }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
