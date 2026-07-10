import { createStore } from 'zustand/vanilla';

export interface SelectOption<V = unknown> {
  name: string;
  value?: V;
}

export type SelectValue = SelectOption | SelectOption[] | null;

export type SelectItemIdentifier = (selected: SelectOption | null, current: SelectOption) => boolean;

const defaultItemIdentifier: SelectItemIdentifier = (selected, current) => selected?.value === current.value;

export interface SelectStoreState {
  isOpen: boolean;
  internalValue: SelectValue;
  searchText: string;
  multiple: boolean;
  disabled: boolean;
}

export interface SelectStoreActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setSearchText: (text: string) => void;
  setDisabled: (disabled: boolean) => void;
  /** Call when the consumer's external `value` prop changes — mirrors `Select.tsx`'s value-sync effect. */
  syncExternalValue: (value: SelectValue) => void;
  /** Mirrors `Select.tsx`'s `_onSelect`: single-select replaces + closes, multi-select toggles membership. */
  select: (option: SelectOption, itemIdentifier?: SelectItemIdentifier) => SelectValue;
}

export type SelectStore = SelectStoreState & SelectStoreActions;

export interface CreateSelectStoreOptions {
  multiple?: boolean;
  disabled?: boolean;
  value?: SelectValue;
}

function normalizeValue(value: SelectValue | undefined, multiple: boolean): SelectValue {
  if (multiple) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }
  return Array.isArray(value) ? null : (value ?? null);
}

/**
 * Extracted from `libs/ui/src/components/atoms/Select/Select.tsx`'s open/close, single/multi
 * selection, and search-filter state — the highest shared-core-feasibility atom per
 * CTORNDSD-580's comparison table. Deliberately excludes dropdown viewport positioning
 * (`computePlacement`), portal/outside-click DOM listeners, and keyboard-arrow focus
 * traversal (`getClosestFocusable`) — those differ per platform (web overlay positioning
 * vs. RN `Modal` chrome) and stay in each adapter.
 */
export function createSelectStore(options: CreateSelectStoreOptions = {}) {
  const { multiple = false, disabled = false, value } = options;

  return createStore<SelectStore>((set, get) => ({
    isOpen: false,
    internalValue: normalizeValue(value, multiple),
    searchText: '',
    multiple,
    disabled,

    open: () => {
      if (!get().disabled) set({ isOpen: true });
    },
    close: () => set({ isOpen: false, searchText: '' }),
    toggle: () => {
      const state = get();
      if (!state.disabled) set({ isOpen: !state.isOpen });
    },
    setSearchText: (text) => set({ searchText: text }),
    setDisabled: (next) => set({ disabled: next }),

    syncExternalValue: (nextValue) => {
      const state = get();
      set({ internalValue: normalizeValue(nextValue, state.multiple) });
    },

    select: (option, itemIdentifier = defaultItemIdentifier) => {
      const state = get();
      if (state.disabled) return state.internalValue;

      if (state.multiple) {
        const current = Array.isArray(state.internalValue) ? state.internalValue : [];
        const isSelected = current.some((item) => itemIdentifier(item, option));
        const next = isSelected ? current.filter((item) => !itemIdentifier(item, option)) : [...current, option];
        set({ internalValue: next });
        return next;
      }

      set({ internalValue: option, isOpen: false, searchText: '' });
      return option;
    },
  }));
}

/** Mirrors `Select.tsx`'s `filteredItems` derivation for the `searchable` prop. */
export function filterSelectOptions<T extends SelectOption>(
  items: T[] | undefined,
  searchText: string,
  stringifier: (item: T) => string = (item) => item.name
): T[] | undefined {
  if (!searchText) return items;
  const needle = searchText.toLowerCase();
  return items?.filter((item) => stringifier(item).toLowerCase().includes(needle));
}
