import { get } from '@utils';

export const menu = {
  wrapper: {
    default: {},
  },
  content: {
    default: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.neutral.white', 'theme.colors.neutral.white'),
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.high', 'theme.zIndex.high'),
      position: 'absolute',
      overflow: 'auto',
      boxShadow: (theme: Record<symbol, unknown>) => get(theme, 'shadows.box["1"]', 'theme.shadows.box["1"]'),
    },
  },
  attrs: {
    minHeight: 80,
    maxHeight: 400,
    offsetX: 4,
    offsetY: 4,
  },
};
