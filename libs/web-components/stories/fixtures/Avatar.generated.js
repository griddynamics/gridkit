// Generated from libs/ui/src/components/atoms/Avatar/Avatar.stories.tsx. Run npm run generate:web-component-stories.
// Native DOM recipes only: no React runtime or React component implementation is imported.
import { demo, Fragment } from '../native-story';
import { defaultTheme } from 'gd-design-library/tokens';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
const COMPONENT_NAME = 'Avatar';
const Avatar = 'gd-avatar';
const Icon = 'gd-icon';
const TokenViewer = 'TokenViewer';
const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  args: {
    backgroundColor: 'bg.default',
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Avatar\` component displays a user's profile picture, initials, or a generic icon. It supports various sizes, a status badge, and a customizable fallback when an image is not available or fails to load.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Display Options</b>
  <ul>
  <li>Profile images</li>
  <li>Fallback content (initials, icons)</li>
  <li>Status badge integration</li>
  </ul>
  </li>
  <li>
  <b>Size Variations</b>
  <ul>
  <li>XS to XXL predefined sizes</li>
  <li>Consistent scaling</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA labels and alt text</li>
  <li><b>Customization</b> – Colors and fallback content</li>
  <li><b>Error Handling</b> – Graceful fallback display</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li>Size variants control width/height</li>
  <li>Aspect ratio maintained</li>
  </ul>
  </li>
  <li><b>Styling</b>
  <ul>
  <li><code>className</code>: Custom CSS classes</li>
  <li><code>styles</code>: CSS-in-JS styling</li>
  </ul>
  </li>
  <li><b>Position</b>
  <ul>
  <li>Badge positioning</li>
  <li>Content alignment</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
};
export default meta;
const Template = (args) => demo(Avatar, { ...args });
const AllSizeTemplate = (args) =>
  demo(
    'div',
    { style: { display: 'flex', gap: '20px', justifyItems: 'center', alignItems: 'center' } },
    demo(Avatar, { sizeVariant: 'xs', fallbackComponent: 'XS', ...args }),
    demo(Avatar, { sizeVariant: 'sm', fallbackComponent: 'SM', ...args }),
    demo(Avatar, { sizeVariant: 'md', fallbackComponent: 'MD', ...args }),
    demo(Avatar, { sizeVariant: 'lg', fallbackComponent: 'LG', ...args }),
    demo(Avatar, { sizeVariant: 'xl', fallbackComponent: 'XL', ...args }),
    demo(Avatar, { sizeVariant: 'xxl', fallbackComponent: 'XXL', ...args })
  );
export const Default = Template.bind({});
Default.args = {
  src: 'https://picsum.photos/200?random=1',
  sizeVariant: 'xl',
};
export const WithBadge = Template.bind({});
WithBadge.args = {
  sizeVariant: 'xl',
  src: 'https://picsum.photos/200?random=2',
  withBadge: true,
};
export const WithCustomBadgeColor = Template.bind({});
WithCustomBadgeColor.args = {
  sizeVariant: 'xl',
  src: 'https://picsum.photos/200?random=2',
  withBadge: true,
  badgeColor: '#901313',
};
export const WithInitials = Template.bind({});
WithInitials.args = {
  sizeVariant: 'xl',
  fallbackComponent: 'TG',
};
export const WithCustomBackgroundColor = Template.bind({});
WithCustomBackgroundColor.args = {
  sizeVariant: 'xl',
  fallbackComponent: 'TG',
  backgroundColor: 'grey',
};
export const WithIcon = Template.bind({});
WithIcon.args = {
  sizeVariant: 'xl',
  fallbackComponent: demo(Icon, { name: 'star', width: 40, height: 40, fill: '#646464' }),
  backgroundColor: '#E0E0E0',
};
export const WithImageAndFallback = Template.bind({});
WithImageAndFallback.args = {
  sizeVariant: 'xl',
  src: 'invalid_url',
  fallbackComponent: 'NI',
};
export const WithDifferentSize = AllSizeTemplate.bind({});
WithDifferentSize.args = {};
export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  src: 'https://picsum.photos/200?random=1',
  sizeVariant: 'xl',
  alt: 'User Profile: Name',
  role: 'img',
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
export const DefaultTokens = () => demo(TokenViewer, { tokens: { avatar: defaultTheme.avatar } });
DefaultTokens.parameters = {
  layout: 'padded',
};
