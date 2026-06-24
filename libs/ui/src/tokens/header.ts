import { get } from '@utils';
import { display, flexAlignItems } from './display';
import { borders } from './borders';
import { cursors } from './cursors';

export const header = {
  container: {
    fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
    alignItems: flexAlignItems.center,
    backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
    maxWidth: '100%',
  },
  topBannerRow: {
    width: '100%',
    backgroundColor: (theme: Record<symbol, unknown>) =>
      get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'),
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
  },
  searchColumn: {
    default: {
      flexDirection: 'row',
      justifyContent: flexAlignItems.center,
      '& a': {
        margin: (theme: Record<symbol, unknown>) =>
          `${get(theme, 'spacing.none', 'theme.spacing.none')} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
      },
    },
  },
  navigationRow: {
    default: {
      width: '100%',
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.md', 'theme.spacing.md')} ${get(theme, 'spacing.lg', 'theme.spacing.lg')}`,
      alignItems: flexAlignItems.center,
    },
  },
  actionsColumn: {
    default: {
      flexDirection: 'row',
      '& > button': {
        margin: (theme: Record<symbol, unknown>) =>
          `${get(theme, 'spacing.none', 'theme.spacing.none')} calc(${get(theme, 'spacing.lg', 'theme.spacing.lg')}/2)`,
      },
    },
  },
  menuRow: {
    default: {
      width: '100%',
      justifyContent: flexAlignItems.center,
    },
    column: {
      flexDirection: 'row',
      '& a': {
        margin: (theme: Record<symbol, unknown>) =>
          `${get(theme, 'spacing.none', 'theme.spacing.none')} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
      },
    },
  },
  children: {
    default: {
      margin: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.md', 'theme.spacing.md')} ${get(theme, 'spacing.lg', 'theme.spacing.lg')}`,
    },
  },
  mobile: {
    openedDropdownWrapper: {
      position: 'fixed',
      top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.high', 'theme.zIndex.high'),
      background: (theme: Record<symbol, unknown>) => get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      width: '100vw',
      height: '100vh',
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.xxl', 'theme.spacing.xxl')} ${get(theme, 'spacing.lg', 'theme.spacing.lg')} ${get(
          theme,
          'spacing.md',
          'theme.spacing.md'
        )}`,
      overflowY: 'auto',
    },
    closeMenuIconWrapper: {
      width: '40px',
      height: '40px',
      display: display.flex,
      justifyContent: 'center',
      alignItems: flexAlignItems.center,
    },
    openMenuIconWrapper: {
      width: '40px',
      height: '40px',
      display: display.flex,
      justifyContent: 'center',
      alignItems: flexAlignItems.center,
    },
    menuWrapper: {
      margin: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.lg', 'theme.spacing.lg')} ${get(theme, 'spacing.none', 'theme.spacing.none')}`,
      borderTop: (theme: Record<symbol, unknown>) =>
        borders.generic({ width: '1px', color: get(theme, 'colors.border.default', 'theme.colors.border.default') }),
    },
    menuItemWrapper: {
      padding: (theme: Record<symbol, unknown>) =>
        `calc(${get(theme, 'spacing.xs', 'theme.spacing.xs')}*3) ${get(theme, 'spacing.none', 'theme.spacing.none')}`,
      borderBottom: (theme: Record<symbol, unknown>) =>
        borders.generic({ width: '1px', color: get(theme, 'colors.border.default', 'theme.colors.border.default') }),
      cursor: cursors.pointer,
    },
  },
  icons: {
    close: {
      name: 'cross',
      width: 24,
      height: 24,
    },
    right: {
      name: 'arrowRight',
      width: 16,
      height: 16,
    },
    menu: {
      name: 'mobileMenu',
      width: 40,
      height: 40,
    },
  },
};
