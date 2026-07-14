import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Column, Icon, Row, Typography } from '@components';
import { ButtonVariant, ButtonTypes, ButtonRole } from '@types';
import { defaultTheme } from '@tokens';

import { Button } from './';
import {
  defaultActions,
  withIconsActions,
  iconOnlyActions,
  disabledButtonActions,
  isLoadingActions,
} from './Button.stories.play';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    // ============================================================================
    // Content & Behavior
    // ============================================================================
    children: {
      description: 'Button content (text or elements)',
      control: 'text',
      table: {
        category: 'Content & Behavior',
        type: { summary: 'ReactNode' },
      },
    },
    onClick: {
      description: 'Click event handler',
      action: 'clicked',
      table: {
        category: 'Content & Behavior',
        type: { summary: '(event: MouseEvent<HTMLButtonElement>) => void' },
      },
    },
    type: {
      description: 'HTML button type attribute',
      control: { type: 'select' },
      options: Object.values(ButtonTypes),
      table: {
        category: 'Content & Behavior',
        defaultValue: { summary: ButtonTypes.Button },
        type: { summary: 'ButtonTypes' },
      },
    },
    disabled: {
      description: 'Disables the button and prevents interaction',
      control: 'boolean',
      table: {
        category: 'Content & Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },

    // ============================================================================
    // Visual Style
    // ============================================================================
    variant: {
      description: 'Visual style variant of the button',
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'primary' },
        type: { summary: 'ButtonVariant' },
      },
    },
    rounded: {
      description: 'Border radius style for the button',
      control: { type: 'select' },
      options: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'none' },
        type: { summary: "'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
      },
    },
    fullWidth: {
      description: 'Makes button take full width of its container',
      control: 'boolean',
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    isIcon: {
      description: 'Renders button as icon-only with equal width and height',
      control: 'boolean',
      table: {
        category: 'Visual Style',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },

    // ============================================================================
    // Icons
    // ============================================================================
    iconStart: {
      description: 'Icon element to display at the start of the button',
      table: {
        category: 'Icons',
        type: { summary: 'ReactNode' },
      },
    },
    iconEnd: {
      description: 'Icon element to display at the end of the button',
      table: {
        category: 'Icons',
        type: { summary: 'ReactNode' },
      },
    },

    // ============================================================================
    // Box Styles - Layout & Sizing
    // ============================================================================
    width: {
      description: 'CSS width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    height: {
      description: 'CSS height property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },
    maxHeight: {
      description: 'CSS max-height property',
      control: 'text',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Spacing
    // ============================================================================
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Box Styles - Spacing',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Flexbox
    // ============================================================================
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },
    alignSelf: {
      description: 'CSS align-self property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    justifySelf: {
      description: 'CSS justify-self property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string' },
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Box Styles - Flexbox',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Box Styles - Position & Display
    // ============================================================================
    display: {
      control: { type: 'select' },
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property to control the layout behavior',
      table: {
        type: { summary: 'string' },
        category: 'Box Styles - Position & Display',
      },
    },
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },
    top: {
      description: 'CSS top property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    right: {
      description: 'CSS right property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    bottom: {
      description: 'CSS bottom property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    left: {
      description: 'CSS left property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },
    zIndex: {
      description: 'CSS z-index property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string | number' },
      },
    },

    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description: 'Custom styles object for the button',
      control: 'object',
      table: {
        category: 'Custom Styling',
        type: { summary: 'BoxCssComponentProps<HTMLButtonElement>' },
      },
    },
    className: {
      description: 'Custom CSS class names',
      control: 'text',
      table: {
        category: 'Custom Styling, predefined classes hover, active, and disabled',
        type: { summary: '("hover" | "active" | "disabled" | string)[]' },
      },
    },

    // ============================================================================
    // Accessibility
    // ============================================================================
    role: {
      description: 'ARIA role for the button',
      control: { type: 'select' },
      options: Object.values(ButtonRole),
      table: {
        category: 'Accessibility',
        defaultValue: { summary: ButtonRole.Button },
        type: { summary: 'ButtonRole' },
      },
    },
    ariaLabel: {
      description: 'Accessibility label for screen readers',
      control: 'text',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
    },
    ariaPressed: {
      description: 'Indicates the pressed state for toggle buttons',
      control: 'boolean',
      table: {
        category: 'Accessibility',
        type: { summary: 'boolean' },
      },
    },
    tabIndex: {
      description: 'Tab index for keyboard navigation',
      control: 'number',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Button\` component is a production-ready, versatile UI element that provides comprehensive interaction patterns while maintaining accessibility best practices and design system consistency.

  <br/>
  <br/>

<h3>🎨 Design Variants</h3>
The Button component offers six distinct visual styles to accommodate different UI hierarchies and use cases:

<ul>
<li><b>Primary:</b> High-emphasis button for main call-to-action elements (e.g., "Submit", "Save", "Continue")</li>
<li><b>Secondary:</b> Medium-emphasis button for important but not primary actions (e.g., "Cancel", "Back")</li>
<li><b>Tertiary:</b> Low-emphasis button for less prominent actions</li>
<li><b>Outlined:</b> Border-only style providing clear boundaries without heavy visual weight</li>
<li><b>Text:</b> Minimal text-only style for subtle interactions and tertiary actions</li>
<li><b>Inherit:</b> Inherits parent styles for maximum flexibility in custom implementations</li>
  </ul>

<br/>

<h3>⚙️ Key Features</h3>
<ul>
<li><b>Icon Integration:</b> Support for leading (\`iconStart\`) and trailing (\`iconEnd\`) icons, plus dedicated icon-only mode with \`isIcon\` prop. When using \`isIcon\`, pass the icon via \`iconStart\` (not as children)</li>
<li><b>Flexible Sizing:</b> Full-width mode via \`fullWidth\` prop, plus support for custom dimensions through Box props</li>
<li><b>Border Radius Control:</b> Eight rounded options from \`none\` to fully \`round\`, enabling consistent corner styling</li>
<li><b>Interactive States:</b> Built-in hover, focus, active, and disabled states with smooth transitions. Use Box props like \`justifyContent\` to control content alignment</li>
<li><b>Box Props Support:</b> Extends Box component props including \`justifyContent\`, \`alignItems\`, \`gap\`, \`margin\`, \`padding\`, and all layout properties for flexible button layouts</li>
<li><b>Custom Styling:</b> Use \`className\` for custom CSS classes and \`styles\` prop for inline styles</li>
<li><b>Theme Integration:</b> Automatic color and spacing inheritance from theme tokens</li>
<li><b>Accessibility First:</b> ARIA attributes, keyboard navigation, focus management, and screen reader support</li>
<li><b>Type Safety:</b> Full TypeScript support with comprehensive prop types</li>
  </ul>

<br/>

<h3>🎯 Common Use Cases</h3>
<ul>
<li><b>Forms:</b> Submit, reset, and cancel actions with appropriate \`type\` attribute</li>
<li><b>Navigation:</b> Page transitions, modal triggers, and menu items</li>
<li><b>Actions:</b> Delete, edit, save, and other CRUD operations</li>
<li><b>Icon Buttons:</b> Close buttons, menu toggles, and toolbar actions using \`isIcon\` mode</li>
<li><b>Call-to-Action:</b> Primary conversion buttons with high visual emphasis</li>
  </ul>

<br/>

<h3>💡 Best Practices</h3>
<ul>
<li><b>Visual Hierarchy:</b> Use Primary for main actions, Secondary for alternatives, and Text for low-priority actions</li>
<li><b>Icon Usage:</b> Always provide \`ariaLabel\` for icon-only buttons. When using \`isIcon\`, pass the icon via \`iconStart\` (not as children)</li>
<li><b>Loading States:</b> Disable buttons during async operations to prevent duplicate submissions</li>
<li><b>Touch Targets:</b> Maintain minimum 44px touch targets for mobile accessibility</li>
<li><b>Consistent Styling:</b> Use theme tokens and rounded variants for design system consistency</li>
<li><b>Box Props:</b> Use \`justifyContent\`, \`alignItems\`, and other Box layout props to control button content alignment and spacing</li>
<li><b>Custom Styling:</b> Use \`className\` for CSS classes and \`styles\` prop for inline styles when needed</li>
<li><b>Interactive States:</b> Buttons automatically handle hover, active, and disabled states with smooth transitions</li>
  </ul>

<br/>

<h3>🔧 Technical Implementation</h3>
Built with React's \`forwardRef\` for proper ref handling, the component integrates seamlessly with the theme system via \`useTheme\` hook. It extends Box component props for flexible layout control and uses styled-components for dynamic theming.
        `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

// ============================================================================
// Interactive Stories (with Controls)
// ============================================================================

export const AllVariants: StoryFn = () => {
  return (
    <Column gap="30px">
      <Column gap="10px">
        <Typography variant="h3">All Button Variants</Typography>
        <Typography variant="p">
          The Button component supports six visual variants: Primary, Secondary, Tertiary, Outlined, Text, and Inherit
        </Typography>
      </Column>

      <Column gap="20px">
        <Column gap="10px">
          <Typography variant="h6">Basic Variants</Typography>
          <Row gutter="10px" align="center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button variant="inherit">Inherit</Button>
          </Row>
        </Column>

        <Column gap="10px">
          <Typography variant="h6">With Icons</Typography>
          <Row gutter="10px" align="center">
            <Button variant="primary" iconStart={<Icon name="check" />}>
              Primary
            </Button>
            <Button variant="secondary" iconStart={<Icon name="check" />}>
              Secondary
            </Button>
            <Button variant="tertiary" iconStart={<Icon name="check" />}>
              Tertiary
            </Button>
            <Button variant="outlined" iconStart={<Icon name="check" />}>
              Outlined
            </Button>
            <Button variant="text" iconStart={<Icon name="check" />}>
              Text
            </Button>
            <Button variant="inherit" iconStart={<Icon name="check" />}>
              Inherit
            </Button>
          </Row>
        </Column>

        <Column gap="10px">
          <Typography variant="h6">Icon Only</Typography>
          <Row gutter="10px" align="center">
            <Button variant="primary" isIcon ariaLabel="Primary icon button" iconStart={<Icon name="cross" />} />
            <Button variant="secondary" isIcon ariaLabel="Secondary icon button" iconStart={<Icon name="cross" />} />
            <Button variant="tertiary" isIcon ariaLabel="Tertiary icon button" iconStart={<Icon name="cross" />} />
            <Button variant="outlined" isIcon ariaLabel="Outlined icon button" iconStart={<Icon name="cross" />} />
            <Button variant="text" isIcon ariaLabel="Text icon button" iconStart={<Icon name="cross" />} />
            <Button variant="inherit" isIcon ariaLabel="Inherit icon button" iconStart={<Icon name="cross" />} />
          </Row>
        </Column>

        <Column gap="10px">
          <Typography variant="h6">Disabled State</Typography>
          <Row gutter="10px" align="center">
            <Button variant="primary" disabled>
              Primary
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="tertiary" disabled>
              Tertiary
            </Button>
            <Button variant="outlined" disabled>
              Outlined
            </Button>
            <Button variant="text" disabled>
              Text
            </Button>
            <Button variant="inherit" disabled>
              Inherit
            </Button>
          </Row>
        </Column>
      </Column>
    </Column>
  );
};
AllVariants.parameters = {
  layout: 'padded',
  backgrounds: {
    default: 'transparent',
  },
  docs: {
    source: {
      code: `<Column gap="30px">
  <Column gap="10px">
    <Typography variant="h3">All Button Variants</Typography>
    <Typography variant="p">The Button component supports six visual variants: Primary, Secondary, Tertiary, Outlined, Text, and Inherit</Typography>
  </Column>
  <Column gap="20px">
    <Column gap="10px">
      <Typography variant="h6">Basic Variants</Typography>
      <Row gutter="10px" align="center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button variant="inherit">Inherit</Button>
      </Row>
    </Column>
    <Column gap="10px">
      <Typography variant="h6">With Icons</Typography>
      <Row gutter="10px" align="center">
        <Button variant="primary" iconStart={<Icon name="check" />}>Primary</Button>
        <Button variant="secondary" iconStart={<Icon name="check" />}>Secondary</Button>
        <Button variant="tertiary" iconStart={<Icon name="check" />}>Tertiary</Button>
        <Button variant="outlined" iconStart={<Icon name="check" />}>Outlined</Button>
        <Button variant="text" iconStart={<Icon name="check" />}>Text</Button>
        <Button variant="inherit" iconStart={<Icon name="check" />}>Inherit</Button>
      </Row>
    </Column>
    <Column gap="10px">
      <Typography variant="h6">Icon Only</Typography>
      <Row gutter="10px" align="center">
        <Button variant="primary" isIcon ariaLabel="Primary icon button" iconStart={<Icon name="cross" />} />
        <Button variant="secondary" isIcon ariaLabel="Secondary icon button" iconStart={<Icon name="cross" />} />
        <Button variant="tertiary" isIcon ariaLabel="Tertiary icon button" iconStart={<Icon name="cross" />} />
        <Button variant="outlined" isIcon ariaLabel="Outlined icon button" iconStart={<Icon name="cross" />} />
        <Button variant="text" isIcon ariaLabel="Text icon button" iconStart={<Icon name="cross" />} />
        <Button variant="inherit" isIcon ariaLabel="Inherit icon button" iconStart={<Icon name="cross" />} />
      </Row>
    </Column>
    <Column gap="10px">
      <Typography variant="h6">Disabled State</Typography>
      <Row gutter="10px" align="center">
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="tertiary" disabled>Tertiary</Button>
        <Button variant="outlined" disabled>Outlined</Button>
        <Button variant="text" disabled>Text</Button>
        <Button variant="inherit" disabled>Inherit</Button>
      </Row>
    </Column>
  </Column>
</Column>`,
    },
    description: {
      story:
        'A comprehensive showcase of all button variants in different states. This demonstrates the visual hierarchy: Primary for main actions, Secondary for important alternatives, Tertiary for less prominent actions, Outlined for clear boundaries, Text for minimal emphasis, and Inherit for custom styling.',
    },
  },
};

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary">Button</Button>`,
      },
      description: {
        story:
          'This is the default interactive story. Use the controls panel to experiment with different props and see how the Button component behaves. Try changing the variant, adding icons, adjusting rounded corners, and toggling states.',
      },
    },
  },
};
Default.play = defaultActions;

