import { get } from '@utils';

export const loader = {
  default: {
    display: 'block',
  },
  attrs: {
    rounded: 'none',
  },
  inline: {},
  section: {},
  fullPage: {},
  circle: {
    default: {
      flexShrink: 0,
      border: (theme: Record<symbol, unknown>) =>
        `3px solid ${get(theme, 'colors.transparent', 'theme.colors.transparent')}`,
      borderTop: (theme: Record<symbol, unknown>) =>
        `3px solid ${get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary')}`,
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.round', 'theme.radius.round'),
    },
    xs: {
      borderWidth: '1px',
      width: '16px',
      height: '16px',
      minWidth: '16px',
      minHeight: '16px',
    },
    sm: {
      borderWidth: '2px',
      width: '24px',
      height: '24px',
      minWidth: '24px',
      minHeight: '24px',
      maxWidth: '24px',
      maxHeight: '24px',
    },
    md: {
      borderWidth: '3px',
      width: '32px',
      height: '32px',
      minWidth: '32px',
      minHeight: '32px',
      maxWidth: '32px',
      maxHeight: '32px',
    },
    lg: {
      borderWidth: '4px',
      width: '48px',
      height: '48px',
      minWidth: '48px',
      minHeight: '48px',
      maxWidth: '48px',
      maxHeight: '48px',
    },
    xl: {
      borderWidth: '5px',
      width: '54px',
      height: '54px',
      minWidth: '54px',
      minHeight: '54px',
      maxWidth: '54px',
      maxHeight: '54px',
    },
  },
  dots: {
    default: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    xs: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      '.dot': {
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
        width: '8px',
        height: '8px',
        '&:nth-of-type(1)': {
          animationDelay: '-0.32s',
        },
        '&:nth-of-type(2)': {
          animationDelay: '-0.16s',
        },
      },
    },
    sm: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      '.dot': {
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
        width: '12px',
        height: '12px',
        '&:nth-of-type(1)': {
          animationDelay: '-0.32s',
        },
        '&:nth-of-type(2)': {
          animationDelay: '-0.16s',
        },
      },
    },
    md: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      '.dot': {
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
        width: '16px',
        height: '16px',
        '&:nth-of-type(1)': {
          animationDelay: '-0.32s',
        },
        '&:nth-of-type(2)': {
          animationDelay: '-0.16s',
        },
      },
    },
    lg: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      '.dot': {
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
        width: '24px',
        height: '24px',
        '&:nth-of-type(1)': {
          animationDelay: '-0.32s',
        },
        '&:nth-of-type(2)': {
          animationDelay: '-0.16s',
        },
      },
    },
    xl: {
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      '.dot': {
        background: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
        width: '32px',
        height: '32px',
        '&:nth-of-type(1)': {
          animationDelay: '-0.32s',
        },
        '&:nth-of-type(2)': {
          animationDelay: '-0.16s',
        },
      },
    },
  },
  animation: {
    circle: {
      name: 'spinKeyframes',
    },
    dots: {
      name: 'bounceKeyframes',
    },
  },
};
