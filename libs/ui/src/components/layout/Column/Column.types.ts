import type { ElementType, PropsWithChildren } from 'react';

import type {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  FlexElementProps,
  FlexElementStyledProps,
} from '@components';

export interface ColumnProps extends BoxCssComponentProps, FlexElementProps, PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
}
export interface ColumnStyledProps extends BoxCssComponentStyledProps, FlexElementStyledProps, PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
}
