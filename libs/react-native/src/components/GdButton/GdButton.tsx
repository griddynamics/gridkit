import { ActivityIndicator, Pressable, Text, type GestureResponderEvent, type ViewStyle } from 'react-native';
import { resolveButtonVariantStyle, type ButtonVariantName, type DesignCoreTheme } from 'gd-design-core';
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
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={({ pressed }): ViewStyle => ({
        ...toViewStyle(resolved.container),
        ...(pressed && !isDisabled ? toViewStyle(resolved.containerActive) : null),
        ...(isDisabled ? toViewStyle(resolved.containerDisabled) : null),
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={resolved.textColor} />
      ) : (
        <Text style={{ color: resolved.label.color, fontWeight: toFontWeight(resolved.label.fontWeight) }}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
