import { TextAlign } from '@types';

import { get } from '@utils';
import { borders } from './borders';

export const radiogroup = {
  input: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
  default: {
    margin: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    padding: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    border: borders.none,
  },
  label: {
    default: {
      display: 'block',
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.sm', 'theme.spacing.sm')} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      cursor: 'inherit',
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      width: '100%',
      height: '100%',
      alignContent: TextAlign.Center,
      textAlign: TextAlign.Center,
    },
    disabled: {},
    selected: {},
    hover: {
      '&:hover': {
        color: (theme: Record<symbol, unknown>) => get(theme, 'colors.neutral.grey.90', 'theme.colors.neutral.grey.90'),
      },
    },
  },
  item: {
    default: {
      position: 'relative',
      cursor: 'pointer',
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: '1px',
          type: 'solid',
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
        }),
      '&:focus-within': {
        outline: (theme: Record<symbol, unknown>) =>
          `2px solid ${get(theme, 'colors.border.focus', 'theme.colors.border.focus')}`,
        outlineOffset: '-1px',
      },
    },
    disabled: {
      cursor: 'not-allowed',
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
      '&::after': {
        content: '""',
        position: 'absolute',
        top: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
        left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
        width: '100%',
        height: '100%',
        background: `
          linear-gradient(
              to top right,
              transparent 49%,
            #E5E5E5 49%,
            #E5E5E5 51%,
              transparent 51%
          )
      `,
      },
    },
    selected: {
      boxShadow: (theme: Record<symbol, unknown>) =>
        `0 0 0 1px ${get(theme, 'colors.neutral.black', 'theme.colors.neutral.black')}`,
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: '1px',
          type: 'solid',
          color: get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'),
        }),
    },
    hover: {
      '&:hover': {
        border: (theme: Record<symbol, unknown>) =>
          borders.generic({
            width: '1px',
            type: 'solid',
            color: get(theme, 'colors.neutral.black', 'theme.colors.neutral.black'),
          }),
      },
    },
  },

  size: {
    sm: {
      label: {
        padding: (theme: Record<symbol, unknown>) =>
          `${get(theme, 'spacing.xs', 'theme.spacing.xs')} ${get(theme, 'spacing.sm', 'theme.spacing.sm')}`,
        fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
        lineHeight: (theme: Record<symbol, unknown>) =>
          get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
      },
    },
    md: {
      label: {},
    },
  },

  layouts: {
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    row: { display: 'flex', flexDirection: 'row' },
    grid: {
      display: 'grid',
    },
  },
};
