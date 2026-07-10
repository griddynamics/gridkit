import { describe, expect, it } from 'vitest';
import { resolveCheckboxStyle } from './checkbox';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  colors: { bg: { fill: { primary: '#000000' } }, border: { default: '#cccccc' }, text: { default: '#171717' } },
  values: { borderMedium: '2px' },
  radius: { xs: '2px' },
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
});
