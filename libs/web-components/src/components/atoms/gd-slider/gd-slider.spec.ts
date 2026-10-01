import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-slider';

describe('gd-slider', () => {
  it('renders range semantics and emits clamped values', async () => {
    const el = document.createElement('gd-slider');
    Object.assign(el, { theme: defaultTheme, min: 10, max: 20, value: 15 });
    const listener = vi.fn();
    el.addEventListener('gd-change', listener);
    document.body.append(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.value).toBe('15');
    expect(input.getAttribute('aria-valuenow')).toBe('15');
    input.value = '20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 20 } }));
    el.remove();
  });
});
