import { get } from '@utils';

import { hexToRgba, getSpacing } from './utils';
import { display } from './display';
import { borders } from './borders';

export const modal = {
  header: {
    default: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: `${getSpacing(4)} ${getSpacing(6)}`,
      borderBottom: (theme: Record<symbol, unknown>) =>
        borders.generic({ width: '1px', color: get(theme, 'colors.border.default', 'theme.colors.border.default') }),
    },
    withTitle: {
      justifyContent: 'space-between',
    },
  },

  title: {
    default: {
      display: 'flex',
      alignItems: 'center',
      fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.h6`, `theme.font.size.h6`),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, `font.weight.medium`, `theme.font.weight.medium`),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      margin: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
  },

  body: {
    default: {
      padding: (theme: Record<symbol, unknown>) => get(theme, `spacing.lg`, `theme.spacing.lg`),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.p`, `theme.font.size.p`),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      overflowY: 'auto',
    },
  },

  content: {
    default: {
      background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.md', 'theme.radius.md'),
      boxShadow: (theme: Record<symbol, unknown>) => get(theme, 'shadows.modal.default', 'theme.shadows.modal.default'),
      position: 'relative',
      display: display.flex,
      flexDirection: 'column',
      width: '100%',
      maxWidth: '654px',
      maxHeight: '90vh',
      '@media (max-width: 768px)': {
        maxWidth: '100%',
        width: '100vw',
        height: '100vh',
        borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
      },
    },
  },

  footer: {
    default: {
      display: display.flex,
      justifyContent: 'flex-end',
      gap: (theme: Record<symbol, unknown>) => `calc(${get(theme, `spacing.xs`, `theme.spacing.xs`)} * 3)`,
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, `spacing.md`, `theme.spacing.md`)} ${get(theme, `spacing.lg`, `theme.spacing.lg`)}`,
      borderTop: (theme: Record<symbol, unknown>) =>
        borders.generic({ width: '1px', color: get(theme, 'colors.border.default', 'theme.colors.border.default') }),
    },
  },

  closeButton: {
    default: {
      background: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
      border: 'none',
      cursor: 'pointer',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
  },

  overlay: {
    default: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: (theme: Record<symbol, unknown>) =>
        hexToRgba(get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'), 0.5),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.high', 'theme.zIndex.high'),
    },
  },
  icons: {
    close: {
      name: 'cross',
      fill: 'icon.black',
      width: 14,
      height: 14,
    },
  },
};
