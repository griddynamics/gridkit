import { MIN_WIDTH } from './constants';
import type { ScrollDirection } from './Scroll.types';

function getVerticalCompensation(container: HTMLElement): number {
  const { clientHeight, scrollHeight } = container;

  if ((clientHeight * clientHeight) / scrollHeight > MIN_WIDTH) {
    return 0;
  }

  return MIN_WIDTH / clientHeight;
}

function getHorizontalCompensation(container: HTMLElement): number {
  const { clientWidth, scrollWidth } = container;

  if ((clientWidth * clientWidth) / scrollWidth > MIN_WIDTH) {
    return 0;
  }

  return MIN_WIDTH / clientWidth;
}

function getView(container: HTMLElement, orientation?: ScrollDirection): number {
  const { clientHeight, scrollHeight, clientWidth, scrollWidth } = container;

  const rate = orientation === 'vertical' ? clientHeight / scrollHeight : clientWidth / scrollWidth;

  return Math.ceil(rate * 100) / 100;
}

export const getThumbPosition = (
  container: HTMLElement,
  orientation?: ScrollDirection
): { position: number; size: number } => {
  const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = container;
  const getScrolled =
    orientation === 'vertical' ? scrollTop / (scrollHeight - clientHeight) : scrollLeft / (scrollWidth - clientWidth);
  const view = getView(container, orientation);

  const compensation =
    (orientation === 'vertical' ? getVerticalCompensation(container) : getHorizontalCompensation(container)) || view;
  const thumb = getScrolled * (1 - compensation);

  return { position: thumb * 100, size: view * 100 };
};
