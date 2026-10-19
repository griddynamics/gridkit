import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdButton } from '../src';
import { defaultTokenViewer, element } from './helpers';

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
  parameters: {
    docs: {
      description: {
        component:
          'Button with variants, icons, loading, width, rounding, disabled states, custom styling, and accessibility options.',
      },
    },
  },
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
const Disabled: Story = { args: { disabled: true } };
const Loading: Story = { args: { isLoading: true } };
export const AllVariants: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    for (const variant of variants) row.append(element('gd-button', { ...args, variant }, variant));
    return row;
  },
};
const Rounded: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    for (const rounded of roundedOptions) row.append(element('gd-button', { ...args, rounded }, rounded));
    return row;
  },
};
const FullWidth: Story = { args: { fullWidth: true, label: 'Full-width action' } };
export const IconOnly: Story = { args: { isIcon: true, ariaLabel: 'Add item', label: '+' } };
const IconSlots: Story = {
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
export const WithIcons: Story = IconSlots;
export const FullWidthButton: Story = FullWidth;
export const RoundedButton: Story = Rounded;
export const DisabledButton: Story = Disabled;
export const ButtonStatesUsingClass: Story = { args: { ariaPressed: 'true', label: 'Pressed state' } };
export const CustomStyledButton: Story = {
  render: (args) => element('gd-button', { ...args, styles: { letterSpacing: '0.08em' } }, 'Custom styled'),
};
export const RealWorldExamples: Story = AllVariants;
export const IsLoading: Story = Loading;
export const WithAccessibility: Story = { args: { ariaLabel: 'Save changes', label: 'Save' } };
export const DefaultTokens: Story = { render: () => defaultTokenViewer('button') };
