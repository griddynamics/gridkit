import { ComponentType, useState, useRef } from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Typography, Button, Icon, Input, Switch, Row, Box, Skeleton, Column } from '@components';
import { defaultTheme } from '@tokens';
import {
  Table,
  TableColumn,
  TableRowData,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableHeaderCell,
  TablePagination,
  type TableHeadProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableCellProps,
  type TableHeaderCellProps,
  type TablePaginationProps,
  type TableRef,
} from './';
import {
  defaultActions,
  withPaginationActions,
  withStickyHeaderActions,
  withStickyFooterActions,
  withColumnWidthsActions,
  withStickyHeaderAndFooterActions,
  withExpandableRowsActions,
  withVirtualizationActions,
  emptyStateActions,
  withLoadingStateActions,
  withCustomHeaderActions,
  withScrollMethodsActions,
  withCustomCellRenderersActions,
} from './Table.stories.play';

const meta: Meta<typeof Table> = {
  title: 'Molecules/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
  The \`Table\` component is a comprehensive data table with support for virtualization, pagination, and expandable rows.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Data Display</b>
  <ul>
  <li>Column-based data rendering with customizable accessors</li>
  <li>Support for custom cell rendering functions</li>
  <li>Type-safe column and row data definitions</li>
  </ul>
  </li>
  <li>
  <b>Performance</b>
  <ul>
  <li>Virtualization for large datasets (1000+ rows)</li>
  <li>Only visible rows are rendered</li>
  <li>Configurable row height for scroll calculations</li>
  </ul>
  </li>
  <li>
  <b>Pagination</b>
  <ul>
  <li>Built-in pagination controls</li>
  <li>Page size selector (default: 10, 25, 50)</li>
  <li>Previous/Next navigation buttons</li>
  <li>Page number display (shows 3 pages in range)</li>
  </ul>
  </li>
  <li>
  <b>Expandable Rows</b>
  <ul>
  <li>Click to expand/collapse rows</li>
  <li>Custom expanded content rendering</li>
  <li>Visual expand/collapse indicators</li>
  </ul>
  </li>
  <li>
  <b>Layout</b>
  <ul>
  <li>Sticky header and footer support</li>
  <li>Custom header rendering</li>
  <li>Empty and loading states</li>
  </ul>
  </li>
  <li>
  <b>Scroll Methods</b>
  <ul>
  <li>Imperative scroll methods via ref API</li>
  <li><code>scrollToRow(index)</code> - Scrolls to row at (index - 1)</li>
  <li><code>scrollToTop()</code> - Scrolls to top of table</li>
  <li><code>scrollToBottom()</code> - Scrolls to bottom of table</li>
  <li>Works with both virtualized and non-virtualized tables</li>
  <li>Automatically accounts for sticky headers</li>
  </ul>
  </li>
  </ul>
  <br/>
  <h3>Subcomponents:</h3>
  <ul>
  <li><b>TableHead</b> - Table header section with optional sticky positioning. Wraps header rows and provides semantic structure for the table header.</li>
  <li><b>TableBody</b> - Table body section containing data rows. Supports virtualization when used with the main Table component.</li>
  <li><b>TableFooter</b> - Table footer section with optional sticky positioning. Typically used for summary information or pagination controls.</li>
  <li><b>TableRow</b> - Individual table row container. Supports expand/collapse functionality with visual indicators and click handlers.</li>
  <li><b>TableCell</b> - Standard table cell for data display. Supports text alignment (left, center, right) and can render as 'td' or 'th' element.</li>
  <li><b>TableHeaderCell</b> - Specialized cell for table headers. Renders as 'th' element.</li>
  <li><b>TablePagination</b> - Pagination controls component. Displays page information, page size selector, previous/next buttons, and page number buttons. Automatically rendered when Table pagination prop is enabled.</li>
  </ul>
  <br/>
  <h3>Usage Notes:</h3>
  <ul>
  <li>Each row data object must have an <code>id</code> property (string or number)</li>
  <li>When virtualized, pagination is automatically disabled</li>
  <li>Use <code>renderHeader</code> for complex header layouts (multi-row headers, custom styling)</li>
  <li>Subcomponents can be used independently for custom table layouts</li>
  <li>For scroll methods to work, wrap table in a container with fixed height and <code>overflow: auto</code></li>
  <li><code>scrollToRow(index)</code> scrolls to row at (index - 1), e.g., <code>scrollToRow(50)</code> scrolls to row 49</li>
  </ul>
        `,
      },
    },
  },
  subcomponents: {
    TableHead: TableHead as ComponentType<TableHeadProps>,
    TableBody: TableBody as ComponentType<TableBodyProps>,
    TableFooter: TableFooter as ComponentType<TableFooterProps>,
    TableRow: TableRow as ComponentType<TableRowProps>,
    TableCell: TableCell as ComponentType<TableCellProps>,
    TableHeaderCell: TableHeaderCell as ComponentType<TableHeaderCellProps>,
    TablePagination: TablePagination as ComponentType<TablePaginationProps>,
  },
  tags: ['autodocs'],
  argTypes: {
    // Core Props
    columns: {
      description: 'Array of column definitions that specify how each column should be rendered',
      control: false,
      table: {
        category: 'Core',
        type: {
          summary: 'TableColumn[]',
          detail: `TableColumn = {\n  id: string;\n  label: ReactNode;\n  accessor?: string | ((row: any) => ReactNode);\n  width?: string | number;\n  minWidth?: string | number;\n  maxWidth?: string | number;\n  render?: (row: TableColumn, index: number) => ReactNode;\n}`,
        },
      },
    },
    data: {
      description: 'Array of row data objects. Each object must have an `id` property (string or number)',
      control: false,
      table: {
        category: 'Core',
        type: {
          summary: 'T[]',
          detail: 'T extends TableRowData = { id: string | number; [key: string]: unknown; }',
        },
      },
    },

    // Layout & Appearance
    stickyHeader: {
      description: 'Makes the table header sticky, remaining visible when scrolling vertically',
      control: 'boolean',
      table: {
        category: 'Layout',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    stickyFooter: {
      description: 'Makes the table footer sticky, remaining visible when scrolling vertically',
      control: 'boolean',
      table: {
        category: 'Layout',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    stickyPagination: {
      description: 'Makes the pagination controls sticky, remaining visible at the bottom when scrolling vertically',
      control: 'boolean',
      table: {
        category: 'Layout',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rowHeight: {
      description: 'Height of each row in pixels. Used for virtualization calculations',
      control: 'number',
      table: {
        category: 'Layout',
        type: { summary: 'number' },
        defaultValue: { summary: '48' },
      },
    },

    // Behavior
    virtualized: {
      description:
        'Enables virtualization for large datasets. Only visible rows are rendered, improving performance with thousands of rows. When enabled, pagination is automatically disabled',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    expandableRows: {
      description:
        'Enables expand/collapse functionality for rows. Adds an expand icon column and allows rendering expanded content via `renderExpandedContent`',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pagination: {
      description:
        'Enables pagination controls at the bottom of the table. Shows page numbers, previous/next buttons, and page size selector',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pageSize: {
      description: 'Number of items to display per page when pagination is enabled',
      control: 'number',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
      },
    },
    pageSizes: {
      description: 'Array of available page size options for the pagination selector',
      control: false,
      table: {
        category: 'Behavior',
        type: {
          summary: 'number[]',
          detail: 'Array of numbers representing available page sizes (e.g., [10, 25, 50])',
        },
        defaultValue: { summary: '[10, 25, 50,]' },
      },
    },
    loading: {
      description: 'Shows loading state. When true, `loadingState` is displayed instead of table content',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // Events
    onPageChange: {
      description: 'Callback fired when the page changes. Receives the new page number (0-indexed)',
      action: 'pageChanged',
      table: {
        category: 'Events',
        type: {
          summary: '(page: number) => void',
          detail: 'page: number - The new page index (0-based)',
        },
      },
    },
    onPageSizeChange: {
      description: 'Callback fired when the page size changes. Receives the new page size number',
      action: 'pageSizeChanged',
      table: {
        category: 'Events',
        type: {
          summary: '(pageSize: number) => void',
          detail: 'pageSize: number - The new number of items per page',
        },
      },
    },

    // Customization
    renderExpandedContent: {
      description: 'Function to render custom content when a row is expanded. Receives the row data and index',
      control: false,
      table: {
        category: 'Customization',
        type: {
          summary: '(row: T, index: number) => ReactNode',
          detail: `{\n  row: T - The row data object\n  index: number - The row index\n  returns: ReactNode - Content to display in expanded area\n}`,
        },
      },
    },
    renderHeader: {
      description:
        'Custom header renderer. When provided, replaces the default header. Receives the columns array and should return TableRow components',
      control: false,
      table: {
        category: 'Customization',
        type: {
          summary: '(columns: TableColumn<T>[]) => ReactNode',
          detail: `{\n  columns: TableColumn<T>[] - Array of column definitions\n  returns: ReactNode - Custom header content (typically TableRow with TableHeaderCell)\n}`,
        },
      },
    },
    emptyState: {
      description: 'Content to display when the data array is empty. Replaces the table body',
      control: false,
      table: {
        category: 'Customization',
        type: { summary: 'ReactNode' },
      },
    },
    loadingState: {
      description: 'Content to display when loading is true. Replaces the table content',
      control: false,
      table: {
        category: 'Customization',
        type: { summary: 'ReactNode' },
      },
    },
    footer: {
      description:
        'Content to display in the table footer. Rendered at the bottom of the table, can be made sticky with `stickyFooter` prop',
      control: false,
      table: {
        category: 'Customization',
        type: { summary: 'ReactNode' },
      },
    },

    // Styles
    styles: {
      description: 'CSSObject for custom inline styles',
      control: false,
      table: {
        category: 'Styles',
        type: { summary: 'CSSObject' },
      },
    },

    // Layout & Appearance - Display & Overflow
    display: {
      description: 'CSS display property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },

    // Layout & Appearance - Dimensions
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    width: {
      description: 'CSS width property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    height: {
      description: 'CSS height property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    maxHeight: {
      description: 'CSS max-height property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },

    // Layout & Appearance - Spacing (Margin)
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },

    // Layout & Appearance - Spacing (Padding)
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },

    // Layout & Appearance - Positioning
    zIndex: {
      description: 'CSS z-index property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string | number' },
      },
    },
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    top: {
      description: 'CSS top property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    right: {
      description: 'CSS right property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    bottom: {
      description: 'CSS bottom property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    left: {
      description: 'CSS left property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },

    // Layout & Appearance - Flexbox
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    justifySelf: {
      description: 'CSS justify-self property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    alignSelf: {
      description: 'CSS align-self property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Layout & Appearance',
        type: { summary: 'string' },
      },
    },

    // Behavior - Virtualization
    minVisibleRange: {
      description: 'Minimum number of visible rows for virtualization',
      control: 'number',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '20' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
const generateSampleData = (count: number): TableRowData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'User', 'Guest'][i % 3],
    status: ['Active', 'Inactive'][i % 2],
  }));
};

const sampleColumns: TableColumn[] = [
  {
    id: 'name',
    label: 'Name',
    accessor: 'name',
  },
  {
    id: 'email',
    label: 'Email',
    accessor: 'email',
  },
  {
    id: 'role',
    label: 'Role',
    accessor: 'role',
  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
  },
];

export const Default: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(10),
    footer: (
      <Typography variant="h6" align="center">
        This is the footer content
      </Typography>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic table with columns and data. The table automatically renders headers and rows based on the provided columns and data.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = [
  { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'User 2', email: 'user2@example.com', role: 'User', status: 'Inactive' },
  { id: 3, name: 'User 3', email: 'user3@example.com', role: 'Guest', status: 'Active' },
  { id: 4, name: 'User 4', email: 'user4@example.com', role: 'Admin', status: 'Inactive' },
  { id: 5, name: 'User 5', email: 'user5@example.com', role: 'User', status: 'Active' },
];

const Example = () => {
  return <Table columns={columns} data={data} footer={<Typography variant="h6" align="center">This is the footer content</Typography>}/>;
};`,
      },
    },
  },
};
Default.play = defaultActions;

export const WithPagination: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(50),
    pagination: true,
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with pagination controls. Users can navigate between pages and change the number of items per page. The pagination component shows page numbers, previous/next buttons, and a page size selector.',
      },
      source: {
        code: `import { useState } from 'react';
import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Table
      columns={columns}
      data={data}
      pagination
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(newPageSize) => {
        setPageSize(newPageSize);
        setPage(0); // Reset to first page when page size changes
      }}
    />
  );
};`,
      },
    },
  },
};
WithPagination.play = withPaginationActions;

export const WithStickyHeader: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(30),
    stickyHeader: true,
  },
  render: (args) => (
    <Box height="400px" overflow="auto">
      <Table {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Table with sticky header that remains visible when scrolling. The header stays fixed at the top of the scrollable container. Wrap the table in a container with fixed height and overflow to see the sticky behavior.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  return (
    <Box height="400px" overflow="auto">
      <Table
        columns={columns}
        data={data}
        stickyHeader
      />
    </Box>
  );
};`,
      },
    },
  },
};
WithStickyHeader.play = withStickyHeaderActions;

