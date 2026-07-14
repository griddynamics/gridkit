import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { TokenViewer } from '@stories/components/TokenViewer';
import { FlexContainer, Row, Column, IconProps, Typography } from '@components';
import { SizeVariant } from '@types';
import { defaultTheme } from '@tokens';

import { IconsList } from './constants';
import { Icon, registerCustomIcons } from '.';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Icon\` component is a comprehensive, production-ready SVG icon system that provides a unified interface for displaying icons across your application. Built with flexibility and performance in mind, it supports both a rich built-in icon library and custom icon registration for maximum adaptability.

<br/>
<br/>

<h3>🎨 Icon Library (50+ Icons)</h3>
The component ships with an extensive collection of professionally designed icons organized into logical categories:

<ul>
<li><b>Status & Feedback:</b> \`cross\`, \`success\`, \`error\`, \`warning\`, \`info\`, \`dot\`, \`check\`, \`errorOutline\`</li>
<li><b>Navigation & Direction:</b> \`arrowDown\`, \`arrowRight\`, \`arrowLeft\`, \`arrowForward\`, \`keyboardArrowDown\`, \`keyboardArrowUp\`</li>
<li><b>UI & Interface:</b> \`mobileMenu\`, \`home\`, \`slash\`</li>
<li><b>E-commerce & Shopping:</b> \`localShipping\`, \`favorite\`, \`favoriteOutlined\`, \`shoppingBag\`, \`paymentCard\`</li>
<li><b>User & Account:</b> \`accountCircle\`, \`portrait\`</li>
<li><b>Actions & Operations:</b> \`deleteOutlined\`, \`minus\`, \`plus\`, \`edit\`, \`search\`, \`filter\`, \`ruler\`</li>
<li><b>File & Document:</b> \`attachment\`, \`upload\`, \`folder\`, \`folderOpen\`, \`contentCopy\`, \`fileCopy\`</li>
<li><b>Media & Communication:</b> \`eye\`, \`volumeUp\`, \`send\`, \`chat\`, \`chatBubble\`, \`phone\`</li>
<li><b>System & Technical:</b> \`processing\`, \`wifiTethering\`</li>
<li><b>Rating & Feedback:</b> \`star\`, \`starOutlined\`, \`thumbUp\`, \`thumbDown\`, \`thumbUpFilled\`, \`thumbDownFilled\`</li>
</ul>

<br/>

<h3>⚙️ Key Features</h3>
<ul>
<li><b>Dual Sizing System:</b> Use predefined size variants (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`, \`xxl\`) for consistency, or specify exact pixel dimensions for precise control</li>
<li><b>Advanced Color Control:</b> \`fillSvg\` for single-color icons, \`fill\` for multi-path icons with different colored elements</li>
<li><b>Theme Integration:</b> Automatic color inheritance from theme tokens, with fallback to \`currentColor\` for seamless text integration</li>
<li><b>Box Layout Support:</b> Full Box component props support for flexible layout control - use \`margin\`, \`padding\`, \`position\`, \`flex\`, \`gap\`, and more for precise positioning and spacing</li>
<li><b>Custom Icon Support:</b> \`registerCustomIcons()\` function allows runtime registration of project-specific or third-party icon sets</li>
<li><b>Interactive Capabilities:</b> Built-in \`onClick\` handler support for creating clickable icons and interactive elements</li>
<li><b>Accessibility Ready:</b> Systematic \`data-testid\` implementation and proper ARIA support for screen readers</li>
<li><b>Performance Optimized:</b> SVG-based rendering with efficient re-rendering and minimal bundle impact</li>
</ul>

<br/>

<h3>🎯 Common Use Cases</h3>
<ul>
<li><b>Navigation Elements:</b> Use \`arrowRight\`, \`arrowLeft\` for pagination, \`home\` for main navigation</li>
<li><b>Action Buttons:</b> Combine with \`Button\` component using \`iconStart\` or \`iconEnd\` props</li>
<li><b>Status Indicators:</b> \`success\`, \`error\`, \`warning\` for form validation and system feedback</li>
<li><b>Interactive Elements:</b> \`search\` in search bars, \`filter\` in data tables, \`edit\` in content management</li>
<li><b>Communication Features:</b> \`chat\`, \`chatBubble\`, \`phone\` for messaging and contact interfaces</li>
<li><b>File Operations:</b> \`upload\`, \`download\`, \`attachment\` for document management systems</li>
</ul>

<br/>

<h3>💡 Best Practices</h3>
<ul>
<li><b>Consistent Sizing:</b> Use size variants (\`sm\`, \`md\`, \`lg\`) for visual consistency across your application</li>
<li><b>Color Harmony:</b> Leverage \`fillSvg="currentColor"\` to inherit text color, or use theme color tokens for brand consistency</li>
<li><b>Accessibility:</b> Always pair icons with text labels or use \`aria-label\` for icon-only buttons</li>
<li><b>Performance:</b> Register custom icons once at application startup rather than per-component</li>
<li><b>Interactive Icons:</b> Ensure clickable icons have adequate touch targets (minimum 44px) and clear visual feedback</li>
<li><b>Semantic Usage:</b> Choose icons that clearly communicate their function to users across different cultures and contexts</li>
</ul>

<br/>

<h3>🔧 Technical Implementation</h3>
The component uses React's \`forwardRef\` for proper ref handling and integrates with the theme system through \`useTheme\` hook. Custom icons are merged with the default set at runtime, providing a flexible architecture that supports both static and dynamic icon requirements.

        `,
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'select' },
      options: Object.keys(IconsList),
      description: 'The name of the icon to display from the registered list.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Icon Selection',
      },
    },
    size: {
      control: { type: 'select' },
      options: Object.values(SizeVariant),
      description: 'Predefined size variants that set both width and height according to the theme configuration.',
      table: {
        type: { summary: 'SizeVariant' },
        defaultValue: { summary: 'undefined' },
        category: 'Size & Dimensions',
      },
    },
    width: {
      control: { type: 'number' },
      description: 'Sets the width of the icon in pixels.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Size & Dimensions',
      },
    },
    height: {
      control: { type: 'number' },
      description: 'Sets the height of the icon in pixels.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Size & Dimensions',
      },
    },
    fillSvg: {
      control: { type: 'color' },
      description: 'Sets the `fill` color of the SVG element itself. Useful for single-color icons.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'none' },
        category: 'Styling & Colors',
      },
    },
    fill: {
      control: { type: 'color' },
      description: 'Sets the `fill` color for specific paths within the SVG that are designed to inherit it.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'currentColor' },
        category: 'Styling & Colors',
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Event handler for click events on the icon.',
      table: {
        type: { summary: 'MouseEventHandler<SVGElement>' },
        defaultValue: { summary: 'undefined' },
        category: 'Interactions',
      },
    },

    // ============================================================================
    // Box Styles - Layout & Sizing
    // ============================================================================
    minWidth: {
      description: 'CSS min-width property',
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
    minHeight: {
      description: 'CSS min-height property',
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
    border: {
      description: 'CSS border property',
      control: 'text',
      table: {
        category: 'Box Styles - Position & Display',
        type: { summary: 'string' },
      },
    },

    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description: 'Custom styles object for the icon',
      control: 'object',
      table: {
        category: 'Custom Styling',
        type: { summary: 'CSSProperties' },
      },
    },
  },
} as Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof Icon>;

