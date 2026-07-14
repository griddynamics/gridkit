import { get } from '@utils';
import { borders } from '@tokens/borders';

export const textarea = {
  default: {
    width: '100%',
    fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.p`, `theme.font.size.p`),
    padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    backgroundColor: (theme: Record<symbol, unknown>) =>
      get(theme, 'colors.bg.fill.input.default', 'theme.colors.bg.fill.input.default'),
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.default', 'theme.colors.border.default'),
    borderWidth: (theme: Record<symbol, unknown>) => get(theme, 'values.borderThin', 'theme.values.borderThin'),
    borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
    '&::placeholder': {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
    },
    '&:read-only, &:disabled': {
      opacity: 0.5,
      cursor: 'pointer',
      outline: 'none',
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.input.disabled', 'theme.colors.bg.fill.input.disabled'),
    },
    '&:hover': {
      borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.black', 'theme.colors.border.black'),
    },
    '&:active': {},
    '&:focus': {},
    '&:not(&:read-only, &:disabled):focus-visible': {
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.default', 'theme.colors.border.default'),
      outline: (theme: Record<symbol, unknown>) => borders.focus(theme),
      outlineOffset: '2px',
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.none', 'theme.radius.none'),
    },
    '&:disabled': {},
    '&:read-only': {},
  },
  inline: {
    width: '100%',
    '&::placeholder': {},
    '&:hover': {},
    '&:active': {},
    '&:focus': {},
    '&:focus-visible': {
      border: 'none',
      outline: 'none',
    },
    '&:disabled': {},
    '&:read-only': {},
  },
  primary: {
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.default', 'theme.colors.border.default'),
    '&:hover': {
      borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.black', 'theme.colors.border.black'),
    },
    '&:not(&:read-only, &:disabled):focus-visible': {
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.default', 'theme.colors.border.default'),
    },
  },
  success: {
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.success', 'theme.colors.border.success'),
    '&:hover': {
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.success', 'theme.colors.border.success'),
    },
    '&:not(&:read-only, &:disabled):focus-visible': {
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.success', 'theme.colors.border.success'),
    },
  },
  warning: {
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
    '&:hover': {
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
    },
    '&:not(&:read-only, &:disabled):focus-visible': {
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.border.primary', 'theme.colors.border.primary'),
    },
  },
  error: {
    borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.error', 'theme.colors.border.error'),
    '&:hover': {
      borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.error', 'theme.colors.border.error'),
    },
    '&:not(&:read-only, &:disabled):focus-visible': {
      borderColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.border.error', 'theme.colors.border.error'),
    },
  },
  charCount: {
    default: {
      display: 'block',
      textAlign: 'right',
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xs', 'theme.spacing.xs'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
    },
    exceeded: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.error', 'theme.colors.text.error'),
    },
  },
};
