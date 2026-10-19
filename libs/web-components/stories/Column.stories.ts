import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { ColumnAlign, ColumnJustify, GdColumn } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { boxArgTypes, flexElementArgTypes, formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = BoxStoryArgs & {
  as?: keyof HTMLElementTagNameMap;
  align?: ColumnAlign;
  justify?: ColumnJustify;
  gutter?: number | string;
  isWrap?: boolean;
  isReversed?: boolean;
};

function item(label: string, background: string) {
  const child = document.createElement('div');
  child.style.cssText = `background:${background};color:#fff;padding:20px`;
  child.textContent = label;
  return child;
}

const meta = {
  title: 'Layout & Structure/Column',
  component: 'gd-column',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The dedicated gd-column element preserves alignment, distribution, spacing, wrapping, reversal, Box styles, custom styles, slotted children, and the semantic internal element selected by as. The public custom-element host remains gd-column.',
      },
    },
  },
  args: { as: 'div', align: 'stretch', justify: 'start', gutter: 0, isWrap: true, isReversed: false },
  argTypes: {
    as: {
      control: 'text',
      description: 'Selects the semantic HTML element rendered inside gd-column while preserving all Column styles.',
      table: {
        defaultValue: { summary: 'div' },
        type: { summary: 'keyof HTMLElementTagNameMap' },
        category: 'Behavior',
      },
    },
    ...boxArgTypes,
    ...flexElementArgTypes,
  },
  render: (args: Args) => {
    const container = element('gd-flex-container', {
      height: '400px',
      styles: { backgroundColor: '#f0f0f0' },
    });
    const column = element('gd-column', {
      ...args,
      align: 'stretch',
      width: '300px',
      height: '300px',
      paddingTop: '20px',
      paddingBottom: '20px',
      isReversed: false,
      isWrap: false,
    } as Partial<GdColumn>);
    column.append(item('Item 1', '#991b1b'), item('Item 2', '#1e40af'), item('Item 3', '#166534'));
    container.append(column);
    return container;
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: formattedSource(`
<gd-flex-container height="400px">
  <gd-column
    align="stretch"
    width="300px"
    height="300px"
    padding-top="20px"
    padding-bottom="20px"
  >
    <div style="background: red; padding: 20px">Item 1</div>
    <div style="background: blue; padding: 20px">Item 2</div>
    <div style="background: green; padding: 20px">Item 3</div>
  </gd-column>
</gd-flex-container>

<script type="module">
  const container = document.querySelector('gd-flex-container');
  container.styles = { backgroundColor: '#f0f0f0' };

  const column = document.querySelector('gd-column');
  column.isWrap = false;
  column.isReversed = false;
</script>
  `),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('column'),
  parameters: formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.column);
  `),
};