export const WithStickyFooter: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(30),
    stickyFooter: true,
    footer: (
      <Typography variant="h6" align="center">
        This is the footer content
      </Typography>
    ),
  },
  render: (args) => (
    <Box height="400px" overflow="auto">
      <Table {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Table with sticky footer that remains visible when scrolling. The footer stays fixed at the bottom of the scrollable container. Wrap the table in a container with fixed height and overflow to see the sticky behavior.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  return (
    <Box height="400px" overflow="auto">
      <Table
        columns={columns}
        data={data}
        stickyFooter
        footer={
          <Typography variant="h6" align="center">
            This is the footer content
          </Typography>
        }
      />
    </Box>
  );
};`,
      },
    },
  },
};
WithStickyFooter.play = withStickyFooterActions;

export const WithColumnWidths: Story = {
  args: {
    columns: [
      {
        id: 'name',
        label: 'Name',
        accessor: 'name',
        width: '200px',
      },
      {
        id: 'email',
        label: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        label: 'Role',
        accessor: 'role',
        width: 150, // Number = pixels
      },
      {
        id: 'status',
        label: 'Status',
        accessor: 'status',
        width: '15%', // Percentage
      },
    ],
    data: generateSampleData(10),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with fixed column widths. The `width` property can be set as a number (pixels), string with pixels (e.g., "200px"), or percentage (e.g., "20%"). Width is applied to both header and data cells for consistent column sizing.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  {
    id: 'name',
    label: 'Name',
    accessor: 'name',
    width: '200px', // String with pixels
  },
  {
    id: 'email',
    label: 'Email',
    accessor: 'email',
    width: '300px', // String with pixels
  },
  {
    id: 'role',
    label: 'Role',
    accessor: 'role',
    width: 150, // Number = pixels (converted to "150px")
  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
    width: '15%', // Percentage
  },
];

const data: UserData[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  // ... more data
];

<Table columns={columns} data={data} />`,
      },
    },
  },
};
WithColumnWidths.play = withColumnWidthsActions;

