import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdLink } from '../src';
import { element } from './helpers';

type Args = Pick<
  GdLink,
  'variant' | 'size' | 'underline' | 'color' | 'cursor' | 'disabled' | 'href' | 'target' | 'rel' | 'styles'
>;
const meta = {
  title: 'Atoms/Link',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native anchor matching React Link variants, sizes, underline modes, colors, cursor, disabled behavior, targets, relationships, custom styles, accessibility, and child composition.',
      },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    underline: 'default',
    disabled: false,
    href: 'https://example.com',
    target: undefined,
    rel: '',
  },
  argTypes: {
    variant: {
      description: 'Design variant',
      control: 'select',
      options: ['primary', 'secondary', 'inverted', 'inherit'],
    },
    size: { description: 'Link typography size', control: 'select', options: ['sm', 'md', 'lg'] },
    underline: { description: 'Underline presentation', control: 'select', options: ['default', 'highlight', 'none'] },
    color: { description: 'CSS color or theme color token', control: 'text' },
    cursor: { description: 'CSS cursor', control: 'text' },
    disabled: { description: 'Prevents navigation and applies disabled styling', control: 'boolean' },
    href: { description: 'Navigation URL', control: 'text' },
    target: { description: 'Browsing context target', control: 'text' },
    rel: { description: 'Anchor relationship attribute', control: 'text' },
    styles: { description: 'Custom inline style overrides', control: 'object' },
  },
  render: (args: Args) => element('gd-link', args, 'GridKit link'),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Variants: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const WithUnderline: Story = { args: { underline: 'highlight' } };
export const WithSizes: Story = { args: { size: 'lg' } };
export const TargetBlankVisited: Story = {
  args: {
    variant: 'inherit',
    href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};
export const InheritWithButtonAsChild: Story = {
  render: (args) => {
    const link = element('gd-link', { ...args, variant: 'inherit' });
    link.append(element('gd-button', { variant: 'primary' }, 'Button child'));
    return link;
  },
};
export const Inverted: Story = { args: { variant: 'inverted' } };
export const InheritWithTypographyAsChild: Story = {
  render: (args) => {
    const link = element('gd-link', { ...args, variant: 'inherit' });
    link.append(element('gd-typography', { variant: 'p' }, 'Typography child'));
    return link;
  },
};
export const InheritWithTailwind: Story = {
  args: { variant: 'inherit', styles: { fontWeight: 700, textTransform: 'uppercase' } },
  parameters: {
    docs: { description: { story: 'Framework-neutral style properties reproduce the React utility-class example.' } },
  },
};
export const CustomStyles: Story = { args: { styles: { color: '#7b2cbf', letterSpacing: '0.08em' } } };
export const WithAccessibility: Story = {
  render: (args) => {
    const link = element('gd-link', args, 'Read the accessibility guide');
    link.setAttribute('aria-label', 'Read the accessibility guide');
    return link;
  },
};
export const DefaultTokens: Story = {
  render: () => {
    const pre = document.createElement('pre');
    pre.textContent = 'defaultTheme.link';
    return pre;
  },
};
