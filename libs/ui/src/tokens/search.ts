import { get } from '@utils';

export const search = {
  default: {},
  input: {
    default: {
      width: '100%',
      boxSizing: 'border-box',
    },
  },
  dropdownHeader: {
    row: {},
    link: {
      default: {},
      typography: {},
    },
    icon: {},
  },
  renderer: {
    row: {
      width: '100%',
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.md', 'theme.spacing.md')} ${get(theme, 'spacing.md', 'theme.spacing.md')} 0`,
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      '&:after': {
        borderBottom: 'none',
      },
      '& svg': {
        marginLeft: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      },
    },
    linkIcon: {
      fill: (theme: Record<symbol, unknown>) => get(theme, 'colors.icon.default', 'theme.colors.icon.default'),
      name: 'arrowRight',
      width: 10,
      height: 10,
    },
  },
};
