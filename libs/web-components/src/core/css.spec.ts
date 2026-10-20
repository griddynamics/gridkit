import { describe, expect, it } from 'vitest';
import { buttonCssBlockToText, cssKeyframesToText, cssPropertyValueToText } from './css';
import { resolveButtonRadius } from './button';
import type { ThemeLike } from './theme';

describe('resolveButtonRadius', () => {
  it('defaults to none (square corners), not rounded', () => {
    expect(resolveButtonRadius({})).toBe('0px');
  });

  it('falls back to the real radius scale per rounded value when no theme is passed', () => {
    expect(resolveButtonRadius({}, 'xs')).toBe('2px');
    expect(resolveButtonRadius({}, 'lg')).toBe('16px');
    expect(resolveButtonRadius({}, 'round')).toBe('9999px');
  });

  it("honors a theme's own radius object instead of its own hardcoded scale", () => {
    const theme: ThemeLike = { radius: { lg: '99px' } };
    expect(resolveButtonRadius(theme, 'lg')).toBe('99px');
  });
});

describe('buttonCssBlockToText', () => {
  it('serializes flat properties as kebab-case declarations under the given selector', () => {
    const css = buttonCssBlockToText('button', { backgroundColor: '#FFB800', fontWeight: 500 });
    expect(css).toContain('button {');
    expect(css).toContain('background-color: #FFB800;');
    expect(css).toContain('font-weight: 500;');
  });

  it('matches React CSS-in-JS numeric units instead of emitting invalid dimension declarations', () => {
    const css = buttonCssBlockToText('.scroll', {
      width: 300,
      height: 200,
      padding: 8,
      opacity: 0.2,
      lineHeight: 1.5,
      zIndex: 2,
    });

    expect(css).toContain('width: 300px;');
    expect(css).toContain('height: 200px;');
    expect(css).toContain('padding: 8px;');
    expect(css).toContain('opacity: 0.2;');
    expect(css).toContain('line-height: 1.5;');
    expect(css).toContain('z-index: 2;');
    expect(cssPropertyValueToText('marginTop', 0)).toBe('0');
    expect(cssPropertyValueToText('WebkitLineClamp', 2)).toBe('2');
  });

  it("replaces '&' with the given selector in nested (possibly comma-separated) selector keys", () => {
    const css = buttonCssBlockToText('button', { '&:hover, &.hover': { color: 'red' } });
    expect(css).toContain('button:hover, button.hover {');
    expect(css).toContain('color: red;');
  });

  it('recurses through multiple nesting levels (real focus-visible/::after shape)', () => {
    const css = buttonCssBlockToText('button', {
      '&:focus-visible': { position: 'relative', '&::after': { content: '""', border: '2px solid blue' } },
    });
    expect(css).toContain('button:focus-visible {');
    expect(css).toContain('position: relative;');
    expect(css).toContain('button:focus-visible::after {');
    expect(css).toContain('border: 2px solid blue;');
  });

  it('emits nothing for an empty block (no pointless empty rule)', () => {
    expect(buttonCssBlockToText('button', {})).toBe('');
    expect(buttonCssBlockToText('button', undefined)).toBe('');
  });

  it("emits nothing for a selector-only key with an empty nested object (matches inherit's '&:hover, &.hover': {})", () => {
    const css = buttonCssBlockToText('button', { '&:hover, &.hover': {} });
    expect(css).toBe('');
  });
});

describe('cssKeyframesToText', () => {
  it('wraps token steps in a valid named keyframes rule', () => {
    expect(
      cssKeyframesToText('gd-spin', {
        '0%': { transform: 'rotate(0deg)', opacity: 0 },
        '50%, 100%': { transform: 'rotate(360deg)', opacity: 1 },
      })
    ).toBe(
      '@keyframes gd-spin {\n' +
        '0% {\ntransform: rotate(0deg);\nopacity: 0;\n}\n' +
        '50%, 100% {\ntransform: rotate(360deg);\nopacity: 1;\n}\n' +
        '}\n'
    );
  });

  it('does not emit an empty keyframes rule', () => {
    expect(cssKeyframesToText('gd-empty', {})).toBe('');
    expect(cssKeyframesToText('', { to: { opacity: 1 } })).toBe('');
  });
});
