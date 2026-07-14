import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Button, Link, LinkProps, Typography } from '@components';
import { LinkRel, LinkTarget, LinkVariant, TypographyStyleVariant } from '@types';
import { defaultTheme } from '@tokens';
import {
  variantsActions,
  disabledActions,
  targetBlankVisitedActions,
  inheritWithButtonAsChildActions,
  inheritWithTailwindActions,
  withUnderlineActions,
} from './Link.stories.play';

import { COMPONENT_NAME } from './constants';

const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
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
      options: Object.values(LinkVariant),
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
      options: Object.values(LinkTarget),
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
        type: { summary: '(event: MouseEvent<HTMLAnchorElement>) => void' },
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
      description: 'Content to be rendered inside the link',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
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
    variant: LinkVariant.Primary,
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
} as Meta<typeof Link>;

export default meta;
const Template: StoryFn<PropsWithChildren<LinkProps>> = (args) => <Link {...args} />;

export const Variants = Template.bind({});
Variants.args = {
  children: `Variants ${COMPONENT_NAME}`,
  onClick: fn(),
};
Variants.play = variantsActions;

export const Disabled = Template.bind({});
Disabled.args = {
  children: `Disabled ${COMPONENT_NAME}`,
  disabled: true,
};
Disabled.play = disabledActions;

export const TargetBlankVisited = Template.bind({});
TargetBlankVisited.args = {
  children: `Outbound ${COMPONENT_NAME}`,
  variant: LinkVariant.Inherit,
  href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
  target: LinkTarget.Blank,
  rel: `${LinkRel.Noopener} ${LinkRel.Noreferrer}`,
};
TargetBlankVisited.play = targetBlankVisitedActions;

export const InheritWithButtonAsChild = Template.bind({});
InheritWithButtonAsChild.args = {
  variant: LinkVariant.Inherit,
  children: <Button>{`Button ${COMPONENT_NAME}`}</Button>,
};
InheritWithButtonAsChild.play = inheritWithButtonAsChildActions;

export const Inverted = Template.bind({});
Inverted.args = {
  variant: LinkVariant.Inverted,
  children: <>{`Typography ${COMPONENT_NAME}`}</>,
};

export const InheritWithTypographyAsChild = Template.bind({});
InheritWithTypographyAsChild.args = {
  variant: LinkVariant.Inherit,
  children: <Typography styleVariant={TypographyStyleVariant.Strike}>{`Typography ${COMPONENT_NAME}`}</Typography>,
};

export const InheritWithTailwind = Template.bind({});
InheritWithTailwind.args = {
  variant: LinkVariant.Inherit,
  className: 'border-2 px-3 py-2 rounded-xl text-xl font-bold underline',
  children: `With tailwind or any other installed UI lib ${COMPONENT_NAME}`,
};
InheritWithTailwind.play = inheritWithTailwindActions;

export const CustomStyles = Template.bind({});
CustomStyles.args = {
  variant: LinkVariant.Inherit,
  children: `Custom Styled ${COMPONENT_NAME}`,
  styles: {
    backgroundColor: 'lightblue',
    color: 'white',
    padding: '1rem',
  },
};

export const WithUnderline: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Link href="#" underline="default">
      Default underline
    </Link>
    <Link href="#" underline="highlight">
      Highlight underline (on hover)
    </Link>
    <Link href="#" underline="none">
      No underline
    </Link>
  </div>
);
WithUnderline.parameters = {
  docs: {
    description: {
      story:
        'The `underline` prop controls underline behaviour: `default` (always), `highlight` (on hover), or `none`.',
    },
    source: {
      code: `<Link href="#" underline="default">Default underline</Link>
<Link href="#" underline="highlight">Highlight underline</Link>
<Link href="#" underline="none">No underline</Link>`,
    },
  },
};
WithUnderline.play = withUnderlineActions;

export const WithSizes: StoryFn = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Link href="#" size="sm">
      Small
    </Link>
    <Link href="#" size="md">
      Medium
    </Link>
    <Link href="#" size="lg">
      Large
    </Link>
  </div>
);
WithSizes.parameters = {
  docs: {
    description: {
      story: 'Link supports `sm`, `md`, and `lg` size variants controlling font size.',
    },
    source: {
      code: `<Link href="#" size="sm">Small</Link>
<Link href="#" size="md">Medium</Link>
<Link href="#" size="lg">Large</Link>`,
    },
  },
};

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  children: 'Accessible Link',
  href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
  ariaLabel: 'Navigate to Griddynamics Storybook',
};
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ link: defaultTheme.link }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
