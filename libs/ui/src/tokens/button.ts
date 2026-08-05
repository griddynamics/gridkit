import { get } from '@utils';
import { borders } from './borders';
import { getFocusStyles } from './utils';

export const button = {
  default: {
    border: 0,
    outline: 0,
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
    padding: (theme: Record<symbol, unknown>) => {
      const sm = get(theme, 'spacing.sm', 'theme.spacing.sm');
      const lg = get(theme, 'spacing.md', 'theme.spacing.md');
      if (sm && lg) return `${sm} ${lg}`;
      return 'theme.spacing.sm theme.spacing.lg';
    },
    display: 'flex',
    alignItems: 'center',
    gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    transition: (theme: Record<symbol, unknown>) =>
      get(theme, 'values.transitions.button.default', 'theme.values.transitions.button.default'),
    cursor: 'pointer',
    '&:focus-visible': (theme: Record<symbol, unknown>) =>
      getFocusStyles({
        inset: '-4px',
        border: borders.generic({
          width: '2px',
          color: get(theme, 'colors.border.focus', 'theme.colors.border.focus'),
        }),
      }),
    '&:disabled, &:disabled *': {
      cursor: 'default',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
    },
  },
  attrs: {
    rounded: 'none',
  },
  icon: {
    padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    justifyContent: 'center',
    '& span': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  content: {
    default: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minWidth: '0',
    },
  },
  fullWidth: {
    width: '100%',
  },
  startIcon: {
    default: {},
  },
  endIcon: {
    default: {},
  },
  primary: {
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
    background: (theme: Record<symbol, unknown>) =>
      get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    '&:hover, &.hover': {
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.secondary', 'theme.colors.bg.fill.secondary'),
    },
    '&:active, &.active': {
      background: (theme: Record<symbol, unknown>) =>
        get(
          theme,
          'colors.bg.fill.warning.primary.default',
          get(theme, 'colors.bg.fill.warning.primary.default', 'theme.colors.bg.fill.warning.primary.default')
        ),
    },
    '&:disabled, &.disabled': {
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
    },
  },
  secondary: {
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
    '&:hover, &.hover': {
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
    },
    '&:active, &.active': {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.secondary', 'theme.colors.bg.fill.secondary'),
    },
    '&:disabled, &.disabled': {
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.disabled', 'theme.colors.bg.fill.disabled'),
    },
  },
  tertiary: {
    background: 'transparent',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    '&:hover, &.hover': {
      background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
    },
    '&:active, &.active': {
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    },
    '&:disabled, &.disabled': {
      background: 'transparent',
    },
  },
  outlined: {
    background: 'transparent',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    border: (theme: Record<symbol, unknown>) =>
      borders.generic({
        width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
        color: get(theme, 'colors.border.black', 'theme.colors.border.black'),
      }),
    '&:hover, &.hover': {
      background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
    },
    '&:active, &.active': {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
      background: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    },
    '&:disabled, &.disabled': {
      background: 'transparent',
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.disabled', 'theme.colors.border.disabled'),
    },
  },
  text: {
    background: 'transparent',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    '&:hover, &.hover': {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.primary', 'theme.colors.text.primary'),
    },
    '&:active, &.active': {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.secondary', 'theme.colors.text.secondary'),
    },
  },
  inherit: {
    fontWeight: 'inherit',
    '&:not(:disabled):active, &.active': {
      transform: 'none',
    },
    '&:hover, &.hover': {},
    '&:disabled, &.disabled': {},
  },
  loader: {
    attrs: {
      withWrapper: false,
      size: 'sm',
    },
  },
};
