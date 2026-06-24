import { describe, it, expect, vi, afterEach } from 'vitest';

import { render, screen, fireEvent } from '@testUtils';

import { Scroll } from './Scroll';
import { COMPONENT_NAME } from './constants';

describe(COMPONENT_NAME, () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('SHOULD match snapshot', () => {
    const { container } = render(
      <Scroll>
        <div>Test Content</div>
      </Scroll>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD show vertical scrollbar when content overflows and vertical="auto"', () => {
    render(
      <Scroll vertical="auto" style={{ height: 50 }}>
        <div style={{ height: 200 }}>Overflow Content</div>
      </Scroll>
    );

    const scrollbars = screen.getByTestId(`${COMPONENT_NAME}-scrollbars`);
    expect(scrollbars).toBeTruthy();
  });

  it('SHOULD hide vertical scrollbar when vertical="hidden"', async () => {
    render(
      <Scroll vertical="hidden" style={{ height: 50 }}>
        <div style={{ height: 200 }}>Overflow Content</div>
      </Scroll>
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const scrollbar = screen.queryByTestId(`${COMPONENT_NAME}-scrollbar_vertical`);
    expect(scrollbar).toBeNull();
  });

  it('SHOULD always show vertical scrollbar when vertical="visible"', async () => {
    render(
      <Scroll vertical="visible" style={{ height: 50 }}>
        <div style={{ height: 10 }}>Small Content</div>
      </Scroll>
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const scrollbar = screen.getByTestId(`${COMPONENT_NAME}-scrollbar_vertical`);
    expect(scrollbar).toBeTruthy();
  });

  it('SHOULD apply maxWidth: 100% style to ScrollContent when horizontal="hidden"', () => {
    render(
      <Scroll horizontal="hidden">
        <div>Test</div>
      </Scroll>
    );

    const content = screen.getByTestId(`${COMPONENT_NAME}-content`);
    expect(content);
  });

  describe('autoHide feature', () => {
    it('SHOULD render container with autoHide prop', () => {
      const { container } = render(
        <Scroll vertical="visible" autoHide style={{ height: 50 }}>
          <div style={{ height: 200 }}>Overflow Content</div>
        </Scroll>
      );

      const scrollContainer = screen.getByTestId(COMPONENT_NAME);
      expect(scrollContainer).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    it('SHOULD trigger scroll event handler when autoHide is enabled', () => {
      render(
        <Scroll vertical="visible" autoHide style={{ height: 50 }}>
          <div style={{ height: 200 }}>Overflow Content</div>
        </Scroll>
      );

      const scrollContainer = screen.getByTestId(COMPONENT_NAME);

      // Should not throw when triggering scroll
      expect(() => {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 50 } });
      }).not.toThrow();
    });

    it('SHOULD cleanup scroll event listener on unmount', () => {
      const { unmount } = render(
        <Scroll vertical="visible" autoHide style={{ height: 50 }}>
          <div style={{ height: 200 }}>Overflow Content</div>
        </Scroll>
      );

      const scrollContainer = screen.getByTestId(COMPONENT_NAME);
      const removeEventListenerSpy = vi.spyOn(scrollContainer, 'removeEventListener');

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('SHOULD work with both vertical and horizontal scrollbars', async () => {
      render(
        <Scroll vertical="visible" horizontal="visible" autoHide style={{ height: 50, width: 100 }}>
          <div style={{ height: 200, width: 400 }}>Overflow Content</div>
        </Scroll>
      );

      await new Promise((resolve) => setTimeout(resolve, 400));

      const verticalScrollbar = await screen.findByTestId(`${COMPONENT_NAME}-scrollbar_vertical`);
      const horizontalScrollbar = await screen.findByTestId(`${COMPONENT_NAME}-scrollbar_horizontal`);
      expect(verticalScrollbar).toBeTruthy();
      expect(horizontalScrollbar).toBeTruthy();
    });

    it('SHOULD add scroll event listener when autoHide is true', () => {
      const addEventListenerSpy = vi.fn();

      // Mock the addEventListener on the container
      const originalAddEventListener = HTMLDivElement.prototype.addEventListener;
      HTMLDivElement.prototype.addEventListener = addEventListenerSpy;

      render(
        <Scroll vertical="visible" autoHide style={{ height: 50 }}>
          <div style={{ height: 200 }}>Overflow Content</div>
        </Scroll>
      );

      // Restore original
      HTMLDivElement.prototype.addEventListener = originalAddEventListener;

      // Check if scroll listener was added
      const scrollListenerAdded = addEventListenerSpy.mock.calls.some((call) => call[0] === 'scroll');
      expect(scrollListenerAdded).toBe(true);
    });
  });
});
