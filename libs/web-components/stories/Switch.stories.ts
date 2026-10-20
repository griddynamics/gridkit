import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GdSwitch } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { column, storyParameters, typography } from './form-story-helpers';
import {
  defaultActions,
  checkedActions,
  disabledActions,
  controlledActions,
  uncontrolledActions,
  withLoadingActions,
} from './Switch.stories.play';

type Args = Partial<Pick<GdSwitch, 'checked' | 'disabled' | 'isLoading' | 'label' | 'name' | 'styles'>> & {
  children?: string;
  onValueChange?: (checked: boolean) => void;
};

type ChangeEvent = CustomEvent<{ checked: boolean }>;

// The label options of the argTypes carry stray spaces; the element only knows 'left' and 'right'.
const labelPosition = (label: unknown): GdSwitch['label'] => String(label ?? 'right').trim() as GdSwitch['label'];

const switchNode = ({ children, onValueChange, ...props }: Args) => {
  const node = element('gd-switch', { ...props, label: labelPosition(props.label) }, children);
  node.addEventListener('gd-change', (event) => onValueChange?.((event as ChangeEvent).detail.checked));
  return node;
};

const meta = {
  title: 'Atoms/Switch',
  component: 'gd-switch',
  argTypes: {
    // State Controls
    checked: {
      description: 'Controls the checked state of the switch',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    disabled: {
      description: 'Disables the switch interaction',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    isLoading: {
      description: 'Shows loading state and disables the switch',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },

    // Layout & Presentation
    label: {
      description: 'Position of the label relative to the switch',
      options: ['left ', ' right'],
      control: { type: 'select' },
      table: {
        type: {
          summary: 'LabelPosition',
          detail: `left | right`,
        },
        defaultValue: { summary: 'right' },
        category: 'Layout',
      },
    },
    children: {
      description: 'Label content for the switch (default slot)',
      control: { type: 'text' },
      table: {
        type: { summary: 'Node' },
        defaultValue: { summary: 'Label' },
        category: 'Content',
      },
    },

    // Identification
    name: {
      description: 'Name attribute of the switch input',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'switch' },
        category: 'Identification',
      },
    },

    // Events & Callbacks
    onValueChange: {
      description: 'Event fired (gd-change) when the switch value changes',
      action: 'Switch value changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
  },
  args: {
    name: 'switch',
    disabled: false,
    children: 'Label',
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Switch\` component provides an intuitive way for users to toggle between on/off states.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Label Positioning</b>
  <ul>
  <li>Left - Label appears before switch</li>
  <li>Right - Label appears after switch</li>
  </ul>
  </li>
  <li>
  <b>State Management</b>
  <ul>
  <li>Controlled mode: Write the <code>checked</code> property back from the <code>gd-change</code> listener to control state externally</li>
  <li>Uncontrolled mode: Leave <code>checked</code> alone for internal state management</li>
  <li>The <code>gd-change</code> event only fires when value actually changes</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>States</b> – Normal, checked, disabled states</li>
  <li><b>Theming</b> – Customizable colors and transitions</li>
  </ul>
  <br/>
  <h3>Styling:</h3>
  <ul>
  <li><b>Parts</b>
  <ul>
  <li>label - Label styling</li>
  <li>slider - Switch track/thumb styling</li>
  </ul>
  </li>
  <li><b>Theme Tokens</b>
  <ul>
  <li>Colors - Track, thumb, focus states</li>
  <li>Sizes - Track width, height, thumb dimensions</li>
  <li>Animation - Transition timing and easing</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
  render: (args: Args) => switchNode(args),
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    onValueChange: fn(),
  },
  play: defaultActions,
};

export const Checked: Story = {
  args: {
    checked: true,
    onValueChange: fn(),
  },
  // A defined `checked` value is a controlled value: the toggle is reported, but the displayed state follows the arg.
  render: (args) => {
    const control = switchNode(args);
    control.addEventListener('gd-change', () => {
      control.checked = Boolean(args.checked);
    });
    return control;
  },
  play: checkedActions,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: disabledActions,
};

export const LabelLeft: Story = {
  args: {
    label: 'left',
    children: 'Label on the left',
  },
};

export const Controlled: Story = {
  play: controlledActions,
  render: ({ onValueChange }) => {
    const state = typography('span', 'Current state: ', 'OFF');
    const stateText = state.lastChild as Text;
    const control = switchNode({
      checked: false,
      children: 'Controlled Switch, with 1.5 seconds delay',
      onValueChange: (value) => {
        onValueChange?.(value);
        // The element toggles itself first; the story writes the previous state back and applies the new one later.
        control.checked = !value;
        setTimeout(() => {
          control.checked = value;
          stateText.data = value ? 'ON' : 'OFF';
        }, 1500);
      },
    });
    return column({ gap: '16px' }, state, control);
  },
  parameters: storyParameters(
    'Controlled Switch - state is managed externally via the `checked` property. The `gd-change` listener updates the parent state. Click the switch to see the state update.',
    `<gd-column gap="16px">
  <gd-typography>Current state: OFF</gd-typography>
  <gd-switch id="controlled">Controlled Switch, with 1.5 seconds delay</gd-switch>
</gd-column>

<script type="module">
  const control = document.querySelector('#controlled');

  control.addEventListener('gd-change', (event) => {
    const { checked } = event.detail;
    console.log('Switch changed to:', checked);
    control.checked = !checked;
    setTimeout(() => (control.checked = checked), 1500);
  });
</script>`
  ),
};

export const Uncontrolled: Story = {
  play: uncontrolledActions,
  render: ({ onValueChange }) =>
    column(
      { gap: '16px' },
      typography(
        'span',
        'Uncontrolled Switch - state is managed internally. Check the Actions panel to see onChange events.'
      ),
      switchNode({ children: 'Uncontrolled Switch', onValueChange })
    ),
  parameters: storyParameters(
    'Uncontrolled Switch - state is managed internally by the component. Leave the `checked` property alone to use uncontrolled mode. The `gd-change` event still fires when the value changes.',
    `<gd-column gap="16px">
  <gd-typography>Uncontrolled Switch - state is managed internally</gd-typography>
  <gd-switch id="uncontrolled">Uncontrolled Switch</gd-switch>
</gd-column>

<script type="module">
  document.querySelector('#uncontrolled').addEventListener('gd-change', (event) => {
    console.log('Switch changed to:', event.detail.checked);
  });
</script>`
  ),
};

export const WithLoading: Story = {
  play: withLoadingActions,
  render: ({ onValueChange }) => {
    const state = typography('span', 'Current state: ', 'OFF');
    const loading = typography('span', 'Loading: ', 'No');
    const control = switchNode({
      checked: false,
      isLoading: false,
      children: 'Switch with Loading State (3 seconds)',
      onValueChange: (value) => {
        onValueChange?.(value);
        control.checked = !value;
        control.isLoading = true;
        (loading.lastChild as Text).data = 'Yes (3 seconds)';
        setTimeout(() => {
          control.checked = value;
          control.isLoading = false;
          (state.lastChild as Text).data = value ? 'ON' : 'OFF';
          (loading.lastChild as Text).data = 'No';
        }, 3000);
      },
    });
    return column({ gap: '16px' }, state, loading, control);
  },
  parameters: storyParameters(
    'Switch with loading state - when toggled, the switch enters a loading state for 4 seconds and is disabled during this time. Works in both directions (ON to OFF and OFF to ON).',
    `<gd-column gap="16px">
  <gd-typography>Current state: OFF</gd-typography>
  <gd-typography>Loading: No</gd-typography>
  <gd-switch id="loading">Switch with Loading State (3 seconds)</gd-switch>
</gd-column>

<script type="module">
  const control = document.querySelector('#loading');

  control.addEventListener('gd-change', (event) => {
    const { checked } = event.detail;
    control.checked = !checked;
    control.isLoading = true;
    setTimeout(() => {
      control.checked = checked;
      control.isLoading = false;
    }, 3000);
  });
</script>`
  ),
};

export const WithAccessibility: Story = {
  tags: ['a11y'],
  args: {
    name: 'notifications',
    children: 'Enable notifications',
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('switch', 'switchToken'),
  parameters: {
    layout: 'padded',
  },
};
