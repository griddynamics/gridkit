import { describe, expect, it } from 'vitest';
import { resolveInputStyle } from './input';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  font: {
    family: 'Fira Sans',
    size: { p: '16px', small: '15px', caption: '13px' },
    line: { height: { small: '21px', caption: '17px' } },
  },
  colors: {
    text: { default: '#171717', disabled: '#a3a3a3', success: '#0b6', primary: '#111111', error: '#e44' },
    border: { default: '#cccccc', success: '#0a5', primary: '#000000', error: '#d33' },
  },
  values: { borderThin: '1px' },
  spacing: { xs: '5px', sm: '9px' },
  zIndex: { first: 2 },
  radius: { none: '1px' },
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

  it("resolves gap/typography/zIndex/padding/radius from the theme's shared tokens", () => {
    const style = resolveInputStyle(theme);
    expect(style.wrapperGap).toBe('5px');
    expect(style.labelFontSize).toBe('15px');
    expect(style.labelLineHeight).toBe('21px');
    expect(style.helperFontSize).toBe('13px');
    expect(style.helperLineHeight).toBe('17px');
    expect(style.zIndex).toBe(2);
    expect(style.horizontalPadding).toBe('9px');
    expect(style.borderRadius).toBe('1px');
  });

  it('falls back to the real values for gap/typography/zIndex/padding/radius when no theme is passed', () => {
    const style = resolveInputStyle({});
    expect(style.wrapperGap).toBe('4px');
    expect(style.labelFontSize).toBe('14px');
    expect(style.labelLineHeight).toBe('20px');
    expect(style.helperFontSize).toBe('12px');
    expect(style.helperLineHeight).toBe('16px');
    expect(style.zIndex).toBe(1);
    expect(style.horizontalPadding).toBe('8px');
    expect(style.borderRadius).toBe('0px');
  });
});
