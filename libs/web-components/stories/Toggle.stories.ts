import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GridKitIconName } from 'gd-design-core';
import type { GdToggle } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<GdToggle, 'items' | 'value' | 'disabled' | 'renderItemContent' | 'styles'>;
const items = ['Option 1', 'Option 2', 'Option 3'];
const meta = {
  title: 'Atoms/Toggle',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A token-backed option group that composes GridKit buttons, supports string and object items, controlled selection, custom item rendering, disabled state, and gd-change events.',
      },
    },
  },
  args: { items, value: 'Option 1', disabled: false },
  argTypes: sectionedArgTypes('Toggle', {
    items: { description: 'String or label/value items', control: 'object' },
    value: { description: 'Selected item value', control: 'text' },
    disabled: { description: 'Disables all options', control: 'boolean' },
    renderItemContent: { description: 'Optional item render function', control: false },
    styles: { description: 'Custom group styles', control: 'object' },
  }),
  render: (args: Args) => element('gd-toggle', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const WithCustomRender: Story = {
  args: {
    items: [
      { label: 'Fire', value: 'home' },
      { label: 'Water', value: 'accountCircle' },
      { label: 'Earth', value: 'success' },
    ],
    value: 'fire',
    renderItemContent: (item) =>
      typeof item === 'string'
        ? item
        : element('gd-icon', {
            name: (item as { value: GridKitIconName }).value,
          }),
  },
  parameters: { docs: { description: { story: 'Object items can supply values and consumer-rendered content.' } } },
};
export const WithAccessibility: Story = {
  render: (args) => {
    const root = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = 'Select an option:';
    label.htmlFor = 'toggle-group';
    label.style.cssText = 'display:block;margin-bottom:10px;font-weight:bold';
    const group = document.createElement('div');
    group.id = 'toggle-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Toggle options');
    group.append(element('gd-toggle', args));
    root.append(label, group);
    return root;
  },
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('switchToggle'),
};
