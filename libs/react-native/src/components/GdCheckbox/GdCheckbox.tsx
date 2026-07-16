import { useEffect, useRef } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useStore } from 'zustand';
import { createCheckboxStore, resolveCheckboxStyle, type CheckboxSizeName, type DesignCoreTheme } from 'gd-design-core';
import { pxToNumber } from '../../utils/pxToNumber';

export interface GdCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: CheckboxSizeName;
  onValueChange?: (checked: boolean) => void;
  theme?: DesignCoreTheme;
  children?: string;
}

/**
 * CTORNDSD-590 Checkbox port (mirrors `libs/web-components/src/components/gd-checkbox/gd-checkbox.ts`'s
 * store-wiring pattern, adapted to RN). Delegates all controlled/uncontrolled + indeterminate
 * state to `gd-design-core`'s `createCheckboxStore` via `useStore`, the same store both the Lit
 * and RN adapters share — `handleChange`/`toggle` fire from `Pressable`'s `onPress` instead of a
 * native `<input>` `change` event.
 *
 * RN has no `indeterminate` DOM property to write to directly (unlike the Lit port's
 * `this._input.indeterminate = ...` direct-DOM-API write) — there is no native checkbox element
 * at all here, just a `Pressable` + drawn indicator, so `indeterminate` only ever needs to affect
 * which icon renders and `accessibilityState.checked`'s `'mixed'` value, not a DOM property.
 */
export function GdCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  size = 'md',
  onValueChange,
  theme = {},
  children,
}: GdCheckboxProps) {
  const storeRef = useRef(
    createCheckboxStore({
      checked,
      indeterminate,
      disabled,
      onValueChange,
    })
  );
  const store = storeRef.current;

  useEffect(() => {
    store.getState().syncControlledValue(checked);
  }, [store, checked]);

  useEffect(() => {
    store.getState().setDisabled(disabled);
  }, [store, disabled]);

  useEffect(() => {
    store.getState().setIndeterminate(indeterminate);
  }, [store, indeterminate]);

  const currentChecked = useStore(store, (s) => s.checked);
  const resolved = resolveCheckboxStyle(theme, size);

  const indicatorStyle: ViewStyle = {
    width: resolved.indicatorSize,
    height: resolved.indicatorSize,
    borderRadius: pxToNumber(resolved.indicatorDefault.borderRadius),
    borderWidth: pxToNumber(resolved.indicatorDefault.borderWidth),
    borderColor: resolved.indicatorDefault.borderColor,
    backgroundColor: resolved.indicatorDefault.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...(indeterminate
      ? {
          backgroundColor: resolved.indicatorIndeterminate.backgroundColor,
          borderColor: resolved.indicatorIndeterminate.borderColor,
        }
      : currentChecked
        ? {
            backgroundColor: resolved.indicatorChecked.backgroundColor,
            borderColor: resolved.indicatorChecked.borderColor,
          }
        : {}),
  };

  const handlePress = () => {
    if (disabled) return;
    store.getState().toggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ disabled, checked: indeterminate ? 'mixed' : currentChecked }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: pxToNumber(resolved.wrapperGap),
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={indicatorStyle}>
        {indeterminate ? (
          <Svg width={resolved.iconSize} height={resolved.iconSize} viewBox="0 0 10 10" fill="none">
            <Path d="M1 5H9" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
        ) : currentChecked ? (
          <Svg width={resolved.iconSize} height={resolved.iconSize} viewBox="0 0 10 10" fill="none">
            <Path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : null}
      </View>
      {children ? <Text>{children}</Text> : null}
    </Pressable>
  );
}
