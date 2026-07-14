'use client';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { CardCounterStyledProps } from '@components';
import type { BoxStyles } from '@types';

export const CardCounterStyled = (props: CardCounterStyledProps) => {
  const { theme: { card, ...rest } = {}, $cardVariant, $sizeVariant, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCard = new Proxy(card || {}, tokensHandler(rest));
  const componentStyles = get(themeCard, 'counter', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$cardVariant, $sizeVariant], {}),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} />;
};
