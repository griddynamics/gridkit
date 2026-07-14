import { forwardRef } from 'react';

import { get } from '@utils';

import { tokensHandler } from '@tokens';
import type { TooltipStyledProps, TooltipWrapperStyledProps } from './';

export const TooltipWrapperStyled = forwardRef<HTMLDivElement, TooltipWrapperStyledProps>(
  ({ theme: { tooltip, ...rest } = {}, styles = {}, $as: Component = 'div', ...restProps }, forwardedRef) => {
    const themeTooltip = new Proxy(tooltip || {}, tokensHandler(rest));
    const computedStyles = [get(themeTooltip, 'wrapper.default', {}), styles];
    return <Component css={computedStyles} {...restProps} ref={forwardedRef} />;
  }
);

export const TooltipStyled = forwardRef<HTMLDivElement, TooltipStyledProps>(
  ({ theme: { tooltip, ...rest } = {}, styles = {}, ...restProps }, forwardedRef) => {
    const themeTooltip = new Proxy(tooltip || {}, tokensHandler(rest));
    const computedStyles = [get(themeTooltip, 'default', {}), styles];
    return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
  }
);
