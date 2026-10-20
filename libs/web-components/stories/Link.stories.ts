import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GdLink } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { defined, storyParameters, typography } from './text-atoms-helpers';
import {
  variantsActions,
  disabledActions,
  targetBlankVisitedActions,
  inheritWithButtonAsChildActions,
  inheritWithTailwindActions,
  withUnderlineActions,
} from './Link.stories.play';

const COMPONENT_NAME = 'Link';

type Args = Pick<
  GdLink,
  'href' | 'variant' | 'size' | 'underline' | 'cursor' | 'target' | 'rel' | 'disabled' | 'styles' | 'ariaLabel' | 'role'
> & {
  children?: string;
  className?: string;
  tabindex?: number;
  onClick?: (event: MouseEvent) => void;
};

// Mirrors the way the source story renders a link: the arguments are applied as properties of the element,
// `className` lands on the element itself and `onClick` becomes a click listener.
const link = ({ children, className, onClick, ...props }: Args, ...nested: Node[]) => {
  const node = element('gd-link', defined(props) as Partial<GdLink>);
  if (className) node.className = className;
  if (onClick) node.addEventListener('click', onClick);
  if (children) node.append(children);
  node.append(...nested);
  return node;
};

const flex = (style: string, ...children: Node[]) => {
  const node = document.createElement('div');
  node.style.cssText = style;
  node.append(...children);
  return node;
};

