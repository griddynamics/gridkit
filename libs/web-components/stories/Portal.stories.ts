import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdPortal, GdTypography, PortalStyles, PortalWrapperVariant } from '../src';
import { element } from './helpers';
import { formattedSource } from './layout-story-helpers';

interface PortalArgs {
  container?: Element | DocumentFragment | null;
  wrapperVariant: PortalWrapperVariant;
  withWrapper: boolean;
  blocksScroll: boolean;
  WrapperView: keyof HTMLElementTagNameMap;
  styles?: PortalStyles;
  children?: string;
}

function typography(variant: GdTypography['variant'], text: string, styles: Record<string, string | number> = {}) {
  return element('gd-typography', { variant, styles }, text);
}

function link(text: string, onClick: () => void) {
  const node = element('gd-link', { href: '#' }, text);
  node.addEventListener('click', (event) => {
    event.preventDefault();
    onClick();
  });
  return node;
}

function portalWith(args: PortalArgs, target: Element | null, ...content: Node[]) {
  const portal = document.createElement('gd-portal');
  const portalProps = { ...args };
  delete portalProps.children;
  Object.assign(portal, portalProps, {
    container: Object.prototype.hasOwnProperty.call(args, 'container') ? args.container : target,
  });
  portal.append(...content);
  return portal;
}

function toggleStory(
  args: PortalArgs,
  options: {
    targetId?: string;
    background: string;
    heading: string;
    description: string;
    content: string;
    contentVariant?: GdTypography['variant'];
    contentStyles: Record<string, string | number>;
    overlayStyles?: Record<string, string | number>;
    closeLabel: string;
    customTarget?: boolean;
    directChildren?: boolean;
  }
) {
  const root = element('gd-flex-container', { position: 'relative' });
  const target = element('gd-flex-container', {
    styles: {
      backgroundColor: options.background,
      padding: '20px',
      ...(options.customTarget ? { position: 'relative' } : {}),
      textAlign: 'center',
    },
  });
  if (options.targetId) target.id = options.targetId;
  target.dataset.testid = 'Container-wrapper';
  target.append(typography('h3', options.heading), typography('p', options.description, { margin: '10px 0' }));
  root.append(target);

  let activePortal: GdPortal | null = null;
  const hide = () => {
    activePortal?.remove();
    activePortal = null;
    trigger.textContent = 'Show Portal';
  };
  const show = () => {
    const portalContent = typography(options.contentVariant ?? 'p', options.content, options.contentStyles);
    portalContent.dataset.testid = 'Portal-content';
    const close = link(options.closeLabel, hide);
    close.dataset.testid = 'Portal-close-link';
    if (options.directChildren) {
      activePortal = portalWith(args, options.customTarget ? target : null, portalContent, close);
      root.append(activePortal);
      trigger.textContent = 'Hide Portal';
      return;
    }
    const overlay = document.createElement('div');
    overlay.dataset.testid = 'Portal-wrapper';
    Object.assign(overlay.style, options.overlayStyles ?? {});
    overlay.append(portalContent, close);
    activePortal = portalWith(args, options.customTarget ? target : null, overlay);
    root.append(activePortal);
    trigger.textContent = 'Hide Portal';
  };
  const trigger = link('Show Portal', () => (activePortal ? hide() : show()));
  trigger.dataset.testid = 'Portal-show-link';
  target.append(trigger);
  return root;
}

const meta = {
  title: 'Layout & Structure/Portal',
  component: 'gd-portal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Portal moves its original light-DOM children into document.body or a supplied Element or DocumentFragment while retaining node identity, native event listeners, wrapper variants, semantic WrapperView selection, custom styles, dynamic targets, cleanup, and optional body scroll blocking.',
      },
    },
  },
  args: {
    wrapperVariant: 'fullPage',
    withWrapper: true,
    blocksScroll: false,
    WrapperView: 'div',
  },
  argTypes: {
    blocksScroll: {
      control: 'boolean',
      description: 'Whether to prevent scrolling of the underlying content while the portal is connected.',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    container: {
      control: 'object',
      description: 'The Element or DocumentFragment where portal content is rendered; defaults to document.body.',
      table: { category: 'Layout', type: { summary: 'Element | DocumentFragment | null' } },
    },
    withWrapper: {
      control: 'boolean',
      description: 'Whether portal content is wrapped in a token-backed semantic element.',
      table: { category: 'Layout', defaultValue: { summary: 'true' } },
    },
    wrapperVariant: {
      control: 'select',
      options: ['inline', 'section', 'fullPage'],
      description: 'The source Wrapper variant used by the generated wrapper.',
      table: { category: 'Layout', defaultValue: { summary: 'fullPage' } },
    },
    WrapperView: {
      control: 'text',
      description: 'The semantic HTML tag used for the wrapper.',
      table: { category: 'Layout', defaultValue: { summary: 'div' } },
    },
    children: {
      control: 'text',
      description: 'Light-DOM content moved into the portal target.',
      table: { category: 'Content', type: { summary: 'Node' } },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS styles applied to the generated wrapper after its variant tokens.',
      table: { category: 'Layout', type: { summary: 'CSSProperties' } },
    },
  },
  render: (args: PortalArgs) =>
    toggleStory(args, {
      background: '#e9ecef',
      heading: 'Global Portal Target',
      description:
        'This story demonstrates the default behavior. When no container is specified, the portal renders its content directly into document.body.',
      content: 'This content is in a global portal.',
      contentStyles: { color: '#333', fontWeight: 600 },
      overlayStyles: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
      closeLabel: 'Close',
    }),
} satisfies Meta<PortalArgs>;

