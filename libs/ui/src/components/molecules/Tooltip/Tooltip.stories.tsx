import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';

import { Row, Typography } from '@components';
import { Tooltip, type TooltipProps } from '.';
import {
  defaultActions,
  customDelayActions,
  customGapActions,
  customPositionActions,
  multipleTooltipsActions,
} from './Tooltip.stories.play';

export default {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  <p>The Tooltip component provides contextual information through an elegant overlay system, combining rich functionality with robust accessibility features for an optimal user experience.</p>
  
  <h3>Core Features</h3>
  <ul>
  <li><strong>Smart Positioning:</strong> Automatically adjusts to viewport edges with support for 4 directions (top, right, bottom, left)</li>
  <li><strong>Accessibility First:</strong> Full ARIA integration with keyboard navigation and screen reader support</li>
  <li><strong>Smart Visibility:</strong> Automatically hides on window blur, tab switch, Escape key, and outside clicks</li>
  <li><strong>Smooth Interactions:</strong> Configurable animations and timing controls with 200ms default delay</li>
  </ul>
  
  <h3>Automatic Hide Behavior</h3>
  <ul>
  <li><strong>Mouse Leave:</strong> Tooltip hides when mouse leaves the trigger element</li>
  <li><strong>Outside Click:</strong> Tooltip hides when clicking outside the tooltip or trigger</li>
  <li><strong>Escape Key:</strong> Tooltip hides when pressing the Escape key</li>
  <li><strong>Focus Loss:</strong> Tooltip hides when window loses focus or tab becomes hidden</li>
  <li><strong>Scroll/Resize:</strong> Tooltip repositions dynamically on scroll and resize events</li>
  </ul>
  
  <h3>Technical Implementation</h3>
  <ul>
  <li><strong>Portal Rendering:</strong> Uses React Portal for proper DOM hierarchy and z-index management</li>
  <li><strong>Position Detection:</strong> Smart boundary detection with automatic fallback positioning</li>
  <li><strong>Event Handling:</strong> Comprehensive event system for mouse, touch, keyboard, focus, and visibility changes</li>
  <li><strong>Polymorphic Component:</strong> Flexible element rendering via 'as' prop (div, span, etc.)</li>
  </ul>
  
  <h3>Customization Options</h3>
  <ul>
  <li><strong>Positioning:</strong> Configure placement with 'position' prop (top, right, bottom, left) - auto-adjusts if needed</li>
  <li><strong>Timing:</strong> Adjust show delay with 'delay' prop (default: 200ms)</li>
  <li><strong>Spacing:</strong> Control trigger-to-tooltip distance with 'gap' prop (default: 10px)</li>
  <li><strong>Styling:</strong> Customize appearance through theme tokens or direct styles prop</li>
  <li><strong>Container:</strong> Change wrapper element type with 'as' prop for semantic HTML</li>
  </ul>
  
  <h3>Best Practices</h3>
  <ul>
  <li>Use for supplementary information that enhances user understanding without being critical</li>
  <li>Keep tooltip content concise (1-2 lines recommended)</li>
  <li>Ensure sufficient color contrast for readability (WCAG AA compliant)</li>
  <li>Provide meaningful ARIA labels for screen reader users</li>
  <li>Don't nest interactive elements inside tooltips</li>
  <li>Test keyboard navigation (Tab to focus, Escape to close)</li>
  </ul>
        `,
      },
    },
  },
  argTypes: {
    ariaLabel: {
      description: 'Accessible label for the tooltip trigger',
      control: 'text',
      type: { name: 'string' },
      table: {
        type: { summary: 'string' },
        category: 'Accessibility',
      },
    },
    ariaDescribedBy: {
      description: 'ID of the element that describes the tooltip',
      control: 'text',
      type: { name: 'string' },
      table: {
        type: { summary: 'string' },
        category: 'Accessibility',
      },
    },
    content: {
      description: 'Content to display in the tooltip',
      control: { type: 'text' },
      type: { name: 'other', value: 'ReactNode' },
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    children: {
      description: 'Trigger element that shows tooltip on hover',
      control: { type: 'text' },
      type: { name: 'other', value: 'ReactNode' },
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    position: {
      description: 'Tooltip position relative to trigger',
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
      table: {
        defaultValue: { summary: 'top' },
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        category: 'Appearance',
      },
    },
    gap: {
      description: 'Space between tooltip and trigger element',
      control: { type: 'number' },
      table: {
        defaultValue: { summary: '10' },
        category: 'Appearance',
      },
    },
    className: {
      description: 'Additional CSS class name for the tooltip',
      control: 'text',
      type: { name: 'string' },
      table: {
        type: { summary: 'string' },
        category: 'Appearance',
      },
    },
    styles: {
      description: 'Custom CSS styles to apply to the tooltip',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
        category: 'Appearance',
      },
    },
    as: {
      description: 'Overrides the default HTML element used for rendering.',
      control: 'text',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
        defaultValue: { summary: 'div' },
        category: 'Behavior',
      },
    },
    delay: {
      description: 'Delay in ms before showing/hiding tooltip',
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      table: {
        defaultValue: { summary: '200' },
        category: 'Behavior',
      },
    },
  },
} as Meta<typeof Tooltip>;

const Template: StoryFn<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Typography
      style={{
        maxWidth: '200px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'help',
      }}
    >
      This is a long text that will be truncated with ellipsis
    </Typography>
  </Tooltip>
);

export const Default = Template.bind({});
Default.args = {
  content: 'This is a helpful tooltip with contextual information',
  position: 'top',
};
Default.play = defaultActions;
Default.parameters = {
  docs: {
    description: {
      story: `
The default tooltip appears on hover with a 200ms delay and positions itself at the top of the trigger element. 
This example shows a common use case: displaying full text in a tooltip when the visible text is truncated with ellipsis.
<br/><br/>
It automatically hides when you:
- Move your mouse away
- Click outside
- Press the Escape key
- Switch to another window or tab
      `,
    },
    source: {
      code: `import { Tooltip, Typography } from 'gd-design-library';

<Tooltip content="This is a helpful tooltip with contextual information" position="top">
  <Typography style={{
    maxWidth: '200px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'help'
  }}>
    This is a long text that will be truncated with ellipsis
  </Typography>
</Tooltip>`,
    },
  },
};

export const CustomDelay = Template.bind({});
CustomDelay.args = {
  content: 'This is a helpful tooltip with contextual information',
  position: 'top',
  delay: 1000,
};
CustomDelay.play = customDelayActions;
CustomDelay.parameters = {
  docs: {
    description: {
      story: `Control when the tooltip appears using the \`delay\` prop. The default is 200ms, which provides a good balance between responsiveness and preventing accidental triggers.`,
    },
    source: {
      code: `import { Tooltip, Typography } from 'gd-design-library';

<Tooltip content="This is a helpful tooltip with contextual information" position="top" delay={1000}>
  <Typography>Hover me</Typography>
  
</Tooltip>`,
    },
  },
};

