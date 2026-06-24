import { get } from '@utils';

export const typography = {
  base: {
    fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font.family', 'theme.font.family'),
  },
  span: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
  },
  h1: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h1', 'font.size.h1'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h1', 'font.line.height.h1'),
    marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xl', 'theme.spacing.xl'),
    marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.xl', 'theme.spacing.xl'),
  },
  h2: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h2', 'font.size.h2'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h2', 'font.line.height.h2'),
    marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.lg', 'theme.spacing.lg'),
    marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.lg', 'theme.spacing.lg'),
  },
  h3: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h3', 'font.size.h3'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h3', 'font.line.height.h3'),
    marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
    marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
  },
  h4: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h4', 'font.size.h4'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h4', 'font.line.height.h4'),
    marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
    marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.md', 'theme.spacing.md'),
  },
  h5: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h5', 'font.size.h5'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h5', 'font.line.height.h5'),
    marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
  },
  h6: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.h6', 'font.size.h6'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.h6', 'font.line.height.h6'),
    marginTop: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
    marginBottom: (theme: Record<symbol, unknown>) => get(theme, 'spacing.sm', 'theme.spacing.sm'),
  },
  strong: {
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.bold', 'theme.font.weight.bold'),
  },
  i: {
    fontStyle: 'italic',
  },
  p: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.p', 'font.size.p'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.p', 'font.line.height.p'),
  },
  small: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'font.size.small'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) =>
      get(theme, 'font.line.height.small', 'theme.font.line.height.small'),
  },
  caption: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.caption', 'font.size.caption'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) =>
      get(theme, 'font.line.height.caption', 'theme.font.line.height.caption'),
  },
  header: {
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.header', 'font.size.header'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) =>
      get(theme, 'font.line.height.header', 'theme.font.line.height.header'),
  },
  code: {
    fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font["family.code"]', 'theme.font["family.code"]'),
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.code', 'font.size.code'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.code', 'theme.font.line.height.code'),
  },
  kbd: {
    fontFamily: (theme: Record<symbol, unknown>) => get(theme, 'font["family.code"]', 'theme.font["family.code"]'),
    fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.kbd', 'font.size.kbd'),
    fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.kbd', 'theme.font.line.height.kbd'),
  },
  div: {
    xs: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.xs', 'theme.font.size.xs'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.xs', 'font.line.height.xs'),
    },
    sm: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.sm', 'theme.font.size.sm'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.sm', 'font.line.height.sm'),
    },
    md: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.md', 'font.size.md'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.md', 'font.line.height.md'),
    },
    lg: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.lg', 'theme.font.size.lg'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.lg', 'font.line.height.lg'),
    },
    xl: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.xl', 'theme.font.size.xl'),
      lineHeight: (theme: Record<symbol, unknown>) => get(theme, 'font.line.height.xl', 'font.line.height.xl'),
    },
  },
  styleVariant: {
    light: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.light', 'theme.font.weight.light'),
    },
    normal: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.normal', 'theme.font.weight.normal'),
    },
    semibold: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.medium', 'theme.font.weight.medium'),
    },
    bold: {
      fontWeight: (theme: Record<symbol, unknown>) => get(theme, 'font.weight.bold', 'theme.font.weight.bold'),
    },
    italic: {
      fontStyle: 'italic',
    },
    small: {
      fontSize: (theme: Record<symbol, unknown>) => get(theme, 'font.size.small', 'theme.font.size.small'),
    },
    uppercase: {
      textTransform: 'uppercase',
    },
    lowercase: {
      textTransform: 'lowercase',
    },
    underline: {
      textDecoration: 'underline',
    },
    strike: {
      textDecoration: 'line-through',
    },
  },
};
