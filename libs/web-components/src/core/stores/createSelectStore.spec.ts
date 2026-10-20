import { describe, expect, it } from 'vitest';
import { createSelectStore, filterSelectOptions, type SelectOption } from './createSelectStore';

const apple: SelectOption = { name: 'Apple', value: 'apple' };
const banana: SelectOption = { name: 'Banana', value: 'banana' };
const cherry: SelectOption = { name: 'Cherry', value: 'cherry' };

describe('createSelectStore', () => {
  it('starts closed with no selection by default', () => {
    const store = createSelectStore();
    expect(store.getState().isOpen).toBe(false);
    expect(store.getState().internalValue).toBeNull();
  });

  it('open/close/toggle manage isOpen', () => {
    const store = createSelectStore();
    store.getState().open();
    expect(store.getState().isOpen).toBe(true);
    store.getState().close();
    expect(store.getState().isOpen).toBe(false);
    store.getState().toggle();
    expect(store.getState().isOpen).toBe(true);
  });

  it('disabled blocks open and toggle', () => {
    const store = createSelectStore({ disabled: true });
    store.getState().open();
    store.getState().toggle();
    expect(store.getState().isOpen).toBe(false);
  });

  it('close resets searchText', () => {
    const store = createSelectStore();
    store.getState().setSearchText('app');
    store.getState().close();
    expect(store.getState().searchText).toBe('');
  });

  describe('single-select', () => {
    it('select replaces the value and closes the dropdown', () => {
      const store = createSelectStore();
      store.getState().open();
      store.getState().select(apple);
      expect(store.getState().internalValue).toEqual(apple);
      expect(store.getState().isOpen).toBe(false);
    });

    it('syncExternalValue normalizes a non-array value', () => {
      const store = createSelectStore();
      store.getState().syncExternalValue(banana);
      expect(store.getState().internalValue).toEqual(banana);
    });

    it('syncExternalValue coerces an array value to null in single mode', () => {
      const store = createSelectStore();
      store.getState().syncExternalValue([apple, banana]);
      expect(store.getState().internalValue).toBeNull();
    });
  });

  describe('multi-select', () => {
    it('starts with an empty array by default', () => {
      const store = createSelectStore({ multiple: true });
      expect(store.getState().internalValue).toEqual([]);
    });

    it('normalizes a single initial value into an array', () => {
      const store = createSelectStore({ multiple: true, value: apple });
      expect(store.getState().internalValue).toEqual([apple]);
    });

    it('select adds an unselected option and keeps the dropdown open', () => {
      const store = createSelectStore({ multiple: true });
      store.getState().open();
      store.getState().select(apple);
      store.getState().select(banana);
      expect(store.getState().internalValue).toEqual([apple, banana]);
      expect(store.getState().isOpen).toBe(true);
    });

    it('select removes an already-selected option', () => {
      const store = createSelectStore({ multiple: true, value: [apple, banana] });
      store.getState().select(apple);
      expect(store.getState().internalValue).toEqual([banana]);
    });

    it('respects a custom itemIdentifier', () => {
      const store = createSelectStore({ multiple: true, value: [apple] });
      const byName = (selected: SelectOption | null, current: SelectOption) => selected?.name === current.name;
      store.getState().select({ name: 'Apple', value: 'a-different-ref' }, byName);
      expect(store.getState().internalValue).toEqual([]);
    });

    it('disabled blocks select and returns the unchanged value', () => {
      const store = createSelectStore({ multiple: true, disabled: true, value: [apple] });
      const result = store.getState().select(banana);
      expect(result).toEqual([apple]);
      expect(store.getState().internalValue).toEqual([apple]);
    });
  });
});

describe('filterSelectOptions', () => {
  const items = [apple, banana, cherry];

  it('returns all items when searchText is empty', () => {
    expect(filterSelectOptions(items, '')).toEqual(items);
  });

  it('filters case-insensitively by the stringifier', () => {
    expect(filterSelectOptions(items, 'an')).toEqual([banana]);
  });

  it('returns undefined when items is undefined', () => {
    expect(filterSelectOptions(undefined, 'a')).toBeUndefined();
  });
});
