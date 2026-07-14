import { getSpacing } from './utils';

export const separator = {
  default: {
    alignItems: 'center',
    justifyItems: 'center',
    gap: getSpacing(4),
  },
  horizontal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  vertical: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: getSpacing(1),
  },
  line: {
    default: {
      flex: 1,
      minWidth: 0,
      minHeight: 0,
    },
    horizontal: {
      width: 'auto',
    },
    vertical: {
      height: 'auto',
    },
  },
  label: {
    default: {},
    attrs: {
      xs: {
        $variant: 'caption',
        $as: 'caption',
      },
      sm: {
        $variant: 'body2',
        $as: 'body2',
      },
      md: {
        $variant: 'body1',
        $as: 'body1',
      },
      lg: {
        $variant: 'h6',
        $as: 'h6',
      },
      xl: {
        $variant: 'h5',
        $as: 'h5',
      },
      xxl: {
        $variant: 'h4',
        $as: 'h4',
      },
    },
  },
};
