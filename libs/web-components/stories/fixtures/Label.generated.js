// Generated from libs/ui/src/components/atoms/Label/Label.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Label';
const Label = 'gd-label';
const Row = 'Row';
const Icon = 'gd-icon';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Label\` component is a highly flexible UI element designed to be fully customizable in both design and functionality.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Design Agnostic</b>
  <ul>
  <li>Adapts to any theme or custom styles</li>
  <li>Supports both className and inline styles</li>
  <li>Flexible content composition</li>
  </ul>
  </li>
  <li>
  <b>Composable</b>
  <ul>
  <li>Can include icons, tooltips, or other components</li>
  <li>Supports nested component structures</li>
  <li>Flexible content alignment</li>
  </ul>
  </li>
  <li><b>Interactive</b> – Supports click events and hover states</li>
  <li><b>Theming</b> – Compatible with design tokens and custom themes</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Overall spacing</li>
  <li><code>marginTop/paddingTop</code>: Top spacing</li>
  <li><code>marginRight/paddingRight</code>: Right spacing</li>
  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>
  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>
  </ul>
  </li>
  <li><b>Display Properties</b>
  <ul>
  <li><code>display</code>: CSS display property</li>
  <li><code>position</code>: CSS position property</li>
  <li><code>width/height</code>: Size dimensions</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
};
export default meta;
const Template = (args) => demo(Label, { ...args });
export const LabelDefault = Template.bind({});
LabelDefault.args = {
  children: COMPONENT_NAME,
};
export const LabelWithChildIcon = Template.bind({});
LabelWithChildIcon.args = {
  children: demo(Row, null, demo(Icon, { name: 'star' }), ' ', COMPONENT_NAME),
};
export const CustomStyles = Template.bind({});
CustomStyles.args = {
  children: COMPONENT_NAME,
  styles: {
    backgroundColor: 'lightblue',
    color: 'white',
    padding: '1rem',
  },
};
export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  children: `Accessible ${COMPONENT_NAME}`,
  ariaLabel: 'Navigate to Griddynamics Storybook',
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
export const DefaultTokens = () => demo(TokenViewer, { tokens: { label: defaultTheme.label } });
DefaultTokens.parameters = {
  layout: 'padded',
};
