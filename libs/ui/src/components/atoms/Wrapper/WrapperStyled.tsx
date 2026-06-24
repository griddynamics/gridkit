'use client';
import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { WrapperVariant, type BoxStyles } from '@types';

import { WrapperStyledProps } from './Wrapper.types';

export const WrapperStyled = forwardRef<HTMLBaseElement, WrapperStyledProps>((props, forwardedRef) => {
  const {
    theme: { wrapper, ...rest } = {},
    $variant = WrapperVariant.Inline,
    styles = {},
    $as: Component = 'div',
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeWrapper = new Proxy(wrapper || {}, tokensHandler(rest));
  const baseStyles = get(themeWrapper, 'default', {});
  const variantStyles = get(themeWrapper, $variant, {});
  const computedStyles = [baseStyles, variantStyles, boxStyles, styles];

  return <Component css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
