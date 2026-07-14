'use client';
import { forwardRef } from 'react';

import type { CSSObject } from '@emotion/react';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import type { SliderStyledProps } from './Slider.types';

export const StyledSlider = forwardRef<HTMLInputElement, SliderStyledProps>((props, forwardedRef) => {
  const { theme: { slider, ...rest } = {}, fillRatio, styles = {}, ...restProps } = props;
  const themeSlider = new Proxy(slider || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeSlider, 'default', {}),
    { '--gd-slider-fill-ratio': fillRatio },
    styles,
  ] as unknown as CSSObject;

  return <input css={computedStyles} {...restProps} ref={forwardedRef} />;
});
