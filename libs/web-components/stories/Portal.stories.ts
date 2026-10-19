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

// The source passes `color` and `fontWeight` through Typography `styles`, but the variant tokens win, so the
// portal content renders with the plain variant text style. The same plain variant is used here.
function toggleStory(
  args: PortalArgs,
  options: {
    targetId?: string;
    background: string;
    heading: string;
    description: string;
    content: string;
    contentVariant?: GdTypography['variant'];
    overlayStyles?: Record<string, string | number>;
    closeLabel: string;
    customTarget?: boolean;
    directChildren?: boolean;
    // The source story renders the trigger container as a direct canvas child instead of wrapping it.
    withoutRoot?: boolean;
  }
) {
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

  let activePortal: GdPortal | null = null;
  // The state word and the fixed label are separate text nodes, as in the source `{state} Portal`.
  const setLabel = (state: 'Show' | 'Hide') => trigger.replaceChildren(state, ' Portal');
  const hide = () => {
    activePortal?.remove();
    activePortal = null;
    setLabel('Show');
  };
  const show = () => {
    const portalContent = typography(options.contentVariant ?? 'p', options.content);
    portalContent.dataset.testid = 'Portal-content';
    const close = link(options.closeLabel, hide);
    close.dataset.testid = 'Portal-close-link';
    if (options.directChildren) {
      activePortal = portalWith(args, options.customTarget ? target : null, portalContent, close);
      target.after(activePortal);
      setLabel('Hide');
      return;
    }
    const overlay = document.createElement('div');
    overlay.dataset.testid = 'Portal-wrapper';
    Object.assign(overlay.style, options.overlayStyles ?? {});
    overlay.append(portalContent, close);
    activePortal = portalWith(args, options.customTarget ? target : null, overlay);
    target.after(activePortal);
    setLabel('Hide');
  };
  const trigger = link('Show', () => (activePortal ? hide() : show()));
  trigger.append(' Portal');
  trigger.dataset.testid = 'Portal-show-link';
  target.append(trigger);

  if (options.withoutRoot) {
    const fragment = document.createDocumentFragment();
    fragment.append(target);
    return fragment;
  }
  const root = element('gd-flex-container', { position: 'relative' });
  root.append(target);
  return root;
}

const portalDescription =
  "\n  The <code>Portal</code> component moves its children into a different part of the DOM tree while preserving node identity and native event listeners. Essential for modern applications, it enables creation of overlay components like modals, tooltips, popovers, and notifications that need to transcend their parent's stacking context.\n  <br/>\n  <br/>\n  <h3>Key Features:</h3>\n  <ul>\n  <li>\n  <b>DOM Rendering</b>\n  <ul>\n  <li>Server-side rendering compatible with automatic hydration</li>\n  <li>Dynamic container targeting with real-time DOM updates</li>\n  <li>Intelligent container fallback with error boundaries</li>\n  </ul>\n  </li>\n  <li>\n  <b>Content Wrapping</b>\n  <ul>\n  <li>ARIA-compliant wrapper containers for accessibility</li>\n  <li>Semantic HTML5 wrapper variants (div, section, article)</li>\n  <li>Theme-integrated styling system with CSS-in-JS support</li>\n  </ul>\n  </li>\n  <li><b>Flexibility</b> - Preserves node identity and native listeners across targets</li>\n  <li><b>Performance</b> - Optimized with automatic batching and selective re-renders</li>\n  </ul>\n  <br/>\n  <h3>Layout Props:</h3>\n  <ul>\n  <li><b>Content Placement</b>\n  <ul>\n  <li>Secure mounting with automatic cleanup and error handling</li>\n  <li>Dynamic container targeting with lifecycle management</li>\n  <li>Native event propagation with DOM events</li>\n  </ul>\n  </li>\n  <li><b>Wrapper Styling</b>\n  <ul>\n  <li>Semantic HTML structure with proper landmark roles</li>\n  <li>Theme-aware styling with responsive design support</li>\n  <li>Granular style customization with CSS-in-JS props</li>\n  </ul>\n  </li>\n  </ul>\n        ";

