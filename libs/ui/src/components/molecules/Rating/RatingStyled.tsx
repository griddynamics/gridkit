'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { RatingProgressStyledProps, RatingStyledProps, RatingCommonStyledProps } from './Rating.types';

export const RatingStyled = forwardRef<HTMLDivElement, RatingStyledProps>((props, forwardedRef) => {
  const { theme: { rating, ...rest } = {}, $readOnly, styles = {}, ...restProps } = props;
  const themeRating = new Proxy(rating || {}, tokensHandler(rest));
  const computedStyles = {
    ...get(themeRating, 'default', {}),
    ...($readOnly ? get(themeRating, 'readOnly', {}) : {}),
    ...styles,
  };
  return <div ref={forwardedRef} css={computedStyles} {...restProps} />;
});

export const RatingProgressWrapperStyled = (props: RatingProgressStyledProps) => {
  const { theme: { rating, ...rest } = {}, $width, ...restProps } = props;
  const themeRating = new Proxy(rating || {}, tokensHandler(rest));
  const computedStyles = {
    ...get(themeRating, 'progress.default', {}),
    width: $width,
  };

  return <div css={computedStyles} {...restProps} />;
};

export const RadioLabelStyled = (props: RatingStyledProps<HTMLLabelElement>) => {
  const { theme: { rating, ...rest } = {}, $readOnly, $isActive, ...restProps } = props;
  const themeRating = new Proxy(rating || {}, tokensHandler(rest));
  const componentStyles = get(themeRating, 'label', {});

  const computedStyles = {
    ...get(componentStyles, 'default', {}),
    ...($readOnly ? get(componentStyles, 'readOnly', {}) : {}),
    ...($isActive ? get(componentStyles, 'active', {}) : {}),
  };
  return <label css={computedStyles} {...restProps} />;
};

export const RadioInputStyled = (props: RatingCommonStyledProps) => {
  const { theme: { rating, ...rest } = {}, ...restProps } = props;
  const themeRating = new Proxy(rating || {}, tokensHandler(rest));
  const computedStyles = {
    ...get(themeRating, 'radioInput.default', {}),
  };

  return <input type="radio" css={computedStyles} {...restProps} />;
};
