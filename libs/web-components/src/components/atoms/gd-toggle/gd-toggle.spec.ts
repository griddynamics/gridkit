import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-toggle';

describe('gd-toggle', () => {
  it('renders every item, selects values, and emits gd-change', async () => {
    const el = document.createElement('gd-toggle');
    Object.assign(el, { theme: defaultTheme, items: ['One', 'Two', 'Three'], value: 'One' });
    const fn = vi.fn();
    el.addEventListener('gd-change', fn);
    document.body.append(el);
    await el.updateComplete;
    const items = el.shadowRoot!.querySelectorAll('gd-button');
    expect(items).toHaveLength(3);
    (items[1] as HTMLElement).click();
    await el.updateComplete;
    expect(el.value).toBe('Two');
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'Two' } }));
    el.remove();
  });
});
