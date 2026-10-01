import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdCheckbox } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdCheckbox, 'checked' | 'disabled' | 'indeterminate' | 'size' | 'name' | 'value' | 'required'>;
const meta = {
  title: 'Atoms/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox matching React controlled, indeterminate, disabled, size, native form, and change-event behavior.',
      },
    },
  },
  args: { checked: false, disabled: false, indeterminate: false, size: 'md', name: '', value: 'on', required: false },
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
  render: (args: Args) => {
    const checkbox = element('gd-checkbox', args, 'Accept terms');
    checkbox.addEventListener('gd-change', (event) => {
      checkbox.checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
    });
    return observed(checkbox, 'gd-change', { checked: args.checked });
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { checked: true, disabled: true } };
export const Sizes: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:20px;align-items:center';
    row.append(element('gd-checkbox', { ...args, size: 'sm' }, 'Small'));
    row.append(element('gd-checkbox', { ...args, size: 'md' }, 'Medium'));
    return row;
  },
};
export const Controlled: Story = Checked;
export const DefaultTokens: Story = { render: () => document.createElement('pre') };
