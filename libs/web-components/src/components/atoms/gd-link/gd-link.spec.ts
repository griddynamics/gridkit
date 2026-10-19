import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-link';

describe('gd-link', () => {
  it('draws the underline once (token border), not also the UA text-decoration of an a[href]', async () => {
    const el = document.createElement('gd-link');
    el.theme = defaultTheme;
    el.href = '/target';
    document.body.append(el);
    await el.updateComplete;
    const link = el.shadowRoot!.querySelector('a')!;
    expect(getComputedStyle(link).textDecorationLine).toBe('none');
    expect(getComputedStyle(link, '::after').borderBottomWidth).toBe('1px');
    el.remove();
  });

  it('matches the React default by omitting target until one is provided', async () => {
    const el = document.createElement('gd-link');
    el.href = '/target';
    document.body.append(el);
    await el.updateComplete;
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.hasAttribute('target')).toBe(false);
    el.target = '_blank';
    await el.updateComplete;
    expect(link.getAttribute('target')).toBe('_blank');
    el.remove();
  });

  it('removes href and exposes disabled semantics when disabled', async () => {
    const el = document.createElement('gd-link');
    el.href = '/target';
    el.disabled = true;
    document.body.append(el);
    await el.updateComplete;
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    el.remove();
  });
});
