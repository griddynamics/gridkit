const component = {
  name: 'AvatarUser',
  import: "import { AvatarUser } from 'gd-design-library'",
  description:
    'Composite avatar component that displays a user with avatar image, name, optional subtitle, and optional badge. Supports card and profile layout variants. Real React props (AvatarUserProps): name (required), variant, subtitle, src, alt, fallbackComponent, sizeVariant, withBadge, badgeColor, backgroundColor, action, onClick, plus standard CSS props (styles, className). A2UI JSON adds renderer-only field aliases (description, icon, fill, fillSvg, actionChildren, actions, size, styling) that get mapped onto those real props — see individual prop descriptions below for which is which.',
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
        'Real AvatarUser React prop, required. Primary user display name shown next to or below the avatar. When src is omitted, the renderer derives initials from this name for the avatar fallback.',
      required: true,
    },
    {
      name: 'variant',
      type: 'string',
      description: 'Real AvatarUser React prop. Layout variant of the component.',
      enum: ['card', 'profile'] as const,
      default: 'card',
    },
    {
      name: 'subtitle',
      type: 'string',
      description:
        'Real AvatarUser React prop. Secondary line of text beneath the name, such as a role, team, or email address.',
    },
    {
      name: 'description',
      type: 'string',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop. Fallback subtitle text used when subtitle is absent — the renderer promotes description into the real subtitle prop automatically.',
    },
    { name: 'src', type: 'string', description: 'Real AvatarUser React prop. URL of the avatar image.' },
    { name: 'alt', type: 'string', description: 'Real AvatarUser React prop. Alt text for the avatar image.' },
    {
      name: 'size',
      type: 'string',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop; the real prop is sizeVariant. Preferred A2UI field name for consistency with the Avatar component. Note: the withBadge dot does not have dedicated xxl token sizing yet — at size="xxl" it renders at the same size as the default (md) tier.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    {
      name: 'sizeVariant',
      type: 'string',
      description:
        'Real AvatarUser React prop (AvatarUserProps.sizeVariant). Also accepted as a top-level A2UI field — size is preferred in new A2UI specs.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    {
      name: 'withBadge',
      type: 'boolean',
      description: 'Real AvatarUser React prop. Whether to show a presence/status badge dot.',
    },
    {
      name: 'badgeColor',
      type: 'string',
      description:
        'Real AvatarUser React prop. Badge dot color. Prefer theme color token paths (for example "bg.fill.success.primary.default") before raw CSS/hex colors.',
    },
    {
      name: 'backgroundColor',
      type: 'string',
      description:
        'Real AvatarUser React prop. Background color for the avatar\'s initials/icon fallback area. Accepts theme color token paths (e.g. "primary.default", "bg.fill.secondary", "bg.fill.info.primary.default") or raw CSS/hex. Token paths — including Material-style aliases such as "theme.primary.main" or "primary.main" — are resolved through the theme at render time.',
    },
    {
      name: 'icon',
      type: 'string',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop. Optional icon name used as avatar fallback content when src is omitted. The renderer maps this into the real fallbackComponent prop. If not provided, the renderer falls back to initials derived from name.',
    },
    {
      name: 'fill',
      type: 'string',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop. Fill color for the fallback icon when icon is provided.',
    },
    {
      name: 'fillSvg',
      type: 'string',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop. Optional uniform SVG fill color for the fallback icon. Overrides fill when both are set.',
    },
    {
      name: 'actionChildren',
      type: 'A2UIComponent[]',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop; the real prop is action (ReactNode, TSX-only). Nested components rendered in the trailing action area. Only visible in the "profile" variant.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop. Action IDs from ui.actions to trigger when the avatar-user wrapper is clicked. The renderer wires this into the real onClick prop.',
    },
    {
      name: 'styling',
      type: 'object',
      description:
        'A2UI JSON field only — not a real AvatarUser React prop; the real prop is styles (CSSObject). CSS style overrides for the avatar-user wrapper, merged by the renderer into the real styles prop.',
    },
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
