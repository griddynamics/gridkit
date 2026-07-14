import type { PropsWithChildren } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps, CommonCssInputStyledProps } from '@components';

export type LabelPosition = 'left' | 'right';

export interface SwitchProps<T> extends PropsWithChildren<BoxCssComponentProps<T>> {
  label?: LabelPosition;
  name?: string;
  disabled?: boolean;
  isLoading?: boolean;
  checked?: boolean;
  onValueChange?: (value: boolean) => void;
}

export interface SwitchStyledProps<T> extends PropsWithChildren<BoxCssComponentStyledProps<T>> {
  $disabled?: boolean;
  $checked?: boolean;
}

export interface SwitchLabelStyledProps extends PropsWithChildren<BoxCssComponentStyledProps> {
  $label?: LabelPosition;
}

export interface HiddenCheckboxStyledProps extends CommonCssInputStyledProps {
  disabled?: boolean;
  checked?: boolean;
}
