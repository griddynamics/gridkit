import { get } from '@utils';

import { getSpacing } from './utils';
import { borders } from './borders';

export const snackbar = {
  title: {
    attrs: {
      as: 'div',
      align: 'start',
      variant: 'small',
      styleVariant: 'semibold',
      color: 'text.black',
    },
  },
  description: {
    attrs: {
      as: 'div',
      align: 'start',
      variant: 'small',
      styleVariant: 'normal',
      color: 'text.black',
    },
  },
  container: {
    default: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      gap: (theme: Record<symbol, unknown>) => get(theme, `spacing.sm`, `theme.spacing.sm`),
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, `spacing.sm`, `theme.spacing.sm`)} ${get(theme, `spacing.sm`, `theme.spacing.sm`)} ${get(theme, `spacing.md`, `theme.spacing.md`)} ${get(theme, `spacing.md`, `theme.spacing.md`)}`,
      boxSizing: 'border-box',
      maxHeight: (theme: Record<symbol, unknown>) => `calc(100vh - ${get(theme, `spacing.xs`, `theme.spacing.xs`)})`,
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'colors.transparent', 'theme.colors.transparent')} ${get(
          theme,
          'colors.transparent',
          'theme.colors.transparent'
        )}`,
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.top', 'theme.zIndex.top'),
      '&::-webkit-scrollbar': {
        width: (theme: Record<symbol, unknown>) => get(theme, `spacing.sm`, `theme.spacing.sm`),
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
      },
      '&::-webkit-scrollbar-thumb': {
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
        borderRadius: (theme: Record<symbol, unknown>) => get(theme, `radius.sm`, `theme.radius.sm`),
      },
      '&::-webkit-scrollbar-track': {
        background: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
      },
      '&:hover::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.3)',
      },
      '&.scrolling::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
  snackbar: {
    default: {
      position: 'relative',
      boxShadow: (theme: Record<symbol, unknown>) =>
        get(theme, 'shadows.snackbar.default', 'theme.shadows.snackbar.default'),
      width: '302px',
      fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.p`, `theme.font.size.p`),
      display: 'flex',
      flexDirection: 'column',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.sm', 'theme.spacing.sm')} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
    },
    background: {
      default: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      variants: {
        success: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.toast.success', 'theme.colors.bg.toast.success'),
        error: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.toast.error', 'theme.colors.bg.toast.error'),
        warning: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.toast.warning', 'theme.colors.bg.toast.warning'),
        info: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.toast.info', 'theme.colors.bg.toast.info'),
      },
    },
    animation: {
      closeEffect: '300ms ease-in-out 50ms forwards',
      openEffect: '300ms ease-in-out forwards',
    },
  },
  positions: {
    'top-left': {
      top: 0,
      left: 0,
      alignItems: 'flex-start',
    },
    'top-center': {
      top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: '50%',
      transform: 'translateX(-50%)',
      alignItems: 'center',
    },
    'top-right': {
      top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      alignItems: 'flex-end',
    },
    'bottom-left': {
      bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
    },
    'bottom-center': {
      bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: '50%',
      transform: 'translateX(-50%)',
      alignItems: 'center',
      flexDirection: 'column-reverse',
    },
    'bottom-right': {
      bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      alignItems: 'flex-end',
      flexDirection: 'column-reverse',
    },
  },
  closeButton: {
    position: 'absolute',
    top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
    background: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
    border: borders.none,
    cursor: 'pointer',
    padding: 3,
    width: 16,
    height: 16,
  },
  icons: {
    close: {
      name: 'cross',
      width: 10,
      height: 10,
    },
    success: {
      name: 'success',
      fill: 'icon.success',
      width: 20,
      height: 20,
    },
    error: {
      name: 'error',
      fill: 'icon.error',
      width: 20,
      height: 20,
    },
    warning: {
      name: 'warning',
      fill: 'icon.warning',
      width: 20,
      height: 20,
    },
    info: {
      name: 'info',
      fill: 'icon.info',
      width: 20,
      height: 20,
    },
  },
  snackbarBody: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
  },
  snackbarContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: getSpacing(1),
    flex: 1,
  },
  actionsContainer: {
    paddingTop: getSpacing(1),
  },
};
