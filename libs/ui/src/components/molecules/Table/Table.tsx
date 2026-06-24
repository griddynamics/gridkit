'use client';
import {
  useState,
  useMemo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  Fragment,
  type ReactNode,
} from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';

import { COMPONENT_NAME, DEFAULT_PAGE_SIZES } from './constants';
import { TableStyled } from './TableStyled';
import { TableHead, TableBody, TableFooter, TableRow, TableCell, TableHeaderCell, TablePagination } from './';
import type { TableProps, TableRef, TableColumn, TableRowData } from './Table.types';

const getCellValue = <T extends TableRowData>(row: T, column: TableColumn): ReactNode => {
  if (column.render) {
    return column.render(row, 0);
  }
  if (typeof column.accessor === 'string') {
    return row[column.accessor] as ReactNode;
  }
  return null;
};

export const Table = forwardRef<TableRef, TableProps>(
  (
    {
      columns,
      data,
      stickyHeader = false,
      stickyFooter = false,
      stickyPagination = false,
      footer,
      virtualized = false,
      rowHeight = 48,
      expandableRows = false,
      renderExpandedContent,
      pagination = false,
      pageSize = DEFAULT_PAGE_SIZES[0],
      pageSizes = DEFAULT_PAGE_SIZES,
      minVisibleRange = 20,
      onPageChange,
      onPageSizeChange,
      renderHeader,
      emptyState,
      loading = false,
      loadingState,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const tableRef = useRef<HTMLTableElement>(null);
    const bodyRef = useRef<HTMLTableSectionElement>(null);
    const headerRef = useRef<HTMLTableSectionElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
    const visibleRangeRef = useRef({ start: 0, end: 0 });
    const headerHeightRef = useRef(0);

    // Use data as-is, no built-in sorting
    const sortedData = data;

    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;
      const start = currentPage * currentPageSize;
      const end = start + currentPageSize;
      return sortedData.slice(start, end);
    }, [sortedData, currentPage, currentPageSize, pagination]);

    const displayData = virtualized ? sortedData : paginatedData;

    // Calculate visible range for virtualization
    useEffect(() => {
      if (!virtualized) {
        setVisibleRange({ start: 0, end: displayData.length });
        return;
      }

      const calculateVisibleRange = () => {
        const container = tableRef.current?.parentElement;
        if (!container) {
          setVisibleRange({ start: 0, end: Math.min(minVisibleRange, displayData.length) });
          return;
        }

        const scrollTop = container.scrollTop || 0;
        const containerHeight = container.clientHeight;

        // Account for sticky header height when calculating visible range
        const headerHeight = stickyHeader ? headerHeightRef.current : 0;
        const availableHeight = containerHeight - headerHeight;

        const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
        const visibleCount = Math.ceil(availableHeight / rowHeight);
        const end = Math.min(start + visibleCount + 3, displayData.length); // +3 for buffer

        const newRange = { start, end };
        setVisibleRange(newRange);
        visibleRangeRef.current = newRange;
      };

      const container = tableRef.current?.parentElement;
      let resizeObserver = null;

      if (container) {
        calculateVisibleRange();
        container.addEventListener('scroll', calculateVisibleRange);
        resizeObserver = new ResizeObserver(calculateVisibleRange);
        resizeObserver.observe(container);
      }

      return () => {
        container?.removeEventListener('scroll', calculateVisibleRange);
        resizeObserver?.disconnect();
      };
    }, [virtualized, displayData.length, rowHeight, minVisibleRange, stickyHeader]);

    // Helper function to get header height (cached in ref for performance)
    const getHeaderHeight = useCallback((): number => {
      if (!stickyHeader) return 0;

      const thead = headerRef.current || tableRef.current?.querySelector('thead');
      if (!thead) {
        headerHeightRef.current = 0;
        return 0;
      }

      // Get the actual height of the header
      const height = thead.getBoundingClientRect().height;
      headerHeightRef.current = height;
      return height;
    }, [stickyHeader]);

    // Update header height ref when header changes
    useEffect(() => {
      getHeaderHeight();

      // Update on resize
      const resizeObserver = new ResizeObserver(getHeaderHeight);
      const thead = headerRef.current || tableRef.current?.querySelector('thead');
      if (thead) {
        resizeObserver.observe(thead);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, [columns, renderHeader, getHeaderHeight]);

    useImperativeHandle(forwardedRef, () => ({
      ref: tableRef,
      scrollToRow: (index: number) => {
        const container = tableRef.current?.parentElement;
        if (!container) {
          logger.debug(`${COMPONENT_NAME}: Cannot scroll to row - container not found`, { index });
          return;
        }

        // Scroll to index - 1 (if index is 50, scroll to row 49)
        const adjustedIndex = Math.max(0, index - 1);
        const targetIndex = Math.max(0, Math.min(adjustedIndex, displayData.length - 1));
        const tbody = bodyRef.current;

        if (!tbody) {
          logger.debug(`${COMPONENT_NAME}: Cannot scroll to row - tbody not found`, { index });
          return;
        }

        // Get current header height
        const headerHeight = getHeaderHeight();

        // Helper function to find the actual row element
        const findTargetRow = (): HTMLTableRowElement | null => {
          const allRows = Array.from(tbody.querySelectorAll('tr'));
          const dataRows: HTMLTableRowElement[] = [];

          // Filter out spacer rows (they have a single cell with colSpan and padding: 0)
          allRows.forEach((row) => {
            const cells = row.querySelectorAll('td, th');
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

          if (virtualized) {
            // For virtualized tables, we need to find the row that corresponds to targetIndex
            // The visible range determines which rows are rendered
            // We'll find the row by checking its position relative to the visible range
            const visibleStart = visibleRangeRef.current.start;
            const visibleEnd = visibleRangeRef.current.end;

            if (targetIndex >= visibleStart && targetIndex < visibleEnd) {
              // The row should be in the visible range
              const relativeIndex = targetIndex - visibleStart;
              // Account for spacer row before visible range
              const rowOffset = visibleStart > 0 ? 1 : 0;
              const actualRowIndex = rowOffset + relativeIndex;

              if (actualRowIndex < dataRows.length) {
                return dataRows[actualRowIndex];
              }
            }
            // If row is not in visible range, return null and we'll scroll to approximate position first
            return null;
          } else {
            // For non-virtualized tables, directly access by index
            if (targetIndex < dataRows.length) {
              return dataRows[targetIndex];
            }
          }

          return null;
        };

        // First, try to find the row immediately
        let targetRow = findTargetRow();

        if (targetRow) {
          // Row is already rendered, scroll to it directly
          const rowRect = targetRow.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Calculate the row's position relative to the container's scroll position
          // rowRect.top is relative to viewport, containerRect.top is also relative to viewport
          // We need the row's position relative to the container's content
          const rowTopRelativeToContainer = rowRect.top - containerRect.top + container.scrollTop;

          // For sticky header, we need to account for the header height
          // The target scroll position should place the row just below the sticky header
          const targetScrollTop = rowTopRelativeToContainer - headerHeight;

          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
          });

          logger.debug(`${COMPONENT_NAME}: Scroll to row (direct)`, {
            index: targetIndex,
            targetScrollTop,
            rowTopRelativeToContainer,
            headerHeight,
            rowRectTop: rowRect.top,
            containerRectTop: containerRect.top,
            containerScrollTop: container.scrollTop,
          });
        } else {
          // Row is not rendered yet (virtualized table), scroll to approximate position first
          const approximateScrollTop = targetIndex * rowHeight;

          // Scroll to approximate position (without smooth behavior for immediate update)
          container.scrollTop = approximateScrollTop;

          // Wait for virtualization to render the row, then scroll to it precisely
          const checkAndScroll = (attempts = 0) => {
            if (attempts > 20) {
              // Fallback: use calculated position with header height
              const currentHeaderHeight = getHeaderHeight();
              const scrollTop = approximateScrollTop;

              container.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: 'smooth',
              });
              logger.debug(`${COMPONENT_NAME}: Scroll to row (fallback after timeout)`, {
                index: targetIndex,
                scrollTop,
                headerHeight: currentHeaderHeight,
              });
              return;
            }

            // Use double requestAnimationFrame to ensure DOM has updated after scroll
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                targetRow = findTargetRow();

                if (targetRow) {
                  // Row is now rendered, scroll to it precisely
                  const rowRect = targetRow.getBoundingClientRect();
                  const containerRect = container.getBoundingClientRect();
                  const currentHeaderHeight = getHeaderHeight();

                  // Calculate the row's position relative to the container's scroll position
                  const rowTopRelativeToContainer = rowRect.top - containerRect.top + container.scrollTop;

                  // For sticky header, account for the header height
                  const targetScrollTop = rowTopRelativeToContainer - currentHeaderHeight;

                  container.scrollTo({
                    top: Math.max(0, targetScrollTop),
                    behavior: 'smooth',
                  });

                  logger.debug(`${COMPONENT_NAME}: Scroll to row (after render)`, {
                    index: targetIndex,
                    targetScrollTop,
                    rowTopRelativeToContainer,
                    headerHeight: currentHeaderHeight,
                    attempts,
                  });
                } else {
                  // Row still not rendered, try again
                  checkAndScroll(attempts + 1);
                }
              });
            });
          };

          // Start checking after a brief delay to allow scroll event to process
          setTimeout(() => {
            checkAndScroll();
          }, 50);
        }
      },
      scrollToTop: () => {
        const container = tableRef.current?.parentElement;
        if (container) {
          container.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      },
      scrollToBottom: () => {
        const container = tableRef.current?.parentElement;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        }
      },
    }));

    const handlePageChange = useCallback(
      (page: number) => {
        logger.debug(`${COMPONENT_NAME}: Page change`, { page });
        setCurrentPage(page);
        onPageChange?.(page);
      },
      [onPageChange, logger]
    );

    const handlePageSizeChange = useCallback(
      (newPageSize: number) => {
        logger.debug(`${COMPONENT_NAME}: Page size change`, { pageSize: newPageSize });
        setCurrentPageSize(newPageSize);
        setCurrentPage(0);
        onPageSizeChange?.(newPageSize);
      },
      [onPageSizeChange, logger]
    );

    const handleRowExpand = useCallback(
      (rowId: string | number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rowId)) {
          newExpanded.delete(rowId);
        } else {
          newExpanded.add(rowId);
        }
        setExpandedRows(newExpanded);
        logger.debug(`${COMPONENT_NAME}: Row expand/collapse`, { rowId, expanded: newExpanded.has(rowId) });
      },
      [expandedRows, logger]
    );

    const renderRow = useCallback(
      (row: TableRowData, index: number): ReactNode => {
        const rowId = row.id;
        const isExpanded = expandedRows.has(rowId);

        return (
          <TableRow
            key={rowId ?? `row-${index}`}
            expanded={isExpanded}
            expandable={expandableRows}
            onExpand={() => handleRowExpand(rowId)}
          >
            {columns.map((column) => {
              const width = column.width
                ? typeof column.width === 'number'
                  ? `${column.width}px`
                  : column.width
                : undefined;
              return (
                <TableCell
                  key={`column-${column.id}`}
                  styles={width ? { width, minWidth: width, maxWidth: width } : undefined}
                >
                  {getCellValue(row, column)}
                </TableCell>
              );
            })}
          </TableRow>
        );
      },
      [columns, expandedRows, expandableRows, handleRowExpand]
    );

    const renderExpandedRow = useCallback(
      (row: TableRowData, index: number): ReactNode => {
        if (!renderExpandedContent) return null;
        const rowId = row.id;
        const isExpanded = expandedRows.has(rowId);
        if (!isExpanded) return null;

        return (
          <TableRow key={`${rowId}-expanded`}>
            <TableCell colSpan={columns.length + (expandableRows ? 1 : 0)}>
              {renderExpandedContent(row, index)}
            </TableCell>
          </TableRow>
        );
      },
      [columns, expandedRows, expandableRows, renderExpandedContent]
    );

    if (loading && loadingState) {
      return loadingState;
    }

    if (data.length === 0 && emptyState) {
      return emptyState;
    }

    return (
      <>
        <TableStyled
          ref={tableRef}
          theme={theme}
          data-testid={COMPONENT_NAME}
          {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
        >
          <TableHead ref={headerRef} sticky={stickyHeader}>
            {renderHeader ? (
              renderHeader(columns)
            ) : (
              <TableRow isHeader>
                {columns.map((column) => {
                  const width = column.width
                    ? typeof column.width === 'number'
                      ? `${column.width}px`
                      : column.width
                    : undefined;
                  return (
                    <TableHeaderCell
                      key={column.id}
                      styles={width ? { width, minWidth: width, maxWidth: width } : undefined}
                    >
                      {column.label}
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            )}
          </TableHead>
          {virtualized ? (
            <TableBody ref={bodyRef}>
              {/* Spacer for rows before visible range */}
              {visibleRange.start > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (expandableRows ? 1 : 0)}
                    styles={{ height: `${visibleRange.start * rowHeight}px`, padding: 0 }}
                  />
                </TableRow>
              )}
              {/* Render visible rows */}
              {displayData.slice(visibleRange.start, visibleRange.end).map((row, relativeIndex) => {
                const absoluteIndex = visibleRange.start + relativeIndex;
                return (
                  <Fragment key={`virtualized-visible-row-${absoluteIndex}-${relativeIndex}`}>
                    {renderRow(row, absoluteIndex)}
                    {renderExpandedRow(row, absoluteIndex)}
                  </Fragment>
                );
              })}
              {/* Spacer for rows after visible range */}
              {visibleRange.end < displayData.length && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (expandableRows ? 1 : 0)}
                    styles={{
                      height: `${(displayData.length - visibleRange.end) * rowHeight}px`,
                      padding: 0,
                    }}
                  />
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody ref={bodyRef}>
              {displayData.map((row, index) => (
                <Fragment key={`visible-row-${index}`}>
                  {renderRow(row, index)}
                  {renderExpandedRow(row, index)}
                </Fragment>
              ))}
            </TableBody>
          )}
          {footer && (
            <TableFooter sticky={stickyFooter}>
              <TableRow isFooter>
                <TableCell colSpan={columns.length + (expandableRows ? 1 : 0)}>{footer}</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </TableStyled>
        {pagination && (
          <TablePagination
            page={currentPage}
            pageSize={currentPageSize}
            totalItems={sortedData.length}
            pageSizes={pageSizes}
            sticky={stickyPagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </>
    );
  }
);

Table.displayName = COMPONENT_NAME;
