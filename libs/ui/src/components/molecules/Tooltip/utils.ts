'use client';

import { useCallback, useEffect, useRef, useState, useId } from 'react';

import type { EnumOrPrimitive, Maybe } from '@types';
import type { TooltipPosition } from './Tooltip.types';

import { DEFAULT_DELAY, DEFAULT_GAP } from './constants';
// Global event to hide all tooltips when one is shown
const TOOLTIP_HIDE_ALL_EVENT = 'tooltip:hideAll';

export const useTooltip = (
  position: EnumOrPrimitive<TooltipPosition> = 'top',
  delay = DEFAULT_DELAY,
  gap = DEFAULT_GAP
) => {
  const [isVisible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: -1000, left: -1000 });
  const [positionWithFallback, setFallbackPosition] = useState(position);

  const containerRef = useRef<Maybe<HTMLDivElement>>(null);
  const tooltipRef = useRef<Maybe<HTMLDivElement>>(null);
  const timeoutRef = useRef<Maybe<NodeJS.Timeout>>(null);
  const recalculationTimeoutRef = useRef<Maybe<NodeJS.Timeout>>(null);
  const instanceIdRef = useRef<string>(`tooltip-${useId()}`);

  const computeAndSetCoords = useCallback(() => {
    if (!tooltipRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect: DOMRect = tooltipRef.current.getBoundingClientRect();

    // Ensure tooltip has valid dimensions before calculating position
    // This prevents using stale dimensions from previous tooltip renders
    if (tooltipRect.width === 0 && tooltipRect.height === 0) {
      // Tooltip not yet rendered, schedule recalculation with a small delay
      // Clear any existing recalculation timeout to prevent multiple scheduled calls
      if (recalculationTimeoutRef.current) {
        clearTimeout(recalculationTimeoutRef.current);
      }
      recalculationTimeoutRef.current = setTimeout(() => {
        recalculationTimeoutRef.current = null;
        computeAndSetCoords();
      }, 10);
      return;
    }

    // Clear any pending recalculation since we have valid dimensions now
    if (recalculationTimeoutRef.current) {
      clearTimeout(recalculationTimeoutRef.current);
      recalculationTimeoutRef.current = null;
    }

    const initial = getCoords(containerRect, tooltipRect, position, gap);
    const fallBack = getFallbackPosition(position, tooltipRect, initial);

    setFallbackPosition(fallBack);
    setCoords(fallBack === position ? initial : getCoords(containerRect, tooltipRect, fallBack, gap));
  }, [gap, position]);

  const showTooltip = useCallback(() => {
    // Clear any existing timeout to prevent multiple tooltips from showing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Immediately hide if already visible to prevent multiple tooltips
    if (isVisible) {
      setVisible(false);
      setCoords({ top: -1000, left: -1000 });
    }

    // Dispatch event to hide all other tooltips
    document.dispatchEvent(new CustomEvent(TOOLTIP_HIDE_ALL_EVENT, { detail: { except: instanceIdRef.current } }));

    timeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        // Reset coordinates before showing to prevent stale positioning
        setCoords({ top: -1000, left: -1000 });
        setVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            computeAndSetCoords();
          });
        });
      }
    }, delay);
  }, [delay, computeAndSetCoords, isVisible]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (recalculationTimeoutRef.current) {
      clearTimeout(recalculationTimeoutRef.current);
      recalculationTimeoutRef.current = null;
    }
    // Reset coordinates when hiding to prevent stale positioning on next show
    setCoords({ top: -1000, left: -1000 });
    setVisible(false);
  }, []);

  // Listen for global hide event to hide this tooltip when another is shown
  useEffect(() => {
    const handleHideAll = (e: Event) => {
      const customEvent = e as CustomEvent<{ except?: string }>;
      // Hide this tooltip if it's not the one that triggered the event
      if (customEvent.detail?.except !== instanceIdRef.current) {
        hideTooltip();
      }
    };

    document.addEventListener(TOOLTIP_HIDE_ALL_EVENT, handleHideAll);

    return () => {
      document.removeEventListener(TOOLTIP_HIDE_ALL_EVENT, handleHideAll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (recalculationTimeoutRef.current) {
        clearTimeout(recalculationTimeoutRef.current);
        recalculationTimeoutRef.current = null;
      }
    };
  }, [hideTooltip]);

  // Recalculate coordinates when tooltip becomes visible
  // This ensures coordinates are calculated even if the initial calculation was missed
  useEffect(() => {
    if (!isVisible) return;

    // Use a small delay to ensure tooltip is in DOM and has dimensions
    requestAnimationFrame(() => {
      if (tooltipRef.current && containerRef.current && isVisible) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        // Only recalculate if coordinates are still at default (not calculated) or tooltip has valid dimensions
        if ((coords.top === -1000 && coords.left === -1000) || (tooltipRect.width > 0 && tooltipRect.height > 0)) {
          computeAndSetCoords();
        }
      }
    });
  }, [isVisible, computeAndSetCoords]);

  // Mobile/outside interactions and repositioning
  useEffect(() => {
    if (!isVisible) return;
    if (typeof window === 'undefined') return;

    const handleOutsidePointer = (e: Event) => {
      const target = e.target as Node | null;
      const container = containerRef.current;
      const tooltip = tooltipRef.current;
      if (!container || !target) return;
      if (container.contains(target)) return;
      if (tooltip && tooltip.contains(target)) return;
      hideTooltip();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideTooltip();
    };

    const handleResize = () => {
      if (isVisible && tooltipRef.current && containerRef.current) {
        computeAndSetCoords();
      }
    };
    const handleScroll = () => {
      if (isVisible && tooltipRef.current && containerRef.current) {
        computeAndSetCoords();
      }
    };

    // Hide tooltip when window loses focus (switching to another window/app)
    const handleWindowBlur = () => hideTooltip();

    // Hide tooltip when tab becomes hidden (switching tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleOutsidePointer, true);
    document.addEventListener('touchstart', handleOutsidePointer, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('mousedown', handleOutsidePointer, true);
      document.removeEventListener('touchstart', handleOutsidePointer, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [computeAndSetCoords, hideTooltip, isVisible]);

  return { isVisible, coords, containerRef, tooltipRef, showTooltip, hideTooltip, positionWithFallback };
};

// Calculate initial coordinates for the tooltip
export const getCoords = (
  containerRect: DOMRect,
  tooltipRect: DOMRect,
  tooltipPosition: EnumOrPrimitive<TooltipPosition>,
  gap: number
) => {
  switch (tooltipPosition) {
    case 'top': {
      return {
        top: containerRect.top + window.scrollY - tooltipRect.height - gap,
        left: containerRect.left + window.scrollX + containerRect.width / 2,
      };
    }
    case 'bottom': {
      return {
        top: containerRect.top + window.scrollY + containerRect.height + gap,
        left: containerRect.left + window.scrollX + containerRect.width / 2,
      };
    }
    case 'left': {
      return {
        top: containerRect.top + window.scrollY + containerRect.height / 2,
        left: containerRect.left + window.scrollX - tooltipRect.width - gap,
      };
    }
    case 'right': {
      return {
        top: containerRect.top + window.scrollY + containerRect.height / 2,
        left: containerRect.right + window.scrollX + gap,
      };
    }
    default:
      throw Error(`Unexpected position '${tooltipPosition}'`);
  }
};

// Calculate fallback position for the tooltip
export const getFallbackPosition = (
  currentPosition: EnumOrPrimitive<TooltipPosition>,
  tooltipRect: DOMRect,
  coords: { left: number; top: number }
): EnumOrPrimitive<TooltipPosition> => {
  let fallBackPosition = currentPosition;

  if (currentPosition === 'top' && coords.top < 0) {
    fallBackPosition = 'bottom';
  } else if (currentPosition === 'bottom' && coords.top + tooltipRect.height > window.innerHeight + window.scrollY) {
    fallBackPosition = 'top';
  } else if (currentPosition === 'left' && coords.left < 0) {
    fallBackPosition = 'right';
  } else if (currentPosition === 'right' && coords.left + tooltipRect.width > window.innerWidth + window.scrollX) {
    fallBackPosition = 'left';
  }

  return fallBackPosition;
};
