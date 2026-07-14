import type { ElementType, PropsWithChildren } from 'react';

import {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
} from '@components';
import type { EnumOrPrimitive, SizeVariant, TextAlign, TypographyStyleVariant, TypographyVariant } from '@types';

export type StyleVariant = EnumOrPrimitive<TypographyStyleVariant> | EnumOrPrimitive<TypographyStyleVariant>[];

export interface TypographyProps
  extends
    CommonCssComponentProps<HTMLBaseElement>,
    Omit<BoxCssComponentProps<HTMLBaseElement>, 'onAbort'>,
    PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
  color?: string;
  variant?: EnumOrPrimitive<TypographyVariant>;
  size?: EnumOrPrimitive<SizeVariant>;
  align?: EnumOrPrimitive<TextAlign>;
  styleVariant?: StyleVariant;
}

export interface TypographyStyledProps
  extends
    CommonCssComponentStyledProps<HTMLBaseElement>,
    Omit<BoxCssComponentStyledProps<HTMLBaseElement>, 'onAbort'>,
    PropsWithChildren {
  $as?: keyof HTMLElementTagNameMap | ElementType;
  $color?: string;
  $variant?: EnumOrPrimitive<TypographyVariant>;
  $size?: EnumOrPrimitive<SizeVariant>;
  $align?: EnumOrPrimitive<TextAlign>;
  $styleVariant?: StyleVariant;
}
