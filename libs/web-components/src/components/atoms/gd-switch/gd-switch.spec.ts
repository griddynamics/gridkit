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
  it('generates no host box: the labelled wrapper is the component root', async () => {
    const el = document.createElement('gd-switch');
    Object.assign(el, { theme: defaultTheme });
    el.textContent = 'Label';
    document.body.append(el);
    await el.updateComplete;
    expect(getComputedStyle(el).display).toBe('contents');
    expect(getComputedStyle(el.shadowRoot!.querySelector('.wrapper')!).display).toBe('inline-flex');
    el.remove();
  });
  it('follows a value written back by the change listener (externally controlled state)', async () => {
    const el = document.createElement('gd-switch');
    Object.assign(el, { theme: defaultTheme, checked: false });
    // The element toggles itself first; the listener restores the controlled value.
    el.addEventListener('gd-change', () => {
      el.checked = false;
    });
    document.body.append(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    input.click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(input.checked).toBe(false);
    el.checked = true;
    await el.updateComplete;
    expect(input.checked).toBe(true);
    el.remove();
  });
});
