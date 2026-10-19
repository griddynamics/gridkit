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

  it('matches the React defaults: opens in a new context and exposes the link role and tab stop', async () => {
    const el = document.createElement('gd-link');
    el.href = '/target';
    document.body.append(el);
    await el.updateComplete;
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('tabindex')).toBe('0');
    expect(link.hasAttribute('aria-disabled')).toBe(false);
    expect(link.hasAttribute('rel')).toBe(false);
    el.target = '_self';
    await el.updateComplete;
    expect(link.getAttribute('target')).toBe('_self');
    el.remove();
  });

  it('forwards the accessible label to the anchor and does not add a box for the host', async () => {
    const el = document.createElement('gd-link');
    el.ariaLabel = 'Navigate somewhere';
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('aria-label')).toBe('Navigate somewhere');
    expect(el.hasAttribute('aria-label')).toBe(false);
    expect(getComputedStyle(el).display).toBe('contents');
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
    expect(link.getAttribute('tabindex')).toBe('-1');
    el.remove();
  });
});
