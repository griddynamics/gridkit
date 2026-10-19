import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdLabel } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { defined, row } from './text-atoms-helpers';

const COMPONENT_NAME = 'Label';

type Args = Pick<GdLabel, 'htmlFor' | 'gap' | 'styles' | 'ariaLabel'> & {
  children?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

// Mirrors the way the source story renders a label: the arguments are applied as properties of the element,
// `className` lands on the element itself and `onClick` becomes a click listener.
const label = ({ children, className, onClick, ...props }: Args, ...nested: Node[]) => {
  const node = element('gd-label', defined(props) as Partial<GdLabel>);
  if (className) node.className = className;
  if (onClick) node.addEventListener('click', onClick);
  if (children) node.append(children);
  node.append(...nested);
  return node;
};

const meta = {
  title: 'Atoms/Label',
  component: 'gd-label',
  argTypes: {
    // Core Properties
    htmlFor: {
      control: 'text',
      description: 'Associates the label with form control',
      table: {
        category: 'Core Properties',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Content
    children: {
      control: 'text',
      description: 'Content to be rendered inside the label (default slot)',
      table: {
        category: 'Content',
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
      },
    },

    // Layout & Spacing
    gap: {
      control: 'text',
      description: 'Gap between label elements',
      table: {
        category: 'Layout & Spacing',
        type: { summary: 'string' },
        defaultValue: { summary: '4px' },
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
      description: 'Custom inline styles to apply to the label',
      table: {
        category: 'Styling',
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },

    // Events
    onClick: {
      action: 'clicked',
      description: 'Click event handler for the label',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for screen readers',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Label\` component is a highly flexible UI element designed to be fully customizable in both design and functionality.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Design Agnostic</b>
  <ul>
  <li>Adapts to any theme or custom styles</li>
  <li>Supports both className and inline styles</li>
  <li>Flexible content composition</li>
  </ul>
  </li>
  <li>
  <b>Composable</b>
  <ul>
  <li>Can include icons, tooltips, or other components</li>
  <li>Supports nested component structures</li>
  <li>Flexible content alignment</li>
  </ul>
  </li>
  <li><b>Interactive</b> – Supports click events and hover states</li>
  <li><b>Theming</b> – Compatible with design tokens and custom themes</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Overall spacing</li>
  <li><code>marginTop/paddingTop</code>: Top spacing</li>
  <li><code>marginRight/paddingRight</code>: Right spacing</li>
  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>
  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>
  </ul>
  </li>
  <li><b>Display Properties</b>
  <ul>
  <li><code>display</code>: CSS display property</li>
  <li><code>position</code>: CSS position property</li>
  <li><code>width/height</code>: Size dimensions</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
  render: (args: Args) => label(args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const LabelDefault: Story = {
  args: {
    children: COMPONENT_NAME,
  },
};

export const LabelWithChildIcon: Story = {
  render: (args: Args) => label(args, row({}, element('gd-icon', { name: 'star' }), ` ${COMPONENT_NAME}`)),
};

export const CustomStyles: Story = {
  args: {
    children: COMPONENT_NAME,
    styles: {
      backgroundColor: 'lightblue',
      color: 'white',
      padding: '1rem',
    },
  },
};

export const DefaultWithTailwind: Story = {
  args: {
    children: `With tailwind or any other installed UI lib ${COMPONENT_NAME}`,
    className: 'border-2 px-3 py-2 rounded-xl text-xl font-bold underline',
    // The utility classes of the source story resolve to these styles in the source Storybook.
    styles: {
      padding: '8px 12px',
      borderRadius: '12px',
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 700,
      textDecoration: 'underline',
    },
  },
};

export const WithAccessibility: Story = {
  args: {
    children: `Accessible ${COMPONENT_NAME}`,
    ariaLabel: 'Navigate to Griddynamics Storybook',
  },
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

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('label'),
  parameters: {
    layout: 'padded',
  },
};
