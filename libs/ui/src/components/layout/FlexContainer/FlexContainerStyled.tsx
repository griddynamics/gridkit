import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { FlexContainerStyledProps } from './';

export const FlexContainerStyled = forwardRef<HTMLDivElement, FlexContainerStyledProps>((props, forwardedRef) => {
  const { theme: { flexContainer, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeFlexContainer = new Proxy(flexContainer || {}, tokensHandler(rest));
  const computedStyles = [get(themeFlexContainer, 'default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
