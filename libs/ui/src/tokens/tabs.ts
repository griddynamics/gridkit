import { get } from '@utils';

import { borders } from './borders';

export const tabs = {
  default: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    default: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      overflow: 'auto',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        zIndex: (theme: Record<symbol, unknown>) => -(get(theme, 'zIndex.low', 100) as number),
        borderBottom: (theme: Record<symbol, unknown>) =>
          borders.generic({
            width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
            color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
          }),
      },
    },
  },
  label: {
    default: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.tabs.label', 'theme.values.transitions.tabs.label'),
      borderBottom: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderMedium', 'theme.values.borderMedium'),
          color: get(theme, 'colors.transparent', 'theme.colors.transparent'),
        }),
      whiteSpace: 'nowrap',
      flex: 1,
      '&:hover': {
        [`.Tabs__noticeCounter`]: {
          backgroundColor: (theme: Record<symbol, unknown>) =>
            get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
        },
      },
    },
    active: {
      borderBottomColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
    },
    disabled: {
      default: {
        '&:hover': {
          [`.Tabs__noticeCounter`]: {
            backgroundColor: (theme: Record<symbol, unknown>) =>
              get(theme, 'colors.icon.disabled', 'theme.colors.icon.disabled'),
          },
        },
        [`.Tabs__noticeCounter`]: {
          color: (theme: Record<symbol, unknown>) => get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
        },
        borderBottom: (theme: Record<symbol, unknown>) =>
          borders.generic({
            width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
            color: get(theme, 'colors.border.disabled', 'theme.colors.border.disabled'),
          }),
      },
      active: {
        borderBottomWidth: '2px',
        borderBottomColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.border.disabled', 'theme.colors.border.disabled'),
      },
    },
  },
  panelsWrapper: {
    default: {},
  },
  panel: {
    default: {},
  },
  noticeCounter: {
    default: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.round', 'theme.radius.round'),
      width: '16px',
      height: '16px',
    },
    active: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
    },
    disabled: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
    },
  },
  tabButton: {
    default: { width: '100%' },
  },
};
