import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdBox } from '../src';
import { defaultTokenViewer, element } from './helpers';

type Args = Pick<GdBox, 'variant' | 'isBordered' | 'isHighlighted' | 'withShadowHover'>;
const meta = {
  title: 'Atoms/Box',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layout container matching React Box orientation, border, hover highlight, shadow, accessibility, and custom style behavior.',
      },
    },
  },
  args: { variant: 'vertical', isBordered: false, isHighlighted: false, withShadowHover: false },
  argTypes: {
    variant: { description: 'Box orientation variant', control: 'select', options: ['vertical', 'horizontal'] },
    isBordered: { description: 'Adds a border to the box', control: 'boolean' },
    isHighlighted: { description: 'Adds the React hover outline treatment', control: 'boolean' },
    withShadowHover: { description: 'Adds the React elevation shadow on hover', control: 'boolean' },
  },
  render: (args: Args) => element('gd-box', args, 'Box content'),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Bordered: Story = { args: { isBordered: true } };
export const Highlighted: Story = { args: { isBordered: true, isHighlighted: true } };
export const WithShadowHover: Story = { args: { withShadowHover: true } };
export const VerticalLayout: Story = {};
export const HorizontalLayout: Story = { args: { variant: 'horizontal' } };
export const CenteredContent: Story = {
  render: (args) =>
    element(
      'gd-box',
      { ...args, styles: { width: '240px', height: '120px', alignItems: 'center', justifyContent: 'center' } },
      'Centered content'
    ),
};
export const Examples: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.cssText = 'display:grid;gap:16px';
    root.append(
      element('gd-box', { isBordered: true }, 'Bordered'),
      element('gd-box', { variant: 'horizontal', withShadowHover: true }, 'Horizontal hover')
    );
    return root;
  },
};
export const WithAccessibility: Story = {
  render: (args) => {
    const box = element('gd-box', args, 'Keyboard-focusable box');
    box.tabIndex = 0;
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Example box');
    return box;
  },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('box'),
};
