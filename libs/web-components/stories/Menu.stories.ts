import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdMenu } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdMenu, 'open' | 'closeOnSelect' | 'placement' | 'offsetX' | 'offsetY' | 'minHeight' | 'maxHeight'>;
const placements = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const meta = {
  title: 'Molecules/Menu',
  tags: ['autodocs'],
  args: {
    open: false,
    closeOnSelect: true,
    placement: 'bottom-right',
    offsetX: 4,
    offsetY: 4,
    minHeight: 80,
    maxHeight: 400,
  },
  argTypes: { placement: { control: 'select', options: placements } },
  render: (args: Args) => {
    const menu = element('gd-menu', args);
    const trigger = document.createElement('span');
    trigger.slot = 'trigger';
    trigger.textContent = 'Actions';
    const content = document.createElement('div');
    content.slot = 'content';
    content.style.cssText = 'display:grid;gap:8px;padding:12px';
    for (const name of ['Edit', 'Archive']) {
      const button = document.createElement('button');
      button.textContent = name;
      button.dataset.gdMenuName = name;
      button.dataset.gdMenuValue = name.toLowerCase();
      content.append(button);
    }
    menu.append(trigger, content);
    const section = observed(menu, 'gd-change', null);
    const outside = document.createElement('button');
    outside.textContent = 'Outside menu';
    section.append(outside);
    return section;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
export const KeepOpenOnSelect: Story = { args: { closeOnSelect: false } };
export const Placement: Story = {
  render: (args) => {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,180px);gap:120px;padding:120px';
    for (const placement of placements) {
      const menu = element('gd-menu', { ...args, placement });
      const trigger = document.createElement('span');
      trigger.slot = 'trigger';
      trigger.textContent = placement;
      const content = document.createElement('div');
      content.slot = 'content';
      content.style.padding = '12px';
      content.textContent = `${placement} content`;
      menu.append(trigger, content);
      grid.append(menu);
    }
    return grid;
  },
};
export const WithOffset: Story = { args: { offsetX: 20, offsetY: 16 } };
export const WithHeightConstraints: Story = { args: { minHeight: 120, maxHeight: 160 } };
