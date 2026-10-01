import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-textarea';

describe('gd-textarea', () => {
  it('emits values and updates the character counter', async () => {
    const el = document.createElement('gd-textarea');
    Object.assign(el, { theme: defaultTheme, maxCharacters: 10 });
    const fn = vi.fn();
    el.addEventListener('gd-input', fn);
    document.body.append(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    input.value = 'Hello';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'Hello' } }));
    expect(el.shadowRoot!.querySelector('[part=counter]')!.textContent).toBe('5/10');
    el.remove();
  });
  it('forwards native disabled, readonly, dimensions, and resize behavior', async () => {
    const el = document.createElement('gd-textarea');
    Object.assign(el, {
      theme: defaultTheme,
      disabled: true,
      readOnly: true,
      rows: 3,
      minHeight: '80px',
      resize: 'both',
    });
    document.body.append(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.rows).toBe(3);
    expect(getComputedStyle(input).resize).toBe('both');
    el.remove();
  });
});
