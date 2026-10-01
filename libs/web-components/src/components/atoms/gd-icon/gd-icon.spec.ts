import { describe, expect, it } from 'vitest';
import { iconCatalog } from 'gd-design-core';
import './gd-icon';

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
});
