import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { TokenViewer } from '@stories/components/TokenViewer';
import { SizeVariant } from '@types';
import { Icon, Button, Column, Row } from '@components';
import { defaultTheme } from '@tokens';

import { Avatar, type AvatarProps } from './';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  args: {
    backgroundColor: 'bg.default',
  },
  argTypes: {
    src: {
      control: 'text',
      description:
        'The URL of the image to display in the avatar. If no `src` is provided or the image fails to load, the `fallback` content will be rendered.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Image',
      },
    },
    alt: {
      control: 'text',
      description:
        'Alternative text for the avatar image, important for accessibility. This will be used as the `aria-label` for the avatar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
        category: 'Image',
      },
    },
    sizeVariant: {
      control: 'select',
      options: Object.values(SizeVariant),
      description: 'Defines the predefined size of the avatar.',
      table: {
        type: { summary: 'SizeVariant' },
        defaultValue: { summary: 'md' },
        category: 'Appearance',
      },
    },
    withBadge: {
      control: 'boolean',
      description:
        'If `true`, a small badge will be displayed at the top-right corner of the avatar, often indicating online status or notifications.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Badge',
      },
    },
    badgeColor: {
      control: 'color',
      description:
        'The color of the badge when `withBadge` is `true`. Accepts CSS color values (e.g., hex, named colors). Also supports theme colors (e.g. `primary.default`)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#34A853' },
        category: 'Badge',
      },
    },
    backgroundColor: {
      control: 'color',
      description:
        'The background color of the avatar when no image is loaded, or when the image fails. Also used for the fallback content container.  Accepts CSS color values (e.g., hex, named colors) and  supports theme colors (e.g. `primary.default`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Appearance',
      },
    },
    fallbackComponent: {
      control: 'text',
      description:
        'Content to display when `src` is not provided or the image fails to load. Can be a string, number, or any ReactNode (e.g., an icon, initials, or a custom component).',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Fallback',
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function triggered when the avatar is clicked.',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    id: {
      control: 'text',
      description: 'A unique identifier for the avatar element.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Core',
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to apply to the avatar component.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Styling',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Passed to the internal `Image` component.',
      table: {
        type: { summary: 'string' },
        category: 'Image',
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS-in-JS styles to apply to the top-level container of the Avatar.',
      table: {
        type: { summary: 'CSSObject' },
        defaultValue: { summary: '{}' },
        category: 'Styling',
      },
    },
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
  <li>XS to XL predefined sizes</li>
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
const Template: StoryFn<PropsWithChildren<AvatarProps>> = (args) => <Avatar {...args} />;

const AllSizeTemplate: StoryFn<PropsWithChildren<AvatarProps>> = (args) => (
  <div style={{ display: 'flex', gap: '20px', justifyItems: 'center', alignItems: 'center' }}>
    <Avatar sizeVariant={SizeVariant.Xs} fallbackComponent="XS" {...args} />
    <Avatar sizeVariant={SizeVariant.Sm} fallbackComponent="SM" {...args} />
    <Avatar sizeVariant={SizeVariant.Md} fallbackComponent="MD" {...args} />
    <Avatar sizeVariant={SizeVariant.Lg} fallbackComponent="LG" {...args} />
    <Avatar sizeVariant={SizeVariant.Xl} fallbackComponent="XL" {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  src: 'https://picsum.photos/200?random=1',
  sizeVariant: SizeVariant.Xl,
};

export const WithBadge = Template.bind({});
WithBadge.args = {
  sizeVariant: SizeVariant.Xl,
  src: 'https://picsum.photos/200?random=2',
  withBadge: true,
};

export const WithCustomBadgeColor = Template.bind({});
WithCustomBadgeColor.args = {
  sizeVariant: SizeVariant.Xl,
  src: 'https://picsum.photos/200?random=2',
  withBadge: true,
  badgeColor: '#901313',
};

export const WithInitials = Template.bind({});
WithInitials.args = {
  sizeVariant: SizeVariant.Xl,
  fallbackComponent: 'TG',
};

export const WithCustomBackgroundColor = Template.bind({});
WithCustomBackgroundColor.args = {
  sizeVariant: SizeVariant.Xl,
  fallbackComponent: 'TG',
  backgroundColor: 'grey',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  sizeVariant: SizeVariant.Xl,
  fallbackComponent: <Icon name="star" width={40} height={40} fill="#646464" />,
  backgroundColor: '#E0E0E0',
};

export const WithImageAndFallback = Template.bind({});
WithImageAndFallback.args = {
  sizeVariant: SizeVariant.Xl,
  src: 'invalid_url',
  fallbackComponent: 'NI',
};

export const WithDifferentSize = AllSizeTemplate.bind({});
WithDifferentSize.args = {};

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  src: 'https://picsum.photos/200?random=1',
  sizeVariant: SizeVariant.Xl,
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

export const UserCardVariant: StoryFn = () => (
  <Column gutter={20}>
    <Avatar.User
      variant="card"
      name="John Doe"
      subtitle="Software Engineer"
      src="https://picsum.photos/200?random=10"
    />
    <Avatar.User
      variant="card"
      name="Jane Smith"
      subtitle="Product Designer"
      src="https://picsum.photos/200?random=11"
      withBadge
      badgeColor="#34A853"
    />
    <Avatar.User variant="card" name="Bob Wilson" fallbackComponent="BW" />
  </Column>
);
UserCardVariant.parameters = {
  docs: {
    description: {
      story:
        'The `Avatar.User` with `variant="card"` displays a compact horizontal layout with avatar, name, and optional subtitle. Ideal for lists, comments, and compact user references.',
    },
    source: {
      code: `<Avatar.User
  variant="card"
  name="John Doe"
  subtitle="Software Engineer"
  src="https://picsum.photos/200?random=10"
/>`,
    },
  },
};

export const UserProfileVariant: StoryFn = () => (
  <Row gutter={40} align="start">
    <Avatar.User
      variant="profile"
      name="John Doe"
      subtitle="Software Engineer"
      src="https://picsum.photos/200?random=12"
    />
    <Avatar.User
      variant="profile"
      name="Jane Smith"
      subtitle="Product Designer"
      src="https://picsum.photos/200?random=13"
      withBadge
      action={<Button>Follow</Button>}
    />
  </Row>
);
UserProfileVariant.parameters = {
  docs: {
    description: {
      story:
        'The `Avatar.User` with `variant="profile"` displays a centered vertical layout with a larger avatar, name, subtitle, and optional action slot. Ideal for profile cards and user detail views.',
    },
    source: {
      code: `<Avatar.User
  variant="profile"
  name="John Doe"
  subtitle="Software Engineer"
  src="/avatar.jpg"
  action={<Button>Follow</Button>}
/>`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ avatar: defaultTheme.avatar }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
