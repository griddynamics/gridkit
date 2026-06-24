import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testUtils';

import { Truncate } from '.';
import { COMPONENT_NAME } from './constants';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
} as any;

describe(COMPONENT_NAME, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<Truncate>Hello World</Truncate>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD apply line clamp when lines prop is provided', () => {
    render(
      <Truncate lines={2} styles={{ width: '200px' }}>
        This is a long text that should wrap to multiple lines
      </Truncate>
    );
    const element = screen.getByTestId(COMPONENT_NAME);
    const styles = window.getComputedStyle(element);
    expect(styles.webkitLineClamp).toBe('2');
  });

  it('SHOULD NOT truncate when content fits within lines', async () => {
    const shortText = 'Short text';
    render(
      <Truncate lines={1} styles={{ width: '200px' }}>
        {shortText}
      </Truncate>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    const element = screen.getByTestId(COMPONENT_NAME);

    // Content should not be truncated (scrollHeight <= clientHeight)
    expect(element.scrollHeight).toBeLessThanOrEqual(element.clientHeight);
  });
});
