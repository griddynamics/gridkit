import { get } from '@utils';

export const rating = {
  default: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0,
    position: 'relative',
    overflow: 'hidden',
    width: 'fit-content',
  },
  progress: {
    default: {
      position: 'absolute',
      display: 'flex',
      overflow: 'hidden',
      left: 0,
      svg: {
        flexShrink: 0,
        flexGrow: 0,
      },
    },
  },
  radioInput: {
    default: {
      display: 'none',
    },
  },
  label: {
    default: {
      cursor: 'pointer',
    },
    active: {
      '&:hover': {
        transform: 'scale(1.2)',
        transition: (theme: Record<symbol, unknown>) =>
          get(theme, 'values.transitions.rating.label', 'theme.values.transitions.rating.label'),
      },
    },
    readOnly: {
      cursor: 'default',
    },
  },
  size: {
    sm: { width: 12, height: 12 },
    md: { width: 24, height: 24 },
    lg: { width: 48, height: 48 },
    xl: { width: 60, height: 60 },
  },
  icons: {
    rateActive: {
      name: 'star',
      fill: 'bg.fill.primary',
    },
    rateHalfActive: {
      name: 'starHalf',
      fill: 'bg.fill.primary',
    },
    rateInactive: {
      name: 'starOutlined',
      fill: 'bg.fill.disabled',
    },
  },
};
