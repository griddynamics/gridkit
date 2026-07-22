import { get } from '@utils';

import { hexToRgba } from './utils';

export const chatbubble = {
  default: {
    display: 'flex',
    flexDirection: 'column',
    gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    clear: 'both',
    margin: (theme: Record<symbol, unknown>) => {
      const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
      if (sm) return `${sm} 0`;
      return 'theme.spacing.sm 0';
    },
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'font.size.small'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.small', 'font.line.height.small'),
  },
  question: {
    default: {
      padding: (theme: Record<symbol, unknown>) => {
        const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
        const md = get(theme, 'spacing.md', 'theme.spacing.md');
        if (sm && md) return `${sm} ${md}`;
        return 'theme.spacing.sm theme.spacing.md';
      },
      float: 'right',
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
    },
    xs: { maxWidth: '320px' },
    sm: { maxWidth: '348px' },
    md: { maxWidth: '472px' },
    lg: { maxWidth: '566px' },
  },
  answer: {
    default: {
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      width: '100%',
    },
  },
  size: {
    sm: {
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'font.size.caption'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.caption', 'font.line.height.caption'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    },
    md: {},
    lg: {
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'font.size.p'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.p', 'font.line.height.p'),
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
    },
  },
  pending: {},
  fulfilled: {},
  rejected: {},
  content: {
    default: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      display: 'flex',
      flexDirection: 'column',
    },
    pending: {
      alignItems: 'flex-start',
    },
    fulfilled: {},
    rejected: {},
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
  loader: {
    attrs: {
      name: 'dots',
      size: 'xs',
      withWrapper: false,
      rounded: (theme: Record<symbol, unknown>) => get(theme, 'radius.round', 'theme.spacing.sm'),
    },
  },

  imageGallery: {
    default: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      overflow: 'hidden',
    },
    image: {
      position: 'relative',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      aspectRatio: '1',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        hexToRgba(get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'), 0.5),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.white', 'theme.colors.text.white'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h5', 'font.size.h5'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
    },
    imageStyles: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },

  linkPreview: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      overflow: 'hidden',
      border: (theme: Record<symbol, unknown>) => {
        const color = get(theme, 'colors.border.default', 'theme.colors.border.default');
        return `1px solid ${color}`;
      },
      textDecoration: 'none',
      color: 'inherit',
      '&:hover': {
        opacity: 0.9,
      },
    },
    thumbnail: {
      width: '100%',
      height: '160px',
      overflow: 'hidden',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
    },
    content: {
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      display: 'flex',
      flexDirection: 'column',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    },
    title: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    description: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.secondary', 'theme.colors.text.secondary'),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    domain: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
    },
    imageStyles: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
};
