'use client';
import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import { LabelStyledProps } from './';

export const LabelStyled = forwardRef<HTMLLabelElement, LabelStyledProps>((props, forwardedRef) => {
  const { styles = {}, theme: { label, ...rest } = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeLabel = new Proxy(label || {}, tokensHandler(rest));
  const computedStyles = [get(themeLabel, 'default', {}), boxStyles, styles];

  return <label css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
