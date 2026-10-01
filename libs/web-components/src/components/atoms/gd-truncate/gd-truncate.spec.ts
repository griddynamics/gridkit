import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-truncate';

describe('gd-truncate', () => {
  it('renders slotted content with the requested line clamp', async () => {
    const el = document.createElement('gd-truncate');
    Object.assign(el, { theme: defaultTheme, lines: 2 });
    el.textContent = 'A long line of content';
    document.body.append(el);
    await el.updateComplete;
    expect(getComputedStyle(el.shadowRoot!.querySelector<HTMLElement>('[part=content]')!).webkitLineClamp).toBe('2');
    expect(el.textContent).toContain('A long line');
    el.remove();
  });
});
