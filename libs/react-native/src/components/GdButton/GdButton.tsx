import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, type GestureResponderEvent, type ViewStyle } from 'react-native';
import {
  resolveButtonRadius,
  resolveButtonVariantStyle,
  type ButtonVariantName,
  type DesignCoreTheme,
} from 'gd-design-core';
import { pxToNumber } from '../../utils/pxToNumber';
import { toFontWeight } from '../../utils/toFontWeight';

/** Picks only the ViewStyle-compatible fields — gd-design-core's `color` field is for text, not
 *  the container view. `borderWidth` arrives as a CSS px-string (e.g. `'1px'`) from the resolver;
 *  `pxToNumber` bridges it to the plain number RN's `ViewStyle` requires. */
function toViewStyle(style: {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
}): ViewStyle {
  const { backgroundColor, borderColor, borderWidth } = style;
  return { backgroundColor, borderColor, borderWidth: pxToNumber(borderWidth) };
}

/** `resolved.padding` is button.ts's `` `${spacing.sm} ${spacing.md}` `` — a fixed 2-value CSS
 *  shorthand (`<vertical> <horizontal>`), not an arbitrary padding string. RN has no shorthand
 *  padding string support, so split it into the two `ViewStyle` fields it actually means. */
function toPaddingStyle(padding: string): Pick<ViewStyle, 'paddingVertical' | 'paddingHorizontal'> {
  const [vertical, horizontal] = padding.split(' ');
  return { paddingVertical: pxToNumber(vertical), paddingHorizontal: pxToNumber(horizontal ?? vertical) };
}

export interface GdButtonProps {
  variant?: ButtonVariantName;
  disabled?: boolean;
  isLoading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  theme?: DesignCoreTheme;
  children?: string;
}

/**
 * CTORNDSD-590 Button port (per the spike plan's Migration Example) — the platform's smoke test.
 * Consumes gd-design-core's `resolveButtonVariantStyle`, the same token-resolved values the React
 * web and Lit adapters use, mapping its state-keyed style objects onto `Pressable`'s `pressed` state
 * function instead of a CSS pseudo-class — exactly the state mechanism the resolver was designed to
 * be state-shape-neutral about. Falls back to the resolver's own hardcoded defaults when no theme is
 * supplied, so this renders standalone without gd-design-library's real theme wired in yet.
 */
export function GdButton({ variant = 'primary', disabled, isLoading, onPress, theme = {}, children }: GdButtonProps) {
  const resolved = resolveButtonVariantStyle(theme, variant);
  const borderRadius = pxToNumber(resolveButtonRadius(theme));
  const isDisabled = disabled || isLoading;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isDisabled}
        style={({ pressed }): ViewStyle[] => [
          {
            ...toPaddingStyle(resolved.padding),
            borderRadius,
            alignItems: 'center',
            ...toViewStyle(resolved.container),
            ...(pressed && !isDisabled ? toViewStyle(resolved.containerActive) : null),
            ...(isDisabled ? toViewStyle(resolved.containerDisabled) : null),
          },
          // react-native-web renders this as a real `<button>`, which picks up the browser's
          // own native default focus outline independently of the `gd-button-focus-ring`
          // overlay below — the two together is a doubled ring, same fix as `GdInput`/
          // `GdSelect`. `outlineStyle` is a react-native-web-only style extension (no-op on
          // iOS/Android); not in RN's own `ViewStyle` type, hence the cast.
          { outlineStyle: 'none' } as ViewStyle,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!isDisabled, busy: !!isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator color={resolved.textColor} />
        ) : (
          <Text
            style={{
              fontFamily: resolved.fontFamily as string,
              fontSize: pxToNumber(resolved.fontSize),
              color: resolved.label.color,
              fontWeight: toFontWeight(resolved.label.fontWeight),
            }}
          >
            {children}
          </Text>
        )}
      </Pressable>
      {isFocused ? (
        // `button.ts`'s own `'&:focus-visible'` rule — `getFocusStyles({ inset: '-4px', border:
        // '2px solid colors.border.focus' })` — a `::after` pseudo-element inset by -4px on
        // every edge. Same "absolutely-positioned sibling, inset outward" technique as
        // `GdInput`'s/`GdSelect`'s focus ring (see those components).
        <View
          testID="gd-button-focus-ring"
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderWidth: 2,
            borderColor: resolved.focusColor,
            // No `borderRadius` here — `button.ts`'s own `getFocusStyles({inset: '-4px', border:
            // ...})` call passes no `borderRadius` argument either, so the real focus ring is
            // square-cornered regardless of the button's own `rounded` value. Matching that
            // exactly rather than "improving" on it.
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </View>
  );
}
