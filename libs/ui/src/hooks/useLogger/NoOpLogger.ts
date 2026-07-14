import type { ILogger } from './useLogger.types';

export class NoOpLogger implements ILogger {
  debug(): void {
    // No operation
  }

  info(): void {
    // No operation
  }

  warn(): void {
    // No operation
  }

  error(): void {
    // No operation
  }
}

/**
 * Create a no-op logger
 */
export const noOpLogger = new NoOpLogger();
