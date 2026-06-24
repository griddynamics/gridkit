import type { ElementType, PropsWithChildren } from 'react';

import type {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  FlexElementProps,
  FlexElementStyledProps,
} from '@components';

export interface RowProps extends BoxCssComponentProps, FlexElementProps, PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
}
export interface RowStyledProps extends BoxCssComponentStyledProps, FlexElementStyledProps, PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
}
