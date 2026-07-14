export type A2UIImageSources = string | string[];

/**
 * Normalizes an `A2UIImageSources` value into a lowercase, trimmed string array.
 * Returns `null` when `imageSources` is `undefined` (i.e. unconfigured — any host allowed).
 * Returns an empty array when `imageSources` is an empty string or empty array (no hosts allowed).
 */
export function normalizeImageSources(imageSources?: A2UIImageSources): string[] | null {
  if (imageSources === undefined) return null;
  const arr = Array.isArray(imageSources) ? imageSources : [imageSources];
  return arr.map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0);
}
