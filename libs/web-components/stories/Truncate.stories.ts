import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdTruncate } from '../src';
import { element, sectionedArgTypes } from './helpers';

type Args = Pick<GdTruncate, 'lines' | 'styles'> & { children: string };
const long =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const meta = {
  title: 'Atoms/Truncate',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A token-backed line-clamp wrapper with slotted content, configurable line count, custom styles, responsive overflow measurement, and an isTruncated API.',
      },
    },
  },
  args: { lines: 1, children: long },
  argTypes: sectionedArgTypes('Truncate', {
    children: { description: 'Text or slotted content to display', control: 'text' },
    lines: { description: 'Maximum visible line count', control: 'number' },
    styles: { description: 'Custom content styles', control: 'object' },
  }),
  render: ({ children, ...args }: Args) => {
    const box = document.createElement('div');
    box.style.width = '240px';
    box.append(element('gd-truncate', args, children));
    return box;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {
  parameters: { docs: { description: { story: 'One-line truncation within a constrained container.' } } },
};
export const LineTruncation: Story = {
  args: { lines: 2, children: 'This is a very long text that will wrap to multiple lines' },
  parameters: { docs: { description: { story: 'CSS line-clamp limits content to two lines.' } } },
};
export const WithCustomStyling: Story = {
  args: {
    styles: { color: '#dc2626', fontWeight: 600, fontSize: '18px' },
    children: 'This text has custom styling applied via the styles property.',
  },
};
export const RefAPIWithTooltipOnOverflow: Story = {
  render: () => {
    const section = document.createElement('section');
    section.style.width = '220px';
    const output = document.createElement('output');
    const value = element(
      'gd-truncate',
      { lines: 1 },
      '(Resize window): Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );
    const update = () => (output.textContent = `isTruncated: ${value.isTruncated}`);
    new ResizeObserver(update).observe(value);
    setTimeout(update);
    section.append(value, output);
    return section;
  },
  parameters: {
    docs: { description: { story: 'The isTruncated property exposes measured overflow for tooltip decisions.' } },
  },
};
export const WithAccessibility: Story = {
  args: { 'aria-label': 'Truncated summary' } as never,
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
