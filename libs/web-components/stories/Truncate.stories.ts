import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdTruncate } from '../src';
import { element, sectionedArgTypes } from './helpers';

type Args = Pick<GdTruncate, 'lines' | 'styles'> & { children: string };
const long =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
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
    const box = element('gd-box', { styles: { width: '50%', margin: '0 auto' } });
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
  args: { lines: 2, children: 'This is a very long text that will wrap to multiple ' },
  parameters: { docs: { description: { story: 'CSS line-clamp limits content to two lines.' } } },
};
export const WithCustomStyling: Story = {
  args: {
    styles: { color: '#dc2626', fontWeight: 600, fontSize: '18px' },
    children:
      'This text has custom styling applied via the styles prop. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
};
export const RefAPIWithTooltipOnOverflow: Story = {
  render: () => {
    const section = element('gd-box', { styles: { width: '100%', margin: '0 auto' } });
    const value = element(
      'gd-truncate',
      { lines: 1 },
      '(Resize window): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt'
    );
    const stateBox = element('gd-box', {
      styles: { padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' },
    });
    const text = element('gd-typography', { variant: 'small' });
    const output = document.createElement('span');
    text.append(
      element('gd-typography', { variant: 'strong' }, 'Ref API State:'),
      document.createElement('br'),
      output
    );
    stateBox.append(text);
    const update = () => {
      output.textContent = `isTruncated: ${value.isTruncated}`;
      value.title = value.isTruncated ? 'Content is truncated' : '';
    };
    const observer = new ResizeObserver(() => {
      if (!value.isConnected) {
        observer.disconnect();
        return;
      }
      update();
    });
    requestAnimationFrame(() => {
      observer.observe(value);
      update();
    });
    section.append(value, stateBox);
    return section;
  },
  parameters: {
    docs: { description: { story: 'The isTruncated property exposes measured overflow for tooltip decisions.' } },
  },
};
export const WithAccessibility: Story = {
  ...Default,
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
