import { Typography } from '@components';
import { get } from '@utils';
import { getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import { Row } from '@components/layout';
import type { BoxStyles } from '@types';

import type {
  AvatarStyledProps,
  StyledAvatarBadgeProps,
  StyledAvatarImageWrapperProps,
  StyledFallbackComponentWrapperProps,
  StyledFallbackTextProps,
} from './Avatar.types';

export const AvatarStyled = (props: AvatarStyledProps) => {
  const { theme: { avatar, ...rest } = {}, $sizeVariant, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAvatar = new Proxy(avatar || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeAvatar, 'default', {}),
    get(themeAvatar, `size.${$sizeVariant}`, {}),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const BadgeStyled = (props: StyledAvatarBadgeProps) => {
  const { theme: { avatar, ...rest } = {}, $sizeVariant, $color, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAvatar = new Proxy(avatar || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeAvatar, 'badge.default', {}),
    get(themeAvatar, `badge.size.${$sizeVariant}`, {}),
    { backgroundColor: resolveThemeColor(get(rest, 'colors'), $color) },
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const AvatarImageWrapperStyled = (props: StyledAvatarImageWrapperProps) => {
  const { theme: { avatar, ...rest } = {}, $color, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAvatar = new Proxy(avatar || {}, tokensHandler(rest));

  const colorStyles = $color
    ? {
        backgroundColor: resolveThemeColor(get(rest, 'colors'), $color),
      }
    : {};

  const computedStyles = [get(themeAvatar, 'imageWrapper.default', {}), colorStyles, boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const FallbackComponentWrapperStyled = (props: StyledFallbackComponentWrapperProps) => {
  return <Row justify="center" align="center" {...props} />;
};

export const FallbackTextStyled = (props: StyledFallbackTextProps) => {
  const { theme: { avatar, ...rest } = {}, $sizeVariant, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAvatar = new Proxy(avatar || {}, tokensHandler(rest));
  const attributes = {
    ...get(themeAvatar, 'fallbackText.attrs.default', {}),
    ...get(themeAvatar, `fallbackText.attrs.size.${$sizeVariant}`, {}),
    ...restNotStyledProps,
  };
  const computedStyles = [get(themeAvatar, 'fallbackText.default', {}), boxStyles];
  return <Typography {...attributes} css={computedStyles} />;
};
