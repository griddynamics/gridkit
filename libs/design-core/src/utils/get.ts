/**
 * Minimal, dependency-free nested-path getter. Kept local (rather than importing
 * gd-design-library's `@utils/get`) so this package has zero runtime dependency on
 * gd-design-library — see README "Theme parameter".
 */
export function get<T = unknown>(source: unknown, path: string | string[], fallback: T): T {
  const segments = Array.isArray(path) ? path : path.split('.');
  let current: unknown = source;

  for (const segment of segments) {
    if (current === null || typeof current !== 'object') {
      return fallback;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current === undefined ? fallback : (current as T);
}
