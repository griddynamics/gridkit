'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { FormStyledProps } from './';

export const FormStyled = forwardRef<HTMLFormElement, FormStyledProps>((props, forwardRef) => {
  const { theme: { form, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeForm = new Proxy(form || {}, tokensHandler(rest));
  const computedStyles = [get(themeForm, 'default', {}), boxStyles, styles];

  return <form css={computedStyles} {...restNotStyledProps} ref={forwardRef} />;
});
