import { PropsWithChildren, ReactNode } from 'react';

import { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';
import { EnumOrPrimitive, ListVariant } from '@types';

export type ListSize = 'sm' | 'md';

export interface ListProps<T> extends CommonCssComponentProps<T>, PropsWithChildren {
  items?: ReactNode[];
  variant?: EnumOrPrimitive<ListVariant>;
  size?: ListSize;
}

export interface ListStyledProps<T = HTMLUListElement> extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $variant?: EnumOrPrimitive<ListVariant>;
  $size?: ListSize;
}
