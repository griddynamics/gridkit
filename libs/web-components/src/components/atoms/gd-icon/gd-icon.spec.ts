import { describe, expect, it } from 'vitest';
import { iconCatalog } from 'gd-design-core';
import './gd-icon';

describe('gd-icon', () => {
  it('uses a zero-line-height inline flex host so catalog SVGs align with adjacent text', async () => {
    const el = document.createElement('gd-icon');
    document.body.append(el);
    await el.updateComplete;
    expect(getComputedStyle(el).display).toBe('inline-flex');
    expect(getComputedStyle(el).lineHeight).toBe('0px');
    expect(getComputedStyle(el.shadowRoot!.querySelector('svg')!).display).toBe('block');
    el.remove();
  });

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
});
