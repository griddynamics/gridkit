'use client';
import { useEffect, useRef } from 'react';

import useTheme from '@hooks/useTheme';
import { useAnimationFrame } from '@utils';

import { getThumbPosition } from './utils';
import { COMPONENT_NAME, SCROLL_BAR_ANIMATION_THROTTLE } from './constants';
import { ScrollBarStyled, ScrollBarThumbStyled } from './ScrollStyled';
import type { ScrollBarProps } from './Scroll.types';

export const ScrollBar = (props: ScrollBarProps) => {
  const { direction, containerRef, autoHide = false, isScrolling = false } = props;
  const thumbRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();

  useAnimationFrame(() => {
    const position = containerRef?.current
      ? getThumbPosition(containerRef.current, direction)
      : { position: 0, size: 0 };

    if (thumbRef.current) {
      if (direction === 'vertical') {
        thumbRef.current.style.top = `${position.position}%`;
        thumbRef.current.style.height = `${position.size}%`;
      } else {
        thumbRef.current.style.left = `${position.position}%`;
        thumbRef.current.style.width = `${position.size}%`;
      }
    }
  }, SCROLL_BAR_ANIMATION_THROTTLE);

  useEffect(() => {
    const thumb = thumbRef.current;

    if (!thumb) {
      return;
    }

    let offsetVertical = 0;
    let offsetHorizontal = 0;

    const getOffsetVertical = ({ clientY }: PointerEvent, { top, height }: DOMRect): number => {
      return (clientY - top) / height;
    };

    const getOffsetHorizontal = ({ clientX }: PointerEvent, { left, width }: DOMRect): number => {
      return (clientX - left) / width;
    };

    const getScrolled = (event: PointerEvent, offsetVertical: number, offsetHorizontal: number): [number, number] => {
      const wrapper = thumb.parentElement;
      const container = containerRef?.current;

      if (!wrapper || !container) {
        return [0, 0];
      }

      const { offsetHeight, offsetWidth } = thumb;
      const { top, left, height, width } = wrapper.getBoundingClientRect();

      const maxTop = container.scrollHeight - height;
      const maxLeft = container.scrollWidth - width;

      const scrolledTop = (event.clientY - top - offsetHeight * offsetVertical) / (height - offsetHeight);
      const scrolledLeft = (event.clientX - left - offsetWidth * offsetHorizontal) / (width - offsetWidth);

      return [maxTop * scrolledTop, maxLeft * scrolledLeft];
    };

    const onPointerMove = (ev: PointerEvent) => {
      const [scrollTop, scrollLeft] = getScrolled(ev, offsetVertical, offsetHorizontal);

      if (containerRef?.current) {
        if (direction === 'vertical') {
          containerRef.current.scrollTop = scrollTop;
        } else {
          containerRef.current.scrollLeft = scrollLeft;
        }
      }
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (event: PointerEvent): void => {
      event.stopPropagation();
      event.preventDefault();

      const rect = thumb.getBoundingClientRect();

      offsetVertical = getOffsetVertical(event, rect);
      offsetHorizontal = getOffsetHorizontal(event, rect);

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    thumb.addEventListener('pointerdown', onPointerDown);

    return () => {
      thumb.removeEventListener('pointerdown', onPointerDown);
    };
  }, [containerRef, thumbRef, direction]);

  return (
    <ScrollBarStyled
      className={`gd-scroll--scrollbar gd-scroll--scrollbar__${direction}`}
      $direction={direction}
      $autoHide={autoHide}
      $isScrolling={isScrolling}
      theme={theme}
      data-testid={`${COMPONENT_NAME}-scrollbar_${direction}`}
    >
      <ScrollBarThumbStyled
        className={`gd-scroll--scrollbar-thumb gd-scroll--scrollbar-thumb__${direction}`}
        ref={thumbRef}
        $direction={direction}
        $autoHide={autoHide}
        $isScrolling={isScrolling}
        theme={theme}
        data-testid={`${COMPONENT_NAME}-scrollbar-thumb_${direction}`}
      />
    </ScrollBarStyled>
  );
};
