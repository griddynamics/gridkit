import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { BadgeStyledProps } from './';

export const BadgeStyled = forwardRef<HTMLSpanElement, BadgeStyledProps>(
  (
    { theme: { badge, ...rest } = {}, $variant, $appearance, $size, $disabled, className, styles = {}, ...restProps },
    forwardedRef
  ) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeBadge = new Proxy(badge || {}, tokensHandler(rest));
    const componentStyles = [
      get(themeBadge, 'default', {}),
      get(themeBadge, [$variant, $appearance, 'default'], {}),
      $disabled ? get(themeBadge, [$variant, $appearance, 'disabled'], {}) : {},
      $size ? get(themeBadge, ['size', $size], {}) : {},
      boxStyles,
      styles,
    ];

    return <span css={componentStyles} className={className} {...restNotStyledProps} ref={forwardedRef} />;
  }
);

export const BadgeContentStyled = forwardRef<HTMLSpanElement, BadgeStyledProps>(
  ({ theme: { badge } = {}, styles, ...restProps }, forwardedRef) => {
    const componentStyles = get(badge, 'content', {});
    return (
      <span
        css={[get(componentStyles, 'default', {}), styles]}
        className="gd-badge__content"
        {...restProps}
        ref={forwardedRef}
      />
    );
  }
);

export const BadgeStartIconStyled = forwardRef<HTMLSpanElement, BadgeStyledProps>(
  ({ theme: { badge } = {}, ...restProps }, forwardedRef) => {
    const componentStyles = get(badge, 'startIcon', {});
    return (
      <span
        css={get(componentStyles, 'default', {})}
        className="gd-badge__icon-start"
        {...restProps}
        ref={forwardedRef}
      />
    );
  }
);

export const BadgeEndIconStyled = forwardRef<HTMLSpanElement, BadgeStyledProps>(
  ({ theme: { badge } = {}, ...restProps }, forwardedRef) => {
    const componentStyles = get(badge, 'endIcon', {});
    return (
      <span
        css={get(componentStyles, 'default', {})}
        className="gd-badge__icon-end"
        {...restProps}
        ref={forwardedRef}
      />
    );
  }
);
