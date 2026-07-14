import { within, userEvent, expect, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { clickInput, waitForElementToAppear, waitForElementToDisappear } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>, documentBody?: ReturnType<typeof within>) => ({
  table: () => canvas.getByTestId('Table'),
  tableRows: () => canvas.getAllByRole('row'),
  tableHeaders: () => canvas.getAllByRole('columnheader'),
  tableCells: () => canvas.getAllByRole('cell'),
  // Pagination
  paginationContainer: () => canvas.queryByTestId('TablePagination-right-section'),
  previousButton: () => canvas.queryByTestId('TablePagination-btn-page-prev'),
  nextButton: () => canvas.queryByTestId('TablePagination-btn-page-next'),
  pageButton: (pageNum: number) => canvas.queryByRole('button', { name: new RegExp(`^${pageNum}$`) }),
  pageSizeOptions: () => canvas.queryByTestId('TablePagination-left-section'),
  pageSizeOption: (name: string) =>
    canvas.queryAllByTestId('TablePagination-btn-per-page').find((item: HTMLElement) => item.textContent === name),
  // Expandable rows
  expandIcons: () => canvas.queryAllByTestId('Icon-arrowRight'),
  // Loading/Empty
  loadingButton: () => canvas.queryByRole('button', { name: /loading/i }),
  emptyStateMessage: () => canvas.queryByText(/no data available/i),
  // Scroll methods
  scrollToTopButton: () => canvas.queryByRole('button', { name: /scroll to top/i }),
  scrollToBottomButton: () => canvas.queryByRole('button', { name: /scroll to bottom/i }),
  scrollToRowButton: () => canvas.queryByRole('button', { name: /scroll to row/i }),
  rowInput: () => canvas.getByTestId('Input'),
  // Custom cells
  switches: () => canvas.queryAllByTestId('Switch'),
  switchCheckboxes: () => canvas.queryAllByTestId('Switch-checkbox'),
  checkboxes: () => canvas.queryAllByTestId('Input'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table element', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });

  await step('Should render table headers', async () => {
    const headers = locators.tableHeaders();
    expect(headers).toHaveLength(4);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Email');
    expect(headers[2]).toHaveTextContent('Role');
    expect(headers[3]).toHaveTextContent('Status');
  });

  await step('Should render table rows with data', async () => {
    const rows = locators.tableRows();
    // 1 header row + 10 data rows
    expect(rows.length).toBeGreaterThanOrEqual(10);

    // Check first data row content
    const cells = locators.tableCells();
    expect(cells[0]).toHaveTextContent('User 1');
    expect(cells[1]).toHaveTextContent('user1@example.com');
    expect(cells[2]).toHaveTextContent('Admin');
    expect(cells[3]).toHaveTextContent('Active');
  });

  await step('Should render footer content', async () => {
    const footer = canvas.getByText(/this is the footer content/i);
    expect(footer).toBeInTheDocument();
    expect(footer).toBeVisible();
  });
};

export const withPaginationActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render pagination controls', async () => {
    const paginationContainer = locators.paginationContainer();
    expect(paginationContainer).toBeInTheDocument();
    expect(paginationContainer).toHaveTextContent(/Showing 1–10 of 50/i);
  });

  await step('Should render page size selector', async () => {
    const pageSizeSelect = locators.pageSizeOptions();
    expect(pageSizeSelect).toBeInTheDocument();
  });

  await step('Should render navigation buttons', async () => {
    const previousButton = locators.previousButton();
    const nextButton = locators.nextButton();

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Previous button should be disabled on first page
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  await step('Should render page number buttons', async () => {
    const page1Button = locators.pageButton(1);
    const page2Button = locators.pageButton(2);
    const page3Button = locators.pageButton(3);

    expect(page1Button).toBeInTheDocument();
    expect(page2Button).toBeInTheDocument();
    expect(page3Button).toBeInTheDocument();
  });

  await step('Should navigate to next page', async () => {
    const nextButton = locators.nextButton();
    await clickInput(nextButton);

    const page2Button = locators.pageButton(2);
    expect(page2Button).toHaveClass('active');

    const paginationContainer = locators.paginationContainer();
    expect(paginationContainer).toHaveTextContent(/Showing 11–20 of 50/i);
  });

  await step('Should enable previous button on page 2', async () => {
    const previousButton = locators.previousButton();
    expect(previousButton).not.toBeDisabled();
  });

  await step('Should navigate to specific page via button', async () => {
    const page3Button = locators.pageButton(3);
    await clickInput(page3Button);

    expect(page3Button).toHaveClass('active');

    const paginationContainer = locators.paginationContainer();
    expect(paginationContainer).toHaveTextContent(/Showing 21–30 of 50/i);
  });

  await step('Should navigate to previous page', async () => {
    const previousButton = locators.previousButton();
    await clickInput(previousButton);

    const page2Button = locators.pageButton(2);
    expect(page2Button).toHaveClass('active');

    const paginationContainer = locators.paginationContainer();
    expect(paginationContainer).toHaveTextContent(/Showing 11–20 of 50/i);
  });

  await step('Should display page size option items', async () => {
    const option1 = locators.pageSizeOption('10');
    const option2 = locators.pageSizeOption('25');
    const option3 = locators.pageSizeOption('50');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
  });

  await step('Should change page size', async () => {
    const option1 = locators.pageSizeOption('25');
    await clickInput(option1);

    const paginationContainer = locators.paginationContainer();
    expect(paginationContainer).toHaveTextContent(/Showing 1–25 of 50/i);
  });
};

export const withStickyHeaderActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render table headers', async () => {
    const headers = locators.tableHeaders();
    expect(headers).toHaveLength(4);
    expect(headers[0]).toHaveTextContent('Name');
  });

  await step('Should render multiple data rows', async () => {
    const rows = locators.tableRows();
    // Header + 30 data rows
    expect(rows.length).toBeGreaterThanOrEqual(30);
  });
};

