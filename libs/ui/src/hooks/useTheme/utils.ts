'use client';
import { set } from '@utils';

import type { Theme as GDTheme } from './useTheme.types';

export const updateThemeTokens = (theme: GDTheme, tokens: Record<string, unknown>) => {
  Object.entries(tokens).forEach(([token, value]) => {
    set(theme, token, value, true);
  });
};

// Extend Emotion's theme type to include GDTheme properties
declare module '@emotion/react' {
  export interface Theme extends GDTheme {
    __emotionTheme?: true;
  }
}
