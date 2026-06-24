import { get } from '@utils';

import { borders } from './borders';
import { getFocusStyles } from './utils';

export const checkbox = {
  wrapper: {
    default: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
      cursor: 'pointer',
    },
    disabled: {
      cursor: 'default',
      opacity: 0.5,
    },
  },
  input: {
    default: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: '1px',
    },
  },
  indicator: {
    default: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.xs', 'theme.radius.xs'),
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderMedium', 'theme.values.borderMedium'),
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
        }),
      backgroundColor: 'transparent',
      transition: (theme: Record<symbol, unknown>) =>
        get(theme, 'values.transitions.checkbox.indicator', 'theme.values.transitions.checkbox.indicator'),
    },
    checked: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    },
    indeterminate: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
      borderColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
    },
    focus: (theme: Record<symbol, unknown>) =>
      getFocusStyles({
        inset: '-4px',
        borderRadius: '3px',
        border: borders.generic({
          width: '2px',
          color: get(theme, 'colors.border.focus', 'theme.colors.border.focus'),
        }),
      }),
  },
  size: {
    sm: { width: '16px', height: '16px', iconSize: 10 },
    md: { width: '18px', height: '18px', iconSize: 12 },
  },
  label: {
    default: {
      fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    },
  },
};
