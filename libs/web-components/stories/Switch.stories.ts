import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSwitch } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdSwitch, 'checked' | 'disabled' | 'isLoading' | 'label' | 'name' | 'styles'>;
const meta = {
  title: 'Atoms/Switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible token-backed on/off control with label placement, checked, disabled and loading states, slotted label content, and gd-change events.',
      },
    },
  },
  args: { name: 'switch', checked: false, disabled: false, isLoading: false, label: 'right' },
  argTypes: {
    checked: { description: 'Checked state', control: 'boolean' },
    disabled: { description: 'Disables interaction', control: 'boolean' },
    isLoading: { description: 'Shows a loader and disables interaction', control: 'boolean' },
    label: { description: 'Position of the slotted label', control: 'select', options: ['left', 'right'] },
    name: { description: 'Native checkbox name', control: 'text' },
    styles: { description: 'Custom wrapper styles', control: 'object' },
  },
  render: (args: Args) => observed(element('gd-switch', args, 'Label'), 'gd-change', { checked: args.checked }),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LabelLeft: Story = {
  args: { label: 'left' },
  render: (args) => element('gd-switch', args, 'Label on the left'),
};
export const Controlled: Story = {
  render: () => {
    const sw = element('gd-switch', { checked: false }, 'Controlled Switch, with 1.5 seconds delay');
    sw.addEventListener('gd-change', (e) =>
      setTimeout(() => (sw.checked = (e as CustomEvent<{ checked: boolean }>).detail.checked), 1500)
    );
    return observed(sw, 'gd-change', { checked: false });
  },
  parameters: { docs: { description: { story: 'Controlled state is written back externally after a delay.' } } },
};
export const Uncontrolled: Story = {
  render: () => observed(element('gd-switch', {}, 'Uncontrolled Switch'), 'gd-change', { checked: false }),
  parameters: { docs: { description: { story: 'The element manages its checked state and emits each change.' } } },
};
export const WithLoading: Story = {
  args: { isLoading: true },
  render: (args) => element('gd-switch', args, 'Switch with Loading State (3 seconds)'),
  parameters: { docs: { description: { story: 'Loading composes gd-loader and disables the native checkbox.' } } },
};
export const WithAccessibility: Story = {
  args: { name: 'notifications' },
  render: (args) => element('gd-switch', args, 'Enable notifications'),
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => {
    const pre = document.createElement('pre');
    pre.textContent = 'defaultTheme.switchToken';
    return pre;
  },
};
