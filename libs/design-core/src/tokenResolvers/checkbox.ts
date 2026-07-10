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
  labelColor: string;
}

/** Matches libs/ui/src/tokens/checkbox.ts `size` scale (px box size + icon size). */
const SIZE_PX: Record<CheckboxSizeName, { box: number; icon: number }> = {
  sm: { box: 16, icon: 10 },
  md: { box: 18, icon: 12 },
};

export function resolveCheckboxStyle(theme: DesignCoreTheme, size: CheckboxSizeName = 'md'): ResolvedCheckboxStyle {
  const { box, icon } = SIZE_PX[size] ?? SIZE_PX.md;
  const fillPrimary = get(theme, 'colors.bg.fill.primary', '#000000');

  return {
    indicatorSize: box,
    iconSize: icon,
    indicatorDefault: {
      borderWidth: get(theme, 'values.borderMedium', 2),
      borderColor: get(theme, 'colors.border.default', '#cccccc'),
      backgroundColor: 'transparent',
      borderRadius: get(theme, 'radius.xs', 2),
    },
    indicatorChecked: {
      backgroundColor: fillPrimary,
      borderColor: fillPrimary,
    },
    indicatorIndeterminate: {
      backgroundColor: fillPrimary,
      borderColor: fillPrimary,
    },
    labelColor: get(theme, 'colors.text.default', '#171717'),
  };
}
