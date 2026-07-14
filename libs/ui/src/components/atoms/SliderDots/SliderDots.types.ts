import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';

export interface SliderDotsProps extends BoxCssComponentProps<HTMLDivElement> {
  count: number;
  activeIndex?: number;
  onDotClick?: (index: number) => void;
}

export type SliderDotsStyledProps = BoxCssComponentStyledProps<HTMLDivElement>;
