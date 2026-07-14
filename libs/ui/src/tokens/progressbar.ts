import { calculateJustify, get } from '@utils';

import { display, flexAlignItems } from './display';

export const progressbar = {
  styledProgressBar: {
    default: {
      width: '100%',
      display: display.block,
    },
  },
  styledTrack: {
    default: {
      position: 'relative',
      width: '100%',
      height: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
      overflow: 'hidden',
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
    },
  },
  styledDeterminateFill: {
    default: {
      display: display.flex,
      alignItems: flexAlignItems.center,
      justifyContent: calculateJustify('end'),
      paddingRight: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      whiteSpace: 'nowrap',
      height: '100%',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      transition: (theme: Record<symbol, unknown>) =>
        get(
          theme,
          'values.transitions.progressbar.styledDeterminateFill',
          'theme.values.transitions.progressbar.styledDeterminateFill'
        ),
    },
  },
  styledIndeterminateFill: {
    default: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      width: '30%',
      height: '100%',
    },
  },
  styledIndeterminateFillAnimations: {
    animationName: 'progressIndeterminate',
    animationProps: '1.2s infinite ease-in-out',
  },
  styledPercentLabel: {
    default: {
      display: display.flex,
      alignItems: flexAlignItems.center,
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
      height: '100%',
      userSelect: 'none',
    },
  },
};
