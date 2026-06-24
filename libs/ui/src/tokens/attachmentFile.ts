import { get } from '@utils';

export const attachmentFile = {
  container: {
    default: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      paddingRight: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      paddingBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      paddingLeft: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
    },
  },
  info: {
    default: {
      paddingRight: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'hidden',
    },
  },
  name: {
    default: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  meta: {
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '4px',
    },
    text: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.title', 'theme.colors.text.title'),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  icon: {
    file: { name: 'fileCopy', size: 'xl', fillSvg: 'icon.default' },
    remove: { name: 'cross', size: 'md' },
  },
  button: {
    variant: 'tertiary',
    default: {
      width: '40px',
      height: '40px',
      flexShrink: 0,
    },
  },
};
