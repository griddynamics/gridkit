import type { ReactElement, ReactNode, PropsWithChildren } from 'react';
import type { EmblaOptionsType } from 'embla-carousel';

import type { Theme } from '@hooks';
import type { CommonCssComponentProps, CommonCssComponentStyledProps, ButtonProps } from '@components';
import { CarouselVariantTypes, LayoutType, ThumbsPosition } from '@types';

export type KeyboardHandler = () => void;
export type KeyboardConfig = Record<string, KeyboardHandler>;

export interface CarouselProps extends PropsWithChildren<CommonCssComponentProps> {
  options?: EmblaOptionsType;
  layout?: LayoutType;
  showArrows?: boolean;
  showDots?: boolean;
  thumbs?: ThumbsPosition;
  variant?: CarouselVariantTypes;
  keyboardConfig?: KeyboardConfig;
  isFocusable?: boolean;
  onSlideChange?: (activeIndex: number) => void;
}

export interface CarouselRef {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
}

export interface CarouselStyledProps<T = HTMLDivElement> extends PropsWithChildren<CommonCssComponentStyledProps<T>> {
  $layout?: LayoutType;
  $active?: boolean;
  $variant?: CarouselVariantTypes;
  $centered?: boolean;
}

export interface CarouselControlsButtonStyledProps extends ButtonProps {
  theme?: Theme;
}

export type ExtractedCarousel = {
  images: ReactElement[];
  content: ReactNode;
};
