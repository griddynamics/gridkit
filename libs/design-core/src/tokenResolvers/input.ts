/** Matches gd-design-library's real `InputColorVariant` (libs/ui/src/types/input.ts) exactly —
 *  member names and values both, not just the resolved colors. `warning` is the real
 *  component's semantic role name for the `colors.border.primary` (brand-gold) token, and
 *  `primary` is its role name for `colors.border.default` — that inversion is the real
 *  vocabulary, not a naming choice made here. Shared with `select.ts`'s color-variant scale
 *  (Select reuses the same `primary`/`success`/`warning`/`error` vocabulary as Input). */
export type InputColorVariantName = 'primary' | 'success' | 'warning' | 'error';

/**
 * There is deliberately no `resolveInputStyle` hand-mirroring `input.ts`'s object here — that
 * would be a second, manually-kept-in-sync copy of the same deeply-nested data (color-variant
 * border paths, helper-text color paths, per-size font metrics). `gd-input.ts` instead imports
 * the REAL `input` object from `gd-design-library/tokens` and resolves it directly with
 * `resolveThemeTree`, reading the exact same nested paths this file used to hand-duplicate
 * (`input.wrapper.withGap.gap`, `input.helper.default.{sm,md}`, `input.helper.<variant>.sm.color`,
 * `input.input.default.padding`, `input.input.defaultInteraction['& + .Input__border'].borderRadius`,
 * `input.input.<variant>['& + .Input__border']`), so any edit to `libs/ui/src/tokens/input.ts`
 * is picked up automatically. The debounce/interaction-tracking behavior that gives Input its
 * real portability value lives in `stores/createInputStore.ts`, unaffected by this change.
 */
