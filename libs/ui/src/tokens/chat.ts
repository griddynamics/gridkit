import { get } from '@utils';

import { getSpacing, hexToRgba } from './utils';

export const chat = {
  wrapper: {
    default: {
      display: 'flex',
      position: 'relative',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
  },
  content: {
    default: {
      boxSizing: 'border-box',
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingBottom: getSpacing(8),
      gap: getSpacing(4),
      minHeight: 0,
      margin: '0 auto',
    },
    md: {
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    mdXl: {
      maxWidth: '80%',
    },
    xl: {
      maxWidth: '70%',
    },
  },
  mainHeader: {
    minHeight: '56px',
    height: '56px',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    padding: '0 24px',
    borderBottom: '1px solid',
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.default', 'theme.colors.border.default'),
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  sidebar: {
    default: {
      overflow: 'hidden',
      borderRight: '1px solid',
      position: 'relative',
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chat.sidebar', 'theme.values.transitions.chat.sidebar'),
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.default', 'theme.colors.border.default'),
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      transform: 'translateX(0)',
      pointerEvents: 'auto',
    },
    open: {
      width: '250px',
    },
    close: {
      width: 0,
      transform: 'translateX(-100%)',
      pointerEvents: 'none',
    },
  },
  sidebarMinified: {
    default: {
      overflow: 'hidden',
      borderRight: '1px solid',
      position: 'relative',
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chat.sidebar', 'theme.values.transitions.chat.sidebar'),
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.default', 'theme.colors.border.default'),
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      transform: 'translateX(0)',
      pointerEvents: 'auto',
      opacity: 1,
    },
    open: {},
    close: {
      opacity: 0,
      width: 0,
      transform: 'translateX(-100%)',
      pointerEvents: 'none',
    },
  },
  sidebarWrapper: {
    default: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.chat.sidebar', 'theme.values.transitions.chat.sidebarWrapper'),
    },
    open: {
      opacity: 1,
      pointerEvents: 'auto',
    },
    close: {
      opacity: 0,
      pointerEvents: 'none',
    },
    md: (theme: Record<symbol, unknown>) => ({
      position: 'absolute',
      display: 'block',
      flexDirection: 'column',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: hexToRgba(get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'), 0.1),
      zIndex: get(theme, 'zIndex.medium', 'theme.zIndex.medium'),
    }),
  },
  sidebarContentWrapper: {},
  sidebarHeader: {
    minHeight: '56px',
    height: '56px',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    padding: '0 24px',
    borderBottom: '1px solid',
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.default', 'theme.colors.border.default'),
  },
  toggleButton: {
    default: {
      height: '24px',
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      transform: 'rotate(0deg)',
      '&:hover': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.transparent', 'theme.colors.transparent'),
      },
    },
    attrs: {
      variant: 'text',
    },
    open: { transform: 'rotate(180deg)' },
  },
  toggleIcon: {
    name: 'arrowRight',
    fill: 'icon.black',
    size: 'lg',
  },
};
