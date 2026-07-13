import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';

/** Mirrors gd-design-library's `CheckboxSize` (libs/ui/src/components/atoms/Checkbox/Checkbox.types.ts). */
export type CheckboxSizeName = 'sm' | 'md';

export interface ResolvedCheckboxStyle {
  indicatorSize: number;
  iconSize: number;
  indicatorDefault: {
    borderWidth: string | number;
    borderColor: string;
    backgroundColor: string;
    borderRadius: string | number;
  };
  indicatorChecked: { backgroundColor: string; borderColor: string };
  indicatorIndeterminate: { backgroundColor: string; borderColor: string };
  /** `checkbox.wrapper.default.gap` — `get(theme, 'spacing.sm', ...)`. Unlike `label`, `wrapper`
   *  genuinely is consumed by `CheckboxWrapperStyled`. */
  wrapperGap: string | number;
}

/** Matches libs/ui/src/tokens/checkbox.ts `size` scale (px box size + icon size). */
const SIZE_PX: Record<CheckboxSizeName, { box: number; icon: number }> = {
  sm: { box: 16, icon: 10 },
  md: { box: 18, icon: 12 },
};

/**
 * No `label*` fields here on purpose — a previous revision added `labelColor`/`labelFontFamily`/
 * `labelFontSize`/`labelLineHeight` sourced from `libs/ui/src/tokens/checkbox.ts`'s `label`
 * block, but that block is never actually consumed by the real component: `Checkbox.tsx`
 * renders its label as a bare `{children && <span data-testid="...">{children}</span>}` with no
 * `css`/`style` prop at all — the token file defines a `label` shape nothing reads. The real
 * label's font/color is 100% ambient CSS inheritance (from whatever the host page/global reset
 * provides), which is also what a Shadow-DOM span with no explicit style resolves to, since
 * inherited CSS properties (color, font-family, font-size, line-height) cross the shadow
 * boundary same as any other DOM inheritance. Do not re-add explicit label typography here
 * without first confirming the real component's JSX actually applies the token you're mirroring
 * — check the component's `.tsx`, not just its token file.
 */
export function resolveCheckboxStyle(theme: DesignCoreTheme, size: CheckboxSizeName = 'md'): ResolvedCheckboxStyle {
  const { box, icon } = SIZE_PX[size] ?? SIZE_PX.md;
  const fillPrimary = get(theme, 'colors.bg.fill.primary', '#FFB800');

  return {
    indicatorSize: box,
    iconSize: icon,
    indicatorDefault: {
      borderWidth: get(theme, 'values.borderMedium', '2px'),
      borderColor: get(theme, 'colors.border.default', '#E5E5E5'),
      backgroundColor: 'transparent',
      borderRadius: get(theme, 'radius.xs', '2px'),
    },
    indicatorChecked: {
      backgroundColor: fillPrimary,
      borderColor: fillPrimary,
    },
    indicatorIndeterminate: {
      backgroundColor: fillPrimary,
      borderColor: fillPrimary,
    },
    wrapperGap: get(theme, 'spacing.sm', '8px'),
  };
}
