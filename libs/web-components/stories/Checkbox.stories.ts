import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdCheckbox } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes, stack } from './helpers';

type Args = Partial<Pick<GdCheckbox, 'checked' | 'disabled' | 'indeterminate' | 'size' | 'name' | 'value'>> & {
  children: string;
};
const meta = {
  title: 'Atoms/Checkbox',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox with controlled, indeterminate, disabled, size, native form, and change-event behavior.',
      },
    },
  },
  args: { children: 'Accept terms' },
  argTypes: sectionedArgTypes('Checkbox', {}),
  render: ({ children, ...args }: Args) => element('gd-checkbox', args, children),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Controlled: Story = {
  render: () => {
    const state = element('gd-typography', {}, 'Current state: Unchecked');
    const checkbox = element('gd-checkbox', { checked: false }, 'Controlled Checkbox');
    checkbox.addEventListener('gd-change', (event) => {
      checkbox.checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
      state.textContent = `Current state: ${checkbox.checked ? 'Checked' : 'Unchecked'}`;
    });
    return stack('column', '16px', state, checkbox);
  },
};
export const Indeterminate: Story = { args: { indeterminate: true, children: 'Select all' } };
export const Disabled: Story = {
  render: () =>
    stack(
      'column',
      '16px',
      element('gd-checkbox', { disabled: true }, 'Disabled unchecked'),
      element('gd-checkbox', { disabled: true, checked: true }, 'Disabled checked'),
      element('gd-checkbox', { disabled: true, indeterminate: true }, 'Disabled indeterminate')
    ),
};
export const Sizes: Story = {
  render: () =>
    stack(
      'row',
      '24px',
      element('gd-checkbox', { size: 'sm' }, 'Small checkbox'),
      element('gd-checkbox', { size: 'md' }, 'Medium checkbox')
    ),
};
export const DefaultTokens: Story = { parameters: { layout: 'padded' }, render: () => defaultTokenViewer('checkbox') };
