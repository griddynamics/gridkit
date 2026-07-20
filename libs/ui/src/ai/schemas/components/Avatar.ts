const component = {
  name: 'Avatar',
  import: "import { Avatar } from 'gd-design-library'",
  description:
    'User avatar component for displaying profile pictures, initials, or icons with support for badges, fallback content, and various size options. Real React props (AvatarProps): src, alt, sizeVariant, withBadge, badgeColor, backgroundColor, fallbackComponent, placeholder, onClick, plus standard CSS props (styles, className). A2UI SPEC: the A2UI JSON spec does not support the fallbackComponent (ReactNode) or placeholder (ReactNode) props directly — do NOT emit "attributes" or "fallbackComponent" in A2UI JSON. Use "label" or "value" for initials text instead. Use "size" or "sizeVariant" for size (size is the A2UI-only alias; sizeVariant is the real prop and is also accepted as a top-level A2UI field). For an icon inside the avatar, set top-level "icon" plus optional "fill" or "fillSvg"; the renderer maps those A2UI-only fields to the real fallbackComponent prop internally. For a status badge ON the avatar use withBadge + badgeColor directly on this component — do NOT place a separate "badge" or sibling "icon" next to the avatar. Prefer theme color tokens before raw CSS/hex. Example: {"type":"avatar","icon":"star","size":"xl","backgroundColor":"#cfaaa7","fill":"#646464"}.',
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
        'A2UI JSON field only — not a real Avatar React prop. Initials text shown as fallback (e.g. "JD"). Use label OR value — do NOT use "fallbackComponent" in A2UI JSON. Renderer checks label first, then value, and maps the result into the real fallbackComponent prop.',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'A2UI JSON field only — not a real Avatar React prop. Alias for label: initials text shown as avatar fallback when label is absent (e.g. "JD"). The renderer promotes value into the real fallbackComponent prop automatically. Prefer label in new A2UI specs.',
    },
    {
      name: 'src',
      type: 'string',
      description: 'Real Avatar React prop. Image URL. Also a top-level field in A2UI spec.',
    },
    {
      name: 'alt',
      type: 'string',
      description: 'Real Avatar React prop. Image alt text. Also a top-level field in A2UI spec.',
    },
    {
      name: 'size',
      type: 'string',
      description:
        'A2UI JSON field only — not a real Avatar React prop; the real prop is sizeVariant. Preferred A2UI field name — use this over sizeVariant in A2UI JSON. Note: the withBadge dot and initials fallback text do not have dedicated xxl token sizing yet — at size="xxl" they render at the same size as the default (md) tier.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    {
      name: 'sizeVariant',
      type: 'string',
      description:
        'Real Avatar React prop (AvatarProps.sizeVariant). Also accepted as a top-level A2UI field — size is preferred in new A2UI specs.',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const,
    },
    {
      name: 'withBadge',
      type: 'boolean',
      description: 'Real Avatar React prop. Show status dot badge ON the avatar. Also a top-level A2UI field.',
    },
    {
      name: 'badgeColor',
      type: 'string',
      description:
        'Real Avatar React prop. Badge background color. Also a top-level A2UI field. Prefer theme color token paths (e.g. "bg.fill.success.primary.default", "bg.fill.error.primary.default"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'icon',
      type: 'string',
      description:
        'A2UI JSON field only — not a real Avatar React prop. Avatar fallback icon name (for example "star" or "user"). The renderer maps this into the real fallbackComponent prop as an Icon element. Icon pixel size is derived from sizeVariant/size (xs=12, sm=18, md=20, lg=24, xl=40) — xxl has no dedicated icon size yet and falls back to the md (20px) icon size.',
    },
    {
      name: 'fill',
      type: 'string',
      description:
        'A2UI JSON field only — not a real Avatar React prop. Fallback icon fill color, used when icon is set. Prefer theme icon token paths (e.g. "icon.default", "icon.warning"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'fillSvg',
      type: 'string',
      description:
        'A2UI JSON field only — not a real Avatar React prop. Optional uniform SVG fill for the fallback icon, used when icon is set. Overrides fill when both are set.',
    },
    {
      name: 'backgroundColor',
      type: 'string',
      description:
        'Real Avatar React prop. Background color for initials/icon fallback. Also a top-level A2UI field. Prefer theme color token paths (e.g. "bg.fill.secondary", "bg.fill.info.primary.default"). Use raw CSS/hex only when no theme token fits.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'A2UI JSON field only — not a real Avatar React prop. Action IDs from ui.actions to trigger when the avatar is clicked. The renderer wires this into the real onClick prop.',
    },
    {
      name: 'styling',
      type: 'object',
      description:
        'A2UI JSON field only — not a real Avatar React prop; the real prop is styles (CSSObject). CSS style overrides for the avatar, merged by the renderer into the real styles prop.',
    },
  ],
  quickStart: {
    basic: '<Avatar src="/user-photo.jpg" alt="John Doe" />',
    initials: '<Avatar fallbackComponent="JD" backgroundColor="bg.fill.info.primary.default" />',
    withBadge: '<Avatar src={userImage} alt={userName} withBadge badgeColor="bg.fill.success.primary.default" />',
    icon: '<Avatar fallbackComponent={<Icon name="star" fill="#646464" />} backgroundColor="#E0E0E0" />',
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
      code: '<Avatar fallbackComponent={<Icon name="star" fill="#646464" />} backgroundColor="#E0E0E0" sizeVariant="xl" />',
      useCase: 'Profile placeholders or branded avatars that use an icon inside the avatar itself',
    },
    'Team Member': {
      code: '<Avatar fallbackComponent={user.initials} backgroundColor={user.color} sizeVariant="md" />',
      useCase: 'Team directories and member listings',
    },
  },
  examples: [
    '<Avatar src="/user-photo.jpg" alt="John Doe" sizeVariant="lg" />',
    '<Avatar fallbackComponent="JD" backgroundColor="bg.fill.info.primary.default" sizeVariant="md" />',
    '<Avatar src={userImage} alt={userName} withBadge badgeColor="bg.fill.success.primary.default" sizeVariant="sm" />',
    '<Avatar fallbackComponent={<Icon name="star" fill="#646464" />} backgroundColor="#E0E0E0" sizeVariant="xl" />',
    '<Avatar fallbackComponent={<Icon name="user" />} backgroundColor="primary.default" sizeVariant="xl" />',
    '<Avatar src="/avatar.png" alt="User" withBadge={isOnline} badgeColor={isOnline ? "bg.fill.success.primary.default" : "bg.fill.error.primary.default"} />',
    'A2UI JSON (not TSX): {"type":"avatar","icon":"star","size":"xl","backgroundColor":"#cfaaa7","fill":"#646464"} — the renderer maps icon/fill/size into the real fallbackComponent/sizeVariant props.',
  ],
  troubleshooting: {
    'Image not loading': 'Check src URL and provide fallbackComponent for graceful degradation',
    'Badge not showing': 'Ensure withBadge prop is set to true and badgeColor is provided',
    'Icon fallback not showing':
      'In TSX, pass fallbackComponent={<Icon name="..." />} directly — Avatar has no icon/fill props of its own. In A2UI JSON, set the icon field (plus optional fill/fillSvg) and the renderer builds the Icon element for you.',
    'Size not applying':
      'Use sizeVariant (React prop) or size (A2UI JSON field) instead of width/height for consistent sizing.',
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
  'For initials fallback text: in TSX pass fallbackComponent="JD" directly; in A2UI JSON use the label field (or value as a fallback) instead — the renderer maps it into fallbackComponent.',
  'For an icon fallback: in TSX pass fallbackComponent={<Icon name="..." fill="..." />} directly — Avatar has no icon/fill/fillSvg props of its own; those are A2UI-JSON-only fields the renderer expands into an Icon element.',
  'Use withBadge and badgeColor for presence or status indicators (real prop and A2UI field, same names).',
  'In A2UI JSON, wire interactive avatars through the actions[] field, which the renderer wires into the real onClick prop. In TSX, pass onClick directly.',
  'Avatar sizes range from xs to xxl (sizeVariant in TSX, size or sizeVariant in A2UI JSON). The withBadge dot and initials fallback text share the default (md) token size at xxl — no dedicated xxl badge/fallback-text tokens exist yet.',
];

export default { component, compositionTips };
