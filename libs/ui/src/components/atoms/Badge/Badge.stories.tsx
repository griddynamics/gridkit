import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Column, Icon, Row, Typography } from '@components';
import { defaultTheme } from '@tokens';

import { Badge } from './';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Badge content (text or elements)',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    variant: {
      description: 'Visual style variant of the badge',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'primary' },
        type: { summary: 'BadgeVariant' },
      },
    },
    disabled: {
      description: 'Whether the badge is disabled',
      control: { type: 'boolean' },
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    appearance: {
      description: 'Visual appearance/style of the badge (filled, filledLight, outline, outlineFilledLight)',
      control: { type: 'select' },
      options: ['outline', 'outlineFilledLight', 'filled', 'filledLight'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'filled' },
        type: { summary: 'BadgeAppearance' },
      },
    },
    size: {
      description: 'Size of the badge (xs, sm, md, lg)',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'md' },
        type: { summary: 'BadgeSize' },
      },
    },
    iconStart: {
      description: 'Icon element to display at the start of the badge',
      control: false,
      table: {
        category: 'Icons',
        type: { summary: 'ReactNode' },
      },
    },
    iconEnd: {
      description: 'Icon element to display at the end of the badge',
      control: false,
      table: {
        category: 'Icons',
        type: { summary: 'ReactNode' },
      },
    },

    // Box Styles
    styles: {
      description: 'CSSObject for custom inline styles',
      control: false,
      table: {
        category: 'Box Styles',
        type: { summary: 'CSSObject' },
      },
    },

    // Box Styles - Display & Overflow
    display: {
      description: 'CSS display property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },

    // Box Styles - Dimensions
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    width: {
      description: 'CSS width property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    height: {
      description: 'CSS height property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    maxHeight: {
      description: 'CSS max-height property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },

    // Box Styles - Spacing (Margin)
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },

    // Box Styles - Spacing (Padding)
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },

    // Box Styles - Positioning
    zIndex: {
      description: 'CSS z-index property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string | number' },
      },
    },
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    top: {
      description: 'CSS top property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    right: {
      description: 'CSS right property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    bottom: {
      description: 'CSS bottom property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    left: {
      description: 'CSS left property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },

    // Box Styles - Flexbox
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    justifySelf: {
      description: 'CSS justify-self property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    alignSelf: {
      description: 'CSS align-self property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Box Styles',
        type: { summary: 'string' },
      },
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`Badge\` component is used to display small pieces of information, such as status indicators, counts, or labels.

<h3>Key Features:</h3>
<ul>
<li><b>Variants:</b> Primary, Secondary, Tertiary, Quaternary, Quinary</li>
<li><b>Appearances:</b> Filled, FilledLight, Outline, OutlineFilledLight</li>
<li><b>Sizes:</b> Extra Small (xs), Small (sm), Medium (md), Large (lg)</li>
<li><b>Icons:</b> Support for start and end icons</li>
<li><b>Disabled:</b> Support for disabled state</li>
<li><b>Flexible:</b> Consumes Box styles for full layout control</li>
</ul>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
  parameters: {
    docs: {
      source: {
        code: `<Badge>Badge</Badge>`,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Row gap="16px" alignItems="center">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </Row>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge component in all available sizes: extra small, small, medium, and large.',
      },
      source: {
        code: `<Row gap="16px" alignItems="center">
  <Badge size="xs">Extra Small</Badge>
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
  <Badge size="lg">Large</Badge>
</Row>`,
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Column gap="16px">
      <Row gap="16px" alignItems="center">
        <Typography>Primary:</Typography>
        <Badge>Primary</Badge>
        <Badge variant="primary" appearance="filledLight">
          Primary Light
        </Badge>
        <Badge variant="primary" appearance="outline">
          Primary Outline
        </Badge>
        <Badge variant="primary" appearance="outlineFilledLight">
          Primary Outline Filled Light
        </Badge>
      </Row>
      <Row gap="16px" alignItems="center">
        <Typography>Secondary:</Typography>
        <Badge variant="secondary" appearance="filled">
          Secondary
        </Badge>
        <Badge variant="secondary" appearance="filledLight">
          Secondary Light
        </Badge>
        <Badge variant="secondary" appearance="outline">
          Secondary Outline
        </Badge>
        <Badge variant="secondary" appearance="outlineFilledLight">
          Secondary Outline Filled Light
        </Badge>
      </Row>
      <Row gap="16px" alignItems="center">
        <Typography>Tertiary:</Typography>
        <Badge variant="tertiary" appearance="filled">
          Tertiary
        </Badge>
        <Badge variant="tertiary" appearance="filledLight">
          Tertiary Light
        </Badge>
        <Badge variant="tertiary" appearance="outline">
          Tertiary Outline
        </Badge>
        <Badge variant="tertiary" appearance="outlineFilledLight">
          Tertiary Outline Filled Light
        </Badge>
      </Row>
      <Row gap="16px" alignItems="center">
        <Typography>Quaternary:</Typography>
        <Badge variant="quaternary" appearance="filled">
          Quaternary
        </Badge>
        <Badge variant="quaternary" appearance="filledLight">
          Quaternary Light
        </Badge>
        <Badge variant="quaternary" appearance="outline">
          Quaternary Outline
        </Badge>
        <Badge variant="quaternary" appearance="outlineFilledLight">
          Quaternary Outline Filled Light
        </Badge>
      </Row>
      <Row gap="16px" alignItems="center">
        <Typography>Quinary:</Typography>
        <Badge variant="quinary" appearance="filled">
          Quinary
        </Badge>
        <Badge variant="quinary" appearance="filledLight">
          Quinary Light
        </Badge>
        <Badge variant="quinary" appearance="outline">
          Quinary Outline
        </Badge>
        <Badge variant="quinary" appearance="outlineFilledLight">
          Quinary Outline Filled Light
        </Badge>
      </Row>
    </Column>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants and options displayed together.',
      },
      source: {
        code: `<Column gap="16px">
  <Row gap="16px" alignItems="center">
    <Typography>Primary:</Typography>
    <Badge>Primary</Badge>
    <Badge variant="primary" appearance="filledLight">Primary Light</Badge>
    <Badge variant="primary" appearance="outline">Primary Outline</Badge>
    <Badge variant="primary" appearance="outlineFilledLight">Primary Outline Filled Light</Badge>
  </Row>
  <Row gap="16px" alignItems="center">
    <Typography>Secondary:</Typography>
    <Badge variant="secondary" appearance="filled">Secondary</Badge>
    <Badge variant="secondary" appearance="filledLight">Secondary Light</Badge>
    <Badge variant="secondary" appearance="outline">Secondary Outline</Badge>
    <Badge variant="secondary" appearance="outlineFilledLight">Secondary Outline Filled Light</Badge>
  </Row>
  <Row gap="16px" alignItems="center">
    <Typography>Tertiary:</Typography>
    <Badge variant="tertiary" appearance="filled">Tertiary</Badge>
    <Badge variant="tertiary" appearance="filledLight">Tertiary Light</Badge>
    <Badge variant="tertiary" appearance="outline">Tertiary Outline</Badge>
    <Badge variant="tertiary" appearance="outlineFilledLight">Tertiary Outline Filled Light</Badge>
  </Row>
  <Row gap="16px" alignItems="center">
    <Typography>Quaternary:</Typography>
    <Badge variant="quaternary" appearance="filled">Quaternary</Badge>
    <Badge variant="quaternary" appearance="filledLight">Quaternary Light</Badge>
    <Badge variant="quaternary" appearance="outline">Quaternary Outline</Badge>
    <Badge variant="quaternary" appearance="outlineFilledLight">Quaternary Outline Filled Light</Badge>
  </Row>
  <Row gap="16px" alignItems="center">
    <Typography>Quinary:</Typography>
    <Badge variant="quinary" appearance="filled">Quinary</Badge>
    <Badge variant="quinary" appearance="filledLight">Quinary Light</Badge>
    <Badge variant="quinary" appearance="outline">Quinary Outline</Badge>
    <Badge variant="quinary" appearance="outlineFilledLight">Quinary Outline Filled Light</Badge>
  </Row>
</Column>`,
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <Row gap="16px" alignItems="center">
      <Badge iconStart={<Icon name="success" size="md" />}>With Start Icon</Badge>
      <Badge variant="secondary" iconEnd={<Icon name="warning" size="md" />}>
        With End Icon
      </Badge>
      <Badge
        variant="tertiary"
        appearance="filled"
        iconStart={<Icon name="info" size="md" />}
        iconEnd={<Icon name="arrowRight" size="md" />}
      >
        Both Icons
      </Badge>
      <Badge variant="quaternary" iconStart={<Icon name="error" size="md" />}>
        Quaternary with Icon
      </Badge>
      <Badge variant="quinary" iconStart={<Icon name="accountCircle" size="md" />}>
        Quinary with Icon
      </Badge>
    </Row>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with start and end icons.',
      },
      source: {
        code: `<Row gap="16px" alignItems="center">
    <Badge iconStart={<Icon name="success" size="md" />}>With Start Icon</Badge>
    <Badge variant="secondary" iconEnd={<Icon name="warning" size="md" />}>
      With End Icon
    </Badge>
    <Badge
      variant="tertiary"
      appearance="filled"
      iconStart={<Icon name="info" size="md" />}
      iconEnd={<Icon name="arrowRight" size="md" />}
    >
      Both Icons
    </Badge>
    <Badge variant="quaternary" iconStart={<Icon name="error" size="md" />}>
      Quaternary with Icon
    </Badge>
    <Badge variant="quinary" iconStart={<Icon name="accountCircle" size="md" />}>
      Quinary with Icon
    </Badge>
  </Row>`,
      },
    },
  },
};

export const WithBoxStyles: Story = {
  render: () => (
    <Row gap="16px" alignItems="center">
      <Badge appearance="outline" margin="8px">
        With Margin
      </Badge>
      <Badge variant="secondary" appearance="outline" padding="12px 24px">
        Custom Padding
      </Badge>
      <Badge variant="tertiary" appearance="outline" width="200px" justifyContent="center">
        Fixed Width
      </Badge>
    </Row>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with custom Box styles for layout control.',
      },
      source: {
        code: `<Row gap="16px" alignItems="center">
  <Badge appearance="outline" margin="8px">
    With Margin
  </Badge>
  <Badge variant="secondary" appearance="outline" padding="12px 24px">
    Custom Padding
  </Badge>
  <Badge variant="tertiary" appearance="outline" width="200px" justifyContent="center">
    Fixed Width
  </Badge>
</Row>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <Column gap="16px">
      <Row gap="16px" alignItems="center">
        <Typography>All Variants Disabled:</Typography>
        <Badge variant="primary" appearance="filled" disabled>
          Primary
        </Badge>
        <Badge variant="secondary" appearance="filled" disabled>
          Secondary
        </Badge>
        <Badge variant="tertiary" appearance="filled" disabled>
          Tertiary
        </Badge>
        <Badge variant="quaternary" appearance="filled" disabled>
          Quaternary
        </Badge>
        <Badge variant="quinary" appearance="filled" disabled>
          Quinary
        </Badge>
      </Row>
      <Row gap="16px" alignItems="center">
        <Typography>All Appearances Disabled:</Typography>
        <Badge variant="primary" appearance="filled" disabled>
          Filled
        </Badge>
        <Badge variant="primary" appearance="filledLight" disabled>
          Filled Light
        </Badge>
        <Badge variant="primary" appearance="outline" disabled>
          Outline
        </Badge>
        <Badge variant="primary" appearance="outlineFilledLight" disabled>
          Outline Filled Light
        </Badge>
      </Row>
      <Row gap="16px" alignItems="center">
        <Typography>Sizes Disabled:</Typography>
        <Badge variant="primary" appearance="filled" size="xs" disabled>
          Extra Small
        </Badge>
        <Badge variant="primary" appearance="filled" size="sm" disabled>
          Small
        </Badge>
        <Badge variant="primary" appearance="filled" size="md" disabled>
          Medium
        </Badge>
        <Badge variant="primary" appearance="filled" size="lg" disabled>
          Large
        </Badge>
        <Badge variant="primary" appearance="filled" disabled iconStart={<Icon name="check" size="md" />}>
          With Icon
        </Badge>
      </Row>
    </Column>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge component in disabled state across all variants, appearances, and sizes.',
      },
      source: {
        code: `<Column gap="16px">
  <Row gap="16px" alignItems="center">
    <Typography>All Variants Disabled:</Typography>
    <Badge variant="primary" appearance="filled" disabled>Primary</Badge>
    <Badge variant="secondary" appearance="filled" disabled>Secondary</Badge>
    <Badge variant="tertiary" appearance="filled" disabled>Tertiary</Badge>
    <Badge variant="quaternary" appearance="filled" disabled>Quaternary</Badge>
    <Badge variant="quinary" appearance="filled" disabled>Quinary</Badge>
  </Row>
  <Row gap="16px" alignItems="center">
    <Typography>All Appearances Disabled:</Typography>
    <Badge variant="primary" appearance="filled" disabled>Filled</Badge>
    <Badge variant="primary" appearance="filledLight" disabled>Filled Light</Badge>
    <Badge variant="primary" appearance="outline" disabled>Outline</Badge>
    <Badge variant="primary" appearance="outlineFilledLight" disabled>Outline Filled Light</Badge>
  </Row>
  <Row gap="16px" alignItems="center">
    <Typography>Sizes Disabled:</Typography>
    <Badge variant="primary" appearance="filled" size="xs" disabled>Extra Small</Badge>
    <Badge variant="primary" appearance="filled" size="sm" disabled>Small</Badge>
    <Badge variant="primary" appearance="filled" size="md" disabled>Medium</Badge>
    <Badge variant="primary" appearance="filled" disabled iconStart={<Icon name="check" size="md" />}>
      With Icon
    </Badge>
  </Row>
</Column>`,
      },
    },
  },
};

export const WithAccessibility: Story = {
  ...Variants,
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ badge: defaultTheme.badge }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
