import type { PropsWithChildren } from 'react';
import { defaultTheme } from '@tokens';

export type DefaultTheme = typeof defaultTheme;
export type Theme<T = typeof defaultTheme> = T & Record<string, unknown>;

export interface ThemeProviderProps extends PropsWithChildren {
  isDefault?: boolean;
  initialTheme?: Theme;
}

export interface ITheme {
  theme: Theme;
  setTheme: (themeName?: string) => void;
  addTheme: (themeName: string, themeConfig: Theme) => void;
}

export type ThemeState = {
  [key: string]: Theme;
};
