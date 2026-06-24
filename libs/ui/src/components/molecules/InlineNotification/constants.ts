export const COMPONENT_NAME = 'InlineNotification';
export const CONTENT_COMPONENT = 'InlineNotificationComponent';

export type AriaValues = { ariaLive: 'assertive' | 'polite'; role: 'status' | 'alert' };

export const defaultAriaValues: AriaValues = {
  ariaLive: 'polite',
  role: 'status',
};
export const errorAriaValues: AriaValues = {
  ariaLive: 'assertive',
  role: 'alert',
};
export const accessibilityValues = {
  default: defaultAriaValues,
  success: defaultAriaValues,
  info: defaultAriaValues,
  error: errorAriaValues,
  warning: errorAriaValues,
};

export const DEFAULT_VARIANT = 'basic';
