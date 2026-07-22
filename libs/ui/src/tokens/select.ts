import { get } from '@utils';
import { getSpacing } from '@tokens/utils';
import { borders } from '@tokens/borders';

export const select = {
  default: {
    display: 'inline-block',
    position: 'relative',
  },
  initiatorWrapper: {
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    '& > *': {
      width: '100%',
    },
    '.gd-button__content': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'block',
    },
  },
  dropdown: {
    position: 'absolute',
    textAlign: 'left',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
    boxShadow: (theme: Record<symbol, unknown>) => get(theme, 'shadows.box["3"]', 'theme.shadows.box["3"]'),
    fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    listStyleType: 'none',
    margin: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.top', 'theme.zIndex.top'),
    overflowY: 'auto',
  },
  button: {
    default: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
        }),

      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'left',

      '.gd-button__content': {
        justifyContent: 'flex-start',
      },
    },
    primary: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
        }),
    },
    success: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.success', 'theme.colors.border.success'),
        }),
    },
    warning: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
        }),
    },
    error: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.error', 'theme.colors.border.error'),
        }),
    },
    attrs: {
      variant: 'inherit',
    },
  },
  item: {
    default: {
      cursor: 'pointer',
      padding: getSpacing(2),
      '&:hover, &.active': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
      },
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  arrowIconWrapper: {
    default: {
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.select.arrowIconWrapper', 'theme.values.transitions.select.arrowIconWrapper'),
    },
    transform: {
      open: { transform: 'rotate(180deg)' },
      close: { transform: 'rotate(0deg)' },
    },
  },
  icons: {
    arrowIcon: {
      name: 'keyboardArrowDown',
      fill: 'icon.default',
      width: 18,
      height: 18,
    },
  },

  adornment: {
    default: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      position: 'relative',
      zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.first', 'theme.zIndex.first'),
    },
  },

  searchInput: {
    default: {
      width: '100%',
      boxSizing: 'border-box',
      padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      border: 'none',
      borderBottom: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
        }),
      outline: 'none',
      fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
      backgroundColor: 'transparent',
      '&::placeholder': {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.secondary', 'theme.colors.text.secondary'),
      },
    },
  },
};
