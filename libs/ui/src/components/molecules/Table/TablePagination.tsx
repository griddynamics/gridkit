import { useTheme } from '@hooks/useTheme';
import { get } from '@utils';
import { Button, Icon } from '@components';
import { DEFAULT_PAGE_SIZES, TABLE_PAGINATION_COMPONENT } from './constants';
import {
  TablePaginationStyled,
  TablePaginationLeftSectionStyled,
  TablePaginationRightSectionStyled,
  ButtonPerPageStyled,
  ButtonPageStyled,
} from './TableStyled';
import type { TablePaginationProps } from './';

export const TablePagination = ({
  page,
  pageSize,
  totalItems,
  pageSizes = DEFAULT_PAGE_SIZES,
  onPageChange,
  translations = { perPage: 'Rows per page', total: 'Showing {startItem}–{endItem} of {totalItems}' },
  onPageSizeChange,
  sticky = false,
}: TablePaginationProps) => {
  const { theme } = useTheme();
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalItems);

  const handlePageSizeChange = (newPageSize: number) => {
    onPageSizeChange(newPageSize);
    onPageChange(0);
  };

  // Calculate which 3-page numbers to show
  const getPageNumbers = () => {
    const pages: number[] = [];
    const currentPageNum = page + 1;

    if (totalPages <= 3) {
      // Show all pages if 3 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPageNum === 1) {
      // Show the first 3 pages
      pages.push(1, 2, 3);
    } else if (currentPageNum === totalPages) {
      // Show the last 3 pages
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Show the current page and one before/after
      pages.push(currentPageNum - 1, currentPageNum, currentPageNum + 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const themePagination = get(theme, 'table.pagination', {});
  const pagePrevNextControls = get(themePagination, 'pagePrevNext', {});
  const pagePrevNextControlsAttrs = get(pagePrevNextControls, 'attrs', {});
  const pagePrevNextControlsIcons = get(pagePrevNextControls, 'icons', {});

  const showingText = translations.total
    .replace('{totalItems}', totalItems.toString())
    .replace('{startItem}', startItem.toString())
    .replace('{endItem}', endItem.toString());

  return (
    <TablePaginationStyled theme={theme} $sticky={sticky} data-testid={TABLE_PAGINATION_COMPONENT}>
      <TablePaginationLeftSectionStyled theme={theme} data-testid={`${TABLE_PAGINATION_COMPONENT}-left-section`}>
        {translations.perPage}
        {pageSizes.map((size) => {
          const isActive = size === pageSize;
          return (
            <ButtonPerPageStyled
              theme={theme}
              key={`per-page-${size}`}
              onClick={() => handlePageSizeChange(size)}
              className={isActive ? 'hover' : ''}
              data-testid={`${TABLE_PAGINATION_COMPONENT}-btn-per-page`}
            >
              {size}
            </ButtonPerPageStyled>
          );
        })}
      </TablePaginationLeftSectionStyled>
      <TablePaginationRightSectionStyled theme={theme} data-testid={`${TABLE_PAGINATION_COMPONENT}-right-section`}>
        <Button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          iconStart={<Icon {...get(pagePrevNextControlsIcons, 'prev', { name: 'arrowLeft' })} />}
          data-testid={`${TABLE_PAGINATION_COMPONENT}-btn-page-prev`}
          aria-label="Previous page"
          {...pagePrevNextControlsAttrs}
        />
        {pageNumbers.map((pageNum) => {
          const isActive = pageNum === page + 1;
          return (
            <ButtonPageStyled
              theme={theme}
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum - 1)}
              className={isActive ? 'active' : ''}
              data-testid={`${TABLE_PAGINATION_COMPONENT}-btn-page`}
            >
              {pageNum}
            </ButtonPageStyled>
          );
        })}
        {showingText}
        <Button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          iconStart={<Icon {...get(pagePrevNextControlsIcons, 'next', { name: 'arrowRight' })} />}
          data-testid={`${TABLE_PAGINATION_COMPONENT}-btn-page-next`}
          aria-label="Next page"
          {...pagePrevNextControlsAttrs}
        />
      </TablePaginationRightSectionStyled>
    </TablePaginationStyled>
  );
};