export const AllIcons: Story = {
  name: 'Icons Library',
  render: () => (
    <FlexContainer minWidth="480px" maxWidth="800px">
      <Row gutter={10} align="center" justify="center">
        {(Object.keys(IconsList) as (keyof typeof IconsList)[]).map((name) => (
          <Column key={name} gutter={10} align="center" minWidth="80px" marginBottom="10px" padding="5px">
            <Icon name={name} size="md" />
            <Typography variant="small">{name}</Typography>
          </Column>
        ))}
      </Row>
    </FlexContainer>
  ),
  parameters: {
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        story:
          'This story displays all the icons available in the default icon library. It serves as a visual reference guide, making it easy to browse and find the icon you need.',
      },
    },
  },
};

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'check',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This is the default interactive story. Use the controls in the Addons panel to see how the `Icon` component behaves with different props. You can change the icon, adjust its size, and modify its colors.',
      },
    },
  },
};

export const WithDefinedSize: Story = {
  args: {
    name: 'check',
    size: SizeVariant.Lg,
    padding: '3px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates using predefined size variants for consistent icon scaling. The `size` prop uses enum values from `SizeVariant` (Xs, Sm, Md, Lg, Xl) which automatically set both width and height according to the theme configuration. This approach ensures visual consistency across the application.',
      },
    },
  },
};

export const RegisteringCustomIcons: Story = {
  name: 'Registering a Custom Icon',
  render: (args) => {
    registerCustomIcons({
      person: ({ fillSvg = 'none', fill = 'currentColor', ...rest }: IconProps) => (
        <svg viewBox="0 0 24 24" {...rest} fill={fillSvg}>
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"
            fill={fill}
          ></path>
        </svg>
      ),
    });
    return <Icon {...args} name="person" size="lg" />;
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how to extend the icon library using the \`registerCustomIcons\` function. 
<br/>
The best place to add icons is in your app's initialization code (e.g., App.tsx or index.tsx) so they are available throughout your application.
<br/>
<ol>
<li>1.  An SVG component for a 'person' icon is defined. </li>
<li>2.  It's then passed to \`registerCustomIcons\` with the key \`'person'\`. </li>
<li>3.  Finally, the \`<Icon>\` component can render the new icon by setting its \`name\` prop to \`'person'\`. </li>
</ol>
<p>This feature is powerful for integrating project-specific or custom-designed icons without modifying the core component.</p>
        `,
      },
      source: {
        code: `
import { useEffect } from 'react';
import { registerCustomIcons, Icon } from 'gd-design-library';

const newIconsList = {
  person: ({ fillSvg = 'none', fill = 'currentColor'}: IconProps) => (
    <svg viewBox="0 0 24 24" fill={fillSvg}>
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"
        fill={fill}
      ></path>
    </svg>
  )
}

const App = () => {
  useEffect(() => {
    registerCustomIcons(newIconsList)
  }, [])
  
  return <Icon name="person" size="lg" />
}
        `,
        language: 'tsx',
      },
    },
  },
};

export const WithAccessibility = {
  ...AllIcons,
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

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ icon: defaultTheme.icon }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
