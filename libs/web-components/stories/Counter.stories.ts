import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdCounter } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdCounter, 'min' | 'max' | 'initial' | 'isDisabled'>;
const meta = {
  title: 'Molecules/Counter',
  tags: ['autodocs'],
  args: { min: 1, max: 5, initial: 1, isDisabled: false },
  render: (args: Args) => observed(element('gd-counter', args), 'gd-change', { value: args.initial }),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const AtMaximum: Story = { args: { initial: 5 } };
export const Disabled: Story = { args: { isDisabled: true } };
export const AdjustedMaximum: Story = { args: { max: 10, initial: 8 } };
export const AdjustedMinimum: Story = { args: { min: 3, initial: 3 } };
export const CustomRange: Story = { args: { min: 2, max: 10, initial: 5 } };
