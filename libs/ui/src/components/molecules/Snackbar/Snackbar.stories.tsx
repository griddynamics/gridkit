import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { SnackbarPosition, SnackbarVariant } from '@types';
import { defaultTheme } from '@tokens';
import { Link, Button, Box } from '@components';

import { DEFAULT_DURATION } from './constants';
import { Snackbar, showSnackbar, SnackbarManager, type SnackbarState } from '.';
import {
  basicSnackbarActions,
  defaultActions,
  errorActions,
  noAutoDismissActions,
  successActions,
  warningActions,
  withActionAndColoredActions,
} from './Snackbar.stories.play';

const meta: Meta<typeof Snackbar> = {
  title: 'Molecules/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Snackbar\` component is a versatile notification system that displays temporary messages at screen edges, providing important contextual feedback to users. It supports multiple message types, flexible positioning, and customizable behavior to effectively communicate application state changes.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Message Types</b>
  <ul>
  <li>Success - Confirms successful operations and positive outcomes</li>
  <li>Error - Alerts users about failures and error conditions</li>
  <li>Warning - Provides preventive notifications and cautions</li>
  <li>Info - Displays neutral informational updates</li>
  </ul>
  </li>
  <li>
  <b>Positioning Options</b>
  <ul>
  <li>Top/Bottom alignment for optimal visibility</li>
  <li>Left/Right/Center anchoring for layout flexibility</li>
  <li>Intelligent stack ordering for multiple notifications</li>
  </ul>
  </li>
  <li><b>Duration Control</b> - Configurable auto-dismiss timing or persistent display</li>
  <li><b>Interactive Elements</b> - Customizable action buttons and dismiss controls</li>
  <li><b>Visual Customization</b> - Themeable colors, icons, and responsive layout</li>
  </ul>
  <br/>
  <h3>Usage Guide:</h3>
  
  1. Mount SnackbarManager in your app:
  \`\`\`tsx
  <SnackbarManager />
  \`\`\`
  
  2. Show notifications using showSnackbar:
  \`\`\`tsx
  showSnackbar({
      title: 'Success',
      message: 'Operation completed',
      variant: SnackbarVariant.Success,
      position: SnackbarPosition.BottomRight,
      duration: 5000
  });
  \`\`\`
        `,
      },
    },
  },
  args: {
    onClose: action('Closed'),
  },
  argTypes: {
    // ============================================================================
    // Content & Behavior
    // ============================================================================
    title: {
      description: 'Optional title shown at the top of the snackbar.',
      control: 'text',
      table: {
        category: 'Content & Behavior',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    message: {
      description: 'Main message of the snackbar (required).',
      control: 'text',
      table: {
        category: 'Content & Behavior',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    action: {
      description: 'Optional ReactNode to render as action (e.g., button).',
      control: false,
      table: {
        category: 'Content & Behavior',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onClose: {
      description: 'Callback when snackbar is closed.',
      control: false,
      table: {
        category: 'Content & Behavior',
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // ============================================================================
    // Visual Style
    // ============================================================================
    variant: {
      description: 'Variant of the snackbar. Affects color and icon.',
      control: 'select',
      options: Object.values(SnackbarVariant),
      table: {
        category: 'Visual Style',
        type: { summary: 'SnackbarVariant' },
        defaultValue: { summary: 'Info' },
      },
    },
    position: {
      description: 'Position on screen where the snackbar will appear.',
      control: 'select',
      options: Object.values(SnackbarPosition),
      table: {
        category: 'Visual Style',
        type: { summary: 'SnackbarPosition' },
        defaultValue: { summary: 'BottomRight' },
      },
    },
    colored: {
      description: 'If true, background color matches the variant.',
      control: 'boolean',
      table: {
        category: 'Visual Style',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      description: 'Optional ReactNode icon shown next to the message, instead of the variant icon.',
      control: false,
      table: {
        category: 'Visual Style',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // ============================================================================
    // Behavior
    // ============================================================================
    duration: {
      description: 'How long the snackbar stays visible (ms). `null` = sticky.',
      control: 'number',
      table: {
        category: 'Behavior',
        type: { summary: 'number | null' },
        defaultValue: { summary: `${DEFAULT_DURATION}` },
      },
    },
    dismissOnClick: {
      description: 'If true, clicking the snackbar will dismiss it.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isAnimated: {
      description: 'Controls whether the snackbar shows animation effects.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },

    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description: 'Custom CSS styles to apply to the snackbar.',
      control: 'object',
      table: {
        category: 'Custom Styling',
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
  },
} as Meta<typeof Snackbar>;

export default meta;
const Template: StoryFn<SnackbarState> = (args) => {
  return <Snackbar {...args} />;
};

export const Example: StoryObj = {
  name: 'Basic Snackbar',
  args: {
    title: 'Info',
    message: 'This is an example of snackbar message.',
    variant: 'info',
    position: 'top-right',
    duration: 30000,
    dismissOnClick: true,
    isAnimated: true,
  },
  render: (args) => (
    <Box>
      <SnackbarManager />
      <Button onClick={() => showSnackbar(args as SnackbarState)}>Show Snackbar</Button>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
import { showSnackbar, SnackbarManager } from 'gd-design-library';
import {
  SnackbarPosition,
  SnackbarVariant,
} from "gd-design-library/types/snackbar";

const SnackbarExample = () => {
  const onClick = () => {
    showSnackbar({
      title: "Info",
      message: "This is an example of snackbar message.",
      variant: 'info',
      position: 'top-right',
      duration: 3000,
      dismissOnClick: true
    });
  };
  return (
    <div>
      <SnackbarManager />
      <Button onClick={onClick}>Show Snackbar</Button>
    </div>
  );
};
        `,
        language: 'tsx',
      },
    },
  },
};
Example.play = basicSnackbarActions;

export const Default = Template.bind({});
Default.args = {
  title: 'Default Snackbar',
  message: 'This is a default snackbar message.',
  variant: SnackbarVariant.Info,
  duration: null,
  dismissOnClick: false,
};
Default.play = defaultActions;

export const Success = Template.bind({});
Success.args = {
  title: 'Success',
  message: 'Your action was successful!',
  variant: SnackbarVariant.Success,
  duration: 3000,
};
Success.play = successActions;

export const Error = Template.bind({});
Error.args = {
  title: 'Error',
  message: 'Something went wrong.',
  variant: SnackbarVariant.Error,
  duration: 5000,
};
Error.play = errorActions;

export const Warning = Template.bind({});
Warning.args = {
  title: 'Warning',
  message: 'Be careful with this action.',
  variant: SnackbarVariant.Warning,
  duration: null,
};
Warning.play = warningActions;

export const WithActionAndColored = Template.bind({});
WithActionAndColored.args = {
  title: 'Action Required',
  message: 'Click the button below to retry.',
  variant: SnackbarVariant.Error,
  colored: true,
  duration: null,
  action: (
    <Link role="button" variant="inverted" onClick={action('Action clicked')}>
      Retry
    </Link>
  ),
};
WithActionAndColored.play = withActionAndColoredActions;

export const NoAutoDismiss = Template.bind({});
NoAutoDismiss.args = {
  title: 'Persistent Snackbar',
  message: 'This message won’t disappear until manually closed.',
  variant: SnackbarVariant.Info,
  dismissOnClick: false,
  duration: null,
};
NoAutoDismiss.play = noAutoDismissActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ snackbar: defaultTheme.snackbar }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
