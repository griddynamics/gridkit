import { get } from '@utils';
import { display } from './display';
import { borders } from './borders';

export const switchToggle = {
  default: {
    display: display.inlineFlex,
    position: 'relative',
    padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
    border: (theme: Record<symbol, unknown>) =>
      borders.generic({
        color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
      }),
  },
  disabled: {
    opacity: '0.5',
    pointerEvents: 'none',
  },
};
