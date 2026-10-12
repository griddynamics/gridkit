import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSliderDots } from '../src';
import { defaultTokenViewer, element, stack, sectionedArgTypes } from './helpers';

type Args = Pick<GdSliderDots, 'count' | 'activeIndex' | 'styles'>;
const meta = {
  title: 'Atoms/SliderDots',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible carousel navigation dots with a controlled active index, theme-backed active/hover states, and gd-change index events.',
      },
    },
  },
  args: { count: 5, activeIndex: 0 },
  argTypes: sectionedArgTypes('SliderDots', {
    count: { description: 'Total number of dots to render', control: 'number' },
    activeIndex: { description: 'Zero-based index of the active dot', control: 'number' },
    styles: { description: 'Custom container styles', control: 'object' },
  }),
  render: (args: Args) => element('gd-slider-dots', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {
  parameters: { docs: { description: { story: 'Five dots with the first dot active.' } } },
};
export const Interactive: Story = {
  render: () => {
    const dots = element('gd-slider-dots', { count: 5 });
    const output = element('gd-typography', {});
    output.textContent = 'Active slide: 1 of 5';
    dots.addEventListener('gd-change', (e) => {
      dots.activeIndex = (e as CustomEvent<{ index: number }>).detail.index;
      output.textContent = `Active slide: ${dots.activeIndex + 1} of 5`;
    });
    const section = stack('column', '16px', output, dots);
    section.style.alignItems = 'center';
    return section;
  },
  parameters: { docs: { description: { story: 'Clicking a dot updates the active slide output.' } } },
};
export const ManyDots: Story = {
  args: { count: 10, activeIndex: 4 },
  parameters: { docs: { description: { story: 'Ten dots with the fifth active.' } } },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('sliderDots'),
};
