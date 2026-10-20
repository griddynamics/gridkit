import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import type { GdChatContainer, GdIcon } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';
import {
  defaultActions,
  interactiveDemoActions,
  minimalLayoutWithRefControlActions,
} from './ChatContainer.stories.play';

type Action = () => void;
type Args = {
  [key: string]: unknown;
  isOpen?: boolean;
  showSidebarAsideControl?: boolean;
  showSidebarHeaderControl?: boolean;
  onToggleSidebar?: (open: boolean) => void;
  onToggleClick?: Action;
  onOpenClick?: Action;
  onCloseClick?: Action;
  children?: unknown;
  headerContent?: unknown;
  sidebarContent?: unknown;
  sidebarHeaderContent?: unknown;
  sidebarMinifiedContent?: unknown;
};

function icon(name: GdIcon['name']) {
  return element('gd-icon', { name });
}

function button(
  label: string,
  variant: 'text' | 'outlined' | 'secondary' | 'tertiary',
  handler?: Action,
  iconName?: GdIcon['name']
) {
  const node = element('gd-button', { variant, isIcon: Boolean(iconName) });
  if (iconName) {
    node.setAttribute('aria-label', label);
    node.append(icon(iconName));
  } else node.textContent = label;
  if (handler) node.addEventListener('click', handler);
  return node;
}

function row(...children: Node[]) {
  const node = element('gd-row', { gap: '8px', alignItems: 'center' });
  node.append(...children);
  return node;
}

function sidebarHeader() {
  const node = row(icon('chat'), element('gd-typography', { styleVariant: 'bold' }, 'Chat History'));
  node.slot = 'sidebar-header';
  node.padding = '16px';
  return node;
}

