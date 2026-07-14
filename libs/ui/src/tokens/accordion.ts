import { get } from '@utils';

export const accordion = {
  header: {
    default: {
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      border: '0',
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.transparent', 'theme.colors.transparent'),
      paddingTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      paddingBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      ':first-of-type': {
        flex: '1',
      },
      '&:hover': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
      },
      '&:focus-visible': {
        outline: (theme: Record<symbol, unknown>) => get(theme, 'borders.focus', 'theme.borders.focus'),
        outlineOffset: '2px',
      },
    },
    inline: {
      width: 'auto',
      display: 'inline-flex',
      justifyContent: 'start',
    },
  },
  content: {
    default: {
      overflow: 'hidden',
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.accordion.toggle', 'theme.values.transitions.accordion.toggle'),
      height: 'auto',
    },
    opened: {
      paddingTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      paddingBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
    },
    closed: {
      maxHeight: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      paddingTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      paddingBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
  },
  item: {
    default: {
      position: 'relative',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
        left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
        right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
        height: '1px',
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.border.default', 'theme.colors.border.default'),
      },
    },
    noSeparator: {
      position: 'relative',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
    inline: {
      width: 'auto',
      display: 'inline-flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
    opened: {
      width: '100%',
    },
    closed: {},
  },
  icon: {
    default: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.accordion.icon', 'theme.values.transitions.accordion.icon'),
    },
    opened: {
      transform: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transform.rotateUp', 'theme.values.transform.rotateUp'),
    },
    closed: {
      transform: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transform.rotateReset', 'theme.values.transform.rotateReset'),
    },
  },
};
