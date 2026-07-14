import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Typography } from '@components/atoms/Typography';
import { Column, Row } from '@components/layout';

import { Scroll } from './Scroll';
import {
  interactiveExampleActions,
  verticalScrollOnlyActions,
  horizontalScrollOnlyActions,
  autoHideScrollbarsActions,
  autoHideVerticalOnlyActions,
} from './Scroll.stories.play';

const meta: Meta<typeof Scroll> = {
  title: 'Layout & Structure/Scroll',
  component: Scroll,

  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
  The \`Scroll\` component is a customizable container that provides styled scrollbars for content that overflows its boundaries.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Scrollbar Control</b>
  <ul>
  <li>Independent vertical/horizontal scrollbars</li>
  <li>Multiple visibility modes</li>
  <li>Auto-hiding capabilities with smooth fade transitions</li>
  </ul>
  </li>
  <li>
  <b>Visibility Modes</b>
  <ul>
  <li>Auto - Shows scrollbars when needed</li>
  <li>Hidden - Never shows scrollbars</li>
  <li>Visible - Always shows scrollbars</li>
  </ul>
  </li>
  <li>
  <b>Auto-Hide Feature</b>
  <ul>
  <li>Scrollbars appear only during scrolling</li>
  <li>Fade out after 1 second of inactivity</li>
  <li>Smooth transitions with customizable timing</li>
  <li>Works with both vertical and horizontal scrollbars</li>
  </ul>
  </li>
  <li><b>Custom Styling</b> - Full control over container appearance</li>
  <li><b>Content Overflow</b> - Handles both vertical and horizontal overflow</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Container size</li>
  <li><code>maxWidth/maxHeight</code>: Size constraints</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Container spacing</li>
  <li><code>border</code>: Container border styles</li>
  </ul>
  </li>
  <li><code>position</code>: Container positioning</li>
  <li><code>overflow</code>: Scrollbar behavior control</li>
  </ul>
        `,
      },
    },
  },
  argTypes: {
    vertical: {
      control: { type: 'select' },
      options: ['auto', 'hidden', 'visible'],
      description: 'Controls the visibility of the vertical scrollbar.',
      table: {
        category: 'Scrollbar Control',
        defaultValue: { summary: 'auto' },
        type: { summary: "'auto' | 'hidden' | 'visible'" },
      },
    },
    horizontal: {
      control: { type: 'select' },
      options: ['auto', 'hidden', 'visible'],
      description: 'Controls the visibility of the horizontal scrollbar.',
      table: {
        category: 'Scrollbar Control',
        defaultValue: { summary: 'auto' },
        type: { summary: "'auto' | 'hidden' | 'visible'" },
      },
    },
    autoHide: {
      control: { type: 'boolean' },
      description: 'When true, scrollbars are only visible during scrolling and fade out after 1 second of inactivity.',
      table: {
        category: 'Scrollbar Control',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS styles to apply to the scroll container.',
      table: {
        category: 'Styling',
        type: { summary: 'CSSProperties' },
      },
    },
    children: {
      control: false,
      description: 'The content to be rendered within the scroll container.',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
  },
} as Meta<typeof Scroll>;

export default meta;

type Story = StoryObj<typeof Scroll>;

const longContent = (
  <Column width="600px" styles={{ padding: '10px', background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)' }}>
    {Array.from({ length: 20 }, (_, i) => (
      <Typography key={i} variant="p" styles={{ margin: 0, padding: '5px 0' }}>
        Scrollable content line {i + 1}
      </Typography>
    ))}
  </Column>
);

const wideContent = (
  <Row
    height="150px"
    align="center"
    isWrap={false}
    styles={{ padding: '10px', background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)' }}
  >
    {Array.from({ length: 10 }, (_, i) => (
      <Typography key={i} align="center" styles={{ flex: '0 0 100px' }}>
        Item {i + 1}
      </Typography>
    ))}
  </Row>
);

export const InteractiveExample: Story = {
  name: 'Interactive Example',
  args: {
    vertical: 'auto',
    horizontal: 'auto',
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
    children: longContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This is the main interactive story. Use the controls in the Addons panel to experiment with different scrollbar visibility modes and container sizes. The content inside is intentionally larger than the container to demonstrate both vertical and horizontal scrolling.',
      },
      source: {
        code: `
import { Scroll, Column, Typography } from 'gd-design-library';

<Scroll
  vertical="auto"
  horizontal="auto"
  styles={{ height: 200, width: 300, border: '1px solid #a0aec0' }}
>
  <Column
    width="600px"
    styles={{ padding: '10px', background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)' }}
  >
    {Array.from({ length: 20 }, (_, i) => (
      <Typography key={i} variant="p" styles={{ margin: 0, padding: '5px 0' }}>
        Scrollable content line {i + 1}
      </Typography>
    ))}
  </Column>
</Scroll>
        `,
      },
    },
  },
} as Story;
InteractiveExample.play = interactiveExampleActions;

export const VerticalScrollOnly: Story = {
  name: 'Vertical Scroll Only',
  args: {
    vertical: 'auto',
    horizontal: 'hidden',
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
    children: (
      <Column styles={{ padding: '10px', background: '#f0f4f8' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Typography key={i} variant="p">
            Vertical content line {i + 1}
          </Typography>
        ))}
      </Column>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a common use case where only vertical scrolling is needed. The horizontal scrollbar is explicitly hidden, preventing any horizontal overflow from being visible or scrollable.',
      },
      source: {
        code: `
import { Scroll, Column, Typography } from 'gd-design-library';

<Scroll
  vertical="auto"
  horizontal="hidden"
  styles={{ height: 200, width: 300, border: '1px solid #a0aec0' }}
>
  <Column styles={{ padding: '10px', background: '#f0f4f8' }}>
    {Array.from({ length: 20 }, (_, i) => (
      <Typography key={i} variant="p">Vertical content line {i + 1}</Typography>
    ))}
  </Column>
</Scroll>
        `,
      },
    },
  },
} as Story;
VerticalScrollOnly.play = verticalScrollOnlyActions;

