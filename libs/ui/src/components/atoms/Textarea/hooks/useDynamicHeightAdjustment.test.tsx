import { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';
import { useDynamicHeightAdjustment } from './useDynamicHeightAdjustment';

const TestComponent = ({ dynamicHeightAdjustment }: { dynamicHeightAdjustment: boolean }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleResize = useDynamicHeightAdjustment(textareaRef, dynamicHeightAdjustment);

  return <textarea ref={textareaRef} data-testid="test-textarea" onChange={handleResize} style={{ height: '10px' }} />;
};

describe('useDynamicHeightAdjustment Hook', () => {
  it('SHOULD NOT adjust height when dynamicHeightAdjustment is disabled', () => {
    render(<TestComponent dynamicHeightAdjustment={false} />);

    const textarea = screen.getByTestId('test-textarea');
    textarea.value = 'New content\nNew line';
    fireEvent.change(textarea);

    expect(textarea.style.height).toBe('10px');
  });

  it('SHOULD not throw an error when ref is initially null', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // intentionally left empty to suppress console errors during tests
    });

    render(<TestComponent dynamicHeightAdjustment={true} />);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
