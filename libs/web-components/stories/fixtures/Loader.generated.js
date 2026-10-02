// Generated from libs/ui/src/components/atoms/Loader/Loader.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import { loaderStories } from '../loader-examples';
const COMPONENT_NAME = 'Loader';
const Loader = 'gd-loader';
const Row = 'Row';
const Column = 'Column';
const Typography = 'gd-typography';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Loader',
  component: Loader,
  tags: ['autodocs'],
  args: {
    withWrapper: true,
    name: 'circle',
    variant: 'inline',
    size: 'md',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Loader\` component is a versatile loading indicator designed to provide visual feedback during asynchronous operations. 
  It seamlessly integrates into any part of your application to enhance user experience by clearly showing loading states.
  <br/><br/>
  
  <h3>🎯 Core Features</h3>
  <ul>
  <li><b>Multiple Animation Types</b> – Two built-in animations: "circle" (smooth rotation) and "dots" (rhythmic pulsing). Support for custom animations via children prop</li>
  <li><b>Flexible Positioning</b> – Three wrapper variants: Inline (natural flow), Section (overlay within container), FullPage (full-screen with portal)</li>
  <li><b>Size Variants</b> – Five responsive sizes (xs, sm, md, lg, xl) for different contexts from inline text to full-page overlays</li>
  <li><b>Border Radius Control</b> – Rounded prop for styling dots animation with border radius (none, default, round, xs, sm, md, lg, xl). Note: Only applies to "dots", not "circle"</li>
  <li><b>Wrapper Control</b> – Optional wrapper container with customizable HTML element or React component for semantic flexibility</li>
  <li><b>Theme Integration</b> – Full theme customization with design tokens for colors, sizes, and animations</li>
  <li><b>Custom Content</b> – Replace default animations with custom React content while maintaining wrapper functionality</li>
  </ul>
  
  <h3>📋 Usage Patterns</h3>
  <ul>
  <li><b>Inline Loading</b> – Use \`variant="inline"\` for text replacements and inline content: \`<Loader name="circle" size="sm" />\`</li>
  <li><b>Section Overlay</b> – Use \`variant="section"\` for container-level loading states with absolute positioning</li>
  <li><b>Full Page</b> – Use \`variant="fullPage"\` for modal-style full-screen loading overlays with portal rendering</li>
  <li><b>Button Integration</b> – Use \`withWrapper={false}\` and \`size="sm"\` for compact button loaders: \`<Loader withWrapper={false} size="sm" />\`</li>
  <li><b>Custom Animations</b> – Pass custom React content via \`children\` prop for branded loading animations</li>
  </ul>
  
  <h3>💡 Best Practices</h3>
  <ul>
  <li>Use "circle" animation for general loading states and "dots" for more playful or casual interfaces</li>
  <li>Choose size based on context: xs/sm for inline, md for buttons, lg/xl for section/full-page</li>
  <li>Use \`rounded\` prop to style dots animation corners when desired (does not apply to circle)</li>
  <li>Set \`withWrapper={false}\` when embedding in buttons or custom containers to avoid wrapper styling</li>
  <li>Use Section variant with relative positioned containers for localized loading states</li>
  <li>Prefer theme tokens over custom styles for consistent design system integration</li>
  </ul>
        `,
      },
    },
  },
};
export default meta;
const Template = (args) => demo(Loader, { ...args });
export const Default = Template.bind({});
Default.args = {
  name: 'circle',
  size: 'md',
  variant: 'inline',
};
Default.parameters = {
  docs: {
    source: {},
    description: {
      story:
        'Default loader with circle animation, medium size, and inline variant. This is the standard loading indicator for most use cases.',
    },
  },
};
export const LoaderNames = () => {
  return demo(
    Row,
    { gap: '30px', align: 'center' },
    demo(
      Column,
      { gap: '10px' },
      demo(Typography, { variant: 'h6' }, 'Circle Animation'),
      demo(Loader, { name: 'circle', size: 'md' })
    ),
    demo(
      Column,
      { gap: '10px' },
      demo(Typography, { variant: 'h6' }, 'Dots Animation'),
      demo(Loader, { name: 'dots', size: 'md' })
    )
  );
};
LoaderNames.parameters = {
  docs: {
    source: {},
    description: {
      story:
        'Two animation types available: "circle" provides a smooth rotating animation ideal for general loading states, while "dots" offers a rhythmic pulsing sequence suitable for more playful interfaces.',
    },
  },
};
export const LoaderSizes = () => {
  return demo(
    Column,
    { gap: '20px' },
    demo(
      Column,
      { gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Loader Sizes'),
      demo(Typography, { variant: undefined }, 'Five size variants from extra small to extra large')
    ),
    demo(
      Row,
      { gap: '20px', align: 'center' },
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'circle', size: 'xs' }),
        demo(Typography, { variant: undefined }, 'XS')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'circle', size: 'sm' }),
        demo(Typography, { variant: undefined }, 'SM')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'circle', size: 'md' }),
        demo(Typography, { variant: undefined }, 'MD')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'circle', size: 'lg' }),
        demo(Typography, { variant: undefined }, 'LG')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'circle', size: 'xl' }),
        demo(Typography, { variant: undefined }, 'XL')
      )
    )
  );
};
LoaderSizes.parameters = {
  layout: 'padded',
  docs: {
    source: {},
    description: {
      story:
        'Five size variants available: xs (extra small) for inline text, sm (small) for buttons, md (medium) for standard use, lg (large) for sections, and xl (extra large) for full-page overlays.',
    },
  },
};
export const LoaderRounded = () => {
  return demo(
    Column,
    { gap: '20px' },
    demo(
      Column,
      { gap: '10px' },
      demo(Typography, { variant: 'h5' }, 'Loader with Rounded Border'),
      demo(
        Typography,
        { variant: undefined },
        'The rounded prop controls border radius for dots animation. Note: rounded prop only applies to "dots" animation type, not "circle"'
      )
    ),
    demo(
      Row,
      { gap: '20px', align: 'center' },
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'none' }),
        demo(Typography, { variant: undefined }, 'None')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'xs' }),
        demo(Typography, { variant: undefined }, 'XS')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'sm' }),
        demo(Typography, { variant: undefined }, 'SM')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'md' }),
        demo(Typography, { variant: undefined }, 'MD')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'lg' }),
        demo(Typography, { variant: undefined }, 'LG')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'xl' }),
        demo(Typography, { variant: undefined }, 'XL')
      ),
      demo(
        Column,
        { gap: '8px', align: 'center' },
        demo(Loader, { name: 'dots', size: 'md', rounded: 'round' }),
        demo(Typography, { variant: undefined }, 'Round')
      )
    )
  );
};
LoaderRounded.parameters = {
  layout: 'padded',
  docs: {
    source: {},
    description: {
      story:
        'Rounded prop controls the border radius of dots animation. Available options: none, default, round, xs, sm, md, lg, xl. **Important**: The rounded prop only applies to "dots" animation type. Circle animations are always circular and do not use border radius.',
    },
  },
};
export const LoaderVariantsWithWrapperViewAsHeaderTag = Template.bind({});
LoaderVariantsWithWrapperViewAsHeaderTag.args = {
  variant: 'inline',
  WrapperView: 'header',
};
LoaderVariantsWithWrapperViewAsHeaderTag.parameters = {
  docs: {
    source: {},
    description: {
      story:
        'Customize the wrapper element using WrapperView prop. Use semantic HTML elements like "header", "section", "div", or React components for better accessibility and structure.',
    },
  },
};
export const LoaderSectionVariant = loaderStories.LoaderSectionVariant;
export const SectionLoaderButtonVariant = loaderStories.SectionLoaderButtonVariant;
export const InlineLoaderButtonVariant = loaderStories.InlineLoaderButtonVariant;
export const WithAccessibility = () => {
  return demo(
    'div',
    { style: { display: 'flex', gap: '40px' }, role: 'status', 'aria-label': 'Loading content' },
    demo(Column, { gap: '10px' }, demo(Loader, { name: 'circle', size: 'md' })),
    demo(Column, { gap: '10px' }, demo(Loader, { name: 'dots', size: 'md' }))
  );
};
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};
WithAccessibility.tags = ['a11y'];
export const DefaultTokens = () => demo(TokenViewer, { tokens: { loader: defaultTheme.loader } });
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    source: {},
    description: {
      story:
        'View the default theme tokens used by the Loader component. These tokens control colors, sizes, animations, and spacing for all loader variants.',
    },
  },
};
