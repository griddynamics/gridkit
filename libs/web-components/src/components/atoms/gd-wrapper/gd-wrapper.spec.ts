import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-wrapper';

describe('gd-wrapper', () => {
  it('renders variants, custom semantic tags, and slotted content', async () => {
    const el = document.createElement('gd-wrapper');
    Object.assign(el, { theme: defaultTheme, variant: 'section', as: 'section' });
    el.textContent = 'Hello World';
    document.body.append(el);
    await el.updateComplete;
    const root = el.shadowRoot!.querySelector<HTMLElement>('[part=wrapper]')!;
    expect(root.tagName).toBe('SECTION');
    expect(getComputedStyle(root).position).toBe('absolute');
    expect(el.textContent).toBe('Hello World');
    el.remove();
  });
});
