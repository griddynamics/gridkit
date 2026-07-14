'use client';
import { useRef, useImperativeHandle, forwardRef, useState, useEffect, useCallback } from 'react';

import {
  CarouselContainerStyled,
  CarouselControlsButtonStyled,
  CarouselDotsStyled,
  CarouselDotStyled,
  CarouselViewportStyled,
  CarouselControlsWrapperStyled,
  CarouselViewportSlideWrapperStyled,
} from '@components/organisms/Carousel/CarouselStyled';
import { useCarousel, useTheme, useLogger } from '@hooks';
import { get } from '@utils';
import { Icon, type IconProps } from '@components';
import { TabIndex, CarouselVariantTypes, LayoutType } from '@types';

import { COMPONENT_NAME } from './constants';
import { CarouselFooterStyled, CarouselFooterControlsStyled, ContentSlideStyled } from './ContentCarouselStyled';
import type { ContentCarouselProps, ContentCarouselRef } from './';

export const ContentCarousel = forwardRef<ContentCarouselRef, ContentCarouselProps<any>>((props, forwardedRef) => {
  const { theme } = useTheme();
  const logger = useLogger();
  const {
    items,
    renderItem,
    showArrows = true,
    isFocusable = true,
    showDots = true,
    styles,
    visibleItems,
    scrollStep = 1,
    scrollAlignment = 'left',
  } = props;
  const activeIconColor = get(theme, 'colors.icon.default');
  const disabledIconColor = get(theme, 'colors.icon.disabled');
  const { base: controlBase, controlLeft, controlRight } = get<Record<string, IconProps>>(theme, 'carousel.icons', {});

  // Ensure scrollStep is always at least 1 for initial scroll (in item widths)
  const effectiveScrollStep = Math.max(1, scrollStep || 1);

  // Map scrollAlignment to Embla's align option (LTR only)
  // Default is 'left' (start), can be set to 'centered' (center)
  const alignMap: Record<string, 'center' | 'start'> = {
    centered: 'center',
    left: 'start',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const {
    carouselRef,
    carouselApi,
    activeIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    slidesCount,
  } = useCarousel({
    options: {
      axis: 'x',
      align: alignMap[scrollAlignment],
      // slidesToScroll works in item widths - scrollStep of 1 means 1 item width, 2 means 2 item widths, etc.
      slidesToScroll: effectiveScrollStep,
      // Ensure proper alignment behavior - start at first item
      startIndex: 0,
      // LTR only - no RTL direction
      direction: 'ltr',
      // Always use snap-based navigation so one arrow click advances one step consistently.
      dragFree: false,
    },
    targetRef: containerRef,
  });

  // Track the number of scroll steps (snaps) instead of items
  const [scrollStepsCount, setScrollStepsCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateScrollStepsCount = () => {
      const scrollSnapList = carouselApi.scrollSnapList();
      setScrollStepsCount(scrollSnapList.length);
    };

    // Update on initialization and when carousel is reinitialized
    updateScrollStepsCount();
    carouselApi.on('reInit', updateScrollStepsCount);

    return () => {
      carouselApi.off('reInit', updateScrollStepsCount);
    };
  }, [carouselApi]);

  const handleScrollPrev = useCallback(
    (trigger: 'control' | 'ref') => {
      logger.debug(`${COMPONENT_NAME}: Navigate previous`, {
        trigger,
        activeIndex,
        slidesCount,
        visibleItems,
        scrollStep: effectiveScrollStep,
        scrollAlignment,
      });
      scrollPrev();
    },
    [activeIndex, effectiveScrollStep, logger, scrollAlignment, scrollPrev, slidesCount, visibleItems]
  );

  const handleScrollNext = useCallback(
    (trigger: 'control' | 'ref') => {
      logger.debug(`${COMPONENT_NAME}: Navigate next`, {
        trigger,
        activeIndex,
        slidesCount,
        visibleItems,
        scrollStep: effectiveScrollStep,
        scrollAlignment,
      });
      scrollNext();
    },
    [activeIndex, effectiveScrollStep, logger, scrollAlignment, scrollNext, slidesCount, visibleItems]
  );

  const handleScrollTo = useCallback(
    (index: number, trigger: 'dot' | 'ref') => {
      logger.debug(`${COMPONENT_NAME}: Navigate to slide`, {
        trigger,
        activeIndex,
        targetIndex: index,
        slidesCount,
        visibleItems,
        scrollStep: effectiveScrollStep,
        scrollAlignment,
      });
      scrollTo(index);
    },
    [activeIndex, effectiveScrollStep, logger, scrollAlignment, scrollTo, slidesCount, visibleItems]
  );

  useImperativeHandle(
    forwardedRef,
    () => ({
      scrollPrev: () => handleScrollPrev('ref'),
      scrollNext: () => handleScrollNext('ref'),
      scrollTo: (index) => handleScrollTo(index, 'ref'),
      selectedIndex: activeIndex,
    }),
    [activeIndex, handleScrollNext, handleScrollPrev, handleScrollTo]
  );

  return (
    <CarouselContainerStyled
      ref={containerRef}
      theme={theme}
      styles={styles}
      $layout={LayoutType.Horizontal}
      $variant={CarouselVariantTypes.Cards}
      tabIndex={isFocusable ? TabIndex.Default : TabIndex.Disabled}
      data-testid={COMPONENT_NAME}
    >
      <CarouselControlsWrapperStyled data-testid={`${COMPONENT_NAME}-controls-wrapper`} theme={theme}>
        <CarouselViewportStyled theme={theme} ref={carouselRef} data-testid={`${COMPONENT_NAME}-viewport`}>
          <CarouselViewportSlideWrapperStyled theme={theme} data-testid={`${COMPONENT_NAME}-slider-wrapper`}>
            {items?.map((item, index) => (
              <ContentSlideStyled
                theme={theme}
                key={index}
                $visibleItems={visibleItems}
                data-testid={`${COMPONENT_NAME}-content-slide-${index}`}
              >
                {renderItem(item, index)}
              </ContentSlideStyled>
            ))}
          </CarouselViewportSlideWrapperStyled>
        </CarouselViewportStyled>
      </CarouselControlsWrapperStyled>

      <CarouselFooterStyled theme={theme} data-testid={`${COMPONENT_NAME}-footer`}>
        {showDots && (
          <CarouselDotsStyled theme={theme} data-testid={`${COMPONENT_NAME}-dots`}>
            {Array.from({ length: scrollStepsCount || slidesCount })?.map((_, index) => (
              <CarouselDotStyled
                theme={theme}
                key={index}
                $active={index === activeIndex}
                onClick={() => handleScrollTo(index, 'dot')}
                data-active={index === activeIndex}
              />
            ))}
          </CarouselDotsStyled>
        )}
        {showArrows && (
          <CarouselFooterControlsStyled theme={theme} data-testid={`${COMPONENT_NAME}-controls`}>
            <CarouselControlsButtonStyled
              theme={theme}
              onClick={() => handleScrollPrev('control')}
              disabled={!canScrollPrev}
              data-testid={`${COMPONENT_NAME}-control-previous`}
            >
              <Icon {...controlBase} {...controlLeft} fill={canScrollPrev ? activeIconColor : disabledIconColor} />
            </CarouselControlsButtonStyled>

            <CarouselControlsButtonStyled
              theme={theme}
              onClick={() => handleScrollNext('control')}
              disabled={!canScrollNext}
              data-testid={`${COMPONENT_NAME}-control-next`}
            >
              <Icon {...controlBase} {...controlRight} fill={canScrollNext ? activeIconColor : disabledIconColor} />
            </CarouselControlsButtonStyled>
          </CarouselFooterControlsStyled>
        )}
      </CarouselFooterStyled>
    </CarouselContainerStyled>
  );
});

ContentCarousel.displayName = COMPONENT_NAME;
