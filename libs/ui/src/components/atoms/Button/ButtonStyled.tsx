import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import { ButtonCommonStyledProps, ButtonStyledProps } from './';

export const ButtonStyled = forwardRef<HTMLButtonElement, ButtonStyledProps>(
  (
    { theme: { button, ...rest } = {}, $isIcon, $fullWidth, $variant, $rounded, className, styles = {}, ...restProps },
    forwardedRef
  ) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeButton = new Proxy(button || {}, tokensHandler(rest));
    const borderRadius = get(rest, ['radius', $rounded], '0px');
    const componentStyles = [
      get(themeButton, 'default', {}),
      get(themeButton, $variant, {}),
      boxStyles,
      $isIcon ? get(themeButton, 'icon', {}) : {},
      $fullWidth ? get(themeButton, 'fullWidth', {}) : {},
      {
        borderRadius,
        '&:focus-visible::after': {
          borderRadius,
        },
      },
      styles,
    ];

    return <button css={componentStyles} className={className} {...restNotStyledProps} ref={forwardedRef} />;
  }
);

export const ContentStyled = (props: ButtonCommonStyledProps) => {
  const { theme: { button } = {}, styles, ...restProps } = props;
  const componentStyles = get(button, 'content', {});
  return <span css={[get(componentStyles, 'default', {}), styles]} className="gd-button__content" {...restProps} />;
};

export const StartIconStyled = (props: ButtonCommonStyledProps) => {
  const { theme: { button } = {}, ...restProps } = props;
  const componentStyles = get(button, 'startIcon', {});
  return <span css={get(componentStyles, 'default', {})} {...restProps} />;
};

export const EndIconStyled = (props: ButtonCommonStyledProps) => {
  const { theme: { button } = {}, ...restProps } = props;
  const componentStyles = get(button, 'endIcon', {});
  return <span css={get(componentStyles, 'default', {})} {...restProps} />;
};
