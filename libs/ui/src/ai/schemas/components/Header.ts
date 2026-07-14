const component = {
  name: 'Header',
  import: "import { Header } from 'gd-design-library'",
  description:
    'Responsive site header organism with logo, actions, optional search, top banner, and a mobile navigation drawer pattern.',
  a2uiName: 'header',
  category: 'Navigation & Structure',
  complexity: 'High',
  accessibility: 'WCAG 2.1 AA Compliant',
  props: [
    {
      name: 'logoChildren',
      type: 'A2UIComponent[]',
      description: 'Components rendered in the logo slot of the header.',
    },
    {
      name: 'menuChildren',
      type: 'A2UIComponent[]',
      description: 'Components rendered in the primary navigation slot.',
    },
    {
      name: 'actionChildren',
      type: 'A2UIComponent[]',
      description: 'Components rendered in the utility/action slot on the right side of the header.',
    },
    { name: 'showSearch', type: 'boolean', description: 'Enables the built-in search placement in the header' },
    { name: 'showTopBanner', type: 'boolean', description: 'Shows an announcement banner above the main navigation' },
    {
      name: 'bannerChildren',
      type: 'A2UIComponent[]',
      description: 'Components rendered inside the optional top banner.',
    },
    {
      name: 'bgColor',
      type: 'string',
      description:
        'Background color override for the header. Prefer theme color token paths (for example "bg.surface" or "bg.fill.info.primary.default") before raw CSS/hex colors.',
    },
    {
      name: 'mobileMenuList',
      type: 'Array<{ title: string; path?: string; icon?: string; id?: string }>',
      description: 'Array of mobile drawer menu items with visible title text and optional path/icon metadata.',
    },
    {
      name: 'advChildren',
      type: 'A2UIComponent[]',
      description: 'Promo or supporting content rendered below the mobile menu list.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Optional action IDs triggered when a mobile drawer item is clicked. The renderer includes the clicked item in the action payload.',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Additional components rendered in the optional row beneath the main navigation.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the header' },
  ],
  examples: [
    '<Header logo={<Logo />} menu={<MainNav />} actions={<AccountActions />} />',
    '<Header bgColor="bg.surface" logo={<Logo />} menu={<MainNav />} />',
    '<Header showTopBanner bannerContent={<Typography>Free shipping today</Typography>} />',
  ],
};

const compositionTips = [
  'Use Header for full navigation shells rather than simple section headings.',
  'Keep logo, primary navigation, and utility actions visually distinct to preserve scannability.',
  'Enable showSearch only when search is a primary navigation affordance.',
  'Provide mobileMenuList when the desktop menu cannot collapse cleanly onto smaller screens.',
];

export default { component, compositionTips };