export const WithStickyHeaderAndFooter: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(30),
    stickyHeader: true,
    stickyFooter: true,
    footer: (
      <Typography variant="h6" align="center">
        This is the footer content
      </Typography>
    ),
  },
  render: (args) => (
    <Box height="400px" overflow="auto">
      <Table {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Table with both sticky header and footer. Both remain visible when scrolling - the header at the top and the footer at the bottom of the scrollable container.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  return (
    <Box height="400px" overflow="auto">
      <Table
        columns={columns}
        data={data}
        stickyHeader
        stickyFooter
        footer={
          <Typography variant="h6" align="center">
            This is the footer content
          </Typography>
        }
      />
    </Box>
  );
};`,
      },
    },
  },
};
WithStickyHeaderAndFooter.play = withStickyHeaderAndFooterActions;

export const WithStickyHeaderAndPagination: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(50),
    pagination: true,
    pageSize: 10,
    stickyHeader: true,
    stickyPagination: true,
  },
  render: (args) => (
    <Box height="400px" overflow="auto">
      <Table {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Table with both sticky header and sticky pagination. Both remain visible when scrolling - the header at the top and the pagination controls at the bottom of the scrollable container. This provides a great user experience for navigating large datasets.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  return (
    <Box height="400px" overflow="auto">
      <Table
        columns={columns}
        data={data}
        pagination
        pageSize={10}
        stickyHeader
        stickyPagination
      />
    </Box>
  );
};`,
      },
    },
  },
};

