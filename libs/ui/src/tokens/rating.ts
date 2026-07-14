import { get } from '@utils';
import { SizeVariant } from '@types';

import { cursors } from './cursors';
import { display } from './display';

export const rating = {
  default: {
    display: display.inlineFlex,
    alignItems: 'center',
    gap: 0,
    position: 'relative',
    overflow: 'hidden',
    width: 'fit-content',
  },
  progress: {
    default: {
      position: 'absolute',
      display: display.flex,
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
      display: display.none,
    },
  },
  label: {
    default: {
      cursor: cursors.pointer,
    },
    active: {
      '&:hover': {
        transform: 'scale(1.2)',
        transition: (theme: Record<symbol, unknown>) =>
          get(theme, 'values.transitions.rating.label', 'theme.values.transitions.rating.label'),
      },
    },
    readOnly: {
      cursor: cursors.default,
    },
  },
  size: {
    [SizeVariant.Sm]: { width: 12, height: 12 },
    [SizeVariant.Md]: { width: 24, height: 24 },
    [SizeVariant.Lg]: { width: 48, height: 48 },
    [SizeVariant.Xl]: { width: 60, height: 60 },
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
