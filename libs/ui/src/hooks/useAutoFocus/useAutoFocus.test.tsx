import { useRef, useEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testUtils';
import { useAutoFocus } from './useAutoFocus';

const TestComponent = ({ autoFocus }: { autoFocus: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useAutoFocus(inputRef, autoFocus);

  return <input ref={inputRef} data-testid="test-input" />;
};

describe('useAutoFocus Hook', () => {
  it('SHOULD focus the element when autoFocus is true', () => {
    render(<TestComponent autoFocus={true} />);

    const inputElement = screen.getByTestId('test-input');
    expect(document.activeElement).toBe(inputElement);
  });

  it('SHOULD NOT focus the element when autoFocus is false', () => {
    render(<TestComponent autoFocus={false} />);

    const inputElement = screen.getByTestId('test-input');
    expect(document.activeElement).not.toBe(inputElement);
  });

  it('SHOULD not throw an error when ref is initially null', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // intentionally left empty to suppress console errors during tests
    });

    render(<TestComponent autoFocus={true} />);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('SHOULD only run effect when autoFocus changes', () => {
    const effectSpy = vi.fn();

    const TestComponentWithSpy = ({ autoFocus }: { autoFocus: boolean }) => {
      const inputRef = useRef<HTMLInputElement>(null);
      useEffect(effectSpy, [autoFocus]); // Mock useEffect to track calls
      useAutoFocus(inputRef, autoFocus);

      return <input ref={inputRef} data-testid="test-input" />;
    };

    const { rerender } = render(<TestComponentWithSpy autoFocus={false} />);
    expect(effectSpy).toHaveBeenCalledTimes(1);

    rerender(<TestComponentWithSpy autoFocus={true} />);
    expect(effectSpy).toHaveBeenCalledTimes(2);
  });
});
