import { describe, expect, it, vi } from 'vitest';
import './gd-input-file';

describe('gd-input-file', () => {
  it('maps selected files to a bubbling composed gd-change event', async () => {
    const el = document.createElement('gd-input-file');
    document.body.append(el);
    await el.updateComplete;
    Object.defineProperty(el.input, 'files', { value: [{ name: 'a.txt', size: 4, type: 'text/plain' }] });
    const listener = vi.fn();
    el.addEventListener('gd-change', listener);
    el.input.dispatchEvent(new Event('change'));
    expect(listener.mock.calls[0][0].detail).toEqual({ files: [{ name: 'a.txt', size: 4, type: 'text/plain' }] });
    el.remove();
  });

  it('names the native input after a text label and omits accept when unset', async () => {
    const el = document.createElement('gd-input-file');
    el.textContent = 'Pick a Photo';
    document.body.append(el);
    await el.updateComplete;
    expect(el.input.getAttribute('aria-label')).toBe('Pick a Photo');
    expect(el.input.hasAttribute('accept')).toBe(false);
    expect(getComputedStyle(el).display).toBe('contents');
    el.remove();
  });
  it('forwards buttonProps to the inner button after the explicit properties', async () => {
    const el = document.createElement('gd-input-file');
    el.buttonProps = { variant: 'text' };
    document.body.append(el);
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('gd-button')!;
    expect(button.variant).toBe('text');
    el.buttonProps = {};
    await el.updateComplete;
    expect(button.variant).toBe('outlined');
    el.remove();
  });
  it('emits gd-click only for the button and not when disabled', async () => {
    const el = document.createElement('gd-input-file');
    document.body.append(el);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener('gd-click', listener);
    el.shadowRoot!.querySelector('gd-button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(listener).toHaveBeenCalledTimes(1);
    el.disabled = true;
    await el.updateComplete;
    el.shadowRoot!.querySelector('gd-button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(listener).toHaveBeenCalledTimes(1);
    el.remove();
  });
});
