'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Image } from '@components/atoms/Image';
import { get } from '@utils';

import { COMPONENT_NAME } from './constants';
import { ChatImageGalleryStyled } from './ChatImageGalleryStyled';
import type { ChatImageGalleryProps } from '../ChatBubble.types';

export const ChatImageGallery = forwardRef<HTMLDivElement, ChatImageGalleryProps>((props, forwardedRef) => {
  const { images, onImageClick, maxVisible = 4, ...rest } = props;
  const { theme } = useTheme();

  const visibleImages = images.slice(0, maxVisible);
  const remaining = images.length - maxVisible;

  const imageStyles = get(theme, 'chatbubble.imageGallery.image', {});
  const overlayStyles = get(theme, 'chatbubble.imageGallery.overlay', {});
  const imgStyles = get(theme, 'chatbubble.imageGallery.imageStyles', {});

  return (
    <ChatImageGalleryStyled ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME} {...rest}>
      {visibleImages.map((img, idx) => (
        <button
          key={idx}
          type="button"
          css={imageStyles}
          onClick={(e) => onImageClick?.(idx, e)}
          aria-label={img.alt || `Image ${idx + 1}`}
          data-testid={`${COMPONENT_NAME}-image-${idx}`}
        >
          <Image src={img.src} alt={img.alt || ''} styles={imgStyles} />
          {idx === maxVisible - 1 && remaining > 0 && (
            <span css={overlayStyles} data-testid={`${COMPONENT_NAME}-remaining`}>
              +{remaining}
            </span>
          )}
        </button>
      ))}
    </ChatImageGalleryStyled>
  );
});

ChatImageGallery.displayName = COMPONENT_NAME;
