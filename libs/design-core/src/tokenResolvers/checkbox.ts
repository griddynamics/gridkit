/** Mirrors gd-design-library's `CheckboxSize` (libs/ui/src/components/atoms/Checkbox/Checkbox.types.ts). */
export type CheckboxSizeName = 'sm' | 'md';

/**
 * There is deliberately no `resolveCheckboxStyle` hand-mirroring `checkbox.ts`'s object here —
 * that would be a second, manually-kept-in-sync copy of the same data (including its `size`
 * scale and hex fallbacks). `gd-checkbox.ts` instead imports the REAL `checkbox` object from
 * `gd-design-library/tokens` and resolves it directly with `resolveThemeTree`, so any edit to
 * `libs/ui/src/tokens/checkbox.ts` is picked up automatically. No `label` fields are read from
 * it either way — `Checkbox.tsx` renders its label as a bare, unstyled span, so the token
 * file's `label` block is never actually consumed by the real component; its font/color is
 * 100% ambient CSS inheritance, which a Shadow-DOM span with no explicit style already gets for
 * free.
 */
