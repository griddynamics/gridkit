import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSkeleton } from '../src';
import { element } from './helpers';

type Args = Pick<
  GdSkeleton,
  'variant' | 'width' | 'height' | 'backgroundColor' | 'animationName' | 'animationProps' | 'styles'
>;
const meta = {
  title: 'Atoms/Skeleton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A theme-aware animated loading placeholder with rounded, rectangular, and circular shapes, flexible dimensions, custom colors and animations, and slotted child content.',
      },
    },
  },
  args: { width: '250px', height: '15px', variant: 'rounded', animationName: 'blinkKeyframes' },
  argTypes: {
    variant: {
      description: 'Controls the shape of the skeleton.',
      control: 'select',
      options: ['rounded', 'rectangular', 'circular'],
    },
    width: { description: 'Sets the width using any valid CSS width.', control: 'text' },
    height: { description: 'Sets the height using any valid CSS height.', control: 'text' },
    backgroundColor: { description: 'A CSS color or GridKit theme/palette color path.', control: 'text' },
    animationName: {
      description: 'A theme animation token, raw CSS animation name, or null to disable animation.',
      control: 'text',
    },
    animationProps: { description: 'Animation duration, easing, delay, and iteration string.', control: 'text' },
    styles: { description: 'Custom CSS properties applied to the skeleton.', control: 'object' },
  },
  render: (args: Args) => element('gd-skeleton', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'The standard rounded skeleton for text-line placeholders.' } } },
};
export const Circular: Story = {
  args: { width: '80px', height: '80px', variant: 'circular' },
  parameters: { docs: { description: { story: 'A circular placeholder for avatars and icons.' } } },
};
export const Rectangular: Story = {
  args: { width: '250px', height: '125px', variant: 'rectangular' },
  parameters: { docs: { description: { story: 'A rectangular placeholder for images, cards, and video.' } } },
};
export const WithThemeColor: Story = {
  args: { width: '250px', height: '40px', variant: 'rectangular', backgroundColor: 'theme.palette.success.main' },
  parameters: { docs: { description: { story: 'Uses the top-level theme-aware backgroundColor property.' } } },
};
export const WithCustomAnimation: Story = {
  name: 'Animation with Tailwind Class',
  args: { width: '250px', height: '15px', animationName: null },
  parameters: {
    docs: { description: { story: 'Disables the built-in animation so a consumer class can supply one.' } },
  },
};
export const WithChildren: Story = {
  name: 'Skeleton with Child Content',
  render: (args) => element('gd-skeleton', { ...args, width: '250px', height: '50px' }, 'Loading Content...'),
  parameters: {
    docs: { description: { story: 'The default slot preserves child content inside the animated wrapper.' } },
  },
};
export const ComposedLayout: Story = {
  name: 'Example: Article Placeholder',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:grid;grid-template-columns:100px 1fr;gap:10px;max-width:480px';
    wrapper.append(element('gd-skeleton', { variant: 'circular', width: '100px', height: '100px' }));
    const lines = document.createElement('div');
    lines.style.cssText = 'display:grid;gap:10px';
    lines.append(element('gd-skeleton'), element('gd-skeleton'), element('gd-skeleton'));
    wrapper.append(lines);
    return wrapper;
  },
  parameters: { docs: { description: { story: 'Composes multiple skeletons as an article or profile placeholder.' } } },
};
export const WithAccessibility: Story = {
  args: { 'aria-label': 'Loading content' } as never,
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => {
    const pre = document.createElement('pre');
    pre.textContent = 'defaultTheme.skeleton';
    return pre;
  },
  parameters: { layout: 'padded' },
};
