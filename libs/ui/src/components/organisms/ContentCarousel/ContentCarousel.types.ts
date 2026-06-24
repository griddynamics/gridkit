import { ReactNode } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export type ScrollAlignment = 'left' | 'centered';

export interface ContentCarouselProps<T> extends CommonCssComponentProps {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  showArrows?: boolean;
  showDots?: boolean;
  isFocusable?: boolean;
  visibleItems?: number;
  scrollStep?: number;
  scrollAlignment?: ScrollAlignment;
}

export type ContentCarouselStyledProps = CommonCssComponentStyledProps;

export interface ContentCarouselRef {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: number;
}
