import type { PropsWithChildren } from 'react';
import type { BoxCssComponentProps, BoxCssComponentStyledProps, CommonCssInputStyledProps } from '@components';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends PropsWithChildren<BoxCssComponentProps<HTMLLabelElement>> {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  size?: CheckboxSize;
  onValueChange?: (checked: boolean) => void;
}

export interface CheckboxStyledProps extends PropsWithChildren<BoxCssComponentStyledProps<HTMLLabelElement>> {
  $disabled?: boolean;
  $size?: CheckboxSize;
}

export interface CheckboxInputStyledProps extends CommonCssInputStyledProps {
  $size?: CheckboxSize;
}

export interface CheckboxIndicatorStyledProps extends BoxCssComponentStyledProps {
  $checked?: boolean;
  $indeterminate?: boolean;
  $disabled?: boolean;
  $size?: CheckboxSize;
}
