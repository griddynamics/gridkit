import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdTextarea } from '../src';
import { defaultTokenViewer, element, observed } from './helpers';

type Args = Pick<
  GdTextarea,
  | 'name'
  | 'placeholder'
  | 'value'
  | 'defaultValue'
  | 'minHeight'
  | 'maxHeight'
  | 'disabled'
  | 'readOnly'
  | 'autoFocus'
  | 'resize'
  | 'rows'
  | 'dynamicHeightAdjustment'
  | 'variant'
  | 'color'
  | 'maxLength'
  | 'maxCharacters'
  | 'styles'
>;
const meta = {
  title: 'Atoms/Textarea',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible multi-line text input with controlled and uncontrolled values, resize modes, dynamic height, validation colors, character limits, focus management, and native gd-input/gd-change events.',
      },
    },
  },
  args: {
    name: 'textarea',
    resize: 'none',
    variant: 'default',
    color: 'primary',
    disabled: false,
    readOnly: false,
    dynamicHeightAdjustment: false,
  },
  argTypes: {
    name: { description: 'Native field name', control: 'text' },
    placeholder: { description: 'Placeholder text', control: 'text' },
    value: { description: 'Controlled value', control: 'text' },
    defaultValue: { description: 'Initial uncontrolled value', control: 'text' },
    minHeight: { description: 'Minimum height', control: 'text' },
    maxHeight: { description: 'Maximum height', control: 'text' },
    disabled: { description: 'Disables the field', control: 'boolean' },
    readOnly: { description: 'Makes the field read-only', control: 'boolean' },
    autoFocus: { description: 'Focuses after first render', control: 'boolean' },
    resize: {
      description: 'Native resize behavior',
      control: 'select',
      options: ['none', 'both', 'horizontal', 'vertical'],
    },
    rows: { description: 'Visible row count', control: 'number' },
    dynamicHeightAdjustment: { description: 'Grow height with content', control: 'boolean' },
    variant: { description: 'Visual variant', control: 'select', options: ['default', 'inline'] },
    color: { description: 'Validation color', control: 'select', options: ['primary', 'success', 'warning', 'error'] },
    maxLength: { description: 'Native hard character limit', control: 'number' },
    maxCharacters: { description: 'Visual character counter threshold', control: 'number' },
    styles: { description: 'Custom textarea styles', control: 'object' },
  },
  render: (args: Args) =>
    observed(element('gd-textarea', args), 'gd-input', { value: args.value ?? args.defaultValue ?? '' }),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = { args: { placeholder: 'Type something...', defaultValue: 'This is a default value ' } };
export const Disabled: Story = {
  args: { placeholder: 'You cannot edit this...', disabled: true, defaultValue: 'This is a disabled value' },
};
export const ReadOnly: Story = { args: { defaultValue: 'This text cannot be changed', readOnly: true } };
export const VariantInline: Story = { args: { defaultValue: 'Styled text area...', variant: 'inline' } };
export const ColorPrimary: Story = {
  args: {
    placeholder: 'Primary color textarea...',
    color: 'primary',
    defaultValue: 'This is a primary color textarea',
  },
};
export const ColorSuccess: Story = {
  args: {
    placeholder: 'Success color textarea...',
    color: 'success',
    defaultValue: 'This is a success color textarea',
  },
};
export const ColorWarning: Story = {
  args: {
    placeholder: 'Warning color textarea...',
    color: 'warning',
    defaultValue: 'This is a warning color textarea',
  },
};
export const ColorError: Story = {
  args: { placeholder: 'Error color textarea...', color: 'error', defaultValue: 'This is an error color textarea' },
};
export const AutoFocus: Story = { args: { autoFocus: true, placeholder: 'This will be focused on load' } };
export const DynamicHeight: Story = {
  args: { dynamicHeightAdjustment: true, placeholder: 'Start typing to expand... Start typing to expand...' },
};
export const WithCharLimit: Story = { args: { maxLength: 50, placeholder: 'Max 50 characters...' } };
export const Resizable: Story = { args: { placeholder: 'Resizable Textarea placeholder text...', resize: 'both' } };
export const WithControlledStateEraseOnEnterClick: Story = {
  render: () => {
    const area = element('gd-textarea', {
      name: 'customName',
      rows: 1,
      dynamicHeightAdjustment: true,
      value: 'This is a controlled textarea, initially 1 row',
    });
    area.addEventListener('gd-input', (e) => (area.value = (e as CustomEvent<{ value: string }>).detail.value));
    area.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        area.value = '';
        area.requestUpdate();
      }
    });
    return area;
  },
  parameters: { docs: { description: { story: 'Controlled example: pressing Enter clears the textarea value.' } } },
};
export const MaxCharacters: Story = {
  args: { placeholder: 'Type up to 100 characters...', maxCharacters: 100 },
  parameters: {
    docs: { description: { story: 'Displays current/max character feedback and an error state when exceeded.' } },
  },
};
export const WithAccessibility: Story = {
  args: {
    name: 'comments',
    placeholder: 'Enter your comments here...',
    ariaDescribedBy: 'textarea-helper',
    'aria-label': 'Comments',
  } as never,
  render: (args) => {
    const label = document.createElement('label');
    label.textContent = 'Comments';
    const area = element('gd-textarea', args);
    label.append(area);
    return label;
  },
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('textarea'),
};
