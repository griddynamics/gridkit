import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GdButton, GdIcon, GdTypography } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';
import {
  defaultActions,
  disabledButtonActions,
  iconOnlyActions,
  isLoadingActions,
  withIconsActions,
} from './Button.stories.play';

type Props = Record<string, unknown>;
type Args = Pick<
  GdButton,
  | 'variant'
  | 'rounded'
  | 'disabled'
  | 'isLoading'
  | 'isIcon'
  | 'fullWidth'
  | 'type'
  | 'role'
  | 'tabIndex'
  | 'ariaLabel'
  | 'justifyContent'
  | 'styles'
> & {
  children?: string;
  iconStart?: Node;
  iconEnd?: Node;
  ariaPressed?: boolean | string | null;
  className?: string;
  onClick?: (event: Event) => void;
} & Record<string, unknown>;

// Building blocks composed by the source stories (Column, Row, Typography, Icon).
const typography = (variant: GdTypography['variant'], text: string) => element('gd-typography', { variant }, text);
const row = (props: Props, ...children: Node[]) => {
  const node = element('gd-row', props);
  node.append(...children);
  return node;
};
const column = (props: Props, ...children: Node[]) => {
  const node = element('gd-column', props);
  node.append(...children);
  return node;
};
const icon = (name: string, slot: 'icon-start' | 'icon-end') => {
  const node = element('gd-icon', { name } as Partial<GdIcon>);
  node.slot = slot;
  return node;
};

type ButtonOptions = { start?: string; end?: string };
const button = (props: Props, label: string | undefined, { start, end }: ButtonOptions = {}) => {
  const node = element('gd-button', props as Partial<GdButton>, label ?? '');
  if (start) node.append(icon(start, 'icon-start'));
  if (end) node.append(icon(end, 'icon-end'));
  return node;
};

const storyParameters = (description: string, source: string, extra: Props = {}) => ({
  ...extra,
  docs: { ...formattedSource(source).docs, description: { story: description } },
});

const variants = ['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit'] as const;
const label = (variant: string) => variant[0].toUpperCase() + variant.slice(1);

// The Box style arguments are forwarded to the button element through its `styles` property.
const boxStyleArgTypes = [
  ['Box Styles - Layout & Sizing', 'width', 'string | number'],
  ['Box Styles - Layout & Sizing', 'height', 'string | number'],
  ['Box Styles - Layout & Sizing', 'minWidth', 'string | number'],
  ['Box Styles - Layout & Sizing', 'minHeight', 'string | number'],
  ['Box Styles - Layout & Sizing', 'maxWidth', 'string | number'],
  ['Box Styles - Layout & Sizing', 'maxHeight', 'string | number'],
  ['Box Styles - Spacing', 'margin', 'string | number'],
  ['Box Styles - Spacing', 'marginTop', 'string | number'],
  ['Box Styles - Spacing', 'marginRight', 'string | number'],
  ['Box Styles - Spacing', 'marginBottom', 'string | number'],
  ['Box Styles - Spacing', 'marginLeft', 'string | number'],
  ['Box Styles - Spacing', 'padding', 'string | number'],
  ['Box Styles - Spacing', 'paddingTop', 'string | number'],
  ['Box Styles - Spacing', 'paddingRight', 'string | number'],
  ['Box Styles - Spacing', 'paddingBottom', 'string | number'],
  ['Box Styles - Spacing', 'paddingLeft', 'string | number'],
  ['Box Styles - Flexbox', 'flexDirection', 'string'],
  ['Box Styles - Flexbox', 'justifyContent', 'string'],
  ['Box Styles - Flexbox', 'alignItems', 'string'],
  ['Box Styles - Flexbox', 'alignContent', 'string'],
  ['Box Styles - Flexbox', 'flexWrap', 'string'],
  ['Box Styles - Flexbox', 'gap', 'string | number'],
  ['Box Styles - Flexbox', 'flex', 'string | number'],
  ['Box Styles - Flexbox', 'flexGrow', 'string | number'],
  ['Box Styles - Flexbox', 'flexShrink', 'string | number'],
  ['Box Styles - Flexbox', 'flexBasis', 'string | number'],
  ['Box Styles - Flexbox', 'alignSelf', 'string'],
  ['Box Styles - Flexbox', 'justifySelf', 'string'],
  ['Box Styles - Flexbox', 'order', 'string | number'],
  ['Box Styles - Position & Display', 'display', 'string'],
  ['Box Styles - Position & Display', 'position', 'string'],
  ['Box Styles - Position & Display', 'top', 'string | number'],
  ['Box Styles - Position & Display', 'right', 'string | number'],
  ['Box Styles - Position & Display', 'bottom', 'string | number'],
  ['Box Styles - Position & Display', 'left', 'string | number'],
  ['Box Styles - Position & Display', 'overflow', 'string'],
  ['Box Styles - Position & Display', 'zIndex', 'string | number'],
] as const;
const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const boxArgTypes = Object.fromEntries(
  boxStyleArgTypes.map(([category, name, type]) => [
    name,
    name === 'display'
      ? {
          control: { type: 'select' },
          options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
          description: 'CSS display property to control the layout behavior',
          table: { type: { summary: type }, category },
        }
      : {
          description: `CSS ${kebab(name)} property`,
          control: 'text',
          table: { category, type: { summary: type } },
        },
  ])
);
// `justifyContent` is consumed by the button content, like in the source component.
const boxStyleNames: readonly string[] = boxStyleArgTypes
  .map(([, name]) => name)
  .filter((name) => name !== 'justifyContent');

