import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-label';

describe('gd-label', () => {
  it('associates its native label with a light-DOM control', async () => {
    const input = document.createElement('input');
    input.id = 'field';
    document.body.append(input);
    const el = document.createElement('gd-label');
    el.htmlFor = 'field';
    el.textContent = 'Name';
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('label')!.htmlFor).toBe('field');
    el.remove();
    input.remove();
  });

  it('matches the React label root: flex box with the xs gap, border-box sizing and no host box', async () => {
    const el = document.createElement('gd-label');
    el.theme = defaultTheme;
    el.textContent = 'Name';
    document.body.append(el);
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('label')!;
    expect(getComputedStyle(el).display).toBe('contents');
    expect(getComputedStyle(label).display).toBe('flex');
    expect(getComputedStyle(label).boxSizing).toBe('border-box');
    expect(getComputedStyle(label).columnGap).toBe(defaultTheme.spacing.xs);
    expect(label.hasAttribute('for')).toBe(false);
    el.gap = '10px';
    el.ariaLabel = 'Accessible name';
    await el.updateComplete;
    expect(getComputedStyle(label).columnGap).toBe('10px');
    expect(label.getAttribute('aria-label')).toBe('Accessible name');
    el.remove();
  });
});
