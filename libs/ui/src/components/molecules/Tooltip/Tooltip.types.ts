import type { PropsWithChildren, ReactNode, ElementType } from 'react';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';
import type { EnumOrPrimitive } from '@types';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps<T = HTMLDivElement>
  extends Omit<CommonCssComponentProps<T>, 'content'>, PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
  className?: string;
  ariaLabel?: string;
  content?: ReactNode;
  delay?: number;
  gap?: number;
  position?: EnumOrPrimitive<TooltipPosition>;
}

export interface TooltipWrapperStyledProps<T = HTMLDivElement>
  extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $as?: keyof HTMLElementTagNameMap | ElementType;
}

export type TooltipStyledProps = CommonCssComponentStyledProps;