const meta = {
  title: 'Atoms/Button',
  component: 'gd-button',
  tags: ['autodocs'],
  argTypes: {
    // ============================================================================
    // Content & Behavior
    // ============================================================================
    children: {
      description: 'Button content (text or elements, default slot)',
      control: 'text',
      table: {
        category: 'Content & Behavior',
        type: { summary: 'Node' },
      },
    },
    onClick: {
      description: 'Click event handler',
      action: 'clicked',
      table: {
        category: 'Content & Behavior',
        type: { summary: '(event: MouseEvent) => void' },
      },
    },
    type: {
      description: 'HTML button type attribute',
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      table: {
        category: 'Content & Behavior',
        defaultValue: { summary: 'button' },
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
      options: variants,
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
      description: 'Icon element to display at the start of the button (icon-start slot)',
      table: {
        category: 'Icons',
        type: { summary: 'Node' },
      },
    },
    iconEnd: {
      description: 'Icon element to display at the end of the button (icon-end slot)',
      table: {
        category: 'Icons',
        type: { summary: 'Node' },
      },
    },

    // ============================================================================
    // Box Styles
    // ============================================================================
    ...boxArgTypes,

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
      options: ['button', 'link', 'checkbox', 'switch', 'tab'],
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'button' },
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
<li><b>Icon Integration:</b> Support for leading (\`icon-start\` slot) and trailing (\`icon-end\` slot) icons, plus dedicated icon-only mode with \`isIcon\` prop. When using \`isIcon\`, pass the icon through the \`icon-start\` slot (not as default content)</li>
<li><b>Flexible Sizing:</b> Full-width mode via \`fullWidth\` prop, plus support for custom dimensions through Box props</li>
<li><b>Border Radius Control:</b> Eight rounded options from \`none\` to fully \`round\`, enabling consistent corner styling</li>
<li><b>Interactive States:</b> Built-in hover, focus, active, and disabled states with smooth transitions. Use Box props like \`justifyContent\` to control content alignment</li>
<li><b>Box Props Support:</b> Extends Box component props including \`justifyContent\`, \`alignItems\`, \`gap\`, \`margin\`, \`padding\`, and all layout properties for flexible button layouts</li>
<li><b>Custom Styling:</b> Use \`class\` for custom CSS classes and the \`styles\` property for inline styles</li>
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
<li><b>Icon Usage:</b> Always provide \`ariaLabel\` for icon-only buttons. When using \`isIcon\`, pass the icon through the \`icon-start\` slot (not as default content)</li>
<li><b>Loading States:</b> Disable buttons during async operations to prevent duplicate submissions</li>
<li><b>Touch Targets:</b> Maintain minimum 44px touch targets for mobile accessibility</li>
<li><b>Consistent Styling:</b> Use theme tokens and rounded variants for design system consistency</li>
<li><b>Box Props:</b> Use \`justifyContent\`, \`alignItems\`, and other Box layout props to control button content alignment and spacing</li>
<li><b>Custom Styling:</b> Use \`class\` for CSS classes and the \`styles\` property for inline styles when needed</li>
<li><b>Interactive States:</b> Buttons automatically handle hover, active, and disabled states with smooth transitions</li>
  </ul>

<br/>

<h3>🔧 Technical Implementation</h3>
Built as the \`gd-button\` custom element, the component integrates with the theme system through the \`theme\` property. It extends Box component props for flexible layout control and generates its styles from the shared design tokens inside its shadow root.
        `,
      },
    },
  },
  render: ({ children, iconStart, iconEnd, onClick, className, ariaPressed, styles, ...props }: Args) => {
    const box = Object.fromEntries(
      Object.entries(props).filter(
        ([name, value]) => boxStyleNames.includes(name) && value !== undefined && value !== ''
      )
    );
    const own = Object.fromEntries(
      Object.entries(props).filter(([name, value]) => !boxStyleNames.includes(name) && value !== undefined)
    );
    const node = button(
      {
        ...own,
        ...(ariaPressed === undefined || ariaPressed === null ? {} : { ariaPressed: String(ariaPressed) }),
        styles: { ...box, ...(styles ?? {}) },
      },
      children
    );
    if (className) node.className = String(className);
    if (typeof onClick === 'function') node.addEventListener('click', onClick);
    if (iconStart) node.append(iconStart);
    if (iconEnd) node.append(iconEnd);
    return node;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

// ============================================================================
// Interactive Stories (with Controls)
// ============================================================================

const variantRow = (render: (variant: (typeof variants)[number]) => HTMLElement) =>
  row({ gutter: '10px', align: 'center' }, ...variants.map(render));

// `WithAccessibility` reuses this story, and its accessibility parameters apply to both.
export const AllVariants: Story = {
  render: () =>
    column(
      { gap: '30px' },
      column(
        { gap: '10px' },
        typography('h3', 'All Button Variants'),
        typography(
          'p',
          'The Button component supports six visual variants: Primary, Secondary, Tertiary, Outlined, Text, and Inherit'
        )
      ),
      column(
        { gap: '20px' },
        column(
          { gap: '10px' },
          typography('h6', 'Basic Variants'),
          variantRow((variant) => button({ variant }, label(variant)))
        ),
        column(
          { gap: '10px' },
          typography('h6', 'With Icons'),
          variantRow((variant) => button({ variant }, label(variant), { start: 'check' }))
        ),
        column(
          { gap: '10px' },
          typography('h6', 'Icon Only'),
          variantRow((variant) =>
            button({ variant, isIcon: true, ariaLabel: `${label(variant)} icon button` }, undefined, { start: 'cross' })
          )
        ),
        column(
          { gap: '10px' },
          typography('h6', 'Disabled State'),
          variantRow((variant) => button({ variant, disabled: true }, label(variant)))
        )
      )
    ),
  parameters: {
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
  },
};

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    onClick: fn(),
  },
  parameters: storyParameters(
    'This is the default interactive story. Use the controls panel to experiment with different props and see how the Button component behaves. Try changing the variant, adding icons, adjusting rounded corners, and toggling states.',
    `<gd-button variant="primary">Button</gd-button>`
  ),
  play: defaultActions,
};

