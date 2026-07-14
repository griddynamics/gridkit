'use client';
import { useState, useCallback, useEffect } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';
import Wrapper from '@components/atoms/Wrapper/Wrapper';
import { WrapperVariant } from '@types';
import { get } from '@utils';

import { COMPONENT_NAME } from './constants';
import type { ImagePreviewLightboxProps } from './ImagePreview.types';

export const ImagePreviewLightbox = (props: ImagePreviewLightboxProps) => {
  const { isOpen, images, initialIndex = 0, onClose } = props;
  const { theme } = useTheme();

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setActiveIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  const goPrev = useCallback(() => {
    if (canGoPrev) setActiveIndex((prev) => prev - 1);
  }, [canGoPrev]);

  const goNext = useCallback(() => {
    if (canGoNext) setActiveIndex((prev) => prev + 1);
  }, [canGoNext]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[activeIndex];
  const overlayStyles = get(theme, 'imagePreview.lightbox.overlay', {});
  const closeStyles = get(theme, 'imagePreview.lightbox.close', {});
  const closeIconProps = get(theme, 'imagePreview.lightbox.closeIcon', { name: 'cross' });
  const imageStyles = get(theme, 'imagePreview.lightbox.image', {});
  const arrowStyles = get(theme, 'imagePreview.arrow.default', {});
  const arrowPrevIconProps = get(theme, 'imagePreview.arrow.icon.prev', { name: 'arrowLeft' });
  const arrowNextIconProps = get(theme, 'imagePreview.arrow.icon.next', { name: 'arrowRight' });
  const lightboxArrowStyles = get(theme, 'imagePreview.lightbox.arrow', {});
  const counterStyles = get(theme, 'imagePreview.counter.default', {});
  const lightboxCounterStyles = get(theme, 'imagePreview.lightbox.counter', {});

  return (
    <Wrapper
      variant={WrapperVariant.FullPage}
      css={overlayStyles}
      onClick={(e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid={`${COMPONENT_NAME}-lightbox`}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        css={closeStyles}
        onClick={onClose}
        aria-label="Close preview"
        data-testid={`${COMPONENT_NAME}-lightbox-close`}
      >
        <Icon {...closeIconProps} />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          css={[arrowStyles, get(theme, 'imagePreview.arrow.prev', {}), lightboxArrowStyles]}
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous image"
        >
          <Icon {...arrowPrevIconProps} />
        </button>
      )}

      <img src={currentImage.src} alt={currentImage.alt || ''} css={imageStyles} />

      {images.length > 1 && (
        <button
          type="button"
          css={[arrowStyles, get(theme, 'imagePreview.arrow.next', {}), lightboxArrowStyles]}
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next image"
        >
          <Icon {...arrowNextIconProps} />
        </button>
      )}

      <span css={[counterStyles, lightboxCounterStyles]}>
        {activeIndex + 1}/{images.length}
      </span>
    </Wrapper>
  );
};

ImagePreviewLightbox.displayName = `${COMPONENT_NAME}Lightbox`;
