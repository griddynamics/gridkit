import { MouseEvent, PropsWithChildren, ReactNode } from 'react';
import { ModalProps, InputFieldProps, CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';
import { defaultTheme } from '@tokens';

export type SearchInputProps = InputFieldProps & {
  theme?: typeof defaultTheme;
  onEndIconClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export interface SearchLoaderProps extends CommonCssComponentProps {
  itemsCount: number;
}

export interface SearchModalResultItemProps extends CommonCssComponentProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  date?: number;
}

export interface SearchModalHistoryResultItemProps extends CommonCssComponentProps {
  title: string;
  items: (never | SearchModalResultItemProps)[];
}

export interface SearchItemsProps extends CommonCssComponentProps {
  items?: (never | SearchModalResultItemProps | SearchModalHistoryResultItemProps)[];
  onItemClick?: (event: MouseEvent, item: string | SearchModalResultItemProps) => void;
  noItemsLabel?: string;
  newSearchCta?: string;
}

export interface SearchModalSectionProps {
  title?: string;
  content: ReactNode;
}

export interface SearchModalProps extends Omit<CommonCssComponentProps, 'results'> {
  results?: (never | SearchModalResultItemProps | SearchModalHistoryResultItemProps)[];
  historyResults?: (never | SearchModalResultItemProps | SearchModalHistoryResultItemProps)[];
  noResultsLabel?: string;
  noHistoryResultsLabel?: string;
  newSearchCta?: string;
  searchValue?: string;
  loaderItemsCount?: number;
  isLoading?: boolean;
  shouldSortHistory?: boolean;
  onResultClick?: (event: MouseEvent, id: string | SearchModalResultItemProps) => void;
  modalProps?: ModalProps;
  searchProps?: SearchInputProps;
  popularItems?: SearchModalSectionProps;
  aiSuggestions?: SearchModalSectionProps;
  articles?: SearchModalSectionProps;
}

// Extend modal props ModalProps once Modal will be refactored to emotion
export interface SearchModalStyledProps extends Omit<CommonCssComponentStyledProps, 'title'>, PropsWithChildren {
  title?: ReactNode;
}

export interface SearchItemContentStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $variant?: 'title' | 'description' | 'date';
}
export interface SearchModalCommonStyledProps<T = HTMLDivElement>
  extends CommonCssComponentStyledProps<T>, PropsWithChildren {}
