import { describe, expect, it, vi } from 'vitest';
import { createInputStore, debounce } from './createInputStore';

describe('createInputStore', () => {
  it('starts with isMouseInteraction false', () => {
    const store = createInputStore();
    expect(store.getState().isMouseInteraction).toBe(false);
  });

  it('registerMouseDown sets isMouseInteraction true', () => {
    const store = createInputStore();
    store.getState().registerMouseDown();
    expect(store.getState().isMouseInteraction).toBe(true);
  });

  it('registerKeyDown with TAB resets isMouseInteraction to false', () => {
    const store = createInputStore();
    store.getState().registerMouseDown();
    store.getState().registerKeyDown(true);
    expect(store.getState().isMouseInteraction).toBe(false);
  });

  it('registerKeyDown with a non-TAB key leaves isMouseInteraction unchanged', () => {
    const store = createInputStore();
    store.getState().registerMouseDown();
    store.getState().registerKeyDown(false);
    expect(store.getState().isMouseInteraction).toBe(true);
  });

  it('registerBlur resets isMouseInteraction to false', () => {
    const store = createInputStore();
    store.getState().registerMouseDown();
    store.getState().registerBlur();
    expect(store.getState().isMouseInteraction).toBe(false);
  });

  it('setDebounceCallbackTime updates the stored value', () => {
    const store = createInputStore({ debounceCallbackTime: 100 });
    expect(store.getState().debounceCallbackTime).toBe(100);
    store.getState().setDebounceCallbackTime(300);
    expect(store.getState().debounceCallbackTime).toBe(300);
  });
});

describe('debounce', () => {
  it('delays invocation and coalesces rapid calls into one', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    debounced('b');
    debounced('c');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');

    vi.useRealTimers();
  });
});
