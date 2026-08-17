/**
 * Structural subset of gd-design-library's theme shape, covering only the token paths
 * this package's resolvers read (colors.*, font.*, spacing.*, radius.*, values.*).
 * Intentionally loose rather than a nominal import of gd-design-library's Theme type —
 * see README "Theme parameter" for why. Any object shaped like gd-design-library's
 * `defaultTheme` (or a per-platform equivalent) satisfies this.
 */
export interface DesignCoreTheme {
  colors?: Record<string, unknown>;
  font?: Record<string, unknown>;
  spacing?: Record<string, unknown>;
  radius?: Record<string, unknown>;
  values?: Record<string, unknown>;
  [key: string]: unknown;
}
