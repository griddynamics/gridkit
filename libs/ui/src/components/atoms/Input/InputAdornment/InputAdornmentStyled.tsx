'use client';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { CommonCssComponentStyledProps } from '@components';

export const InputAdornmentStyled = (props: CommonCssComponentStyledProps) => {
  const { theme: { input, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeInput = new Proxy(input || {}, tokensHandler(rest));
  const computedStyles = [get(themeInput, 'adornment.default', {}), boxStyles, styles];

  return <span css={computedStyles} {...restNotStyledProps} />;
};
