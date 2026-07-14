import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Counter, type CounterProps } from './';
import {
  defaultActions,
  adjustedMaxValue5Actions,
  adjustedMinValue3Actions,
  adjustedMin2MaxValue10Actions,
  withExternalCounterChangeHandlerActions,
} from './Counter.stories.play';

const meta: Meta<typeof Counter> = {
  title: 'Molecules/Counter',
  component: Counter,

  argTypes: {
    // Value & Constraints
    initial: {
      description: 'Initial value of the counter',
      table: {
        category: 'Value & Constraints',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    min: {
      description: 'Minimum allowed value',
      table: {
        category: 'Value & Constraints',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    max: {
      description: 'Maximum allowed value',
      table: {
        category: 'Value & Constraints',
        type: { summary: 'number' },
        defaultValue: { summary: '999' },
      },
    },
    isDisabled: {
      description: 'Disables the counter component, preventing user interaction',
      table: {
        category: 'Value & Constraints',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: { type: 'boolean' },
    },

    // Events
    onCounterChange: {
      description: 'Callback function triggered when counter value changes',
      table: {
        category: 'Events',
        type: { summary: '(value: number) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Styling
    styles: {
      description: 'CSS properties applied to the counter container',
      table: {
        category: 'Styling',
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
  },
  tags: ['autodocs', 'ecommerce'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Counter\` component is a versatile UI element for managing numeric values within specified boundaries.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Value Management</b>
  <ul>
  <li>Configurable minimum and maximum bounds</li>
  <li>Initial value setting</li>
  <li>Real-time value updates</li>
  </ul>
  </li>
  <li>
  <b>User Interaction</b>
  <ul>
  <li>Increment/decrement buttons</li>
  <li>Direct value input</li>
  <li>Keyboard navigation</li>
  </ul>
  </li>
  <li><b>Validation</b> – Ensures values stay within bounds</li>
  <li><b>Event Handling</b> – Callbacks for value changes</li>
  <li><b>Accessibility</b> – ARIA labels and keyboard support</li>
  <li><b>Customization</b> – Themeable styles and layouts</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Size control</li>
  <li><code>minWidth/minHeight</code>: Minimum constraints</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin</code>: External spacing</li>
  <li><code>padding</code>: Internal spacing</li>
  </ul>
  </li>
  <li><code>position</code>: Element positioning</li>
  <li><code>display</code>: Layout behavior</li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Counter>;

export default meta;
const Template: StoryFn<PropsWithChildren<CounterProps>> = (args) => <Counter {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.play = defaultActions;

export const AdjustedMaxValue5 = Template.bind({});
AdjustedMaxValue5.args = {
  max: 5,
};
AdjustedMaxValue5.play = adjustedMaxValue5Actions;

export const AdjustedMinValue3 = Template.bind({});
AdjustedMinValue3.args = {
  initial: 3,
  min: 3,
};
AdjustedMinValue3.play = adjustedMinValue3Actions;

export const AdjustedMin2MaxValue10 = Template.bind({});
AdjustedMin2MaxValue10.args = {
  initial: 2,
  min: 2,
  max: 10,
};
AdjustedMin2MaxValue10.play = adjustedMin2MaxValue10Actions;

export const WithExternalCounterChangeHandler: StoryFn = (args) => {
  return <Counter {...args} initial={3} />;
};
WithExternalCounterChangeHandler.args = {
  onCounterChange: fn((newValue: number) => {
    action('Counter Changed')(newValue);
  }),
};
WithExternalCounterChangeHandler.play = withExternalCounterChangeHandlerActions;

export const Disabled: StoryFn = Template.bind({});
Disabled.args = {
  isDisabled: true,
  initial: 5,
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ counter: defaultTheme.counter }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
