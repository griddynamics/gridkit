'use client';
import type { CSSObject } from '@emotion/react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { CardTextStyledProps, Typography } from '@components';

import { BoxStyles } from '@types';
import { DESCRIPTION_SIZE } from './constants';

export const CardDescriptionStyled = (props: CardTextStyledProps) => {
  const { theme: { card, ...rest } = {}, $sizeVariant, $cardVariant, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCard = new Proxy(card || {}, tokensHandler(rest));
  const variant = DESCRIPTION_SIZE[$sizeVariant];
  const componentStyles = get(themeCard, 'description', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$cardVariant, $sizeVariant], {}),
    boxStyles,
    styles,
  ] as unknown as CSSObject;

  return <Typography styles={computedStyles as CSSObject} as="div" variant={variant} {...restNotStyledProps} />;
};