export const WithIcons: Story = {
  args: {
    children: 'Save Changes',
    variant: 'primary',
    iconStart: <Icon name="check" />,
    iconEnd: <Icon name="arrowRight" />,
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary" iconStart={<Icon name="check" />} iconEnd={<Icon name="arrowRight" />}>Save Changes</Button>`,
      },
      description: {
        story:
          'Buttons can include icons at the start and/or end using the `iconStart` and `iconEnd` props. Icons automatically receive proper spacing and alignment. This is useful for adding visual context to button actions.',
      },
    },
  },
};
WithIcons.play = withIconsActions;

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    isIcon: true,
    ariaLabel: 'Close',
    iconStart: <Icon name="cross" />,
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary" isIcon ariaLabel="Close" iconStart={<Icon name="cross" />} />`,
      },
      description: {
        story:
          'Icon-only buttons use the `isIcon` prop to render with equal width and height. When using `isIcon`, pass the icon via `iconStart` (not as children). Always provide an `ariaLabel` for accessibility.',
      },
    },
  },
};
IconOnly.play = iconOnlyActions;

export const FullWidthButton: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary" fullWidth>Full Width Button</Button>`,
      },
      description: {
        story:
          'The `fullWidth` prop makes the button expand to fill its container width. This is commonly used in forms, mobile layouts, and call-to-action sections.',
      },
    },
  },
};

