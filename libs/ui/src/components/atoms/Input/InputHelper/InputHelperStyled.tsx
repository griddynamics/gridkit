'use client';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { InputHelperPropsStyled } from '../Input.types';

export const InputHelperStyled = (props: InputHelperPropsStyled) => {
  const { theme: { input, ...rest } = {}, $color, $size, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeInput = new Proxy(input || {}, tokensHandler(rest));
  const componentStyles = get(themeInput, 'helper', {});

  const computedStyles = [
    get(componentStyles, ['default', $size], {}),
    get(componentStyles, [$color, $size], {}),
    boxStyles,
    styles,
  ];

  return <span css={computedStyles} {...restNotStyledProps} />;
};
