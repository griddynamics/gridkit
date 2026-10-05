import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSeparator } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Pick<
  GdSeparator,
  'orientation' | 'length' | 'color' | 'size' | 'variant' | 'as' | 'label' | 'labelPosition' | 'labelColor' | 'styles'
>;
const meta = {
  title: 'Atoms/Separator',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A token-backed visual divider with horizontal and vertical layouts, solid/dashed/dotted lines, optional positioned labels, semantic internal elements, custom lengths and theme-aware colors.',
      },
    },
  },
  args: { orientation: 'horizontal', size: 'sm', variant: 'solid', as: 'div', labelPosition: 'center' },
  argTypes: sectionedArgTypes('Separator', {
    orientation: {
      description: 'The orientation of the separator.',
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    styles: { description: 'Custom styles for the separator.', control: 'object' },
    length: { description: 'The length of the separator, such as 100px or 50%.', control: 'text' },
    color: { description: 'A CSS color or GridKit theme color path for the line.', control: 'text' },
    size: {
      description: 'The thickness and label size.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    variant: { description: 'The line style.', control: 'select', options: ['solid', 'dashed', 'dotted'] },
    as: {
      description: 'The internal semantic element used for the wrapper and line segments.',
      control: 'select',
      options: ['div', 'hr', 'span'],
    },
    label: { description: 'Text displayed within the separator.', control: 'text' },
    labelPosition: {
      description: 'The label position when present.',
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    labelColor: { description: 'A CSS color or GridKit theme color path for the label.', control: 'text' },
  }),
  render: (args: Args) => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '300px';
    wrapper.append(element('gd-separator', args));
    return wrapper;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const WithCustomColor: Story = { args: { color: 'brand.500' } };
export const WithDifferentVariants: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:400px;display:grid;gap:20px';
    for (const variant of ['solid', 'dashed', 'dotted'] as const)
      wrapper.append(element('gd-separator', { size: 'md', variant }));
    return wrapper;
  },
};
export const WithLabel: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:400px;display:grid;gap:20px';
    wrapper.append(
      element('gd-separator', { size: 'md', label: 'Label', labelPosition: 'start' }),
      element('gd-separator', { size: 'md', label: 'Label', labelColor: 'brand.500' }),
      element('gd-separator', { size: 'md', label: 'Label', labelPosition: 'end' })
    );
    return wrapper;
  },
};
function cardExample(index: number) {
  const card = element('gd-box', { isBordered: true, styles: { padding: '20px' } });
  card.append(
    element('gd-typography', { variant: 'h5', styles: { margin: '0', padding: '0' } }, `Title ${index}`),
    element('gd-typography', { variant: 'p', styles: { margin: '0', padding: '0' } }, `Description ${index}`)
  );
  return card;
}
export const Vertical: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;gap:20px;align-items:center';
    wrapper.append(
      cardExample(1),
      element('gd-separator', { size: 'md', length: '200px', variant: 'solid', orientation: 'vertical' }),
      cardExample(2)
    );
    return wrapper;
  },
};
export const VerticalWithLabel: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;gap:20px;align-items:center';
    wrapper.append(
      cardExample(1),
      element('gd-separator', { size: 'md', length: '200px', variant: 'solid', orientation: 'vertical', label: 'Or' }),
      cardExample(2)
    );
    return wrapper;
  },
};
export const WithAccessibility: Story = {
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('separator'),
  parameters: { layout: 'padded' },
};
