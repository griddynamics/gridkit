import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdButton } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

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
  | 'styles'
> & { children: string };
const variants = ['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit'] as const;
const roundedOptions = ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
const buttonElement = ({ children, ...props }: Args, text = children) => element('gd-button', props, text);
const meta = {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Button matching React variants, icons, loading, width, rounding, disabled, custom styling, states, and accessibility.',
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
    children: 'Button',
  },
  argTypes: sectionedArgTypes('Button', {
    variant: { control: 'select', options: variants },
    rounded: { control: 'select', options: roundedOptions },
  }),
  render: (args: Args) => buttonElement(args),
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
    for (const variant of variants) row.append(buttonElement({ ...args, variant }, variant));
    return row;
  },
};
export const Rounded: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    for (const rounded of roundedOptions) row.append(buttonElement({ ...args, rounded }, rounded));
    return row;
  },
};
export const FullWidth: Story = { args: { fullWidth: true, children: 'Full-width action' } };
export const IconOnly: Story = {
  render: (args) => {
    const button = buttonElement({ ...args, isIcon: true, ariaLabel: 'Close' }, '');
    const icon = element('gd-icon', { name: 'cross' });
    icon.slot = 'icon-start';
    button.append(icon);
    return button;
  },
};
export const WithIcons: Story = {
  render: (args) => {
    const button = buttonElement({ ...args, variant: 'primary' }, 'Save Changes');
    const start = element('gd-icon', { name: 'check' });
    start.slot = 'icon-start';
    const end = element('gd-icon', { name: 'arrowRight' });
    end.slot = 'icon-end';
    button.append(start, end);
    return button;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Buttons can include catalog-backed gd-icon elements in the icon-start and icon-end slots for visual context.',
      },
    },
  },
};
export const IconSlots: Story = WithIcons;
export const FullWidthButton: Story = FullWidth;
export const RoundedButton: Story = Rounded;
export const DisabledButton: Story = Disabled;
export const ButtonStatesUsingClass: Story = { args: { ariaPressed: 'true', children: 'Pressed state' } };
export const CustomStyledButton: Story = {
  render: (args) => buttonElement({ ...args, styles: { letterSpacing: '0.08em' } }, 'Custom styled'),
};
export const RealWorldExamples: Story = AllVariants;
export const IsLoading: Story = Loading;
export const WithAccessibility: Story = { args: { ariaLabel: 'Save changes', children: 'Save' } };
export const DefaultTokens: Story = { render: () => defaultTokenViewer('button') };
