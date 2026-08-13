import { get } from '@utils';
import { borders } from './borders';
import { icon } from './icon';

export const draganddrop = {
  default: {
    position: 'relative',
  },
  dragAndDropArea: {
    default: {
      backgroundColor: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.surface', 'theme.colors.bg.surface'),
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: '1px',
          color: get(theme, 'colors.border.default', 'theme.colors.border.default'),
          type: 'dashed',
        }),
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
      padding: (theme: Record<symbol, unknown>) =>
        `${get(theme, 'spacing.xxl', 'theme.spacing.xxl')} ${get(theme, 'spacing.md', 'theme.spacing.md')} ${get(
          theme,
          'spacing.xxl',
          'theme.spacing.xxl'
        )} ${get(theme, 'spacing.md', 'theme.spacing.md')}`,
      '&:hover': {
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
        border: (theme: Record<symbol, unknown>) =>
          borders.generic({
            width: '1px',
            color: get(theme, 'colors.border.secondary', 'theme.colors.border.secondary'),
            type: 'dashed',
          }),
      },
    },
    disabled: {
      '&, &:hover': {
        cursor: 'not-allowed',
        backgroundColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.input.disabled', 'theme.colors.bg.fill.input.disabled'),
      },
    },
    error: {
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: '2px',
          color: get(theme, 'colors.border.error', 'theme.colors.border.error'),
          type: 'dashed',
        }),
    },
    loading: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
      cursor: 'not-allowed',
    },
  },
  dragOverContent: {
    default: {
      backgroundColor: (theme: Record<symbol, unknown>) =>
        get(theme, 'colors.bg.fill.hover', 'theme.colors.bg.fill.hover'),
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: (theme: Record<symbol, unknown>) =>
        borders.generic({
          width: '1px',
          color: get(theme, 'colors.border.secondary', 'theme.colors.border.secondary'),
          type: 'dashed',
        }),
      borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.default', 'theme.radius.default'),
    },
  },
  uploadIcon: {
    default: {
      name: 'upload',
      width: icon.size.lg.width,
      height: icon.size.lg.height,
    },
    disabled: {
      fill: (theme: Record<symbol, unknown>) => get(theme, 'colors.icon.disabled', 'theme.colors.icon.disabled'),
    },
  },
  contentTypography: {
    default: {
      margin: (theme: Record<symbol, unknown>) => get(theme, 'spacing.none', 'theme.spacing.none'),
    },
    disabled: {
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
    },
  },
};
