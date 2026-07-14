import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Header, Button, Icon } from '@components';
import { colors, defaultTheme } from '@tokens';
import {
  completeHeaderActions,
  withSearchActions,
  withActionsActions,
  withMenuActions,
  darkHeaderActions,
  interactiveMobileMenuActions,
  withCustomChildrenActions,
  minimalActions,
} from './Header.stories.play';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Header\` component is a versatile and customizable navigation element that provides various layout options and features.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Layout Sections</b>
  <ul>
  <li>Logo area</li>
  <li>Top banner</li>
  <li>Search functionality</li>
  <li>Action buttons</li>
  <li>Navigation menu</li>
  </ul>
  </li>
  <li>
  <b>Responsive Design</b>
  <ul>
  <li>Mobile-friendly layout</li>
  <li>Collapsible menu</li>
  <li>Adaptive content arrangement</li>
  </ul>
  </li>
  <li><b>Customization</b> - Flexible styling and content options</li>
  <li><b>Theming</b> - Background color and layout theming</li>
  <li><b>Interactive</b> - Mobile menu interaction handling</li>
  </ul>
  <br/>
  <h3>Layout Options:</h3>
  <ul>
  <li><b>Width Control</b>
  <ul>
  <li>Fluid or constrained layout</li>
  <li>Maximum width setting</li>
  </ul>
  </li>
  <li><b>Content Organization</b>
  <ul>
  <li>Multiple section positioning</li>
  <li>Flexible content arrangement</li>
  <li>Optional sections</li>
  </ul>
  </li>
  <li><b>Visual Styling</b>
  <ul>
  <li>Background color customization</li>
  <li>Section spacing control</li>
  <li>Content alignment options</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
  tags: ['autodocs'],

  argTypes: {
    logo: {
      description: 'Logo component to be rendered in the header',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    bannerContent: {
      description: 'Content to be displayed in the top banner section',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    showSearch: {
      description: 'Controls the visibility of the search functionality',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    actions: {
      description: 'Action buttons or components to be displayed in the header',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    menu: {
      description: 'Navigation menu content',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onMobileMenuItemClick: {
      description: 'Callback function triggered when a mobile menu item is clicked',
      table: {
        type: { summary: '(event: React.MouseEvent, subMenu?: any) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    mobileMenuList: {
      description: 'List of items to be displayed in the mobile menu',
      table: {
        type: { summary: 'Array<{ title: string }>' },
        defaultValue: { summary: '[]' },
      },
    },
    maxWidth: {
      description: 'Maximum width of the header container',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '100%' },
      },
    },
    bgColor: {
      description: 'Background color of the header',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'colors.bg.surface' },
      },
    },
    children: {
      description: 'Additional content to be rendered inside the header',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} as Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

// Logo component for stories
const Logo = () => (
  <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDOq-jwf3G_-Q9FapdYUhfWHiJept41rKHrC9Yxfpz0M1ZDYZGTeeS8E8daqlJ47qm_A&usqp=CAU"
      alt="Logo"
      style={{ height: '100%', width: 'auto' }}
    />
  </div>
);

// Actions component for stories
const Actions = () => (
  <>
    <Button variant="text">
      <Icon name="accountCircle" />
      Sign In
    </Button>
    <Button variant="text">
      <Icon name="shoppingBag" />
      Cart
    </Button>
  </>
);

// Menu component for stories
const Menu = () => (
  <>
    <a href="https://storybook.cto-rnd-system-design.griddynamics.net/">Home</a>
    <a href="https://storybook.cto-rnd-system-design.griddynamics.net/">Products</a>
    <a href="https://storybook.cto-rnd-system-design.griddynamics.net/">About</a>
    <a href="https://storybook.cto-rnd-system-design.griddynamics.net/">Contact</a>
  </>
);

// Basic Header with all sections
export const CompleteHeader: Story = {
  args: {
    logo: <Logo />,
    bannerContent: <p style={{ padding: '0', fontSize: '10px' }}>Free shipping on all orders!</p>,
    showSearch: true,
    actions: <Actions />,
    menu: <Menu />,
    onMobileMenuItemClick: (e, subMenu) => action('mobile menu item clicked')(subMenu),
    mobileMenuList: [{ title: 'sub menu 1' }],
    maxWidth: '1200px',
    bgColor: colors.bg.surface,
  },
};
CompleteHeader.play = completeHeaderActions;

// Header with search only
export const WithSearch: Story = {
  args: {
    logo: <Logo />,
    showSearch: true,
    maxWidth: '100%',
  },
};
WithSearch.play = withSearchActions;

// Header with actions only
export const WithActions: Story = {
  args: {
    logo: <Logo />,
    actions: <Actions />,
  },
};
WithActions.play = withActionsActions;

// Header with menu only
export const WithMenu: Story = {
  args: {
    logo: <Logo />,
    menu: <Menu />,
  },
};
WithMenu.play = withMenuActions;

// Responsive Header
export const ResponsiveHeader: Story = {
  args: {
    logo: <Logo />,
    showSearch: true,
    actions: <Actions />,
    menu: <Menu />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark Theme Header
export const DarkHeader: Story = {
  args: {
    logo: <Logo />,
    showSearch: true,
    actions: <Actions />,
    bgColor: colors.bg.default,
    bannerContent: <div style={{ padding: '8px', color: colors.primary.default }}>Special dark theme offer!</div>,
  },
};
DarkHeader.play = darkHeaderActions;

// Interactive Mobile Menu Example
export const InteractiveMobileMenu: Story = {
  args: {
    logo: <Logo />,
    menu: <Menu />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
InteractiveMobileMenu.play = interactiveMobileMenuActions;

// Custom Children Example
export const WithCustomChildren: Story = {
  args: {
    logo: <Logo />,
    children: (
      <div
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: colors.bg.default,
          textAlign: 'center',
        }}
      >
        Additional content section
      </div>
    ),
  },
};
WithCustomChildren.play = withCustomChildrenActions;

// Minimal Header
export const Minimal: Story = {
  args: {
    logo: <Logo />,
    maxWidth: '800px',
  },
};
Minimal.play = minimalActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ header: defaultTheme.header }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
