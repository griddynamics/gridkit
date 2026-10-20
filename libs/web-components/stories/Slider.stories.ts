import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import type { GdSlider } from '../src';
import { defaultTokenViewer, element } from './helpers';
import {
  controlledActions,
  customStylesActions,
  defaultActions,
  disabledActions,
  withInitialValueActions,
} from './Slider.stories.play';

// `gd-change` only documents the element's event in the controls table; it is never passed to the element.
type Args = Pick<GdSlider, 'min' | 'max' | 'value' | 'disabled' | 'styles'> & {
  'aria-label'?: string;
  'gd-change'?: unknown;
};

const COMMON_ARGS: Args = {
  min: 1,
  max: 100,
  disabled: false,
  styles: {},
  value: 1,
  'aria-label': 'Select value',
};

const logChange = (slider: GdSlider) => {
  slider.addEventListener('gd-change', (event) =>
    action('changed')((event as CustomEvent<{ value: number }>).detail.value)
  );
  return slider;
};

const sliderFrom = ({ 'aria-label': ariaLabel, ...props }: Args) => {
  const slider = element('gd-slider', props);
  if (ariaLabel) slider.setAttribute('aria-label', ariaLabel);
  return slider;
};

const createStory = (args: Partial<Args>): StoryObj<Args> => ({ args: { ...COMMON_ARGS, ...args } });

const meta = {
  title: 'Atoms/Slider',
  component: 'gd-slider',
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
        type: { summary: 'CSSProperties' },
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
    'gd-change': {
      description: 'Event fired when the slider value changes. The new value is available as `event.detail.value`',
      table: {
        type: { summary: 'CustomEvent<{ value: number }>' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`gd-slider\` element allows users to select a numeric value from a range by dragging a thumb.
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
  render: (args: Args) => logChange(sliderFrom(args)),
} satisfies Meta<Args>;

export default meta;

export const Default: StoryObj<Args> = { ...createStory({}), play: defaultActions };

export const WithInitialValue: StoryObj<Args> = { ...createStory({ value: 50 }), play: withInitialValueActions };

export const Disabled: StoryObj<Args> = { ...createStory({ disabled: true, value: 30 }), play: disabledActions };

export const CustomStyles: StoryObj<Args> = {
  ...createStory({ value: 70, styles: { backgroundColor: 'lightyellow', borderRadius: '8px' } }),
  play: customStylesActions,
};

export const Controlled: StoryObj<Args> = {
  render: (args) => {
    const slider = sliderFrom({ ...args, value: 25 });
    slider.addEventListener('gd-change', (event) => {
      const { value } = (event as CustomEvent<{ value: number }>).detail;
      slider.value = value;
      action('changed')(value);
    });
    return slider;
  },
  play: controlledActions,
};

export const WithAccessibility: StoryObj<Args> = {
  args: { ...COMMON_ARGS, 'aria-label': 'Select volume level' },
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

export const DefaultTokens: StoryObj<Args> = {
  render: () => defaultTokenViewer('slider'),
  parameters: {
    layout: 'padded',
  },
};
