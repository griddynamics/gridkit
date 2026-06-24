export const animations = {
  spinKeyframes: {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  bounceKeyframes: {
    '0%, 80%, 100%': {
      transform: 'scale(1) translateY(0)',
    },
    '40%': {
      transform: 'scale(1) translateY(-15px)',
    },
  },

  slideIn: {
    '0%': { transform: 'translateY(100%)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  slideOut: {
    '0%': { transform: 'translateY(0)', opacity: 1 },
    '100%': { transform: 'translateY(100%)', opacity: 0 },
  },
  blinkKeyframes: {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.4,
    },
    '100%': {
      opacity: 1,
    },
  },
  progressIndeterminate: {
    '0%': { transform: 'translateX(-100%)' },
    '50%': { transform: 'translateX(120%)' },
    '100%': { transform: 'translateX(350%)' },
  },
  tooltipFadeIn: {
    '0%': { opacity: 0, transform: 'translateY(3px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
};