export const WithExpandableRows: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(10),
    expandableRows: true,
    renderExpandedContent: (row: TableRowData<{ name: string; email: string }>) => (
      <Box padding="16px">
        <Typography>Details for {row.name}</Typography>
        <Typography>Email: {row.email}</Typography>
      </Box>
    ),
  },
  render: (args) => {
    const columnsWithIcon: TableColumn[] = [
      {
        id: 'expand',
        label: 'User',
        render: (row: TableRowData<{ name: string }>) => {
          return (
            <Row alignItems="center" gap="8px">
              <Box className="expand-icon-wrapper">
                <Icon name="arrowRight" size="xs" />
              </Box>
              {row.name}
            </Row>
          );
        },
      },
      ...sampleColumns.slice(1),
    ];

    return (
      <Table
        {...args}
        columns={columnsWithIcon}
        expandableRows={true}
        renderExpandedContent={args.renderExpandedContent}
        styles={{
          '.expand-icon-wrapper svg': {
            transition: 'transform 0.2s ease-in-out',
          },
          'tr[data-expanded="true"] .expand-icon-wrapper svg': {
            transform: 'rotate(90deg)',
          },
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with expandable rows. Click the expand icon in the first column to reveal additional content. The arrow icon indicates the expandable state and rotates when expanded. The `renderExpandedContent` function receives the row data and index, allowing you to render custom content.',
      },
      source: {
        code: `import { Table, TableColumn, TableRowData, Icon, Row, Box, Typography } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  {
    id: 'expand',
    label: 'User',
    render: (row: UserData) => (
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
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = [
  { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'User 2', email: 'user2@example.com', role: 'User', status: 'Inactive' },
  // ... more data
];

const Example = () => {
  return (
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
    />
  );
};`,
      },
    },
  },
};
WithExpandableRows.play = withExpandableRowsActions;

