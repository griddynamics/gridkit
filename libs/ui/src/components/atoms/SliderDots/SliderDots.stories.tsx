import { useState } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Column, Typography } from '@components';
import { defaultTheme } from '@tokens';

import { SliderDots } from './';
import { defaultActions, interactiveActions, manyDotsActions } from './SliderDots.stories.play';

const meta: Meta<typeof SliderDots> = {
  title: 'Atoms/SliderDots',
  component: SliderDots,
  argTypes: {
    // Core Properties
    count: {
      description: 'Total number of dots to render',
      control: { type: 'number' },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: 'Core Properties',
      },
    },
    activeIndex: {
      description: 'Index of the currently active dot (zero-based)',
      control: { type: 'number' },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: 'Core Properties',
      },
    },

    // Events & Callbacks
    onDotClick: {
      description: 'Callback fired when a dot is clicked, receives the dot index',
      action: 'Dot clicked',
      table: {
        type: { summary: '(index: number) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
  },
  args: {
    count: 5,
    activeIndex: 0,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`SliderDots\` component renders a set of navigation dots commonly used with carousels, sliders, or paginated content.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Navigation</b>
<ul>
<li>Click any dot to navigate to the corresponding slide</li>
<li><code>onDotClick</code> callback provides the clicked dot index</li>
</ul>
</li>
<li>
<b>Active State</b>
<ul>
<li>Visually highlights the currently active dot</li>
<li>Controlled via the <code>activeIndex</code> prop</li>
</ul>
</li>
<li><b>Accessibility</b> – Uses <code>role="tablist"</code> and <code>role="tab"</code> with ARIA labels</li>
<li><b>Theming</b> – Customizable via theme tokens for default and active dot styles</li>
</ul>
<br/>
<h3>Styling:</h3>
<ul>
<li><b>Theme Tokens</b>
<ul>
<li><code>sliderDots.dot.default</code> - Default dot appearance</li>
<li><code>sliderDots.dot.active</code> - Active dot appearance</li>
</ul>
</li>
</ul>
        `,
      },
    },
  },
} as Meta<typeof SliderDots>;

export default meta;

type Story = StoryObj<typeof SliderDots>;

export const Default: Story = {
  args: {
    count: 5,
    activeIndex: 0,
    onDotClick: fn(),
  },
  play: defaultActions,
  parameters: {
    docs: {
      description: {
        story: 'Default slider dots with 5 dots and the first dot active.',
      },
      source: {
        code: `<SliderDots count={5} activeIndex={0} />`,
      },
    },
  },
};

export const Interactive: StoryObj<typeof SliderDots> = {
  play: interactiveActions,
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeIndex, setActiveIndex] = useState(0);

    const handleDotClick = (index: number) => {
      action('onDotClick')(index);
      setActiveIndex(index);
    };

    return (
      <Column gap="16px" alignItems="center">
        <Typography>Active slide: {activeIndex + 1} of 5</Typography>
        <SliderDots count={5} activeIndex={activeIndex} onDotClick={handleDotClick} />
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive slider dots with state management. Click any dot to change the active slide. The `onDotClick` callback updates the parent state.',
      },
      source: {
        code: `import { useState } from 'react';
import { SliderDots, Column, Typography } from 'gd-design-library';

const Example = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDotClick = (index: number) => {
    console.log('Dot clicked:', index);
    setActiveIndex(index);
  };

  return (
    <Column gap="16px" alignItems="center">
      <Typography>Active slide: {activeIndex + 1} of 5</Typography>
      <SliderDots count={5} activeIndex={activeIndex} onDotClick={handleDotClick} />
    </Column>
  );
};`,
      },
    },
  },
};

export const ManyDots: Story = {
  args: {
    count: 10,
    activeIndex: 4,
  },
  play: manyDotsActions,
  parameters: {
    docs: {
      description: {
        story:
          'Slider dots with a larger number of dots (10), with the 5th dot active. Useful for testing layout behavior with many items.',
      },
      source: {
        code: `<SliderDots count={10} activeIndex={4} />`,
      },
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ sliderDots: defaultTheme.sliderDots }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
