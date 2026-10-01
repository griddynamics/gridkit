import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { iconCatalog, type GridKitIconName } from 'gd-design-core';
import type { GdIcon } from '../src';
import { defaultTokenViewer, element } from './helpers';

type Args = Pick<GdIcon, 'name' | 'size' | 'fill'>;
const names = Object.keys(iconCatalog) as GridKitIconName[];
const meta = {
  title: 'Atoms/Icon',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The same built-in SVG icon catalog used by React Icon. Supports theme sizes, exact dimensions, path and SVG fills, native click events, and accessible names.',
      },
    },
  },
  args: { name: 'star', size: 'md', fill: 'currentColor' },
  argTypes: {
    name: { description: 'Icon name from the shared React/Web Components catalog', control: 'select', options: names },
    size: {
      description: 'Theme size applied to width and height',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    fill: { description: 'Path fill or theme color token', control: 'color' },
  },
  render: (args: Args) => element('gd-icon', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const WithDefinedSize: Story = { args: { size: 'xl' } };
export const AllIcons: Story = {
  name: 'Icons Library',
  render: () => {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:16px';
    for (const name of names) {
      const item = document.createElement('label');
      item.append(element('gd-icon', { name, size: 'lg' }), document.createTextNode(name));
      grid.append(item);
    }
    return grid;
  },
};
export const RegisteringCustomIcons: Story = {
  name: 'Registering a Custom Icon',
  parameters: {
    docs: {
      description: {
        story:
          'Built-in icons use the shared catalog. Application-specific SVGs should be registered in that catalog generator so React and Web Components retain one source.',
      },
    },
  },
  args: { name: 'star' },
};
export const WithAccessibility: Story = {
  render: (args) => {
    const icon = element('gd-icon', args);
    icon.setAttribute('aria-label', 'Favorite');
    return icon;
  },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('icon'),
};
