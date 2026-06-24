import { get } from '@utils';

import { Cursors, LinkVariant } from '@types';
import { borders } from '@tokens/borders';

/**
 * @TODO: Cerebra
 * - Align with design
 * - Add support for hover and active states
 */
export const link = {
  default: {
    fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    display: 'inline-flex',
    maxWidth: '100%',
    width: 'fit-content',
    alignSelf: 'flex-start',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    position: 'relative',
    '&:visited': {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
      '&::after': {
        borderBottom: (theme: Record<symbol, unknown>) =>
          borders.generic({
            width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
            color: get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
          }),
      },
    },
    '&:focus, &:active, &:focus-visible': {
      outline: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: get(theme, 'values.borderThin', 'theme.values.borderThin'),
          color: get(theme, 'colors.border.info', 'theme.colors.border.info'),
        }),
    },
    [`&.Link--disabled`]: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
      cursor: Cursors.Default,
      textDecoration: 'none',
      backgroundColor: 'transparent',
      '&::after': {
        borderBottomColor: 'transparent',
      },
    },
  },
  [LinkVariant.Primary]: {
    '&::after': {
      content: '""',
      position: 'absolute',
      right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      borderBottom: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.text.default', `theme.colors.text.default`)}`,
    },
    '&:hover': {
      backgroundColor: 'transparent',
      '&::after': {
        borderBottomColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.text.default', `theme.colors.text.default`),
      },
    },
  },

  [LinkVariant.Secondary]: {
    '&::after': {
      content: '""',
      position: 'absolute',
      right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      borderBottom: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.text.default', `theme.colors.text.default`)}`,
    },
    '&:hover': {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.primary', `theme.colors.bg.fill.primary`),
      '&::after': {
        borderBottomColor: 'transparent',
      },
    },
  },
  [LinkVariant.Inverted]: {
    '&::after': {
      content: '""',
      position: 'absolute',
      right: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      bottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      left: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
      borderBottom: (theme: Record<symbol, unknown>) =>
        `1px solid ${get(theme, 'colors.text.default', `theme.colors.text.default`)}`,
    },
    '&:hover': {
      backgroundColor: 'transparent',
      '&::after': {
        borderBottomColor: 'transparent',
      },
    },
  },
  [LinkVariant.Inherit]: {
    color: 'inherit',
  },
  sizeMap: {
    sm: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'theme.font.size.caption'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
    },
    md: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
      lineHeight: (theme: Record<symbol, unknown>) =>
        get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
    },
    lg: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.p', 'theme.font.line.height.p'),
    },
  },
  underline: {
    highlight: {
      '&::after': {
        borderBottomColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary'),
        borderBottomWidth: '2px',
      },
    },
    none: {
      '&::after': {
        borderBottom: 'none',
      },
    },
  },
};
