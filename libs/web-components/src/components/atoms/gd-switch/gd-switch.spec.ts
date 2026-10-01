import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-switch';

describe('gd-switch', () => {
  it('toggles and emits checked detail', async () => {
    const el = document.createElement('gd-switch');
    Object.assign(el, { theme: defaultTheme });
    el.textContent = 'Notifications';
    const fn = vi.fn();
    el.addEventListener('gd-change', fn);
    document.body.append(el);
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLInputElement>('input')!.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: { checked: true } }));
    el.remove();
  });
  it('disables interaction and composes loader while loading', async () => {
    const el = document.createElement('gd-switch');
    Object.assign(el, { theme: defaultTheme, isLoading: true });
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
    expect(el.shadowRoot!.querySelector('gd-loader')).not.toBeNull();
    el.remove();
  });
});