function sidebarContent() {
  const node = element('gd-column', { gap: '8px', padding: '16px' });
  node.slot = 'sidebar';
  for (let index = 1; index <= 3; index++) {
    const item = element('gd-box', { tabIndex: 0 }, `Recent conversation ${index}`);
    item.styles = { padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' };
    node.append(item);
  }
  return node;
}

function sidebarMinified() {
  const node = element('gd-column', { gap: '16px', padding: '16px 8px' });
  node.slot = 'sidebar-minified';
  node.append(
    button('New chat', 'text', action('New Chat clicked'), 'plus'),
    button('Chat history', 'text', action('History clicked'), 'chat'),
    button('Edit chat', 'text', action('Edit clicked'), 'edit')
  );
  return node;
}

function headerContent() {
  const node = row(icon('chatBubble'), element('gd-typography', { styleVariant: 'bold' }, 'AI Assistant'));
  node.slot = 'header';
  node.padding = '16px';
  return node;
}

// Question bubbles follow the chat bubble tokens: the maximum width grows with the viewport.
const bubbleStyles = `
  .gd-story-bubble-question { max-width: none; }
  @media (min-width: 320px) { .gd-story-bubble-question { max-width: 320px; } }
  @media (min-width: 480px) { .gd-story-bubble-question { max-width: 348px; } }
  @media (min-width: 768px) { .gd-story-bubble-question { max-width: 348px; } }
  @media (min-width: 1024px) { .gd-story-bubble-question { max-width: 566px; } }
`;

function bubble(variant: 'question' | 'answer', content: Node | string, actions?: Node, pending = false) {
  const node = document.createElement('div');
  node.dataset.testid = 'ChatBubble';
  node.className = variant === 'question' ? 'gd-story-bubble-question' : '';
  node.style.cssText = `display:flex;flex-direction:column;gap:8px;clear:both;margin:8px 0;font-size:14px;font-weight:400;line-height:20px;${
    variant === 'question' ? 'padding:8px 16px;background-color:#f8f7f5;float:right' : 'padding:16px;width:100%'
  }`;
  const body = document.createElement('div');
  body.dataset.testid = 'ChatBubble-content';
  body.style.cssText = `display:flex;flex-direction:column;gap:8px${pending ? ';align-items:flex-start' : ''}`;
  body.append(content);
  node.append(body);
  if (actions) node.append(actions);
  return node;
}

function mainContent() {
  const fragment = document.createDocumentFragment();
  const styles = document.createElement('style');
  styles.textContent = bubbleStyles;
  fragment.append(styles, bubble('question', 'Hi! Can you help me generate an SVG icon from some code?'));

  const actions = document.createElement('div');
  actions.dataset.testid = 'ChatBubble-actions';
  actions.style.cssText = 'display:flex;flex-direction:row';
  actions.append(
    button('Read response aloud', 'text', action('Voice clicked!'), 'volumeUp'),
    button('Copy response', 'text', action('Copy clicked!'), 'contentCopy'),
    button('Like response', 'text', action('Like clicked!'), 'thumbUp'),
    button('Dislike response', 'text', action('Dislike clicked!'), 'thumbDown')
  );
  fragment.append(
    bubble(
      'answer',
      "Sure! Please paste the code you'd like me to convert, and I'll generate the SVG file for you.",
      actions
    ),
    bubble('question', 'One more question.')
  );

  const snackbar = document.createElement('div');
  snackbar.dataset.testid = 'Snackbar';
  snackbar.style.cssText =
    'position:relative;display:flex;flex-direction:column;gap:8px;width:100%;box-sizing:border-box;padding:8px 16px;background-color:#fdeded;box-shadow:0 4px 12px 0 rgba(0,0,0,0.1);font-size:16px;line-height:24px';
  const body = document.createElement('div');
  body.style.cssText = 'display:flex;flex-direction:row;align-items:flex-start;gap:8px';
  const errorIcon = element('gd-icon', { name: 'error', fill: 'icon.error', width: 20, height: 20 });
  const snackbarContent = document.createElement('div');
  snackbarContent.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:4px;flex:1 1 0%';
  // Snackbar title and description tokens: `as: div`, `align: start`, `variant: small` with a semibold or normal style.
  const title = element(
    'gd-typography',
    { as: 'div', align: 'start', variant: 'small', styleVariant: 'semibold' },
    'Error'
  );
  const message = element(
    'gd-typography',
    { as: 'div', align: 'start', variant: 'small', styleVariant: 'normal' },
    'Click the button below to retry.'
  );
  const snackbarActions = document.createElement('div');
  snackbarActions.style.paddingTop = '4px';
  snackbarActions.append(button('Retry', 'tertiary', action('Action clicked')));
  snackbarContent.append(title, message, snackbarActions);
  body.append(errorIcon, snackbarContent);
  snackbar.append(body);

  const loader = element('gd-loader', { name: 'dots', variant: 'inline', size: 'xs', withWrapper: false });
  fragment.append(snackbar, bubble('answer', loader, undefined, true));
  return fragment;
}

function chat(args: Args, options: { minimal?: boolean; interactive?: boolean } = {}) {
  const node = element('gd-chat-container', {
    ...args,
    isOpen: options.interactive ? (args.isOpen ?? true) : (args.isOpen ?? false),
    showSidebarAsideControl: args.showSidebarAsideControl ?? true,
    showSidebarHeaderControl: options.interactive ? false : (args.showSidebarHeaderControl ?? true),
  } as Partial<GdChatContainer>);
  node.addEventListener('gd-toggle-sidebar', (event) => args.onToggleSidebar?.(event.detail.open));
  node.append(sidebarContent(), mainContent());

  if (!options.minimal) node.append(sidebarHeader(), sidebarMinified());
  if (options.interactive) {
    const heading = row(icon('chatBubble'), element('gd-typography', { styleVariant: 'bold' }, 'AI Assistant'));
    heading.gap = '16px';
    const controls = element('gd-row', { gap: '16px' });
    // The controls row stretches its children; a flex host lets the inner native button fill that height.
    const stretched = (node: HTMLElement) => {
      node.style.display = 'flex';
      return node;
    };
    controls.append(
      stretched(
        button('Toggle', 'outlined', () => {
          node.toggle();
          args.onToggleClick?.();
        })
      ),
      stretched(
        button('Open', 'secondary', () => {
          node.open();
          args.onOpenClick?.();
        })
      ),
      stretched(
        button('Close', 'tertiary', () => {
          node.close();
          args.onCloseClick?.();
        })
      )
    );
    const header = element('gd-row', { gap: '16px' });
    header.slot = 'header';
    header.append(heading, controls);
    node.append(header);
  } else if (!options.minimal) node.append(headerContent());

  if (options.minimal) {
    const toggle = button('Toggle Sidebar Programmatically', 'outlined', () => node.toggle());
    node.append(toggle);
  }
  return node;
}

const argTypes: NonNullable<Meta<Args>['argTypes']> = {
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
      type: { summary: '((open: boolean) => void) | undefined', detail: 'Function signature: (open: boolean) => void' },
    },
  },
  ref: {
    control: false,
    description:
      'Element reference providing imperative access to container methods. Exposes `isOpen` property and `open()`, `close()`, `toggle()` methods for programmatic control.',
    table: {
      category: 'State Management',
      type: {
        summary: 'GdChatContainer',
        detail: 'GdChatContainer: { isOpen: boolean; open: () => void; close: () => void; toggle: () => void; }',
      },
    },
  },
  children: {
    control: false,
    description:
      'Main content area typically containing chat messages, bubbles, or conversation history. This is the primary scrollable content region.',
    table: { category: 'Content Slots', type: { summary: 'Node | undefined' } },
  },
  headerContent: {
    control: false,
    description:
      'Content rendered in the main header area above the primary content. Ideal for titles, navigation controls, or action buttons.',
    table: { category: 'Content Slots', type: { summary: 'Node | undefined' } },
  },
  sidebarContent: {
    control: false,
    description:
      'Main content area of the sidebar when expanded. Typically used for navigation lists, filters, or additional context.',
    table: { category: 'Content Slots', type: { summary: 'Node | undefined' } },
  },
  sidebarHeaderContent: {
    control: false,
    description:
      'Content rendered in the sidebar header section. Use for sidebar titles, icons, or contextual information.',
    table: { category: 'Content Slots', type: { summary: 'Node | undefined' } },
  },
  sidebarMinifiedContent: {
    control: false,
    description:
      'Content displayed when the sidebar is collapsed/closed. Perfect for icon-based navigation, quick actions, or a compact navigation rail. Only shown when `isOpen` is `false`.',
    table: { category: 'Content Slots', type: { summary: 'Node | undefined' } },
  },
  showSidebarAsideControl: {
    control: 'boolean',
    description:
      'Controls visibility of the toggle button in the sidebar header area. Set to `false` to hide the toggle control and manage sidebar state programmatically.',
    table: { category: 'UI Controls', defaultValue: { summary: 'true' }, type: { summary: 'boolean | undefined' } },
  },
  showSidebarHeaderControl: {
    control: 'boolean',
    description:
      'Controls visibility of the toggle button in the main header when sidebar is closed. Set to `false` to prevent users from reopening the sidebar via header control.',
    table: { category: 'UI Controls', defaultValue: { summary: 'true' }, type: { summary: 'boolean | undefined' } },
  },
  styles: {
    control: false,
    description: 'Custom CSS style overrides for the component. Allows fine-grained styling of internal elements.',
    table: {
      category: 'Styling',
      type: { summary: 'Record<string, string | number> | undefined', detail: 'Custom CSS declarations' },
    },
  },
  className: {
    control: 'text',
    description: 'CSS class name applied to the root container element.',
    table: { category: 'Styling', type: { summary: 'string | undefined' } },
  },
};
const description =
  '\n  The `ChatContainer` is a specialized layout component designed for building chat-like interfaces. It provides an organized and responsive structure ideal for chat applications, documentation readers, and similar interactive experiences.\n  <br/>\n  <br/>\n  <h3>Key Features:</h3>\n  <ul>\n  <li>\n  <b>Responsive Layout</b>\n  <ul>\n  <li>Adaptive sidebar behavior</li>\n  <li>Mobile-friendly design</li>\n  <li>Flexible content areas</li>\n  </ul>\n  </li>\n  <li>\n  <b>State Management</b>\n  <ul>\n  <li>Controlled mode via props</li>\n  <li>Uncontrolled internal state</li>\n  <li>Toggle callbacks</li>\n  </ul>\n  </li>\n  <li>\n  <b>Content Organization</b>\n  <ul>\n  <li>Dedicated header areas</li>\n  <li>Collapsible sidebar</li>\n  <li>Scrollable content regions</li>\n  </ul>\n  </li>\n  <li><b>Accessibility</b> - Keyboard navigation and ARIA support</li>\n  </ul>\n  <br/>\n  <h3>Layout Structure:</h3>\n  <ul>\n  <li><b>Header Areas</b>\n  <ul>\n  <li>Main header region</li>\n  <li>Sidebar header region</li>\n  </ul>\n  </li>\n  <li><b>Content Areas</b>\n  <ul>\n  <li>Primary content container</li>\n  <li>Collapsible sidebar panel</li>\n  <li>Flexible content slots</li>\n  </ul>\n  </li>\n  <li><b>Responsive Behavior</b>\n  <ul>\n  <li>Desktop layout</li>\n  <li>Mobile/tablet adaptations</li>\n  <li>Collapsible regions</li>\n  </ul>\n  </li>\n  </ul>\n        \n\n';

