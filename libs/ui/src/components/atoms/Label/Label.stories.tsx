import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Icon, Row } from '@components';
import { defaultTheme } from '@tokens';
import { COMPONENT_NAME } from './constants';
import { Label, LabelProps } from './';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
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
      description: 'Content to be rendered inside the label',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
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
        type: { summary: '(event: React.MouseEvent) => void' },
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
} as Meta<typeof Label>;

export default meta;
const Template: StoryFn<PropsWithChildren<LabelProps>> = (args) => <Label {...args} />;

export const LabelDefault = Template.bind({});
LabelDefault.args = {
  children: COMPONENT_NAME,
};

export const LabelWithChildIcon = Template.bind({});
LabelWithChildIcon.args = {
  children: (
    <Row>
      <Icon name="star" /> {COMPONENT_NAME}
    </Row>
  ),
};

export const CustomStyles = Template.bind({});
CustomStyles.args = {
  children: COMPONENT_NAME,
  styles: {
    backgroundColor: 'lightblue',
    color: 'white',
    padding: '1rem',
  },
};

export const DefaultWithTailwind = Template.bind({});
DefaultWithTailwind.args = {
  children: `With tailwind or any other installed UI lib ${COMPONENT_NAME}`,
  className: 'border-2 px-3 py-2 rounded-xl text-xl font-bold underline',
};

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  children: `Accessible ${COMPONENT_NAME}`,
  ariaLabel: 'Navigate to Griddynamics Storybook',
};
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};
WithAccessibility.tags = ['a11y'];

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ label: defaultTheme.label }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
