import type { PropsWithChildren, MouseEvent, ReactNode } from 'react';

import type {
  Option,
  renderOptionType,
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  BaseInputFieldProps,
  SelectOnSelect,
} from '@components';
import type { Theme } from '@hooks/useTheme';

export interface SearchResultOption extends Option {
  [key: string]: unknown;
}

export interface SearchProps extends PropsWithChildren<Omit<CommonCssComponentProps, 'onSelect'>> {
  placeholder?: string;
  isLoading?: boolean;
  width?: string;
  debounceTime?: number;
  value?: string;
  items?: (never | SearchResultOption)[];
  renderOption?: (value: renderOptionType) => ReactNode;
  emptyItemsResult?: string;
  onType?: (value: string) => void;
  handleClickOnInitiator?: (event: MouseEvent<HTMLInputElement>) => void;
  onSelect?: SelectOnSelect;
}

export type SearchWrapperStyledProps = PropsWithChildren<CommonCssComponentStyledProps>;

export interface SearchInputStyledProps extends BaseInputFieldProps {
  theme?: Theme;
}
