import { PropsWithChildren } from 'react';
import type { ButtonProps, CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';
import { Theme } from '@hooks';

export interface CounterProps extends CommonCssComponentProps {
  min?: number;
  max?: number;
  initial?: number;
  isDisabled?: boolean;
  onCounterChange?: (qty: number) => void;
}

export interface CounterStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}

export interface NavButtonStyledProps extends ButtonProps {
  theme?: Theme;
}
