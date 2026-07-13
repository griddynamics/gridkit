import { describe, expect, it } from 'vitest';
import { resolveCheckboxStyle } from './checkbox';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  colors: { bg: { fill: { primary: '#000000' } }, border: { default: '#cccccc' }, text: { default: '#171717' } },
  values: { borderMedium: '2px' },
  radius: { xs: '2px' },
  spacing: { sm: '10px' },
};

describe('resolveCheckboxStyle', () => {
  it('resolves size-specific dimensions for sm', () => {
    const style = resolveCheckboxStyle(theme, 'sm');
    expect(style.indicatorSize).toBe(16);
    expect(style.iconSize).toBe(10);
  });

  it('resolves size-specific dimensions for md (default)', () => {
    const style = resolveCheckboxStyle(theme);
    expect(style.indicatorSize).toBe(18);
    expect(style.iconSize).toBe(12);
  });

  it('resolves checked and indeterminate to the same fill color', () => {
    const style = resolveCheckboxStyle(theme, 'md');
    expect(style.indicatorChecked).toEqual({ backgroundColor: '#000000', borderColor: '#000000' });
    expect(style.indicatorIndeterminate).toEqual({ backgroundColor: '#000000', borderColor: '#000000' });
  });

  it('resolves the default (unchecked) indicator border/radius from theme', () => {
    const style = resolveCheckboxStyle(theme, 'md');
    expect(style.indicatorDefault.borderColor).toBe('#cccccc');
    expect(style.indicatorDefault.borderWidth).toBe('2px');
    expect(style.indicatorDefault.borderRadius).toBe('2px');
    expect(style.indicatorDefault.backgroundColor).toBe('transparent');
  });

  it('falls back to real hardcoded defaults when no theme is passed', () => {
    const style = resolveCheckboxStyle({}, 'md');
    expect(style.indicatorChecked.backgroundColor).toBe('#FFB800');
    expect(style.indicatorDefault.borderColor).toBe('#E5E5E5');
    expect(style.indicatorDefault.borderWidth).toBe('2px');
    expect(style.indicatorDefault.borderRadius).toBe('2px');
  });

  it('does not resolve any label typography — Checkbox.tsx renders its label as a bare, unstyled span', () => {
    const style = resolveCheckboxStyle(theme, 'md');
    expect(style).not.toHaveProperty('labelColor');
    expect(style).not.toHaveProperty('labelFontFamily');
    expect(style).not.toHaveProperty('labelFontSize');
    expect(style).not.toHaveProperty('labelLineHeight');
  });

  it("resolves the wrapper gap from the theme's shared spacing token, matching wrapper.default", () => {
    expect(resolveCheckboxStyle(theme, 'md').wrapperGap).toBe('10px');
  });

  it('falls back to the real spacing scale for wrapper gap when no theme is passed', () => {
    expect(resolveCheckboxStyle({}, 'md').wrapperGap).toBe('8px');
  });
});
