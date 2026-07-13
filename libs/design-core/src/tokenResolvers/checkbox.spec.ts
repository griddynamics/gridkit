import { describe, expect, it } from 'vitest';
import { resolveCheckboxStyle } from './checkbox';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  colors: { bg: { fill: { primary: '#000000' } }, border: { default: '#cccccc' }, text: { default: '#171717' } },
  values: { borderMedium: '2px' },
  radius: { xs: '2px' },
  font: { family: 'Fira Sans', size: { small: '14px' }, line: { height: { small: '20px' } } },
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

  it('resolves the label typography from theme', () => {
    const style = resolveCheckboxStyle(theme, 'md');
    expect(style.labelFontFamily).toBe('Fira Sans');
    expect(style.labelFontSize).toBe('14px');
    expect(style.labelLineHeight).toBe('20px');
  });

  it('falls back to real hardcoded defaults when no theme is passed', () => {
    const style = resolveCheckboxStyle({}, 'md');
    expect(style.indicatorChecked.backgroundColor).toBe('#FFB800');
    expect(style.indicatorDefault.borderColor).toBe('#E5E5E5');
    expect(style.indicatorDefault.borderWidth).toBe('2px');
    expect(style.indicatorDefault.borderRadius).toBe('2px');
    expect(style.labelColor).toBe('#000000');
    expect(style.labelFontFamily).toBe('"Fira Sans", sans-serif');
    expect(style.labelFontSize).toBe('14px');
    expect(style.labelLineHeight).toBe('20px');
  });
});
