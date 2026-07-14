'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Avatar } from '@components/atoms/Avatar';
import { Typography } from '@components/atoms/Typography';
import { get } from '@utils';
import type { EnumOrPrimitive, SizeVariant, TypographyVariant } from '@types';

import type { AvatarUserProps } from '@components/atoms/Avatar';
import { AvatarUserStyled } from './AvatarUserStyled';
import { COMPONENT_NAME } from './constants';

export const AvatarUser = forwardRef<HTMLDivElement, AvatarUserProps>((props, forwardedRef) => {
  const {
    variant = 'card',
    name,
    subtitle,
    src,
    alt,
    fallbackComponent,
    sizeVariant,
    withBadge,
    badgeColor,
    backgroundColor,
    action,
    onClick,
    ...rest
  } = props;
  const { theme } = useTheme();
  const config = get(theme, `avatar.variantConfig.${variant}`, {}) as {
    defaultSize: EnumOrPrimitive<SizeVariant>;
    nameVariant: EnumOrPrimitive<TypographyVariant>;
    subtitleVariant: EnumOrPrimitive<TypographyVariant>;
    tokenKey: string;
  };
  const resolvedSize = sizeVariant ?? config.defaultSize;

  const nameStyles = get(theme, `avatar.${config.tokenKey}.name`, {});
  const subtitleStyles = get(theme, `avatar.${config.tokenKey}.subtitle`, {});
  const actionStyles = variant === 'profile' ? get(theme, 'avatar.userProfile.action', {}) : {};

  return (
    <AvatarUserStyled
      ref={forwardedRef}
      theme={theme}
      data-testid={COMPONENT_NAME}
      $variant={variant}
      onClick={onClick}
      {...rest}
    >
      <Avatar
        src={src}
        alt={alt || name}
        fallbackComponent={fallbackComponent}
        sizeVariant={resolvedSize}
        withBadge={withBadge}
        badgeColor={badgeColor}
        backgroundColor={backgroundColor}
      />
      <>
        <Typography variant={config.nameVariant} css={nameStyles}>
          {name}
        </Typography>
        {subtitle && (
          <Typography variant={config.subtitleVariant} css={subtitleStyles}>
            {subtitle}
          </Typography>
        )}
      </>
      {variant === 'profile' && action && <div css={actionStyles}>{action}</div>}
    </AvatarUserStyled>
  );
});

AvatarUser.displayName = COMPONENT_NAME;
