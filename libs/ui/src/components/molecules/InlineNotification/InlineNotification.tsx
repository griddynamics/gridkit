'use client';
import { forwardRef } from 'react';

import { get, isChildPrimitive } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';

import { InlineNotificationProps } from './InlineNotification.types';
import { accessibilityValues, COMPONENT_NAME, CONTENT_COMPONENT, DEFAULT_VARIANT } from './constants';
import { InlineNotificationMessageStyled, InlineNotificationStyled } from './InlineNotificationStyled';

export const InlineNotification = forwardRef<HTMLDivElement, InlineNotificationProps>((props, forwardRef) => {
  const { variant = DEFAULT_VARIANT, className, styles, children, ...restProps } = props;
  const { theme } = useTheme();

  const iconProps = get(theme, ['inlineNotification', variant, 'icon'], { name: '' });
  const isPrimitive = isChildPrimitive(children);
  const { ariaLive, role } = get(accessibilityValues, variant, accessibilityValues.default);

  return (
    <InlineNotificationStyled
      ref={forwardRef}
      data-testid={COMPONENT_NAME}
      $variant={variant}
      className={className}
      styles={styles}
      theme={theme}
      {...(ariaLive ? { 'aria-live': ariaLive } : {})}
      {...(role ? { role: role } : {})}
      {...restProps}
    >
      {iconProps?.name && <Icon {...iconProps} />}
      {isPrimitive && (
        <InlineNotificationMessageStyled data-testid={CONTENT_COMPONENT} $variant={variant} theme={theme}>
          {children}
        </InlineNotificationMessageStyled>
      )}
      {!isPrimitive && children}
    </InlineNotificationStyled>
  );
});

InlineNotification.displayName = COMPONENT_NAME;