export const HorizontalScrollOnly: Story = {
  name: 'Horizontal Scroll Only',
  args: {
    vertical: 'hidden',
    horizontal: 'auto',
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
    children: wideContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story shows a container with only horizontal scrolling. This is often used for image carousels, timelines, or wide data tables. The vertical scrollbar is hidden.',
      },
      source: {
        code: `
import { Scroll, Row, Typography } from 'gd-design-library';

<Scroll
  vertical="hidden"
  horizontal="auto"
  styles={{ height: 200, width: 300, border: '1px solid #a0aec0' }}
>
  <Row
    height="150px"
    align="center"
    isWrap={false}
    styles={{ padding: '10px', background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)' }}
  >
    {Array.from({ length: 10 }, (_, i) => (
      <Typography key={i} align="center" styles={{ flex: '0 0 100px' }}>
        Item {i + 1}
      </Typography>
    ))}
  </Row>
</Scroll>
        `,
      },
    },
  },
} as Story;
HorizontalScrollOnly.play = horizontalScrollOnlyActions;

export const AutoHideScrollbars: Story = {
  name: 'Auto-Hide Scrollbars',
  args: {
    vertical: 'auto',
    horizontal: 'auto',
    autoHide: true,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
    children: longContent,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the <code>autoHide</code> feature. When enabled, scrollbars will only appear while you are actively scrolling.
They will fade out after 1 second of inactivity, providing a cleaner interface that doesn't distract from the content.
<br/><br/>
<b>Try it:</b> Start scrolling in the container to see the scrollbars appear, then stop scrolling and watch them fade away.
<br/><br/>
This is particularly useful for content-focused interfaces where you want to minimize UI chrome until it's needed.
        `,
      },
      source: {
        code: `
import { Scroll, Column, Typography } from 'gd-design-library';

<Scroll
  vertical="auto"
  horizontal="auto"
  autoHide
  styles={{ height: 200, width: 300, border: '1px solid #a0aec0' }}
>
  <Column
    width="600px"
    styles={{ padding: '10px', background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)' }}
  >
    {Array.from({ length: 20 }, (_, i) => (
      <Typography key={i} variant="p" styles={{ margin: 0, padding: '5px 0' }}>
        Scrollable content line {i + 1}
      </Typography>
    ))}
  </Column>
</Scroll>
        `,
      },
    },
  },
} as Story;
AutoHideScrollbars.play = autoHideScrollbarsActions;

export const AutoHideVerticalOnly: Story = {
  name: 'Auto-Hide Vertical Only',
  args: {
    vertical: 'auto',
    horizontal: 'hidden',
    autoHide: true,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
    children: (
      <Column styles={{ padding: '10px', background: '#f0f4f8' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Typography key={i} variant="p">
            Line {i + 1} - Try scrolling to see the auto-hide scrollbar in action!
          </Typography>
        ))}
      </Column>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example combines vertical-only scrolling with the auto-hide feature. The scrollbar will appear only when scrolling and disappear after inactivity, keeping the interface clean.',
      },
      source: {
        code: `
import { Scroll, Column, Typography } from 'gd-design-library';

<Scroll
  vertical="auto"
  horizontal="hidden"
  autoHide
  styles={{ height: 200, width: 300, border: '1px solid #a0aec0' }}
>
  <Column styles={{ padding: '10px', background: '#f0f4f8' }}>
    {Array.from({ length: 20 }, (_, i) => (
      <Typography key={i} variant="p">
        Line {i + 1} - Try scrolling to see the auto-hide scrollbar in action!
      </Typography>
    ))}
  </Column>
</Scroll>
        `,
      },
    },
  },
} as Story;
AutoHideVerticalOnly.play = autoHideVerticalOnlyActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ scroll: defaultTheme.scroll }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
