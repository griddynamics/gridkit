import { SizeVariant, SkeletonVariant } from '@types';

import { get } from '@utils';
import { hexToRgba } from './utils';

export const skeleton = {
  default: {
    display: 'flex',
    position: 'relative',
    backgroundColor: (theme: Record<symbol, unknown>) =>
      hexToRgba(get(theme, 'colors.neutral["grey.30"]', 'theme.colors.neutral["grey.30"]'), 0.7),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    '&:empty::before': {
      content: '"\xa0"',
    },
  },

  [SkeletonVariant.Rounded]: {
    borderRadius: (theme: Record<symbol, unknown>) =>
      get(theme, `radius.${SizeVariant.Sm}`, `theme.radius.${SizeVariant.Sm}`),
  },
  [SkeletonVariant.Rectangular]: {
    borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
  },
  [SkeletonVariant.Circular]: {
    borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.round', 'theme.radius.round'),
  },

  cards: {
    search: {
      default: {},
      container: {
        padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
        boxSizing: 'border-box',
        flexWrap: 'nowrap',
        flexDirection: 'column',
      },
      header: {
        width: '100%',
        marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      },
      row: {
        width: '100%',
        marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
        gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      },
      columnImage: {
        default: {
          flex: 1,
        },
        image: {
          width: '85px',
          height: '85px',
        },
      },
      columnText: {
        default: {
          flex: 3,
        },
        description: {
          width: '100%',
          height: (theme: Record<symbol, unknown>) =>
            get(theme, `spacing.${SizeVariant.Lg}`, `theme.spacing.${SizeVariant.Lg}`),
          marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
        },
        price: {
          width: '50%',
          height: (theme: Record<symbol, unknown>) =>
            get(theme, `spacing.${SizeVariant.Lg}`, `theme.spacing.${SizeVariant.Lg}`),
          marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
        },
      },
    },
  },
};
