import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSlider } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdSlider, 'min' | 'max' | 'value' | 'step' | 'disabled' | 'styles'>;
const meta = {
  title: 'Atoms/Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A token-backed native range control with controlled values, keyboard accessibility, visual track fill, disabled state, and gd-change value events.',
      },
    },
  },
  args: { min: 1, max: 100, value: 1, step: 1, disabled: false },
  argTypes: {
    min: { description: 'Minimum value of the slider range', control: 'number' },
    max: { description: 'Maximum value of the slider range', control: 'number' },
    value: { description: 'Current slider value', control: 'number' },
    step: { description: 'Increment between permitted values', control: 'number' },
    disabled: { description: 'Whether the slider is disabled', control: 'boolean' },
    styles: { description: 'Custom slider style overrides', control: 'object' },
  },
  render: (args: Args) => observed(element('gd-slider', args), 'gd-change', { value: args.value }),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const WithInitialValue: Story = { args: { value: 50 } };
export const Disabled: Story = { args: { disabled: true, value: 30 } };
export const CustomStyles: Story = {
  args: { value: 70, styles: { backgroundColor: 'lightyellow', borderRadius: '8px' } },
};
export const Controlled: Story = {
  render: (args) => {
    const slider = element('gd-slider', { ...args, value: 25 });
    slider.addEventListener('gd-change', (e) => (slider.value = (e as CustomEvent<{ value: number }>).detail.value));
    return observed(slider, 'gd-change', { value: 25 });
  },
  parameters: {
    docs: { description: { story: 'The value property is updated externally from each gd-change event.' } },
  },
};
export const WithAccessibility: Story = {
  args: { 'aria-label': 'Select volume level' } as never,
  parameters: { a11y: { test: 'error' }, docs: { disable: true } },
  tags: ['a11y'],
};
export const DefaultTokens: Story = {
  render: () => {
    const pre = document.createElement('pre');
    pre.textContent = 'defaultTheme.slider';
    return pre;
  },
};
