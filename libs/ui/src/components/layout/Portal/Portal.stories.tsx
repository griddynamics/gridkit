import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { TypographyVariant, WrapperVariant } from '@types';
import { Link, Typography, FlexContainer } from '@components';
import {
  defaultActions,
  renderingInTargetActions,
  withWrapperActions,
  withWrapperAsTagMainActions,
} from './Portal.stories.play';
import { Portal, PortalProps } from '.';

const meta: Meta<typeof Portal> = {
  title: 'Layout & Structure/Portal',
  component: Portal,
  argTypes: {
    lockScroll: {
      control: 'boolean',
      description: 'Whether to prevent scrolling of the underlying content when portal is open',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      category: 'Behavior',
    },
    container: {
      control: 'object',
      description: 'The DOM element where the portal content will be rendered',
      table: {
        defaultValue: { summary: 'document.body' },
        type: { summary: 'HTMLElement | null' },
      },
      category: 'Layout',
    },
    withWrapper: {
      control: 'boolean',
      description: 'Whether to wrap the portal content in a container element',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      category: 'Layout',
    },
    wrapperVariant: {
      control: 'select',
      description: 'The style variant for the wrapper container',
      options: Object.values(WrapperVariant),
      table: {
        defaultValue: { summary: 'WrapperVariant.FullPage' },
        type: { summary: 'EnumOrPrimitive<WrapperVariant>' },
      },
      category: 'Layout',
    },
    WrapperView: {
      control: 'text',
      description: 'The HTML element or React component to use as the wrapper',
      table: {
        defaultValue: { summary: 'div' },
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
      },
      category: 'Layout',
    },
    children: {
      control: 'text',
      description: 'The content to be rendered inside the portal',
      table: {
        type: { summary: 'ReactNode' },
      },
      category: 'Content',
    },
    styles: {
      control: 'object',
      description: 'Custom styles to be applied to the portal container',
      table: {
        type: { summary: 'CSSProperties' },
      },
      category: 'Layout',
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The <code>Portal</code> component leverages React's createPortal API to render children into a different part of the DOM tree while maintaining React's context and event system. Essential for modern React applications, it enables creation of overlay components like modals, tooltips, popovers, and notifications that need to transcend their parent's stacking context.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>DOM Rendering</b>
  <ul>
  <li>Server-side rendering compatible with automatic hydration</li>
  <li>Dynamic container targeting with real-time DOM updates</li>
  <li>Intelligent container fallback with error boundaries</li>
  </ul>
  </li>
  <li>
  <b>Content Wrapping</b>
  <ul>
  <li>ARIA-compliant wrapper containers for accessibility</li>
  <li>Semantic HTML5 wrapper variants (div, section, article)</li>
  <li>Theme-integrated styling system with CSS-in-JS support</li>
  </ul>
  </li>
  <li><b>Flexibility</b> - Preserves React 18 concurrent features and context</li>
  <li><b>Performance</b> - Optimized with automatic batching and selective re-renders</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Content Placement</b>
  <ul>
  <li>Secure mounting with automatic cleanup and error handling</li>
  <li>Dynamic container targeting with lifecycle management</li>
  <li>Native event propagation with React synthetic events</li>
  </ul>
  </li>
  <li><b>Wrapper Styling</b>
  <ul>
  <li>Semantic HTML structure with proper landmark roles</li>
  <li>Theme-aware styling with responsive design support</li>
  <li>Granular style customization with CSS-in-JS props</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof Portal>;

const DefaultBehaviorRenderer = (args: PortalProps) => {
  const [showPortal, setShowPortal] = useState(false);
  return (
    <FlexContainer position="relative">
      <FlexContainer
        data-testid="Container-wrapper"
        styles={{ backgroundColor: '#e9ecef', padding: '20px', textAlign: 'center' }}
      >
        <Typography variant={TypographyVariant.H3}>Global Portal Target</Typography>
        <Typography variant={TypographyVariant.Body1} styles={{ margin: '10px 0' }}>
          This story demonstrates the default behavior. When no `container` is specified, the portal renders its content
          directly into `document.body`.
        </Typography>
        <Link data-testid="Portal-show-link" onClick={() => setShowPortal((prev) => !prev)}>
          {showPortal ? 'Hide' : 'Show'} Portal
        </Link>
      </FlexContainer>

      {showPortal && (
        <Portal {...args}>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
            data-testid="Portal-wrapper"
          >
            <Typography
              variant={TypographyVariant.Body1}
              styles={{ color: '#333', fontWeight: 600 }}
              data-testid="Portal-content"
            >
              This content is in a global portal.
            </Typography>
            <Link data-testid="Portal-close-link" onClick={() => setShowPortal(false)}>
              Close
            </Link>
          </div>
        </Portal>
      )}
    </FlexContainer>
  );
};

export const Default: Story = {
  name: 'Default',
  render: (args) => <DefaultBehaviorRenderer {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
By default, the \`Portal\` component renders its children into \`document.body\`. 
This is ideal for creating global elements like modals or notifications that need to appear on top of the entire application.
\`\`\`tsx
<Portal>
  children
</Portal>
        `,
      },
    },
  },
};
Default.play = defaultActions;

const RenderingInTargetRenderer = (args: PortalProps) => {
  const [showPortal, setShowPortal] = useState(false);
  return (
    <>
      <FlexContainer
        id="custom-portal-container"
        data-testid="Container-wrapper"
        styles={{ backgroundColor: '#d1e7dd', padding: '20px', position: 'relative', textAlign: 'center' }}
      >
        <Typography variant={TypographyVariant.H3}>Custom Portal Container</Typography>
        <Typography variant={TypographyVariant.Body1} styles={{ margin: '10px 0' }}>
          The portal content will be rendered inside this green box.
        </Typography>
        <Link data-testid="Portal-show-link" onClick={() => setShowPortal((prev) => !prev)}>
          {showPortal ? 'Hide' : 'Show'} Portal
        </Link>
      </FlexContainer>

      {showPortal && (
        <Portal
          container={document.getElementById('custom-portal-container')}
          wrapperVariant={WrapperVariant.Section}
          withWrapper={false}
          {...args}
        >
          <div
            data-testid="Portal-wrapper"
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fffbe6', border: '1px dashed #ffc107' }}
          >
            <Typography
              data-testid="Portal-content"
              variant={TypographyVariant.Body2}
              styles={{ color: '#856404', fontWeight: 600 }}
            >
              This content is inside a portal, rendered within the green container.
            </Typography>
            <Link data-testid="Portal-close-link" onClick={() => setShowPortal(false)}>
              Hide
            </Link>
          </div>
        </Portal>
      )}
    </>
  );
};

export const RenderingInTarget: Story = {
  name: 'Rendering in a Specific Container',
  render: (args) => <RenderingInTargetRenderer {...args} />,
  args: {
    wrapperVariant: WrapperVariant.Section,
    withWrapper: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates how to render the portal's content into a specific DOM element using the \`container\` prop. 
This is useful when you need to contain a component, like a dropdown menu or a custom tooltip, within a particular section of the UI.
\`\`\`tsx
<Portal
  container={document.getElementById('custom-portal-container')}
  wrapperVariant={WrapperVariant.Section}
  withWrapper={false}
>
  children
</Portal>
\`\`\`
        `,
      },
    },
  },
};
RenderingInTarget.play = renderingInTargetActions;

