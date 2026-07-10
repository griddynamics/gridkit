import { createStore } from 'zustand/vanilla';

export interface InputStoreState {
  /** Tracks whether the last interaction was a mouse click vs. keyboard TAB, for focus-outline styling. */
  isMouseInteraction: boolean;
  debounceCallbackTime?: number;
}

export interface InputStoreActions {
  registerMouseDown: () => void;
  /** Pass whether the key pressed was TAB — mirrors `useInputHandlers.tsx`'s `KEYBOARD_KEYS.TAB` check. */
  registerKeyDown: (isTabKey: boolean) => void;
  registerBlur: () => void;
  setDebounceCallbackTime: (ms: number | undefined) => void;
}

export type InputStore = InputStoreState & InputStoreActions;

export interface CreateInputStoreOptions {
  debounceCallbackTime?: number;
}

/**
 * Extracted from `libs/ui/src/components/atoms/Input/useInputHandlers.tsx`'s
 * `isMouseInteraction` tracking. Deliberately does not wrap `onChange`/`onKeyDown`
 * callbacks itself (the real hook's `debounce(handleKeyDown, ...)` / `debounce(onChange, ...)`
 * calls) since those callback *shapes* are the one confirmed permanent per-platform fork
 * (web's `onChange(event)` vs. RN's `onChangeText(text: string)`, per CTORNDSD-590) —
 * each adapter wraps its own callback with the `debounce` utility below.
 */
export function createInputStore(options: CreateInputStoreOptions = {}) {
  return createStore<InputStore>((set) => ({
    isMouseInteraction: false,
    debounceCallbackTime: options.debounceCallbackTime,

    registerMouseDown: () => set({ isMouseInteraction: true }),
    registerKeyDown: (isTabKey) => {
      if (isTabKey) set({ isMouseInteraction: false });
    },
    registerBlur: () => set({ isMouseInteraction: false }),
    setDebounceCallbackTime: (ms) => set({ debounceCallbackTime: ms }),
  }));
}

/** Generic debounce, platform/event-shape agnostic — wraps whatever callback the adapter owns. */
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, waitMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };
}
