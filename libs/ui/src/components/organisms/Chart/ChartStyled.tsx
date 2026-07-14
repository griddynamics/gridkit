'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { CommonCssComponentStyledProps } from '@components';

export const ChartContainerStyled = forwardRef<HTMLDivElement, CommonCssComponentStyledProps>((props, forwardedRef) => {
  const { theme: { chart, ...rest } = {}, styles = {}, children, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChart = new Proxy(chart || {}, tokensHandler(rest));
  const computedStyles = [get(themeChart, 'container.default', {}), boxStyles, styles];

  return (
    <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef}>
      {children}
    </div>
  );
});

export const ChartEmptyStateStyled = (props: CommonCssComponentStyledProps) => {
  const { theme: { chart, ...rest } = {}, styles, children, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChart = new Proxy(chart || {}, tokensHandler(rest));
  const computedStyles = [get(themeChart, 'emptyState.default', {}), boxStyles, styles];

  return (
    <div css={computedStyles} {...restNotStyledProps}>
      {children}
    </div>
  );
};

export const ChartErrorStateStyled = (props: CommonCssComponentStyledProps) => {
  const { theme: { chart, ...rest } = {}, styles, children, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChart = new Proxy(chart || {}, tokensHandler(rest));
  const computedStyles = [get(themeChart, 'errorState.default', {}), boxStyles, styles];

  return (
    <div css={computedStyles} {...restNotStyledProps}>
      {children}
    </div>
  );
};
