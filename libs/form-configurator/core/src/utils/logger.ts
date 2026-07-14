/**
 * Logger interface compatible with Grid Dynamics UI library logger
 * Follows the same pattern as @griddynamics/ui ILogger
 */
export interface ILogger {
  /**
   * Log a debug message
   * @param message - The debug message
   * @param meta - Optional metadata
   */
  debug(message: string, ...meta: unknown[]): void;

  /**
   * Log an info message
   * @param message - The info message
   * @param meta - Optional metadata
   */
  info(message: string, ...meta: unknown[]): void;

  /**
   * Log a warning message
   * @param message - The warning message
   * @param meta - Optional metadata
   */
  warn(message: string, ...meta: unknown[]): void;

  /**
   * Log an error message
   * @param message - The error message
   * @param meta - Optional metadata
   */
  error(message: string, ...meta: unknown[]): void;
}

export class NoOpLogger implements ILogger {
  debug(_message: string, ..._meta: unknown[]): void {
    // No operation
  }

  info(_message: string, ..._meta: unknown[]): void {
    // No operation
  }

  warn(_message: string, ..._meta: unknown[]): void {
    // No operation
  }

  error(_message: string, ..._meta: unknown[]): void {
    // No operation
  }
}

export const noOpLogger = new NoOpLogger();

export class ConsoleLogger implements ILogger {
  constructor(private prefix = '[FormConfigurator]') {}

  debug(message: string, ...meta: unknown[]): void {
    console.debug(this.prefix, message, ...meta);
  }

  info(message: string, ...meta: unknown[]): void {
    console.info(this.prefix, message, ...meta);
  }

  warn(message: string, ...meta: unknown[]): void {
    console.warn(this.prefix, message, ...meta);
  }

  error(message: string, ...meta: unknown[]): void {
    console.error(this.prefix, message, ...meta);
  }
}
