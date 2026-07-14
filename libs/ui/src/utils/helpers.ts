type PropertyKey = string | number;
type PropertyPath = any;

export const isArray = (value: unknown): boolean => {
  return Array.isArray(value);
};

export const isObject = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const get = <T = any>(obj: any, path: PropertyPath, defaultValue?: T): T => {
  let keys: string[];

  if (Array.isArray(path)) {
    keys = path;
  } else if (typeof path === 'string') {
    // Handle bracket notation and dot notation in a single pass
    keys = parsePathString(path);
  } else {
    // Fallback for other types (like objects, if needed)
    keys = Object.keys(path);
  }

  // Navigate through the object
  let result = obj;
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue as T;
    }
    result = result[key];
  }

  return result === undefined ? (defaultValue as T) : result;
};

/**
 * Parses a path string into an array of keys, handling:
 * - Dot notation: 'a.b.c'
 * - Bracket notation: 'a[0].b'
 * - Mixed notation: 'a.b[0].c["key"]'
 * - Quoted keys with dots: 'colors.neutral["grey.30"]'
 */
export const parsePathString = (pathStr: string): string[] => {
  if (!pathStr) return [];

  const keys: string[] = [];
  let current = '';
  let inBrackets = false;
  let quoteChar = '';
  let bracketContent = '';

  for (let i = 0; i < pathStr.length; i++) {
    const char = pathStr[i];

    if (inBrackets) {
      // Handle content inside brackets
      if (quoteChar) {
        // We're inside quoted content
        if (char === quoteChar) {
          quoteChar = ''; // End of quoted content
        } else {
          bracketContent += char;
        }
      } else {
        // We're inside brackets but not in quotes
        if (char === '"' || char === "'") {
          quoteChar = char;
        } else if (char === ']') {
          // End of bracket content
          inBrackets = false;
          if (bracketContent) {
            keys.push(bracketContent);
          }
          bracketContent = '';
        } else if (char !== ' ' && char !== '\t' && char !== '\n') {
          // Ignore whitespace in bracket notation
          bracketContent += char;
        }
      }
    } else {
      // Outside brackets
      if (char === '[') {
        // Start bracket notation
        if (current) {
          keys.push(current);
          current = '';
        }
        inBrackets = true;
        bracketContent = '';
      } else if (char === '.' && current) {
        // Dot separator - push current key
        keys.push(current);
        current = '';
      } else if (char !== '.') {
        // Regular character in dot notation
        current += char;
      }
    }
  }

  // Handle any remaining content
  if (current) {
    keys.push(current);
  }

  return keys;
};

export const set = <T = any>(obj: T, path: PropertyPath, value: unknown, isExtend = false): T => {
  const keys: string[] = Array.isArray(path)
    ? (path as string[])
    : typeof path === 'string'
      ? parsePathString(path)
      : Object.keys(path);
  let current: any = obj;
  try {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;

      if (isLast) {
        if (isExtend) {
          current[key] = { ...current[key], ...(value || {}) };
        } else {
          current[key] = value;
        }
      } else {
        current[key] = current[key] != null ? { ...(current[key] as object) } : {};
        current = current[key] as Record<PropertyKey, unknown>;
      }
    }

    return obj;
  } catch (e) {
    console.error(e);
    return obj;
  }
};

export const without = <T>(array: T[], ...values: T[]): T[] => {
  return array.filter((item) => !values.includes(item));
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>
  );
};

export const take = <T>(array: T[], n = 1): T[] => {
  return array.slice(0, n);
};

export const size = (collection: Array<unknown> | Record<PropertyKey, unknown> | string | null | undefined): number => {
  if (collection == null) return 0;
  if (Array.isArray(collection) || typeof collection === 'string') return collection.length;
  return Object.keys(collection).length;
};

export const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value;
  if (!value) return null;

  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
};

export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => unknown,
  wait: number
): ((...args: Args) => void) => {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
