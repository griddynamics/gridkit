import React from 'react';
import { vi } from 'vitest';
import { renderHook } from '@testUtils';
import { SelectContext, useSelectContext } from './useSelectContext';
import { SelectContextType } from '../Select.types';

describe('useSelectContext', () => {
  it('SHOULD return context when used inside SelectContext.Provider', () => {
    const mockContext: SelectContextType = {
      onSelect: vi.fn(),
      value: 'test-value',
      itemIdentifier: (selected, current) => selected === current,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectContext.Provider value={mockContext}>{children}</SelectContext.Provider>
    );

    const { result } = renderHook(() => useSelectContext(), { wrapper });

    expect(result.current).toEqual(mockContext);
    expect(result.current.value).toBe('test-value');
    expect(typeof result.current.itemIdentifier).toBe('function');
  });

  it('SHOULD throw an error when used outside SelectContext.Provider', () => {
    const { result } = renderHook(() => {
      let error: Error | null = null;
      try {
        useSelectContext();
      } catch (e) {
        error = e as Error;
      }
      return { error };
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('useSelectContext must be used within a Select component or children');
  });
});
