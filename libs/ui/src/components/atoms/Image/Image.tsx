'use client';
import { forwardRef, useCallback, useState } from 'react';

import { useTheme } from '@hooks/useTheme';

import { Skeleton } from '@components';

import { COMPONENT_NAME } from './constants';
import { CaptionStyled, PlaceholderStyled, ImageStyled, ImageWrapperStyled } from './ImageStyled';
import type { ImageProps } from './';

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, forwardRef) => {
  const {
    id,
    src,
    alt,
    width,
    height,
    placeholder,
    caption,
    onClick,
    onLoad,
    onError,
    objectFit,
    fallbackComponent,
    styles,
    as,
    captionAs,
    ...rest
  } = props;
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const shouldShowPlaceholder = isLoading && placeholder && src;
  const shouldShowFallback = (isError || !src) && fallbackComponent;

  const onLoadCallback = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const onErrorCallback = useCallback(() => {
    setIsLoading(false);
    setIsError(true);
    onError?.();
  }, [onError]);
  return (
    <ImageWrapperStyled
      data-testid={`${COMPONENT_NAME}-wrapper`}
      id={id}
      width={width}
      height={height}
      theme={theme}
      $as={as}
      {...rest}
    >
      {shouldShowPlaceholder && (
        <PlaceholderStyled data-testid={`${COMPONENT_NAME}-placeholder`} $as={as} theme={theme}>
          <Skeleton height="100%">{placeholder}</Skeleton>
        </PlaceholderStyled>
      )}
      {shouldShowFallback ? (
        fallbackComponent
      ) : (
        <ImageStyled
          data-testid={COMPONENT_NAME}
          theme={theme}
          src={src}
          alt={alt}
          width={width}
          height={height}
          objectFit={objectFit}
          $isLoading={isLoading}
          onLoad={onLoadCallback}
          onError={onErrorCallback}
          onClick={onClick}
          styles={styles}
          ref={forwardRef}
        />
      )}
      {caption && (
        <CaptionStyled data-testid={`${COMPONENT_NAME}-caption`} $as={captionAs} theme={theme}>
          {caption}
        </CaptionStyled>
      )}
    </ImageWrapperStyled>
  );
});

Image.displayName = COMPONENT_NAME;
