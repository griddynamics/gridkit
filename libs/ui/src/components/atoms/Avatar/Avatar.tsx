'use client';
import { forwardRef, PropsWithChildren, useState } from 'react';
import { useTheme } from '@hooks/useTheme';
import { Image } from '@components';

import { AvatarUser } from '@components/molecules/AvatarUser';
import { BADGE_COMPONENT, COMPONENT_NAME, FALLBACK_COMPONENT } from './constants';
import type { AvatarProps } from './Avatar.types';
import {
  AvatarImageWrapperStyled,
  AvatarStyled,
  BadgeStyled,
  FallbackComponentWrapperStyled,
  FallbackTextStyled,
} from './AvatarStyled';

const AvatarBase = forwardRef<HTMLDivElement, PropsWithChildren<AvatarProps>>((props, forwardedRef) => {
  const {
    id,
    sizeVariant,
    withBadge,
    badgeColor = 'bg.fill.success.primary.default',
    backgroundColor,
    src,
    alt,
    className,
    placeholder,
    onClick,
    fallbackComponent,
    styles = {},
    ...rest
  } = props;
  const { theme } = useTheme();

  const [failed, setFailed] = useState(false);

  const onError = () => {
    setFailed(true);
  };

  const onLoad = () => {
    setFailed(false);
  };

  const isFallbackPrimitive = typeof fallbackComponent === 'string' || typeof fallbackComponent === 'number';

  return (
    <AvatarStyled
      theme={theme}
      role="img"
      aria-label={alt}
      $sizeVariant={sizeVariant}
      styles={styles}
      ref={forwardedRef}
      className={className}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      <AvatarImageWrapperStyled $color={backgroundColor} theme={theme}>
        {!failed && src && (
          <Image
            id={id}
            src={src}
            alt={alt}
            placeholder={placeholder}
            onClick={onClick}
            onError={onError}
            onLoad={onLoad}
          />
        )}
        {(failed || !src) && (
          <FallbackComponentWrapperStyled data-testid={FALLBACK_COMPONENT} aria-label={alt}>
            {isFallbackPrimitive && (
              <FallbackTextStyled $sizeVariant={sizeVariant} theme={theme}>
                {fallbackComponent}
              </FallbackTextStyled>
            )}
            {!isFallbackPrimitive && fallbackComponent}
          </FallbackComponentWrapperStyled>
        )}
      </AvatarImageWrapperStyled>

      {withBadge && (
        <BadgeStyled
          data-testid={BADGE_COMPONENT}
          role="status"
          $color={badgeColor}
          theme={theme}
          $sizeVariant={sizeVariant}
        />
      )}
    </AvatarStyled>
  );
});

AvatarBase.displayName = COMPONENT_NAME;

export const Avatar = AvatarBase as typeof AvatarBase & {
  User: typeof AvatarUser;
};

Object.defineProperty(Avatar, 'User', {
  configurable: true,
  enumerable: true,
  get: () => AvatarUser,
});
