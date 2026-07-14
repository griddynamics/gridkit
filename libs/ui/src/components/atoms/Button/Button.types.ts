import type { PropsWithChildren, MouseEvent, ReactNode } from 'react';

import type { ButtonRole, ButtonTypes, ButtonVariant, EnumOrPrimitive, Rounded } from '@types';
import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';

export interface ButtonProps extends BoxCssComponentProps<HTMLButtonElement>, PropsWithChildren {
  variant?: EnumOrPrimitive<ButtonVariant>;
  rounded?: Rounded;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonTypes | `${ButtonTypes}`;
  disabled?: boolean;
  fullWidth?: boolean;
  isIcon?: boolean;
  isLoading?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  role?: ButtonRole | `${ButtonRole}`;
  tabIndex?: number;
}

export interface ButtonCommonStyledProps extends BoxCssComponentStyledProps<HTMLButtonElement>, PropsWithChildren {
  $variant?: EnumOrPrimitive<ButtonVariant>;
  $isIcon?: boolean;
  $fullWidth?: boolean;
  disabled?: boolean;
  type?: ButtonTypes | `${ButtonTypes}`;
}

export interface ButtonStyledProps extends ButtonCommonStyledProps {
  $rounded: 'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
