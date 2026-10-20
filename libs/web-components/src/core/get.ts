/**
 * Minimal, dependency-free nested-path getter. Kept local because `gd-design-library/tokens` does
 * not export `@utils/get`, and importing the main entry would pull React into every element.
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
