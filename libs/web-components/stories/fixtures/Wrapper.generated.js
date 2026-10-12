// Generated from libs/ui/src/components/atoms/Wrapper/Wrapper.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Wrapper';
const Wrapper = 'gd-wrapper';
const Typography = 'gd-typography';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Wrapper',
  component: Wrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  <h3>Overview</h3>
  The \`Wrapper\` component serves as a foundational building block for creating flexible and accessible layouts. It encapsulates common container patterns while providing a rich API for customization and semantic structure.

  This versatile container adapts to different contexts through its variant system while maintaining consistent behavior and accessibility standards. It's designed to work seamlessly within your component hierarchy, whether you need a simple inline wrapper or a full-page overlay.

  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Layout Control</b>
  <ul>
  <li>Flexible container sizing with responsive options</li>
  <li>Direct theme integration for consistent styling</li>
  <li>Predictable nesting behavior</li>
  </ul>
  </li>
  <br/>
  <li><b>Composability</b> - Works seamlessly with other components</li>
  <li><b>Semantic HTML</b> - Appropriate element selection for accessibility</li>
  </ul>

  <h3>Accessibility</h3>
  <ul>
  <li>Semantic HTML elements for improved screen reader navigation</li>
  <li>ARIA attributes automatically applied based on variant</li>
  <li>Keyboard focus management for interactive variants</li>
  </ul>

  <h3>Layout Props:</h3>
 <br/>
  <b>Dimensions</b>
  <br/>
  <ul>
  <li><code>width/height</code>: Set container size with various units (px, rem, %, vh/vw)</li>
  <li><code>minWidth/minHeight</code>: Define minimum size constraints</li>
  <li><code>maxWidth/maxHeight</code>: Set maximum size limits</li>
  </ul>

  <b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Control inner and outer spacing</li>
  <li><code>border</code>: Comprehensive border customization</li>
  <li><code>position</code>: Adjust element positioning (relative, absolute, fixed)</li>
  <li><code>display</code>: Control layout behavior (flex, block, inline-flex)</li>
  </ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — No abstraction — shared utility CSS.</b> Zero behavior and no visual surface of its own. Utility classes over the same tokens deliver the same result at zero runtime cost.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
};
export default meta;
export const InteractiveExample = {
  name: 'Interactive Example',
  render: (args) => demo(Wrapper, { ...args }),
  args: {
    variant: 'inline',
    children: 'This is a basic div wrapper. Change the variant in the controls to see different wrapper types.',
    styles: {
      padding: '20px',
      border: '2px dashed #007bff',
      borderRadius: '8px',
      backgroundColor: '#f0f8ff',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story provides an interactive demonstration of the `Wrapper` component. Use the controls in the Addons panel to change the `variant` and see how it affects the underlying HTML element and its appearance.',
      },
    },
  },
};
export const SectionWrapper = {
  name: 'Variant: Section',
  args: {
    variant: 'section',
    children: demo(
      Typography,
      null,
      'This content is semantically grouped within a `section` element, which is ideal for thematically related content.'
    ),
    styles: {
      padding: '20px',
      width: '400px',
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `Section` variant renders a `<section>` HTML element. It is a block-level container used for grouping content that has a common theme or purpose, such as a chapter, a header, or a footer.',
      },
    },
  },
};
export const InlineWrapper = {
  name: 'Variant: Inline (Span)',
  render: (args) =>
    demo(Typography, null, 'This is a line of text, and ', demo(Wrapper, { ...args }), ' is used for inline content.'),
  args: {
    variant: 'inline',
    children: 'this part is wrapped in a span',
    styles: {
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#fffbe6',
      color: '#856404',
      fontWeight: 'bold',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `Inline` variant renders a `<span>` HTML element. It is used for wrapping small pieces of content within a larger block of text, without creating a line break. This is useful for applying styles or behavior to a specific word or phrase.',
      },
    },
  },
};
export const FullPageWrapper = {
  name: 'Variant: Full Page',
  args: {
    variant: 'fullPage',
    children: demo(
      Typography,
      { styles: { color: 'white' } },
      'This wrapper covers the entire viewport, perfect for modals or overlays.'
    ),
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The `FullPage` variant is designed to create a container that spans the entire viewport. It is typically used as a background for modal dialogs, loading spinners, or other UI elements that need to overlay the entire page content.',
      },
    },
  },
};
export const CustomTagWrapper = {
  name: 'Custom tag Wrapper',
  args: {
    as: 'section',
    children: 'Custom tag Wrapper',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The `FullPage` variant is designed to create a container that spans the entire viewport. It is typically used as a background for modal dialogs, loading spinners, or other UI elements that need to overlay the entire page content.',
      },
    },
  },
};
export const WithAccessibility = {
  ...InteractiveExample,
  parameters: {
    ...InteractiveExample.parameters,
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { wrapper: defaultTheme.wrapper } });
DefaultTokens.parameters = {
  layout: 'padded',
};
