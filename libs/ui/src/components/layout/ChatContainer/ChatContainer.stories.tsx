import React, { useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import { TokenViewer } from '@stories/components/TokenViewer';
import { Button, Icon, Snackbar, ChatBubble, Typography, Row, Column, Box } from '@components';
import { defaultTheme } from '@tokens';
import { ChatContainer, ChatContainerRef } from '.';
import {
  defaultActions,
  interactiveDemoActions,
  minimalLayoutWithRefControlActions,
} from './ChatContainer.stories.play';

const meta: Meta<typeof ChatContainer> = {
  title: 'Layout & Structure/ChatContainer',
  component: ChatContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
  The \`ChatContainer\` is a specialized layout component designed for building chat-like interfaces. It provides an organized and responsive structure ideal for chat applications, documentation readers, and similar interactive experiences.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Responsive Layout</b>
  <ul>
  <li>Adaptive sidebar behavior</li>
  <li>Mobile-friendly design</li>
  <li>Flexible content areas</li>
  </ul>
  </li>
  <li>
  <b>State Management</b>
  <ul>
  <li>Controlled mode via props</li>
  <li>Uncontrolled internal state</li>
  <li>Toggle callbacks</li>
  </ul>
  </li>
  <li>
  <b>Content Organization</b>
  <ul>
  <li>Dedicated header areas</li>
  <li>Collapsible sidebar</li>
  <li>Scrollable content regions</li>
  </ul>
  </li>
  <li><b>Accessibility</b> - Keyboard navigation and ARIA support</li>
  </ul>
  <br/>
  <h3>Layout Structure:</h3>
  <ul>
  <li><b>Header Areas</b>
  <ul>
  <li>Main header region</li>
  <li>Sidebar header region</li>
  </ul>
  </li>
  <li><b>Content Areas</b>
  <ul>
  <li>Primary content container</li>
  <li>Collapsible sidebar panel</li>
  <li>Flexible content slots</li>
  </ul>
  </li>
  <li><b>Responsive Behavior</b>
  <ul>
  <li>Desktop layout</li>
  <li>Mobile/tablet adaptations</li>
  <li>Collapsible regions</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
  argTypes: {
    // ============================================================================
    // State Management
    // ============================================================================
    isOpen: {
      control: 'boolean',
      description:
        'Controls the visibility of the sidebar. Set to `true` for open, `false` for closed. When undefined, the component manages its own state internally (uncontrolled mode).',
      table: {
        category: 'State Management',
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean | undefined' },
      },
    },
    onToggleSidebar: {
      action: 'onToggleSidebar',
      description:
        'Callback function fired when the sidebar is toggled. Receives the new `isOpen` state as an argument. Use this for controlled mode or to track sidebar state changes.',
      table: {
        category: 'State Management',
        type: {
          summary: '((open: boolean) => void) | undefined',
          detail: 'Function signature: (open: boolean) => void',
        },
      },
    },
    ref: {
      control: false,
      description:
        'Forwarded ref providing imperative access to container methods. Exposes `isOpen` property and `open()`, `close()`, `toggle()` methods for programmatic control.',
      table: {
        category: 'State Management',
        type: {
          summary: 'Ref<ChatContainerRef>',
          detail: 'ChatContainerRef: { isOpen: boolean; open: () => void; close: () => void; toggle: () => void; }',
        },
      },
    },

    // ============================================================================
    // Content Slots
    // ============================================================================
    children: {
      control: false,
      description:
        'Main content area typically containing chat messages, bubbles, or conversation history. This is the primary scrollable content region.',
      table: {
        category: 'Content Slots',
        type: { summary: 'ReactNode | undefined' },
      },
    },
    headerContent: {
      control: false,
      description:
        'Content rendered in the main header area above the primary content. Ideal for titles, navigation controls, or action buttons.',
      table: {
        category: 'Content Slots',
        type: { summary: 'ReactNode | undefined' },
      },
    },
    sidebarContent: {
      control: false,
      description:
        'Main content area of the sidebar when expanded. Typically used for navigation lists, filters, or additional context.',
      table: {
        category: 'Content Slots',
        type: { summary: 'ReactNode | undefined' },
      },
    },
    sidebarHeaderContent: {
      control: false,
      description:
        'Content rendered in the sidebar header section. Use for sidebar titles, icons, or contextual information.',
      table: {
        category: 'Content Slots',
        type: { summary: 'ReactNode | undefined' },
      },
    },
    sidebarMinifiedContent: {
      control: false,
      description:
        'Content displayed when the sidebar is collapsed/closed. Perfect for icon-based navigation, quick actions, or a compact navigation rail. Only shown when `isOpen` is `false`.',
      table: {
        category: 'Content Slots',
        type: { summary: 'ReactNode | undefined' },
      },
    },

    // ============================================================================
    // UI Controls
    // ============================================================================
    showSidebarAsideControl: {
      control: 'boolean',
      description:
        'Controls visibility of the toggle button in the sidebar header area. Set to `false` to hide the toggle control and manage sidebar state programmatically.',
      table: {
        category: 'UI Controls',
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean | undefined' },
      },
    },
    showSidebarHeaderControl: {
      control: 'boolean',
      description:
        'Controls visibility of the toggle button in the main header when sidebar is closed. Set to `false` to prevent users from reopening the sidebar via header control.',
      table: {
        category: 'UI Controls',
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean | undefined' },
      },
    },

    // ============================================================================
    // Styling
    // ============================================================================
    styles: {
      control: false,
      description:
        'Custom CSS-in-JS style overrides for the component. Allows fine-grained styling of internal elements.',
      table: {
        category: 'Styling',
        type: {
          summary: 'CSSObject | undefined',
          detail: 'Emotion CSSObject for custom styling',
        },
      },
    },
    className: {
      control: 'text',
      description: 'CSS class name applied to the root container element.',
      table: {
        category: 'Styling',
        type: { summary: 'string | undefined' },
      },
    },
  },
} as Meta<typeof ChatContainer>;

export default meta;

// --- Reusable Content for Stories ---
const SidebarHeaderContent = (
  <Row padding="16px" gap="8px" alignItems="center">
    <Icon name="chat" />
    <Typography styleVariant="bold">Chat History</Typography>
  </Row>
);

const SidebarContent = (
  <Column padding="16px" gap="8px">
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 1</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 2</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 3</Box>
  </Column>
);

const SidebarMinifiedContent = (handlers?: {
  onNewChatClick?: () => void;
  onHistoryClick?: () => void;
  onEditClick?: () => void;
}) => (
  <Column gap="16px" padding="16px 8px">
    <Button isIcon variant="text" onClick={handlers?.onNewChatClick || action('New Chat clicked')}>
      <Icon name="plus" />
    </Button>
    <Button isIcon variant="text" onClick={handlers?.onHistoryClick || action('History clicked')}>
      <Icon name="chat" />
    </Button>
    <Button isIcon variant="text" onClick={handlers?.onEditClick || action('Edit clicked')}>
      <Icon name="edit" />
    </Button>
  </Column>
);

const HeaderContent = (
  <Row padding="16px" gap="8px" alignItems="center">
    <Icon name="chatBubble" />
    <Typography styleVariant="bold">AI Assistant</Typography>
  </Row>
);

const MainContent = (handlers?: {
  onVolumeClick?: () => void;
  onCopyClick?: () => void;
  onThumbUpClick?: () => void;
  onThumbDownClick?: () => void;
  onRetryClick?: () => void;
}) => (
  <>
    <ChatBubble>Hi! Can you help me generate an SVG icon from some code?</ChatBubble>
    <ChatBubble
      variant="answer"
      actions={[
        <Button key="volumeUp" isIcon variant="text" onClick={handlers?.onVolumeClick || action('Voice clicked!')}>
          <Icon name="volumeUp" />
        </Button>,
        <Button key="contentCopy" isIcon variant="text" onClick={handlers?.onCopyClick || action('Copy clicked!')}>
          <Icon name="contentCopy" />
        </Button>,
        <Button key="thumbUp" isIcon variant="text" onClick={handlers?.onThumbUpClick || action('Like clicked!')}>
          <Icon name="thumbUp" />
        </Button>,
        <Button
          key="thumbDown"
          isIcon
          variant="text"
          onClick={handlers?.onThumbDownClick || action('Dislike clicked!')}
        >
          <Icon name="thumbDown" />
        </Button>,
      ]}
    >
      Sure! Please paste the code you'd like me to convert, and I'll generate the SVG file for you.
    </ChatBubble>
    <ChatBubble>One more question.</ChatBubble>
    <Snackbar
      variant="error"
      colored
      title="Error"
      isAnimated={false}
      message="Click the button below to retry."
      dismissOnClick={false}
      onClose={null}
      width="100%"
      action={
        <Button variant="tertiary" onClick={handlers?.onRetryClick || action('Action clicked')}>
          Retry
        </Button>
      }
    />
    <ChatBubble variant="answer" status="pending"></ChatBubble>
  </>
);

export const Default: StoryFn = (args: any) => {
  return (
    <ChatContainer
      {...args}
      onToggleSidebar={args.onToggleSidebar}
      sidebarHeaderContent={SidebarHeaderContent}
      sidebarContent={SidebarContent}
      sidebarMinifiedContent={SidebarMinifiedContent({
        onNewChatClick: args.onNewChatClick,
        onHistoryClick: args.onHistoryClick,
        onEditClick: args.onEditClick,
      })}
      headerContent={HeaderContent}
    >
      {MainContent({
        onVolumeClick: args.onVolumeClick,
        onCopyClick: args.onCopyClick,
        onThumbUpClick: args.onThumbUpClick,
        onThumbDownClick: args.onThumbDownClick,
        onRetryClick: args.onRetryClick,
      })}
    </ChatContainer>
  );
};
Default.args = {
  onVolumeClick: fn(action('Voice clicked!')),
  onCopyClick: fn(action('Copy clicked!')),
  onThumbUpClick: fn(action('Like clicked!')),
  onThumbDownClick: fn(action('Dislike clicked!')),
  onRetryClick: fn(action('Retry clicked!')),
  onNewChatClick: fn(action('New Chat clicked!')),
  onHistoryClick: fn(action('History clicked!')),
  onEditClick: fn(action('Edit clicked!')),
  onToggleSidebar: fn((isOpen: boolean) => action('Sidebar toggled')(isOpen)),
};
Default.parameters = {
  docs: {
    description: {
      story:
        'Default example showing ChatContainer with all content slots: headerContent, sidebarHeaderContent, sidebarContent, and sidebarMinifiedContent. The component is uncontrolled by default (internal state). Close the sidebar to see the minified rail appear.',
    },
    source: {
      code: `
import { ChatContainer, Button, Row, Column, Box, Icon, Typography } from 'gd-design-library';

const SidebarHeaderContent = (
  <Row padding="16px" gap="8px" alignItems="center">
    <Icon name="chat" />
    <Typography styleVariant="bold">Chat History</Typography>
  </Row>
);

const SidebarContent = (
  <Column padding="16px" gap="8px">
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 1</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 2</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 3</Box>
  </Column>
);

const SidebarMinifiedContent = (
  <Column gap="16px" padding="16px 8px">
    <Button isIcon variant="text" onClick={action('New Chat clicked')} title="New Chat" aria-label="New Chat">
      <Icon name="plus" />
    </Button>
    <Button isIcon variant="text" onClick={action('History clicked')} title="History" aria-label="History">
      <Icon name="chat" />
    </Button>
    <Button isIcon variant="text" onClick={action('Edit clicked')} title="Edit" aria-label="Edit">
      <Icon name="edit" />
    </Button>
  </Column>
);

const HeaderContent = (
  <Row padding="16px" gap="8px" alignItems="center">
    <Icon name="chatBubble" />
    <Typography styleVariant="bold">AI Assistant</Typography>
  </Row>
);

const MyComponent = () => {
  return (
    <ChatContainer
      sidebarHeaderContent={SidebarHeaderContent}
      sidebarContent={SidebarContent}
      sidebarMinifiedContent={SidebarMinifiedContent}
      headerContent={HeaderContent}
    >
      {MainContent}
    </ChatContainer>
  );
};  
`,
    },
  },
};
Default.play = defaultActions;

export const MinimalLayoutWithRefControl: StoryFn = (args: any) => {
  const ref = useRef<ChatContainerRef>(null);
  const toggleSidebar = () => ref.current?.toggle();

  return (
    <ChatContainer {...args} ref={ref} sidebarContent={SidebarContent}>
      {MainContent({
        onVolumeClick: args.onVolumeClick,
        onCopyClick: args.onCopyClick,
        onThumbUpClick: args.onThumbUpClick,
        onThumbDownClick: args.onThumbDownClick,
        onRetryClick: args.onRetryClick,
      })}
      <Button variant="outlined" onClick={toggleSidebar}>
        Toggle Sidebar Programmatically
      </Button>
    </ChatContainer>
  );
};
MinimalLayoutWithRefControl.parameters = {
  docs: {
    description: {
      story:
        'Minimal layout without main header content that demonstrates programmatic control via ref. Uses sidebarContent and sidebarMinifiedContent; the Toggle button calls ref.toggle() to open/close the sidebar.',
    },
    source: {
      code: `
import { useRef } from 'react';
import { ChatContainer, type ChatContainerRef, Button,  Column, Box, Icon } from 'gd-design-library';

const SidebarContent = (
  <Column padding="16px" gap="8px">
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 1</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 2</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 3</Box>
  </Column>
);

const MyComponent = () => {
  const ref = useRef<ChatContainerRef>(null);
  const toggleSidebar = () => ref.current?.toggle();

  return (
    <ChatContainer
      ref={ref}
      sidebarContent={<SidebarContent />}
    >
      <div>Main Content</div>
      <Button variant="outlined" onClick={toggleSidebar}>
        Toggle Sidebar Programmatically
      </Button>
    </ChatContainer>
  );
};  
`,
    },
  },
};
MinimalLayoutWithRefControl.play = minimalLayoutWithRefControlActions;

export const InteractiveDemo: StoryFn = (args: any) => {
  const ref = useRef<ChatContainerRef>(null);
  const [isOpen, setIsOpen] = React.useState(true);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    args.onToggleSidebar?.(open);
  };

  return (
    <ChatContainer
      ref={ref}
      isOpen={isOpen}
      onToggleSidebar={handleToggle}
      sidebarHeaderContent={SidebarHeaderContent}
      sidebarContent={SidebarContent}
      sidebarMinifiedContent={SidebarMinifiedContent({
        onNewChatClick: args.onNewChatClick,
        onHistoryClick: args.onHistoryClick,
        onEditClick: args.onEditClick,
      })}
      showSidebarHeaderControl={false}
      headerContent={
        <Row gap="16px">
          <Row gap="16px" alignItems="center">
            <Icon name="chatBubble" />
            <Typography styleVariant="bold">AI Assistant</Typography>
          </Row>
          <Row gap="16px">
            <Button
              variant="outlined"
              onClick={() => {
                ref.current?.toggle();
                args.onToggleClick?.();
              }}
            >
              Toggle
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                ref.current?.open();
                args.onOpenClick?.();
              }}
            >
              Open
            </Button>
            <Button
              variant="tertiary"
              onClick={() => {
                ref.current?.close();
                args.onCloseClick?.();
              }}
            >
              Close
            </Button>
          </Row>
        </Row>
      }
    >
      {MainContent({
        onVolumeClick: args.onVolumeClick,
        onCopyClick: args.onCopyClick,
        onThumbUpClick: args.onThumbUpClick,
        onThumbDownClick: args.onThumbDownClick,
        onRetryClick: args.onRetryClick,
      })}
    </ChatContainer>
  );
};
InteractiveDemo.args = {
  onToggleSidebar: fn((isOpen: boolean) => action('Sidebar toggled')(isOpen)),
  onNewChatClick: fn(action('New Chat clicked!')),
  onHistoryClick: fn(action('History clicked!')),
  onEditClick: fn(action('Edit clicked!')),
  onVolumeClick: fn(action('Voice clicked!')),
  onCopyClick: fn(action('Copy clicked!')),
  onThumbUpClick: fn(action('Like clicked!')),
  onThumbDownClick: fn(action('Dislike clicked!')),
  onRetryClick: fn(action('Retry clicked!')),
};
InteractiveDemo.storyName = 'Interactive Demo';
InteractiveDemo.parameters = {
  docs: {
    description: {
      story: `
  Interactive example demonstrating controlled usage with onToggleSidebar. It shows:
  <br/>
  <ul>
  <li>Programmatic control via ref methods (<code>open()</code>, <code>close()</code>, <code>toggle()</code>)</li>
  <li>Controlled state via <code>isOpen</code> with <code>onToggleSidebar</code> sync</li>
  <li>Header actions to toggle/open/close the sidebar</li>
  <li>Minified rail visible when the sidebar is closed</li>
  </ul>
      `,
    },
    source: {
      code: `
import { useRef } from 'react';
import { ChatContainer, type ChatContainerRef, Button, Icon, Row, Column, Box, Typography } from 'gd-design-library';

const SidebarHeaderContent = (
  <Row padding="16px" gap="8px" alignItems="center">
    <Icon name="chat" />
    <Typography styleVariant="bold">Chat History</Typography>
  </Row>
);

const SidebarContent = (
  <Column padding="16px" gap="8px">
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 1</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 2</Box>
    <Box style={{ padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' }}>Recent conversation 3</Box>
  </Column>
);

const SidebarMinifiedContent = (
  <Column gap="16px" padding="16px 8px">
    <Button isIcon variant="text" onClick={action('New Chat clicked')} title="New Chat" aria-label="New Chat">
      <Icon name="plus" />
    </Button>
    <Button isIcon variant="text" onClick={action('History clicked')} title="History" aria-label="History">
      <Icon name="chat" />
    </Button>
    <Button isIcon variant="text" onClick={action('Edit clicked')} title="Edit" aria-label="Edit">
      <Icon name="edit" />
    </Button>
  </Column>
);

const HeaderContent = (
  <Row gap="16px">
    <Row gap="16px" alignItems="center">
      <Icon name="chatBubble" />
      <Typography styleVariant="bold">AI Assistant</Typography>
    </Row>
    <Row gap="16px">
      <Button variant="outlined" onClick={() => ref.current?.toggle()}>
        Toggle
      </Button>
      <Button variant="secondary" onClick={() => ref.current?.open()}>
        Open
      </Button>
      <Button variant="tertiary" onClick={() => ref.current?.close()}>
        Close
      </Button>
    </Row>
  </Row>
);

const MyComponent = () => {
  const ref = useRef<ChatContainerRef>(null);
  const [isOpen, setIsOpen] = React.useState(true);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    action('Sidebar toggled')(open);
  };

  return (
    <ChatContainer
      ref={ref}
      isOpen={isOpen}
      onToggleSidebar={handleToggle}
      sidebarHeaderContent={SidebarHeaderContent}
      sidebarContent={SidebarContent}
      sidebarMinifiedContent={SidebarMinifiedContent}
      showSidebarHeaderControl={false}
      headerContent={HeaderContent}
    >
      {MainContent}
    </ChatContainer>
  );
};
      `,
    },
  },
};
InteractiveDemo.play = interactiveDemoActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ chat: defaultTheme.chat }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
