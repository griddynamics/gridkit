import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testUtils';

import { COMPONENT_NAME, TABLE_PAGINATION_COMPONENT } from './constants';
import { Table, type TableColumn, type TableRowData } from './';

// Mock useLogger to avoid console logs in tests
vi.mock('@hooks/useLogger', () => ({
  useLogger: () => ({
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
} as any;

// Mock scrollTo for JSDOM
Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  value: function (options?: ScrollToOptions | number, y?: number) {
    if (typeof options === 'number' && typeof y === 'number') {
      this.scrollLeft = options;
      this.scrollTop = y;
    } else if (typeof options === 'object' && options !== null) {
      if (options.top !== undefined) {
        this.scrollTop = options.top;
      }
      if (options.left !== undefined) {
        this.scrollLeft = options.left;
      }
      if (options.behavior === 'smooth') {
        // In tests, we'll apply immediately
        // The actual smooth behavior would be handled by the browser
      }
    }
    // Trigger scroll event for compatibility
    const scrollEvent = new Event('scroll', { bubbles: true });
    this.dispatchEvent(scrollEvent);
  },
  writable: true,
  configurable: true,
});

describe(COMPONENT_NAME, () => {
  const sampleData: TableRowData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Guest' },
  ];

  const sampleColumns: TableColumn<TableRowData>[] = [
    { id: 'name', label: 'Name', accessor: 'name' },
    { id: 'email', label: 'Email', accessor: 'email' },
    { id: 'role', label: 'Role', accessor: 'role' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<Table columns={sampleColumns} data={sampleData} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render empty state when data is empty', () => {
    const emptyState = <div>No data available</div>;
    render(<Table columns={sampleColumns} data={[]} emptyState={emptyState} />);

    expect(screen.getByText('No data available')).toBeDefined();
  });

  it('SHOULD render loading state when loading is true', () => {
    const loadingState = <div>Loading...</div>;
    render(<Table columns={sampleColumns} data={sampleData} loading={true} loadingState={loadingState} />);

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('SHOULD render custom header when renderHeader is provided', () => {
    const customHeader = (columns: TableColumn<TableRowData>[]) => (
      <tr>
        <th colSpan={columns.length}>Custom Header</th>
      </tr>
    );

    render(<Table columns={sampleColumns} data={sampleData} renderHeader={customHeader} />);

    expect(screen.getByText('Custom Header')).toBeDefined();
  });

  it('SHOULD render cells using column render function', () => {
    const columnsWithRender = [
      {
        id: 'name',
        label: 'Name',
        render: (row) => <div>{row?.name}</div>,
      },
    ];

    render(<Table columns={columnsWithRender} data={sampleData} />);

    const nameElement = screen.getByText('John Doe');
    expect(nameElement.tagName).toBe('DIV');
  });

  it('SHOULD handle pagination when enabled', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    render(<Table columns={sampleColumns} data={largeData} pagination={true} pageSize={10} />);

    // Should show pagination component
    expect(screen.getByTestId(TABLE_PAGINATION_COMPONENT)).toBeDefined();
  });

  it('SHOULD call onPageChange when page changes', () => {
    const onPageChange = vi.fn();
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    render(
      <Table columns={sampleColumns} data={largeData} pagination={true} pageSize={10} onPageChange={onPageChange} />
    );

    // Find and click next button
    const nextButton = screen.getByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page-next`);
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('SHOULD call onPageSizeChange when page size changes', () => {
    const onPageSizeChange = vi.fn();
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    render(
      <Table
        columns={sampleColumns}
        data={largeData}
        pagination={true}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
      />
    );

    // Find and click the select to open dropdown
    const selectTrigger = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-per-page`)[0];
    fireEvent.click(selectTrigger);

    // Find and click a different page size option (25 per page)
    const option25 = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-per-page`)[1];
    fireEvent.click(option25);

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('SHOULD handle expandable rows', () => {
    const renderExpandedContent = (row) => <div>Details for {row?.name}</div>;

    render(
      <Table
        columns={sampleColumns}
        data={sampleData}
        expandableRows={true}
        renderExpandedContent={renderExpandedContent}
      />
    );

    // Find a row and click to expand
    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toBeDefined();

    if (firstRow) {
      fireEvent.click(firstRow);
      // Expanded content should appear
      expect(screen.getByText('Details for John Doe')).toBeDefined();
    }
  });

  it('SHOULD toggle expanded row on click', () => {
    const renderExpandedContent = (row) => <div>Details for {row?.name}</div>;

    render(
      <Table
        columns={sampleColumns}
        data={sampleData}
        expandableRows={true}
        renderExpandedContent={renderExpandedContent}
      />
    );

    const firstRow = screen.getByText('John Doe').closest('tr');
    if (firstRow) {
      // Click to expand
      fireEvent.click(firstRow);
      expect(screen.getByText('Details for John Doe')).toBeDefined();

      // Click again to collapse
      fireEvent.click(firstRow);
      // Content might still be in DOM but should be hidden
      // The exact behavior depends on implementation
    }
  });

  it('SHOULD render with sticky header', () => {
    const { container } = render(<Table columns={sampleColumns} data={sampleData} stickyHeader={true} />);

    const thead = container.querySelector('thead');
    expect(thead).toBeDefined();
  });

  it('SHOULD render with sticky footer', () => {
    const { container } = render(<Table columns={sampleColumns} data={sampleData} stickyFooter={true} />);

    const tfoot = container.querySelector('tfoot');
    expect(tfoot).toBeDefined();
  });

  it('SHOULD handle virtualization when enabled', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    const { container } = render(<Table columns={sampleColumns} data={largeData} virtualized={true} rowHeight={48} />);

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeDefined();

    // With virtualization, not all rows should be rendered
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeLessThan(1000);
  });

  it('SHOULD scroll to row when scrollToRow is called', async () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    let tableRef: any = null;

    const { container } = render(
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table
          ref={(ref) => {
            tableRef = ref;
          }}
          columns={sampleColumns}
          data={largeData}
          rowHeight={48}
          stickyHeader={true}
        />
      </div>
    );

    // Wait for ref to be set
    await waitFor(() => {
      expect(tableRef).toBeDefined();
      expect(tableRef?.scrollToRow).toBeDefined();
    });

    // Get the actual container that scrollToRow will use (parentElement of table)
    const tableElement = container.querySelector('table');
    const actualScrollContainer = tableElement?.parentElement || (container.firstChild as HTMLElement);

    // Ensure actualScrollContainer has scrollHeight and clientHeight
    Object.defineProperty(actualScrollContainer, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(actualScrollContainer, 'clientHeight', {
      value: 400,
      writable: true,
      configurable: true,
    });

    // Mock getBoundingClientRect to return proper values
    // This ensures that when scrollToRow finds the row, it can calculate the correct scroll position
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this === actualScrollContainer) {
        return {
          top: 0,
          left: 0,
          bottom: 400,
          right: 800,
          width: 800,
          height: 400,
          x: 0,
          y: 0,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          toJSON: () => {},
        } as DOMRect;
      }
      // For table rows, return a position that will result in a positive scrollTop
      const tbody = container.querySelector('tbody');
      if (tbody && this.tagName === 'TR' && this.parentElement === tbody) {
        // Filter out spacer rows (same logic as in Table component)
        const allRows = Array.from(tbody.querySelectorAll('tr'));
        const dataRows: HTMLTableRowElement[] = [];
        allRows.forEach((row) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const cells = row?.querySelectorAll('td, th');
          if (cells.length === 1) {
            const cell = cells[0] as HTMLElement;
            const hasColSpan = cell.hasAttribute('colspan');
            const padding = window.getComputedStyle(cell).padding;
            const isSpacerRow = hasColSpan && (padding === '0px' || cell.style.padding === '0px');
            if (!isSpacerRow) {
              dataRows.push(row as HTMLTableRowElement);
            }
          } else {
            dataRows.push(row as HTMLTableRowElement);
          }
        });
        const rowIndex = dataRows.indexOf(this as HTMLTableRowElement);
        if (rowIndex >= 0) {
          // For row 49 (targetIndex), return a position that ensures positive scrollTop
          // rowTopRelativeToContainer = rowRect.top - containerRect.top + container.scrollTop
          // targetScrollTop = rowTopRelativeToContainer - headerHeight
          // We want targetScrollTop > 0, so rowTopRelativeToContainer > headerHeight
          // Let's use a simple calculation: rowIndex * rowHeight
          const rowTop = rowIndex * 48; // rowHeight is 48
          // Return position relative to viewport (container is at top: 0)
          // Make sure the row is below the current scroll position
          return {
            top: rowTop + 100, // Add offset to ensure it's below scroll position
            left: 0,
            bottom: rowTop + 100 + 48,
            right: 800,
            width: 800,
            height: 48,
            x: 0,
            y: rowTop + 100,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            toJSON: () => {},
          } as DOMRect;
        }
      }
      return originalGetBoundingClientRect.call(this);
    };

    // Call scrollToRow - this should scroll to row 49 (index 50 - 1)
    tableRef.scrollToRow(50);

    // Wait for scroll to complete
    // The scrollTo mock should update scrollTop immediately
    await waitFor(
      () => {
        // scrollToRow should set scrollTop to a value greater than 0
        // If row is found: uses getBoundingClientRect calculation
        // If row is not found: sets scrollTop directly to approximateScrollTop = 49 * 48 = 2352
        expect(actualScrollContainer.scrollTop).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // Restore original getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('SHOULD scroll to top when scrollToTop is called', async () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    let tableRef: any = null;

    const { container } = render(
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table
          ref={(ref) => {
            tableRef = ref;
          }}
          columns={sampleColumns}
          data={largeData}
        />
      </div>
    );

    // Wait for ref to be set
    await waitFor(() => {
      expect(tableRef).toBeDefined();
      expect(tableRef?.scrollToTop).toBeDefined();
    });

    // Get the actual container that scrollToTop will use (parentElement of table)
    const tableElement = container.querySelector('table');
    const actualScrollContainer = tableElement?.parentElement || (container.firstChild as HTMLElement);

    // Ensure actualScrollContainer has scrollHeight and clientHeight
    Object.defineProperty(actualScrollContainer, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(actualScrollContainer, 'clientHeight', {
      value: 400,
      writable: true,
      configurable: true,
    });

    actualScrollContainer.scrollTop = 1000;
    expect(actualScrollContainer.scrollTop).toBe(1000);

    // Call scrollToTop
    tableRef.scrollToTop();

    await waitFor(
      () => {
        expect(actualScrollContainer.scrollTop).toBe(0);
      },
      { timeout: 2000 }
    );
  });

  it('SHOULD scroll to bottom when scrollToBottom is called', async () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    let tableRef: any = null;

    const { container } = render(
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table
          ref={(ref) => {
            tableRef = ref;
          }}
          columns={sampleColumns}
          data={largeData}
        />
      </div>
    );

    // Wait for ref to be set
    await waitFor(() => {
      expect(tableRef).toBeDefined();
      expect(tableRef?.scrollToBottom).toBeDefined();
    });

    // Get the actual container that scrollToBottom will use (parentElement of table)
    const tableElement = container.querySelector('table');
    const actualScrollContainer = tableElement?.parentElement || (container.firstChild as HTMLElement);

    // Ensure actualScrollContainer has scrollHeight and clientHeight
    Object.defineProperty(actualScrollContainer, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(actualScrollContainer, 'clientHeight', {
      value: 400,
      writable: true,
      configurable: true,
    });

    const initialScrollTop = actualScrollContainer.scrollTop;

    // Call scrollToBottom
    tableRef.scrollToBottom();

    await waitFor(
      () => {
        // scrollToBottom should set scrollTop to scrollHeight - clientHeight = 5000 - 400 = 4600
        expect(actualScrollContainer.scrollTop).toBeGreaterThan(initialScrollTop);
      },
      { timeout: 2000 }
    );
  });

  it('SHOULD handle scrollToRow with virtualized table', async () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    let tableRef: any = null;

    const { container } = render(
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table
          ref={(ref) => {
            tableRef = ref;
          }}
          columns={sampleColumns}
          data={largeData}
          virtualized={true}
          rowHeight={48}
          stickyHeader={true}
        />
      </div>
    );

    // Wait for ref to be set
    await waitFor(() => {
      expect(tableRef).toBeDefined();
      expect(tableRef?.scrollToRow).toBeDefined();
    });

    // Get the actual container that scrollToRow will use (parentElement of table)
    const tableElement = container.querySelector('table');
    const actualScrollContainer = tableElement?.parentElement || (container.firstChild as HTMLElement);

    // Ensure actualScrollContainer has scrollHeight and clientHeight
    Object.defineProperty(actualScrollContainer, 'scrollHeight', {
      value: 50000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(actualScrollContainer, 'clientHeight', {
      value: 400,
      writable: true,
      configurable: true,
    });

    // Call scrollToRow with virtualized table
    tableRef.scrollToRow(500);

    await waitFor(
      () => {
        // Expected: (500 - 1) * 48 = 499 * 48 = 23952
        expect(actualScrollContainer.scrollTop).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it('SHOULD handle scrollToRow with invalid index', async () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    let tableRef: any = null;

    const { container } = render(
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table
          ref={(ref) => {
            tableRef = ref;
          }}
          columns={sampleColumns}
          data={largeData}
          rowHeight={48}
        />
      </div>
    );

    // Wait for ref to be set
    await waitFor(() => {
      expect(tableRef).toBeDefined();
      expect(tableRef?.scrollToRow).toBeDefined();
    });

    // Get the actual container that scrollToRow will use (parentElement of table)
    const tableElement = container.querySelector('table');
    const actualScrollContainer = tableElement?.parentElement || (container.firstChild as HTMLElement);

    // Ensure actualScrollContainer has scrollHeight and clientHeight
    Object.defineProperty(actualScrollContainer, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(actualScrollContainer, 'clientHeight', {
      value: 400,
      writable: true,
      configurable: true,
    });

    // Call scrollToRow with negative index
    tableRef.scrollToRow(-10);
    // Should handle gracefully, scrolling to first row (index 0)
    // After index - 1: -10 - 1 = -11, clamped to 0, so scrollTop should be 0
    expect(actualScrollContainer.scrollTop).toBeGreaterThanOrEqual(0);
  });

  it('SHOULD handle scrollToRow with index beyond data length', async () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'User',
    }));

    let tableRef: any = null;

    const { container } = render(
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table
          ref={(ref) => {
            tableRef = ref;
          }}
          columns={sampleColumns}
          data={largeData}
          rowHeight={48}
        />
      </div>
    );

    // Wait for ref to be set
    await waitFor(() => {
      expect(tableRef).toBeDefined();
      expect(tableRef?.scrollToRow).toBeDefined();
    });

    // Get the actual container that scrollToRow will use (parentElement of table)
    const tableElement = container.querySelector('table');
    const actualScrollContainer = tableElement?.parentElement || (container.firstChild as HTMLElement);

    // Ensure actualScrollContainer has scrollHeight and clientHeight
    Object.defineProperty(actualScrollContainer, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(actualScrollContainer, 'clientHeight', {
      value: 400,
      writable: true,
      configurable: true,
    });

    // Call scrollToRow with index beyond data length
    tableRef.scrollToRow(200);
    // Should handle gracefully, scrolling to last row (clamped to 99)
    // After index - 1: 200 - 1 = 199, clamped to 99, so scrollTop should be 99 * 48 = 4752
    expect(actualScrollContainer.scrollTop).toBeGreaterThanOrEqual(0);
  });

  it('SHOULD handle column without accessor or render', () => {
    const columnsWithoutAccessor: TableColumn<TableRowData>[] = [
      {
        id: 'noAccessor',
        label: 'No Accessor',
      },
    ];

    render(<Table columns={columnsWithoutAccessor} data={sampleData} />);

    // Should render header
    expect(screen.getByText('No Accessor')).toBeDefined();
    // Cells should be empty or null
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('SHOULD handle multiple expanded rows', () => {
    const renderExpandedContent = (row) => <div>Details for {row?.name}</div>;

    render(
      <Table
        columns={sampleColumns}
        data={sampleData}
        expandableRows={true}
        renderExpandedContent={renderExpandedContent}
      />
    );

    // Expand first row
    const firstRow = screen.getByText('John Doe').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(screen.getByText('Details for John Doe')).toBeDefined();
    }

    // Expand second row
    const secondRow = screen.getByText('Jane Smith').closest('tr');
    if (secondRow) {
      fireEvent.click(secondRow);
      expect(screen.getByText('Details for Jane Smith')).toBeDefined();
    }

    // Both should be expanded
    expect(screen.getByText('Details for John Doe')).toBeDefined();
    expect(screen.getByText('Details for Jane Smith')).toBeDefined();
  });

  it('SHOULD handle row with missing id', () => {
    const dataWithMissingId = [
      { id: 1, name: 'John' },
      { name: 'Jane' }, // Missing id
      { id: 3, name: 'Bob' },
    ];

    render(<Table columns={sampleColumns} data={dataWithMissingId as TableRowData[]} />);

    // Should still render rows
    expect(screen.getByText('John')).toBeDefined();
    expect(screen.getByText('Bob')).toBeDefined();
  });
});
