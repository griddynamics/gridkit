'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { AvatarUserStyledProps } from '../../atoms/Avatar/Avatar.types';

export const AvatarUserStyled = forwardRef<HTMLDivElement, AvatarUserStyledProps>((props, forwardedRef) => {
  const { theme: { avatar, ...rest } = {}, styles = {}, $variant = 'card', ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAvatar = new Proxy(avatar || {}, tokensHandler(rest));
  const tokenPath = $variant === 'profile' ? 'userProfile.default' : 'userCard.default';
  const computedStyles = [get(themeAvatar, tokenPath, {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
