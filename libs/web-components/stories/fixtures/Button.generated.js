// Generated from libs/ui/src/components/atoms/Button/Button.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Button';
const Button = 'gd-button';
const Column = 'Column';
const Typography = 'gd-typography';
const Row = 'Row';
const Icon = 'gd-icon';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
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
};
export default meta;
export const Default = {
  args: {
    children: 'Button',
    variant: 'primary',
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'This is the default interactive story. Use the controls panel to experiment with different props and see how the Button component behaves. Try changing the variant, adding icons, adjusting rounded corners, and toggling states.',
      },
    },
  },
};
export const AllVariants = () => {
  return demo(
    Column,
    { gap: '30px' },
    demo(
      Column,
      { gap: '10px' },
      demo(Typography, { variant: 'h3' }, 'All Button Variants'),
      demo(
        Typography,
        { variant: 'p' },
        'The Button component supports six visual variants: Primary, Secondary, Tertiary, Outlined, Text, and Inherit'
      )
    ),
    demo(
      Column,
      { gap: '20px' },
      demo(
        Column,
        { gap: '10px' },
        demo(Typography, { variant: 'h6' }, 'Basic Variants'),
        demo(
          Row,
          { gutter: '10px', align: 'center' },
          demo(Button, { variant: 'primary' }, 'Primary'),
          demo(Button, { variant: 'secondary' }, 'Secondary'),
          demo(Button, { variant: 'tertiary' }, 'Tertiary'),
          demo(Button, { variant: 'outlined' }, 'Outlined'),
          demo(Button, { variant: 'text' }, 'Text'),
          demo(Button, { variant: 'inherit' }, 'Inherit')
        )
      ),
      demo(
        Column,
        { gap: '10px' },
        demo(Typography, { variant: 'h6' }, 'With Icons'),
        demo(
          Row,
          { gutter: '10px', align: 'center' },
          demo(Button, { variant: 'primary', iconStart: demo(Icon, { name: 'check' }) }, 'Primary'),
          demo(Button, { variant: 'secondary', iconStart: demo(Icon, { name: 'check' }) }, 'Secondary'),
          demo(Button, { variant: 'tertiary', iconStart: demo(Icon, { name: 'check' }) }, 'Tertiary'),
          demo(Button, { variant: 'outlined', iconStart: demo(Icon, { name: 'check' }) }, 'Outlined'),
          demo(Button, { variant: 'text', iconStart: demo(Icon, { name: 'check' }) }, 'Text'),
          demo(Button, { variant: 'inherit', iconStart: demo(Icon, { name: 'check' }) }, 'Inherit')
        )
      ),
      demo(
        Column,
        { gap: '10px' },
        demo(Typography, { variant: 'h6' }, 'Icon Only'),
        demo(
          Row,
          { gutter: '10px', align: 'center' },
          demo(Button, {
            variant: 'primary',
            isIcon: true,
            ariaLabel: 'Primary icon button',
            iconStart: demo(Icon, { name: 'cross' }),
          }),
          demo(Button, {
            variant: 'secondary',
            isIcon: true,
            ariaLabel: 'Secondary icon button',
            iconStart: demo(Icon, { name: 'cross' }),
          }),
          demo(Button, {
            variant: 'tertiary',
            isIcon: true,
            ariaLabel: 'Tertiary icon button',
            iconStart: demo(Icon, { name: 'cross' }),
          }),
          demo(Button, {
            variant: 'outlined',
            isIcon: true,
            ariaLabel: 'Outlined icon button',
            iconStart: demo(Icon, { name: 'cross' }),
          }),
          demo(Button, {
            variant: 'text',
            isIcon: true,
            ariaLabel: 'Text icon button',
            iconStart: demo(Icon, { name: 'cross' }),
          }),
          demo(Button, {
            variant: 'inherit',
            isIcon: true,
            ariaLabel: 'Inherit icon button',
            iconStart: demo(Icon, { name: 'cross' }),
          })
        )
      ),
      demo(
        Column,
        { gap: '10px' },
        demo(Typography, { variant: 'h6' }, 'Disabled State'),
        demo(
          Row,
          { gutter: '10px', align: 'center' },
          demo(Button, { variant: 'primary', disabled: true }, 'Primary'),
          demo(Button, { variant: 'secondary', disabled: true }, 'Secondary'),
          demo(Button, { variant: 'tertiary', disabled: true }, 'Tertiary'),
          demo(Button, { variant: 'outlined', disabled: true }, 'Outlined'),
          demo(Button, { variant: 'text', disabled: true }, 'Text'),
          demo(Button, { variant: 'inherit', disabled: true }, 'Inherit')
        )
      )
    )
  );
};
AllVariants.parameters = {
  layout: 'padded',
  backgrounds: {
    default: 'transparent',
  },
  docs: {
    source: {},
    description: {
      story:
        'A comprehensive showcase of all button variants in different states. This demonstrates the visual hierarchy: Primary for main actions, Secondary for important alternatives, Tertiary for less prominent actions, Outlined for clear boundaries, Text for minimal emphasis, and Inherit for custom styling.',
    },
  },
};
export const WithIcons = {
  args: {
    children: 'Save Changes',
    variant: 'primary',
    iconStart: demo(Icon, { name: 'check' }),
    iconEnd: demo(Icon, { name: 'arrowRight' }),
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'Buttons can include icons at the start and/or end using the `iconStart` and `iconEnd` props. Icons automatically receive proper spacing and alignment. This is useful for adding visual context to button actions.',
      },
    },
  },
};
export const IconOnly = {
  args: {
    variant: 'primary',
    isIcon: true,
    ariaLabel: 'Close',
    iconStart: demo(Icon, { name: 'cross' }),
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'Icon-only buttons use the `isIcon` prop to render with equal width and height. When using `isIcon`, pass the icon via `iconStart` (not as children). Always provide an `ariaLabel` for accessibility.',
      },
    },
  },
};
export const FullWidthButton = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'The `fullWidth` prop makes the button expand to fill its container width. This is commonly used in forms, mobile layouts, and call-to-action sections.',
      },
    },
  },
};
export const RoundedButton = {
  args: {
    children: 'Rounded Button',
    variant: 'primary',
    rounded: 'md',
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'Control border radius using the `rounded` prop with options: none, xs, sm, md, lg, xl, and round (fully rounded). This helps maintain consistent corner styling across your design system.',
      },
    },
  },
};
export const DisabledButton = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'Disabled buttons have reduced opacity and prevent all interactions. Use this state during loading operations or when prerequisites are not met.',
      },
    },
  },
};
export const ButtonStatesUsingClass = {
  args: {
    children: 'Press Me',
    variant: 'primary',
    justifyContent: 'start',
    className: 'active',
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story: 'Button states using classes - active, hover, disabled',
      },
    },
  },
};
export const CustomStyledButton = {
  args: {
    children: 'Custom Styled',
    padding: '8px',
    width: '300px',
    justifyContent: 'start',
    iconStart: demo(Icon, { name: 'folder' }),
    onClick: fn(),
  },
  parameters: {
    docs: {
      source: {},
      description: {
        story:
          'Use the `styles` prop to apply custom CSS properties. The Button component extends Box props, giving you full control over layout, spacing, and styling.',
      },
    },
  },
};
export const RealWorldExamples = () => {
  return demo(
    Column,
    { gap: '40px' },
    demo(
      Column,
      { gap: '10px' },
      demo(Typography, { variant: 'h3' }, 'Real-World Examples'),
      demo(
        Typography,
        { variant: 'p' },
        "Common button patterns and use cases you'll encounter in production applications"
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'Form Actions'),
      demo(
        Row,
        { gutter: '10px', align: 'center' },
        demo(Button, { variant: 'primary', type: 'submit' }, 'Submit'),
        demo(Button, { variant: 'secondary', type: 'button' }, 'Cancel'),
        demo(Button, { variant: 'text', type: 'reset' }, 'Reset')
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'Navigation'),
      demo(
        Row,
        { gutter: '10px', align: 'center' },
        demo(Button, { variant: 'secondary', iconStart: demo(Icon, { name: 'arrowLeft' }) }, 'Back'),
        demo(Button, { variant: 'primary', iconEnd: demo(Icon, { name: 'arrowRight' }) }, 'Continue'),
        demo(Button, { variant: 'text', iconEnd: demo(Icon, { name: 'arrowForward' }) }, 'Skip')
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'File Operations'),
      demo(
        Row,
        { gutter: '10px', align: 'center' },
        demo(Button, { variant: 'primary', iconStart: demo(Icon, { name: 'upload' }) }, 'Upload File'),
        demo(Button, { variant: 'secondary', iconStart: demo(Icon, { name: 'attachment' }) }, 'Attach'),
        demo(Button, { variant: 'outlined', iconStart: demo(Icon, { name: 'folder' }) }, 'Browse')
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'CRUD Actions'),
      demo(
        Row,
        { gutter: '10px', align: 'center' },
        demo(Button, { variant: 'primary', iconStart: demo(Icon, { name: 'check' }) }, 'Save'),
        demo(Button, { variant: 'secondary', iconStart: demo(Icon, { name: 'edit' }) }, 'Edit'),
        demo(Button, { variant: 'outlined', iconStart: demo(Icon, { name: 'deleteOutlined' }) }, 'Delete'),
        demo(Button, { variant: 'text' }, 'Cancel')
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'Social & Feedback'),
      demo(
        Row,
        { gutter: '10px', align: 'center' },
        demo(Button, { variant: 'outlined', iconStart: demo(Icon, { name: 'thumbUpFilled' }) }, 'Like'),
        demo(Button, { variant: 'outlined', iconStart: demo(Icon, { name: 'star' }) }, 'Favorite'),
        demo(Button, { variant: 'outlined', iconStart: demo(Icon, { name: 'send' }) }, 'Share')
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'Toolbar'),
      demo(
        Row,
        { gutter: '10px', align: 'center' },
        demo(Button, { variant: 'text', isIcon: true, ariaLabel: 'Edit', iconStart: demo(Icon, { name: 'edit' }) }),
        demo(Button, { variant: 'text', isIcon: true, ariaLabel: 'Search', iconStart: demo(Icon, { name: 'search' }) }),
        demo(Button, { variant: 'text', isIcon: true, ariaLabel: 'Filter', iconStart: demo(Icon, { name: 'filter' }) }),
        demo(Button, {
          variant: 'text',
          isIcon: true,
          ariaLabel: 'More options',
          iconStart: demo(Icon, { name: 'mobileMenu' }),
        })
      )
    ),
    demo(
      Column,
      { gap: '15px' },
      demo(Typography, { variant: 'h5' }, 'Call-to-Action'),
      demo(
        Column,
        { gap: '10px' },
        demo(
          Button,
          { variant: 'primary', fullWidth: true, rounded: 'md', iconEnd: demo(Icon, { name: 'arrowRight' }) },
          'Get Started'
        ),
        demo(Button, { variant: 'outlined', fullWidth: true, rounded: 'md' }, 'Learn More')
      )
    )
  );
};
RealWorldExamples.parameters = {
  layout: 'padded',
  docs: {
    source: {},
    description: {
      story:
        'Practical examples of button usage in common scenarios including forms, navigation, file operations, CRUD actions, social interactions, toolbars, and call-to-action sections.',
    },
  },
};
export const IsLoading = () =>
  demo(
    Row,
    { gap: '15px', alignItems: 'center' },
    demo(Button, { variant: 'primary', isLoading: true }, 'Primary'),
    demo(Button, { variant: 'outlined', isLoading: true }, 'Outlined'),
    demo(Button, { variant: 'text', isLoading: true }, 'Text')
  );
IsLoading.parameters = {
  docs: {
    description: {
      story: 'When `isLoading` is set, the button displays a loading indicator and prevents interaction.',
    },
    source: {},
  },
};
export const WithAccessibility = AllVariants;
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
    options: {
      rules: {
        'heading-order': { enabled: false },
      },
    },
  },
  docs: {
    disable: true,
  },
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { button: defaultTheme.button } });
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    source: {},
    description: {
      story:
        'View the default theme tokens used by the Button component. These tokens control colors, spacing, borders, and other visual properties across all button variants.',
    },
  },
};
