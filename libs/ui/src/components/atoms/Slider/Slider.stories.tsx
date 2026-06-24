import { useState, ComponentProps } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import {
  defaultActions,
  withInitialValueActions,
  disabledActions,
  customStylesActions,
  controlledActions,
} from './Slider.stories.play';
import { Slider } from './Slider';

const COMMON_ARGS = {
  min: 1,
  max: 100,
  disabled: false,
  styles: {},
  value: 1,
  onChange: action('changed'),
};

const createStory = (args: Partial<typeof COMMON_ARGS>): StoryObj<typeof Slider> => ({
  args: { ...COMMON_ARGS, ...args },
});

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: {
      description: 'Minimum value of the slider range',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    max: {
      description: 'Maximum value of the slider range',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    disabled: {
      description: 'Whether the slider is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    styles: {
      description: 'Custom styles to apply to the slider component',
      table: {
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    value: {
      description: 'Current value of the slider',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    onChange: {
      description: 'Callback function triggered when slider value changes',
      table: {
        type: { summary: '(value: number) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Slider\` component allows users to select a numeric value from a range by dragging a thumb.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Interactive Control</b> - Drag thumb or click track to set value</li>
  <li><b>Controlled/Uncontrolled</b> - Supports both usage patterns</li>
  <li><b>Visual Feedback</b> - Track fill shows current value</li>
  <li><b>Accessibility</b> - Keyboard navigation and ARIA attributes</li>
  <li><b>Customization</b> - Configurable styles and theming</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width</code>: Full width of slider component</li>
  <li><code>height</code>: Height of track and thumb</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin</code>: External spacing around slider</li>
  <li><code>padding</code>: Internal spacing within track</li>
  </ul>
  </li>
  <li><b>Styling</b>
  <ul>
  <li>Track appearance and colors</li>
  <li>Thumb size and shape</li>
  <li>Disabled state visuals</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
};

export default meta;

export const Default = createStory({});
Default.args = { ...Default.args, onChange: fn() };
Default.play = defaultActions;

export const WithInitialValue = createStory({
  value: 50,
});
WithInitialValue.play = withInitialValueActions;

export const Disabled = createStory({
  disabled: true,
  value: 30,
});
Disabled.play = disabledActions;

export const CustomStyles = createStory({
  value: 70,
  styles: { backgroundColor: 'lightyellow', borderRadius: '8px' },
});
CustomStyles.play = customStylesActions;

const ControlledSlider = (args: ComponentProps<typeof Slider>) => {
  const [val, setVal] = useState(25);
  return (
    <Slider
      {...args}
      value={val}
      onChange={(v) => {
        setVal(v);
        action('changed')(v);
      }}
    />
  );
};

export const Controlled: StoryObj<typeof Slider> = {
  render: (args) => <ControlledSlider {...args} />,
};
Controlled.play = controlledActions;

export const WithAccessibility: StoryObj<typeof Slider> = {
  args: {
    ...COMMON_ARGS,
    'aria-label': 'Select volume level',
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ slider: defaultTheme.slider }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
