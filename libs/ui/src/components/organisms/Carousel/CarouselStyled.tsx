import { forwardRef } from 'react';

import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { Button } from '@components/atoms/Button';

import type { CarouselStyledProps, CarouselControlsButtonStyledProps } from './Carousel.types';

export const CarouselContainerStyled = forwardRef<HTMLDivElement, CarouselStyledProps>((props, forwardedRef) => {
  const { theme: { carousel, ...rest } = {}, $layout, $variant, styles, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'container.default', {}),
    get(themeCarousel, `container.layout.${$layout}`, {}),
    get(themeCarousel, `container.variant.${$variant}`, {}),
    styles,
  ];
  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const CarouselViewportStyled = forwardRef<HTMLDivElement, CarouselStyledProps>((props, forwardedRef) => {
  const { theme: { carousel, ...rest } = {}, $layout, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselViewport.default', {}),
    get(themeCarousel, `carouselViewport.${$layout}`, {}),
  ];

  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const CarouselThumbsViewportStyled = forwardRef<HTMLDivElement, CarouselStyledProps>((props, forwardedRef) => {
  const { theme: { carousel, ...rest } = {}, $layout, $centered, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselThumbsViewport.default', {}),
    get(themeCarousel, `carouselThumbsViewport.${$layout}`, {}),
    $centered ? get(themeCarousel, `carouselThumbsViewport.centered.${$layout}`, {}) : {},
  ];

  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const ContentContainerStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'contentContainer', {})} {...restProps} />;
};

export const CarouselViewportSlideWrapperStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, $layout, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselViewportSlideWrapper.default', {}),
    get(themeCarousel, `carouselViewportSlideWrapper.${$layout}`, {}),
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const CarouselSlideStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, $layout, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselSlide.default', {}),
    get(themeCarousel, `carouselSlide.${$layout}`, {}),
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const CarouselControlsWrapperStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, styles, $layout, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselControlsWrapper.default', {}),
    get(themeCarousel, `carouselControlsWrapper.${$layout}`, {}),
    styles,
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const CarouselControlsStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'carouselControls', {})} {...restProps} />;
};

export const CarouselControlsButtonStyled = (props: CarouselControlsButtonStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return (
    <Button
      styles={get(themeCarousel, 'controlsButton.default', {})}
      {...get(themeCarousel, 'controlsButton.attrs', {})}
      {...restProps}
    />
  );
};

export const CarouselDotsStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'carouselDots', {})} {...restProps} />;
};

export const CarouselDotStyled = (props: CarouselStyledProps<HTMLButtonElement>) => {
  const { theme: { carousel, ...rest } = {}, $active, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselDot.default', {}),
    $active ? get(themeCarousel, 'carouselDot.active', {}) : get(themeCarousel, 'carouselDot.nonActive', {}),
  ];

  return <button css={computedStyles} {...restProps} />;
};

export const CarouselThumbsStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, $layout, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselThumbs.default', {}),
    get(themeCarousel, `carouselThumbs.${$layout}`, {}),
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const CarouselThumbsWrapperStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, $layout, $centered, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselThumbsWrapper.default', {}),
    get(themeCarousel, `carouselThumbsWrapper.${$layout}`, {}),
    $centered ? get(themeCarousel, `carouselThumbsWrapper.centered.${$layout}`, {}) : {},
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const CarouselSlidePlaceholderStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'slidePlaceholder', {})} {...restProps} />;
};

export const CarouselSlideOverlayContainerStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'slideOverlayContainer', {})} {...restProps} />;
};

export const CarouselSlideOverlayBackdropStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'slideOverlayBackdrop', {})} {...restProps} />;
};

export const CarouselSlideOverlayChildrenStyled = (props: CarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'slideOverlayChildren', {})} {...restProps} />;
};

export const CarouselThumbStyled = (props: CarouselStyledProps<HTMLButtonElement>) => {
  const { theme: { carousel, ...rest } = {}, $active, $layout, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeCarousel, 'carouselThumb.default', {}),
    get(themeCarousel, `carouselThumb.${$layout}`, {}),
    $active ? get(themeCarousel, 'carouselThumb.active', {}) : get(themeCarousel, 'carouselThumb.nonActive', {}),
  ];

  return <button css={computedStyles} {...restProps} />;
};
