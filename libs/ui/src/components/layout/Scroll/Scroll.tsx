'use client';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';

import useTheme from '@hooks/useTheme';
import { useAnimationFrame } from '@utils';

import { ScrollBarsStyled, ScrollContentStyled, ScrollStyled } from './ScrollStyled';
import { ScrollBar } from './ScrollBar';
import { COMPONENT_NAME, ANIMATION_FRAME_TS, AUTO_HIDE_TS } from './constants';
import type { ScrollBarPosition, ScrollProps } from './Scroll.types';

/**
 * Scroll is a customizable scroll container component with optional custom scrollbars.
 *
 * Supports vertical and horizontal scrollbars with three visibility modes:
 * - 'auto' (default): Scrollbar appears only when needed.
 * - 'hidden': Scrollbar is always hidden.
 * - 'visible': Scrollbar is always visible.
 *
 * @component
 * @param {'auto' | 'hidden' | 'visible'} [vertical='auto'] - Controls vertical scrollbar visibility.
 * @param {'auto' | 'hidden' | 'visible'} [horizontal='auto'] - Controls horizontal scrollbar visibility.
 * @param {boolean} [autoHide=false] - When true, scrollbars are only visible during scrolling.
 *
 * @example
 * <Scroll vertical="auto" horizontal="hidden">
 *   <div>Scrollable content</div>
 * </Scroll>
 *
 * @example
 * <Scroll vertical="auto" autoHide>
 *   <div>Scrollable content with auto-hiding scrollbars</div>
 * </Scroll>
 */
export const Scroll = forwardRef<HTMLDivElement, ScrollProps>((props, forwardedRef) => {
  const [showVerticalScrollbar, setShowVerticalScrollbar] = useState(false);
  const [showHorizontalScrollbar, setShowHorizontalScrollbar] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const { vertical = 'auto', horizontal = 'auto', autoHide = false, children, ...rest } = props;

  const getScrollbarVisibility = (mode: ScrollBarPosition, fallback: boolean): boolean => {
    switch (mode) {
      case 'visible':
        return true;
      case 'hidden':
        return false;
      default:
        return fallback;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef.current) {
      return;
    }
    const { clientHeight, scrollHeight, clientWidth, scrollWidth } = containerRef.current;
    const showVertical = getScrollbarVisibility(vertical, Math.ceil((clientHeight / scrollHeight) * 100) < 100);
    const showHorizontal = getScrollbarVisibility(horizontal, Math.ceil((clientWidth / scrollWidth) * 100) < 100);

    if (showVertical !== showVerticalScrollbar) {
      setShowVerticalScrollbar(showVertical);
    }

    if (showHorizontal !== showHorizontalScrollbar) {
      setShowHorizontalScrollbar(showHorizontal);
    }
  }, ANIMATION_FRAME_TS);

  const handleScroll = useCallback(() => {
    if (!autoHide) return;

    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, AUTO_HIDE_TS);
  }, [autoHide]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !autoHide) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [autoHide, handleScroll]);

  useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement, []);

  return (
    <ScrollStyled className="gd-scroll" ref={containerRef} theme={theme} {...rest} data-testid={COMPONENT_NAME}>
      <ScrollBarsStyled className="gd-scroll--scrollbars" theme={theme} data-testid={`${COMPONENT_NAME}-scrollbars`}>
        {showVerticalScrollbar && (
          <ScrollBar direction="vertical" containerRef={containerRef} autoHide={autoHide} isScrolling={isScrolling} />
        )}
        {showHorizontalScrollbar && (
          <ScrollBar direction="horizontal" containerRef={containerRef} autoHide={autoHide} isScrolling={isScrolling} />
        )}
      </ScrollBarsStyled>
      <ScrollContentStyled
        ref={forwardedRef}
        className="gd-scroll--content"
        theme={theme}
        style={horizontal === 'hidden' ? { maxWidth: '100%' } : undefined}
        data-testid={`${COMPONENT_NAME}-content`}
      >
        {children}
      </ScrollContentStyled>
    </ScrollStyled>
  );
});
