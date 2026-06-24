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

export interface LoggerProviderProps {
  logger?: ILogger;
  isEnabled?: boolean;
}
