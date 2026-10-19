import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdRow, RowAlign, RowJustify } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { boxArgTypes, flexElementArgTypes, formattedSource, type BoxStoryArgs } from './layout-story-helpers';

type Args = BoxStoryArgs & {
  as?: keyof HTMLElementTagNameMap;
  align?: RowAlign;
  justify?: RowJustify;
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
  title: 'Layout & Structure/Row',
  component: 'gd-row',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The dedicated gd-row element preserves alignment, distribution, spacing, wrapping, reversal, Box styles, custom styles, slotted children, and the semantic internal element selected by as. The public custom-element host remains gd-row.',
      },
    },
  },
  args: { as: 'div', align: 'stretch', justify: 'start', gutter: 0, isWrap: true, isReversed: false },
  argTypes: {
    as: {
      control: 'text',
      description: 'Selects the semantic HTML element rendered inside gd-row while preserving all Row styles.',
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
      width: '300px',
      height: '100px',
      padding: '10px',
      overflow: 'auto',
      styles: { backgroundColor: '#f0f0f0' },
    });
    const row = element('gd-row', {
      ...args,
      width: '300px',
      height: '300px',
      paddingTop: '20px',
      paddingBottom: '20px',
      display: 'inline-flex',
    } as Partial<GdRow>);
    row.append(item('Item 1', '#991b1b'), item('Item 2', '#1e40af'), item('Item 3', '#166534'));
    container.append(row);
    return container;
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: formattedSource(`
<gd-flex-container
  width="300px"
  height="100px"
  padding="10px"
  overflow="auto"
>
  <gd-row
    width="300px"
    height="300px"
    padding-top="20px"
    padding-bottom="20px"
    display="inline-flex"
  >
    <div style="background: red; padding: 20px">Item 1</div>
    <div style="background: blue; padding: 20px">Item 2</div>
    <div style="background: green; padding: 20px">Item 3</div>
  </gd-row>
</gd-flex-container>

<script type="module">
  document.querySelector('gd-flex-container').styles = {
    backgroundColor: '#f0f0f0',
  };
</script>
  `),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('row'),
  parameters: formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.row);
  `),
};
