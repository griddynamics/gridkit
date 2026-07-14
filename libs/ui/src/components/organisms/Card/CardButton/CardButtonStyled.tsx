'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import { CardButtonStyledProps } from '@components';
import type { BoxStyles } from '@types';

export const CardButtonStyled = forwardRef<HTMLDivElement, CardButtonStyledProps>((props, forwardedRef) => {
  const { theme: { card, ...rest } = {}, $cardVariant, $sizeVariant, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCard = new Proxy(card || {}, tokensHandler(rest));
  const componentStyles = get(themeCard, 'button', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$cardVariant, $sizeVariant], {}),
    boxStyles,
    styles,
  ];
  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