const meta = {
  title: 'Atoms/Link',
  component: 'gd-link',
  argTypes: {
    // Core Properties
    href: {
      control: 'text',
      description: 'URL or destination for the link',
      table: {
        category: 'Core Properties',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'inverted', 'inherit'],
      description: 'Visual style variant of the link',
      table: {
        category: 'Core Properties',
        type: { summary: 'LinkVariant' },
        defaultValue: { summary: 'LinkVariant.Primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the link text.',
      table: {
        category: 'Appearance',
        type: { summary: '"sm" | "md" | "lg"' },
      },
    },
    underline: {
      control: 'select',
      options: ['default', 'highlight', 'none'],
      description: 'Underline behavior for the link.',
      table: {
        category: 'Appearance',
        type: { summary: '"default" | "highlight" | "none"' },
      },
    },
    cursor: {
      control: 'text',
      description: 'Cursor style used when hovering the link.',
      table: {
        category: 'Appearance',
        type: { summary: 'Cursors' },
      },
    },

    // Navigation & Behavior
    target: {
      control: 'select',
      options: ['_blank', '_self', '_parent', '_top', 'framename'],
      description: 'Target window behavior for the link',
      table: {
        category: 'Navigation & Behavior',
        type: { summary: 'LinkTarget' },
        defaultValue: { summary: 'undefined' },
      },
    },
    rel: {
      control: 'text',
      description: 'Relationship attribute for the link',
      table: {
        category: 'Navigation & Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler for the anchor element.',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent) => void' },
      },
    },

    // State & Behavior
    disabled: {
      control: 'boolean',
      description: 'Disables the link interaction',
      table: {
        category: 'State & Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // Content
    children: {
      control: 'text',
      description: 'Content to be rendered inside the link (default slot)',
      table: {
        category: 'Content',
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Styling
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      control: 'object',
      description: 'Custom inline styles to apply to the link',
      table: {
        category: 'Styling',
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label announced by assistive technologies.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
    },
    role: {
      control: 'text',
      description: 'Explicit ARIA role for the rendered anchor.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
    },
    tabindex: {
      control: 'number',
      description: 'Tab order for keyboard navigation.',
      table: {
        category: 'Accessibility',
        type: { summary: 'number' },
      },
    },
  },
  args: {
    variant: 'primary',
    rel: '',
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Link\` component is a versatile navigation element that provides various interaction patterns and styling options.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Design Variants</b>
  <ul>
  <li>Primary - Default styled link</li>
  <li>Inherit - Inherits parent styles</li>
  <li>Inverted - Reversed color scheme</li>
  <li>Button - Button-like appearance</li>
  </ul>
  </li>
  <li>
  <b>Link Behavior</b>
  <ul>
  <li>Internal navigation</li>
  <li>Absolute URL linking</li>
  <li>Target window control</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>States</b> – Hover, focus, active, disabled, visited states</li>
  <li><b>Theming</b> – Custom styling and theme integration</li>
  <li><b>Composable</b> – Supports nested components like Typography, Button</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Styling</b>
  <ul>
  <li><code>className</code>: Custom CSS classes</li>
  <li><code>styles</code>: Inline style object</li>
  </ul>
  </li>
  <li><b>Custom Attributes</b>
  <ul>
  <li><code>data-*</code>: Custom data attributes</li>
  <li><code>aria-*</code>: Accessibility attributes</li>
  </ul>
  </li>
  </ul>


`,
      },
    },
  },
  render: (args: Args) => link(args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Variants: Story = {
  args: {
    children: `Variants ${COMPONENT_NAME}`,
    onClick: fn(),
  },
  play: variantsActions,
};

export const Disabled: Story = {
  args: {
    children: `Disabled ${COMPONENT_NAME}`,
    disabled: true,
  },
  play: disabledActions,
};

export const TargetBlankVisited: Story = {
  args: {
    children: `Outbound ${COMPONENT_NAME}`,
    variant: 'inherit',
    href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  play: targetBlankVisitedActions,
};

export const InheritWithButtonAsChild: Story = {
  args: {
    variant: 'inherit',
  },
  render: (args: Args) => link(args, element('gd-button', {}, `Button ${COMPONENT_NAME}`)),
  play: inheritWithButtonAsChildActions,
};

export const Inverted: Story = {
  args: {
    variant: 'inverted',
    children: `Typography ${COMPONENT_NAME}`,
  },
};

export const InheritWithTypographyAsChild: Story = {
  args: {
    variant: 'inherit',
  },
  render: (args: Args) => link(args, typography({ styleVariant: 'strike' }, `Typography ${COMPONENT_NAME}`)),
};

export const InheritWithTailwind: Story = {
  args: {
    variant: 'inherit',
    className: 'border-2 px-3 py-2 rounded-xl text-xl font-bold underline',
    // The utility classes of the source story resolve to this padding and radius in the source Storybook.
    styles: { padding: '8px 12px', borderRadius: '12px' },
    children: `With tailwind or any other installed UI lib ${COMPONENT_NAME}`,
  },
  play: inheritWithTailwindActions,
};

export const CustomStyles: Story = {
  args: {
    variant: 'inherit',
    children: `Custom Styled ${COMPONENT_NAME}`,
    styles: {
      backgroundColor: 'lightblue',
      color: 'white',
      padding: '1rem',
    },
  },
};

export const WithUnderline: Story = {
  render: () =>
    flex(
      'display: flex; flex-direction: column; gap: 12px;',
      link({ href: '#', underline: 'default', children: 'Default underline' } as Args),
      link({ href: '#', underline: 'highlight', children: 'Highlight underline (on hover)' } as Args),
      link({ href: '#', underline: 'none', children: 'No underline' } as Args)
    ),
  parameters: storyParameters(
    'The `underline` prop controls underline behaviour: `default` (always), `highlight` (on hover), or `none`.',
    `<gd-link href="#" underline="default">Default underline</gd-link>
<gd-link href="#" underline="highlight">Highlight underline</gd-link>
<gd-link href="#" underline="none">No underline</gd-link>`
  ),
  play: withUnderlineActions,
};

export const WithSizes: Story = {
  render: () =>
    flex(
      'display: flex; gap: 16px; align-items: center;',
      link({ href: '#', size: 'sm', children: 'Small' } as Args),
      link({ href: '#', size: 'md', children: 'Medium' } as Args),
      link({ href: '#', size: 'lg', children: 'Large' } as Args)
    ),
  parameters: storyParameters(
    'Link supports `sm`, `md`, and `lg` size variants controlling font size.',
    `<gd-link href="#" size="sm">Small</gd-link>
<gd-link href="#" size="md">Medium</gd-link>
<gd-link href="#" size="lg">Large</gd-link>`
  ),
};

export const WithAccessibility: Story = {
  args: {
    children: 'Accessible Link',
    href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
    ariaLabel: 'Navigate to Griddynamics Storybook',
  },
  tags: ['a11y'],
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('link'),
  parameters: {
    layout: 'padded',
  },
};
