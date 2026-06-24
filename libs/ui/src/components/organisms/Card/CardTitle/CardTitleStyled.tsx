'use client';
import type { CSSObject } from '@emotion/react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import { Typography } from '@components/atoms/Typography';

import { BoxStyles } from '@types';
import { TITLE_SIZE } from './constants';
import type { CardTextStyledProps } from '../Card.types';

export const CardTitleStyled = (props: CardTextStyledProps) => {
  const { theme: { card, ...rest } = {}, $sizeVariant, $cardVariant, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCard = new Proxy(card || {}, tokensHandler(rest));
  const variant = TITLE_SIZE[$sizeVariant];
  const componentStyles = get(themeCard, 'title', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$cardVariant, $sizeVariant], {}),
    boxStyles,
    styles,
  ] as unknown as CSSObject;

  return <Typography variant={variant} styles={computedStyles} {...restNotStyledProps} />;
};
