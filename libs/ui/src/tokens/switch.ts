import { get } from '@utils';

export const switchToken = {
  default: {
    position: 'relative',
    display: 'inline-flex',
    width: '45px',
    height: '24px',
    flexShrink: 0,
    borderRadius: '20px',
  },
  checked: {
    justifyContent: 'flex-end',
  },
  label: {
    right: {
      order: 1,
    },
  },
  wrapper: {
    default: {
      display: 'inline-flex',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      justifyContent: 'center',
      cursor: 'pointer',
    },
    disabled: {
      cursor: 'default',
    },
  },
  slider: {
    default: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      transition: '0.2s',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
      borderRadius: 'inherit',

      '&::before': {
        position: 'absolute',
        content: '""',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        left: '3px',
        bottom: '3px',
        transition: '0.2s',
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      },
    },
    checked: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.primary.default', 'theme.colors.primary.default'),
      '&::before': {
        transform: 'translateX(21px)',
      },
    },
    disabled: {
      opacity: '40%',
    },
    loader: {
      attrs: {
        size: 'sm',
        withWrapper: false,
      },
    },
  },
  checkbox: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
};
