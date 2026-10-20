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

  it('has no host box and reports whether the content overflows the clamp', async () => {
    const box = document.createElement('div');
    box.style.width = '120px';
    const el = document.createElement('gd-truncate');
    Object.assign(el, { theme: defaultTheme, lines: 1 });
    el.textContent = 'A long line of content that cannot fit into one hundred and twenty pixels';
    box.append(el);
    document.body.append(box);
    await el.updateComplete;
    const content = el.shadowRoot!.querySelector<HTMLElement>('[part=content]')!;
    expect(getComputedStyle(el).display).toBe('contents');
    expect(content.getAttribute('data-testid')).toBe('Truncate');
    expect(getComputedStyle(content).boxSizing).toBe('border-box');
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(el.isTruncated).toBe(true);
    el.lines = 10;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(el.isTruncated).toBe(false);
    box.remove();
  });
});
