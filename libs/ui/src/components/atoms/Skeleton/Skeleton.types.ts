import { PropsWithChildren } from 'react';

import { EnumOrPrimitive, NullableType, SkeletonVariant } from '@types';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface SkeletonProps extends CommonCssComponentProps<HTMLSpanElement>, PropsWithChildren {
  animationName?: NullableType<string>;
  animationProps?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  variant?: EnumOrPrimitive<SkeletonVariant>;
}
export interface SkeletonPropsStyled extends CommonCssComponentStyledProps<HTMLSpanElement>, PropsWithChildren {
  $animationName?: NullableType<string>;
  $animationProps?: string;
  $width?: string;
  $height?: string;
  $backgroundColor?: string;
  $variant?: EnumOrPrimitive<SkeletonVariant>;
}
