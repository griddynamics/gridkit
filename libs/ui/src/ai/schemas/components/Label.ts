const component = {
  name: 'Label',
  import: "import { Label } from 'gd-design-library'",
  description:
    'Semantic label component for form controls providing accessible text labels with customizable spacing and interaction support.',
  a2uiName: 'label',
  category: 'Forms & Input',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Lightweight',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    { name: 'label', type: 'string', description: 'Visible label text.', required: true },
    {
      name: 'htmlFor',
      type: 'string',
      description: 'ID of the associated form control (links label to input for accessibility)',
    },
    { name: 'ariaLabel', type: 'string', description: 'Accessible label when visual label alone is insufficient' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the label' },
  ],
  examples: [
    '<Label htmlFor="email-input">Email Address</Label>',
    '<Label gap="8px"><Input type="checkbox" /> Remember me</Label>',
    '<Label htmlFor="password" className="required-field">Password *</Label>',
    '<Label styles={{fontWeight: "bold"}} htmlFor="username">Username</Label>',
  ],
};

const compositionTips: string[] = [
  'Use label for visible text and htmlFor when the label should focus a separate form control.',
  'Use ariaLabel only when the visible label text needs extra context for assistive technology.',
  'Keep labels short and explicit so forms stay easy to scan.',
  'Use styling for spacing or emphasis instead of relying on nested child markup.',
  'Prefer a dedicated Label component over anonymous text when accessibility matters.',
];

export default { component, compositionTips };
