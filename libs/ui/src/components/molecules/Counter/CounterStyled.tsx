import { forwardRef } from 'react';

import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { Button } from '@components';

import type { CounterStyledProps, NavButtonStyledProps } from './';

export const CounterStyled = forwardRef<HTMLDivElement, CounterStyledProps>((props, forwardedRef) => {
  const { theme: { counter, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeCounter = new Proxy(counter || {}, tokensHandler(rest));
  const computedStyles = [get(themeCounter, 'default', {}), styles];

  return <div css={computedStyles} ref={forwardedRef} {...restProps} />;
});

export const NavButtonStyled = (props: NavButtonStyledProps) => {
  const { theme: { counter, ...rest } = {}, ...restProps } = props;
  const themeCounter = new Proxy(counter || {}, tokensHandler(rest));
  const attrs = get(themeCounter, 'navButton.attrs', {});
  const computedStyles = get(themeCounter, 'navButton.default', {});

  return <Button css={computedStyles} {...restProps} {...attrs} />;
};
