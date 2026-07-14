import { PropsWithChildren } from 'react';
import { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components/index.types';

export type InlineNotificationVariant = 'success' | 'error' | 'warning' | 'info' | 'basic';

export interface InlineNotificationProps extends CommonCssComponentProps, PropsWithChildren {
  variant?: InlineNotificationVariant;
}

export interface InlineNotificationsStyledProps<T = HTMLDivElement>
  extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $variant: InlineNotificationVariant;
}
