import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type {
  ImageWrapperStyledProps,
  ImageStyledProps,
  ImagePlaceholderStyledProps,
  ImageCaptionStyledProps,
} from './';

export const ImageWrapperStyled = (props: ImageWrapperStyledProps) => {
  const { width, height, $as: Component = 'div', theme: { image, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeImage = new Proxy(image || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeImage, 'wrapper', {}),
    {
      width: `${width ? `${width}px` : '100%'}`,
      height: `${height ? `${height}px` : '100%'}`,
    },
    boxStyles,
    styles,
  ];

  return <Component css={computedStyles} {...restNotStyledProps} />;
};

export const ImageStyled = forwardRef<HTMLImageElement, ImageStyledProps>((props, forwardRef) => {
  const {
    objectFit = 'cover',
    $isLoading,
    theme: { image, ...rest } = {},
    styles,
    width,
    height,
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeImage = new Proxy(image || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeImage, 'default', {}),
    {
      objectFit,
      opacity: `${$isLoading ? 0 : 1}`,
    },
    boxStyles,
    styles,
  ];

  return <img css={computedStyles} width={width} height={height} {...restNotStyledProps} ref={forwardRef} />;
});

export const PlaceholderStyled = (props: ImagePlaceholderStyledProps) => {
  const { theme: { image, ...rest } = {}, $as: Component = 'span', styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeImage = new Proxy(image || {}, tokensHandler(rest));
  const computedStyles = [get(themeImage, 'placeholder', {}), boxStyles, styles];

  return <Component css={computedStyles} {...restNotStyledProps} />;
};

export const CaptionStyled = (props: ImageCaptionStyledProps) => {
  const { theme: { image, ...rest } = {}, $as: Component = 'figcaption', styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeImage = new Proxy(image || {}, tokensHandler(rest));
  const computedStyles = [get(themeImage, 'caption', {}), boxStyles, styles];

  return <Component css={computedStyles} {...restNotStyledProps} />;
};
