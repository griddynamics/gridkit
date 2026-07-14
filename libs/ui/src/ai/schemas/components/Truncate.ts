const component = {
  name: 'Truncate',
  import: "import { Truncate, type TruncateRef } from 'gd-design-library'",
  description:
    'Text truncation component that limits content to a specified number of lines using CSS line-clamp. Provides uniform truncation with visual alignment support and exposes truncation state via ref API for programmatic access.',
  a2uiName: 'truncate',
  category: 'Display & Content',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized with ResizeObserver',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~1KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    { name: 'label', type: 'string', description: 'Text content to display and truncate.', required: true },
    { name: 'lines', type: 'number', description: 'Maximum number of lines before truncation (uses CSS line-clamp)' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the truncate component' },
  ],
  examples: [
    '<Truncate>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Truncate>',
    '<Truncate lines={2}>This is a very long text that will wrap to multiple lines and be truncated after 2 lines.</Truncate>',
    '<Truncate lines={3} styles={{ width: "300px" }}>Long content that needs truncation with custom width styling.</Truncate>',
    '<Box width="50%"><Truncate ref={truncateRef}>Content that may be truncated. Check ref.isTruncated to conditionally show tooltip.</Truncate></Box>',
    '<Tooltip content={isTruncated ? fullText : null}><Truncate ref={truncateRef}>{fullText}</Truncate></Tooltip>',
    '<Table columns={columns} data={data} renderCell={(row, column) => <Truncate lines={1}>{row[column.accessor]}</Truncate>} />',
  ],
};

const compositionTips: string[] = [
  'Use truncate for long copy that must fit inside a fixed card, row, or metadata slot.',
  'Use lines=1 for single-line ellipsis and larger values for previews or summaries.',
  'Pair truncate with tooltip or full-detail patterns when users still need access to the complete text.',
  'Keep the containing width predictable so truncation behaves consistently across breakpoints.',
  'Use styling for surrounding spacing or width constraints rather than nested child markup.',
];

export default { component, compositionTips };
