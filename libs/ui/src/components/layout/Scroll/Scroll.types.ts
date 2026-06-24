import type { RefObject, PropsWithChildren } from 'react';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components/index.types';

export type ScrollDirection = 'vertical' | 'horizontal';
export type ScrollBarPosition = 'hidden' | 'visible' | 'auto';

export interface ScrollProps extends PropsWithChildren<CommonCssComponentProps> {
  vertical?: ScrollBarPosition;
  horizontal?: ScrollBarPosition;
  autoHide?: boolean;
}

export interface ScrollBarProps extends CommonCssComponentProps {
  direction?: ScrollDirection;
  containerRef?: RefObject<HTMLElement>;
  autoHide?: boolean;
  isScrolling?: boolean;
}

export interface ScrollStyledProps extends PropsWithChildren<CommonCssComponentStyledProps> {
  $vertical?: ScrollBarPosition;
  $horizontal?: ScrollBarPosition;
}

export interface ScrollBarStyledProps extends CommonCssComponentStyledProps {
  $direction?: ScrollDirection;
  $autoHide?: boolean;
  $isScrolling?: boolean;
}