const WithWrapperRenderer = (args: PortalProps) => {
  const [showPortal, setShowPortal] = useState(false);
  return (
    <>
      <FlexContainer
        id="wrapper-portal-container"
        data-testid="Container-wrapper"
        styles={{ backgroundColor: '#f8d7da', padding: '20px', position: 'relative', textAlign: 'center' }}
      >
        <Typography variant={TypographyVariant.H3}>Portal with Wrapper</Typography>
        <Typography variant={TypographyVariant.Body1} styles={{ margin: '10px 0' }}>
          The portal content will be rendered inside this red box, styled by a wrapper.
        </Typography>
        <Link data-testid="Portal-show-link" onClick={() => setShowPortal((prev) => !prev)}>
          {showPortal ? 'Hide' : 'Show'} Portal
        </Link>
      </FlexContainer>

      {showPortal && (
        <Portal container={document.getElementById('wrapper-portal-container')} {...args}>
          <Typography
            data-testid="Portal-content"
            variant={TypographyVariant.Body2}
            styles={{ color: '#721c24', fontWeight: 600 }}
          >
            This content is styled by a `section` wrapper.
          </Typography>
          <Link data-testid="Portal-close-link" onClick={() => setShowPortal(false)}>
            Hide
          </Link>
        </Portal>
      )}
    </>
  );
};

export const WithWrapper: Story = {
  name: 'Portal with a Wrapper',
  args: {
    wrapperVariant: WrapperVariant.Section,
  },
  render: (args) => <WithWrapperRenderer {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
This story shows how to use the \`withWrapper\` and \`wrapperVariant\` props to apply a consistent container style to the portal's content.
This is useful for maintaining a consistent look and feel for elements like popovers or alerts across the application.
\`\`\`tsx
<Portal
  container={document.getElementById('custom-portal-container')}
  wrapperVariant={WrapperVariant.Section}
>
  children
</Portal>
\`\`\`
        `,
      },
    },
  },
};
WithWrapper.play = withWrapperActions;

export const WithWrapperAsTagMain: Story = {
  name: 'Portal with a Wrapper as Tag Main',
  args: {
    wrapperVariant: WrapperVariant.Section,
    WrapperView: 'main',
  },
  render: (args) => <WithWrapperRenderer {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
This story shows how to use the \`WrapperView\` prop to specify the HTML element tag used for the portal's wrapper container.
This enables semantic markup and proper accessibility structure by using the appropriate HTML5 sectioning element like \`main\`, \`section\`, \`aside\`, or any other React component.
\`\`\`tsx
<Portal
  container={document.getElementById('custom-portal-container')}
  wrapperVariant={WrapperVariant.Section}
  WrapperView="main"
>
  children
</Portal>
\`\`\`
        `,
      },
    },
  },
};
WithWrapperAsTagMain.play = withWrapperAsTagMainActions;
