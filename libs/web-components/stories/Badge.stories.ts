import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdBadge, GdIcon } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<GdBadge, 'variant' | 'appearance' | 'size' | 'disabled'>;
const meta = {
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Status badge matching React Badge variants, appearances, sizes, disabled state, icon positions, and Box style overrides.',
      },
    },
  },
  args: { variant: 'primary', appearance: 'filled', size: 'md', disabled: false },
  argTypes: sectionedArgTypes('Badge', {
    variant: {
      description: 'Visual style variant of the badge',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'],
    },
    appearance: {
      description: 'Filled, light-filled, outline, or light-filled outline appearance',
      control: 'select',
      options: ['filled', 'filledLight', 'outline', 'outlineFilledLight'],
    },
    size: { description: 'Badge size', control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    disabled: { description: 'Whether the badge uses disabled styling', control: 'boolean' },
  }),
  render: (args: Args) => element('gd-badge', args, 'Badge'),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Sizes: Story = { args: { size: 'lg' } };
export const Variants: Story = { args: { variant: 'tertiary' } };
export const WithIcons: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:16px;align-items:center;flex-wrap:wrap';

    const withIcons = (
      text: string,
      options: Partial<GdBadge> & { iconStart?: GdIcon['name']; iconEnd?: GdIcon['name'] } = {}
    ) => {
      const { iconStart, iconEnd, ...badgeProps } = options;
      const badge = element('gd-badge', badgeProps, text);
      const appendIcon = (name: GdIcon['name'], slot: 'icon-start' | 'icon-end') => {
        const icon = element('gd-icon', { name, size: 'md' });
        icon.slot = slot;
        badge.append(icon);
      };
      if (iconStart) appendIcon(iconStart, 'icon-start');
      if (iconEnd) appendIcon(iconEnd, 'icon-end');
      return badge;
    };

    row.append(
      withIcons('With Start Icon', { iconStart: 'success' }),
      withIcons('With End Icon', { variant: 'secondary', iconEnd: 'warning' }),
      withIcons('Both Icons', {
        variant: 'tertiary',
        appearance: 'filled',
        iconStart: 'info',
        iconEnd: 'arrowRight',
      }),
      withIcons('Quaternary with Icon', { variant: 'quaternary', iconStart: 'error' }),
      withIcons('Quinary with Icon', { variant: 'quinary', iconStart: 'accountCircle' })
    );
    return row;
  },
  parameters: { docs: { description: { story: 'Badges with start and end icons.' } } },
};
export const Disabled: Story = { args: { disabled: true } };
export const WithBoxStyles: Story = {
  render: (args) => element('gd-badge', { ...args, styles: { margin: '12px', minWidth: '140px' } }, 'Custom styles'),
};
export const WithAccessibility: Story = {
  render: (args) => {
    const badge = element('gd-badge', args, '3 unread messages');
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-label', '3 unread messages');
    return badge;
  },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('badge'),
};
