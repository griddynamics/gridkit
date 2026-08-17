import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View, type TextStyle } from 'react-native';
import {
  createInputStore,
  debounce,
  resolveInputStyle,
  type DesignCoreTheme,
  type InputColorVariantName,
} from 'gd-design-core';
import { pxToNumber } from '../../utils/pxToNumber';
import { toFontFamily } from '../../utils/toFontFamily';

export interface GdInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  color?: InputColorVariantName;
  /** Mirrors `gd-input.ts`'s `debounce-callback-time` — ms delay before `onValueChange` fires
   *  after the last keystroke. Undefined means every keystroke dispatches immediately. */
  debounceCallbackTime?: number;
  onValueChange?: (value: string) => void;
  theme?: DesignCoreTheme;
}

/**
 * CTORNDSD-590 Input port — mirrors `libs/web-components/src/components/gd-input/gd-input.ts`'s
 * cursor-jump mitigation, adapted to React's controlled-component model instead of a direct-DOM
 * `activeElement` guard.
 *
 * RN's `TextInput` has no DOM `activeElement`/direct-value-write escape hatch the way a native
 * `<input>` does — this component keeps its own `localValue` state as the single source of truth
 * for what's rendered, and only re-syncs it from an external `value` prop change while the field
 * is NOT focused (`isFocusedRef`). An external write that arrives while the user is actively
 * typing is dropped, exactly like the Lit port's `activeElement` guard, and reconciled on blur
 * instead. `onChangeText` (RN's bare-string callback, unlike web's `ChangeEvent<HTMLInputElement>`
 * — the one confirmed permanent per-platform fork per `createInputStore.ts`'s own doc comment)
 * is wrapped with `gd-design-core`'s `debounce()` before calling `onValueChange`.
 *
 * NOT ported from `createInputStore`: `registerMouseDown`/`registerKeyDown`'s
 * `isMouseInteraction` tracking. That state exists solely to pick a focus-ring style for
 * mouse-vs-keyboard-Tab interaction — RN has no mouse pointer or Tab-key focus-traversal
 * convention on touch targets, so there is no RN-side consumer for this value. Documented as a
 * finding in `react-native/FINDINGS.md`, not a silent omission.
 *
 * Cursor-jump mitigation is implemented but NOT empirically verified on-device in this spike —
 * see `react-native/FINDINGS.md` for why (no simulator/device available in the environment
 * this port was authored in) and what a human must still confirm before treating this as closed.
 */
export function GdInput({
  value,
  defaultValue = '',
  placeholder,
  label,
  helperText,
  disabled = false,
  color = 'primary',
  debounceCallbackTime,
  onValueChange,
  theme = {},
}: GdInputProps) {
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState(value ?? defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const isFocusedRef = useRef(false);
  const storeRef = useRef(createInputStore({ debounceCallbackTime }));
  const debouncedDispatchRef = useRef<((next: string) => void) | undefined>(undefined);
  const onValueChangeRef = useRef(onValueChange);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    storeRef.current.getState().setDebounceCallbackTime(debounceCallbackTime);
    debouncedDispatchRef.current = undefined;
  }, [debounceCallbackTime]);

  useEffect(() => {
    if (!isControlled || isFocusedRef.current) return;
    setLocalValue(value ?? '');
  }, [value, isControlled]);

  const getDebouncedDispatch = (): ((next: string) => void) => {
    const ms = storeRef.current.getState().debounceCallbackTime;
    if (typeof ms !== 'number') return (next) => onValueChangeRef.current?.(next);
    if (!debouncedDispatchRef.current) {
      debouncedDispatchRef.current = debounce((next: string) => onValueChangeRef.current?.(next), ms);
    }
    return debouncedDispatchRef.current;
  };

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    getDebouncedDispatch()(text);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    setIsFocused(true);
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    setIsFocused(false);
    // Reconciles any external `value` write dropped while focused (the guard above).
    if (isControlled && value !== localValue) setLocalValue(value ?? '');
  };

  const resolved = resolveInputStyle(theme, color);
  const textColor = disabled ? resolved.disabledColor : resolved.color;
  // `resolveInputStyle` exposes no `fontWeight`, so this resolves to the family's regular face.
  const fontFamily = toFontFamily(resolved.fontFamily);

  return (
    <View style={{ gap: pxToNumber(resolved.wrapperGap), alignItems: 'flex-start' }}>
      {label ? (
        <Text
          style={{
            color: resolved.labelColor,
            fontFamily,
            fontSize: pxToNumber(resolved.labelFontSize),
            lineHeight: pxToNumber(resolved.labelLineHeight),
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          borderWidth: pxToNumber(resolved.borderWidth),
          borderColor: resolved.borderColor,
          borderRadius: pxToNumber(resolved.borderRadius),
          paddingHorizontal: pxToNumber(resolved.horizontalPadding),
          width: '100%',
        }}
      >
        <TextInput
          value={localValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={resolved.disabledColor}
          style={[
            {
              fontFamily,
              fontSize: pxToNumber(resolved.fontSize),
              color: textColor,
              height: 40,
            },
            // react-native-web's `TextInput` compiles to a real DOM `<input>`, which picks up
            // the browser's own native focus ring independently of this wrapper `View`'s border
            // — the two rendered together is the doubled ring. `outlineStyle` is a
            // react-native-web-only style extension (no-op on iOS/Android) for suppressing it;
            // not in RN's own `TextStyle` type, hence the cast.
            { outlineStyle: 'none' } as TextStyle,
          ]}
        />
        {isFocused ? (
          // Real `input.ts` draws focus as a separate `.Input__outline` layer — `outline: 2px
          // solid colors.border.focus` at `outlineOffset: 3px` — sitting outside the border,
          // gap and all, while the border itself stays exactly as it was. RN has no `outline`
          // primitive, so this approximates the same "offset ring, border untouched" look with
          // an absolutely-positioned sibling `View`, inset by -(offset + width) = -5 on every
          // edge so its own 2px border lands in the same 3px-to-5px-outside band a CSS outline
          // would occupy. `pointerEvents: 'none'` keeps it from intercepting the tap that
          // toggles focus.
          <View
            testID="gd-input-focus-ring"
            style={{
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderWidth: 2,
              borderColor: resolved.focusColor,
              borderRadius: pxToNumber(resolved.borderRadius),
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </View>
      {helperText ? (
        <Text
          style={{
            color: resolved.helperTextColor,
            fontFamily,
            fontSize: pxToNumber(resolved.helperFontSize),
            lineHeight: pxToNumber(resolved.helperLineHeight),
          }}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
