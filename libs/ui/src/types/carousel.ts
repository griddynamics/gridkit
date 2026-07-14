import type { RefObject } from 'react';
import type { EmblaOptionsType } from 'embla-carousel';

export type KeyboardHandler = (() => void) | undefined;
export type KeyboardConfig = Record<string, KeyboardHandler>;

export enum CarouselVariantTypes {
  Cards = 'cards',
  Single = 'single',
}

export enum LayoutType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum ThumbsPosition {
  Start = 'start',
  End = 'end',
}

export interface UseCarouselParams {
  options?: EmblaOptionsType;
  keyboardConfig?: KeyboardConfig;
  targetRef?: RefObject<HTMLElement>;
  onSlideChange?: (index: number) => void;
  thumbsVisibleItems?: number;
}