export const CustomGap = Template.bind({});
CustomGap.args = {
  content: 'This is a helpful tooltip with contextual information',
  gap: 30,
};
CustomGap.play = customGapActions;
CustomGap.parameters = {
  docs: {
    description: {
      story: `
The \`gap\` prop controls the distance between the trigger element and the tooltip. Default is 10px.
Adjust this based on your design needs and the size of your trigger elements.
      `,
    },
    source: {
      code: `import { Tooltip, Typography } from 'gd-design-library';

<Tooltip content="This is a helpful tooltip with contextual information" gap={30}>
  <Typography>Hover me</Typography>
</Tooltip>`,
    },
  },
};

export const CustomPosition = Template.bind({});
CustomPosition.args = {
  content: 'This tooltip is positioned at the bottom',
  position: 'bottom',
};
CustomPosition.play = customPositionActions;
CustomPosition.parameters = {
  docs: {
    description: {
      story: `
The \`position\` prop controls where the tooltip appears relative to the trigger element. 
Available options: **top** (default), **right**, **bottom**, **left**.
<br/><br/>
The component automatically adjusts position if there isn't enough space in the viewport (fallback positioning).
      `,
    },
    source: {
      code: `import { Tooltip, Typography } from 'gd-design-library';

<Tooltip content="This tooltip is positioned at the bottom" position="bottom">
  <Typography>Hover me</Typography>
</Tooltip>`,
    },
  },
};

export const MultipleTooltips: StoryFn = () => {
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    content: `Tooltip content for item ${i + 1}. This is a longer tooltip to test positioning stability.`,
    label: `Item ${i + 1}`,
  }));

  return (
    <Row margin="30px" maxWidth="400px" gap="20px">
      {items.map((item) => (
        <Typography key={item.id}>
          <Tooltip content={item.content}>{item.label}</Tooltip>
        </Typography>
      ))}
    </Row>
  );
};
MultipleTooltips.play = multipleTooltipsActions;
MultipleTooltips.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story: `
This story demonstrates tooltip behavior with multiple tooltips (10 tooltips) on the same page.
Hover over different items quickly to test positioning stability. The tooltips should:
- Show correct positioning relative to their trigger element
- Not show incorrect positioning from previous tooltips
- Not fail to show at all when switching between tooltips quickly

**Test scenarios:**
1. Hover over item 1, then quickly move to item 5, then item 10
2. Rapidly switch between different tooltips
3. Scroll the page while tooltips are visible
4. Resize the window while tooltips are visible
      `,
    },
  },
};

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  content: 'This tooltip provides additional context and information',
  position: 'top',
  ariaLabel: 'Additional information tooltip',
};
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ tooltip: defaultTheme.tooltip }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
