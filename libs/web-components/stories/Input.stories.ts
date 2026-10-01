import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdInput } from '../src';
import { element, observed } from './helpers';

type Args = Pick<
  GdInput,
  | 'value'
  | 'variant'
  | 'label'
  | 'helperText'
  | 'placeholder'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'color'
  | 'width'
  | 'inputmode'
  | 'role'
  | 'tabIndex'
  | 'debounceCallbackTime'
>;
const inputVariants = [
  'text',
  'password',
  'email',
  'search',
  'url',
  'tel',
  'date',
  'time',
  'month',
  'week',
  'color',
  'range',
  'number',
  'radio',
  'checkbox',
];
const colors = ['primary', 'success', 'warning', 'error'] as const;
const meta = {
  title: 'Atoms/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Input matching React labels, helper text, validation colors, disabled/read-only states, adornments, styles, checkbox/radio modes, accessibility, and native events.',
      },
    },
  },
  args: {
    value: 'Default Input',
    variant: 'text',
    label: 'Label',
    helperText: 'Helper text',
    placeholder: 'Enter text',
    disabled: false,
    readOnly: false,
    required: false,
    color: 'primary',
    width: '320px',
    inputmode: undefined,
    role: null,
    tabIndex: 0,
    debounceCallbackTime: undefined,
  },
  argTypes: { variant: { control: 'select', options: inputVariants }, color: { control: 'select', options: colors } },
  render: (args: Args) => {
    const input = element('gd-input', args);
    input.addEventListener('gd-input', (event) => {
      input.value = (event as CustomEvent<{ value: string }>).detail.value;
    });
    return observed(input, 'gd-input', { value: args.value });
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Empty: Story = { args: { value: '' } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const ValidationColors: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'display:grid;gap:20px;max-width:360px';
    for (const color of colors)
      section.append(element('gd-input', { ...args, color, label: color, helperText: `${color} helper text` }));
    return section;
  },
};
export const WithAdornments: Story = {
  render: (args) => {
    const input = element('gd-input', args);
    const start = document.createElement('span');
    start.slot = 'adornment-start';
    start.textContent = '🔎';
    const end = document.createElement('span');
    end.slot = 'adornment-end';
    end.textContent = '⌘K';
    input.append(start, end);
    return input;
  },
};
export const InputTypes: Story = {
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'display:grid;gap:16px;max-width:360px';
    for (const variant of ['text', 'email', 'password', 'search', 'number', 'date'])
      section.append(element('gd-input', { ...args, variant, value: '', label: variant }));
    return section;
  },
};
export const PrimaryDefaultWithLabelAndHelperText: Story = Default;
export const SuccessWithLabelAndHelperText: Story = { args: { color: 'success' } };
export const WarningWithLabelAndHelperText: Story = { args: { color: 'warning' } };
export const ErrorWithLabelAndHelperText: Story = { args: { color: 'error' } };
export const WrapperAsSpan: Story = {
  ...Default,
  parameters: {
    docs: {
      description: { story: 'The Custom Element host is stable; internal layout provides the React wrapper behavior.' },
    },
  },
};
export const WithStartAdornment: Story = WithAdornments;
export const WithEndAdornmentAsIcon: Story = WithAdornments;
export const DefaultWithTailwind: Story = {
  render: (args) => element('gd-input', { ...args, styles: { fontWeight: 700 } }),
};
export const CustomStyles: Story = {
  render: (args) => element('gd-input', { ...args, styles: { letterSpacing: '0.05em' } }),
};
export const CheckboxWithLabel: Story = { args: { variant: 'checkbox', value: '', label: 'Accept terms' } };
export const RadioControlledWithLabel: Story = { args: { variant: 'radio', value: 'one', label: 'Option one' } };
export const RadioGroupWithLabel: Story = InputTypes;
export const WithAccessibility: Story = {
  args: { required: true, label: 'Email address', helperText: 'Required field' },
};
export const DefaultTokens: Story = { render: () => document.createElement('pre') };
