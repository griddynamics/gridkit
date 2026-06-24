import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Icon } from '@components/atoms/Icon';
import { Column, Typography } from '@components';
import { defaultTheme } from '@tokens';

import { Sidebar, type SidebarItem, type SidebarProps } from './';

const defaultItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Icon name="dashboard" size="sm" /> },
  { id: 'projects', label: 'Projects', icon: <Icon name="folder" size="sm" /> },
  { id: 'tasks', label: 'Tasks', icon: <Icon name="checklist" size="sm" /> },
  { id: 'settings', label: 'Settings', icon: <Icon name="settings" size="sm" /> },
  { id: 'help', label: 'Help', icon: <Icon name="helpOutline" size="sm" /> },
];

const itemsWithSubItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Icon name="dashboard" size="sm" /> },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Icon name="folder" size="sm" />,
    children: [
      { id: 'projects-web', label: 'Web App' },
      { id: 'projects-mobile', label: 'Mobile App' },
    ],
  },
  { id: 'tasks', label: 'Tasks', icon: <Icon name="checklist" size="sm" /> },
  { id: 'settings', label: 'Settings', icon: <Icon name="settings" size="sm" /> },
  { id: 'help', label: 'Help', icon: <Icon name="helpOutline" size="sm" /> },
];

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`Sidebar\` component is a navigation panel for organizing and accessing application sections.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Navigation Structure</b>
<ul>
<li>Flat item lists for simple navigation</li>
<li>Nested sub-items for hierarchical menus</li>
<li>Active item highlighting</li>
<li>Disabled item support</li>
</ul>
</li>
<li>
<b>Collapsible Behavior</b>
<ul>
<li>Expanded mode showing icons and labels</li>
<li>Collapsed mode showing icons only</li>
<li>Configurable expanded and collapsed widths</li>
<li>Collapse toggle callback for controlled behavior</li>
</ul>
</li>
<li><b>Customizable Slots</b> – Optional header and footer sections for branding and user info</li>
<li><b>Icon Support</b> – Each item can display an icon alongside its label</li>
<li><b>Theming</b> – Fully customizable via design tokens</li>
</ul>
<br/>
<h3>Layout Props:</h3>
<ul>
<li><b>Dimensions</b>
<ul>
<li><code>width</code>: Expanded sidebar width (default: 260px)</li>
<li><code>collapsedWidth</code>: Collapsed sidebar width</li>
</ul>
</li>
<li><b>Content Slots</b>
<ul>
<li><code>header</code>: Top section for branding or logo</li>
<li><code>footer</code>: Bottom section for user info or actions</li>
</ul>
</li>
<li><b>State</b>
<ul>
<li><code>collapsed</code>: Controls expanded/collapsed state</li>
<li><code>activeItemId</code>: Highlights the active navigation item</li>
</ul>
</li>
</ul>`,
      },
    },
  },

  argTypes: {
    collapsed: {
      description: 'Controls whether the sidebar is in collapsed (icon-only) mode',
      control: 'boolean',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    width: {
      description: 'Width of the sidebar in expanded mode',
      control: 'text',
      table: {
        category: 'Dimensions',
        type: { summary: 'string' },
        defaultValue: { summary: '260px' },
      },
    },
    collapsedWidth: {
      description: 'Width of the sidebar in collapsed mode',
      control: 'text',
      table: {
        category: 'Dimensions',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    activeItemId: {
      description: 'ID of the currently active navigation item',
      control: 'text',
      table: {
        category: 'State',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    items: {
      description: 'Array of navigation items to render in the sidebar',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'SidebarItem[]' },
        defaultValue: { summary: '[]' },
      },
    },
    onItemClick: {
      description: 'Callback when a navigation item is clicked',
      action: 'itemClick',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent, item: SidebarItem) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onCollapsedChange: {
      description: 'Callback when the sidebar collapsed state changes',
      action: 'collapsedChange',
      table: {
        category: 'Events',
        type: { summary: '(collapsed: boolean) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    header: {
      description: 'Content rendered at the top of the sidebar (e.g., logo or brand)',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    footer: {
      description: 'Content rendered at the bottom of the sidebar (e.g., user info)',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },

  args: {
    collapsed: false,
    width: '260px',
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

// ============= Sidebar Stories =============

export const Default: Story = {
  args: {
    items: defaultItems,
    activeItemId: 'dashboard',
    onItemClick: action('itemClick'),
  },
  render: (args) => (
    <div style={{ height: '500px' }}>
      <Sidebar {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default sidebar with five navigation items: Dashboard, Projects, Tasks, Settings, and Help. The Dashboard item is set as the active item.',
      },
    },
  },
};

export const Collapsed: Story = {
  args: {
    items: defaultItems,
    activeItemId: 'dashboard',
    collapsed: true,
    onItemClick: action('itemClick'),
    onCollapsedChange: action('collapsedChange'),
  },
  render: (args) => (
    <div style={{ height: '500px' }}>
      <Sidebar {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar in collapsed mode, showing only icons. The `onCollapsedChange` callback allows toggling between collapsed and expanded states.',
      },
    },
  },
};

export const WithSubItems: Story = {
  args: {
    items: itemsWithSubItems,
    activeItemId: 'projects-web',
    onItemClick: action('itemClick'),
  },
  render: (args) => (
    <div style={{ height: '500px' }}>
      <Sidebar {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar with hierarchical navigation. The Projects item contains nested sub-items (Web App and Mobile App), demonstrating support for multi-level navigation menus.',
      },
    },
  },
};

export const WithHeaderAndFooter: StoryFn<SidebarProps> = () => (
  <div style={{ height: '500px' }}>
    <Sidebar
      items={defaultItems}
      activeItemId="dashboard"
      onItemClick={action('itemClick')}
      header={
        <Typography variant="h6" styles={{ padding: '16px' }}>
          GridKit
        </Typography>
      }
      footer={
        <Column gap="4px" padding="16px">
          <Typography variant="body2">John Doe</Typography>
          <Typography variant="caption">john.doe@example.com</Typography>
        </Column>
      }
    />
  </div>
);
WithHeaderAndFooter.parameters = {
  docs: {
    description: {
      story:
        'Sidebar with custom `header` and `footer` slots. The header displays a brand name, while the footer shows user information. These slots allow full customization of the top and bottom sidebar sections.',
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ sidebar: defaultTheme.sidebar }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
