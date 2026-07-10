import { describe, expect, it } from 'vitest';
import { resolveInputStyle } from './input';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  font: { family: 'Fira Sans', size: { p: '16px' } },
  colors: {
    text: { default: '#171717', disabled: '#a3a3a3' },
    border: { default: '#cccccc', success: '#0a5', primary: '#000000', error: '#d33' },
  },
  values: { borderThin: '1px' },
};

describe('resolveInputStyle', () => {
  it('resolves the default color variant', () => {
    const style = resolveInputStyle(theme);
    expect(style.borderColor).toBe('#cccccc');
  });

  it.each([
    ['success', '#0a5'],
    ['primary', '#000000'],
    ['error', '#d33'],
  ] as const)('resolves the %s color variant border', (color, expected) => {
    expect(resolveInputStyle(theme, color).borderColor).toBe(expected);
  });

  it('resolves shared typography/border values regardless of color', () => {
    const style = resolveInputStyle(theme, 'error');
    expect(style.fontFamily).toBe('Fira Sans');
    expect(style.fontSize).toBe('16px');
    expect(style.borderWidth).toBe('1px');
    expect(style.color).toBe('#171717');
    expect(style.disabledColor).toBe('#a3a3a3');
  });
});