export const RoundedButton: Story = {
  args: {
    children: 'Rounded Button',
    variant: 'primary',
    rounded: 'md',
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary" rounded="md">Rounded Button</Button>`,
      },
      description: {
        story:
          'Control border radius using the `rounded` prop with options: none, xs, sm, md, lg, xl, and round (fully rounded). This helps maintain consistent corner styling across your design system.',
      },
    },
  },
};

export const DisabledButton: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary" disabled>Disabled Button</Button>`,
      },
      description: {
        story:
          'Disabled buttons have reduced opacity and prevent all interactions. Use this state during loading operations or when prerequisites are not met.',
      },
    },
  },
};
DisabledButton.play = disabledButtonActions;

export const ButtonStatesUsingClass: Story = {
  args: {
    children: 'Press Me',
    variant: 'primary',
    justifyContent: 'start',
    className: 'active',
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button 
  variant="primary" 
  justifyContent="start"
  className="active"
>
  Press Me
</Button>`,
      },
      description: {
        story: 'Button states using classes - active, hover, disabled',
      },
    },
  },
};

export const CustomStyledButton: Story = {
  args: {
    children: 'Custom Styled',
    padding: '8px',
    width: '300px',
    justifyContent: 'start',
    iconStart: <Icon name="folder" />,
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: `<Button padding="8px" width="300px" justifyContent="start"  iconStart={<Icon name="folder" />}>Custom Styled</Button>`,
      },
      description: {
        story:
          'Use the `styles` prop to apply custom CSS properties. The Button component extends Box props, giving you full control over layout, spacing, and styling.',
      },
    },
  },
};

export const RealWorldExamples: StoryFn = () => {
  return (
    <Column gap="40px">
      <Column gap="10px">
        <Typography variant="h3">Real-World Examples</Typography>
        <Typography variant="p">
          Common button patterns and use cases you'll encounter in production applications
        </Typography>
      </Column>

      {/* Form Actions */}
      <Column gap="15px">
        <Typography variant="h5">Form Actions</Typography>
        <Row gutter="10px" align="center">
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button variant="text" type="reset">
            Reset
          </Button>
        </Row>
      </Column>

      {/* Navigation */}
      <Column gap="15px">
        <Typography variant="h5">Navigation</Typography>
        <Row gutter="10px" align="center">
          <Button variant="secondary" iconStart={<Icon name="arrowLeft" />}>
            Back
          </Button>
          <Button variant="primary" iconEnd={<Icon name="arrowRight" />}>
            Continue
          </Button>
          <Button variant="text" iconEnd={<Icon name="arrowForward" />}>
            Skip
          </Button>
        </Row>
      </Column>

      {/* File Operations */}
      <Column gap="15px">
        <Typography variant="h5">File Operations</Typography>
        <Row gutter="10px" align="center">
          <Button variant="primary" iconStart={<Icon name="upload" />}>
            Upload File
          </Button>
          <Button variant="secondary" iconStart={<Icon name="attachment" />}>
            Attach
          </Button>
          <Button variant="outlined" iconStart={<Icon name="folder" />}>
            Browse
          </Button>
        </Row>
      </Column>

      {/* CRUD Actions */}
      <Column gap="15px">
        <Typography variant="h5">CRUD Actions</Typography>
        <Row gutter="10px" align="center">
          <Button variant="primary" iconStart={<Icon name="check" />}>
            Save
          </Button>
          <Button variant="secondary" iconStart={<Icon name="edit" />}>
            Edit
          </Button>
          <Button variant="outlined" iconStart={<Icon name="deleteOutlined" />}>
            Delete
          </Button>
          <Button variant="text">Cancel</Button>
        </Row>
      </Column>

      {/* Social Actions */}
      <Column gap="15px">
        <Typography variant="h5">Social & Feedback</Typography>
        <Row gutter="10px" align="center">
          <Button variant="outlined" iconStart={<Icon name="thumbUpFilled" />}>
            Like
          </Button>
          <Button variant="outlined" iconStart={<Icon name="star" />}>
            Favorite
          </Button>
          <Button variant="outlined" iconStart={<Icon name="send" />}>
            Share
          </Button>
        </Row>
      </Column>

      {/* Toolbar Actions */}
      <Column gap="15px">
        <Typography variant="h5">Toolbar</Typography>
        <Row gutter="10px" align="center">
          <Button variant="text" isIcon ariaLabel="Edit" iconStart={<Icon name="edit" />} />
          <Button variant="text" isIcon ariaLabel="Search" iconStart={<Icon name="search" />} />
          <Button variant="text" isIcon ariaLabel="Filter" iconStart={<Icon name="filter" />} />
          <Button variant="text" isIcon ariaLabel="More options" iconStart={<Icon name="mobileMenu" />} />
        </Row>
      </Column>

      {/* Call to Action */}
      <Column gap="15px">
        <Typography variant="h5">Call-to-Action</Typography>
        <Column gap="10px">
          <Button variant="primary" fullWidth rounded="md" iconEnd={<Icon name="arrowRight" />}>
            Get Started
          </Button>
          <Button variant="outlined" fullWidth rounded="md">
            Learn More
          </Button>
        </Column>
      </Column>
    </Column>
  );
};
RealWorldExamples.parameters = {
  layout: 'padded',
  docs: {
    source: {
      code: `<Column gap="40px">
  <Column gap="10px">
    <Typography variant="h3">Real-World Examples</Typography>
    <Typography variant="p">Common button patterns and use cases you'll encounter in production applications</Typography>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">Form Actions</Typography>
    <Row gutter="10px" align="center">
      <Button variant="primary" type="submit">Submit</Button>
      <Button variant="secondary" type="button">Cancel</Button>
      <Button variant="text" type="reset">Reset</Button>
    </Row>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">Navigation</Typography>
    <Row gutter="10px" align="center">
      <Button variant="secondary" iconStart={<Icon name="arrowLeft" />}>Back</Button>
      <Button variant="primary" iconEnd={<Icon name="arrowRight" />}>Continue</Button>
      <Button variant="text" iconEnd={<Icon name="arrowForward" />}>Skip</Button>
    </Row>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">File Operations</Typography>
    <Row gutter="10px" align="center">
      <Button variant="primary" iconStart={<Icon name="upload" />}>Upload File</Button>
      <Button variant="secondary" iconStart={<Icon name="attachment" />}>Attach</Button>
      <Button variant="outlined" iconStart={<Icon name="folder" />}>Browse</Button>
    </Row>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">CRUD Actions</Typography>
    <Row gutter="10px" align="center">
      <Button variant="primary" iconStart={<Icon name="check" />}>Save</Button>
      <Button variant="secondary" iconStart={<Icon name="edit" />}>Edit</Button>
      <Button variant="outlined" iconStart={<Icon name="deleteOutlined" />}>Delete</Button>
      <Button variant="text">Cancel</Button>
    </Row>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">Social & Feedback</Typography>
    <Row gutter="10px" align="center">
      <Button variant="outlined" iconStart={<Icon name="thumbUpFilled" />}>Like</Button>
      <Button variant="outlined" iconStart={<Icon name="star" />}>Favorite</Button>
      <Button variant="outlined" iconStart={<Icon name="send" />}>Share</Button>
    </Row>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">Toolbar</Typography>
    <Row gutter="10px" align="center">
      <Button variant="text" isIcon ariaLabel="Edit" iconStart={<Icon name="edit" />} />
      <Button variant="text" isIcon ariaLabel="Search" iconStart={<Icon name="search" />} />
      <Button variant="text" isIcon ariaLabel="Filter" iconStart={<Icon name="filter" />} />
      <Button variant="text" isIcon ariaLabel="More options" iconStart={<Icon name="mobileMenu" />} />
    </Row>
  </Column>
  <Column gap="15px">
    <Typography variant="h5">Call-to-Action</Typography>
    <Column gap="10px">
      <Button variant="primary" fullWidth rounded="md" iconEnd={<Icon name="arrowRight" />}>Get Started</Button>
      <Button variant="outlined" fullWidth rounded="md">Learn More</Button>
    </Column>
  </Column>
</Column>`,
    },
    description: {
      story:
        'Practical examples of button usage in common scenarios including forms, navigation, file operations, CRUD actions, social interactions, toolbars, and call-to-action sections.',
    },
  },
};

export const IsLoading: StoryFn = () => (
  <Row gap="15px" alignItems="center">
    <Button variant="primary" isLoading>
      Primary
    </Button>
    <Button variant="outlined" isLoading>
      Outlined
    </Button>
    <Button variant="text" isLoading>
      Text
    </Button>
  </Row>
);
IsLoading.parameters = {
  docs: {
    description: {
      story: 'When `isLoading` is set, the button displays a loading indicator and prevents interaction.',
    },
    source: {
      code: `<Button variant="primary" isLoading>Primary</Button>
<Button variant="outlined" isLoading>Outlined</Button>
<Button variant="text" isLoading>Text</Button>`,
    },
  },
};
IsLoading.play = isLoadingActions;

export const WithAccessibility: StoryFn = AllVariants;
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
    options: {
      rules: {
        'heading-order': { enabled: false }, // Does not apply on stacked variants
      },
    },
  },
  docs: {
    disable: true,
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ button: defaultTheme.button }} />;
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    source: {
      code: `<TokenViewer tokens={{ button: defaultTheme.button }} />`,
    },
    description: {
      story:
        'View the default theme tokens used by the Button component. These tokens control colors, spacing, borders, and other visual properties across all button variants.',
    },
  },
};
