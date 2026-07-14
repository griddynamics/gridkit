import { FlexDirection, SizeVariant, TextAlign, TypographyVariant } from '@types';

import { get } from '@utils';
import { display, flexAlignItems } from './display';

export const image = {
  default: {
    width: '100%',
    height: '100%',
    transition: 'opacity 0.2s ease-in-out',
  },
  wrapper: {
    position: 'relative' as const,
    display: display.flex,
    flexDirection: FlexDirection.Column,
    alignItems: flexAlignItems.center,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: display.flex,
    alignItems: flexAlignItems.center,
    justifyContent: flexAlignItems.center,
    background: (theme: Record<symbol, unknown>) => get(theme, 'colors.bg.default', 'theme.colors.bg.default'),
  },
  caption: {
    marginTop: (theme: Record<symbol, unknown>) =>
      get(theme, `spacing.${SizeVariant.Xs}`, `theme.spacing.${SizeVariant.Xs}`),
    fontSize: (theme: Record<symbol, unknown>) =>
      get(theme, `font.size.${TypographyVariant.Body2}`, `theme.font.size.${TypographyVariant.Body2}`),
    color: (theme: Record<symbol, unknown>) => get(theme, 'colors.text.caption', 'theme.colors.text.caption'),
    textAlign: TextAlign.Center,
  },
};
