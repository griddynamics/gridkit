// Harness consumes the BUILT package (`nx build web-components`), exactly like an app would.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { defaultTheme } from '../../../dist/libs/web-components/index.js';

// Dark palette layered on the shared default theme, the same way an app would pass a second theme
// to `ThemeProvider` in React. Text on the primary (yellow) fill stays dark via `text.black`.
export const darkTheme = {
  ...defaultTheme,
  name: 'dark',
  colors: {
    ...defaultTheme.colors,
    bg: {
      ...defaultTheme.colors.bg,
      default: '#121212',
      surface: '#1E1E1E',
      input: { default: '#262626', disabled: '#1A1A1A' },
      fill: { ...defaultTheme.colors.bg.fill, disabled: '#333333', hover: '#3D2B00' },
    },
    text: {
      ...defaultTheme.colors.text,
      default: '#F5F5F5',
      active: '#FFFFFF',
      title: '#E0E0E0',
      caption: '#A5A5A5',
      disabled: '#6D6D6D',
    },
    border: { ...defaultTheme.colors.border, default: '#3A3A3A', disabled: '#333333', black: '#F5F5F5' },
    icon: { ...defaultTheme.colors.icon, default: '#E0E0E0', disabled: '#6D6D6D' },
    neutral: { ...defaultTheme.colors.neutral, 'grey.30': '#333333' },
  },
};
