import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-separator';

describe('gd-separator', () => {
  it('renders the source default and centered-label line inventory', async () => {
    const el = document.createElement('gd-separator');
    el.theme = defaultTheme;
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('[part="line"]')).toHaveLength(1);
    expect(el.shadowRoot!.querySelector('[part="separator"]')!.tagName).toBe('DIV');
    el.label = 'OR';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('[part="line"]')).toHaveLength(2);
    expect(el.shadowRoot!.querySelector('[part="label"]')!.textContent).toContain('OR');
    el.remove();
  });

  it('preserves vertical length, variants, and span polymorphism', async () => {
    const el = document.createElement('gd-separator');
    Object.assign(el, {
      theme: defaultTheme,
      orientation: 'vertical',
      length: '40px',
      variant: 'dashed',
      as: 'span',
      label: 'OR',
    });
    document.body.append(el);
    await el.updateComplete;
    const root = el.shadowRoot!.querySelector<HTMLElement>('[part="separator"]')!;
    const lines = el.shadowRoot!.querySelectorAll<HTMLElement>('[part="line"]');
    expect(root.tagName).toBe('SPAN');
    expect(lines).toHaveLength(2);
    expect([...lines].every((line) => line.tagName === 'SPAN')).toBe(true);
    expect(getComputedStyle(root).height).toBe('40px');
    expect(getComputedStyle(lines[0]).borderLeftStyle).toBe('dashed');
    el.remove();
  });
});
