'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import type { UseCarouselParams, KeyboardConfig } from '@types';

export const useCarousel = ({
  options = {},
  keyboardConfig = {},
  targetRef,
  onSlideChange,
  thumbsVisibleItems = 1,
}: UseCarouselParams) => {
  const [carouselRef, carouselApi] = useEmblaCarousel(options);
  const thumbsOptions = {
    axis: options.axis,
    align: 'start' as const,
    containScroll: 'keepSnaps' as const,
    direction: options.direction,
    dragFree: false,
    watchDrag: false,
    slidesToScroll: 1,
    startIndex: options.startIndex ?? 0,
  };
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    ...thumbsOptions,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const didApplyInitialIndexRef = useRef(false);

  const updateState = useCallback(() => {
    if (!carouselApi) {
      return;
    }

    const selectedIndex = carouselApi.selectedScrollSnap();
    const totalSlides = carouselApi.slideNodes().length;
    const nextThumbIndex =
      thumbsVisibleItems > 1
        ? Math.min(Math.max(0, selectedIndex - (thumbsVisibleItems - 1)), Math.max(0, totalSlides - thumbsVisibleItems))
        : selectedIndex;

    setActiveIndex(selectedIndex);
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
    thumbsApi?.scrollTo(nextThumbIndex);

    if (onSlideChange) {
      onSlideChange(selectedIndex);
    }
  }, [carouselApi, onSlideChange, thumbsApi, thumbsVisibleItems]);

  const scrollTo = useCallback(
    (index: number) => {
      carouselApi?.scrollTo(index);
    },
    [carouselApi]
  );

  const scrollPrev = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
  }, [carouselApi]);

  const scrollNext = useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
  }, [carouselApi]);

  const defaultKeyboardConfig: KeyboardConfig = {
    ArrowLeft: scrollPrev,
    ArrowRight: scrollNext,
    ArrowUp: options?.axis === 'y' ? scrollPrev : undefined,
    ArrowDown: options?.axis === 'y' ? scrollNext : undefined,
  };

  const finalKeyboardConfig = { ...defaultKeyboardConfig, ...keyboardConfig };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const handler = finalKeyboardConfig[event.key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    },
    [finalKeyboardConfig]
  );

  useEffect(() => {
    const target = targetRef?.current ?? window;
    target.addEventListener('keydown', handleKeyDown as EventListener);
    return () => target.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [handleKeyDown, targetRef]);

  useEffect(() => {
    if (!carouselApi) return;

    const onInit = () => {
      const startIndex = options.startIndex ?? 0;

      if (!didApplyInitialIndexRef.current) {
        carouselApi.scrollTo(startIndex, true);
        thumbsApi?.scrollTo(startIndex, true);
        didApplyInitialIndexRef.current = true;
      }

      updateState();
      setSlidesCount(carouselApi.slideNodes().length);
    };

    carouselApi.on('select', updateState);
    carouselApi.on('reInit', onInit);
    onInit();

    return () => {
      carouselApi?.off('select', updateState);
      carouselApi?.off('reInit', onInit);
    };
  }, [carouselApi, updateState]);

  useEffect(() => {
    didApplyInitialIndexRef.current = false;
  }, [carouselApi]);

  return {
    carouselRef,
    carouselApi,
    thumbsRef,
    thumbsApi,
    activeIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    slidesCount,
  };
};
