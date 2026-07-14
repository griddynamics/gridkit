import { get } from '@utils';

export const sliderDots = {
  container: {
    default: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
    },
  },
  dot: {
    default: (theme: Record<symbol, unknown>) => ({
      width: '8px',
      height: '8px',
      borderRadius: get(theme, 'radius.round', 'theme.radius.round'),
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      transition: get(theme, 'values.transitions.sliderDots.dot', 'theme.values.transitions.sliderDots.dot'),
      backgroundColor: get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
      '&:hover': {
        backgroundColor: get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      },
    }),
    active: (theme: Record<symbol, unknown>) => ({
      width: '32px',
      borderRadius: '4px',
      backgroundColor: get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      '&:hover': {
        backgroundColor: get(theme, 'colors.bg.fill.primary.hover', 'theme.colors.bg.fill.primary.hover'),
      },
    }),
  },
};
