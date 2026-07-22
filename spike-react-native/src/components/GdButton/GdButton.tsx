import {
  ActivityIndicator,
  Pressable,
  Text,
  type GestureResponderEvent,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { resolveButtonVariantStyle, type ButtonVariantName, type DesignCoreTheme } from 'gd-design-core';

/** Picks only the ViewStyle-compatible fields — gd-design-core's `color` field is for text, not the container view. */
function toViewStyle(style: { backgroundColor?: string; borderColor?: string; borderWidth?: number }): ViewStyle {
  const { backgroundColor, borderColor, borderWidth } = style;
  return { backgroundColor, borderColor, borderWidth };
}

/** gd-design-core's fontWeight is a loose `string | number`; RN's TextStyle only accepts a fixed string union. */
function toFontWeight(fontWeight: string | number): TextStyle['fontWeight'] {
  const asString = String(fontWeight);
  const allowed: ReadonlyArray<TextStyle['fontWeight']> = [
    'normal',
    'bold',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ];
  return (allowed as readonly string[]).includes(asString) ? (asString as TextStyle['fontWeight']) : undefined;
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
 * Button port (per the spike plan's Migration Example) — the platform's smoke test.
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
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
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
