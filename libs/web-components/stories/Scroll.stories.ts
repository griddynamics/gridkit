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

function typography(text: string, styles: Record<string, string | number> = {}) {
  return element('gd-typography', { variant: 'p', styles }, text);
}

function longContent(background = 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)', prefix = 'Scrollable content line') {
  const column = element('gd-column', {
    width: '600px',
    styles: { padding: '10px', background },
  });
  for (let index = 1; index <= 20; index += 1) {
    column.append(typography(`${prefix} ${index}`, { margin: 0, padding: '5px 0' }));
  }
  return column;
}

function verticalContent(prefix = 'Vertical content line') {
  const column = element('gd-column', {
    styles: { padding: '10px', background: '#f0f4f8' },
  });
  for (let index = 1; index <= 20; index += 1) column.append(typography(`${prefix} ${index}`));
  return column;
}

function autoHideVerticalContent() {
  const column = element('gd-column', {
    styles: { padding: '10px', background: '#f0f4f8' },
  });
  for (let index = 1; index <= 20; index += 1) {
    column.append(typography(`Line ${index} - Try scrolling to see the auto-hide scrollbar in action!`));
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
    row.append(element('gd-typography', { align: 'center', styles: { flex: '0 0 100px' } }, `Item ${index}`));
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
        component: `The <code>Scroll</code> component is a customizable container that provides styled scrollbars for content that overflows its boundaries. It supports independent vertical and horizontal visibility modes, auto-hide timing, custom styles, slotted content, pointer dragging, and the native imperative scrolling surface.`,
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
      control: 'boolean',
      description: 'When true, scrollbars are only visible during scrolling and fade out after 1 second of inactivity.',
      table: {
        category: 'Scrollbar Control',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS styles applied to the scroll container.',
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
  parameters: formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.scroll);
  `),
};
