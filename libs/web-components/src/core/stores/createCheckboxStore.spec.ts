import { describe, expect, it, vi } from 'vitest';
import { createCheckboxStore } from './createCheckboxStore';

describe('createCheckboxStore', () => {
  it('starts uncontrolled and unchecked by default', () => {
    const store = createCheckboxStore();
    expect(store.getState().checked).toBe(false);
    expect(store.getState().isControlled).toBe(false);
  });

  it('starts controlled when an initial checked value is provided', () => {
    const store = createCheckboxStore({ checked: true });
    expect(store.getState().isControlled).toBe(true);
    expect(store.getState().checked).toBe(true);
  });

  it('uncontrolled: handleChange updates internal checked state', () => {
    const onValueChange = vi.fn();
    const store = createCheckboxStore({ onValueChange });
    store.getState().handleChange(true);
    expect(store.getState().checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('controlled: handleChange calls back but does not mutate internal checked state', () => {
    const onValueChange = vi.fn();
    const store = createCheckboxStore({ checked: false, onValueChange });
    store.getState().handleChange(true);
    expect(store.getState().checked).toBe(false);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('syncControlledValue transitions uncontrolled -> controlled and applies the new value', () => {
    const store = createCheckboxStore();
    store.getState().syncControlledValue(true);
    expect(store.getState().isControlled).toBe(true);
    expect(store.getState().checked).toBe(true);
  });

  it('syncControlledValue transitions controlled -> uncontrolled without forcing a value', () => {
    const store = createCheckboxStore({ checked: true });
    store.getState().syncControlledValue(undefined);
    expect(store.getState().isControlled).toBe(false);
    expect(store.getState().checked).toBe(true); // last known value persists
  });

  it('disabled blocks handleChange and toggle', () => {
    const onValueChange = vi.fn();
    const store = createCheckboxStore({ disabled: true, onValueChange });
    store.getState().handleChange(true);
    store.getState().toggle();
    expect(store.getState().checked).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('toggle flips the current checked value', () => {
    const store = createCheckboxStore();
    store.getState().toggle();
    expect(store.getState().checked).toBe(true);
    store.getState().toggle();
    expect(store.getState().checked).toBe(false);
  });

  it('setIndeterminate and setDisabled update their respective fields', () => {
    const store = createCheckboxStore();
    store.getState().setIndeterminate(true);
    expect(store.getState().indeterminate).toBe(true);
    store.getState().setDisabled(true);
    expect(store.getState().disabled).toBe(true);
  });

  describe('resetTo (form-reset semantics, CTORNDSD-646b)', () => {
    it('resets checked to false for an undefined default, where syncControlledValue(undefined) preserves it', () => {
      const store = createCheckboxStore();
      store.getState().handleChange(true);
      expect(store.getState().checked).toBe(true);

      // The documented contrast: syncControlledValue deliberately keeps the current value.
      store.getState().syncControlledValue(undefined);
      expect(store.getState().checked).toBe(true);

      // resetTo is the action form reset needs.
      store.getState().resetTo(undefined);
      expect(store.getState().checked).toBe(false);
      expect(store.getState().isControlled).toBe(false);
    });

    it('restores an explicit boolean default and marks the store controlled', () => {
      const store = createCheckboxStore({ checked: true });
      store.getState().syncControlledValue(false);
      expect(store.getState().checked).toBe(false);

      store.getState().resetTo(true);
      expect(store.getState().checked).toBe(true);
      expect(store.getState().isControlled).toBe(true);
    });

    it('does not invoke onValueChange — native checkboxes fire no change event on form reset', () => {
      const onValueChange = vi.fn();
      const store = createCheckboxStore({ onValueChange });
      store.getState().handleChange(true);
      onValueChange.mockClear();

      store.getState().resetTo(undefined);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
