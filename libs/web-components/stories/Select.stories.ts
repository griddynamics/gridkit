import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSelect } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes, stack } from './helpers';

type Args = Partial<GdSelect>;
const items = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: { test: 'option2' } },
  { name: 'Option 3', value: 'option3' },
];
const small = (text: string) => element('gd-typography', { as: 'div', variant: 'small' }, text);
function frame(...children: Node[]) {
  const root = stack('column', '10px', ...children);
  root.style.cssText += ';width:100%;min-width:306px;margin:0 auto';
  return root;
}
function select(args: Args = {}) {
  return element('gd-select', { items, ...args });
}
const meta = {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  argTypes: sectionedArgTypes('Select', {}),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selection examples with custom content, imperative controls, disabled and searchable states.',
      },
    },
  },
  render: (args: Args) => frame(select({ maxWidth: '400px', ...args })),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const MultipleSelect: Story = {
  render: (args) => {
    const control = select({
      ...args,
      multiple: true,
      value: [],
      placeholder: 'Select multiple options',
      itemStringifier: (option) =>
        `${option.name} (${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value})`,
    });
    control.addEventListener('gd-change', () => {
      const selected = control.value as typeof items;
      control.title = selected.length > 1 ? selected.map(control.itemStringifier).join(', ') : '';
    });
    const root = frame(control);
    root.style.width = '306px';
    return root;
  },
};
export const WithAdornmentsAndResetOptionStory: Story = {
  render: (args) => {
    const control = select({ ...args, items: [{ name: 'Reset', value: null }, ...items] });
    const start = element('gd-icon', { name: 'folder', fill: "green['50']" });
    start.slot = 'adornment-start';
    const end = element('gd-typography', { variant: 'small', color: 'icon.success' }, '(k)');
    end.slot = 'adornment-end';
    control.append(start, end);
    const output = small('Selected value: null');
    control.addEventListener('gd-change', () => {
      output.textContent = `Selected value: ${JSON.stringify((control.value as { value: unknown } | null)?.value ?? null)}`;
    });
    return frame(control, output);
  },
};
export const WithCustomInitiatorAndSelectedOutputValue: Story = {
  render: (args) => {
    const control = select(args);
    const input = element('gd-input', { placeholder: 'Choose an option', value: 'Choose an option', readOnly: true });
    input.slot = 'initiator';
    for (const [slot, text, padding] of [
      ['adornment-start', '€', '0 0 0 10px'],
      ['adornment-end', '.00', '0 10px 0 0'],
    ]) {
      const node = document.createElement('div');
      node.slot = slot;
      node.textContent = text;
      node.style.cssText = `padding:${padding};display:flex;color:#838383`;
      input.append(node);
    }
    control.append(input);
    const output = small('Output: null');
    control.addEventListener('gd-change', () => {
      input.value = (control.value as { name: string } | null)?.name ?? 'Select an item';
      output.textContent = `Output: ${JSON.stringify(control.value)}`;
    });
    return frame(control, output);
  },
};
export const UsingRefComponentWithCustomPlaceholder: Story = {
  render: (args) => {
    const control = select({ placeholder: 'Placeholder', ...args });
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.onclick = () => control.close();
    const open = document.createElement('button');
    open.textContent = 'Open';
    open.onclick = () => control.open();
    return frame(close, control, open);
  },
};
export const WithFileInputAndCustomDropdown: Story = {
  name: 'With File Input And Custom Dropdown',
  render: (args) => {
    const control = select({ ...args, items: [] });
    const content = stack('column', '0');
    content.slot = 'empty';
    const file = element('gd-input-file', { isIcon: true, buttonVariant: 'inherit' }, 'Select file');
    file.prepend(element('gd-icon', { name: 'attachment' }));
    file.addEventListener('gd-change', (event) => {
      event.stopPropagation();
      const files = (event as CustomEvent<{ files: { name: string }[] }>).detail.files;
      control.value = { name: files[0]?.name ?? 'No file selected', value: { id: 1 } };
      control.close();
    });
    const option = element('gd-button', { variant: 'inherit' }, 'Custom Opt 1');
    option.prepend(
      element('gd-image', {
        src: 'https://picsum.photos/100/100',
        alt: 'Custom Option 2',
        width: 20,
        placeholder: '...',
      })
    );
    option.onclick = () => {
      control.value = { name: 'Custom Opt 1', value: { id: 2 } };
      control.close();
    };
    const disabled = element('gd-button', { variant: 'inherit', disabled: true }, 'Disabled Option');
    disabled.prepend(
      element('gd-image', {
        src: 'https://picsum.photos/100/100',
        alt: 'Custom Option 4',
        width: 20,
        placeholder: '...',
      })
    );
    content.append(file, option, disabled);
    control.append(content);
    return frame(control);
  },
};
export const CustomItemIdentifierComponent: Story = {
  render: (args) => {
    const objects = [
      { value: 1, name: 'Object 1' },
      {
        value: 2,
        name: 'The Select component is a versatile dropdown selector that provides various interaction patterns and customization options. It supports both simple selection scenarios ',
      },
      { value: 3, name: 'Object 3' },
    ];
    const control = select({
      ...args,
      items: objects.map((item) => ({ name: item.name, value: item })),
      placeholder: 'Select an item',
      itemIdentifier: (selected, current) =>
        (selected?.value as { value?: number })?.value === (current?.value as { value?: number })?.value,
      renderOption: ({ item }) => `ID: ${(item.value as { value: number }).value} - ${item.name}`,
    });
    const output = small('Selected value: null');
    control.addEventListener('gd-change', () => {
      output.textContent = `Selected value: ${JSON.stringify(control.value)}`;
    });
    const root = frame(control, frame(output));
    root.style.width = '306px';
    return root;
  },
};
export const WithAccessibility: Story = {
  render: (args) => frame(select({ placeholder: 'Select an option', ...args })),
};
export const Disabled: Story = {
  render: (args) =>
    frame(
      select({ ...args, disabled: true, placeholder: 'Select an option (disabled)' }),
      small('This Select is disabled and cannot be interacted with. Click events and keyboard navigation are blocked.')
    ),
};
export const EmptyItems: Story = {
  render: (args) => {
    const control = select({ ...args, items: [], placeholder: 'No options available' });
    const empty = small('No items available. Please add items to the list.');
    empty.slot = 'empty';
    empty.style.padding = '16px';
    control.append(empty);
    return frame(
      control,
      small(
        'This Select has an empty items array. The `emptyItemsResult` prop provides custom content to display when no items are available, offering better user guidance than an empty dropdown.'
      )
    );
  },
};
export const ColorPrimary: Story = {
  render: (args) => frame(select({ color: 'primary', placeholder: 'Primary color select', ...args })),
};
export const ColorSuccess: Story = {
  render: (args) => frame(select({ color: 'success', placeholder: 'Success color select', ...args })),
};
export const ColorWarning: Story = {
  render: (args) => frame(select({ color: 'warning', placeholder: 'Warning color select', ...args })),
};
export const ColorError: Story = {
  render: (args) => frame(select({ color: 'error', placeholder: 'Error color select', ...args })),
};
export const Searchable: Story = {
  render: (args) =>
    frame(
      select({
        items: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'].map((name) => ({
          name,
          value: name.toLowerCase(),
        })),
        searchable: true,
        searchPlaceholder: 'Search fruits...',
        placeholder: 'Select a fruit',
        ...args,
      })
    ),
};
export const DefaultTokens: Story = { parameters: { layout: 'padded' }, render: () => defaultTokenViewer('select') };
