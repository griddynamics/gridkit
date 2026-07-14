import type { ReactNode, Ref, PropsWithChildren } from 'react';
import { BoxCssComponentProps, BoxCssComponentStyledProps, CommonCssComponentStyledProps } from '@components';

export interface TableProps extends BoxCssComponentProps, PropsWithChildren {
  columns: TableColumn[];
  data: TableRowData[];
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  stickyPagination?: boolean;
  virtualized?: boolean;
  rowHeight?: number;
  minVisibleRange?: number;
  expandableRows?: boolean;
  renderExpandedContent?: (row: any, index: number) => ReactNode;
  footer?: ReactNode;
  pagination?: boolean;
  pageSize?: number;
  pageSizes?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  renderHeader?: (columns: TableColumn[]) => ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingState?: ReactNode;
}

export interface TableHeaderCellProps extends BoxCssComponentProps<HTMLTableCellElement>, PropsWithChildren {
  colSpan?: number;
}

export interface TableRowProps extends BoxCssComponentProps<HTMLTableRowElement>, PropsWithChildren {
  rowSpan?: number;
  expanded?: boolean;
  isHeader?: boolean;
  isFooter?: boolean;
  expandable?: boolean;
  onExpand?: () => void;
  onClick?: () => void;
}

export interface TableCellProps extends BoxCssComponentProps, PropsWithChildren {
  colSpan?: number;
}

export interface TableColumn {
  id: string;
  label: ReactNode;
  render?: (row: any, index: number) => ReactNode;
  accessor?: string;
  width?: string | number;
}

export interface BaseTableRowData {
  id: string | number;
}

export type TableRowData<T extends Record<string, unknown> = Record<string, unknown>> = BaseTableRowData & Partial<T>;

export interface TableRef {
  ref: Ref<HTMLTableElement>;
  scrollToRow?: (index: number) => void;
  scrollToTop?: () => void;
  scrollToBottom?: () => void;
}

export interface TableHeadProps extends BoxCssComponentProps, PropsWithChildren {
  sticky?: boolean;
}

export interface TableBodyProps extends BoxCssComponentProps, PropsWithChildren {
  virtualized?: boolean;
  rowHeight?: number;
  itemCount?: number;
}

export interface TableFooterProps extends BoxCssComponentProps, PropsWithChildren {
  sticky?: boolean;
}

type Translations = Record<'perPage' | 'total', string>;
export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizes?: number[];
  translations?: Translations;
  sticky?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export type TableStyledProps = CommonCssComponentStyledProps;
export type TableHeadStyledProps = CommonCssComponentStyledProps & { $sticky?: boolean };
export type TableBodyStyledProps = CommonCssComponentStyledProps;
export type TableFooterStyledProps = CommonCssComponentStyledProps & { $sticky?: boolean };
export type TablePaginationStyledProps = CommonCssComponentStyledProps & { $sticky?: boolean };

export type TableCellStyledProps = CommonCssComponentStyledProps;
export type TableHeaderCellStyledProps = BoxCssComponentStyledProps<HTMLTableCellElement>;
export interface TableRowStyledProps extends BoxCssComponentStyledProps<HTMLTableCellElement> {
  $isHeader?: boolean;
  $isFooter?: boolean;
  $expanded?: boolean;
  $expandable?: boolean;
}