export const withStickyFooterActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render footer content', async () => {
    const footer = canvas.getByText(/this is the footer content/i);
    expect(footer).toBeInTheDocument();
    expect(footer).toBeVisible();
  });

  await step('Should render multiple data rows', async () => {
    const rows = locators.tableRows();
    expect(rows.length).toBeGreaterThanOrEqual(30);
  });
};

export const withColumnWidthsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render all columns', async () => {
    const headers = locators.tableHeaders();
    expect(headers).toHaveLength(4);
  });

  await step('Should render data rows', async () => {
    const cells = locators.tableCells();
    expect(cells.length).toBeGreaterThan(0);
    expect(cells[0]).toHaveTextContent('User 1');
  });
};

export const withStickyHeaderAndFooterActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render sticky header', async () => {
    const headers = locators.tableHeaders();
    expect(headers).toHaveLength(4);
  });

  await step('Should render sticky footer', async () => {
    const footer = canvas.getByText(/this is the footer content/i);
    expect(footer).toBeInTheDocument();
  });

  await step('Should render data rows', async () => {
    const rows = locators.tableRows();
    expect(rows.length).toBeGreaterThanOrEqual(30);
  });
};

export const withExpandableRowsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render expandable row indicators', async () => {
    const rows = locators.tableRows();
    // Should have header + data rows
    expect(rows.length).toBeGreaterThan(1);

    // Check for expand icons in first column
    const expandIcon = locators.expandIcons()[0];
    expect(expandIcon).toBeInTheDocument();
    expect(expandIcon).toBeVisible();
  });

  await step('Should expand row on click', async () => {
    const rows = locators.tableRows();
    const firstDataRow = rows[1];

    // Click the first row to expand
    await userEvent.click(firstDataRow);

    // Wait for expanded content to appear
    await waitFor(() => {
      const expandedContent = canvas.getByText(/details for user 1/i);
      expect(expandedContent).toBeInTheDocument();
      expect(expandedContent).toBeVisible();
    });
  });

  await step('Should display expanded content', async () => {
    const expandedContent = canvas.getByText(/details for user 1/i);
    const emailInExpanded = canvas.getByText(/email: user1@example.com/i);

    expect(expandedContent).toBeVisible();
    expect(emailInExpanded).toBeVisible();
  });

  await step('Should collapse row on second click', async () => {
    const rows = locators.tableRows();
    const firstDataRow = rows[1];

    // Click again to collapse
    await userEvent.click(firstDataRow);

    // Wait for expanded content to disappear
    await waitFor(() => {
      const expandedContent = canvas.queryByText(/details for user 1/i);
      expect(expandedContent).not.toBeInTheDocument();
    });
  });

  await step('Should expand multiple rows independently', async () => {
    const rows = locators.tableRows();

    // Expand first row
    await userEvent.click(rows[1]);
    await waitFor(() => {
      expect(canvas.getByText(/details for user 1/i)).toBeInTheDocument();
    });

    // Expand second row
    await userEvent.click(rows[2]);
    await waitFor(() => {
      expect(canvas.getByText(/details for user 2/i)).toBeInTheDocument();
      expect(canvas.getByText(/details for user 2/i)).toBeVisible();
    });

    // Both should be expanded
    expect(canvas.getByText(/details for user 1/i)).toBeInTheDocument();
    expect(canvas.getByText(/details for user 1/i)).toBeVisible();
    expect(canvas.getByText(/details for user 2/i)).toBeInTheDocument();
    expect(canvas.getByText(/details for user 2/i)).toBeVisible();
  });
};

