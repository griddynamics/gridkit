const component = {
  name: 'Button',
  import: "import { Button } from 'gd-design-library'",
  description:
    'Clickable button with multiple style variants (primary, secondary, tertiary, outlined, text). Use actions[] to wire up A2UI interactions.',
  a2uiName: 'button',
  category: 'Actions & Controls',
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
    { name: 'label', type: 'string', description: 'Button text content (maps to children)' },
    {
      name: 'variant',
      type: 'string',
      description:
        'Visual style variant of the button. Valid ButtonVariant values (always lowercase): primary|secondary|tertiary|outlined|text|inherit. NEVER use capitalized forms (Primary, Secondary…) or non-existent variants (danger, contained, default).',
      enum: ['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit'] as const,
    },
    { name: 'disabled', type: 'boolean', description: 'Disables the button preventing interaction' },
    { name: 'isLoading', type: 'boolean', description: 'Shows a loading spinner inside the button and disables it' },
    { name: 'fullWidth', type: 'boolean', description: 'Makes the button fill the full width of its container' },
    { name: 'isIcon', type: 'boolean', description: 'Renders the button as a square icon-only button (no text)' },
    {
      name: 'icon',
      type: 'string',
      description: 'Leading icon name from the shared A2UI icon catalog.',
    },
    { name: 'iconEnd', type: 'string', description: 'Trailing icon name from the shared A2UI icon catalog.' },
    {
      name: 'rounded',
      type: 'string',
      description:
        'Border radius style. Token values: "none"=0px (sharp), "xs"=2px, "sm"=4px, "md"=8px, "lg"=16px, "xl"=32px, "default"=6px, "round"=9999px (CSS clamps to half the smallest dimension → perfect pill on wide text buttons, perfect circle on square icon buttons). Use "round" for pill or circle shapes. Use "xl" for prominent-but-not-full-pill shapes.',
      enum: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'] as const,
    },
    {
      name: 'iconStart',
      type: 'string',
      description:
        'Alias for icon: leading icon name from the shared A2UI icon catalog. The renderer checks iconStart first, then falls back to icon. Prefer icon in new A2UI specs.',
    },
    {
      name: 'buttonType',
      type: 'string',
      description:
        'HTML button type attribute. Use this instead of top-level type, which is reserved for the component kind.',
      enum: ['button', 'submit', 'reset'] as const,
      default: 'button',
    },
    { name: 'ariaLabel', type: 'string', description: 'Accessible label for icon-only buttons' },
    { name: 'tabIndex', type: 'number', description: 'Keyboard navigation order for the button.' },
    { name: 'actions', type: 'string[]', description: 'Action IDs from ui.actions to trigger on click' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the button' },
  ],
  quickStart: {
    basic: '<Button onClick={handleClick}>Click me</Button>',
    primary: '<Button variant="primary" onClick={handleSubmit}>Submit</Button>',
    secondary: '<Button variant="secondary" onClick={handleCancel}>Cancel</Button>',
    rounded: '<Button variant="primary" rounded="md" onClick={handleClick}>Rounded Button</Button>',
    icon: '<Button isIcon rounded="round" aria-label="Settings" iconStart={<Icon name="settings" />} />',
    withIcon: '<Button iconStart={<Icon name="plus" />}>Add Item</Button>',
  },
  commonPatterns: {
    'Primary Action': {
      code: '<Button variant="primary" onClick={handleSubmit}>Submit</Button>',
      useCase: 'Main call-to-action buttons for forms and important actions',
    },
    'Secondary Action': {
      code: '<Button variant="secondary" onClick={handleCancel}>Cancel</Button>',
      useCase: 'Secondary actions like cancel, back, or alternative options',
    },
    'Icon Button': {
      code: '<Button isIcon aria-label="Settings" iconStart={<Icon name="settings" />} />',
      useCase: 'Compact icon-only buttons for toolbars and navigation',
    },
    'Form Submit': {
      code: '<Button type="submit" fullWidth disabled={isSubmitting}>Save Changes</Button>',
      useCase: 'Form submission buttons with loading states',
    },
    'State Control via className': {
      code: '<Button variant="primary" justifyContent="start" className="active">Press Me</Button>',
      useCase:
        'Control button states using className prop with values like "active", "hover", or combine with disabled prop',
    },
    'Custom Styled with Box Props': {
      code: '<Button padding="8px" width="300px" justifyContent="start" iconStart={<Icon name="folder" />}>Custom Styled</Button>',
      useCase: 'Buttons with Box layout props (padding, width, justifyContent) and iconStart for flexible layouts',
    },
    'Disabled with Box Props': {
      code: '<Button variant="primary" disabled justifyContent="start">Disabled</Button>',
      useCase: 'Disabled buttons with Box layout props for consistent alignment',
    },
  },
  examples: [
    '<Button variant="primary" onClick={handleSubmit}>Submit</Button>',
    '<Button variant="secondary" onClick={handleCancel}>Cancel</Button>',
    '<Button variant="tertiary" onClick={handleBack}>Back</Button>',
    '<Button variant="outlined" rounded="md" iconStart={<Icon name="plus" />}>Add Item</Button>',
    '<Button variant="text" onClick={handleSkip}>Skip</Button>',
    '<Button isIcon rounded="round" aria-label="Settings" iconStart={<Icon name="settings" />} />',
    '<Button type="submit" fullWidth disabled={isSubmitting}>Save Changes</Button>',
    '<Button variant="primary" justifyContent="start" className="active">Press Me</Button>',
    '<Button variant="primary" disabled justifyContent="start">Disabled</Button>',
    '<Button padding="8px" width="300px" justifyContent="start" iconStart={<Icon name="folder" />}>Custom Styled</Button>',
  ],
  troubleshooting: {
    'Button not clickable': 'Check if disabled prop is set to true or if onClick handler is missing',
    'Accessibility issues': 'Add aria-label for icon buttons and ensure proper focus management',
    'Styling not applied': 'Verify variant prop is set correctly',
    'Form submission not working': 'Use type="submit" for form buttons and ensure form has onSubmit handler',
    'Icon not displaying': 'Check if Icon component is imported and name prop is correct',
    'size prop has no effect':
      'Button does NOT have a size prop — it is silently ignored. Use padding="4px 8px" and height="28px" (Box props) to create compact buttons, or height="36px" for standard size.',
  },
  compositionTips: [
    'Use variant="primary" for main actions, "secondary" for important alternatives, and "tertiary" for less prominent actions',
    'Always provide aria-label for icon-only buttons',
    'When using isIcon, provide the icon via iconStart and do not pass children',
    'Use rounded="round" for icon buttons to create circular shapes',
    'Apply rounded="md" or "lg" for modern, friendly button designs',
    'Use fullWidth for mobile forms and important actions',
    'Set disabled state during async operations to prevent double-clicks',
    'Use type="submit" for form submission and type="button" for other actions',
    'Include loading states for buttons that trigger async operations',
    'Use consistent button variants and rounded styles across your application',
    'Provide clear, actionable button text',
    'Use iconStart and iconEnd for better visual hierarchy — pass <Icon size="sm" name="..." /> to iconStart/iconEnd rather than embedding a raw Icon as a child alongside text',
    'Test keyboard navigation with Tab and Enter keys',
    'Active/pressed states are built-in with scale animation for better tactile feedback',
    'Button has NO size prop — never use size="sm"/"md"/"lg". To create a compact button use padding="4px 8px" and/or height="28px". For standard size use height="36px".',
    'Use Box props like justifyContent="start" to align button content, and combine with alignItems, gap, margin, padding, width, height for flexible layouts',
    'Use className for custom CSS classes to control states: "active", "hover", or combine with disabled prop for disabled state',
    'Use styles prop for inline styles when needed. Example: `<Button padding="8px" width="300px" justifyContent="start" iconStart={<Icon name="folder" />}>Custom Styled</Button>`',
    'Buttons have built-in hover, active (press), and disabled states with smooth transitions. Control states via className prop with values like "active", "hover"',
  ],
};

const compositionTips: string[] = [
  'Use button label for visible text and ariaLabel for icon-only buttons.',
  'Wire button interactions through actions[] instead of raw onClick callbacks.',
  'Use iconStart and iconEnd with icon catalog name strings for leading and trailing icons — never embed an icon as a raw child alongside label text.',
  'Use buttonType="submit" only for form submission buttons; top-level type stays reserved for the component kind.',
  'Use styling for compact sizing, alignment, or custom spacing when the default button size is not enough.',
  'For buttons with visible text and a directional or action icon (e.g. undo/redo, next/back, send), use iconStart for leading icons and iconEnd for trailing icons. WRONG: label="← Undo". RIGHT: label="Undo", iconStart="arrowLeft".',
  'Icon-only buttons MUST set isIcon: true and provide the icon via iconStart — never pass a bare icon as children without isIcon.',
];

export default { component, compositionTips };
