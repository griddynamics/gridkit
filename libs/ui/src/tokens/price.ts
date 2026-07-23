import { get } from '@utils';

export const price = {
  default: {
    display: 'flex',
    alignItems: 'center',
    gap: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
  },
  currentPrice: {
    default: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h3', 'theme.font.size.h3'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h3', 'theme.font.line.height.h3'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    },
    sm: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h6', 'theme.font.size.h6'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h6', 'theme.font.line.height.h6'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    },
    lg: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h2', 'theme.font.size.h2'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h2', 'theme.font.line.height.h2'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.default', 'theme.colors.text.default'),
    },
  },
  oldPrice: {
    default: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h4', 'theme.font.size.h4'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h4', 'theme.font.line.height.h4'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
    },
    sm: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'theme.font.size.p'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.p', 'theme.font.line.height.p'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
    },
    lg: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h3', 'theme.font.size.h3'),
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h3', 'theme.font.line.height.h3'),
      color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.disabled', 'theme.colors.text.disabled'),
    },
  },
};
