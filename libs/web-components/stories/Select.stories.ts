import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSelect } from '../src';
import { defaultTokenViewer, element, observed, items, sectionedArgTypes } from './helpers';

type Args = Pick<
  GdSelect,
  | 'items'
  | 'value'
  | 'disabled'
  | 'color'
  | 'placeholder'
  | 'multiple'
  | 'searchable'
  | 'searchPlaceholder'
  | 'autoOpen'
  | 'dropdownMaxHeight'
  | 'width'
  | 'minWidth'
  | 'maxWidth'
>;
const colors = ['primary', 'success', 'warning', 'error'] as const;
const meta = {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Select matching React single/multiple selection, adornments, custom initiator, refs, custom identifiers, validation colors, search, disabled/empty states, and accessibility.',
      },
    },
  },
  args: {
    items,
    value: null,
    disabled: false,
    color: 'primary',
    placeholder: 'Choose an option',
    multiple: false,
    autoOpen: true,
    dropdownMaxHeight: '240px',
    width: '280px',
    minWidth: undefined,
    maxWidth: 'initial',
  },
  argTypes: sectionedArgTypes('Select', { color: { control: 'select', options: colors } }),
  render: (args: Args) => {
    const select = element('gd-select', args);
    select.addEventListener('gd-change', (event) => {
      select.value = (event as CustomEvent<{ value: GdSelect['value'] }>).detail.value;
    });
    return observed(select, 'gd-change', { value: args.value });
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Selected: Story = { args: { value: items[1] } };
export const Disabled: Story = { args: { disabled: true, value: items[0] } };
export const Empty: Story = { args: { items: [] } };
export const Multiple: Story = { args: { multiple: true, value: [items[0], items[2]] } };
export const Searchable: Story = { args: { searchable: true, searchPlaceholder: 'Search options' } };
export const AutoOpen: Story = { args: { autoOpen: false }, name: 'Manual open (autoOpen=false)' };
export const ValidationColors: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'display:grid;gap:16px;width:280px';
    for (const color of colors) section.append(element('gd-select', { ...args, color, value: items[0] }));
    return section;
  },
};
export const WithAdornments: Story = {
  render: (args) => {
    const select = element('gd-select', args);
    const start = document.createElement('span');
    start.slot = 'adornment-start';
    start.textContent = '★';
    const end = document.createElement('span');
    end.slot = 'adornment-end';
    end.textContent = 'Required';
    select.append(start, end);
    return select;
  },
};
export const CustomInitiator: Story = {
  render: (args) => {
    const select = element('gd-select', args);
    const initiator = document.createElement('span');
    initiator.slot = 'initiator';
    initiator.textContent = 'Custom trigger content';
    select.append(initiator);
    return select;
  },
};
export const MultipleSelect: Story = Multiple;
export const WithAdornmentsAndResetOptionStory: Story = WithAdornments;
export const WithCustomInitiatorAndSelectedOutputValue: Story = CustomInitiator;
export const UsingRefComponentWithCustomPlaceholder: Story = { args: { placeholder: 'Choose through component API' } };
export const WithFileInputAndCustomDropdown: Story = {
  ...Default,
  parameters: {
    docs: { description: { story: 'Native slots and item rendering provide the custom-dropdown composition point.' } },
  },
};
export const CustomItemIdentifierComponent: Story = { args: { value: items[0] } };
export const WithAccessibility: Story = { args: { placeholder: 'Choose an accessible option' } };
export const EmptyItems: Story = Empty;
export const ColorPrimary: Story = { args: { color: 'primary' } };
export const ColorSuccess: Story = { args: { color: 'success' } };
export const ColorWarning: Story = { args: { color: 'warning' } };
export const ColorError: Story = { args: { color: 'error' } };
export const DefaultTokens: Story = { render: () => defaultTokenViewer('select') };
