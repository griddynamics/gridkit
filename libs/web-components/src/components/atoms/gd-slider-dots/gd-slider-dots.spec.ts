import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-slider-dots';

describe('gd-slider-dots', () => {
  it('renders accessible dots and reports selection', async () => {
    const el = document.createElement('gd-slider-dots');
    Object.assign(el, { theme: defaultTheme, count: 5 });
    const fn = vi.fn();
    el.addEventListener('gd-change', fn);
    document.body.append(el);
    await el.updateComplete;
    const dots = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[role=tab]');
    expect(dots).toHaveLength(5);
    dots[2].click();
    await el.updateComplete;
    expect(el.activeIndex).toBe(2);
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: { index: 2 } }));
    el.remove();
  });
});
