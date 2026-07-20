const component = {
  name: 'Avatar',
  import: "import { Avatar } from 'gd-design-library'",
  description:
    'User avatar component for displaying profile pictures, initials, or icons with support for badges, fallback content, and various size options. A2UI SPEC: all props are top-level fields — do NOT use "attributes" or "fallbackComponent". Use "label" or "value" for initials text. Use "size" or "sizeVariant" for size. For an icon inside the avatar, set top-level "icon" plus optional "fill" or "fillSvg"; the renderer maps that to Avatar fallback content internally. For a status badge ON the avatar use withBadge + badgeColor directly on this component — do NOT place a separate "badge" or sibling "icon" next to the avatar. Prefer theme color tokens before raw CSS/hex. Example: {"type":"avatar","icon":"star","size":"xl","backgroundColor":"#cfaaa7","fill":"#646464"}.',
  a2uiName: 'avatar',
  category: 'Content & Media',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Lightweight',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~2KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'A2UI: initials text shown as fallback (e.g. "JD"). Use label OR value — do NOT use "fallbackComponent". Renderer checks label first, then value.',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Alias for label: initials text shown as avatar fallback when label is absent (e.g. "JD"). The renderer promotes value to the fallback slot automatically. Prefer label in new A2UI specs.',
    },
    { name: 'src', type: 'string', description: 'Image URL. Top-level field in A2UI spec.' },
    { name: 'alt', type: 'string', description: 'Image alt text. Top-level field in A2UI spec.' },
    {
      name: 'size',
      type: 'string',
      description:
        'Avatar size. Preferred A2UI field — use this over sizeVariant. Note: the withBadge dot and initials fallback text do not have dedicated xxl token sizing yet — at size="xxl" they render at the same size as the default (md) tier.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    {
      name: 'sizeVariant',
      type: 'string',
      description: 'Avatar size variant. Alias for size — both are accepted; size is preferred in A2UI specs.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    { name: 'withBadge', type: 'boolean', description: 'Show status dot badge ON the avatar. Top-level field.' },
    {
      name: 'badgeColor',
      type: 'string',
      description:
        'Badge background color. Top-level field. Prefer theme color token paths (e.g. "bg.fill.success.primary.default", "bg.fill.error.primary.default"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'icon',
      type: 'string',
      description:
        'A2UI-only avatar fallback icon name (for example "star" or "user"). This renders inside the avatar itself via the existing fallbackComponent behavior. Icon pixel size is derived from sizeVariant/size (xs=12, sm=18, md=20, lg=24, xl=40) — xxl has no dedicated icon size yet and falls back to the md (20px) icon size.',
    },
    {
      name: 'fill',
      type: 'string',
      description:
        'Avatar fallback icon fill color. Prefer theme icon token paths (e.g. "icon.default", "icon.warning"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'fillSvg',
      type: 'string',
      description: 'Optional uniform SVG fill for the avatar fallback icon. Overrides fill when both are set.',
    },
    {
      name: 'backgroundColor',
      type: 'string',
      description:
        'Background color for initials fallback. Top-level field. Prefer theme color token paths (e.g. "bg.fill.secondary", "bg.fill.info.primary.default"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description: 'Action IDs from ui.actions to trigger when the avatar is clicked.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the avatar' },
  ],
  quickStart: {
    basic: '<Avatar src="/user-photo.jpg" alt="John Doe" />',
    initials: '<Avatar label="JD" backgroundColor="bg.fill.info.primary.default" />',
    withBadge: '<Avatar src={userImage} alt={userName} withBadge badgeColor="bg.fill.success.primary.default" />',
    icon: '<Avatar icon="star" fill="#646464" backgroundColor="#E0E0E0" />',
    online:
      '<Avatar src="/avatar.png" alt="User" withBadge={isOnline} badgeColor={isOnline ? "bg.fill.success.primary.default" : "bg.fill.error.primary.default"} />',
  },
  commonPatterns: {
    'User Profile': {
      code: '<Avatar src={user.photo} alt={user.name} sizeVariant="lg" onClick={handleProfileClick} />',
      useCase: 'User profile pages and account settings',
    },
    'Comment Author': {
      code: '<Avatar src={comment.author.photo} alt={comment.author.name} sizeVariant="sm" />',
      useCase: 'Comment sections and discussion threads',
    },
    'Online Status': {
      code: '<Avatar src={user.photo} alt={user.name} withBadge badgeColor={user.isOnline ? "bg.fill.success.primary.default" : "bg.fill.error.primary.default"} />',
      useCase: 'Chat interfaces and user lists with online status',
    },
    'Icon Fallback': {
      code: '<Avatar icon="star" fill="#646464" backgroundColor="#E0E0E0" size="xl" />',
      useCase: 'Profile placeholders or branded avatars that use an icon inside the avatar itself',
    },
    'Team Member': {
      code: '<Avatar label={user.initials} backgroundColor={user.color} size="md" />',
      useCase: 'Team directories and member listings',
    },
  },
  examples: [
    '<Avatar src="/user-photo.jpg" alt="John Doe" sizeVariant="lg" />',
    '<Avatar label="JD" backgroundColor="bg.fill.info.primary.default" size="md" />',
    '<Avatar src={userImage} alt={userName} withBadge badgeColor="bg.fill.success.primary.default" sizeVariant="sm" />',
    '<Avatar icon="star" fill="#646464" backgroundColor="#E0E0E0" size="xl" />',
    '<Avatar icon="user" backgroundColor="primary.default" size="xl" />',
    '<Avatar src="/avatar.png" alt="User" withBadge={isOnline} badgeColor={isOnline ? "bg.fill.success.primary.default" : "bg.fill.error.primary.default"} />',
  ],
  troubleshooting: {
    'Image not loading': 'Check src URL and provide fallbackComponent for graceful degradation',
    'Badge not showing': 'Ensure withBadge prop is set to true and badgeColor is provided',
    'Icon fallback not showing':
      'Set icon to a valid name in A2UI, or provide fallbackComponent directly when using Avatar in React code',
    'Size not applying': 'Use sizeVariant prop instead of width/height for consistent sizing',
    'Accessibility issues': 'Always provide meaningful alt text for screen readers',
    'Fallback not working': 'Check fallbackComponent prop and backgroundColor for visibility',
  },
  bestPractices: [
    'Always provide meaningful alt text for accessibility',
    'Use sizeVariant for consistent sizing across your application',
    'Provide fallbackComponent with initials or icon when image fails to load',
    'Use withBadge to indicate online status or notifications',
    'Set backgroundColor for fallback content visibility',
    'Use onClick handler for interactive avatars that navigate to profiles',
    'Combine with Typography for user name display in consistent layouts',
    'Use consistent sizeVariant across similar UI contexts',
    'Apply proper ARIA labels for screen reader accessibility',
    'Use high-contrast backgroundColor for better visibility of fallback content',
  ],
};

const compositionTips: string[] = [
  'Use avatar for identities such as profile chips, assignees, authors, and participants.',
  'Use label for initials fallback text when src is unavailable.',
  'Use icon, fill, and fillSvg when the avatar should fall back to an icon instead of initials.',
  'Use withBadge and badgeColor for presence or status indicators.',
  'Wire interactive avatars through actions[] instead of raw onClick handlers.',
  'Avatar sizes range from xs to xxl. The withBadge dot and initials fallback text share the default (md) token size at xxl — no dedicated xxl badge/fallback-text tokens exist yet.',
];

export default { component, compositionTips };
