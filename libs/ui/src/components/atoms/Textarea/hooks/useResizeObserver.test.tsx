import React, { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testUtils';
import { useResizeObserver } from './useResizeObserver';
import { TextareaUpdatedSize } from '../Textarea.types';

// Mock ResizeObserver since JSDOM does not support it
class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const TestComponent = ({ onCustomResize }: { onCustomResize?: (size: TextareaUpdatedSize) => void }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useResizeObserver(textareaRef, onCustomResize);

  return <textarea ref={textareaRef} data-testid="test-textarea" />;
};

describe('useResizeObserver Hook', () => {
  it('SHOULD not trigger on first render', () => {
    const mockResizeCallback = vi.fn();
    render(<TestComponent onCustomResize={mockResizeCallback} />);

    expect(mockResizeCallback).not.toHaveBeenCalled();
  });
});
