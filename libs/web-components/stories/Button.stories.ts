import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdButton } from '../src';
import { element } from './helpers';

type Args = Pick<
  GdButton,
  | 'variant'
  | 'rounded'
  | 'disabled'
  | 'isLoading'
  | 'isIcon'
  | 'fullWidth'
  | 'type'
  | 'role'
  | 'tabIndex'
  | 'ariaLabel'
  | 'ariaPressed'
> & { label: string };
const variants = ['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit'] as const;
const roundedOptions = ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
const meta = {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    rounded: 'none',
    disabled: false,
    isLoading: false,
    isIcon: false,
    fullWidth: false,
    type: 'button',
    role: 'button',
    tabIndex: 0,
    ariaLabel: null,
    ariaPressed: null,
    label: 'Button',
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    rounded: { control: 'select', options: roundedOptions },
  },
  render: ({ label, ...props }: Args) => element('gd-button', props, label),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { isLoading: true } };
export const AllVariants: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    for (const variant of variants) row.append(element('gd-button', { ...args, variant }, variant));
    return row;
  },
};
export const Rounded: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    for (const rounded of roundedOptions) row.append(element('gd-button', { ...args, rounded }, rounded));
    return row;
  },
};
export const FullWidth: Story = { args: { fullWidth: true, label: 'Full-width action' } };
export const IconOnly: Story = { args: { isIcon: true, ariaLabel: 'Add item', label: '+' } };
export const IconSlots: Story = {
  render: (args) => {
    const button = element('gd-button', args, 'Continue');
    const icon = document.createElement('span');
    icon.slot = 'icon-end';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '→';
    button.append(icon);
    return button;
  },
};
