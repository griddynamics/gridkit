import { get, set, size, toNumber, debounce, isArray, isObject, pick, take, without } from './helpers';

describe('get', () => {
  it('SHOULD get nested property WHEN using string path', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(get(obj, 'a.b.c')).toBe(1);
  });

  it('SHOULD get nested property WHEN using array path', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(get(obj, ['a', 'b', 'c'])).toBe(1);
  });

  it('SHOULD return default value FOR non-existent path', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(get(obj, 'b.c.z', 'default')).toBe('default');
  });

  it('SHOULD get nested property WHEN using object path', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(get(obj, { a: 'a', b: 1, c: 3 })).toBe(1);
  });
  it('SHOULD get path a["b.c"] FOR key like ["b.c"]', () => {
    const obj = { a: { 'b.c': { c: 1 } } };
    expect(get(obj, "a['b.c']")).toStrictEqual({ c: 1 });
  });
  it('SHOULD get path a["&:focus-visible ~ .class"] FOR key like ["&:focus-visible ~ .class"]', () => {
    const obj = { a: { '&:focus-visible ~ .class': { c: 1 } } };
    expect(get(obj, "a['&:focus-visible ~ .class']")).toStrictEqual({ c: 1 });
  });
});

describe('set', () => {
  it('SHOULD set nested property WHEN using string path', () => {
    const obj = { a: { b: { c: 1 } } };
    set(obj, 'a.b.c', 2);
    expect(obj).toEqual({ a: { b: { c: 2 } } });
  });

  it('SHOULD set nested property WHEN key contains a dot (e.g., b.c)', () => {
    const obj = { a: { 'b.c': { '.d': 1 } } };
    set(obj, "a['b.c']['.d']", 5);
    expect(obj).toEqual({ a: { 'b.c': { '.d': 5 } } });
  });

  it('SHOULD set nested property WHEN using array path', () => {
    const obj = { a: { b: { c: 1 } } };
    set(obj, ['a', 'b', 'c'], 2);
    expect(obj).toEqual({ a: { b: { c: 2 } } });
  });

  it('SHOULD create intermediate objects IF they dont exist', () => {
    const obj = {};
    set(obj, 'a.b.c', 1);
    expect(obj).toEqual({ a: { b: { c: 1 } } });
  });

  it('SHOULD set path a["&:focus-visible ~ .class"] FOR key like ["&:focus-visible ~ .class"]', () => {
    const obj = {};
    set(obj, "a['&:focus-visible ~ .class']", { c: 1 });
    expect(obj).toEqual({ a: { '&:focus-visible ~ .class': { c: 1 } } });
  });
});

describe('size', () => {
  it('SHOULD return length of array', () => {
    expect(size([1, 2, 3])).toBe(3);
  });

  it('SHOULD return length of string', () => {
    expect(size('hello')).toBe(5);
  });

  it('SHOULD return number of keys in object', () => {
    expect(size({ a: 1, b: 2 })).toBe(2);
  });

  it('SHOULD return 0 for null or undefined', () => {
    expect(size(null)).toBe(0);
    expect(size(undefined)).toBe(0);
  });
});

describe('toNumber', () => {
  it('SHOULD return number as is', () => {
    expect(toNumber(42)).toBe(42);
  });

  it('SHOULD convert string to number', () => {
    expect(toNumber('42')).toBe(42);
  });

  it('SHOULD return null FOR invalid number', () => {
    expect(toNumber('abc')).toBe(null);
  });

  it('SHOULD return null FOR undefined', () => {
    expect(toNumber(undefined)).toBe(null);
  });
});

describe('debounce', () => {
  it('SHOULD debounce function calls', async () => {
    let counter = 0;
    const increment = () => counter++;
    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    expect(counter).toBe(0);

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(counter).toBe(1);
  });
});

describe('isArray', () => {
  it('SHOULD return true FOR array', () => {
    expect(isArray([1, 2, 3])).toBe(true);
  });

  it('SHOULD return false FOR non-array', () => {
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray('string')).toBe(false);
    expect(isArray(42)).toBe(false);
  });

  it('SHOULD return true FOR empty array', () => {
    expect(isArray([])).toBe(true);
  });

  it('SHOULD return true FOR array of different types', () => {
    expect(isArray([1, 'string', true, {}])).toBe(true);
  });
});

describe('isObject', () => {
  it('SHOULD return true FOR plain object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('SHOULD return false FOR non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(42)).toBe(false);
  });
});

describe('without', () => {
  it('SHOULD remove specified values from array', () => {
    expect(without([1, 2, 3, 4], 2, 4)).toEqual([1, 3]);
  });

  it('SHOULD handle empty array', () => {
    expect(without([], 1)).toEqual([]);
  });

  it('SHOULD handle non-existing values', () => {
    expect(without([1, 2, 3], 4, 5)).toEqual([1, 2, 3]);
  });
});

describe('pick', () => {
  it('SHOULD handle nested objects', () => {
    const obj = { a: { b: 2 }, c: 3 };
    expect(pick(obj, ['a'])).toEqual({ a: { b: 2 } });
  });

  it('SHOULD handle empty array of keys', () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, [])).toEqual({});
  });
});

describe('take', () => {
  it('SHOULD take first n elements from array', () => {
    expect(take([1, 2, 3, 4], 2)).toEqual([1, 2]);
  });

  it('SHOULD return all elements IF n > array length', () => {
    expect(take([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  it('SHOULD handle zero n', () => {
    expect(take([1, 2, 3], 0)).toEqual([]);
  });

  it('SHOULD handle undefined n', () => {
    expect(take([1, 2, 3])).toEqual([1]);
  });

  it('SHOULD handle array with different types', () => {
    expect(take([1, 'string', true], 2)).toEqual([1, 'string']);
  });
});
