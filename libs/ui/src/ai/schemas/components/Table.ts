const component = {
  name: 'Table',
  import:
    "import { Table, TableColumn, TableRowData, TableHead, TableBody, TableFooter, TableRow, TableCell, TableHeaderCell, TablePagination } from 'gd-design-library'",
  description:
    'Comprehensive table component with virtualization, pagination, sorting, expandable rows, custom header rendering, and imperative scroll methods. Built with subcomponents for flexible composition.',
  a2uiName: 'table',
  category: 'Display & Content',
  complexity: 'High',
  accessibility: 'WCAG 2.1 AA Compliant',
  performance: 'Optimized with virtualization support',
  dependencies: ['@emotion/react', '@emotion/styled'],
  peerDependencies: ['react', 'react-dom'],
  bundleSize: '~8KB gzipped',
  browserSupport: 'All modern browsers',
  touchSupport: true,
  keyboardSupport: true,
  screenReaderSupport: true,
  props: [
    {
      name: 'columns',
      type: 'Array<{ key: string; label: string; sortable?: boolean; width?: string }>',
      description:
        'Column definitions used by the A2UI table renderer. Each column needs a key and label, plus optional sortable and width values.',
      required: true,
    },
    {
      name: 'rows',
      type: 'Array<Record<string, unknown>>',
      description: 'Preferred row data source. Each object should include keys matching the configured columns.',
      required: true,
    },
    {
      name: 'data',
      type: 'Array<Record<string, unknown>>',
      description: 'Legacy alias for rows; supported for backward compatibility',
    },
    { name: 'pagination', type: 'boolean', description: 'Whether to show built-in pagination controls' },
    { name: 'pageSize', type: 'number', description: 'Default number of rows per page when pagination is enabled' },
    { name: 'pageSizes', type: 'number[]', description: 'Selectable page-size options for the pagination control' },
    { name: 'stickyHeader', type: 'boolean', description: 'Keep the table header fixed while scrolling' },
    { name: 'stickyFooter', type: 'boolean', description: 'Keep the table footer fixed while scrolling' },
    { name: 'stickyPagination', type: 'boolean', description: 'Keep the pagination row fixed while scrolling' },
    { name: 'virtualized', type: 'boolean', description: 'Enable virtualization for very large datasets' },
    { name: 'rowHeight', type: 'number', description: 'Row height in pixels when virtualization is enabled' },
    { name: 'minVisibleRange', type: 'number', description: 'Minimum virtualized row range kept in view' },
    { name: 'isLoading', type: 'boolean', description: 'Render the table in loading mode' },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the table container' },
  ],
  ref: {
    type: 'TableRef',
    description: 'Ref object with imperative scroll methods for programmatic table navigation',
    methods: [
      {
        name: 'scrollToRow',
        type: '(index: number) => void',
        description:
          'Scrolls to a specific row by index. The table will scroll to row at (index - 1). For example, scrollToRow(50) scrolls to row 49. Works with both virtualized and non-virtualized tables, accounting for sticky headers.',
        example: `const tableRef = useRef<TableRef>(null);

// Scroll to row 50 (actually scrolls to row 49, index - 1)
tableRef.current?.scrollToRow?.(50);`,
      },
      {
        name: 'scrollToTop',
        type: '() => void',
        description: 'Scrolls the table container to the top',
        example: `const tableRef = useRef<TableRef>(null);

tableRef.current?.scrollToTop?.();`,
      },
      {
        name: 'scrollToBottom',
        type: '() => void',
        description: 'Scrolls the table container to the bottom',
        example: `const tableRef = useRef<TableRef>(null);

tableRef.current?.scrollToBottom?.();`,
      },
    ],
    example: `import { useRef } from 'react';
import { Table, TableRef } from 'gd-design-library';

const tableRef = useRef<TableRef>(null);

<Table
  ref={tableRef}
  columns={columns}
  data={data}
/>

// Later, scroll to a specific row
tableRef.current?.scrollToRow?.(50);`,
  },
  examples: [
    `// Basic Table - Simple table with columns and data
import { Table, TableColumn } from 'gd-design-library';

const columns: TableColumn<any>[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
];

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
];

<Table columns={columns} data={data} />`,
    `// Table with Column Widths - Table with fixed column widths
import { Table, TableColumn } from 'gd-design-library';

const columns: TableColumn<any>[] = [
  { id: 'name', label: 'Name', accessor: 'name', width: '200px' }, // String with pixels
  { id: 'email', label: 'Email', accessor: 'email', width: '300px' }, // String with pixels
  { id: 'role', label: 'Role', accessor: 'role', width: 150 }, // Number = pixels (converted to "150px")
  { id: 'status', label: 'Status', accessor: 'status', width: '15%' }, // Percentage
];

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

<Table columns={columns} data={data} />`,
    `// Table with Pagination - Table with pagination controls and page size selector
import { useState } from 'react';
import { Table, TableColumn } from 'gd-design-library';

const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(10);

<Table
  columns={columns}
  data={data}
  pagination
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>`,
    `// Table with Sticky Pagination - Table with sticky pagination that remains visible when scrolling
import { Table, TableColumn, Box } from 'gd-design-library';

<Box height="400px" overflow="auto">
  <Table
    columns={columns}
    data={data}
    pagination
    pageSize={10}
    stickyPagination
  />
</Box>`,
    `// Table with Expandable Rows - Table with expandable rows showing additional content
import { Table, TableColumn, TableRowData, Icon, Row, Box, Typography } from 'gd-design-library';

const columns: TableColumn<UserData>[] = [
  {
    id: 'expand',
    label: 'User',
    render: (row) => (
      <Row alignItems="center" gap="8px">
        <Box className="expand-icon-wrapper">
          <Icon name="arrowRight" size="xs" />
        </Box>
        {row.name}
      </Row>
    ),
  },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
];

<Table
  columns={columns}
  data={data}
  expandableRows
  renderExpandedContent={(row) => (
    <Box padding="16px">
      <Typography>Details for {row.name}</Typography>
      <Typography>Email: {row.email}</Typography>
    </Box>
  )}
  styles={{
    '.expand-icon-wrapper svg': {
      transition: 'transform 0.2s ease-in-out',
    },
    'tr[data-expanded="true"] .expand-icon-wrapper svg': {
      transform: 'rotate(90deg)',
    },
  }}
/>`,
    `// Table with Virtualization - Table with virtualization for large datasets
import { Table, TableColumn, Box } from 'gd-design-library';

const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

<Box height="700px" overflow="auto">
  <Table
    columns={columns}
    data={largeDataset}
    virtualized
    rowHeight={48}
    stickyHeader
  />
</Box>`,
    `// Table with Loading State - Table with loading state using Skeleton loaders
import { useState } from 'react';
import { Table, TableColumn, Skeleton, Row, Box, Column, Button } from 'gd-design-library';

const columns: TableColumn<any>[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data = [
  { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'User 2', email: 'user2@example.com', role: 'User', status: 'Inactive' },
  // ... more data
];

const Example = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loadingState = (
    <Box padding="16px">
      <Column gap="12px">
        {Array.from({ length: 5 }).map((_, index) => (
          <Row key={index} gap="16px" alignItems="center">
            <Skeleton variant="rounded" width="120px" height="20px" />
            <Skeleton variant="rounded" width="180px" height="20px" />
            <Skeleton variant="rounded" width="100px" height="20px" />
            <Skeleton variant="rounded" width="80px" height="20px" />
          </Row>
        ))}
      </Column>
    </Box>
  );

  return (
    <Box>
      <Row gap="10px" marginBottom="16px">
        <Button variant="secondary" onClick={() => setIsLoading(!isLoading)}>
          {isLoading ? 'Stop Loading' : 'Start Loading'}
        </Button>
      </Row>
      <Table
        columns={columns}
        data={data}
        loading={isLoading}
        loadingState={loadingState}
      />
    </Box>
  );
};`,
    `// Table with Custom Header - Table with custom header rendering
import { Table, TableColumn, TableRow, TableHeaderCell } from 'gd-design-library';

const renderCustomHeader = (columns: TableColumn<any>[]) => (
  <>
    <TableRow>
      <TableHeaderCell colSpan={columns.length} styles={{ textAlign: 'center', fontWeight: 'bold' }}>
        Custom Header Row
      </TableHeaderCell>
    </TableRow>
    <TableRow>
      {columns.map(column => (
        <TableHeaderCell key={column.id}>
          {column.label}
        </TableHeaderCell>
      ))}
    </TableRow>
  </>
);

<Table
  columns={columns}
  data={data}
  renderHeader={renderCustomHeader}
  stickyHeader
/>`,
    `// Table with Scroll Methods - Table with imperative scroll methods using ref
import { useRef, useState } from 'react';
import { Table, TableColumn, TableRowData, TableRef, Button, Input, Row, Box } from 'gd-design-library';

const tableRef = useRef<TableRef>(null);
const [targetRow, setTargetRow] = useState(50);

<Box>
  <Row gap="10px" marginBottom="16px">
    <Button variant="secondary" onClick={() => tableRef.current?.scrollToTop?.()}>
      Scroll to Top
    </Button>
    <Button variant="secondary" onClick={() => tableRef.current?.scrollToBottom?.()}>
      Scroll to Bottom
    </Button>
    <Input
      variant="number"
      min="0"
      max="300"
      value={targetRow.toString()}
      onChange={(e) => setTargetRow(+e.target.value)}
    />
    <Button variant="outlined" onClick={() => tableRef.current?.scrollToRow?.(targetRow)}>
      Scroll to Row {targetRow}
    </Button>
  </Row>
  <Box height="430px" overflow="auto">
    <Table
      ref={tableRef}
      columns={columns}
      data={data}
      stickyHeader={false}
    />
  </Box>
</Box>`,
  ],
  bestPractices: [
    'Use virtualization for datasets with 1000+ rows to improve performance',
    'Always provide an `id` property for each row data object (string or number)',
    'Use `stickyHeader` when the table is inside a scrollable container',
    'Use `stickyFooter` to keep footer visible when scrolling through long tables',
    'Use `stickyPagination` to keep pagination controls visible when scrolling through long tables',
    'The Table component does not have a built-in `onSort` prop; implement sorting by managing data order in parent state',
    'Use `renderHeader` for complex header layouts (multi-row headers, custom styling)',
    'Provide `emptyState` for better UX when no data is available',
    'Use `loadingState` to show loading indicators during data fetching',
    'Set `rowHeight` accurately for virtualization to work correctly',
    'When using pagination, manage page state in parent component',
    'Use `expandableRows` with `renderExpandedContent` for drill-down functionality',
    'Use `ref` with `scrollToRow`, `scrollToTop`, and `scrollToBottom` for programmatic navigation',
    'Wrap table in a container with fixed height and overflow for scroll methods to work',
    'Note: `scrollToRow(index)` scrolls to row at (index - 1), e.g., scrollToRow(50) scrolls to row 49',
  ],
  commonMistakes: [
    'Forgetting to provide `id` property in row data objects',
    'Forgetting to sort data in parent state when custom sorting is needed',
    'Using virtualization with pagination (virtualization disables pagination automatically)',
    'Not providing `renderExpandedContent` when `expandableRows` is true',
    'Using incorrect `rowHeight` for virtualization causing scroll issues',
    'Not managing page state in parent component when using pagination',
    'Forgetting to handle empty data state with `emptyState` prop',
  ],
  relatedComponents: [
    'TableHead',
    'TableBody',
    'TableFooter',
    'TableRow',
    'TableCell',
    'TableHeaderCell',
    'TablePagination',
  ],
};