export const WithIcons: Story = {
  args: {
    children: 'Save Changes',
    variant: 'primary',
    onClick: fn(),
  },
  render: (args, context) => {
    const node = meta.render({
      ...args,
      iconStart: icon('check', 'icon-start'),
      iconEnd: icon('arrowRight', 'icon-end'),
    });
    return context ? node : node;
  },
  parameters: storyParameters(
    'Buttons can include icons at the start and/or end using the `icon-start` and `icon-end` slots. Icons automatically receive proper spacing and alignment. This is useful for adding visual context to button actions.',
    `<gd-button variant="primary">
  <gd-icon slot="icon-start" name="check"></gd-icon>
  Save Changes
  <gd-icon slot="icon-end" name="arrowRight"></gd-icon>
</gd-button>`
  ),
  play: withIconsActions,
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    isIcon: true,
    ariaLabel: 'Close',
    onClick: fn(),
  },
  render: (args) => meta.render({ ...args, iconStart: icon('cross', 'icon-start') }),
  parameters: storyParameters(
    'Icon-only buttons use the `isIcon` prop to render with equal width and height. When using `isIcon`, pass the icon through the `icon-start` slot (not as default content). Always provide an `ariaLabel` for accessibility.',
    `<gd-button variant="primary" is-icon aria-label="Close">
  <gd-icon slot="icon-start" name="cross"></gd-icon>
</gd-button>`
  ),
  play: iconOnlyActions,
};

