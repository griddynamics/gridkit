import { get } from '@utils';

const POINTER_SIZE = 6;

export const tooltip = {
  default: {
    position: 'absolute',
    display: 'block',
    maxWidth: '50%',
    maxHeight: '50%',
    wordBreak: 'break-word',
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.black', 'theme.colors.text.black'),
    backgroundColor: (theme: Record<symbol, unknown>) =>
      get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
    padding: (theme: Record<symbol, unknown>) =>
      `${get(theme, 'spacing.xs', 'theme.spacing.xs')} ${get(theme, 'spacing.sm', 'theme.spacing.sm')}`,
    zIndex: (theme: Record<symbol, unknown>) => get(theme, 'zIndex.top', 'theme.zIndex.top'),
    borderRadius: (theme: Record<symbol, unknown>) => get(theme, 'radius.sm', 'theme.radius.sm'),
    fontSize: (theme: Record<symbol, unknown>) => get(theme, `font.size.caption`, `font.size.caption`),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) =>
      get(theme, `font.line.height.caption`, `theme.font.line.height.caption`),

    '&::after': {
      position: 'absolute',
      content: `""`,
      border: `${POINTER_SIZE}px solid transparent`,
    },
    '&.tooltip-bottom': {
      transform: 'translateX(-50%)',
      '&::after': {
        top: -POINTER_SIZE,
        left: '50%',
        borderLeftColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        borderTopColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        transform: 'translateX(-50%) rotate(45deg)',
      },
    },
    '&.tooltip-top': {
      transform: 'translateX(-50%)',
      '&::after': {
        bottom: -POINTER_SIZE,
        left: '50%',
        borderRightColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        borderBottomColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        transform: 'translateX(-50%) rotate(45deg)',
      },
    },
    '&.tooltip-left': {
      transform: 'translateY(-50%)',
      '&::after': {
        right: -POINTER_SIZE,
        top: '50%',
        borderRightColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        borderTopColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        transform: 'translateY(-50%) rotate(45deg)',
      },
    },
    '&.tooltip-right': {
      transform: 'translateY(-50%)',
      '&::after': {
        left: -POINTER_SIZE,
        top: '50%',
        borderLeftColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        borderBottomColor: (theme: Record<symbol, unknown>) =>
          get(theme, 'colors.bg.fill.tooltip.default', 'theme.colors.bg.fill.tooltip.default'),
        transform: 'translateY(-50%) rotate(45deg) ',
      },
    },
  },
  wrapper: {
    default: {
      display: 'inline-block',
      position: 'relative',
    },
  },
};
