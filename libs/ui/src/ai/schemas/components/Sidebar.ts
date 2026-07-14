const component = {
  name: 'Sidebar',
  import: "import { Sidebar } from 'gd-design-library'",
  description:
    'Collapsible navigation sidebar organism with nested menu items, active state tracking, and customizable header/footer. Use for app-level or section-level navigation.',
  a2uiName: 'sidebar',
  category: 'Navigation & Structure',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant',
  props: [
    {
      name: 'items',
      type: 'Array<{ id: string; label: string; icon?: string; href?: string; disabled?: boolean; children?: Array<{ id: string; label: string; icon?: string; href?: string; disabled?: boolean; children?: unknown[] }> }>',
      description: 'Array of navigation items with id, label, optional icon metadata, and nested children.',
    },
    { name: 'activeItemId', type: 'string', description: 'ID of the currently active navigation item' },
    { name: 'collapsed', type: 'boolean', description: 'Whether the sidebar is in collapsed (icon-only) mode' },
    { name: 'width', type: 'string', description: 'CSS width of the sidebar in expanded state' },
    { name: 'collapsedWidth', type: 'string', description: 'CSS width of the sidebar in collapsed state' },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Optional action IDs triggered when a navigation item is clicked. The renderer includes the clicked item in the action payload.',
    },
    {
      name: 'headerChildren',
      type: 'A2UIComponent[]',
      description: 'Components rendered at the top of the sidebar.',
    },
    {
      name: 'footerChildren',
      type: 'A2UIComponent[]',
      description: 'Components rendered at the bottom of the sidebar.',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Additional components rendered after the navigation items.',
    },
    { name: 'styling', type: 'object', description: 'Custom styles for the sidebar container', default: {} },
  ],
  examples: [
    '<Sidebar items={navItems} activeItemId={currentPage} onItemClick={navigate} header={<Logo />} />',
    '<Sidebar items={menuItems} collapsed={isCollapsed} onCollapsedChange={setIsCollapsed} collapsedWidth="64px" />',
    '<Sidebar items={routes} activeItemId={activeRoute} footer={<UserProfile />} />',
  ],
};

const compositionTips: string[] = [
  'Use Sidebar with items containing children arrays to create nested multi-level navigation.',
  'Set Sidebar collapsed with onCollapsedChange to enable a collapsible icon-only mode.',
  'Provide Sidebar header for branding or logos and footer for user profiles or settings links.',
  'Track Sidebar activeItemId to visually highlight the current page or section.',
  'Use Sidebar onItemClick to handle navigation and prevent default for items with href.',
];

export default { component, compositionTips };
