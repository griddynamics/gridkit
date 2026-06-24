import type { ReactNode } from 'react';

import type {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  CommonCssComponentStyledProps,
} from '@components/index.types';
import type { EnumOrPrimitive, SnackbarPosition, SnackbarVariant } from '@types';

export interface SnackbarOptions {
  title?: ReactNode;
  message: ReactNode;
  variant?: EnumOrPrimitive<SnackbarVariant>;
  duration?: number | null;
  onClose?: (() => void) | null;
  action?: ReactNode;
  dismissOnClick?: boolean;
  colored?: boolean;
  icon?: ReactNode;
  isAnimated?: boolean;
}

export interface SnackbarState extends SnackbarOptions {
  id?: string;
  position?: EnumOrPrimitive<SnackbarPosition>;
}
export interface SnackbarProps extends SnackbarOptions, Omit<BoxCssComponentProps, 'title'> {
  isAnimated?: boolean;
}

export interface SnackbarStyledProps extends BoxCssComponentStyledProps {
  $variant: EnumOrPrimitive<SnackbarVariant>;
  $isAnimated: boolean;
  $isClosing: boolean;
  $colored: boolean;
}

export type SnackbarCommonStyledProps = CommonCssComponentStyledProps;

export interface SnackbarIconProps extends CommonCssComponentStyledProps {
  $variant: EnumOrPrimitive<SnackbarVariant>;
}

export interface SnackbarContainerStyledProps extends CommonCssComponentStyledProps {
  $position?: EnumOrPrimitive<SnackbarPosition>;
}