export default meta;
type Story = StoryObj<PortalArgs>;

const storyParameters = (description: string, source: string) => {
  const parameters = formattedSource(source);
  return {
    docs: {
      ...parameters.docs,
      description: { story: description },
    },
  };
};

export const Default: Story = {
  name: 'Default',
  parameters: storyParameters(
    `By default, the \`Portal\` component renders its children into \`document.body\`.
This is ideal for creating global elements like modals or notifications that need to appear on top of the entire application.`,
    `
<gd-flex-container position="relative">
  <!-- Trigger content -->
  <gd-portal>
    <div class="portal-content">This content is in a global portal.</div>
  </gd-portal>
</gd-flex-container>

<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.wrapperVariant = 'fullPage';
  portal.withWrapper = true;
  portal.blocksScroll = false;
  portal.WrapperView = 'div';
</script>
  `
  ),
};

export const RenderingInTarget: Story = {
  name: 'Rendering in a Specific Container',
  args: { wrapperVariant: 'section', withWrapper: false },
  render: (args) =>
    toggleStory(args, {
      targetId: 'custom-portal-container',
      customTarget: true,
      background: '#d1e7dd',
      heading: 'Custom Portal Container',
      description: 'The portal content will be rendered inside this green box.',
      content: 'This content is inside a portal, rendered within the green container.',
      contentVariant: 'small',
      contentStyles: { color: '#856404', fontWeight: 600 },
      overlayStyles: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#fffbe6',
        border: '1px dashed #ffc107',
      },
      closeLabel: 'Hide',
    }),
  parameters: storyParameters(
    `This story demonstrates how to render the portal's content into a specific DOM element using the \`container\` property.
This is useful when a dropdown menu or custom tooltip must remain within a particular section of the UI.`,
    `
<gd-flex-container id="custom-portal-container">
  <!-- Trigger content -->
</gd-flex-container>

<gd-portal wrapper-variant="section">
  <div class="portal-content">Content rendered in the green container.</div>
</gd-portal>

<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.container = document.getElementById('custom-portal-container');
  portal.withWrapper = false;
</script>
  `
  ),
};

export const WithWrapper: Story = {
  name: 'Portal with a Wrapper',
  args: { wrapperVariant: 'section' },
  render: (args) =>
    toggleStory(args, {
      targetId: 'wrapper-portal-container',
      customTarget: true,
      background: '#f8d7da',
      heading: 'Portal with Wrapper',
      description: 'The portal content will be rendered inside this red box, styled by a wrapper.',
      content: 'This content is styled by a `section` wrapper.',
      contentVariant: 'small',
      contentStyles: { color: '#721c24', fontWeight: 600 },
      closeLabel: 'Hide',
      directChildren: true,
    }),
  parameters: storyParameters(
    `This story shows how to use the \`withWrapper\` and \`wrapperVariant\` properties to apply a consistent container style to the portal's content.
This is useful for maintaining a consistent look and feel for elements like popovers or alerts across the application.`,
    `
<gd-flex-container id="wrapper-portal-container">
  <!-- Trigger content -->
</gd-flex-container>

<gd-portal wrapper-variant="section" with-wrapper>
  <gd-typography variant="small">This content is styled by a \`section\` wrapper.</gd-typography>
  <gd-link href="#">Hide</gd-link>
</gd-portal>

<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.container = document.getElementById('wrapper-portal-container');
</script>
  `
  ),
};

export const WithWrapperAsTagMain: Story = {
  name: 'Portal with a Wrapper as Tag Main',
  args: { wrapperVariant: 'section', WrapperView: 'main' },
  render: (args) =>
    toggleStory(args, {
      targetId: 'wrapper-portal-container',
      customTarget: true,
      background: '#f8d7da',
      heading: 'Portal with Wrapper',
      description: 'The portal content will be rendered inside this red box, styled by a wrapper.',
      content: 'This content is styled by a `section` wrapper.',
      contentVariant: 'small',
      contentStyles: { color: '#721c24', fontWeight: 600 },
      closeLabel: 'Hide',
      directChildren: true,
    }),
  parameters: storyParameters(
    `This story shows how to use the \`WrapperView\` property to specify the HTML element tag used for the portal's wrapper container.
This enables semantic markup and proper accessibility structure with an appropriate HTML5 sectioning element such as \`main\`, \`section\`, or \`aside\`.`,
    `
<gd-flex-container id="wrapper-portal-container">
  <!-- Trigger content -->
</gd-flex-container>

<gd-portal wrapper-variant="section" wrapper-view="main" with-wrapper>
  <gd-typography variant="small">This content is styled by a \`section\` wrapper.</gd-typography>
  <gd-link href="#">Hide</gd-link>
</gd-portal>

<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.container = document.getElementById('wrapper-portal-container');
</script>
  `
  ),
};
