import { get } from '@utils';

export const table = {
  default: {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  header: {
    default: {},
    base: {
      borderBottom: (theme: Record<symbol, unknown>) =>
        `3px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
    },
    sticky: {
      position: 'sticky',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      top: 0,
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.low', 'theme.zIndex.low'),
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        borderBottom: (theme: Record<symbol, unknown>) =>
          `3px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
      },
    },
  },
  headerCell: {
    default: {
      textAlign: 'left',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
    },
  },
  body: {
    default: {},
  },
  row: {
    default: {},
    header: {},
    footer: {},
    body: {
      borderBottom: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
      '&:hover': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
      },
    },
    expanded: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
    },
    expandable: {
      cursor: 'pointer',
    },
  },
  cell: {
    default: {
      textAlign: 'left',
      verticalAlign: 'middle',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
    },
  },
  footer: {
    default: {},
    base: {},
    sticky: {
      position: 'sticky',
      bottom: 0,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.low', 'theme.zIndex.low'),
    },
  },
  pagination: {
    default: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xxl', 'theme.spacing.xxl'),
      paddingTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      paddingBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
    },
    sticky: {
      position: 'sticky',
      bottom: '0',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.low', 'theme.zIndex.low'),
    },
    leftSection: {
      display: 'flex',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      alignItems: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    },
    buttonPerPage: {
      default: {
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        minWidth: '28px',
        aspectRatio: 1,
        padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      },
      attrs: {
        variant: 'secondary',
      },
    },
    pagePrevNext: {
      default: {
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
      },
      attrs: {
        variant: 'text',
        isIcon: true,
      },
      icons: {
        prev: {
          name: 'arrowLeft',
          size: 'sm',
        },
        next: {
          name: 'arrowRight',
          size: 'sm',
        },
      },
    },
    buttonPage: {
      default: {
        fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
      },
      attrs: {
        variant: 'text',
      },
    },
  },
};
