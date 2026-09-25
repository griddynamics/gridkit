import { get } from '@utils';
import { getSpacing } from './utils';

export const counter = {
  default: {
    display: 'flex',
    width: '140px',
    '& input': {
      width: '100%',
      textAlign: 'center',
    },
  },
  navButton: {
    default: {
      padding: getSpacing(3),
      borderWidth: (theme: Record<symbol, unknown>) => get(theme, 'values.borderThin', 'theme.values.borderThin'),
      '&:disabled': {
        opacity: 0.5,
        backgroundColor: 'inherit',
        borderWidth: (theme: Record<symbol, unknown>) => get(theme, 'values.borderThin', 'theme.values.borderThin'),
      },
    },
    attrs: {
      variant: 'outlined',
      isIcon: true,
    },
  },
  icons: {
    plus: {
      name: 'plus',
      width: 14,
      height: 14,
    },
    minus: {
      name: 'minus',
      width: 14,
      height: 14,
    },
  },
  webComponent: {
    host: { display: 'inline-block' },
    root: { display: 'flex', boxSizing: 'border-box' },
    inputHost: { flex: '1 1 auto', minWidth: 0 },
    inputOuter: { width: '100%' },
    inputControl: {
      appearance: 'textfield',
      MozAppearance: 'textfield',
      textAlign: 'center',
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
    },
  },
};
