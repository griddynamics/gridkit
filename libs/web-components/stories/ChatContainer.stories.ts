import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import type { GdChatContainer, GdIcon } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { boxArgTypes, formattedSource, type BoxStoryArgs } from './layout-story-helpers';
import {
  defaultActions,
  interactiveDemoActions,
  minimalLayoutWithRefControlActions,
} from './ChatContainer.stories.play';

type Action = () => void;
type Args = BoxStoryArgs & {
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
  const node = element('gd-row', { gutter: 8, alignItems: 'center' });
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
  const node = element('gd-column', { gutter: 8, padding: '16px' });
  node.slot = 'sidebar';
  for (let index = 1; index <= 3; index++) {
    const item = element('gd-box', { tabIndex: 0 }, `Recent conversation ${index}`);
    item.styles = { padding: 8, background: '#f0f0f0', borderRadius: 4, cursor: 'pointer' };
    node.append(item);
  }
  return node;
}

function sidebarMinified() {
  const node = element('gd-column', { gutter: 16, padding: '16px 8px' });
  node.slot = 'sidebar-minified';
  node.append(
    button('New Chat', 'text', action('New Chat clicked'), 'plus'),
    button('History', 'text', action('History clicked'), 'chat'),
    button('Edit', 'text', action('Edit clicked'), 'edit')
  );
  return node;
}

function headerContent() {
  const node = row(icon('chatBubble'), element('gd-typography', { styleVariant: 'bold' }, 'AI Assistant'));
  node.slot = 'header';
  node.padding = '16px';
  return node;
}

function bubble(text: string, answer = false) {
  const node = document.createElement('div');
  node.dataset.testid = 'ChatBubble';
  node.style.cssText = answer
    ? 'align-self:flex-start;display:flex;flex-direction:column;gap:8px;margin:8px 0;padding:16px;width:100%;box-sizing:border-box;font-size:14px;line-height:20px;'
    : 'align-self:flex-end;display:flex;flex-direction:column;gap:8px;margin:8px 0;background:#f7f6f5;padding:8px 16px;max-width:566px;box-sizing:border-box;font-size:14px;line-height:20px;';
  node.textContent = text;
  return node;
}

