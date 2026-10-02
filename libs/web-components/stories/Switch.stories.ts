import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSwitch } from '../src';
import { defaultTokenViewer, element, stack, sectionedArgTypes } from './helpers';

type Args = Pick<GdSwitch, 'checked' | 'disabled' | 'isLoading' | 'label' | 'name' | 'styles'> & { children: string };
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
  args: { name: 'switch', checked: false, disabled: false, isLoading: false, label: 'right', children: 'Label' },
  argTypes: sectionedArgTypes('Switch', {
    checked: { description: 'Checked state', control: 'boolean' },
    disabled: { description: 'Disables interaction', control: 'boolean' },
    isLoading: { description: 'Shows a loader and disables interaction', control: 'boolean' },
    label: { description: 'Position of the slotted label', control: 'select', options: ['left', 'right'] },
    name: { description: 'Native checkbox name', control: 'text' },
    styles: { description: 'Custom wrapper styles', control: 'object' },
  }),
  render: ({ children, ...args }: Args) => element('gd-switch', args, children),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LabelLeft: Story = {
  args: { label: 'left', children: 'Label on the left' },
};
function controlledSwitch(delay: number, withLoading = false) {
  const state = element('gd-typography', {}, 'Current state: OFF');
  const loading = element('gd-typography', {}, 'Loading: No');
  const control = element(
    'gd-switch',
    { checked: false },
    withLoading ? 'Switch with Loading State (3 seconds)' : 'Controlled Switch, with 1.5 seconds delay'
  );
  let checked = false;
  control.addEventListener('gd-change', (event) => {
    const next = (event as CustomEvent<{ checked: boolean }>).detail.checked;
    control.checked = checked;
    if (withLoading) {
      control.isLoading = true;
      loading.textContent = 'Loading: Yes (3 seconds)';
    }
    setTimeout(() => {
      if (!control.isConnected) return;
      checked = next;
      control.checked = next;
      control.isLoading = false;
      state.textContent = `Current state: ${next ? 'ON' : 'OFF'}`;
      loading.textContent = 'Loading: No';
    }, delay);
  });
  return stack('column', '16px', state, ...(withLoading ? [loading] : []), control);
}
export const Controlled: Story = { render: () => controlledSwitch(1500) };
export const Uncontrolled: Story = {
  render: () =>
    stack(
      'column',
      '16px',
      element(
        'gd-typography',
        {},
        'Uncontrolled Switch - state is managed internally. Check the Actions panel to see onChange events.'
      ),
      element('gd-switch', {}, 'Uncontrolled Switch')
    ),
};
export const WithLoading: Story = { render: () => controlledSwitch(3000, true) };
export const WithAccessibility: Story = {
  args: { name: 'notifications', children: 'Enable notifications' },
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('switch', 'switchToken'),
};
