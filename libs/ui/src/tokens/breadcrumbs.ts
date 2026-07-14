import { get } from '@utils';

export const breadcrumbs = {
  default: {
    display: 'flex',
    alignItems: 'center',
    gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
  },
  bordered: {
    padding: (theme: Record<symbol, unknown>) => {
      const md = get(theme, 'spacing.md', 'theme.spacing.md');
      const lg = get(theme, 'spacing.lg', 'theme.spacing.lg');
      if (md && lg) return `${md} ${lg}`;
      return 'theme.spacing.md theme.spacing.lg';
    },
    border: (theme: Record<symbol, unknown>) =>
      `1px solid ${get(theme, 'colors.border.default', 'theme.colors.border.default')}`,
  },
  item: {
    default: {},
    itemStart: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
    },
    itemEnd: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
    },
  },
  separator: {
    default: {
      display: 'flex',
      alignItems: 'center',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
    },
  },
};