export const WithVirtualization: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(10000),
    virtualized: true,
    rowHeight: 38,
    stickyHeader: true,
  },
  render: (args) => (
    <Box height="700px" overflow="auto">
      <Table {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Table with virtualization for large datasets. Only visible rows are rendered, improving performance with thousands of rows. The `rowHeight` prop determines the height of each row for scroll calculations. Note: When virtualized, pagination is disabled as virtualization handles large datasets. Wrap the table in a container with fixed height and overflow for scrolling to work.',
      },
      source: {
        code: `import { Table, TableColumn, type TableRowData  } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const largeDataset: UserData[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  return (
    <Box height="700px" overflow="auto">
      <Table
        columns={columns}
        data={largeDataset}
        virtualized
        rowHeight={38}
        stickyHeader
      />
    </Box>
  );
};`,
      },
    },
  },
};
WithVirtualization.play = withVirtualizationActions;

export const EmptyState: Story = {
  args: {
    columns: sampleColumns,
    data: [],
    emptyState: (
      <Box padding="40px">
        <Typography variant="h5" align="center">
          No data available
        </Typography>
      </Box>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with empty state. When the data array is empty, the `emptyState` prop content is displayed instead of the table body. Use this to provide helpful messaging when no data is available.',
      },
      source: {
        code: `import { Table, TableColumn, TableRowData, Box, Typography } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const Example = () => {
  const data: UserData[] = []; // Empty data

  return (
    <Table
      columns={columns}
      data={data}
      emptyState={
        <Box padding="40px">
          <Typography variant="h5" align="center">
            No data available
          </Typography>
        </Box>
      }
    />
  );
};`,
      },
    },
  },
};
EmptyState.play = emptyStateActions;

