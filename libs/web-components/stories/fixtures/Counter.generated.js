// Generated from libs/ui/src/components/molecules/Counter/Counter.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Counter';
const Counter = 'gd-counter';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Molecules/Counter',
  component: Counter,
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
};
export default meta;
const Template = (args) => demo(Counter, { ...args });
export const Default = Template.bind({});
Default.args = {};
export const AdjustedMaxValue5 = Template.bind({});
AdjustedMaxValue5.args = {
  max: 5,
};
export const AdjustedMinValue3 = Template.bind({});
AdjustedMinValue3.args = {
  initial: 3,
  min: 3,
};
export const AdjustedMin2MaxValue10 = Template.bind({});
AdjustedMin2MaxValue10.args = {
  initial: 2,
  min: 2,
  max: 10,
};
export const WithExternalCounterChangeHandler = (args) => {
  return demo(Counter, { ...args, initial: 3 });
};
WithExternalCounterChangeHandler.args = {
  onCounterChange: fn((newValue) => {
    action('Counter Changed')(newValue);
  }),
};
export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  initial: 5,
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { counter: defaultTheme.counter } });
DefaultTokens.parameters = {
  layout: 'padded',
};
