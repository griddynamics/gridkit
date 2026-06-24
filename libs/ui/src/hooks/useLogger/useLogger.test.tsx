import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';

import { renderHook } from '@testUtils';

import { LoggerProvider, useLogger } from './useLogger';

describe('LoggerContext', () => {
  it('SHOULD provide logger to child components', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <LoggerProvider>{children}</LoggerProvider>;

    const { result } = renderHook(() => useLogger(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.info).toBeDefined();
  });

  it('SHOULD use custom logger WHEN provided', () => {
    const customLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LoggerProvider logger={customLogger} isEnabled>
        {children}
      </LoggerProvider>
    );

    const { result } = renderHook(() => useLogger(), { wrapper });
    result.current.info('test');
    expect(customLogger.info).toHaveBeenCalledWith('test');
  });

  it('SHOULD NOT use custom logger WHEN provided BUT disabled', () => {
    const customLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LoggerProvider logger={customLogger}>{children}</LoggerProvider>
    );

    const { result } = renderHook(() => useLogger(), { wrapper });
    result.current.info('test');
    expect(customLogger.info).not.toHaveBeenCalled();
  });
});
