// Generated from libs/ui/src/components/atoms/Box/Box.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Box';
const Box = 'gd-box';
const Typography = 'gd-typography';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Box\` component is a foundational layout primitive that provides a flexible container with built-in support for flexbox, spacing, and sizing. It serves as the base for more complex components like Card.

<br/>
<br/>

<h3>🎨 Key Features</h3>
<ul>
<li><b>Flexible Container:</b> Display flex by default, perfect for layout composition</li>
<li><b>Box Model Props:</b> Full control over width, height, padding, margin, and more</li>
<li><b>Flexbox Support:</b> Built-in flexbox properties for alignment and distribution</li>
<li><b>Focus Management:</b> Automatic focus-visible styles for accessibility</li>
<li><b>Theme Integration:</b> Seamless integration with the design system</li>
<li><b>Composable:</b> Can be used as a base for other components</li>
</ul>

<br/>

<h3>🎯 Common Use Cases</h3>
<ul>
<li><b>Layout Containers:</b> Wrapper for creating flexible layouts</li>
<li><b>Card Base:</b> Foundation for card-like components</li>
<li><b>Sections:</b> Semantic sections with consistent spacing</li>
<li><b>Custom Components:</b> Base for building domain-specific components</li>
</ul>

<br/>

<h3>💡 Best Practices</h3>
<ul>
<li><b>Semantic HTML:</b> Box renders as a div, use it for layout purposes</li>
<li><b>Composition:</b> Combine with other components for complex UIs</li>
<li><b>Accessibility:</b> Use tabIndex when the box needs to be focusable</li>
<li><b>Performance:</b> Prefer Box props over inline styles for better optimization</li>
</ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — No abstraction — shared utility CSS.</b> Zero behavior and no visual surface of its own. Layout primitives are the highest-count nodes on a page, so per-instance shadow-root cost scales worst here, and a percentage width on a shadow child resolves against an auto-width host — the measured cause of a real width-collapse bug in the Select port.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
};
export default meta;
export const Default = {
  args: {
    variant: 'vertical',
    children: 'Box Content',
    padding: '20px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic Box with default vertical variant. Use the controls to experiment with different properties.',
      },
    },
  },
};
export const Bordered = {
  args: {
    variant: 'vertical',
    isBordered: true,
    padding: '20px',
    children: 'Bordered Box',
  },
  parameters: {
    docs: {
      description: {
        story: 'Box with `isBordered` enabled, adding a border from theme tokens.',
      },
    },
  },
};
export const Highlighted = {
  args: {
    variant: 'vertical',
    isHighlighted: true,
    isBordered: true,
    padding: '20px',
    children: 'Hover over me to see the highlight effect!',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Box with `isHighlighted` enabled. When you hover over it, an outline appears. This is useful for interactive card-like containers.',
      },
    },
  },
};
export const WithShadowHover = {
  args: {
    variant: 'vertical',
    withShadowHover: true,
    padding: '20px',
    children: 'Hover over me to see the shadow effect!',
    styles: {
      backgroundColor: '#fff',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Box with `withShadowHover` enabled. When you hover over it, a box shadow appears creating an elevation effect. Perfect for cards that lift on hover.',
      },
    },
  },
};
export const VerticalLayout = {
  args: {
    variant: 'vertical',
    gap: '10px',
    padding: '20px',
    isBordered: true,
    children: demo(
      Fragment,
      null,
      demo('div', { style: { padding: '10px', background: '#e0e0e0', borderRadius: '4px' } }, 'Item 1'),
      demo('div', { style: { padding: '10px', background: '#e0e0e0', borderRadius: '4px' } }, 'Item 2'),
      demo('div', { style: { padding: '10px', background: '#e0e0e0', borderRadius: '4px' } }, 'Item 3')
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical variant stacks children in a column with gap spacing. Default flexDirection is column.',
      },
    },
  },
};
export const HorizontalLayout = {
  args: {
    variant: 'horizontal',
    gap: '10px',
    padding: '20px',
    isBordered: true,
    children: demo(
      Fragment,
      null,
      demo('div', { style: { padding: '10px', background: '#e0e0e0', borderRadius: '4px', flex: 1 } }, 'Item 1'),
      demo('div', { style: { padding: '10px', background: '#e0e0e0', borderRadius: '4px', flex: 1 } }, 'Item 2'),
      demo('div', { style: { padding: '10px', background: '#e0e0e0', borderRadius: '4px', flex: 1 } }, 'Item 3')
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal variant arranges children in a row with gap spacing. Default flexDirection is row.',
      },
    },
  },
};
export const CenteredContent = {
  args: {
    variant: 'vertical',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '200px',
    isBordered: true,
    children: demo(
      Fragment,
      null,
      demo(Typography, { variant: 'h5' }, 'Centered'),
      demo(Typography, { variant: 'small' }, 'Content is centered both horizontally and vertically')
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Box with centered content using flexbox alignment properties.',
      },
    },
  },
};
export const Examples = () => {
  return demo(
    Box,
    { variant: 'vertical', gap: '40px', padding: '20px' },
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h3' }, 'Box Component Examples'),
      demo(Typography, { variant: 'p' }, 'Various use cases demonstrating the flexibility of the Box component')
    ),
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Vertical vs Horizontal Variants'),
      demo(
        Box,
        { variant: 'vertical', gap: '10px' },
        demo(
          Box,
          { variant: 'vertical', gap: '10px', padding: '20px', isBordered: true },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Vertical (Default)'),
          demo(Typography, { variant: 'small' }, 'Stacks children vertically')
        ),
        demo(
          Box,
          { variant: 'horizontal', gap: '10px', padding: '20px', isBordered: true },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Horizontal'),
          demo(Typography, { variant: 'small' }, 'Arranges children horizontally')
        )
      )
    ),
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Border & Hover Effects'),
      demo(
        Typography,
        { variant: 'small', styles: { marginBottom: '10px' } },
        'Hover over each box to see different effects'
      ),
      demo(
        Box,
        { variant: 'horizontal', gap: '10px' },
        demo(
          Box,
          { variant: 'vertical', padding: '20px', styles: { backgroundColor: '#f5f5f5' } },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Default'),
          demo(Typography, { variant: 'small' }, 'No hover effect')
        ),
        demo(
          Box,
          { variant: 'vertical', padding: '20px', isBordered: true },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Bordered'),
          demo(Typography, { variant: 'small' }, 'Static border')
        ),
        demo(
          Box,
          { variant: 'vertical', padding: '20px', isBordered: true, isHighlighted: true },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Highlighted'),
          demo(Typography, { variant: 'small' }, 'Outline on hover')
        ),
        demo(
          Box,
          { variant: 'vertical', padding: '20px', withShadowHover: true, styles: { backgroundColor: '#fff' } },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Shadow Hover'),
          demo(Typography, { variant: 'small' }, 'Shadow on hover')
        ),
        demo(
          Box,
          {
            variant: 'vertical',
            padding: '20px',
            isBordered: true,
            withShadowHover: true,
            styles: { backgroundColor: '#fff' },
          },
          demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Combined'),
          demo(Typography, { variant: 'small' }, 'Border + shadow')
        )
      )
    ),
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Horizontal Layout with Gap'),
      demo(
        Box,
        { variant: 'horizontal', gap: '10px' },
        demo(Box, { variant: 'vertical', padding: '20px', isBordered: true, styles: { flex: 1 } }, 'Box 1'),
        demo(Box, { variant: 'vertical', padding: '20px', isBordered: true, styles: { flex: 1 } }, 'Box 2'),
        demo(Box, { variant: 'vertical', padding: '20px', isBordered: true, styles: { flex: 1 } }, 'Box 3')
      )
    ),
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Vertical Stack'),
      demo(
        Box,
        { variant: 'vertical', gap: '10px', width: '300px' },
        demo(Box, { variant: 'vertical', padding: '15px', isBordered: true }, 'Item 1'),
        demo(Box, { variant: 'vertical', padding: '15px', isBordered: true }, 'Item 2'),
        demo(Box, { variant: 'vertical', padding: '15px', isBordered: true }, 'Item 3')
      )
    ),
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Interactive Card-like Containers'),
      demo(
        Box,
        { variant: 'horizontal', gap: '15px' },
        demo(
          Box,
          { variant: 'vertical', gap: '15px', padding: '20px', width: '280px', isBordered: true, isHighlighted: true },
          demo(Typography, { variant: 'h6' }, 'Outline Effect'),
          demo(Typography, { variant: 'small' }, 'Uses `isBordered` and `isHighlighted` for outline hover effect.')
        ),
        demo(
          Box,
          {
            variant: 'vertical',
            gap: '15px',
            padding: '20px',
            width: '280px',
            withShadowHover: true,
            styles: {
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
            },
          },
          demo(Typography, { variant: 'h6' }, 'Elevation Effect'),
          demo(Typography, { variant: 'small' }, 'Uses `withShadowHover` for shadow elevation on hover.')
        )
      )
    ),
    demo(
      Box,
      { variant: 'vertical', gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Complex Nested Layout'),
      demo(
        Box,
        { variant: 'vertical', gap: '10px', padding: '20px', isBordered: true },
        demo(Typography, { variant: 'h6' }, 'Dashboard Section'),
        demo(
          Box,
          { variant: 'horizontal', gap: '10px' },
          demo(
            Box,
            { variant: 'vertical', gap: '5px', padding: '15px', isBordered: true },
            demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Metric 1'),
            demo(Typography, { variant: 'p' }, '1,234')
          ),
          demo(
            Box,
            { variant: 'vertical', gap: '5px', padding: '15px', isBordered: true },
            demo(Typography, { variant: 'small', styles: { fontWeight: 600 } }, 'Metric 2'),
            demo(Typography, { variant: 'p' }, '5,678')
          )
        )
      )
    )
  );
};
Examples.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story: 'Collection of examples showing different ways to use the Box component for various layout needs.',
    },
  },
};
export const WithAccessibility = {
  render: Examples,
  parameters: {
    a11y: {
      test: 'error',
      options: {
        rules: {
          'heading-order': { enabled: false },
        },
      },
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { box: defaultTheme.box } });
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'View the default theme tokens used by the Box component. These tokens control the base display and focus styles.',
    },
  },
};