export const WithLoadingState: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(10),
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState(false);

    const loadingState = (
      <Box padding="16px">
        <Column gap="12px">
          {Array.from({ length: 5 }).map((_, index) => (
            <Row key={index} gap="1%" alignItems="center">
              <Skeleton variant="rounded" width="15%" height="28px" />
              <Skeleton variant="rounded" width="34%" height="28px" />
              <Skeleton variant="rounded" width="29%" height="28px" />
              <Skeleton variant="rounded" width="19%" height="28px" />
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
        <Table {...args} loading={isLoading} loadingState={loadingState} />
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with loading state using Skeleton loaders. When `loading` is true, the `loadingState` prop content is displayed instead of the table content. Use Skeleton components to create a loading placeholder that matches the table structure.',
      },
      source: {
        code: `import { useState } from 'react';
import { Table, TableColumn, TableRowData, Skeleton, Row, Box, Column, Button } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = [
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
          <Row key={index} gap="1%" alignItems="center">
            <Skeleton variant="rounded" width="15%" height="28px" />
            <Skeleton variant="rounded" width="34%" height="28px" />
            <Skeleton variant="rounded" width="29%" height="28px" />
            <Skeleton variant="rounded" width="19%" height="28px" />
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
      },
    },
  },
};
WithLoadingState.play = withLoadingStateActions;

export const WithCustomHeader: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(30),
    stickyHeader: true,
  },
  render: (args) => {
    const renderCustomHeader = (columns: TableColumn<TableRowData>[]) => (
      <>
        <TableRow isHeader>
          <TableHeaderCell colSpan={columns.length}>
            <Typography variant="h6" align="center">
              Custom Header Row - All Columns
            </Typography>
          </TableHeaderCell>
        </TableRow>
        <TableRow isHeader>
          {columns.map((column) => (
            <TableHeaderCell key={column.id}>{column.label}</TableHeaderCell>
          ))}
        </TableRow>
      </>
    );

    return <Table {...args} renderHeader={renderCustomHeader} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with custom header rendering. Use the `renderHeader` prop to provide a custom header implementation. When provided, it replaces the default header. The function receives the columns array as a parameter.',
      },
      source: {
        code: `import { Table, TableColumn, TableRowData, TableRow, TableHeaderCell } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
];

const data: UserData[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
];

const Example = () => {
  const renderCustomHeader = (columns: TableColumn[]) => (
    <>
      <TableRow>
        <TableHeaderCell  colSpan={columns.length}>
          <Typography variant="h6" align="center">
            Custom Header Row - All Columns
          </Typography>
        </TableHeaderCell>
      </TableRow>
      <TableRow>
        {columns.map((column) => (
          <TableHeaderCell key={column.id} align={column.align}>
            {column.label}
          </TableHeaderCell>
        ))}
      </TableRow>
    </>
  );

  return (
    <Table
      columns={columns}
      data={data}
      renderHeader={renderCustomHeader}
      stickyHeader
    />
  );
};`,
      },
    },
  },
};
WithCustomHeader.play = withCustomHeaderActions;

export const WithScrollMethods: Story = {
  args: {
    columns: sampleColumns,
    data: generateSampleData(300),
    stickyHeader: true,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tableRef = useRef<TableRef>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [targetRow, setTargetRow] = useState(50);

    return (
      <Box>
        <Row gap="10px" marginBottom="16px">
          <Button
            variant="secondary"
            onClick={() => {
              tableRef.current?.scrollToTop?.();
            }}
          >
            Scroll to Top
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              tableRef.current?.scrollToBottom?.();
            }}
          >
            Scroll to Bottom
          </Button>
          <Input
            variant="number"
            min="0"
            max="300"
            value={targetRow.toString()}
            aria-label="Target row for scrolling"
            onChange={(e) => setTargetRow(+e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              tableRef.current?.scrollToRow?.(targetRow);
            }}
          >
            Scroll to Row {targetRow}
          </Button>
        </Row>
        <Box height="428px" overflow="auto">
          <Table {...args} stickyHeader={false} ref={tableRef} />
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with scroll methods. Use the `ref` prop to access scroll methods: `scrollToTop()`, `scrollToBottom()`, and `scrollToRow(index)`. The table must be wrapped in a container with fixed height and overflow for scrolling to work.',
      },
      source: {
        code: `import { useRef, useState } from 'react';
import { Table, TableColumn, TableRowData, TableRef, Button, Input, Row, Box } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
  { id: 'status', label: 'Status', accessor: 'status' },
];

const data: UserData[] = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: ['Active', 'Inactive'][i % 2],
}));

