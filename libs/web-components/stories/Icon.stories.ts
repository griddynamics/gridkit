import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { iconCatalog, registerCustomIcons, type GridKitIconName } from 'gd-design-core';
import type { GdIcon } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<GdIcon, 'name' | 'size' | 'fill'>;
const names = Object.keys(iconCatalog) as GridKitIconName[];
const meta = {
  title: 'Atoms/Icon',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'SVG icons with built-in names, theme sizes, exact dimensions, path and SVG fills, native click events, accessible names, and runtime registration for application-owned icons.',
      },
    },
  },
  args: { name: 'star', size: 'md', fill: 'currentColor' },
  argTypes: sectionedArgTypes('Icon', {
    name: { description: 'Registered icon name', control: 'select', options: names },
    size: {
      description: 'Theme size applied to width and height',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    fill: { description: 'Path fill or theme color token', control: 'color' },
  }),
  render: (args: Args) => element('gd-icon', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const WithDefinedSize: Story = { args: { size: 'xl' } };
export const AllIcons: Story = {
  name: 'Icons Library',
  render: () => {
    const container = document.createElement('div');
    container.className = 'icon-library';
    container.style.cssText = 'display:flex;min-width:480px;max-width:800px;width:100%';
    const grid = document.createElement('div');
    grid.className = 'icon-library-grid';
    grid.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;width:100%';
    for (const name of names) {
      const item = document.createElement('div');
      item.className = 'icon-library-item';
      item.style.cssText =
        'display:flex;flex-direction:column;flex-wrap:wrap;align-items:center;justify-content:flex-start;min-width:80px;max-width:100%;gap:10px;margin-bottom:10px;padding:5px;box-sizing:border-box';
      item.append(
        element('gd-icon', { name, size: 'md' }),
        element('gd-typography', { variant: 'small', as: 'small' }, name)
      );
      grid.append(item);
    }
    container.append(grid);
    return container;
  },
  parameters: {
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        story:
          'Browse every built-in icon with its registered name. Each icon uses the standard medium size and can be copied by name into component properties or markup.',
      },
    },
  },
};
export const RegisteringCustomIcons: Story = {
  name: 'Registering a Custom Icon',
  args: { name: 'projectOrbit', size: 'lg', fill: '#0069b4' },
  argTypes: { name: { control: 'select', options: [...names, 'projectOrbit'] } },
  render: (args) => {
    registerCustomIcons({
      projectOrbit: {
        viewBox: '0 0 24 24',
        body: '<circle cx="12" cy="12" r="3" fill="var(--gd-icon-fill)"></circle><path d="M4.5 12c0-3.1 3.4-5.5 7.5-5.5s7.5 2.4 7.5 5.5-3.4 5.5-7.5 5.5S4.5 15.1 4.5 12Z" fill="none" stroke="var(--gd-icon-fill)" stroke-width="1.5" transform="rotate(-25 12 12)"></path>',
      },
    });
    return element('gd-icon', args);
  },
  parameters: {
    docs: {
      description: {
        story: 'Register an application-owned SVG definition once, then render it by name anywhere in the application.',
      },
      source: {
        language: 'html',
        code: `<!-- Render after registration -->
<gd-icon name="projectOrbit" size="lg" fill="#0069b4"></gd-icon>

<script type="module">
  import { registerCustomIcons } from 'web-components';

  registerCustomIcons({
    projectOrbit: {
      viewBox: '0 0 24 24',
      body: '<circle cx="12" cy="12" r="3" fill="var(--gd-icon-fill)"></circle><path d="M4.5 12c0-3.1 3.4-5.5 7.5-5.5s7.5 2.4 7.5 5.5-3.4 5.5-7.5 5.5S4.5 15.1 4.5 12Z" fill="none" stroke="var(--gd-icon-fill)" stroke-width="1.5" transform="rotate(-25 12 12)"></path>',
    },
  });
</script>`,
      },
    },
  },
};
export const WithAccessibility: Story = {
  render: AllIcons.render,
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('icon'),
};
