import { get } from '@utils';
import { WrapperVariant } from '@types';

export const wrapper = {
  default: {
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(2px)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  [WrapperVariant.Inline]: {
    display: 'inline-flex',
  },
  [WrapperVariant.Section]: {
    display: 'flex',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.high', 'theme.zIndex.high'),
  },
  [WrapperVariant.FullPage]: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.top', 'theme.zIndex.top'),
  },
};
