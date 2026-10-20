import { defaultTheme as tokensDefaultTheme } from 'gd-design-library/tokens';
import type { ThemeLike } from './core';

/* eslint-disable @typescript-eslint/no-explicit-any -- token groups are intentionally untyped, see below */
/**
 * Shape of the bundled default theme. The token groups are typed `any` on purpose: typing them
 * as `typeof` the real tokens would make the published `.d.ts` import `gd-design-library`, which
 * standalone consumers do not install. Custom themes can still spread and override any group.
 */
export type DefaultTheme = ThemeLike & { colors: any; font: any; spacing: any; radius: any; values: any };
/* eslint-enable @typescript-eslint/no-explicit-any */

/** GridKit default theme, inlined into this package so `gd-design-library` is not required. */
export const defaultTheme: DefaultTheme = tokensDefaultTheme as unknown as DefaultTheme;
