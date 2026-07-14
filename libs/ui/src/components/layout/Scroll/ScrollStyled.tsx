import { forwardRef } from 'react';

import { get } from '@utils';

import { tokensHandler } from '@tokens';
import type { ScrollBarStyledProps, ScrollStyledProps } from './';

export const ScrollStyled = forwardRef<HTMLDivElement, ScrollStyledProps>((props, forwardedRef) => {
  const { theme: { scroll, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeScroll = new Proxy(scroll || {}, tokensHandler(rest));
  const computedStyles = [get(themeScroll, 'container.default', {}), styles];

  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const ScrollContentStyled = forwardRef<HTMLDivElement, ScrollStyledProps>((props, forwardedRef) => {
  const { theme: { scroll, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeScroll = new Proxy(scroll || {}, tokensHandler(rest));
  const computedStyles = [get(themeScroll, 'content.default', {}), styles];

  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const ScrollBarsStyled = (props: ScrollStyledProps) => {
  const { theme: { scroll, ...rest } = {}, ...restProps } = props;
  const themeScroll = new Proxy(scroll || {}, tokensHandler(rest));
  const computedStyles = get(themeScroll, 'scrollbars.default', {});

  return <div css={computedStyles} {...restProps} />;
};

export const ScrollBarStyled = (props: ScrollBarStyledProps) => {
  const { $direction, $autoHide, $isScrolling, theme: { scroll, ...rest } = {}, ...restProps } = props;
  const themeScroll = new Proxy(scroll || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeScroll, 'scrollbar.default', {}),
    get(themeScroll, `scrollbar.${$direction}`, {}),
    $autoHide && get(themeScroll, 'scrollbar.autoHide', {}),
    $autoHide && $isScrolling && get(themeScroll, 'scrollbar.autoHideScrolling', {}),
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const ScrollBarThumbStyled = forwardRef<HTMLDivElement, ScrollBarStyledProps>((props, forwardedRef) => {
  const { $direction, $autoHide, $isScrolling, theme: { scroll, ...rest } = {}, ...restProps } = props;
  const themeScroll = new Proxy(scroll || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeScroll, 'thumb.default', {}),
    get(themeScroll, `thumb.${$direction}`, {}),
    $autoHide && get(themeScroll, 'thumb.autoHide', {}),
    $autoHide && $isScrolling && get(themeScroll, 'thumb.autoHideScrolling', {}),
  ];

  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});
