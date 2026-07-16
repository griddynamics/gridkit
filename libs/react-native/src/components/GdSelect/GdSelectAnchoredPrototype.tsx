import { useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutRectangle } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useStore } from 'zustand';
import {
  createSelectStore,
  resolveSelectStyle,
  type DesignCoreTheme,
  type InputColorVariantName,
  type SelectOption,
} from 'gd-design-core';
import { pxToNumber } from '../../utils/pxToNumber';

export interface GdSelectAnchoredPrototypeProps {
  items: SelectOption[];
  value?: SelectOption | null;
  disabled?: boolean;
  color?: InputColorVariantName;
  placeholder?: string;
  onValueChange?: (value: SelectOption | null) => void;
  theme?: DesignCoreTheme;
}

/**
 * EVALUATION PROTOTYPE ONLY — not the shipped component (see `GdSelect.tsx`, which uses
 * `Modal` instead). This demonstrates Decision 2's option (B): a custom absolutely-positioned
 * `View` sibling, placed via `measure()`, plus a full-screen invisible backdrop `Pressable` for
 * outside-tap dismiss — no `Modal`.
 *
 * Load-bearing limitation found while building this (a real finding, not a hypothetical): RN's
 * `position: 'absolute'` resolves against the nearest positioned ancestor, not the device
 * viewport — there is no `fixed`-to-window equivalent outside of `Modal`'s native window layer.
 * This component's backdrop/dropdown therefore only visually covers the screen correctly when
 * this component (or an ancestor wrapping it) is mounted with `flex: 1` at (or near) the app
 * root; nested inside any scrollable list, padded card, or `overflow: 'hidden'` container, the
 * backdrop clips to that container instead of the true screen. `GdSelect.tsx`'s `Modal` approach
 * has no such requirement, since `Modal` renders through the native window, independent of where
 * in the component tree it's mounted. This asymmetry is the deciding factor recorded in
 * `react-native/FINDINGS.md`'s Select-approach-evaluation section.
 *
 * Also missing here, unlike `GdSelect.tsx`: Android hardware back-button dismiss (`Modal`'s
 * `onRequestClose` has no non-Modal equivalent without adding a native back-handler listener),
 * and any elevation above sibling content that isn't purely a paint-order accident of JSX order.
 *
 * Not verified on an actual simulator/device — see `FINDINGS.md`.
 */
export function GdSelectAnchoredPrototype({
  items,
  value = null,
  disabled = false,
  color = 'primary',
  placeholder,
  onValueChange,
  theme = {},
}: GdSelectAnchoredPrototypeProps) {
  const storeRef = useRef(createSelectStore({ disabled, value }));
  const store = storeRef.current;
  const triggerRef = useRef<View>(null);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);

  const isOpen = useStore(store, (s) => s.isOpen);
  const internalValue = useStore(store, (s) => s.internalValue);
  const selected = Array.isArray(internalValue) ? null : internalValue;

  const handleTriggerPress = () => {
    if (disabled) return;
    if (isOpen) {
      store.getState().close();
      return;
    }
    // `measure()` (relative-to-parent) rather than `measureInWindow()` — this prototype
    // positions the dropdown relative to its own nearest positioned ancestor, per the
    // limitation documented above, not the device window.
    triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setTriggerLayout({ x: pageX, y: pageY, width, height });
      store.getState().open();
    });
  };

  const handleSelect = (option: SelectOption) => {
    const next = store.getState().select(option);
    onValueChange?.(Array.isArray(next) ? null : next);
  };

  const resolved = resolveSelectStyle(theme, color);
  const fontFamily = resolved.fontFamily as string;

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        ref={triggerRef}
        onPress={handleTriggerPress}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          borderWidth: pxToNumber(resolved.borderWidth),
          borderColor: resolved.borderColor,
          backgroundColor: resolved.surfaceColor,
          paddingHorizontal: pxToNumber(resolved.triggerPadding),
          paddingVertical: pxToNumber(resolved.triggerPadding),
        }}
      >
        <Text style={{ fontFamily, fontSize: pxToNumber(resolved.fontSize), color: resolved.color }}>
          {selected?.name ?? placeholder ?? ''}
        </Text>
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <Path
            d="M4.5 7L9 11.5L13.5 7"
            stroke={resolved.color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      {isOpen && triggerLayout ? (
        <Pressable
          style={{ position: 'absolute', top: -triggerLayout.y, left: -triggerLayout.x, right: 0, bottom: 0 }}
          onPress={() => store.getState().close()}
        >
          <View
            style={{
              position: 'absolute',
              top: triggerLayout.y + triggerLayout.height + 2,
              left: triggerLayout.x,
              width: triggerLayout.width,
              backgroundColor: resolved.surfaceColor,
              paddingHorizontal: pxToNumber(resolved.dropdownPadding),
              paddingVertical: pxToNumber(resolved.dropdownPadding),
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            {items.map((item) => (
              <Pressable
                key={item.name}
                onPress={() => handleSelect(item)}
                style={{ paddingVertical: 8, paddingHorizontal: 8 }}
              >
                <Text style={{ fontFamily, fontSize: pxToNumber(resolved.fontSize), color: resolved.color }}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}
