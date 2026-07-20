import { get } from '@utils';

import { borders } from './borders';

export const avatar = {
  default: {
    borderRadius: '50%',
    position: 'relative',
    width: 42,
    height: 42,
  },
  imageWrapper: {
    default: {
      borderRadius: '50%',
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      alignContent: 'center',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    },
  },
  badge: {
    default: {
      position: 'absolute',
      borderRadius: '50%',
      // Default size variant (MD)
      width: 16,
      height: 16,
      border: borders.generic({ width: '2.3px', color: 'white', type: 'solid' }),
      top: -2,
      right: 0,
    },

    size: {
      xs: {
        width: 8,
        height: 8,
        border: borders.generic({ width: '1px', color: 'white', type: 'solid' }),
        top: -1,
        right: 0,
      },
      sm: {
        width: 14,
        height: 14,
        border: borders.generic({ width: '2px', color: 'white', type: 'solid' }),
        top: -2,
        right: 0,
      },
      md: {
        width: 16,
        height: 16,
        border: borders.generic({ width: '2.3px', color: 'white', type: 'solid' }),
        top: -2,
        right: 0,
      },
      lg: {
        width: 18,
        height: 18,
        border: borders.generic({ width: '2.7px', color: 'white', type: 'solid' }),
        top: -1,
        right: 0,
      },
      xl: {
        width: 22,
        height: 22,
        border: borders.generic({ width: '3px', color: 'white', type: 'solid' }),
        top: 0,
        right: 0,
      },
    },
  },
  fallbackText: {
    default: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    attrs: {
      default: {
        variant: 'h6',
        align: 'center',
      },
      size: {
        xs: { variant: 'caption' },
        sm: { variant: 'small' },
        md: { variant: 'h6' },
        lg: { variant: 'h5' },
        xl: { variant: 'h4' },
      },
    },
  },
  size: {
    xs: {
      width: 24,
      height: 24,
    },
    sm: {
      width: 32,
      height: 32,
    },
    md: {
      width: 40,
      height: 40,
    },
    lg: {
      width: 56,
      height: 56,
    },
    xl: {
      width: 64,
      height: 64,
    },
    xxl: {
      width: 80,
      height: 80,
    },
  },

  variantConfig: {
    card: {
      defaultSize: 'sm',
      nameVariant: 'small',
      subtitleVariant: 'caption',
      tokenKey: 'userCard',
    },
    profile: {
      defaultSize: 'lg',
      nameVariant: 'h6',
      subtitleVariant: 'small',
      tokenKey: 'userProfile',
    },
  },

  userCard: {
    default: {
      display: 'flex',
      alignItems: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      cursor: 'pointer',
    },
    name: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      lineHeight: 1.3,
    },
    subtitle: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.secondary', 'theme.colors.text.secondary'),
      lineHeight: 1.3,
    },
  },

  userProfile: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      textAlign: 'center',
    },
    name: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    },
    subtitle: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.secondary', 'theme.colors.text.secondary'),
    },
    action: {
      marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    },
  },
};