const meta = {
  title: 'Layout & Structure/ChatContainer',
  component: 'gd-chat-container',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: description } },
  },
  args: {
    showSidebarAsideControl: true,
    showSidebarHeaderControl: true,
  },
  argTypes,
  render: (args: Args) => chat(args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const sharedArgs = {
  onToggleSidebar: fn((isOpen: boolean) => action('Sidebar toggled')(isOpen)),
};

const storyParameters = (description: string, source: string) => ({
  docs: { ...formattedSource(source).docs, description: { story: description } },
});

export const Default: Story = {
  args: sharedArgs,
  play: defaultActions,
  parameters: storyParameters(
    'Default example showing ChatContainer with all content slots: headerContent, sidebarHeaderContent, sidebarContent, and sidebarMinifiedContent. The component is uncontrolled by default (internal state). Close the sidebar to see the minified rail appear.',
    `
<gd-chat-container>
  <gd-row slot="sidebar-header">Chat History</gd-row>
  <gd-column slot="sidebar">Recent conversations</gd-column>
  <gd-column slot="sidebar-minified">Compact actions</gd-column>
  <gd-row slot="header">AI Assistant</gd-row>
  <div>Conversation content</div>
</gd-chat-container>

<script type="module">
  const chat = document.querySelector('gd-chat-container');
  chat.addEventListener('gd-toggle-sidebar', (event) => console.log(event.detail.open));
</script>
  `
  ),
};

export const MinimalLayoutWithRefControl: Story = {
  args: sharedArgs,
  render: (args) => chat(args, { minimal: true }),
  play: minimalLayoutWithRefControlActions,
  parameters: storyParameters(
    'Minimal layout without main header content that demonstrates programmatic control via the element methods. Uses sidebarContent and sidebarMinifiedContent; the Toggle button calls toggle() to open/close the sidebar.',
    `
<gd-chat-container>
  <gd-column slot="sidebar">Recent conversations</gd-column>
  <div>Conversation content</div>
  <gd-button variant="outlined">Toggle Sidebar Programmatically</gd-button>
</gd-chat-container>

<script type="module">
  const chat = document.querySelector('gd-chat-container');
  document.querySelector('gd-button').addEventListener('click', () => chat.toggle());
</script>
  `
  ),
};

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  args: { ...sharedArgs, onToggleClick: fn(), onOpenClick: fn(), onCloseClick: fn() },
  render: (args) => chat(args, { interactive: true }),
  play: interactiveDemoActions,
  parameters: storyParameters(
    `
  Interactive example demonstrating controlled usage with onToggleSidebar. It shows:
  <br/>
  <ul>
  <li>Programmatic control via element methods (\`open()\`, \`close()\`, \`toggle()\`)</li>
  <li>Controlled state via \`isOpen\` with \`onToggleSidebar\` sync</li>
  <li>Header actions to toggle/open/close the sidebar</li>
  <li>Minified rail visible when the sidebar is closed</li>
  </ul>
      `,
    `
<gd-chat-container is-open show-sidebar-aside-control>
  <gd-row slot="sidebar-header">Chat History</gd-row>
  <gd-column slot="sidebar">Recent conversations</gd-column>
  <gd-column slot="sidebar-minified">Compact actions</gd-column>
  <gd-row slot="header">
    <span>AI Assistant</span>
    <gd-button variant="outlined">Toggle</gd-button>
    <gd-button variant="secondary">Open</gd-button>
    <gd-button variant="tertiary">Close</gd-button>
  </gd-row>
  <div>Conversation content</div>
</gd-chat-container>

<script type="module">
  const chat = document.querySelector('gd-chat-container');
  const [toggle, open, close] = document.querySelectorAll('[slot="header"] gd-button');
  toggle.addEventListener('click', () => chat.toggle());
  open.addEventListener('click', () => chat.open());
  close.addEventListener('click', () => chat.close());
</script>
  `
  ),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('chat'),
  parameters: {
    layout: 'padded',
    ...formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.chat);
    `),
  },
};
