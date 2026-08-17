import { describe, expect, it } from 'vitest';
import { resolveButtonVariantStyle, resolveButtonRadius, buttonCssBlockToText } from './button';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  colors: {
    text: { default: '#171717', black: '#000000', primary: '#0a5', secondary: '#05a', disabled: '#a3a3a3' },
    bg: {
      fill: {
        primary: '#000000',
        secondary: '#1a1a1a',
        hover: '#f5f5f5',
        disabled: '#e0e0e0',
        warning: { primary: { default: '#ffb020' } },
      },
    },
    border: { black: '#000000', disabled: '#cccccc', focus: '#0a5a9c' },
  },
  font: { weight: { medium: 500 }, family: 'Test Sans', size: { p: '18px' } },
  spacing: { sm: '10px', md: '20px' },
  values: { transitions: { button: { default: 'background 0.1s linear' } } },
};

describe('resolveButtonVariantStyle', () => {
  it('resolves the primary variant from theme values', () => {
    const style = resolveButtonVariantStyle(theme, 'primary');
    expect(style.container).toEqual({ backgroundColor: '#000000', color: '#000000' });
    expect(style.containerHover).toEqual({ backgroundColor: '#1a1a1a' });
    expect(style.containerActive).toEqual({ backgroundColor: '#ffb020' });
    expect(style.containerDisabled).toEqual({ backgroundColor: '#e0e0e0', color: '#a3a3a3' });
    expect(style.label.fontWeight).toBe(500);
  });

  it('resolves the outlined variant with a border', () => {
    const style = resolveButtonVariantStyle(theme, 'outlined');
    expect(style.container.borderColor).toBe('#000000');
    expect(style.container.borderWidth).toBe('1px');
    expect(style.containerDisabled.borderColor).toBe('#cccccc');
  });

  it('falls back to primary for an unknown variant', () => {
    // @ts-expect-error deliberately passing an invalid variant to exercise the fallback
    const style = resolveButtonVariantStyle(theme, 'not-a-real-variant');
    expect(style).toEqual(resolveButtonVariantStyle(theme, 'primary'));
  });

  it('defaults to primary when no variant is passed', () => {
    expect(resolveButtonVariantStyle(theme)).toEqual(resolveButtonVariantStyle(theme, 'primary'));
  });

  it('resolves inherit with literal "inherit" values, not theme lookups', () => {
    const style = resolveButtonVariantStyle(theme, 'inherit');
    expect(style.textColor).toBe('inherit');
    expect(style.label).toEqual({ color: 'inherit', fontWeight: 'inherit' });
  });

  it('falls back to hardcoded defaults when theme values are missing', () => {
    const style = resolveButtonVariantStyle({}, 'primary');
    expect(style.container.backgroundColor).toBe('#FFB800');
    expect(style.textColor).toBe('#000000');
  });

  it('falls back to the real hover/active/disabled brand colors, not black-based placeholders', () => {
    const style = resolveButtonVariantStyle({}, 'primary');
    expect(style.containerHover.backgroundColor).toBe('#F29100');
    expect(style.containerActive.backgroundColor).toBe('#FF8700');
    expect(style.containerDisabled.backgroundColor).toBe('#E5E5E5');
  });

  it.each(['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit'] as const)(
    "mutes %s's disabled text to colors.text.disabled, matching button.default's universal '&:disabled, &:disabled *' rule",
    (variant) => {
      expect(resolveButtonVariantStyle(theme, variant).containerDisabled.color).toBe('#a3a3a3');
    }
  );

  it('falls back to the real disabled text color when no theme is passed', () => {
    expect(resolveButtonVariantStyle({}, 'primary').containerDisabled.color).toBe('#A3A3A3');
  });

  it("resolves fontFamily/fontSize from the theme's shared font tokens, same as Input/Select/Typography", () => {
    const style = resolveButtonVariantStyle(theme, 'primary');
    expect(style.fontFamily).toBe('Test Sans');
    expect(style.fontSize).toBe('18px');
  });

  it('falls back to the real font family/size when no theme is passed', () => {
    const style = resolveButtonVariantStyle({}, 'primary');
    expect(style.fontFamily).toBe('"Fira Sans", sans-serif');
    expect(style.fontSize).toBe('16px');
  });

  it("resolves gap/padding from the theme's shared spacing tokens, matching button.default", () => {
    const style = resolveButtonVariantStyle(theme, 'primary');
    expect(style.gap).toBe('10px');
    expect(style.padding).toBe('10px 20px');
  });

  it('falls back to the real spacing scale for gap/padding when no theme is passed', () => {
    const style = resolveButtonVariantStyle({}, 'primary');
    expect(style.gap).toBe('8px');
    expect(style.padding).toBe('8px 16px');
  });

  it("resolves focusColor/transition from the theme's shared tokens", () => {
    const style = resolveButtonVariantStyle(theme, 'primary');
    expect(style.focusColor).toBe('#0a5a9c');
    expect(style.transition).toBe('background 0.1s linear');
  });

  it('falls back to the real focus color/transition when no theme is passed', () => {
    const style = resolveButtonVariantStyle({}, 'primary');
    expect(style.focusColor).toBe('#0069B4');
    expect(style.transition).toBe('background 0.2s ease-in-out, border 0.2s ease-in-out, color 0.2s ease-in-out');
  });
});

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
    const theme: DesignCoreTheme = { radius: { lg: '99px' } };
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