const Example = () => {
  const tableRef = useRef<TableRef>(null);
  const [targetRow, setTargetRow] = useState(50);

  return (
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
          aria-label="Target row for scrolling"
          value={targetRow.toString()}
          onChange={(e) => setTargetRow(+e.target.value)}
        />
        <Button variant="outlined" onClick={() => tableRef.current?.scrollToRow?.(targetRow)}>
          Scroll to Row {targetRow}
        </Button>
      </Row>
      <Box height="428px" overflow="auto">
        <Table columns={columns} data={data} ref={tableRef} stickyHeader={false} />
      </Box>
    </Box>
  );
};`,
      },
    },
  },
};
WithScrollMethods.play = withScrollMethodsActions;

export const WithCustomCellRenderers: Story = {
  render: () => {
    interface UserData extends TableRowData {
      id: number;
      name: string;
      email: string;
      role: string;
      status: string;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeSwitch, setActiveSwitch] = useState<Record<string, boolean | unknown>>({});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeCheck, setActiveCheck] = useState<Record<string, boolean | unknown>>({});

    const columnsWithControls = [
      {
        id: 'name',
        label: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        label: 'Email',
        accessor: 'email',
      },
      {
        id: 'active',
        label: 'Active',
        render: ({ id }: UserData) => {
          return (
            <Row>
              <Switch
                checked={!!activeSwitch[id]}
                onValueChange={(newValue) => setActiveSwitch((prop) => ({ ...prop, [id]: newValue }))}
              />
            </Row>
          );
        },
      },
      {
        id: 'notifications',
        label: 'Notifications',
        render: (row: UserData) => {
          return (
            <Box alignItems="center">
              <Input
                variant="checkbox"
                checked={!!activeCheck[row.id]}
                onChange={(e) => {
                  setActiveCheck((prop) => ({ ...prop, [row.id]: (e.target as HTMLInputElement).checked }));
                }}
              />
            </Box>
          );
        },
      },
    ];

    return <Table columns={columnsWithControls} data={generateSampleData(10)} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Table with custom cell renderers using Switch and Checkbox components. Each row has interactive controls that can be toggled independently. The Switch component is used for the "Active" column, and the Checkbox (Input variant) is used for the "Notifications" column.',
      },
      source: {
        code: `import { useState } from 'react';
import { Table, TableColumn, TableRowData, Switch, Input, Row, Box } from 'gd-design-library';

interface UserData extends TableRowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const data: UserData[] = [
  { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'User 2', email: 'user2@example.com', role: 'User', status: 'Inactive' },
  // ... more data
];

const Example = () => {
  const [activeSwitch, setActiveSwitch] = useState<Record<string | number, boolean>>({});
  const [activeCheck, setActiveCheck] = useState<Record<string | number, boolean>>({});

  const columns: TableColumn[] = [
    { id: 'name', label: 'Name', accessor: 'name' },
    { id: 'email', label: 'Email', accessor: 'email' },
    {
      id: 'active',
      label: 'Active',
      render: (row) => {
        return (
          <Row>
            <Switch
              checked={!!activeSwitch[row.id]}
              onValueChange={(newValue) =>
                setActiveSwitch((prev) => ({ ...prev, [row.id]: newValue }))
              }
            />
          </Row>
        );
      },
    },
    {
      id: 'notifications',
      label: 'Notifications',
      render: (row) => {
        return (
          <Box alignItems="center">
            <Input
              variant="checkbox"
              checked={!!activeCheck[row.id]}
              onChange={(e) => {
                setActiveCheck((prev) => ({
                  ...prev,
                  [row.id]: (e.target as HTMLInputElement).checked,
                }));
              }}
            />
          </Box>
        );
      },
    },
  ];

  return <Table columns={columns} data={data} />;
};`,
      },
    },
  },
};
WithCustomCellRenderers.play = withCustomCellRenderersActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ table: defaultTheme.table }} />;
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'View the default theme tokens used by the Table component. These tokens control styling for table headers, cells, rows, pagination, and sticky positioning.',
    },
  },
};
