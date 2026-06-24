'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { DropdownItemStyledProps } from './';

export const DropdownItemStyled = forwardRef<HTMLDivElement, DropdownItemStyledProps>((props, forwardRef) => {
  const { theme: { select, ...rest } = {}, $disabled, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSelect = new Proxy(select || {}, tokensHandler(rest));
  const selectBaseStyles = get(themeSelect, 'item.default', {});
  const selectDisabledStyles = get(themeSelect, 'item.disabled', {});
  const computedStyles = [selectBaseStyles, $disabled ? selectDisabledStyles : {}, boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardRef} />;
});
