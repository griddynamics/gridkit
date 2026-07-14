const component = {
  name: 'SnackbarManager',
  import: "import { SnackbarManager } from 'gd-design-library'",
  description:
    'Global snackbar container component that manages and displays all snackbar notifications. Must be included once at the app root level to enable showSnackbar() functionality.',
  category: 'Feedback & Status',
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
  props: [],
  examples: ['<SnackbarManager />'],
};

const compositionTips: string[] = [
  'Render a single SnackbarManager at the application root to handle all snackbars.',
  'Do not mount multiple managers; use showSnackbar() API to enqueue messages.',
  'Mount a single <SnackbarManager /> at the root of your app to enable snackbar rendering.',
  'Place SnackbarManager at the root of your app, typically in App.tsx or index.tsx, to enable global snackbar functionality.',
  'Use showSnackbar() function anywhere in the app after SnackbarManager is mounted.',
  'Apply SnackbarManager maxSnackbars limit to prevent notification overflow.',
];

export default { component, compositionTips };
