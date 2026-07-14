'use client';
import React, { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { noOpLogger } from './NoOpLogger';
import type { ILogger, LoggerProviderProps } from './useLogger.types';

const UseLogger = createContext<LoggerProviderProps>({ logger: noOpLogger, isEnabled: false });

export const LoggerProvider = ({ logger, isEnabled, children }: PropsWithChildren<LoggerProviderProps>) => {
  const loggerInstance = useMemo(() => {
    return logger;
  }, [logger]);

  return <UseLogger.Provider value={{ logger: loggerInstance, isEnabled }}>{children}</UseLogger.Provider>;
};

export const useLogger = (): ILogger => {
  const { logger, isEnabled } = useContext(UseLogger);

  if (isEnabled && !logger) {
    console.warn('useLogger: LoggerProvider is enabled but no logger instance was provided');
    return noOpLogger;
  }

  return isEnabled && logger ? logger : noOpLogger;
};
