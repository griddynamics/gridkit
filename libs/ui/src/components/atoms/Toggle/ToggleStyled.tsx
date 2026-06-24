'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { ToggleStyledProps } from './Toggle.types';

export const ToggleStyled = forwardRef<HTMLDivElement, ToggleStyledProps>((props, forwardedRef) => {
  const { theme: { switchToggle, ...rest } = {}, disabled, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSwitchToggle = new Proxy(switchToggle || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeSwitchToggle, 'default', {}),
    boxStyles,
    styles,
    disabled ? get(themeSwitchToggle, 'disabled', {}) : {},
  ];
  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
