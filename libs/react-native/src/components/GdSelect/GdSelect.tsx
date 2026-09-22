import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View, type LayoutRectangle, type ViewStyle } from 'react-native';
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
import { toFontFamily } from '../../utils/toFontFamily';
import { toFontWeight } from '../../utils/toFontWeight';

export interface GdSelectProps {
  items: SelectOption[];
  value?: SelectOption | null;
  disabled?: boolean;
  color?: InputColorVariantName;
  placeholder?: string;
  emptyLabel?: string;
  onValueChange?: (value: SelectOption | null) => void;
  theme?: DesignCoreTheme;
}

/**
 * CTORNDSD-590 Select port — reduced-scope PoC (single-select only, no search, fixed-below
 * positioning), mirroring the Lit port's own reduced scope (`gd-select.ts`). Ships the RN
 * `Modal`-based dropdown-presentation approach (Decision 2, option A in the implementation
 * plan) as the default: `Modal`'s own chrome gives Android hardware-back-button dismiss
 * (`onRequestClose`) and correct full-screen overlay stacking for free, at the cost of one
 * `measureInWindow()` call on open to anchor the dropdown under the trigger (RN `Modal` has no
 * built-in "anchor to element" concept the way the Lit port's `popover="auto"` + manual
 * `getBoundingClientRect()` positioning does). Option B (a custom absolutely-positioned `View`
 * with its own full-screen backdrop, no `Modal`) was prototyped for comparison — see
 * `GdSelectAnchoredPrototype.tsx` and `react-native/FINDINGS.md`'s Select-approach-
 * evaluation section for the reasoned trade-off; **neither approach was verified on an actual
 * simulator/device** (no simulator was available in the environment this port was authored in) —
 * that verification is an outstanding follow-up, not a completed check.
 *
 * `boxShadow` (a CSS shadow string from the resolver) is approximated with a static RN
 * shadow/elevation pair rather than parsed — parsing the CSS string into per-platform shadow
 * props is deferred as a documented gap, not implemented here.
 *
 * `isOpen` (the store's own state) and `triggerLayout` (this component's own position state) are
 * deliberately decoupled: opening the store fires immediately on press, and `measureInWindow`'s
 * async result only ever refines the dropdown's position once it resolves. An earlier revision
 * gated `store.getState().open()` itself inside the `measureInWindow` callback — that couples
 * visibility to a native-bridge round trip that has no guaranteed timing (and, as found while
 * writing this component's own tests, no guaranteed firing at all in a JS-only test renderer).
 * The trade-off accepted here: the dropdown may render one frame at `{x:0, y:0}` before
 * `measureInWindow` resolves and repositions it — a minor, documented flicker risk, not verified
 * on-device (no simulator was available in the environment this port was authored in).
 */
export function GdSelect({
  items,
  value = null,
  disabled = false,
  color = 'primary',
  placeholder,
  emptyLabel,
  onValueChange,
  theme = {},
}: GdSelectProps) {
  const storeRef = useRef(createSelectStore({ disabled, value }));
  const store = storeRef.current;
  const triggerRef = useRef<View>(null);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const isOpen = useStore(store, (s) => s.isOpen);
  const internalValue = useStore(store, (s) => s.internalValue);
  const selected = Array.isArray(internalValue) ? null : internalValue;

  const handleTriggerPress = () => {
    if (disabled) return;
    if (isOpen) {
      store.getState().close();
      return;
    }
    store.getState().open();
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
    });
  };

  const handleSelect = (option: SelectOption) => {
    const next = store.getState().select(option);
    onValueChange?.(Array.isArray(next) ? null : next);
  };

  const resolved = resolveSelectStyle(theme, color);
  const fontFamily = toFontFamily(resolved.fontFamily, resolved.fontWeight);

  return (
    <View>
      <Pressable
        ref={triggerRef}
        onPress={handleTriggerPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        testID="gd-select-trigger"
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isOpen }}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            borderWidth: pxToNumber(resolved.borderWidth),
            borderColor: resolved.borderColor,
            backgroundColor: resolved.surfaceColor,
            paddingHorizontal: pxToNumber(resolved.triggerPadding),
            paddingVertical: pxToNumber(resolved.triggerPadding),
          },
          // react-native-web renders this trigger as a real `<button>`, which picks up the
          // browser's own native default focus outline (`outline-style: auto`) independently of
          // our custom `gd-select-focus-ring` overlay above — the two together is a doubled
          // ring, same root cause `GdInput`'s `TextInput` had. `outlineStyle` is a
          // react-native-web-only style extension (no-op on iOS/Android); not in RN's own
          // `ViewStyle` type, hence the cast.
          { outlineStyle: 'none' } as ViewStyle,
        ]}
      >
        <Text style={{ fontFamily, fontSize: pxToNumber(resolved.fontSize), color: resolved.color }}>
          {selected?.name ?? placeholder ?? ''}
        </Text>
        <Svg
          width={18}
          height={18}
          viewBox="0 0 18 18"
          fill="none"
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        >
          <Path
            d="M4.5 7L9 11.5L13.5 7"
            stroke={resolved.color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      {isFocused ? (
        // The real trigger renders as a `Button variant="inherit"`, so its focus ring is
        // `button.ts`'s own `getFocusStyles({ inset: '-4px', border: '2px solid
        // colors.border.focus' })` — a `::after` pseudo-element inset by -4px on every edge, not
        // anything Select-specific. Same "absolutely-positioned sibling, inset outward" technique
        // as `GdInput`'s focus ring (see that component), just with Button's own -4px/no-radius
        // values instead of Input's -5px.
        <View
          testID="gd-select-focus-ring"
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderWidth: 2,
            borderColor: resolved.focusColor,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => store.getState().close()}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => store.getState().close()}
          accessibilityLabel="Dismiss select dropdown"
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
            {items.length ? (
              items.map((item) => (
                <Pressable
                  key={item.name}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: selected?.value === item.value }}
                  style={({ pressed }) => ({
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                    backgroundColor:
                      pressed || selected?.value === item.value ? resolved.hoverBackgroundColor : undefined,
                  })}
                >
                  <Text
                    style={{
                      fontFamily,
                      fontSize: pxToNumber(resolved.fontSize),
                      fontWeight: toFontWeight(resolved.fontWeight),
                      color: resolved.color,
                    }}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              ))
            ) : emptyLabel ? (
              <Text style={{ fontFamily, fontSize: pxToNumber(resolved.fontSize), color: resolved.color }}>
                {emptyLabel}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
