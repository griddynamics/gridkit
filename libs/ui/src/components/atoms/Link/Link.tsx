'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Cursors, LinkTarget, LinkVariant, TabIndex } from '@types';
import { Roles } from '@components';

import { COMPONENT_NAME } from './constants';

import { LinkStyled } from './LinkStyled';
import { LinkProps } from './Link.types';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, forwardedRef) => {
  const {
    variant = LinkVariant.Primary,
    size,
    underline,
    color,
    disabled = false,
    className = '',
    cursor = Cursors.Pointer,
    target = LinkTarget.Blank,
    tabindex = TabIndex.Default,
    href,
    role = Roles.Link,
    children,
    onClick,
    ariaLabel,
    rel,
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <LinkStyled
      ref={forwardedRef}
      $variant={variant}
      $size={size}
      $underline={underline}
      $color={color}
      $cursor={cursor}
      className={`${className}${disabled ? `${COMPONENT_NAME}--disabled` : ''}`}
      theme={theme}
      target={target}
      role={role}
      tabIndex={tabindex}
      data-testid={COMPONENT_NAME}
      {...(rel ? { rel } : {})}
      {...(disabled ? {} : { href, onClick })}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...rest}
    >
      {children}
    </LinkStyled>
  );
});

Link.displayName = COMPONENT_NAME;
