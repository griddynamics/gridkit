import { useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Column, Typography } from '@components';

import { defaultTheme } from '@tokens';
import { Switch } from './Switch';
import {
  defaultActions,
  checkedActions,
  disabledActions,
  controlledActions,
  uncontrolledActions,
  withLoadingActions,
} from './Switch.stories.play';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
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
      description: 'Label content for the switch',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'Label' },
        category: 'Content',
      },
    },

    // Identification
    name: {
      description: 'Name attribute of the switch input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'switch' },
        category: 'Identification',
      },
    },

    // Events & Callbacks
    onValueChange: {
      description: 'Callback fired when the switch value changes',
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
  <li>Controlled mode: Provide <code>checked</code> prop to control state externally</li>
  <li>Uncontrolled mode: Omit <code>checked</code> prop for internal state management</li>
  <li><code>onValueChange</code> callback only fires when value actually changes</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>States</b> – Normal, checked, disabled states</li>
  <li><b>Theming</b> – Customizable colors and transitions</li>
  </ul>
  <br/>
  <h3>Styling:</h3>
  <ul>
  <li><b>Classes</b>
  <ul>
  <li>.gd-switch-label - Label styling</li>
  <li>.gd-switch-slider - Switch track/thumb styling</li>
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
} as Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof Switch>;

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

export const Controlled: StoryObj<typeof Switch> = {
  play: controlledActions,
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(false);

    const handleChange = (value: boolean) => {
      action('onValueChange')(value);
      setTimeout(() => setChecked(value), 1500);
    };

    return (
      <Column gap="16px">
        <Typography>Current state: {checked ? 'ON' : 'OFF'}</Typography>
        <Switch checked={checked} onValueChange={handleChange}>
          Controlled Switch, with 1.5 seconds delay
        </Switch>
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Controlled Switch - state is managed externally via `checked` prop. The `onValueChange` callback updates the parent state. Click the switch to see the state update.',
      },
      source: {
        code: `import { useState } from 'react';
import { Switch, Column, Typography } from 'gd-design-library';

const Example = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (value: boolean) => {
    console.log('Switch changed to:', value);
    setTimeout(() => setChecked(value), 1500);
  };

  return (
    <Column gap="16px">
      <Typography>Current state: {checked ? 'ON' : 'OFF'}</Typography>
      <Switch checked={checked} onValueChange={handleChange}>
        Controlled Switch, with 1.5 seconds delay
      </Switch>
    </Column>
  );
};`,
      },
    },
  },
};

export const Uncontrolled: StoryObj<typeof Switch> = {
  play: uncontrolledActions,
  render: () => {
    const handleChange = (value: boolean) => {
      action('onValueChange')(value);
    };

    return (
      <Column gap="16px">
        <Typography>
          Uncontrolled Switch - state is managed internally. Check the Actions panel to see onChange events.
        </Typography>
        <Switch onValueChange={handleChange}>Uncontrolled Switch</Switch>
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled Switch - state is managed internally by the component. Omit the `checked` prop to use uncontrolled mode. The `onValueChange` callback still fires when the value changes.',
      },
      source: {
        code: `import { Switch, Column, Typography } from 'gd-design-library';

const Example = () => {
  const handleChange = (value: boolean) => {
    console.log('Switch changed to:', value);
  };

  return (
    <Column gap="16px">
      <Typography>Uncontrolled Switch - state is managed internally</Typography>
      <Switch onValueChange={handleChange}>
        Uncontrolled Switch
      </Switch>
    </Column>
  );
};`,
      },
    },
  },
};

export const WithLoading: StoryObj<typeof Switch> = {
  play: withLoadingActions,
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (value: boolean) => {
      action('onValueChange')(value);
      setIsLoading(true);
      setTimeout(() => {
        setChecked(value);
        setIsLoading(false);
      }, 3000);
    };

    return (
      <Column gap="16px">
        <Typography>Current state: {checked ? 'ON' : 'OFF'}</Typography>
        <Typography>Loading: {isLoading ? 'Yes (3 seconds)' : 'No'}</Typography>
        <Switch checked={checked} isLoading={isLoading} onValueChange={handleChange}>
          Switch with Loading State (3 seconds)
        </Switch>
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Switch with loading state - when toggled, the switch enters a loading state for 4 seconds and is disabled during this time. Works in both directions (ON to OFF and OFF to ON).',
      },
      source: {
        code: `import { useState } from 'react';
import { Switch, Column, Typography } from 'gd-design-library';

const Example = () => {
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      setChecked(value);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Column gap="16px">
      <Typography>Current state: {checked ? 'ON' : 'OFF'}</Typography>
      <Typography>Loading: {isLoading ? 'Yes (3 seconds)' : 'No'}</Typography>
      <Switch checked={checked} isLoading={isLoading} onValueChange={handleChange}>
        Switch with Loading State (3 seconds)
      </Switch>
    </Column>
  );
};`,
      },
    },
  },
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

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ switch: defaultTheme.switchToken }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
