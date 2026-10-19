import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdSeparator, GdTypography } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';

type Args = Partial<
  Pick<
    GdSeparator,
    'orientation' | 'length' | 'color' | 'size' | 'variant' | 'as' | 'label' | 'labelPosition' | 'labelColor' | 'styles'
  >
>;

type Props = Record<string, unknown>;

// Building blocks composed by the stories (the Column, Row and Card containers).
const layout = (tag: 'gd-row' | 'gd-column' | 'gd-box', props: Props, ...children: Node[]) => {
  const node = element(tag, props);
  node.append(...children);
  return node;
};
const separator = (props: Props) => element('gd-separator', props);
const card = (title: string, description: string) =>
  layout(
    'gd-box',
    { padding: '20px' },
    element('gd-typography', { variant: 'h6', as: 'h3', styleVariant: 'semibold' } as Partial<GdTypography>, title),
    element('gd-typography', { variant: 'small', as: 'p' } as Partial<GdTypography>, description)
  );
const sized = (width: string, ...children: Node[]) => {
  const wrapper = document.createElement('div');
  wrapper.style.width = width;
  wrapper.append(...children);
  return wrapper;
};

const storyParameters = (description: string | undefined, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, ...(description ? { description: { story: description } } : {}) },
});

const meta = {
  title: 'Atoms/Separator',
  component: 'gd-separator',
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'The orientation of the separator.',
      table: {
        type: { summary: 'Orientation' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    styles: {
      control: { type: 'object' },
      description: 'Custom styles for the separator.',
      table: {
        type: { summary: 'CSSProperties' },
      },
      subControls: {
        backgroundColor: {
          control: { type: 'color' },
          description: 'Background color of the separator.',
          table: {
            type: { summary: 'string' },
          },
        },
        border: {
          control: { type: 'text' },
          description: 'Border style of the separator.',
          table: {
            type: { summary: 'string' },
          },
        },
        margin: {
          control: { type: 'text' },
          description: 'Margin around the separator.',
          table: {
            type: { summary: 'string' },
          },
        },
        padding: {
          control: { type: 'text' },
          description: 'Padding within the separator.',
          table: {
            type: { summary: 'string' },
          },
        },
      },
    },
    length: {
      control: { type: 'text' },
      description: 'The length of the separator (e.g., "100px", "50%").',
      table: {
        type: { summary: '`${number}${Unit}`' },
      },
    },
    color: {
      control: { type: 'text' },
      description:
        'The color of the separator line. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path / palette-style alias (e.g., "border.error", "text.secondary", "brand.500", "theme.palette.warning.main").',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'The thickness/size of the separator line.',
      table: {
        type: { summary: 'SizeVariant' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'The visual style variant of the separator (e.g., "solid", "dashed").',
      table: {
        type: { summary: 'SeparatorVariant' },
      },
    },
    as: {
      control: { type: 'select' },
      options: ['div', 'hr', 'span'],
      description: 'The HTML element to render the separator as.',
      table: {
        type: { summary: "'div' | 'hr' | 'span'" },
        defaultValue: { summary: 'div' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Text to display within the separator.',
      table: {
        type: { summary: 'string' },
      },
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'The position of the label when present.',
      table: {
        type: { summary: 'SeparatorLabelPosition' },
        defaultValue: { summary: 'center' },
      },
    },
    labelColor: {
      control: { type: 'text' },
      description:
        'The color of the label text. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path / palette-style alias (e.g., "text.caption", "text.secondary", "brand.500").',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Separator\` component is a visual element used to divide content or sections within a user interface. It can be used as a simple line or include a label to add context, and it's fully customizable.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Flexible Orientation</b> - Support for both horizontal and vertical layouts</li>
  <li><b>Customizable Styling</b> - Various visual variants and color options</li>
  <li><b>Label Support</b> - Optional text labels with positioning control</li>
  <li><b>Semantic Rendering</b> - Can be rendered as different HTML elements</li>
  <li><b>Responsive</b> - Adapts to container width/height</li>
  </ul>

  <br/>
  <h3>Layout Properties:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li>length - Controls the size in primary direction</li>
  <li>size - Controls the thickness</li>
  </ul>
  </li>
  <li><b>Positioning</b>
  <ul>
  <li>orientation - Affects layout direction</li>
  <li>labelPosition - Controls label placement</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
  // Template shared by the stories that only vary the arguments.
  render: (args: Args) => sized('300px', separator(args as Props), document.createTextNode(' ')),
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

const defaultSource = formattedSource(`<div style="width: 300px">
  <gd-separator></gd-separator>
</div>`);

export const Default: Story = {
  args: {},
  parameters: defaultSource,
};

export const WithCustomColor: Story = {
  args: {
    color: 'brand.500',
  },
  parameters: formattedSource(`<div style="width: 300px">
  <gd-separator color="brand.500"></gd-separator>
</div>`),
};

export const WithDifferentVariants: Story = {
  render: () =>
    sized(
      '400px',
      layout(
        'gd-column',
        { gutter: 20, align: 'center' },
        separator({ size: 'md', variant: 'solid' }),
        separator({ size: 'md', variant: 'dashed' }),
        separator({ size: 'md', variant: 'dotted' })
      )
    ),
  parameters: formattedSource(`<div style="width: 400px">
  <gd-column gutter="20" align="center">
    <gd-separator size="md" variant="solid"></gd-separator>
    <gd-separator size="md" variant="dashed"></gd-separator>
    <gd-separator size="md" variant="dotted"></gd-separator>
  </gd-column>
</div>`),
};

export const WithLabel: Story = {
  render: () =>
    sized(
      '400px',
      layout(
        'gd-column',
        { gutter: 20, align: 'center' },
        separator({ size: 'md', label: 'Label', labelPosition: 'start' }),
        separator({ size: 'md', label: 'Label', labelColor: 'brand.500' }),
        separator({ size: 'md', label: 'Label', labelPosition: 'end' })
      )
    ),
  parameters: formattedSource(`<div style="width: 400px">
  <gd-column gutter="20" align="center">
    <gd-separator size="md" label="Label" label-position="start"></gd-separator>
    <gd-separator size="md" label="Label" label-color="brand.500"></gd-separator>
    <gd-separator size="md" label="Label" label-position="end"></gd-separator>
  </gd-column>
</div>`),
};

const verticalSource = (label = '') => `<gd-row gutter="20" align="center">
  <gd-box padding="20px">
    <gd-typography variant="h6" as="h3" style-variant="semibold">Title 1</gd-typography>
    <gd-typography variant="small" as="p">Description 1</gd-typography>
  </gd-box>
  <gd-separator size="md" length="200px" variant="solid" orientation="vertical"${label}></gd-separator>
  <gd-box padding="20px">
    <gd-typography variant="h6" as="h3" style-variant="semibold">Title 2</gd-typography>
    <gd-typography variant="small" as="p">Description 2</gd-typography>
  </gd-box>
</gd-row>`;

export const Vertical: Story = {
  render: () =>
    layout(
      'gd-row',
      { gutter: 20, align: 'center' },
      card('Title 1', 'Description 1'),
      separator({ size: 'md', length: '200px', variant: 'solid', orientation: 'vertical' }),
      card('Title 2', 'Description 2')
    ),
  parameters: formattedSource(verticalSource()),
};

export const VerticalWithLabel: Story = {
  render: () =>
    layout(
      'gd-row',
      { gutter: 20, align: 'center' },
      card('Title 1', 'Description 1'),
      separator({ size: 'md', length: '200px', variant: 'solid', orientation: 'vertical', label: 'Or' }),
      card('Title 2', 'Description 2')
    ),
  parameters: formattedSource(verticalSource(' label="Or"')),
};

export const WithAccessibility: Story = {
  args: {},
  parameters: {
    ...defaultSource,
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('separator'),
  parameters: storyParameters(
    undefined,
    `<!-- Rendered with the TokenViewer helper from the default theme -->
<script type="module">
  import { defaultTheme } from 'gd-design-library/tokens';
  console.log({ separator: defaultTheme.separator });
</script>`,
    { layout: 'padded' }
  ),
};
