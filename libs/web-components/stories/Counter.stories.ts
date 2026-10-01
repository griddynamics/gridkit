import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdCounter } from '../src';
import { element, observed } from './helpers';

type Args = Pick<GdCounter, 'min' | 'max' | 'initial' | 'isDisabled'>;
const meta = {
  title: 'Molecules/Counter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Counter matching React minimum, maximum, initial value, external change handling, disabled state, and accessible native controls.',
      },
    },
  },
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
export const AdjustedMaxValue5: Story = { args: { max: 5, initial: 5 } };
export const AdjustedMinValue3: Story = { args: { min: 3, initial: 3 } };
export const AdjustedMin2MaxValue10: Story = CustomRange;
export const WithExternalCounterChangeHandler: Story = Default;
export const DefaultTokens: Story = { render: () => document.createElement('pre') };
