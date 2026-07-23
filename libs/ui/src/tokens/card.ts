import { get } from '@utils';

import { hexToRgba } from './utils';
import { icon } from './icon';

/**
 * Card component tokens
 * Base styles (display flex, focus-visible) are now handled by the Box component
 */
export const card = {
  default: {},

  title: {
    default: (theme: Record<symbol, unknown>) => ({
      margin: get(theme, 'spacing.none', 'theme.spacing.none'),
      padding: get(theme, 'spacing.none', 'theme.spacing.none'),
    }),
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  description: {
    default: (theme: Record<symbol, unknown>) => ({
      margin: get(theme, 'spacing.none', 'theme.spacing.none'),
      padding: get(theme, 'spacing.none', 'theme.spacing.none'),
    }),
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  rating: {
    default: (theme: Record<symbol, unknown>) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: get(theme, 'spacing.sm', 'theme.spacing.sm'),
    }),
    vertical: {
      default: (theme: Record<symbol, unknown>) => ({
        color: get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
        fontSize: get(theme, 'font.size.caption', 'theme.font.size.caption'),
        fontWeight: get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      }),
      sm: (theme: Record<symbol, unknown>) => ({
        color: get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
        flexDirection: 'column',
        fontSize: get(theme, 'font.size.caption', 'theme.font.size.caption'),
        fontWeight: get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      }),
    },
    horizontal: {
      default: (theme: Record<symbol, unknown>) => ({
        color: get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
        fontSize: get(theme, 'font.size.caption', 'theme.font.size.caption'),
        fontWeight: get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      }),
      sm: (theme: Record<symbol, unknown>) => ({
        color: get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
        flexDirection: 'column',
        fontSize: get(theme, 'font.size.caption', 'theme.font.size.caption'),
        fontWeight: get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
        lineHeight: get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      }),
    },
  },
  button: {
    default: {
      display: 'flex',
    },
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  image: {
    default: {},
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  counter: {
    default: {},
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  wishlist: {
    default: {
      position: 'absolute',
      top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        hexToRgba(get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'), 0.85),
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.card.wishlist', 'theme.values.transitions.card.wishlist'),
      '&:hover': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
        transform: 'scale(1.1)',
      },
    },
    active: {
      color: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.status.error.primary', 'theme.colors.status.error.primary'),
    },
    icon: {
      active: {
        name: 'favorite',
        ...icon.size.md,
      },
      inactive: {
        name: 'favoriteOutlined',
        ...icon.size.md,
      },
    },
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  badge: {
    default: {
      position: 'absolute',
      top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
    },
    vertical: {
      default: {},
      sm: {},
    },
    horizontal: {
      default: {},
      sm: {},
    },
  },
  price: {
    default: {
      display: 'flex',
    },
    vertical: {
      default: {},
      sm: (theme: Record<symbol, unknown>) => ({
        '& > div > *': {
          fontSize: get(theme, 'font.size.h6', 'theme.font.size.h6'),
          fontWeight: get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
          lineHeight: get(theme, 'font.line.height.h6', 'theme.font.line.height.h6'),
          marginTop: get(theme, 'spacing.sm', 'theme.spacing.sm'),
          marginBottom: get(theme, 'spacing.sm', 'theme.spacing.sm'),
        },
      }),
    },
    horizontal: {
      default: {},
      sm: (theme: Record<symbol, unknown>) => ({
        '& > div > *': {
          fontSize: get(theme, 'font.size.h6', 'theme.font.size.h6'),
          fontWeight: get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
          lineHeight: get(theme, 'font.line.height.h6', 'theme.font.line.height.h6'),
          marginTop: get(theme, 'spacing.sm', 'theme.spacing.sm'),
          marginBottom: get(theme, 'spacing.sm', 'theme.spacing.sm'),
        },
      }),
    },
  },
};
