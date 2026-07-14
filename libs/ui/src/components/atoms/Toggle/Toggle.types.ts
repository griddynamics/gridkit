import type { PropsWithChildren, ReactNode } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface ToggleItem {
  label?: ReactNode;
  value: unknown;
}

export interface ToggleProps<T> extends CommonCssComponentProps, PropsWithChildren {
  items?: string[] | ToggleItem[];
  disabled?: boolean;
  value?: unknown;
  onValueChange?: (value: T) => void;
  renderItemContent?: (item: ToggleItem | string, index: number) => ReactNode;
}

export interface ToggleStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  disabled?: boolean;
}
