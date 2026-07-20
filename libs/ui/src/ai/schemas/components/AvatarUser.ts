const component = {
  name: 'AvatarUser',
  import: "import { AvatarUser } from 'gd-design-library'",
  description:
    'Composite avatar component that displays a user with avatar image, name, optional subtitle, and optional badge. Supports card and profile layout variants.',
  a2uiName: 'avatar-user',
  category: 'Display & Content',
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
      name: 'name',
      type: 'string',
      description:
        'Primary user display name shown next to or below the avatar. When src is omitted, the A2UI renderer derives initials from this name.',
      required: true,
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Layout variant of the component',
      enum: ['card', 'profile'] as const,
      default: 'card',
    },
    {
      name: 'subtitle',
      type: 'string',
      description: 'Secondary line of text beneath the name, such as a role, team, or email address',
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Fallback subtitle text. Used when subtitle is absent — the renderer promotes description to the subtitle slot automatically.',
    },
    { name: 'src', type: 'string', description: 'URL of the avatar image' },
    { name: 'alt', type: 'string', description: 'Alt text for the avatar image' },
    {
      name: 'size',
      type: 'string',
      description:
        'Avatar size. Preferred A2UI field — use this over sizeVariant for consistency with the Avatar component. Note: the withBadge dot does not have dedicated xxl token sizing yet — at size="xxl" it renders at the same size as the default (md) tier.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    {
      name: 'sizeVariant',
      type: 'string',
      description: 'Avatar size variant. Alias for size — both are accepted; size is preferred in A2UI specs.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    { name: 'withBadge', type: 'boolean', description: 'Whether to show a presence/status badge dot' },
    {
      name: 'badgeColor',
      type: 'string',
      description:
        'Badge dot color. Prefer theme color token paths (for example "bg.fill.success.primary.default") before raw CSS/hex colors.',
    },
    {
      name: 'backgroundColor',
      type: 'string',
      description:
        'Background color for the avatar\'s initials/icon fallback area. Accepts theme color token paths (e.g. "primary.default", "bg.fill.secondary", "bg.fill.info.primary.default") or raw CSS/hex. Token paths — including Material-style aliases such as "theme.primary.main" or "primary.main" — are resolved through the theme at render time.',
    },
    {
      name: 'icon',
      type: 'string',
      description:
        'Optional icon name used as avatar fallback content when src is omitted. If not provided, the renderer falls back to initials derived from name.',
    },
    {
      name: 'fill',
      type: 'string',
      description: 'Fill color for the fallback icon when icon is provided',
    },
    {
      name: 'fillSvg',
      type: 'string',
      description: 'Optional uniform SVG fill color for the fallback icon. Overrides fill when both are set.',
    },
    {
      name: 'actionChildren',
      type: 'A2UIComponent[]',
      description: 'Nested components rendered in the trailing action area. Only visible in the "profile" variant.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description: 'Action IDs from ui.actions to trigger when the avatar-user wrapper is clicked.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the avatar-user wrapper' },
  ],
  examples: [
    '<AvatarUser name="John Doe" />',
    '<AvatarUser name="Jane Smith" subtitle="Product Manager" src="/avatar.jpg" alt="Jane Smith" variant="card" />',
    '<AvatarUser name="Alice" subtitle="Online" withBadge badgeColor="bg.fill.success.primary.default" sizeVariant="lg" variant="profile" />',
  ],
};

const compositionTips: string[] = [
  'Use AvatarUser for displaying user identity in cards, headers, lists, or profile sections.',
  'Use variant="card" (default) for compact horizontal layouts in cards or list items.',
  'Use variant="profile" for larger profile sections with more prominent name display.',
  'Provide subtitle for secondary user info like role, email, or status text.',
  'Set withBadge and badgeColor to show online/offline or presence indicators, preferring theme tokens for badgeColor.',
  'When src is not provided, the avatar falls back to initials derived from name.',
  'Use sizeVariant to scale the avatar to match the surrounding layout context. Sizes range from xs to xxl; the withBadge dot shares the default (md) token size at xxl since no dedicated xxl badge token exists yet.',
  'Wrap AvatarUser in a Row with align="center" for horizontal user list entries.',
  'Combine AvatarUser with Card for user profile cards in grids or sidebars.',
  'Use backgroundColor to tint the avatar fallback area — pass any theme token path (e.g. "primary.default", "bg.fill.secondary", "theme.primary.main") or a raw hex; token paths including Material-style aliases are resolved to actual colors at render time.',
];

export default { component, compositionTips };