export const withVirtualizationActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render virtualized table', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render table headers', async () => {
    const headers = locators.tableHeaders();
    expect(headers).toHaveLength(4);
  });

  await step('Should render limited rows (virtualized)', async () => {
    const rows = locators.tableRows();
    // With virtualization, only visible rows + buffer are rendered
    // Should be much less than 10000 total rows
    expect(rows.length).toBeLessThan(100);
  });

  await step('Should display first visible rows', async () => {
    const cells = locators.tableCells();
    expect(cells.length).toBeGreaterThan(0);
    // First row should be User 1
    expect(cells[0]).toHaveTextContent('User 1');
  });
};

export const emptyStateActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should NOT render table body', async () => {
    const emptyState = locators.emptyStateMessage();
    expect(emptyState).toBeInTheDocument();
  });

  await step('Should display empty state message', async () => {
    const emptyStateMessage = canvas.getByText(/no data available/i);
    expect(emptyStateMessage).toBeInTheDocument();
    expect(emptyStateMessage).toBeVisible();
  });

  await step('Should NOT render data rows', async () => {
    const cells = canvas.queryAllByRole('cell');
    expect(cells).toHaveLength(0);
  });
};

export const withLoadingStateActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render loading toggle button', async () => {
    const loadingButton = locators.loadingButton();
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toHaveTextContent(/start loading/i);
  });

  await step('Should render table initially', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should toggle to loading state', async () => {
    const loadingButton = locators.loadingButton();
    await clickInput(loadingButton!);

    // Wait for loading state to appear
    await waitFor(() => {
      const skeletons = canvas.getAllByTestId(/skeleton/i);
      expect(skeletons.length).toBeGreaterThan(0);
    });

    expect(loadingButton).toHaveTextContent(/stop loading/i);
  });

  await step('Should display loading skeleton', async () => {
    const skeletons = canvas.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
    // Should have multiple skeleton rows (5 rows × 4 cells = 20 skeletons)
    expect(skeletons.length).toBeGreaterThanOrEqual(15);
  });

  await step('Should NOT display table when loading', async () => {
    const table = canvas.queryByTestId('Table');
    expect(table).not.toBeInTheDocument();
  });

  await step('Should toggle back to table display', async () => {
    const loadingButton = locators.loadingButton();
    await clickInput(loadingButton!);

    // Wait for table to reappear
    await waitForElementToAppear(() => locators.table());

    expect(loadingButton).toHaveTextContent(/start loading/i);
  });

  await step('Should display table after loading complete', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
};

