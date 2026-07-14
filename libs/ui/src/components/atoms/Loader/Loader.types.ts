import type { ElementType, PropsWithChildren } from 'react';

import type { EnumOrPrimitive, SizeVariant, WrapperVariant, Rounded } from '@types';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export type LoaderName = 'circle' | 'dots';

export interface LoaderProps extends CommonCssComponentProps, PropsWithChildren {
  name?: LoaderName;
  variant?: EnumOrPrimitive<WrapperVariant>;
  rounded?: Rounded;
  size?: EnumOrPrimitive<SizeVariant>;
  withWrapper?: boolean;
  animationProps?: string;
  WrapperView?: keyof HTMLElementTagNameMap | ElementType;
}

export interface LoaderStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $name?: LoaderName;
  $rounded?: Rounded;
  $variant?: EnumOrPrimitive<WrapperVariant>;
  $size?: EnumOrPrimitive<SizeVariant>;
  $animationProps?: string;
}
