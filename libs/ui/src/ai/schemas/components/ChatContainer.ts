const component = {
  name: 'ChatContainer',
  import: "import { ChatContainer } from 'gd-design-library'",
  description:
    'Specialized layout component for building chat interfaces with collapsible sidebar. Provides organized structure for chat applications with sidebar navigation, headers, and content areas. Supports both expanded and minified sidebar states.',
  a2uiName: 'chat-container',
  category: 'Communication & Chat',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~3KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Nested A2UI child components rendered in the main chat content area',
    },
    { name: 'isOpen', type: 'boolean', description: 'Controlled sidebar open state' },
    {
      name: 'sidebarContent',
      type: 'A2UIComponent[]',
      description: 'Named slot for the expanded sidebar content such as conversations, channels, or navigation',
    },
    {
      name: 'sidebarMinifiedContent',
      type: 'A2UIComponent[]',
      description: 'Named slot for the collapsed or icon-only sidebar rail',
    },
    {
      name: 'sidebarHeaderContent',
      type: 'A2UIComponent[]',
      description: 'Named slot rendered above the expanded sidebar content, typically for search, filters, or titles',
    },
    {
      name: 'headerContent',
      type: 'A2UIComponent[]',
      description: 'Named slot rendered in the main header area above the chat body',
    },
    {
      name: 'showSidebarAsideControl',
      type: 'boolean',
      description: 'Whether to show the toggle button in the sidebar',
    },
    {
      name: 'showSidebarHeaderControl',
      type: 'boolean',
      description: 'Whether to show the toggle button in the main header',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the chat container' },
  ],
  examples: [
    '<ChatContainer isOpen={true} onToggleSidebar={handleToggle} headerContent={<Header />} sidebarContent={<ConversationList />} sidebarMinifiedContent={<IconNav />}>{chatMessages}</ChatContainer>',
    '<ChatContainer ref={chatRef} sidebarHeaderContent={<SearchBar />} sidebarContent={<History />} sidebarMinifiedContent={<QuickActions />} headerContent={<Title />}><ChatBubble>Message</ChatBubble></ChatContainer>',
    '<ChatContainer isOpen={sidebarOpen} showSidebarHeaderControl={false} sidebarContent={<Nav />} sidebarMinifiedContent={<Icons />}>{children}</ChatContainer>',
  ],
};

const compositionTips: string[] = [
  'Use ChatContainer as the root layout component for chat interfaces with collapsible sidebar navigation.',
  'In A2UI JSON, use headerContent[], sidebarContent[], sidebarMinifiedContent[], and sidebarHeaderContent[] as named slots.',
  'Provide ChatContainer sidebarMinifiedContent with icon buttons for compact navigation when sidebar is closed.',
  'Place navigation controls in ChatContainer headerContent for a consistent header across all views.',
  'Use ChatContainer sidebarHeaderContent for search bars, filters, or titles above the conversation list.',
  'Put conversation list or channel navigation in ChatContainer sidebarContent.',
  'Wrap chat messages and input controls as ChatContainer children for the main chat area.',
  'Set ChatContainer showSidebarAsideControl={false} to hide toggle button and control state programmatically only.',
  'Set ChatContainer showSidebarHeaderControl={false} to prevent users from reopening sidebar from main header.',
  'Place user profile or settings icons in ChatContainer sidebarMinifiedContent for quick access when collapsed.',
  'Combine ChatContainer with FlexContainer or Column inside children for structured message layout.',
  'Use ChatContainer with nested Card components in sidebarContent for organized conversation groups.',
  'Combine ChatContainer with Row and Icon in headerContent for header navigation and actions.',
  'Structure ChatContainer children with Column for vertical message flow with proper spacing.',
  'Use ChatContainer sidebarContent with scrollable container for long conversation lists.',
  'Provide ChatContainer sidebarMinifiedContent with Button isIcon for clean icon-only navigation rail.',
  'Combine ChatContainer with ChatBubble components as children for message display.',
  'Use ChatContainer in uncontrolled mode by omitting isOpen when the default sidebar state is acceptable.',
  'Set ChatContainer isOpen for a fully controlled sidebar state from the A2UI spec.',
  'Apply custom styles to ChatContainer via styling for fine-grained visual customization.',
];

export default { component, compositionTips };
