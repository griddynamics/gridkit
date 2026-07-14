'use client';
import { forwardRef, useState, useCallback, useEffect } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';
import { Image } from '@components/atoms/Image';
import { get } from '@utils';

import { COMPONENT_NAME } from './constants';
import { ImagePreviewStyled } from './ImagePreviewStyled';
import type { ImagePreviewProps } from './ImagePreview.types';

export const ImagePreview = forwardRef<HTMLDivElement, ImagePreviewProps>((props, forwardedRef) => {
  const {
    images,
    initialIndex = 0,
    showThumbnails = true,
    showCounter = false,
    showArrows = true,
    thumbnailPosition = 'bottom',
    onImageChange,
    children,
    ...rest
  } = props;
  const { theme } = useTheme();

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onImageChange?.(index);
    },
    [onImageChange]
  );

  const goPrev = useCallback(() => {
    if (canGoPrev) goTo(activeIndex - 1);
  }, [activeIndex, canGoPrev, goTo]);

  const goNext = useCallback(() => {
    if (canGoNext) goTo(activeIndex + 1);
  }, [activeIndex, canGoNext, goTo]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    },
    [goPrev, goNext]
  );

  if (!images.length) return null;

  const currentImage = images[activeIndex];
  const isHorizontal = thumbnailPosition === 'left';

  const containerStyles = [
    get(theme, 'imagePreview.container.default', {}),
    isHorizontal ? get(theme, 'imagePreview.container.horizontal', {}) : {},
  ];

  const mainImageStyles = get(theme, 'imagePreview.mainImage.default', {});
  const mainImageImgStyles = get(theme, 'imagePreview.mainImage.imageStyles', {});
  const arrowStyles = get(theme, 'imagePreview.arrow.default', {});
  const arrowPrevIconProps = get(theme, 'imagePreview.arrow.icon.prev', { name: 'arrowLeft' });
  const arrowNextIconProps = get(theme, 'imagePreview.arrow.icon.next', { name: 'arrowRight' });
  const counterStyles = get(theme, 'imagePreview.counter.default', {});
  const thumbnailsBaseStyles = get(theme, 'imagePreview.thumbnails.default', {});
  const thumbnailsPositionStyles = get(theme, `imagePreview.thumbnails.${thumbnailPosition}`, {});
  const thumbnailImgStyles = get(theme, 'imagePreview.thumbnail.imageStyles', {});

  return (
    <ImagePreviewStyled
      ref={forwardedRef}
      theme={theme}
      data-testid={COMPONENT_NAME}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div css={containerStyles}>
        {isHorizontal && showThumbnails && images.length > 1 && (
          <div css={[thumbnailsBaseStyles, thumbnailsPositionStyles]}>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                css={[
                  get(theme, 'imagePreview.thumbnail.default', {}),
                  idx === activeIndex ? get(theme, 'imagePreview.thumbnail.active', {}) : {},
                ]}
                onClick={() => goTo(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <Image src={img.src} alt={img.alt || ''} styles={thumbnailImgStyles} />
              </button>
            ))}
          </div>
        )}

        <div css={mainImageStyles}>
          {showArrows && images.length > 1 && (
            <button
              type="button"
              css={[arrowStyles, get(theme, 'imagePreview.arrow.prev', {})]}
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous image"
              data-testid={`${COMPONENT_NAME}-prev`}
            >
              <Icon {...arrowPrevIconProps} />
            </button>
          )}

          <Image src={currentImage.src} alt={currentImage.alt || ''} styles={mainImageImgStyles} />

          {showArrows && images.length > 1 && (
            <button
              type="button"
              css={[arrowStyles, get(theme, 'imagePreview.arrow.next', {})]}
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next image"
              data-testid={`${COMPONENT_NAME}-next`}
            >
              <Icon {...arrowNextIconProps} />
            </button>
          )}

          {showCounter && (
            <span css={counterStyles} data-testid={`${COMPONENT_NAME}-counter`}>
              {activeIndex + 1}/{images.length}
            </span>
          )}
        </div>

        {!isHorizontal && showThumbnails && images.length > 1 && (
          <div css={[thumbnailsBaseStyles, thumbnailsPositionStyles]}>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                css={[
                  get(theme, 'imagePreview.thumbnail.default', {}),
                  idx === activeIndex ? get(theme, 'imagePreview.thumbnail.active', {}) : {},
                ]}
                onClick={() => goTo(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <Image src={img.src} alt={img.alt || ''} styles={thumbnailImgStyles} />
              </button>
            ))}
          </div>
        )}
      </div>
      {children}
    </ImagePreviewStyled>
  );
});

ImagePreview.displayName = COMPONENT_NAME;
