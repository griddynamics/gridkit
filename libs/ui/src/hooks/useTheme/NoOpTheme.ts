import { defaultTheme } from '@tokens';
import type { ITheme } from './useTheme.types';

export class NoOpTheme implements ITheme {
  theme = defaultTheme;
  setTheme(): void {
    // No operation
  }
  addTheme(): void {
    // No operation
  }
}

/**
 * Create a no-op theme instance
 */
export const noOpTheme = new NoOpTheme();