export const withCustomHeaderActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render custom header row', async () => {
    const customHeaderText = canvas.getByText(/custom header/i);
    expect(customHeaderText).toBeInTheDocument();
    expect(customHeaderText).toBeVisible();
  });

  await step('Should render column headers', async () => {
    const headers = locators.tableHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(4);
  });

  await step('Should render data rows', async () => {
    const cells = locators.tableCells();
    expect(cells.length).toBeGreaterThan(0);
  });
};

export const withScrollMethodsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render scroll control buttons', async () => {
    const scrollToTopButton = locators.scrollToTopButton();
    const scrollToBottomButton = locators.scrollToBottomButton();
    const scrollToRowButton = locators.scrollToRowButton();

    expect(scrollToTopButton).toBeInTheDocument();
    expect(scrollToBottomButton).toBeInTheDocument();
    expect(scrollToRowButton).toBeInTheDocument();
  });

  await step('Should render row input field', async () => {
    const rowInput = locators.rowInput();
    expect(rowInput).toBeInTheDocument();
    expect(rowInput).toHaveValue(50);
  });

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should update row input value', async () => {
    const rowInput = locators.rowInput();
    await userEvent.clear(rowInput);
    await userEvent.type(rowInput, '100');

    expect(rowInput).toHaveValue(100);
  });

  await step('Should have functional scroll buttons', async () => {
    const scrollToTopButton = locators.scrollToTopButton();
    const scrollToBottomButton = locators.scrollToBottomButton();
    const scrollToRowButton = locators.scrollToRowButton();

    // Buttons should be clickable
    expect(scrollToTopButton).toBeEnabled();
    expect(scrollToBottomButton).toBeEnabled();
    expect(scrollToRowButton).toBeEnabled();
  });
};

export const withCustomCellRenderersActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render table with data', async () => {
    const table = locators.table();
    expect(table).toBeInTheDocument();
  });

  await step('Should render table headers', async () => {
    const headers = locators.tableHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(4);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Email');
    expect(headers[2]).toHaveTextContent('Active');
    expect(headers[3]).toHaveTextContent('Notifications');
  });

  await step('Should render Switch components in Active column', async () => {
    const switches = locators.switches();
    expect(switches).toHaveLength(10);
  });

  await step('Should render Checkbox components in Notifications column', async () => {
    const checkboxes = locators.checkboxes();
    expect(checkboxes).toHaveLength(10);
  });

  await step('Should toggle first switch', async () => {
    const switches = locators.switches();
    const firstSwitch = switches[0];
    const firstSwitchCheckbox = locators.switchCheckboxes()[0];

    expect(firstSwitchCheckbox).not.toBeChecked();

    await clickInput(firstSwitch);

    await waitFor(() => {
      expect(firstSwitchCheckbox).toBeChecked();
    });
  });

  await step('Should toggle first checkbox', async () => {
    const checkboxes = locators.checkboxes();
    const firstCheckbox = checkboxes[0];

    expect(firstCheckbox).not.toBeChecked();

    await clickInput(firstCheckbox);

    await waitFor(() => {
      expect(firstCheckbox).toBeChecked();
    });
  });

  await step('Should toggle multiple switches independently', async () => {
    const switches = locators.switches();
    const switchCheckboxes = locators.switchCheckboxes();

    // Toggle second switch
    await clickInput(switches[1]);
    await waitFor(() => {
      expect(switchCheckboxes[1]).toBeChecked();
    });

    // Toggle third switch
    await clickInput(switches[2]);
    await waitFor(() => {
      expect(switchCheckboxes[2]).toBeChecked();
    });

    // First switch should still be checked
    expect(switchCheckboxes[0]).toBeChecked();
  });

  await step('Should toggle multiple checkboxes independently', async () => {
    const checkboxes = locators.checkboxes();

    // Toggle second checkbox
    await clickInput(checkboxes[1]);
    await waitFor(() => {
      expect(checkboxes[1]).toBeChecked();
    });

    // Toggle third checkbox
    await clickInput(checkboxes[2]);
    await waitFor(() => {
      expect(checkboxes[2]).toBeChecked();
    });

    // First checkbox should still be checked
    expect(checkboxes[0]).toBeChecked();
  });
};
