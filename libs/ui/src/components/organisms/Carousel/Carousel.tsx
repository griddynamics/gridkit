'use client';
import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  Children,
  ReactElement,
  ReactNode,
  isValidElement,
  cloneElement,
  Fragment,
} from 'react';

import { get } from '@utils';
import { ButtonVariant, CarouselVariantTypes, LayoutType, TabIndex, ThumbsPosition, TypographyVariant } from '@types';
import { useCarousel } from '@hooks/useCarousel';
import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { Icon } from '@components/atoms/Icon';
import { Image, ImageProps } from '@components/atoms/Image';
import { Typography } from '@components/atoms/Typography';
import { TypographyProps } from '@components/atoms/Typography/Typography.types';

import { COMPONENT_NAME } from './constants';
import { CarouselProps, CarouselRef, ExtractedCarousel } from './Carousel.types';

import {
  CarouselContainerStyled,
  CarouselViewportStyled,
  CarouselSlideStyled,
  CarouselControlsStyled,
  CarouselControlsButtonStyled,
  CarouselControlsWrapperStyled,
  CarouselViewportSlideWrapperStyled,
  CarouselDotsStyled,
  CarouselDotStyled,
  CarouselThumbsStyled,
  CarouselThumbStyled,
  ContentContainerStyled,
  CarouselThumbsViewportStyled,
  CarouselThumbsWrapperStyled,
  CarouselSlidePlaceholderStyled,
  CarouselSlideOverlayContainerStyled,
  CarouselSlideOverlayBackdropStyled,
  CarouselSlideOverlayChildrenStyled,
} from './CarouselStyled';

export function extractCarouselNodes(children: ReactNode): ExtractedCarousel {
  const images: ReactElement[] = [];

  function recurse(nodes: ReactNode): ReactNode[] {
    return Children.toArray(nodes).flatMap((child) => {
      if (!isValidElement(child)) {
        return [child];
      }

      if (child.type === Carousel.Image) {
        images.push(child);
        return [];
      }

      const { children: grandChildren, ...rest } = child.props;
      if (grandChildren) {
        const newChildren = recurse(grandChildren);
        if (newChildren.length === 0) {
          return [];
        }

        return [cloneElement(child as ReactElement, rest, newChildren)];
      }

      return [child];
    });
  }

  const contentNodes = recurse(children);
  return {
    images,
    content: contentNodes.length > 0 ? <Fragment>{contentNodes}</Fragment> : null,
  };
}

