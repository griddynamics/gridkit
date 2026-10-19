import { describe, expect, it } from 'vitest';
import { iconCatalog } from 'gd-design-library/icons';
import { registerCustomIcons } from './gd-icon';

describe('gd-icon', () => {
  it('renders every shared catalog icon', async () => {
    for (const name of Object.keys(iconCatalog)) {
      const el = document.createElement('gd-icon');
      el.name = name as keyof typeof iconCatalog;
      document.body.append(el);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('svg').length).toBe(1);
      el.remove();
    }
  });

  it('applies Box styles to the svg but treats width and height as the icon size', async () => {
    const el = document.createElement('gd-icon');
    Object.assign(el, { name: 'check', size: 'lg', padding: '3px', marginLeft: '4px' });
    document.body.append(el);
    await el.updateComplete;
    const svg = el.shadowRoot!.querySelector('svg')!;
    const style = getComputedStyle(svg);
    expect(style.paddingTop).toBe('3px');
    expect(style.marginLeft).toBe('4px');
    expect(style.display).toBe('block');
    expect(style.boxSizing).toBe('border-box');
    expect(svg.getAttribute('width')).toBe('24');
    expect(getComputedStyle(el).display).toBe('contents');
    el.size = undefined;
    el.width = 40;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('svg')!.getAttribute('width')).toBe('40');
    expect(getComputedStyle(el.shadowRoot!.querySelector('svg')!).width).toBe('40px');
    el.remove();
  });

  it('renders icons added with registerCustomIcons by name', async () => {
    registerCustomIcons({
      person: { viewBox: '0 0 24 24', body: '<path d="M12 12h2v2z" fill="var(--gd-icon-fill)"></path>' },
    });
    const el = document.createElement('gd-icon');
    el.name = 'person';
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('svg path')).toHaveLength(1);
    expect(el.shadowRoot!.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 24 24');
    el.remove();
  });
});