export const FullWidthButton: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
    onClick: fn(),
  },
  parameters: storyParameters(
    'The `fullWidth` prop makes the button expand to fill its container width. This is commonly used in forms, mobile layouts, and call-to-action sections.',
    `<gd-button variant="primary" full-width>Full Width Button</gd-button>`
  ),
};

export const RoundedButton: Story = {
  args: {
    children: 'Rounded Button',
    variant: 'primary',
    rounded: 'md',
    onClick: fn(),
  },
  parameters: storyParameters(
    'Control border radius using the `rounded` prop with options: none, xs, sm, md, lg, xl, and round (fully rounded). This helps maintain consistent corner styling across your design system.',
    `<gd-button variant="primary" rounded="md">Rounded Button</gd-button>`
  ),
};

export const DisabledButton: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
  parameters: storyParameters(
    'Disabled buttons have reduced opacity and prevent all interactions. Use this state during loading operations or when prerequisites are not met.',
    `<gd-button variant="primary" disabled>Disabled Button</gd-button>`
  ),
  play: disabledButtonActions,
};

export const ButtonStatesUsingClass: Story = {
  args: {
    children: 'Press Me',
    variant: 'primary',
    justifyContent: 'start',
    className: 'active',
    onClick: fn(),
  },
  parameters: storyParameters(
    'Button states using classes - active, hover, disabled',
    `<gd-button variant="primary" justify-content="start" class="active">
  Press Me
</gd-button>`
  ),
};

export const CustomStyledButton: Story = {
  args: {
    children: 'Custom Styled',
    padding: '8px',
    width: '300px',
    justifyContent: 'start',
    onClick: fn(),
  },
  render: (args) => meta.render({ ...args, iconStart: icon('folder', 'icon-start') }),
  parameters: storyParameters(
    'Use the `styles` prop to apply custom CSS properties. The Button component extends Box props, giving you full control over layout, spacing, and styling.',
    `<gd-button id="custom" justify-content="start">
  <gd-icon slot="icon-start" name="folder"></gd-icon>
  Custom Styled
</gd-button>

<script type="module">
  document.getElementById('custom').styles = { padding: '8px', width: '300px' };
</script>`
  ),
};

const section = (title: string, ...children: Node[]) =>
  column({ gap: '15px' }, typography('h5', title), row({ gutter: '10px', align: 'center' }, ...children));

