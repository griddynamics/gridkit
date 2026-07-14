'use client';
import { forwardRef } from 'react';
import { get } from '@utils';

import { tokensHandler } from '@tokens';
import type { InlineNotificationsStyledProps } from '.';

export const InlineNotificationStyled = forwardRef<HTMLDivElement, InlineNotificationsStyledProps>(
  (props, forwardRef) => {
    const { theme: { inlineNotification, ...restTheme } = {}, $variant, styles = {}, ...rest } = props;
    const themeInlineNotification = new Proxy(inlineNotification || {}, tokensHandler(restTheme));
    const defaultStyles = get(themeInlineNotification, 'default.wrapper', {});
    const variantStyles = get(themeInlineNotification, [$variant, 'wrapper'], {});
    const computedStyles = [defaultStyles, variantStyles, styles];
    return <div css={computedStyles} {...rest} ref={forwardRef} />;
  }
);

export const InlineNotificationMessageStyled = (props: InlineNotificationsStyledProps<HTMLSpanElement>) => {
  const { theme: { inlineNotification, ...restTheme } = {}, $variant, styles = {}, ...rest } = props;
  const themeInlineNotificationMessage = new Proxy(inlineNotification || {}, tokensHandler(restTheme));
  const defaultStyles = get(themeInlineNotificationMessage, 'default.content', {});
  const variantStyles = get(themeInlineNotificationMessage, [$variant, 'content'], {});
  const computedStyles = [defaultStyles, variantStyles, styles];
  return <span css={computedStyles} {...rest} />;
};