function mainContent() {
  const fragment = document.createDocumentFragment();
  fragment.append(bubble('Hi! Can you help me generate an SVG icon from some code?'));

  const answer = bubble(
    "Sure! Please paste the code you'd like me to convert, and I'll generate the SVG file for you.",
    true
  );
  const actions = row(
    button('Voice', 'text', action('Voice clicked!'), 'volumeUp'),
    button('Copy', 'text', action('Copy clicked!'), 'contentCopy'),
    button('Like', 'text', action('Like clicked!'), 'thumbUp'),
    button('Dislike', 'text', action('Dislike clicked!'), 'thumbDown')
  );
  actions.dataset.testid = 'ChatBubble-actions';
  answer.append(actions);
  fragment.append(answer, bubble('One more question.'));

  const snackbar = document.createElement('div');
  snackbar.dataset.testid = 'Snackbar';
  snackbar.style.cssText =
    'align-self:stretch;background:#fff0f0;padding:8px 16px;display:flex;flex-direction:column;gap:8px;box-shadow:0 4px 12px #00000014;box-sizing:border-box;';
  const body = document.createElement('div');
  body.style.cssText = 'display:flex;align-items:flex-start;gap:8px;';
  const errorIcon = element('gd-icon', { name: 'error', fill: 'icon.error', width: 20, height: 20 });
  const snackbarContent = document.createElement('div');
  snackbarContent.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:4px;flex:1;';
  const title = element('gd-typography', { variant: 'small', styleVariant: 'bold' }, 'Error');
  const message = element('gd-typography', { variant: 'small' }, 'Click the button below to retry.');
  snackbarContent.append(title, message);
  body.append(errorIcon, snackbarContent);
  const snackbarActions = document.createElement('div');
  snackbarActions.style.paddingTop = '4px';
  snackbarActions.append(button('Retry', 'tertiary', action('Action clicked')));
  snackbar.append(body, snackbarActions);

  const pending = document.createElement('div');
  pending.dataset.testid = 'ChatBubble';
  pending.style.cssText =
    'align-self:flex-start;display:flex;flex-direction:column;gap:8px;margin:8px 0;padding:16px;width:100%;box-sizing:border-box;';
  const loader = element('gd-loader', {
    name: 'dots',
    variant: 'inline',
    size: 'xs',
    withWrapper: false,
    rounded: 'round',
  });
  pending.append(loader);
  fragment.append(snackbar, pending);
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
    const controls = element('gd-row', { gutter: 16 });
    controls.append(
      button('Toggle', 'outlined', () => {
        node.toggle();
        args.onToggleClick?.();
      }),
      button('Open', 'secondary', () => {
        node.open();
        args.onOpenClick?.();
      }),
      button('Close', 'tertiary', () => {
        node.close();
        args.onCloseClick?.();
      })
    );
    const header = element('gd-row', { gutter: 16 });
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

const meta = {
  title: 'Layout & Structure/ChatContainer',
  component: 'gd-chat-container',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive chat layout with named content regions, a collapsible sidebar, a minified navigation rail, token-backed styling, a toggle event, and open(), close(), and toggle() methods.',
      },
    },
  },
  args: {
    showSidebarAsideControl: true,
    showSidebarHeaderControl: true,
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls the current sidebar visibility.',
      table: { category: 'State Management', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    onToggleSidebar: {
      action: 'onToggleSidebar',
      description: 'Receives the new state from the bubbling gd-toggle-sidebar event.',
      table: { category: 'State Management', type: { summary: '(open: boolean) => void' } },
    },
    children: {
      control: false,
      description: 'Main content mapped to the default slot.',
      table: { category: 'Content Slots', type: { summary: 'Node' } },
    },
    headerContent: {
      control: false,
      description: 'Main header content mapped to slot="header".',
      table: { category: 'Content Slots', type: { summary: 'Node' } },
    },
    sidebarContent: {
      control: false,
      description: 'Expanded sidebar content mapped to slot="sidebar".',
      table: { category: 'Content Slots', type: { summary: 'Node' } },
    },
    sidebarHeaderContent: {
      control: false,
      description: 'Sidebar header content mapped to slot="sidebar-header".',
      table: { category: 'Content Slots', type: { summary: 'Node' } },
    },
    sidebarMinifiedContent: {
      control: false,
      description: 'Collapsed rail content mapped to slot="sidebar-minified".',
      table: { category: 'Content Slots', type: { summary: 'Node' } },
    },
    showSidebarAsideControl: {
      control: 'boolean',
      description: 'Shows the close control in the sidebar header.',
      table: { category: 'UI Controls', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    showSidebarHeaderControl: {
      control: 'boolean',
      description: 'Shows the open control in the main header.',
      table: { category: 'UI Controls', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    styles: {
      control: false,
      description: 'Custom CSS declarations applied to the component host after Box styles.',
      table: { category: 'Styling', type: { summary: 'Record<string, string | number>' } },
    },
    ...boxArgTypes,
  },
  render: (args: Args) => chat(args),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const sharedArgs = {
  onToggleSidebar: fn(),
};

export const Default: Story = {
  args: sharedArgs,
  play: defaultActions,
  parameters: formattedSource(`
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
  `),
};

export const MinimalLayoutWithRefControl: Story = {
  args: sharedArgs,
  render: (args) => chat(args, { minimal: true }),
  play: minimalLayoutWithRefControlActions,
  parameters: formattedSource(`
<gd-chat-container>
  <gd-column slot="sidebar">Recent conversations</gd-column>
  <div>Conversation content</div>
  <gd-button variant="outlined">Toggle Sidebar Programmatically</gd-button>
</gd-chat-container>

<script type="module">
  const chat = document.querySelector('gd-chat-container');
  document.querySelector('gd-button').addEventListener('click', () => chat.toggle());
</script>
  `),
};

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  args: { ...sharedArgs, onToggleClick: fn(), onOpenClick: fn(), onCloseClick: fn() },
  render: (args) => chat(args, { interactive: true }),
  play: interactiveDemoActions,
  parameters: formattedSource(`
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
  `),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('chat'),
  parameters: formattedSource(`
import { defaultTheme } from 'gd-design-library/tokens';

console.log(defaultTheme.chat);
  `),
};
