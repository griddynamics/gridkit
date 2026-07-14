import { PropsWithChildren } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Orientation, SeparatorLabelPosition, SeparatorVariant, SizeVariant } from '@types';
import { Column, Row } from '@components/layout';
import { Card } from '@components';

import { SeparatorProps } from './Separator.types';
import { Separator } from './Separator';

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: Object.values(Orientation),
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
      options: Object.values(SizeVariant),
      description: 'The thickness/size of the separator line.',
      table: {
        type: { summary: 'SizeVariant' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: Object.values(SeparatorVariant),
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
      options: Object.values(SeparatorLabelPosition),
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
  <h3>Layout Props:</h3>
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
};

export default meta;
const Template: StoryFn<PropsWithChildren<SeparatorProps>> = (args) => (
  <div style={{ width: '300px' }}>
    <Separator {...args} />{' '}
  </div>
);

export const Default = Template.bind({});
Default.args = {};

export const WithCustomColor = Template.bind({});
WithCustomColor.args = {
  color: 'brand.500',
};

export const WithDifferentVariants: StoryFn = (args) => {
  return (
    <div style={{ width: '400px' }}>
      <Column gutter={20} align="center">
        <Separator size={SizeVariant.Md} variant={SeparatorVariant.Solid} />
        <Separator size={SizeVariant.Md} variant={SeparatorVariant.Dash} />
        <Separator size={SizeVariant.Md} variant={SeparatorVariant.Dot} />
      </Column>
    </div>
  );
};

export const WithLabel: StoryFn = (args) => {
  return (
    <div style={{ width: '400px' }}>
      <Column gutter={20} align="center">
        <Separator size={SizeVariant.Md} label="Label" labelPosition={SeparatorLabelPosition.Start} />
        <Separator size={SizeVariant.Md} label="Label" labelColor="brand.500" />
        <Separator size={SizeVariant.Md} label="Label" labelPosition={SeparatorLabelPosition.End} />
      </Column>
    </div>
  );
};

export const Vertical: StoryFn = (args) => {
  return (
    <Row gutter={20} align="center">
      <Card padding="20px">
        <Card.Title>Title 1</Card.Title>
        <Card.Description>Description 1</Card.Description>
      </Card>
      <Separator
        size={SizeVariant.Md}
        length="200px"
        variant={SeparatorVariant.Solid}
        orientation={Orientation.Vertical}
      />
      <Card padding="20px">
        <Card.Title>Title 2</Card.Title>
        <Card.Description>Description 2</Card.Description>
      </Card>
    </Row>
  );
};

export const VerticalWithLabel: StoryFn = (args) => {
  return (
    <Row gutter={20} align="center">
      <Card padding="20px">
        <Card.Title>Title 1</Card.Title>
        <Card.Description>Description 1</Card.Description>
      </Card>
      <Separator
        size={SizeVariant.Md}
        length="200px"
        variant={SeparatorVariant.Solid}
        orientation={Orientation.Vertical}
        label="Or"
      />
      <Card padding="20px">
        <Card.Title>Title 2</Card.Title>
        <Card.Description>Description 2</Card.Description>
      </Card>
    </Row>
  );
};

export const WithAccessibility = Default.bind({});
WithAccessibility.args = {
  ...Default.args,
};
WithAccessibility.parameters = {
  ...Default.parameters,
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};
WithAccessibility.tags = ['a11y'];

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ separator: defaultTheme.separator }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