export const RealWorldExamples: Story = {
  render: () =>
    column(
      { gap: '40px' },
      column(
        { gap: '10px' },
        typography('h3', 'Real-World Examples'),
        typography('p', "Common button patterns and use cases you'll encounter in production applications")
      ),
      section(
        'Form Actions',
        button({ variant: 'primary', type: 'submit' }, 'Submit'),
        button({ variant: 'secondary', type: 'button' }, 'Cancel'),
        button({ variant: 'text', type: 'reset' }, 'Reset')
      ),
      section(
        'Navigation',
        button({ variant: 'secondary' }, 'Back', { start: 'arrowLeft' }),
        button({ variant: 'primary' }, 'Continue', { end: 'arrowRight' }),
        button({ variant: 'text' }, 'Skip', { end: 'arrowForward' })
      ),
      section(
        'File Operations',
        button({ variant: 'primary' }, 'Upload File', { start: 'upload' }),
        button({ variant: 'secondary' }, 'Attach', { start: 'attachment' }),
        button({ variant: 'outlined' }, 'Browse', { start: 'folder' })
      ),
      section(
        'CRUD Actions',
        button({ variant: 'primary' }, 'Save', { start: 'check' }),
        button({ variant: 'secondary' }, 'Edit', { start: 'edit' }),
        button({ variant: 'outlined' }, 'Delete', { start: 'deleteOutlined' }),
        button({ variant: 'text' }, 'Cancel')
      ),
      section(
        'Social & Feedback',
        button({ variant: 'outlined' }, 'Like', { start: 'thumbUpFilled' }),
        button({ variant: 'outlined' }, 'Favorite', { start: 'star' }),
        button({ variant: 'outlined' }, 'Share', { start: 'send' })
      ),
      section(
        'Toolbar',
        button({ variant: 'text', isIcon: true, ariaLabel: 'Edit' }, undefined, { start: 'edit' }),
        button({ variant: 'text', isIcon: true, ariaLabel: 'Search' }, undefined, { start: 'search' }),
        button({ variant: 'text', isIcon: true, ariaLabel: 'Filter' }, undefined, { start: 'filter' }),
        button({ variant: 'text', isIcon: true, ariaLabel: 'More options' }, undefined, { start: 'mobileMenu' })
      ),
      column(
        { gap: '15px' },
        typography('h5', 'Call-to-Action'),
        column(
          { gap: '10px' },
          button({ variant: 'primary', fullWidth: true, rounded: 'md' }, 'Get Started', { end: 'arrowRight' }),
          button({ variant: 'outlined', fullWidth: true, rounded: 'md' }, 'Learn More')
        )
      )
    ),
  parameters: storyParameters(
    'Practical examples of button usage in common scenarios including forms, navigation, file operations, CRUD actions, social interactions, toolbars, and call-to-action sections.',
    `<gd-column gap="40px">
  <gd-column gap="10px">
    <gd-typography variant="h3">Real-World Examples</gd-typography>
    <gd-typography variant="p">Common button patterns and use cases you'll encounter in production applications</gd-typography>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">Form Actions</gd-typography>
    <gd-row gutter="10px" align="center">
      <gd-button variant="primary" type="submit">Submit</gd-button>
      <gd-button variant="secondary" type="button">Cancel</gd-button>
      <gd-button variant="text" type="reset">Reset</gd-button>
    </gd-row>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">Navigation</gd-typography>
    <gd-row gutter="10px" align="center">
      <gd-button variant="secondary"><gd-icon slot="icon-start" name="arrowLeft"></gd-icon>Back</gd-button>
      <gd-button variant="primary">Continue<gd-icon slot="icon-end" name="arrowRight"></gd-icon></gd-button>
      <gd-button variant="text">Skip<gd-icon slot="icon-end" name="arrowForward"></gd-icon></gd-button>
    </gd-row>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">File Operations</gd-typography>
    <gd-row gutter="10px" align="center">
      <gd-button variant="primary"><gd-icon slot="icon-start" name="upload"></gd-icon>Upload File</gd-button>
      <gd-button variant="secondary"><gd-icon slot="icon-start" name="attachment"></gd-icon>Attach</gd-button>
      <gd-button variant="outlined"><gd-icon slot="icon-start" name="folder"></gd-icon>Browse</gd-button>
    </gd-row>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">CRUD Actions</gd-typography>
    <gd-row gutter="10px" align="center">
      <gd-button variant="primary"><gd-icon slot="icon-start" name="check"></gd-icon>Save</gd-button>
      <gd-button variant="secondary"><gd-icon slot="icon-start" name="edit"></gd-icon>Edit</gd-button>
      <gd-button variant="outlined"><gd-icon slot="icon-start" name="deleteOutlined"></gd-icon>Delete</gd-button>
      <gd-button variant="text">Cancel</gd-button>
    </gd-row>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">Social & Feedback</gd-typography>
    <gd-row gutter="10px" align="center">
      <gd-button variant="outlined"><gd-icon slot="icon-start" name="thumbUpFilled"></gd-icon>Like</gd-button>
      <gd-button variant="outlined"><gd-icon slot="icon-start" name="star"></gd-icon>Favorite</gd-button>
      <gd-button variant="outlined"><gd-icon slot="icon-start" name="send"></gd-icon>Share</gd-button>
    </gd-row>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">Toolbar</gd-typography>
    <gd-row gutter="10px" align="center">
      <gd-button variant="text" is-icon aria-label="Edit"><gd-icon slot="icon-start" name="edit"></gd-icon></gd-button>
      <gd-button variant="text" is-icon aria-label="Search"><gd-icon slot="icon-start" name="search"></gd-icon></gd-button>
      <gd-button variant="text" is-icon aria-label="Filter"><gd-icon slot="icon-start" name="filter"></gd-icon></gd-button>
      <gd-button variant="text" is-icon aria-label="More options"><gd-icon slot="icon-start" name="mobileMenu"></gd-icon></gd-button>
    </gd-row>
  </gd-column>
  <gd-column gap="15px">
    <gd-typography variant="h5">Call-to-Action</gd-typography>
    <gd-column gap="10px">
      <gd-button variant="primary" full-width rounded="md">Get Started<gd-icon slot="icon-end" name="arrowRight"></gd-icon></gd-button>
      <gd-button variant="outlined" full-width rounded="md">Learn More</gd-button>
    </gd-column>
  </gd-column>
</gd-column>`,
    { layout: 'padded' }
  ),
};

export const IsLoading: Story = {
  render: () =>
    row(
      { gap: '15px', alignItems: 'center' },
      button({ variant: 'primary', isLoading: true }, 'Primary'),
      button({ variant: 'outlined', isLoading: true }, 'Outlined'),
      button({ variant: 'text', isLoading: true }, 'Text')
    ),
  parameters: storyParameters(
    'When `isLoading` is set, the button displays a loading indicator and prevents interaction.',
    `<gd-button variant="primary" is-loading>Primary</gd-button>
<gd-button variant="outlined" is-loading>Outlined</gd-button>
<gd-button variant="text" is-loading>Text</gd-button>`
  ),
  play: isLoadingActions,
};

export const WithAccessibility: Story = {
  ...AllVariants,
  tags: ['a11y'],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('button'),
  parameters: storyParameters(
    'View the default theme tokens used by the Button component. These tokens control colors, spacing, borders, and other visual properties across all button variants.',
    `<!-- Rendered with the TokenViewer helper from the default theme -->
<script type="module">
  import { defaultTheme } from 'gd-design-library/tokens';
  console.log({ button: defaultTheme.button });
</script>`,
    { layout: 'padded' }
  ),
};