const CarouselComponent = forwardRef<CarouselRef, CarouselProps>(
  (
    {
      layout = LayoutType.Horizontal,
      variant = CarouselVariantTypes.Cards,
      showArrows = true,
      isFocusable = true,
      showDots = false,
      thumbs = ThumbsPosition.End,
      options,
      styles,
      children,
    }: CarouselProps,
    forwardedRef
  ) => {
    const visibleThumbsCount = 3;
    const { theme } = useTheme();
    const logger = useLogger();
    const { images, content } = extractCarouselNodes(children);
    const activeIconColor = get(theme, 'colors.icon.default');
    const disabledIconColor = get(theme, 'colors.icon.disabled');
    const {
      icons: { base: controlBase, controlLeft, controlRight },
    } = get(theme, 'carousel');
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbsViewportRef = useRef<HTMLDivElement | null>(null);
    const shouldCenterThumbs = images.length <= 2;
    const {
      carouselRef,
      carouselApi,
      thumbsRef,
      activeIndex,
      scrollTo,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      slidesCount,
    } = useCarousel({
      options: {
        ...options,
        axis: layout === 'vertical' ? 'y' : 'x',
        ...(layout === 'vertical' && options?.align == null ? { align: 'start' } : {}),
      },
      thumbsVisibleItems: visibleThumbsCount,
      targetRef: containerRef,
    });

    const handleScrollPrev = useCallback(
      (trigger: 'control' | 'thumbnail-control' | 'ref') => {
        logger.debug(`${COMPONENT_NAME}: Navigate previous`, {
          trigger,
          activeIndex,
          slidesCount,
          layout,
        });
        scrollPrev();
      },
      [activeIndex, layout, logger, scrollPrev, slidesCount]
    );

    const handleScrollNext = useCallback(
      (trigger: 'control' | 'thumbnail-control' | 'ref') => {
        logger.debug(`${COMPONENT_NAME}: Navigate next`, {
          trigger,
          activeIndex,
          slidesCount,
          layout,
        });
        scrollNext();
      },
      [activeIndex, layout, logger, scrollNext, slidesCount]
    );

    const handleScrollTo = useCallback(
      (index: number, trigger: 'dot' | 'thumbnail' | 'ref') => {
        logger.debug(`${COMPONENT_NAME}: Navigate to slide`, {
          trigger,
          activeIndex,
          targetIndex: index,
          slidesCount,
          layout,
        });
        scrollTo(index);
      },
      [activeIndex, layout, logger, scrollTo, slidesCount]
    );

    const setThumbsViewportRef = useCallback(
      (node: HTMLDivElement | null) => {
        thumbsViewportRef.current = node;
        if (layout !== 'vertical' && typeof thumbsRef === 'function') {
          thumbsRef(node);
        }
      },
      [layout, thumbsRef]
    );

    useEffect(() => {
      if (layout !== 'vertical') return;
      const viewport = thumbsViewportRef.current;
      if (!viewport) return;
      const activeThumb = viewport.querySelector(
        `[data-testid="${COMPONENT_NAME}-thumbnail-${activeIndex}"]`
      ) as HTMLElement | null;
      if (typeof activeThumb?.scrollIntoView === 'function') {
        activeThumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }, [activeIndex, layout]);

    useImperativeHandle(
      forwardedRef,
      () => ({
        scrollPrev: () => handleScrollPrev('ref'),
        scrollNext: () => handleScrollNext('ref'),
        scrollTo: (index) => handleScrollTo(index, 'ref'),
        carouselApi,
        selectedIndex: activeIndex,
      }),
      [activeIndex, carouselApi, handleScrollNext, handleScrollPrev, handleScrollTo]
    );

    return (
      <CarouselContainerStyled
        ref={containerRef}
        theme={theme}
        $layout={layout}
        styles={styles}
        $variant={variant}
        tabIndex={isFocusable ? TabIndex.Default : TabIndex.Disabled}
        data-testid={COMPONENT_NAME}
      >
        <CarouselControlsWrapperStyled
          data-testid={`${COMPONENT_NAME}-controls-wrapper`}
          theme={theme}
          $layout={layout}
          styles={{ order: thumbs === ThumbsPosition.Start ? 1 : 'inherit' }}
        >
          {showArrows && (
            <CarouselControlsStyled theme={theme} data-testid={`${COMPONENT_NAME}-controls`}>
              <CarouselControlsButtonStyled
                isIcon
                theme={theme}
                variant={ButtonVariant.Text}
                onClick={() => handleScrollPrev('control')}
                disabled={!canScrollPrev}
                data-testid={`${COMPONENT_NAME}-control-previous`}
              >
                <Icon {...controlBase} name="arrowLeft" fill={canScrollPrev ? activeIconColor : disabledIconColor} />
              </CarouselControlsButtonStyled>

              <CarouselControlsButtonStyled
                isIcon
                theme={theme}
                variant={ButtonVariant.Text}
                styles={{ transform: 'rotate(180deg)' }}
                onClick={() => handleScrollNext('control')}
                disabled={!canScrollNext}
                data-testid={`${COMPONENT_NAME}-control-next`}
              >
                <Icon {...controlBase} name="arrowLeft" fill={canScrollNext ? activeIconColor : disabledIconColor} />
              </CarouselControlsButtonStyled>
            </CarouselControlsStyled>
          )}

          {content ? (
            <ContentContainerStyled theme={theme} data-testid={`${COMPONENT_NAME}-content-container`}>
              {content}
            </ContentContainerStyled>
          ) : null}
          <CarouselViewportStyled
            theme={theme}
            $layout={layout}
            ref={carouselRef}
            data-testid={`${COMPONENT_NAME}-viewport`}
          >
            <CarouselViewportSlideWrapperStyled
              theme={theme}
              $layout={layout}
              data-testid={`${COMPONENT_NAME}-slider-wrapper`}
            >
              {images?.map((child, index) => (
                <CarouselSlideStyled
                  theme={theme}
                  $layout={layout}
                  key={`viewport-slide-${index}`}
                  data-testid={`${COMPONENT_NAME}-slide-${index}`}
                >
                  {child}
                </CarouselSlideStyled>
              ))}
            </CarouselViewportSlideWrapperStyled>
          </CarouselViewportStyled>
          {showDots && (
            <CarouselDotsStyled theme={theme} data-testid={`${COMPONENT_NAME}-dots`}>
              {Array.from({ length: slidesCount })?.map((_, index) => (
                <CarouselDotStyled
                  theme={theme}
                  key={`dot-${index}`}
                  $active={index === activeIndex}
                  onClick={() => handleScrollTo(index, 'dot')}
                  data-active={index === activeIndex}
                />
              ))}
            </CarouselDotsStyled>
          )}
        </CarouselControlsWrapperStyled>

        {thumbs && (
          <CarouselThumbsStyled theme={theme} $layout={layout} data-testid={`${COMPONENT_NAME}-thumbnails`}>
            <CarouselControlsButtonStyled
              isIcon
              theme={theme}
              variant={ButtonVariant.Text}
              styles={{ transform: `rotate(${layout === 'vertical' ? '90' : '0'}deg)` }}
              onClick={() => handleScrollPrev('thumbnail-control')}
              disabled={!canScrollPrev}
              data-testid={`${COMPONENT_NAME}-thumbnail-control-previous`}
            >
              <Icon {...controlBase} {...controlLeft} fill={canScrollPrev ? activeIconColor : disabledIconColor} />
            </CarouselControlsButtonStyled>
            <CarouselThumbsViewportStyled
              theme={theme}
              $layout={layout}
              $centered={shouldCenterThumbs}
              data-testid={`${COMPONENT_NAME}-thumbs-viewport`}
              ref={setThumbsViewportRef}
            >
              <CarouselThumbsWrapperStyled
                theme={theme}
                $layout={layout}
                $centered={shouldCenterThumbs}
                data-testid={`${COMPONENT_NAME}-thumbs-wrapper`}
              >
                {images?.map((image, index) => (
                  <CarouselThumbStyled
                    key={`thumb-${index}`}
                    theme={theme}
                    $layout={layout}
                    $active={index === activeIndex}
                    onClick={() => handleScrollTo(index, 'thumbnail')}
                    data-testid={`${COMPONENT_NAME}-thumbnail-${index}`}
                    data-active={index === activeIndex}
                  >
                    {cloneElement(image, {}, null)}
                  </CarouselThumbStyled>
                ))}
              </CarouselThumbsWrapperStyled>
            </CarouselThumbsViewportStyled>
            <CarouselControlsButtonStyled
              isIcon
              theme={theme}
              variant={ButtonVariant.Text}
              onClick={() => handleScrollNext('thumbnail-control')}
              styles={{ transform: `rotate(${layout === 'vertical' ? '90' : '0'}deg)` }}
              disabled={!canScrollNext}
              data-testid={`${COMPONENT_NAME}-thumbnail-control-next`}
            >
              <Icon {...controlBase} {...controlRight} fill={canScrollNext ? activeIconColor : disabledIconColor} />
            </CarouselControlsButtonStyled>
          </CarouselThumbsStyled>
        )}
      </CarouselContainerStyled>
    );
  }
);

CarouselComponent.displayName = COMPONENT_NAME;

export const Carousel = Object.assign(CarouselComponent, {
  Slide: CarouselSlideStyled,
  Image: ({ children, ...props }: Partial<ImageProps> & { children?: ReactNode }) => {
    const { theme } = useTheme();
    const slideImageStyles = get(theme, 'carousel.slideImage', {}) as ImageProps['styles'];
    const hasImage = !!props.src;
    const hasOverlay = children !== undefined && children !== null;

    if (hasImage && !hasOverlay) {
      return <Image styles={slideImageStyles} {...(props as ImageProps)} />;
    }

    if (!hasImage && !hasOverlay) {
      return <CarouselSlidePlaceholderStyled theme={theme} />;
    }

    return (
      <CarouselSlideOverlayContainerStyled theme={theme}>
        {hasImage ? (
          <Image styles={slideImageStyles} {...(props as ImageProps)} />
        ) : (
          <CarouselSlideOverlayBackdropStyled theme={theme} />
        )}
        <CarouselSlideOverlayChildrenStyled theme={theme}>{children}</CarouselSlideOverlayChildrenStyled>
      </CarouselSlideOverlayContainerStyled>
    );
  },
  Title: (props: TypographyProps) => <Typography variant={TypographyVariant.H1} {...props} />,
  Description: (props: TypographyProps) => <Typography variant={TypographyVariant.Body1} {...props} />,
  Content: (props: TypographyProps) => {
    const { theme } = useTheme();
    return <Typography styles={get(theme, 'carousel.contentTypography', {})} {...props} />;
  },
});