const compositionTips: string[] = [
  'Use Table for displaying structured data in rows and columns with support for sorting, pagination, and virtualization.',
  'Always provide an `id` property (string or number) for each row data object - this is required for Table to function correctly.',
  'Use Table virtualization (`virtualized` prop) for datasets with 1000+ rows to improve performance. Only visible rows are rendered.',
  'Set `rowHeight` accurately when using virtualization (default: 48px) - incorrect values cause scroll calculation issues.',
  'When virtualized, pagination is automatically disabled as virtualization handles large datasets efficiently.',
  'Table does NOT sort data automatically. Sort data in parent component state and pass the sorted array to the `data` prop.',
  'Use `renderHeader` prop for complex header layouts (multi-row headers, custom styling, custom sort indicators).',
  'When using `renderHeader`, manually handle sort state and callbacks in your custom header implementation.',
  'Use `expandableRows` with `renderExpandedContent` for drill-down functionality - clicking expand icon reveals additional content.',
  'Use `stickyHeader` when table is inside a scrollable container to keep header visible while scrolling.',
  'Use `stickyFooter` to keep footer visible when scrolling through long tables.',
  'Use `stickyPagination` to keep pagination controls visible at the bottom when scrolling through long tables. Wrap table in a container with fixed height and overflow for sticky behavior.',
  'Use `ref` prop with `TableRef` type to access imperative scroll methods: `scrollToRow(index)`, `scrollToTop()`, `scrollToBottom()`.',
  'For scroll methods to work, wrap table in a container with fixed height and `overflow: auto` or `overflow: scroll`.',
  'Note: `scrollToRow(index)` scrolls to row at (index - 1). For example, `scrollToRow(50)` scrolls to row 49. This accounts for 0-based indexing.',
  'Scroll methods work with both virtualized and non-virtualized tables, automatically accounting for sticky headers.',
  'Provide `emptyState` ReactNode for better UX when no data is available - replaces table body when data array is empty.',
  'Provide `loadingState` ReactNode to show loading indicators during data fetching - replaces table content when `loading` is true.',
  'When using pagination, manage page state in parent component with `onPageChange` and `onPageSizeChange` callbacks.',
  'Configure page sizes with `pageSizes` prop (default: [10, 25, 50]) - users can select from these options.',
  'Table subcomponents (TableHead, TableBody, TableFooter, TableRow, TableCell, TableHeaderCell, TablePagination) can be used independently for custom table layouts.',
  'For complex cell content, use column `render` function instead of `accessor` - gives full control over cell rendering.',
  'Use column `accessor` as keyof T for simple property access, or as function for computed values.',
  'Set column `width` property (string like "100px" or "20%" or number in pixels) to control cell width. Width is applied to both header and data cells for consistent column sizing.',
  'Use `colSpan` in TableCell for cells that span multiple columns (e.g., in expanded rows or custom headers).',
  'Combine Table with other components: use Typography in cells, Button for actions, Icon for indicators.',
  'Table supports full Box component props (margin, padding, width, height, display, overflow, zIndex) for flexible container styling.',
];

export default { component, compositionTips };
