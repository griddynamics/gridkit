import { get } from '@utils';

import { hexToRgba } from './utils';
import { icon } from './icon';

export const imagePreview = {
  container: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'relative',
    },
    horizontal: {
      flexDirection: 'row',
    },
  },
  mainImage: {
    default: {
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageStyles: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
  thumbnails: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      gap: get(theme, 'spacing.xs', 'theme.spacing.xs'),
      overflow: 'auto',
    }),
    bottom: {
      flexDirection: 'row',
    },
    left: {
      flexDirection: 'column',
      maxHeight: '100%',
    },
  },
  thumbnail: {
    default: (theme: Record<symbol, unknown>) => ({
      width: '64px',
      height: '64px',
      borderRadius: get(theme, 'radius.sm', 'theme.radius.sm'),
      overflow: 'hidden',
      cursor: 'pointer',
      opacity: 0.5,
      transition: get(
        theme,
        'values.transitions.imagePreview.thumbnail',
        'theme.values.transitions.imagePreview.thumbnail'
      ),
      border: `2px solid transparent`,
      flexShrink: 0,
      '&:hover': {
        opacity: 0.8,
      },
    }),
    active: (theme: Record<symbol, unknown>) => ({
      opacity: 1,
      borderColor: get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    }),
    imageStyles: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  arrow: {
    default: (theme: Record<symbol, unknown>) => ({
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: hexToRgba(get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'), 0.85),
      border: 'none',
      cursor: 'pointer',
      zIndex: get(theme, 'zIndex.first', 'theme.zIndex.first'),
      color: get(theme, 'colors.text.default', 'theme.colors.text.default'),
      '&:hover': {
        backgroundColor: get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      },
      '&:disabled': {
        opacity: 0.3,
        cursor: 'default',
      },
    }),
    prev: {
      left: '8px',
    },
    next: {
      right: '8px',
    },
    icon: {
      prev: {
        name: 'arrowLeft',
        ...icon.size.md,
      },
      next: {
        name: 'arrowRight',
        ...icon.size.md,
      },
    },
  },
  counter: {
    default: (theme: Record<symbol, unknown>) => ({
      position: 'absolute',
      bottom: get(theme, 'spacing.sm', 'theme.spacing.sm'),
      right: get(theme, 'spacing.sm', 'theme.spacing.sm'),
      backgroundColor: hexToRgba(get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'), 0.6),
      color: get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      padding: `${get(theme, 'spacing.xs', 'theme.spacing.xs')} ${get(theme, 'spacing.sm', 'theme.spacing.sm')}`,
      borderRadius: get(theme, 'radius.sm', 'theme.radius.sm'),
      fontSize: get(theme, 'font.size.caption', 'theme.font.size.caption'),
      lineHeight: get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      fontFamily: get(theme, 'font.family', 'theme.font.family'),
      zIndex: get(theme, 'zIndex.first', 'theme.zIndex.first'),
    }),
  },
  lightbox: {
    overlay: (theme: Record<symbol, unknown>) => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: hexToRgba(get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'), 0.9),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: get(theme, 'zIndex.top', 'theme.zIndex.top'),
    }),
    close: (theme: Record<symbol, unknown>) => ({
      position: 'absolute',
      top: get(theme, 'spacing.md', 'theme.spacing.md'),
      right: get(theme, 'spacing.md', 'theme.spacing.md'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: hexToRgba(get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'), 0.15),
      border: 'none',
      cursor: 'pointer',
      color: get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      zIndex: get(theme, 'zIndex.first', 'theme.zIndex.first'),
      '&:hover': {
        backgroundColor: hexToRgba(get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'), 0.3),
      },
    }),
    closeIcon: {
      name: 'cross',
      ...icon.size.md,
    },
    image: {
      maxWidth: '90vw',
      maxHeight: '85vh',
      objectFit: 'contain',
    },
    arrow: {
      position: 'fixed',
      top: '50%',
    },
    counter: (theme: Record<symbol, unknown>) => ({
      position: 'fixed',
      bottom: get(theme, 'spacing.md', 'theme.spacing.md'),
      right: get(theme, 'spacing.md', 'theme.spacing.md'),
    }),
  },
};
