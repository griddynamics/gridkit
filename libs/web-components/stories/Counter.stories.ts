import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import type { GdCounter } from '../src';
import { defaultTokenViewer, element } from './helpers';
import {
  adjustedMaxValue5Actions,
  adjustedMin2MaxValue10Actions,
  adjustedMinValue3Actions,
  defaultActions,
  withExternalCounterChangeHandlerActions,
} from './Counter.stories.play';

// `gd-change` only documents the element's event in the controls table; it is never passed to the element.
type Args = Pick<GdCounter, 'min' | 'max' | 'initial' | 'isDisabled' | 'styles'> & { 'gd-change'?: unknown };

const meta = {
  title: 'Molecules/Counter',
  component: 'gd-counter',

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
    'gd-change': {
      description: 'Event fired when counter value changes. The new value is available as `event.detail.value`',
      table: {
        category: 'Events',
        type: { summary: 'CustomEvent<{ value: number }>' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Styling
    styles: {
      description: 'CSS properties applied to the counter container',
      table: {
        category: 'Styling',
        type: { summary: 'CSSProperties' },
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
  The \`gd-counter\` element is a versatile UI element for managing numeric values within specified boundaries.
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
  <li><b>Event Handling</b> – Events for value changes</li>
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
  render: (args: Args) => element('gd-counter', args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = { args: {}, play: defaultActions };

export const AdjustedMaxValue5: Story = {
  args: {
    max: 5,
  },
  play: adjustedMaxValue5Actions,
};

export const AdjustedMinValue3: Story = {
  args: {
    initial: 3,
    min: 3,
  },
  play: adjustedMinValue3Actions,
};

export const AdjustedMin2MaxValue10: Story = {
  args: {
    initial: 2,
    min: 2,
    max: 10,
  },
  play: adjustedMin2MaxValue10Actions,
};

export const WithExternalCounterChangeHandler: Story = {
  render: (args) => {
    const counter = element('gd-counter', { ...args, initial: 3 });
    counter.addEventListener('gd-change', (event) =>
      action('Counter Changed')((event as CustomEvent<{ value: number }>).detail.value)
    );
    return counter;
  },
  play: withExternalCounterChangeHandlerActions,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    initial: 5,
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('counter'),
  parameters: {
    layout: 'padded',
  },
};
