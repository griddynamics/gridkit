import { get } from '@utils';

export const sidebar = {
  container: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      borderRight: `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
      transition: get(theme, 'values.transitions.sidebar.container', 'theme.values.transitions.sidebar.container'),
      overflow: 'hidden',
    }),
  },
  header: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: get(theme, 'spacing.md', 'theme.spacing.md'),
      borderBottom: `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
    }),
  },
  content: {
    default: (theme: Record<symbol, unknown>) => ({
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: `${get(theme, 'spacing.sm', 'theme.spacing.sm')} 0`,
    }),
  },
  footer: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      alignItems: 'center',
      padding: get(theme, 'spacing.md', 'theme.spacing.md'),
      borderTop: `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
    }),
  },
  item: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      alignItems: 'center',
      gap: get(theme, 'spacing.sm', 'theme.spacing.sm'),
      padding: `${get(theme, 'spacing.sm', 'theme.spacing.sm')} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
      cursor: 'pointer',
      color: get(theme, 'colors.text.default', 'theme.colors.text.default'),
      fontSize: get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
      fontFamily: get(theme, 'font.family', 'theme.font.family'),
      textDecoration: 'none',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left',
      transition: get(theme, 'values.transitions.sidebar.item', 'theme.values.transitions.sidebar.item'),
      '&:hover': {
        backgroundColor: get(theme, 'colors.bg.fill.secondary.hover', 'theme.colors.bg.fill.secondary.hover'),
      },
    }),
    active: (theme: Record<symbol, unknown>) => ({
      backgroundColor: get(theme, 'colors.bg.fill.secondary.hover', 'theme.colors.bg.fill.secondary.hover'),
      fontWeight: get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      color: get(theme, 'colors.text.active', 'theme.colors.text.active'),
      borderLeft: `3px solid ${get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary')}`,
    }),
    disabled: (theme: Record<symbol, unknown>) => ({
      color: get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),
    nested: {
      paddingBase: 16,
      paddingMultiplier: 16,
    },
    collapsed: (theme: Record<symbol, unknown>) => ({
      justifyContent: 'center',
      padding: get(theme, 'spacing.sm', 'theme.spacing.sm'),
    }),
  },
  group: {
    default: (theme: Record<symbol, unknown>) => ({
      overflow: 'hidden',
      transition: get(theme, 'values.transitions.sidebar.group', 'theme.values.transitions.sidebar.group'),
    }),
    expanded: {
      maxHeight: '1000px',
    },
    collapsed: {
      maxHeight: '0px',
    },
  },
  collapseButton: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: get(theme, 'radius.sm', 'theme.radius.sm'),
      color: get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      '&:hover': {
        backgroundColor: get(theme, 'colors.bg.fill.secondary.hover', 'theme.colors.bg.fill.secondary.hover'),
      },
    }),
  },
  expandIcon: {
    icon: {
      name: 'arrowRight',
      width: 14,
      height: 14,
    },
    default: (theme: Record<symbol, unknown>) => ({
      transition: get(theme, 'values.transitions.sidebar.expandIcon', 'theme.values.transitions.sidebar.expandIcon'),
    }),
    expanded: {
      transform: 'rotate(90deg)',
    },
  },
};
