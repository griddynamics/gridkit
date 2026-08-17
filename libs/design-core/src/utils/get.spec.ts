import { describe, expect, it } from 'vitest';
import { get } from './get';

describe('get', () => {
  it('resolves a dotted path', () => {
    expect(get({ colors: { text: { default: '#171717' } } }, 'colors.text.default', 'fallback')).toBe('#171717');
  });

  it('resolves an array-form path', () => {
    expect(get({ a: { b: 1 } }, ['a', 'b'], 0)).toBe(1);
  });

  it('returns the fallback when a segment is missing', () => {
    expect(get({ colors: {} }, 'colors.text.default', 'fallback')).toBe('fallback');
  });

  it('returns the fallback when the source is not an object', () => {
    expect(get(null, 'a.b', 'fallback')).toBe('fallback');
    expect(get(undefined, 'a.b', 'fallback')).toBe('fallback');
    expect(get('string', 'a.b', 'fallback')).toBe('fallback');
  });

  it('returns a falsy resolved value rather than the fallback', () => {
    expect(get({ a: 0 }, 'a', 99)).toBe(0);
    expect(get({ a: false }, 'a', true)).toBe(false);
  });
});
