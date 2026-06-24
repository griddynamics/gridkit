import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { interactiveActions } from './ProgressBar.stories.play';

import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Molecules/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`ProgressBar\` component is a visual indicator that displays the progress or completion status of a task.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Progress Types</b>
  <ul>
  <li>Determinate - Shows specific progress value</li>
  <li>Indeterminate - Animated loading state</li>
  </ul>
  </li>
  <li><b>Visual Customization</b>
  <ul>
  <li>Custom fill colors</li>
  <li>Custom background colors</li>
  <li>Optional percentage display</li>
  </ul>
  </li>
  <li><b>Accessibility</b> - ARIA attributes for screen readers</li>
  <li><b>Responsive</b> - Adapts to container width</li>
  </ul>
        `,
      },
    },
  },
  argTypes: {
    // State & Control
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
      table: {
        category: 'State & Control',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows indeterminate animation when true',
      table: {
        category: 'State & Control',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showPercentage: {
      control: 'boolean',
      description: 'Displays percentage label when true',
      table: {
        category: 'State & Control',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // Appearance
    fillColor: {
      control: 'color',
      description: 'Color of the progress fill',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '#0066FF' },
      },
    },
    backgroundColor: {
      control: 'color',
      description: 'Color of the track background',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '#E5E5E5' },
      },
    },

    // Accessibility
    role: {
      control: 'text',
      description: 'ARIA role for the progress indicator',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'progressbar' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'ARIA label for accessibility',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Progress bar' },
      },
    },

    // Styling
    className: {
      control: 'text',
      description: 'Custom CSS class',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom styles object',
      table: {
        category: 'Styling',
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: (args) => {
    return (
      <div style={{ width: 300 }}>
        <ProgressBar {...args} value={25} showPercentage />
      </div>
    );
  },
  args: {
    showPercentage: true,
    'aria-label': 'Interactive progress bar',
  },
};

export const Indeterminate: Story = {
  render: (args) => {
    return (
      <div style={{ width: 300 }}>
        <ProgressBar {...args} indeterminate />
      </div>
    );
  },
  args: {
    showPercentage: true,
    'aria-label': 'Interactive progress bar',
  },
};

export const WithPercentage: Story = {
  args: {
    value: 75,
    showPercentage: true,
    'aria-label': 'Progress bar with percentage',
  },
};

export const CustomStyling: Story = {
  render: (args) => {
    return (
      <div style={{ width: 300 }}>
        <ProgressBar {...args} value={75} showPercentage fillColor="#ff4500" />
      </div>
    );
  },
  args: {
    showPercentage: true,
    'aria-label': 'Interactive progress bar',
  },
};

export const Interactive: Story = {
  render: (args) => {
    // Define a proper React component
    const InteractiveProgressBar = () => {
      const [value, setValue] = useState(0);

      return (
        <div style={{ width: 300 }}>
          <ProgressBar {...args} value={value} />
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                setValue((prev) => Math.min(100, prev + 1));
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                setValue((prev) => Math.max(0, prev - 1));
              }
            }}
            style={{ width: '100%', marginTop: '20px' }}
          />
        </div>
      );
    };

    return <InteractiveProgressBar />;
  },
  args: {
    showPercentage: true,
    'aria-label': 'Interactive progress bar',
  },
};
Interactive.play = interactiveActions;

export const FullWidth: Story = {
  args: {
    value: 40,
    styles: { width: '100%' },
    'aria-label': 'Full width progress bar',
  },
  parameters: {
    layout: 'padded',
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ progressbar: defaultTheme.progressbar }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
