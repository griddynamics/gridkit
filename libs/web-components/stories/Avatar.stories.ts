import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdAvatar } from '../src';
import { defaultTokenViewer, element } from './helpers';

type Args = Pick<GdAvatar, 'src' | 'alt' | 'withBadge' | 'badgeColor' | 'backgroundColor' | 'styles'> & {
  sizeVariant?: GdAvatar['size'];
  fallbackComponent?: string | number;
  placeholder?: string;
  id?: string;
  className?: string;
  onClick?: (event: Event) => void;
};

type Props = Record<string, unknown>;

/** Builds an avatar from the story args; `fallbackComponent` maps to the `fallback` property.
 * `placeholder` belongs to the inner image of the source component and has no counterpart here. */
const avatar = ({ fallbackComponent, onClick, className, id, ...props }: Props = {}) => {
  const defined = Object.fromEntries(
    Object.entries(props).filter(([name, value]) => name !== 'placeholder' && value !== undefined)
  );
  const node = element('gd-avatar', {
    ...defined,
    ...(fallbackComponent === undefined ? {} : { fallback: String(fallbackComponent) }),
  } as Partial<GdAvatar>);
  if (id) node.id = String(id);
  if (className) node.className = String(className);
  if (typeof onClick === 'function') node.addEventListener('click', onClick as EventListener);
  return node;
};

const meta = {
  title: 'Atoms/Avatar',
  component: 'gd-avatar',
  args: {
    backgroundColor: 'bg.default',
    alt: 'User avatar',
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
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
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
        'Content to display when `src` is not provided or the image fails to load. Can be a string, number, or any node placed in the `fallback` slot (e.g., an icon, initials, or a custom element).',
      table: {
        type: { summary: 'string | number | Node' },
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
  render: (args: Args) => avatar(args as Props),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/200?random=1',
    sizeVariant: 'xl',
  },
};

export const WithBadge: Story = {
  args: {
    sizeVariant: 'xl',
    src: 'https://picsum.photos/200?random=2',
    withBadge: true,
  },
};

export const WithCustomBadgeColor: Story = {
  args: {
    sizeVariant: 'xl',
    src: 'https://picsum.photos/200?random=2',
    withBadge: true,
    badgeColor: '#901313',
  },
};

export const WithInitials: Story = {
  args: {
    sizeVariant: 'xl',
    fallbackComponent: 'TG',
  },
};

export const WithCustomBackgroundColor: Story = {
  args: {
    sizeVariant: 'xl',
    fallbackComponent: 'TG',
    backgroundColor: 'grey',
  },
};

export const WithIcon: Story = {
  args: {
    sizeVariant: 'xl',
    backgroundColor: '#E0E0E0',
  },
  render: (args) => {
    const node = avatar(args as Props);
    const icon = element('gd-icon', { name: 'star', width: 40, height: 40, fill: '#646464' });
    icon.slot = 'fallback';
    node.append(icon);
    return node;
  },
};

export const WithImageAndFallback: Story = {
  args: {
    sizeVariant: 'xl',
    src: 'invalid_url',
    fallbackComponent: 'NI',
  },
};

export const WithDifferentSize: Story = {
  args: {},
  render: (args) => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 20px; justify-items: center; align-items: center';
    container.append(
      ...sizes.map((size) => avatar({ sizeVariant: size, fallbackComponent: size.toUpperCase(), ...args }))
    );
    return container;
  },
};

export const WithAccessibility: Story = {
  args: {
    src: 'https://picsum.photos/200?random=1',
    sizeVariant: 'xl',
    alt: 'User Profile: Name',
  },
  parameters: {
    a11y: { test: 'error' },
    docs: { disable: true },
  },
  tags: ['a11y'],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('avatar'),
  parameters: { layout: 'padded' },
};
