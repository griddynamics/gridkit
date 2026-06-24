'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { SliderDotsStyledProps } from './SliderDots.types';

export const SliderDotsStyled = forwardRef<HTMLDivElement, SliderDotsStyledProps>((props, forwardedRef) => {
  const { theme: { sliderDots, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSliderDots = new Proxy(sliderDots || {}, tokensHandler(rest));

  const computedStyles = [get(themeSliderDots, 'container.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
