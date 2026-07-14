import { get } from '@utils';
import { display, flexAlignItems } from './display';
import { borders } from './borders';

export const inlineNotification = {
  default: {
    wrapper: {
      display: display.inlineFlex,
      alignItems: flexAlignItems.center,
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      width: 'max-content',
    },
    content: {
      flex: 1,
      fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
    },
  },
  success: {
    wrapper: {},
    content: {},
    icon: {
      name: 'success',
      fill: 'icon.success',
    },
  },
  warning: {
    wrapper: {},
    content: {},
    icon: {
      name: 'warning',
      fill: 'icon.warning',
    },
  },
  error: {
    wrapper: {},
    content: {},
    icon: {
      name: 'error',
      fill: 'icon.error',
    },
  },
  info: {
    wrapper: {},
    content: {},
    icon: {
      name: 'info',
      fill: 'icon.info',
    },
  },
  basic: {
    wrapper: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
        }),
      boxShadow: (theme: Record<symbol, unknown>) =>
        get(theme, 'shadows.inlineNotification.default', 'theme.shadows.inlineNotification.default'),
      padding: (theme: Record<symbol, unknown>) => {
        const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
        const md = get(theme, 'spacing.md', 'theme.spacing.md');
        return `${sm} ${md} ${sm} ${md}`;
      },
    },
    content: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    },
    icon: { name: '' },
  },
};
