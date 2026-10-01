import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdAvatar } from '../src';
import { element, portrait } from './helpers';

type Args = Pick<GdAvatar, 'src' | 'alt' | 'fallback' | 'size' | 'withBadge' | 'badgeColor' | 'backgroundColor'>;
const meta = {
  title: 'Atoms/Avatar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatar matching the React image, fallback initials or icon, badge, color, size, and accessibility states.',
      },
    },
  },
  args: {
    src: '',
    alt: 'Ada Lovelace',
    fallback: 'AL',
    size: 'md',
    withBadge: false,
    badgeColor: 'bg.fill.success.primary.default',
    backgroundColor: undefined,
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] },
    badgeColor: { control: 'color' },
    backgroundColor: { control: 'color' },
  },
  render: (args: Args) => element('gd-avatar', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Image: Story = { args: { src: portrait } };
export const Badge: Story = { args: { withBadge: true, size: 'xl' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const AllSizes: Story = {
  render: (args) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:16px;align-items:center';
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const)
      row.append(element('gd-avatar', { ...args, size, alt: `${size} avatar` }));
    return row;
  },
};
export const CustomColors: Story = { args: { withBadge: true, backgroundColor: '#6b46c1', badgeColor: '#22c55e' } };
export const SlottedFallback: Story = {
  render: () => {
    const avatar = element('gd-avatar', { alt: 'Custom fallback', size: 'sm' });
    const fallback = document.createElement('span');
    fallback.slot = 'fallback';
    fallback.textContent = '★';
    avatar.append(fallback);
    return avatar;
  },
};
export const WithBadge: Story = { args: { withBadge: true } };
export const WithCustomBadgeColor: Story = { args: { withBadge: true, badgeColor: '#22c55e' } };
export const WithInitials: Story = { args: { src: '', fallback: 'AL' } };
export const WithCustomBackgroundColor: Story = { args: { src: '', fallback: 'AL', backgroundColor: '#6b46c1' } };
export const WithIcon: Story = SlottedFallback;
export const WithImageAndFallback: Story = { args: { src: portrait, fallback: 'AL' } };
export const WithDifferentSize: Story = AllSizes;
export const WithAccessibility: Story = { args: { alt: 'Ada Lovelace profile photo' } };
export const DefaultTokens: Story = { render: () => document.createElement('pre') };
