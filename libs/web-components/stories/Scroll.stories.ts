import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdScroll } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';
import {
  autoHideScrollbarsActions,
  autoHideVerticalOnlyActions,
  horizontalScrollOnlyActions,
  interactiveExampleActions,
  verticalScrollOnlyActions,
} from './Scroll.stories.play';

type Args = Pick<GdScroll, 'vertical' | 'horizontal' | 'autoHide' | 'styles'> & { children?: string };

// The text and its line number are separate text nodes, exactly as the source story renders `{label} {index}`.
function typography(text: string, styles: Record<string, string | number> = {}, suffix?: number) {
  const node = element('gd-typography', { variant: 'p', styles }, text);
  if (suffix !== undefined) node.append(String(suffix));
  return node;
}

function longContent(background = 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)', prefix = 'Scrollable content line') {
  const column = element('gd-column', {
    width: '600px',
    styles: { padding: '10px', background },
  });
  for (let index = 1; index <= 20; index += 1) {
    column.append(typography(`${prefix} `, { margin: 0, padding: '5px 0' }, index));
  }
  return column;
}

function verticalContent(prefix = 'Vertical content line') {
  const column = element('gd-column', {
    styles: { padding: '10px', background: '#f0f4f8' },
  });
  for (let index = 1; index <= 20; index += 1) column.append(typography(`${prefix} `, {}, index));
  return column;
}

function autoHideVerticalContent() {
  const column = element('gd-column', {
    styles: { padding: '10px', background: '#f0f4f8' },
  });
  for (let index = 1; index <= 20; index += 1) {
    const line = typography('Line ', {}, index);
    line.append(' - Try scrolling to see the auto-hide scrollbar in action!');
    column.append(line);
  }
  return column;
}

function wideContent() {
  const row = element('gd-row', {
    height: '150px',
    align: 'center',
    isWrap: false,
    styles: { padding: '10px', background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)' },
  });
  for (let index = 1; index <= 10; index += 1) {
    row.append(
      (() => {
        const item = element('gd-typography', { align: 'center', styles: { flex: '0 0 100px' } }, 'Item ');
        item.append(String(index));
        return item;
      })()
    );
  }
  return row;
}

function scroll(args: Args, content: HTMLElement) {
  const props: Pick<GdScroll, 'vertical' | 'horizontal' | 'autoHide' | 'styles'> = {
    vertical: args.vertical,
    horizontal: args.horizontal,
    autoHide: args.autoHide,
    styles: args.styles,
  };
  const component = element('gd-scroll', props);
  component.append(content);
  return component;
}

const meta = {
  title: 'Layout & Structure/Scroll',
  component: 'gd-scroll',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '\n  The `Scroll` component is a customizable container that provides styled scrollbars for content that overflows its boundaries.\n  <br/>\n  <br/>\n  <h3>Key Features:</h3>\n  <ul>\n  <li>\n  <b>Scrollbar Control</b>\n  <ul>\n  <li>Independent vertical/horizontal scrollbars</li>\n  <li>Multiple visibility modes</li>\n  <li>Auto-hiding capabilities with smooth fade transitions</li>\n  </ul>\n  </li>\n  <li>\n  <b>Visibility Modes</b>\n  <ul>\n  <li>Auto - Shows scrollbars when needed</li>\n  <li>Hidden - Never shows scrollbars</li>\n  <li>Visible - Always shows scrollbars</li>\n  </ul>\n  </li>\n  <li>\n  <b>Auto-Hide Feature</b>\n  <ul>\n  <li>Scrollbars appear only during scrolling</li>\n  <li>Fade out after 1 second of inactivity</li>\n  <li>Smooth transitions with customizable timing</li>\n  <li>Works with both vertical and horizontal scrollbars</li>\n  </ul>\n  </li>\n  <li><b>Custom Styling</b> - Full control over container appearance</li>\n  <li><b>Content Overflow</b> - Handles both vertical and horizontal overflow</li>\n  </ul>\n  <br/>\n  <h3>Layout Props:</h3>\n  <ul>\n  <li><b>Dimensions</b>\n  <ul>\n  <li><code>width/height</code>: Container size</li>\n  <li><code>maxWidth/maxHeight</code>: Size constraints</li>\n  </ul>\n  </li>\n  <li><b>Spacing</b>\n  <ul>\n  <li><code>margin/padding</code>: Container spacing</li>\n  <li><code>border</code>: Container border styles</li>\n  </ul>\n  </li>\n  <li><code>position</code>: Container positioning</li>\n  <li><code>overflow</code>: Scrollbar behavior control</li>\n  </ul>\n        ',
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
      table: { category: 'Styling', type: { summary: 'CSSProperties' } },
    },
    children: {
      control: false,
      description: 'The content to be rendered within the scroll container.',
      table: { category: 'Content', type: { summary: 'Node' } },
    },
  },
  render: (args: Args) => scroll(args, longContent()),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const standardStyles = `
<script type="module">
  document.querySelector('gd-scroll').styles = {
    height: 200,
    width: 300,
    border: '1px solid #a0aec0',
  };
</script>`;

