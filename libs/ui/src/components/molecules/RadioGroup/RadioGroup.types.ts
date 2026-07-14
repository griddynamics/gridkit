import { InputHTMLAttributes, ReactNode } from 'react';
import type {
  BoxCssComponentStyledProps,
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  FlexElementStyledProps,
} from '@components';
import { AlignType, EnumOrPrimitive, JustifyType } from '@types';

export enum RadioGroupVariant {
  Row = 'row',
  Column = 'column',
  Grid = 'grid',
}

export type RadioGroupSize = 'sm' | 'md';

export interface RenderOptionProps {
  option: RadioOption;
  isSelected?: boolean;
  isDisabled?: boolean;
  selectedValue?: string;
}

export interface RadioGroupProps extends Omit<CommonCssComponentProps<HTMLFieldSetElement>, 'onChange'> {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  size?: RadioGroupSize;
  itemWidth?: string;
  itemHeight?: string;
  gutter?: number | string;
  gridColumns?: number | string;
  gridRows?: number | string;
  gridColumnGutter?: string | number;
  gridRowGutter?: string | number;
  onChange?: (value: string) => void;
  name?: string;
  renderOption?: (renderProps: RenderOptionProps) => ReactNode;
  wrapItems?: boolean;
  align?: AlignType;
  justify?: JustifyType;
  variant?: RadioGroupVariant;
}

export interface RadioGroupItemProps extends Omit<CommonCssComponentProps, 'onClick'> {
  item: RadioOption;
  name?: string;
  selected?: boolean;
  disabled?: boolean;
  size?: RadioGroupSize;
  width?: string;
  height?: string;
  onClick: (value: string) => void;
  children?: ReactNode;
  variant?: RadioGroupVariant;
}

export interface StyledGridLayoutProps {
  $gridColumns?: number | string;
  $gridRows?: number | string;
  $gridColumnGutter?: string | number;
  $gridRowGutter?: string | number;
}

export type RadioGroupStyledProps = CommonCssComponentStyledProps<HTMLFieldSetElement>;
export type RadioLabelStyledProps = RadioItemStyledProps<HTMLLabelElement>;

export interface HiddenInputStyledProps
  extends
    Omit<CommonCssComponentStyledProps, keyof InputHTMLAttributes<HTMLInputElement> | 'ref'>,
    InputHTMLAttributes<HTMLInputElement> {}

export interface RadioLayoutStyledProps
  extends
    CommonCssComponentStyledProps,
    Omit<BoxCssComponentStyledProps, keyof CommonCssComponentStyledProps>,
    Partial<FlexElementStyledProps>,
    StyledGridLayoutProps {
  $variant?: EnumOrPrimitive<RadioGroupVariant>;
}

export interface RadioItemStyledProps<T> extends CommonCssComponentStyledProps<T> {
  selected?: boolean;
  disabled?: boolean;
  $hex?: string;
  $width?: string;
  $height?: string;
  $image?: string;
}

export interface RadioOption<T = unknown> {
  value: string;
  label: string;
  disabled?: boolean;
  hex?: string;
  image?: string;
  tooltip?: string;
  payload?: T;
}
