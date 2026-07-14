import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { CardVariant } from '@types';
import { defaultTheme } from '@tokens';
import { Card } from '@components/organisms/Card';
import { RadioGroup } from './RadioGroup';
import { RadioGroupProps, RadioGroupVariant, RadioOption } from './RadioGroup.types';
import {
  defaultActions,
  withColorsActions,
  withCustomItemsActions,
  withGridLayoutActions,
  withHorizontalLayoutActions,
  withImagesAndTooltipActions,
  withVerticalLayoutActions,
} from './RadioGroup.stories.play';

const meta: Meta<typeof RadioGroup> = {
  title: 'Molecules/RadioGroup',
  component: RadioGroup,
  args: {},
  argTypes: {
    // Data
    options: {
      control: 'object',
      description:
        'An array of objects, where each object represents a radio option. Each option *must* have a `label` (string) and `value` (string).' +
        ' \nOptional properties include:\n' +
        ' - `disabled` (boolean): If `true`, the individual radio option will be disabled.\n\n' +
        ' - `hex` (string): A hexadecimal color code. If provided, the radio item will display this as its background color.\n\n' +
        ' - `image` (string): A URL to an image. If provided, the radio item will display this as its background image.\n\n' +
        ' - `tooltip` (string): Text to display in a tooltip when the radio item is hovered over.\n\n' +
        ' - `payload` (T): An optional generic object to attach any additional rich data or values to the option, accessible within `renderOption`.`',
      table: {
        category: 'Data',
        type: { summary: 'RadioOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    value: {
      control: 'text',
      description:
        'The currently selected value for a controlled component. If provided, `onChange` must also be handled.',
      table: {
        category: 'Data',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The initially selected value for an uncontrolled component.',
      table: {
        category: 'Data',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Layout
    variant: {
      control: 'select',
      options: Object.values(RadioGroupVariant),
      description: 'Defines the layout of the radio group items.',
      table: {
        category: 'Layout',
        type: { summary: 'RadioGroupVariant' },
        defaultValue: { summary: 'RadioGroupVariant.Row' },
      },
    },
    itemHeight: {
      control: 'text',
      description: 'Sets a fixed height for each radio item.',
      table: {
        category: 'Layout',
        type: { summary: 'string | number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    itemWidth: {
      control: 'text',
      description: 'Sets a fixed width for each radio item.',
      table: {
        category: 'Layout',
        type: { summary: 'string | number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    gutter: {
      control: 'text',
      description: 'Spacing between radio items when `variant` is `Row` or `Column`. Uses `spacing` tokens.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'spacing.sm' },
      },
    },
    gridColumns: {
      control: 'number',
      description: 'Number of columns for the `Grid` variant.',
      table: {
        category: 'Layout',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    gridRows: {
      control: 'number',
      description: 'Number of rows for the `Grid` variant.',
      table: {
        category: 'Layout',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    gridColumnGutter: {
      control: 'text',
      description: 'Gutter spacing between columns for the `Grid` variant. Uses `spacing` tokens.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    gridRowGutter: {
      control: 'text',
      description: 'Gutter spacing between rows for the `Grid` variant. Uses `spacing` tokens.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Events
    onChange: {
      action: 'changed',
      description: 'Callback function triggered when the selected value changes.',
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Customization
    name: {
      control: 'text',
      description:
        'The `name` attribute applied to all radio inputs in the group. If not provided, a unique name is generated.',
      table: {
        category: 'Customization',
        type: { summary: 'string' },
        defaultValue: { summary: 'auto-generated' },
      },
    },
    renderOption: {
      control: false,
      description:
        'A custom render function for each individual radio option. Provides `option`, `isSelected`, `isDisabled`, and `selectedValue` as arguments.',
      table: {
        category: 'Customization',
        type: { summary: '(args: RenderOptionProps) => ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS-in-JS styles to apply to the top-level container of the RadioGroup.',
      table: {
        category: 'Styling',
        type: { summary: 'CSSObject' },
        defaultValue: { summary: '{}' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant of the radio group items.',
      table: {
        category: 'Styling',
        type: { summary: '"sm" | "md"' },
        defaultValue: { summary: '"md"' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`RadioGroup\` component allows users to select a single option from a set of mutually exclusive choices. It can be rendered in various layouts including rows, columns, or a grid.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Layout Options</b>
  <ul>
  <li>Row layout - Horizontal alignment</li>
  <li>Column layout - Vertical alignment</li>
  <li>Grid layout - Customizable rows and columns</li>
  </ul>
  </li>
  <li><b>Radio Options</b>
  <ul>
  <li>Text labels</li>
  <li>Color swatches</li>
  <li>Images with tooltips</li>
  <li>Custom rendering</li>
  </ul>
  </li>
  <li><b>Controlled/Uncontrolled</b> - Supports both usage patterns</li>
  <li><b>Accessibility</b> - ARIA attributes and keyboard navigation</li>
  <li><b>Customization</b>
  <ul>
  <li>Item dimensions</li>
  <li>Spacing/gutter</li>
  <li>Grid configuration</li>
  <li>Custom styles</li>
  </ul>
  </li>
  </ul>
          `,
      },
    },
  },
  tags: ['autodocs'],
};

type CustomOption = { title: string; subtitle: string; description: string; price: string };

const customOptions: RadioOption<CustomOption>[] = [
  {
    value: 'shipToStore',
    label: 'Ship to Store',
    payload: {
      title: 'Ship to Store',
      subtitle: 'Mar 19 - Mar 20',
      description: '28 available',
      price: 'FREE',
    },
  },
  {
    value: 'delivery',
    label: 'Delivery',
    payload: {
      title: 'Delivery',
      subtitle: 'Mar 22 - Mar 25',
      description: '28 available',
      price: 'FREE',
    },
  },
  {
    value: 'pickupPoint',
    label: 'Ship to Pickup Point',
    payload: {
      title: 'Ship to Pickup Point',
      subtitle: 'Mar 19 - Mar 20',
      description: '28 available',
      price: 'FREE',
    },
  },
];

const sizeOptions: RadioOption[] = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL', disabled: true },
  { value: '2xl', label: '2XL' },
];

const colorOptions: RadioOption[] = [
  { label: '', value: 'yellow', hex: '#FFB800', disabled: true },
  { label: '', value: 'green', hex: '#43A047' },
  { label: '', value: 'red', hex: '#E53935' },
  { label: '', value: 'blue', hex: '#1938e5' },
  { label: '', value: 'orange', hex: '#ff7300' },
  { label: '', value: 'black', hex: '#000' },
  { label: '', value: 'white', hex: '#fff' },
];
const imageOptions: RadioOption[] = [
  { label: '', value: 'imageOption1', image: 'https://picsum.photos/200?random=1', tooltip: 'Image 1' },
  { label: '', value: 'imageOption2', image: 'https://picsum.photos/200?random=2', tooltip: 'Image 2', disabled: true },
  { label: '', value: 'imageOption3', image: 'https://picsum.photos/200?random=3', tooltip: 'Image 3' },
  { label: '', value: 'imageOption4', image: 'https://picsum.photos/200?random=4', tooltip: 'Image 4' },
];

export default meta;
const Template: StoryFn<PropsWithChildren<RadioGroupProps>> = (args) => <RadioGroup {...args} />;

export const Default = Template.bind({});
Default.args = { options: sizeOptions };
Default.play = defaultActions;

export const WithColors = Template.bind({});
WithColors.args = { options: colorOptions, itemHeight: '40px', itemWidth: '40px' };
WithColors.play = withColorsActions;

export const WithImagesAndTooltip = Template.bind({});
WithImagesAndTooltip.args = { options: imageOptions, itemHeight: '40px', itemWidth: '40px' };
WithImagesAndTooltip.play = withImagesAndTooltipActions;

export const WithHorizontalLayout = Template.bind({});
WithHorizontalLayout.args = {
  options: sizeOptions,
  variant: RadioGroupVariant.Row,
  itemHeight: '50px',
  itemWidth: '50px',
};
WithHorizontalLayout.play = withHorizontalLayoutActions;

export const WithVerticalLayout = Template.bind({});
WithVerticalLayout.args = {
  options: sizeOptions,
  variant: RadioGroupVariant.Column,
  itemHeight: '50px',
  itemWidth: '50px',
};
WithVerticalLayout.play = withVerticalLayoutActions;

export const WithGridLayout = Template.bind({});
WithGridLayout.args = {
  options: sizeOptions,
  variant: RadioGroupVariant.Grid,
  gridRows: 2,
  gridColumns: 2,
  gutter: '10px',
};
WithGridLayout.play = withGridLayoutActions;

export const WithCustomItems = Template.bind({});
WithCustomItems.args = {
  options: customOptions,
  renderOption: ({ option }) => {
    const { payload } = option;
    const { title, subtitle, description, price } = payload as CustomOption;
    return (
      <Card width="max-content" padding="10px" isBordered variant={CardVariant.Vertical}>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{subtitle}</Card.Description>
        <Card.Description as="caption" cardVariant="Horizontal" color="text.caption">
          {description}
        </Card.Description>
        <Card.Description color="green">{price}</Card.Description>
      </Card>
    );
  },
};
WithCustomItems.play = withCustomItemsActions;

export const WithSizeVariants: StoryFn<RadioGroupProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div>
      <p style={{ marginBottom: '8px', fontWeight: 600 }}>Small (sm)</p>
      <RadioGroup options={sizeOptions} size="sm" />
    </div>
    <div>
      <p style={{ marginBottom: '8px', fontWeight: 600 }}>Medium (md) - Default</p>
      <RadioGroup options={sizeOptions} size="md" />
    </div>
  </div>
);
WithSizeVariants.parameters = {
  docs: {
    description: {
      story:
        'RadioGroup supports `sm` and `md` size variants, controlling the dimensions and font size of radio items.',
    },
    source: {
      code: `<RadioGroup options={options} size="sm" />
<RadioGroup options={options} size="md" />`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ radiogroup: defaultTheme.radiogroup }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
