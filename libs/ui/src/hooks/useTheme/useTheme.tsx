'use client';
import { useCallback, createContext, useContext, useState } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import { size, get } from '@utils';
import { defaultTheme } from '@tokens';
import { useLogger } from '@hooks/useLogger';

import { noOpTheme } from './NoOpTheme';
import type { Theme, ThemeProviderProps, ITheme, ThemeState } from './useTheme.types';

const ThemeContext = createContext<ITheme>(noOpTheme);

export const ThemeProvider = (props: ThemeProviderProps) => {
  const { children, initialTheme, isDefault = false } = props;
  const logger = useLogger();

  let initialThemeName: string;
  let initialThemeValue: ThemeState;

  if (isDefault) {
    initialThemeName = get(defaultTheme, 'name');
    initialThemeValue = { [initialThemeName]: defaultTheme };
    logger.debug('ThemeProvider: Using default theme', {
      themeName: initialThemeName,
      theme: defaultTheme,
    });
  } else {
    initialThemeName = get(initialTheme, 'name', '');
    initialThemeValue = (initialThemeName ? { [initialThemeName]: initialTheme } : {}) as ThemeState;

    if (initialThemeName) {
      logger.debug('ThemeProvider: Using custom initial theme', {
        themeName: initialThemeName,
        theme: initialTheme,
      });
    }
  }

  const [themes, setThemes] = useState<ThemeState>(initialThemeValue);
  const [themeName, setThemeName] = useState(initialThemeName);
  const theme = themes[themeName];
  const themesTotalSize = size(themes);

  // Switch to an existing theme by its name
  const setTheme = useCallback(
    (name = '') => {
      logger.debug('setTheme: Attempting to switch theme', {
        requestedTheme: name,
        currentTheme: themeName,
        availableThemes: themes,
      });

      if (themes[name]) {
        setThemeName(name);
        logger.info('setTheme: Theme switched successfully', {
          previousTheme: themeName,
          newTheme: name,
        });
      } else {
        setThemeName(initialThemeName);
        logger.warn('setTheme: Theme does not exist, reverting to initial theme', {
          requestedTheme: name,
          revertedTo: initialThemeName,
          availableThemes: themes,
        });
      }
    },
    [themesTotalSize, initialThemeName]
  );

  // Add a new theme dynamically
  const addTheme = useCallback(
    (name: string, config: Theme) => {
      logger.debug('addTheme: Attempting to add new theme', {
        themeName: name,
        availableThemes: themes,
        theme: config,
      });

      if (!themes[name]) {
        setThemes((prevThemes: Record<string, Theme>) => Object.assign(prevThemes, { [name]: config }));
        logger.info('addTheme: Theme added successfully', {
          themeName: name,
          availableThemes: themes,
        });
      } else {
        logger.warn('addTheme: Theme already exists, skipping', {
          themeName: name,
          availableThemes: themes,
        });
      }
    },
    [themesTotalSize]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, addTheme }}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use the theme and add or switch themes dynamically
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme: Hook used outside ThemeProvider');
  }

  return context;
};
