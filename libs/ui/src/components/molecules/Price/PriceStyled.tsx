'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { PriceStyledProps, PriceValueStyledProps } from './Price.types';

export const PriceStyled = forwardRef<HTMLDivElement, PriceStyledProps>((props, forwardedRef) => {
  const { styles = {}, theme: { price, ...rest } = {}, ...restProps } = props;
  const themePrice = new Proxy(price || {}, tokensHandler(rest));
  const computedStyles = {
    ...get(themePrice, 'default', {}),
    ...styles,
  };
  return <div ref={forwardedRef} css={computedStyles} {...restProps} />;
});

export const CurrentPriceStyled = (props: PriceValueStyledProps<HTMLSpanElement>) => {
  const { theme: { price, ...rest } = {}, $size, ...restProps } = props;
  const themePrice = new Proxy(price || {}, tokensHandler(rest));
  const sizeMap: Record<string, string> = { sm: 'currentPrice.sm', lg: 'currentPrice.lg' };
  const tokenKey = sizeMap[$size || 'md'] || 'currentPrice.default';
  const computedStyles = {
    ...get(themePrice, tokenKey, {}),
  };
  return <span css={computedStyles} {...restProps} />;
};

export const OldPriceStyled = (props: PriceValueStyledProps<HTMLModElement>) => {
  const { theme: { price, ...rest } = {}, $size, ...restProps } = props;
  const themePrice = new Proxy(price || {}, tokensHandler(rest));
  const sizeMap: Record<string, string> = { sm: 'oldPrice.sm', lg: 'oldPrice.lg' };
  const tokenKey = sizeMap[$size || 'md'] || 'oldPrice.default';
  const computedStyles = {
    ...get(themePrice, tokenKey, {}),
  };

  return <del css={computedStyles} {...restProps} />;
};
