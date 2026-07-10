import { describe, expect, it } from 'vitest';
import { resolveButtonVariantStyle } from './button';
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
    border: { black: '#000000', disabled: '#cccccc' },
  },
  font: { weight: { medium: 500 } },
};

describe('resolveButtonVariantStyle', () => {
  it('resolves the primary variant from theme values', () => {
    const style = resolveButtonVariantStyle(theme, 'primary');
    expect(style.container).toEqual({ backgroundColor: '#000000', color: '#000000' });
    expect(style.containerHover).toEqual({ backgroundColor: '#1a1a1a' });
    expect(style.containerActive).toEqual({ backgroundColor: '#ffb020' });
    expect(style.containerDisabled).toEqual({ backgroundColor: '#e0e0e0' });
    expect(style.label.fontWeight).toBe(500);
  });

  it('resolves the outlined variant with a border', () => {
    const style = resolveButtonVariantStyle(theme, 'outlined');
    expect(style.container.borderColor).toBe('#000000');
    expect(style.container.borderWidth).toBe(1);
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
    expect(style.container.backgroundColor).toBe('#000000');
    expect(style.textColor).toBe('#000000');
  });
});