const meta = {
  title: 'Layout & Structure/Portal',
  component: 'gd-portal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: portalDescription } },
  },
  args: {
    wrapperVariant: 'fullPage',
    withWrapper: true,
    blocksScroll: false,
    WrapperView: 'div',
  },
  // The source stories declare `category` beside `table` instead of inside it; the same shape is kept here.
  argTypes: {
    blocksScroll: {
      control: 'boolean',
      description: 'Whether to prevent scrolling of the underlying content when portal is open',
      table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
      category: 'Behavior',
    },
    container: {
      control: 'object',
      description: 'The DOM element where the portal content will be rendered',
      table: { defaultValue: { summary: 'document.body' }, type: { summary: 'Element | DocumentFragment | null' } },
      category: 'Layout',
    },
    withWrapper: {
      control: 'boolean',
      description: 'Whether to wrap the portal content in a container element',
      table: { defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
      category: 'Layout',
    },
    wrapperVariant: {
      control: 'select',
      description: 'The style variant for the wrapper container',
      options: ['inline', 'section', 'fullPage'],
      table: {
        defaultValue: { summary: 'WrapperVariant.FullPage' },
        type: { summary: 'EnumOrPrimitive<WrapperVariant>' },
      },
      category: 'Layout',
    },
    WrapperView: {
      control: 'text',
      description: 'The HTML element to use as the wrapper',
      table: { defaultValue: { summary: 'div' }, type: { summary: 'keyof HTMLElementTagNameMap' } },
      category: 'Layout',
    },
    children: {
      control: 'text',
      description: 'The content to be rendered inside the portal',
      table: { type: { summary: 'Node' } },
      category: 'Content',
    },
    styles: {
      control: 'object',
      description: 'Custom styles to be applied to the portal container',
      table: { type: { summary: 'CSSProperties' } },
      category: 'Layout',
    },
  },
  render: (args: PortalArgs) =>
    toggleStory(args, {
      background: '#e9ecef',
      heading: 'Global Portal Target',
      description:
        'This story demonstrates the default behavior. When no `container` is specified, the portal renders its content directly into `document.body`.',
      content: 'This content is in a global portal.',
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
This is ideal for creating global elements like modals or notifications that need to appear on top of the entire application.
\`\`\`html
<gd-portal>
  children
</gd-portal>
\`\`\``,
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
      overlayStyles: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#fffbe6',
        border: '1px dashed #ffc107',
      },
      closeLabel: 'Hide',
      withoutRoot: true,
    }),
  parameters: storyParameters(
    `This story demonstrates how to render the portal's content into a specific DOM element using the \`container\` property. 
This is useful when you need to contain a component, like a dropdown menu or a custom tooltip, within a particular section of the UI.
\`\`\`html
<gd-portal wrapper-variant="section">
  children
</gd-portal>
<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.container = document.getElementById('custom-portal-container');
  portal.withWrapper = false;
</script>
\`\`\``,
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
      closeLabel: 'Hide',
      directChildren: true,
      withoutRoot: true,
    }),
  parameters: storyParameters(
    `This story shows how to use the \`withWrapper\` and \`wrapperVariant\` properties to apply a consistent container style to the portal's content.
This is useful for maintaining a consistent look and feel for elements like popovers or alerts across the application.
\`\`\`html
<gd-portal wrapper-variant="section">
  children
</gd-portal>
<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.container = document.getElementById('custom-portal-container');
</script>
\`\`\``,
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
      closeLabel: 'Hide',
      directChildren: true,
      withoutRoot: true,
    }),
  parameters: storyParameters(
    `This story shows how to use the \`WrapperView\` property to specify the HTML element tag used for the portal's wrapper container.
This enables semantic markup and proper accessibility structure by using the appropriate HTML5 sectioning element like \`main\`, \`section\`, \`aside\`, or any other custom element.
\`\`\`html
<gd-portal wrapper-view="main" wrapper-variant="section">
  children
</gd-portal>
<script type="module">
  const portal = document.querySelector('gd-portal');
  portal.container = document.getElementById('custom-portal-container');
</script>
\`\`\``,
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
