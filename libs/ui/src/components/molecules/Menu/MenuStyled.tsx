import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { MenuTriggerStyledProps, MenuContentStyledProps } from './Menu.types';

export const MenuTriggerStyled = forwardRef<HTMLDivElement, MenuTriggerStyledProps>((props, forwardedRef) => {
  const { theme: { menu, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeMenu = new Proxy(menu || {}, tokensHandler(rest));

  return (
    <div
      css={{ ...get(themeMenu, 'wrapper.default', {}), ...boxStyles, ...styles }}
      {...restNotStyledProps}
      ref={forwardedRef}
    />
  );
});

export const MenuContentStyled = forwardRef<HTMLDivElement, MenuContentStyledProps>((props, forwardedRef) => {
  const { theme: { menu, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeMenu = new Proxy(menu || {}, tokensHandler(rest));
  const computedStyles = [get(themeMenu, 'content.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
