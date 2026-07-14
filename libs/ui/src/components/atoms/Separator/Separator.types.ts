import type { PropsWithChildren } from 'react';

import type {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  TypographyStyledProps,
} from '@components';
import {
  EnumOrPrimitive,
  KeysByPrefix,
  Orientation,
  SeparatorLabelPosition,
  SeparatorVariant,
  SizeVariant,
} from '@types';
import { Unit } from '@tokens';

type SpacingKeys = KeysByPrefix<BoxCssComponentProps, 'margin'> | KeysByPrefix<BoxCssComponentProps, 'padding'>;
export type SeparatorElement = HTMLDivElement | HTMLHRElement | HTMLSpanElement;
export type SeparatorAs = 'div' | 'hr' | 'span';

export interface SeparatorProps
  extends CommonCssComponentProps<SeparatorElement>, Pick<BoxCssComponentProps, SpacingKeys> {
  orientation?: EnumOrPrimitive<Orientation>;
  length?: `${number}${Unit}`;
  color?: string;
  size?: SizeVariant;
  variant?: EnumOrPrimitive<SeparatorVariant>;
  as?: SeparatorAs;
  label?: string;
  labelPosition?: EnumOrPrimitive<SeparatorLabelPosition>;
  labelColor?: string;
}

export interface SeparatorWrapperStyledProps
  extends
    CommonCssComponentStyledProps<SeparatorElement>,
    BoxCssComponentStyledProps<SeparatorElement>,
    PropsWithChildren {
  $as?: SeparatorAs;
  $orientation?: EnumOrPrimitive<Orientation>;
  $length?: `${number}${Unit}`;
}

export interface SeparatorLineStyledProps
  extends Omit<CommonCssComponentStyledProps<SeparatorElement>, 'ref'>, PropsWithChildren {
  $as?: SeparatorAs;
  $orientation?: EnumOrPrimitive<Orientation>;
  $color?: string;
  $size?: EnumOrPrimitive<SizeVariant>;
  $variant?: EnumOrPrimitive<SeparatorVariant>;
}

export interface SeparatorLabelStyledProps extends TypographyStyledProps {
  $labelColor?: string;
}
