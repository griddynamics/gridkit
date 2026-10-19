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

  it('renders the bare textarea without a wrapper and shows the default value as its text', async () => {
    const el = document.createElement('gd-textarea');
    Object.assign(el, { theme: defaultTheme, defaultValue: 'Initial', placeholder: 'Type' });
    document.body.append(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    expect(el.shadowRoot!.querySelector('[part=wrapper]')).toBeNull();
    expect(input.value).toBe('Initial');
    expect(input.textContent).toBe('Initial');
    // The host adds no box; the native control carries the resolved tokens and the document reset.
    expect(getComputedStyle(el).display).toBe('contents');
    el.style.fontFamily = 'Georgia';
    expect(getComputedStyle(input).fontFamily).toContain('Georgia');
    expect(getComputedStyle(input).borderTopWidth).toBe('1px');
    expect(getComputedStyle(input).width).not.toBe('0px');
    el.remove();
  });
  it('does not seed the text child for a controlled value and follows value writes', async () => {
    const el = document.createElement('gd-textarea');
    Object.assign(el, { theme: defaultTheme, value: 'Controlled' });
    document.body.append(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    expect(input.value).toBe('Controlled');
    expect(input.textContent).toBe('');
    el.value = '';
    await el.updateComplete;
    expect(input.value).toBe('');
    el.remove();
  });
  it('turns the character counter into the error state when the limit is exceeded', async () => {
    const el = document.createElement('gd-textarea');
    Object.assign(el, { theme: defaultTheme, maxCharacters: 3, defaultValue: 'abcd' });
    document.body.append(el);
    await el.updateComplete;
    const counter = el.shadowRoot!.querySelector<HTMLElement>('[part=counter]')!;
    expect(counter.textContent).toBe('4/3');
    expect(getComputedStyle(counter).color).not.toBe(
      getComputedStyle(el.shadowRoot!.querySelector('[part=wrapper]')!).color
    );
    el.remove();
  });
});
