import { get } from '@utils';

export const inputfile = {
  default: {
    overflow: 'hidden',
    position: 'relative',
  },
  input: {
    opacity: 0,
    inset: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.negative', 'theme.zIndex.negative'),
  },
};
