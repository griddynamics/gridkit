// Generated from libs/ui/src/components/atoms/Link/Link.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Link';
const Link = 'gd-link';
const Button = 'gd-button';
const Typography = 'gd-typography';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Link',
  component: Link,
  args: {
    variant: 'primary',
    rel: '',
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Link\` component is a versatile navigation element that provides various interaction patterns and styling options.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Design Variants</b>
  <ul>
  <li>Primary - Default styled link</li>
  <li>Inherit - Inherits parent styles</li>
  <li>Inverted - Reversed color scheme</li>
  <li>Button - Button-like appearance</li>
  </ul>
  </li>
  <li>
  <b>Link Behavior</b>
  <ul>
  <li>Internal navigation</li>
  <li>Absolute URL linking</li>
  <li>Target window control</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>States</b> – Hover, focus, active, disabled, visited states</li>
  <li><b>Theming</b> – Custom styling and theme integration</li>
  <li><b>Composable</b> – Supports nested components like Typography, Button</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Styling</b>
  <ul>
  <li><code>className</code>: Custom CSS classes</li>
  <li><code>styles</code>: Inline style object</li>
  </ul>
  </li>
  <li><b>Custom Attributes</b>
  <ul>
  <li><code>data-*</code>: Custom data attributes</li>
  <li><code>aria-*</code>: Accessibility attributes</li>
  </ul>
  </li>
  </ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — Native &lt;a&gt; + shared token CSS.</b> Zero behavior. An &lt;a&gt; inside a shadow root is invisible to SEO crawlers, link checkers and a[href] queries, with no behavioral gain to offset it.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
};
export default meta;
const Template = (args) => demo(Link, { ...args });
export const Variants = Template.bind({});
Variants.args = {
  children: `Variants ${COMPONENT_NAME}`,
  onClick: fn(),
};
export const Disabled = Template.bind({});
Disabled.args = {
  children: `Disabled ${COMPONENT_NAME}`,
  disabled: true,
};
export const TargetBlankVisited = Template.bind({});
TargetBlankVisited.args = {
  children: `Outbound ${COMPONENT_NAME}`,
  variant: 'inherit',
  href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
  target: '_blank',
  rel: `${'noopener'} ${'noreferrer'}`,
};
export const InheritWithButtonAsChild = Template.bind({});
InheritWithButtonAsChild.args = {
  variant: 'inherit',
  children: demo(Button, null, `Button ${COMPONENT_NAME}`),
};
export const Inverted = Template.bind({});
Inverted.args = {
  variant: 'inverted',
  children: demo(Fragment, null, `Typography ${COMPONENT_NAME}`),
};
export const InheritWithTypographyAsChild = Template.bind({});
InheritWithTypographyAsChild.args = {
  variant: 'inherit',
  children: demo(Typography, { styleVariant: 'strike' }, `Typography ${COMPONENT_NAME}`),
};
export const CustomStyles = Template.bind({});
CustomStyles.args = {
  variant: 'inherit',
  children: `Custom Styled ${COMPONENT_NAME}`,
  styles: {
    backgroundColor: 'lightblue',
    color: 'white',
    padding: '1rem',
  },
};
export const WithUnderline = () =>
  demo(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
    demo(Link, { href: '#', underline: 'default' }, 'Default underline'),
    demo(Link, { href: '#', underline: 'highlight' }, 'Highlight underline (on hover)'),
    demo(Link, { href: '#', underline: 'none' }, 'No underline')
  );
WithUnderline.parameters = {
  docs: {
    description: {
      story:
        'The `underline` prop controls underline behaviour: `default` (always), `highlight` (on hover), or `none`.',
    },
    source: {},
  },
};
export const WithSizes = () =>
  demo(
    'div',
    { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
    demo(Link, { href: '#', size: 'sm' }, 'Small'),
    demo(Link, { href: '#', size: 'md' }, 'Medium'),
    demo(Link, { href: '#', size: 'lg' }, 'Large')
  );
WithSizes.parameters = {
  docs: {
    description: {
      story: 'Link supports `sm`, `md`, and `lg` size variants controlling font size.',
    },
    source: {},
  },
};
export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  children: 'Accessible Link',
  href: 'https://storybook.cto-rnd-system-design.griddynamics.net/',
  ariaLabel: 'Navigate to Griddynamics Storybook',
};
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};
export const DefaultTokens = () => demo(TokenViewer, { tokens: { link: defaultTheme.link } });
DefaultTokens.parameters = {
  layout: 'padded',
};
