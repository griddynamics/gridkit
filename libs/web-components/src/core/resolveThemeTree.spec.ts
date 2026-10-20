import { describe, expect, it } from 'vitest';
import { resolveThemeTree } from './resolveThemeTree';

describe('resolveThemeTree', () => {
  it('evaluates a (theme) => value function leaf against the given theme', () => {
    const theme = { colors: { text: { default: '#171717' } } };
    const tree = { color: (t: typeof theme) => t.colors.text.default };
    expect(resolveThemeTree(tree, theme)).toEqual({ color: '#171717' });
  });

  it('leaves concrete (non-function) values untouched', () => {
    const tree = { border: 0, cursor: 'pointer' };
    expect(resolveThemeTree(tree, {})).toEqual({ border: 0, cursor: 'pointer' });
  });

  it('recurses into nested plain-object keys (Emotion pseudo-selector shape)', () => {
    const theme = { colors: { bg: { primary: '#FFB800' } } };
    const tree = {
      background: 'transparent',
      '&:hover, &.hover': { background: (t: typeof theme) => t.colors.bg.primary },
    };
    expect(resolveThemeTree(tree, theme)).toEqual({
      background: 'transparent',
      '&:hover, &.hover': { background: '#FFB800' },
    });
  });

  it('recurses two levels deep (real focus-visible -> ::after shape)', () => {
    const theme = { colors: { border: { focus: '#0069B4' } } };
    const tree = {
      '&:focus-visible': (t: typeof theme) => ({
        position: 'relative',
        '&::after': { border: `2px solid ${t.colors.border.focus}` },
      }),
    };
    expect(resolveThemeTree(tree, theme)).toEqual({
      '&:focus-visible': {
        position: 'relative',
        '&::after': { border: '2px solid #0069B4' },
      },
    });
  });

  it('preserves an empty nested object as-is', () => {
    expect(resolveThemeTree({ '&:hover, &.hover': {} }, {})).toEqual({ '&:hover, &.hover': {} });
  });
});
