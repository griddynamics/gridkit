import { describe, expect, it } from 'vitest';
import { resolveSelectStyle } from './select';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  font: { family: 'Fira Sans', size: { p: '16px' }, weight: { normal: 400 } },
  colors: {
    text: { default: '#171717' },
    bg: { surface: '#ffffff', fill: { hover: '#f5f5f5' } },
    border: { default: '#cccccc', primary: '#000000' },
  },
  values: { borderThin: '1px' },
};

describe('resolveSelectStyle', () => {
  it('resolves the primary color-variant border and surface values by default', () => {
    const style = resolveSelectStyle(theme);
    expect(style.borderColor).toBe('#cccccc');
    expect(style.surfaceColor).toBe('#ffffff');
    expect(style.hoverBackgroundColor).toBe('#f5f5f5');
  });

  it('resolves a non-default color variant border', () => {
    expect(resolveSelectStyle(theme, 'warning').borderColor).toBe('#000000');
  });

  it('resolves shared typography values', () => {
    const style = resolveSelectStyle(theme);
    expect(style.fontFamily).toBe('Fira Sans');
    expect(style.fontSize).toBe('16px');
    expect(style.fontWeight).toBe(400);
  });

  it('falls back to real hardcoded defaults when no theme is passed', () => {
    const style = resolveSelectStyle({}, 'success');
    expect(style.borderColor).toBe('#34A853');
    expect(style.surfaceColor).toBe('#FFFFFF');
    expect(style.hoverBackgroundColor).toBe('#FFF7E5');
    expect(style.boxShadow).toBe('0px 8px 15px 1px rgba(0, 0, 0, 0.20)');
  });
});
