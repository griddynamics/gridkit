import type { PropsWithChildren } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';
import type { EnumOrPrimitive, TabIndex } from '@types';

export type BoxVariant = 'horizontal' | 'vertical';
export interface BoxProps extends Omit<BoxCssComponentProps, 'tabIndex'>, PropsWithChildren {
  variant?: BoxVariant;
  isBordered?: boolean;
  isHighlighted?: boolean;
  withShadowHover?: boolean;
  tabIndex?: EnumOrPrimitive<TabIndex>;
}

export interface BoxStyledProps extends Omit<BoxCssComponentStyledProps, 'tabIndex'> {
  $variant: BoxVariant;
  $isBordered?: boolean;
  $isHighlighted?: boolean;
  $withShadowHover?: boolean;
  tabIndex?: EnumOrPrimitive<TabIndex>;
}