const storyParameters = (description: string, source: string) => {
  const parameters = formattedSource(source);
  return {
    docs: {
      ...parameters.docs,
      description: { story: description },
    },
  };
};

export const InteractiveExample: Story = {
  name: 'Interactive Example',
  args: {
    vertical: 'auto',
    horizontal: 'auto',
    autoHide: false,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
  },
  parameters: storyParameters(
    'This is the main interactive story. Use the controls in the Addons panel to experiment with different scrollbar visibility modes and container sizes. The content inside is intentionally larger than the container to demonstrate both vertical and horizontal scrolling.',
    `
<gd-scroll vertical="auto" horizontal="auto">
  <gd-column width="600px">
    <gd-typography variant="p">Scrollable content line 1</gd-typography>
    <!-- Repeated through line 20 -->
  </gd-column>
</gd-scroll>
${standardStyles}
  `
  ),
};
InteractiveExample.play = interactiveExampleActions;

export const VerticalScrollOnly: Story = {
  name: 'Vertical Scroll Only',
  args: {
    vertical: 'auto',
    horizontal: 'hidden',
    autoHide: false,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
  },
  render: (args) => scroll(args, verticalContent()),
  parameters: storyParameters(
    'This story demonstrates a common use case where only vertical scrolling is needed. The horizontal scrollbar is explicitly hidden, preventing any horizontal overflow from being visible or scrollable.',
    `
<gd-scroll vertical="auto" horizontal="hidden">
  <gd-column>
    <gd-typography variant="p">Vertical content line 1</gd-typography>
    <!-- Repeated through line 20 -->
  </gd-column>
</gd-scroll>
${standardStyles}
  `
  ),
};
VerticalScrollOnly.play = verticalScrollOnlyActions;

export const HorizontalScrollOnly: Story = {
  name: 'Horizontal Scroll Only',
  args: {
    vertical: 'hidden',
    horizontal: 'auto',
    autoHide: false,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
  },
  render: (args) => scroll(args, wideContent()),
  parameters: storyParameters(
    'This story shows a container with only horizontal scrolling. This is often used for image carousels, timelines, or wide data tables. The vertical scrollbar is hidden.',
    `
<gd-scroll vertical="hidden" horizontal="auto">
  <gd-row height="150px" align="center">
    <gd-typography variant="p">Item 1</gd-typography>
    <!-- Repeated through item 10 -->
  </gd-row>
</gd-scroll>

<script type="module">
  const row = document.querySelector('gd-row');
  row.isWrap = false;
  row.styles = {
    padding: '10px',
    background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)',
  };

  document.querySelector('gd-scroll').styles = {
    height: 200,
    width: 300,
    border: '1px solid #a0aec0',
  };
</script>
  `
  ),
};
HorizontalScrollOnly.play = horizontalScrollOnlyActions;

export const AutoHideScrollbars: Story = {
  name: 'Auto-Hide Scrollbars',
  args: {
    vertical: 'auto',
    horizontal: 'auto',
    autoHide: true,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
  },
  parameters: storyParameters(
    `This story demonstrates the <code>autoHide</code> feature. When enabled, scrollbars will only appear while you are actively scrolling.
They will fade out after 1 second of inactivity, providing a cleaner interface that doesn't distract from the content.
<br/><br/>
<b>Try it:</b> Start scrolling in the container to see the scrollbars appear, then stop scrolling and watch them fade away.
<br/><br/>
This is particularly useful for content-focused interfaces where you want to minimize UI chrome until it's needed.`,
    `
<gd-scroll vertical="auto" horizontal="auto" auto-hide>
  <gd-column width="600px">
    <gd-typography variant="p">Scrollable content line 1</gd-typography>
    <!-- Repeated through line 20 -->
  </gd-column>
</gd-scroll>
${standardStyles}
  `
  ),
};
AutoHideScrollbars.play = autoHideScrollbarsActions;

export const AutoHideVerticalOnly: Story = {
  name: 'Auto-Hide Vertical Only',
  args: {
    vertical: 'auto',
    horizontal: 'hidden',
    autoHide: true,
    styles: { height: 200, width: 300, border: '1px solid #a0aec0' },
  },
  render: (args) => scroll(args, autoHideVerticalContent()),
  parameters: storyParameters(
    'This example combines vertical-only scrolling with the auto-hide feature. The scrollbar will appear only when scrolling and disappear after inactivity, keeping the interface clean.',
    `
<gd-scroll vertical="auto" horizontal="hidden" auto-hide>
  <gd-column>
    <gd-typography variant="p">Line 1 - Try scrolling to see the auto-hide scrollbar in action!</gd-typography>
    <!-- Repeated through line 20 -->
  </gd-column>
</gd-scroll>
${standardStyles}
  `
  ),
};
AutoHideVerticalOnly.play = autoHideVerticalOnlyActions;

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('scroll'),
  parameters: {
    layout: 'padded',
    ...formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.scroll);
    `),
  },
};
