import { forwardRef } from 'react';

import { get } from '@utils';
import { convertJsonToCssKeyframeCss, getBoxStyles, tokensHandler } from '@tokens/utils';
import { CommonCssComponentStyledProps, Icon, Typography } from '@components';
import type { BoxStyles } from '@types';

import type {
  SnackbarCommonStyledProps,
  SnackbarContainerStyledProps,
  SnackbarIconProps,
  SnackbarStyledProps,
} from './';

export const SnackbarStyled = forwardRef<HTMLDivElement, SnackbarStyledProps>(
  (
    {
      theme: { animations, snackbar, ...rest } = {},
      $variant,
      $colored,
      $isClosing,
      $isAnimated,
      styles,
      ...restProps
    },
    forwardedRef
  ) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
    const slideInAnimation = convertJsonToCssKeyframeCss(animations?.slideIn);
    const slideOutAnimation = convertJsonToCssKeyframeCss(animations?.slideOut);
    const animationEffect = get(themeSnackbar, 'snackbar.animation');
    const closeAnimation = `${slideOutAnimation} ${animationEffect.closeEffect}`;
    const openAnimation = `${slideInAnimation} ${animationEffect.openEffect}`;
    const defaultBackground = get(themeSnackbar, `snackbar.background.default`);
    const defaultStyles = get(themeSnackbar, 'snackbar.default', {});
    const backgroundStyles = {
      background: $colored
        ? get(themeSnackbar, `snackbar.background.variants.${$variant}`, defaultBackground)
        : defaultBackground,
    };
    const animation = { animation: $isClosing ? closeAnimation : openAnimation };

    const computedStyles = [$isAnimated ? animation : {}, defaultStyles, backgroundStyles, boxStyles, styles];

    return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
  }
);

export const CloseButtonWrapperStyled = (props: SnackbarCommonStyledProps) => {
  const { theme: { snackbar, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
  const computedStyles = [get(themeSnackbar, 'closeButton', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const CloseButtonIconStyled = (props: SnackbarIconProps) => {
  const { theme: { snackbar, ...rest } = {}, $variant } = props;
  const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
  const iconProps = get(themeSnackbar, 'icons.close', { name: 'cross' });
  return <Icon fill={`icon.${$variant}`} {...iconProps} />;
};

export const SnackbarIconStyled = (props: SnackbarIconProps) => {
  const { $variant, theme: { snackbar } = {} } = props;
  const iconProps = get(snackbar, ['icons', $variant], { name: '' });

  return <Icon {...iconProps} />;
};

export const SnackbarBodyStyled = (props: SnackbarCommonStyledProps) => {
  const { theme: { snackbar, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
  const computedStyles = [get(themeSnackbar, 'snackbarBody', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const SnackbarContentStyled = (props: SnackbarCommonStyledProps) => {
  const { theme: { snackbar, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
  const computedStyles = [get(themeSnackbar, 'snackbarContent', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const SnackbarTitleStyled = (props: CommonCssComponentStyledProps) => {
  const { theme: { snackbar } = {}, children } = props;
  return <Typography {...get(snackbar, 'title.attrs', {})}>{children}</Typography>;
};

export const SnackbarDescriptionStyled = (props: CommonCssComponentStyledProps) => {
  const { theme: { snackbar } = {}, children } = props;
  return <Typography {...get(snackbar, 'description.attrs', {})}>{children}</Typography>;
};

export const SnackbarActionsContainerStyled = (props: SnackbarCommonStyledProps) => {
  const { theme: { snackbar, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
  const computedStyles = [get(themeSnackbar, 'actionsContainer', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const SnackbarContainerStyled = (props: SnackbarContainerStyledProps) => {
  const { theme: { snackbar, ...rest } = {}, $position, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSnackbar = new Proxy(snackbar || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeSnackbar, 'container.default', {}),
    get(themeSnackbar, ['positions', $position], {}),
    boxStyles,
    styles,
  ];
  return <div css={computedStyles} {...restNotStyledProps} />;
};
