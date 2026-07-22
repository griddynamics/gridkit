import { createStore } from 'zustand/vanilla';

export interface CheckboxStoreState {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  /** Recomputed on every `syncControlledValue` call, mirroring `Checkbox.tsx`'s `checked !== undefined` check. */
  isControlled: boolean;
}

export interface CheckboxStoreActions {
  /** Call whenever the consumer's `checked` prop changes (including from undefined to defined, or back). */
  syncControlledValue: (checked: boolean | undefined) => void;
  setIndeterminate: (indeterminate: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  /** The adapter's native change event handler funnels into this — see `Checkbox.tsx`'s `onChange`. */
  handleChange: (nextChecked: boolean) => void;
  toggle: () => void;
}

export type CheckboxStore = CheckboxStoreState & CheckboxStoreActions;

export interface CreateCheckboxStoreOptions {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onValueChange?: (checked: boolean) => void;
}

/**
 * Extracted from `libs/ui/src/components/atoms/Checkbox/Checkbox.tsx`'s controlled/uncontrolled
 * resolution — the one piece of Checkbox's behavior calls out as cleanly portable.
 * `inputRef.current.indeterminate = ...` (a direct DOM-API write) stays in each adapter, since it's
 * inherently a rendering concern; this store only tracks the `indeterminate` value itself.
 */
export function createCheckboxStore(options: CreateCheckboxStoreOptions = {}) {
  const { checked, indeterminate = false, disabled = false, onValueChange } = options;

  return createStore<CheckboxStore>((set, get) => ({
    checked: checked ?? false,
    indeterminate,
    disabled,
    isControlled: checked !== undefined,

    syncControlledValue: (nextChecked) => {
      const isControlled = nextChecked !== undefined;
      set(isControlled ? { isControlled, checked: nextChecked } : { isControlled });
    },

    setIndeterminate: (next) => set({ indeterminate: next }),
    setDisabled: (next) => set({ disabled: next }),

    handleChange: (nextChecked) => {
      const state = get();
      if (state.disabled) return;
      if (!state.isControlled) {
        set({ checked: nextChecked });
      }
      onValueChange?.(nextChecked);
    },

    toggle: () => {
      const state = get();
      if (state.disabled) return;
      state.handleChange(!state.checked);
    },
  }));
}
