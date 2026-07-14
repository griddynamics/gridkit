'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { InputPropsStyled } from './';

export const InputStyled = forwardRef<HTMLInputElement, InputPropsStyled>((props, forwardedRef) => {
  const { theme: { input, ...rest } = {}, $isMouseInteraction, $color, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeInput = new Proxy(input || {}, tokensHandler(rest));
  const componentStyles = get(themeInput, 'input', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$isMouseInteraction ? 'mouseInteraction' : 'defaultInteraction'], {}),
    get(componentStyles, $color, {}),
    boxStyles,
    styles,
  ];

  return <input css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
