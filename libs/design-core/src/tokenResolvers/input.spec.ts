import { describe, expect, it } from 'vitest';
import { resolveInputStyle } from './input';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  font: { family: 'Fira Sans', size: { p: '16px' } },
  colors: {
    text: { default: '#171717', disabled: '#a3a3a3', success: '#0b6', primary: '#111111', error: '#e44' },
    border: { default: '#cccccc', success: '#0a5', primary: '#000000', error: '#d33' },
  },
  values: { borderThin: '1px' },
};

describe('resolveInputStyle', () => {
  it('resolves the primary color variant by default', () => {
    const style = resolveInputStyle(theme);
    expect(style.borderColor).toBe('#cccccc');
  });

  it.each([
    ['success', '#0a5'],
    ['warning', '#000000'],
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

  it.each([
    ['primary', '#E5E5E5'],
    ['success', '#34A853'],
    ['warning', '#FFB800'],
    ['error', '#D21C1C'],
  ] as const)(
    'falls back to the real %s border color when no theme is passed, not one flat gray',
    (color, expected) => {
      expect(resolveInputStyle({}, color).borderColor).toBe(expected);
    }
  );

  it("resolves the label color from the theme's colors.text.default, regardless of color variant", () => {
    expect(resolveInputStyle(theme, 'error').labelColor).toBe('#171717');
    expect(resolveInputStyle(theme, 'success').labelColor).toBe('#171717');
  });

  it.each([
    ['primary', '#171717'],
    ['success', '#0b6'],
    ['warning', '#111111'],
    ['error', '#e44'],
  ] as const)('resolves the %s helper-text color from theme', (color, expected) => {
    expect(resolveInputStyle(theme, color).helperTextColor).toBe(expected);
  });

  it.each([
    ['primary', '#000000'],
    ['success', '#1F843A'],
    ['warning', '#FFB800'],
    ['error', '#BD1919'],
  ] as const)('falls back to the real %s helper-text color when no theme is passed', (color, expected) => {
    expect(resolveInputStyle({}, color).helperTextColor).toBe(expected);
  });

  it('falls back to the real label color when no theme is passed', () => {
    expect(resolveInputStyle({}).labelColor).toBe('#000000');
  });
});
