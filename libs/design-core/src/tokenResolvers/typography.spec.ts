import { describe, expect, it } from 'vitest';
import { resolveTypographyStyle } from './typography';
import type { DesignCoreTheme } from '../types';

const theme: DesignCoreTheme = {
  font: {
    family: 'Fira Sans',
    weight: { light: 300, normal: 400, medium: 500, bold: 700 },
    size: { h1: '48px', p: '16px', small: '12px' },
    line: { height: { h1: '56px', p: '24px', small: '16px' } },
  },
};

describe('resolveTypographyStyle', () => {
  it('resolves span as fully-inherited values', () => {
    const style = resolveTypographyStyle(theme, 'span');
    expect(style).toEqual({
      fontFamily: 'Fira Sans',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
    });
  });

  it('resolves h1 from the font scale', () => {
    const style = resolveTypographyStyle(theme, 'h1');
    expect(style.fontSize).toBe('48px');
    expect(style.lineHeight).toBe('56px');
    expect(style.fontWeight).toBe(400);
  });

  it('overlays a single styleVariant', () => {
    const style = resolveTypographyStyle(theme, 'p', 'bold');
    expect(style.fontWeight).toBe(700);
  });

  it('overlays multiple styleVariants in order', () => {
    const style = resolveTypographyStyle(theme, 'p', ['bold', 'uppercase', 'underline']);
    expect(style.fontWeight).toBe(700);
    expect(style.textTransform).toBe('uppercase');
    expect(style.textDecoration).toBe('underline');
  });

  it('the "small" styleVariant overrides fontSize independent of variant', () => {
    const style = resolveTypographyStyle(theme, 'h1', 'small');
    expect(style.fontSize).toBe('12px');
  });

  it('defaults to span when no variant is passed', () => {
    expect(resolveTypographyStyle(theme)).toEqual(resolveTypographyStyle(theme, 'span'));
  });
});
