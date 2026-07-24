import type { PropsWithChildren, ReactNode } from 'react';

import type { EnumOrPrimitive } from '@types';
import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
export type BadgeAppearance = 'outline' | 'outlineFilledLight' | 'filled' | 'filledLight';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps extends BoxCssComponentProps<HTMLSpanElement>, PropsWithChildren {
  variant?: EnumOrPrimitive<BadgeVariant>;
  disabled?: boolean;
  appearance?: EnumOrPrimitive<BadgeAppearance>;
  size?: EnumOrPrimitive<BadgeSize>;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export interface BadgeStyledProps extends BoxCssComponentStyledProps<HTMLSpanElement>, PropsWithChildren {
  $variant?: EnumOrPrimitive<BadgeVariant>;
  $appearance?: EnumOrPrimitive<BadgeAppearance>;
  $size?: EnumOrPrimitive<BadgeSize>;
  $disabled?: boolean;
}
