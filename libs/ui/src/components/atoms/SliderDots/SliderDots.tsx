'use client';
import { forwardRef, useCallback } from 'react';

import { useTheme } from '@hooks/useTheme';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import { COMPONENT_NAME } from './constants';
import { SliderDotsStyled } from './SliderDotsStyled';
import type { SliderDotsProps } from './SliderDots.types';

export const SliderDots = forwardRef<HTMLDivElement, SliderDotsProps>((props, forwardedRef) => {
  const { count, activeIndex = 0, onDotClick, ...rest } = props;
  const { theme } = useTheme();

  const { sliderDots, ...restTheme } = theme;
  const themedSliderDots = new Proxy(sliderDots || {}, tokensHandler(restTheme) as ProxyHandler<typeof sliderDots>);
  const dotDefault = get(themedSliderDots, 'dot.default', {});
  const dotActive = get(themedSliderDots, 'dot.active', {});

  const handleClick = useCallback(
    (index: number) => {
      onDotClick?.(index);
    },
    [onDotClick]
  );

  return (
    <SliderDotsStyled ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME} role="tablist" {...rest}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          css={[dotDefault, index === activeIndex ? dotActive : {}]}
          onClick={() => handleClick(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-selected={index === activeIndex}
          role="tab"
          data-testid={`${COMPONENT_NAME}-dot-${index}`}
        />
      ))}
    </SliderDotsStyled>
  );
});

SliderDots.displayName = COMPONENT_NAME;
