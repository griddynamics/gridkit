import { render as rtlRender, RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

import { ThemeProvider } from '@hooks/useTheme/useTheme';
import type { Theme } from '@hooks/useTheme';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: Theme;
}

function customRender(ui: ReactElement, { theme, ...renderOptions }: CustomRenderOptions = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <ThemeProvider isDefault>{children}</ThemeProvider>,
    ...renderOptions,
  });
}

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
