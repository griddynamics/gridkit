import type { ElementType, PropsWithChildren } from 'react';

import type { EnumOrPrimitive, WrapperVariant } from '@types';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface WrapperProps extends CommonCssComponentProps, PropsWithChildren {
  variant?: EnumOrPrimitive<WrapperVariant>;
  as?: keyof HTMLElementTagNameMap | ElementType;
}
export interface WrapperStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $variant?: EnumOrPrimitive<WrapperVariant>;
  $as?: keyof HTMLElementTagNameMap | ElementType;
}
