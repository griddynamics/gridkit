'use client';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { InputWrapperPropsStyled } from '../Input.types';

export const InputWrapperStyled = (props: InputWrapperPropsStyled) => {
  const { theme: { input, ...rest } = {}, $as: Component = 'span', $withGap, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeInput = new Proxy(input || {}, tokensHandler(rest));
  const componentStyles = get(themeInput, 'wrapper', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    $withGap ? get(componentStyles, 'withGap', {}) : {},
    boxStyles,
    styles,
  ];

  return <Component css={computedStyles} {...restNotStyledProps} />;
};
