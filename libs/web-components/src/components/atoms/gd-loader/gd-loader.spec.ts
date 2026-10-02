import { describe, expect, it } from 'vitest';
import './gd-loader';

describe('gd-loader', () => {
  it('renders one circle or exactly three dots with status semantics', async () => {
    const el = document.createElement('gd-loader');
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('gd-wrapper')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('gd-wrapper')!.getAttribute('part')).toBe('wrapper');
    expect(el.shadowRoot!.querySelectorAll('.dot')).toHaveLength(0);
    el.name = 'dots';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.dot')).toHaveLength(3);
    expect(el.shadowRoot!.querySelector('[role="status"]')).not.toBeNull();
    el.variant = 'fullPage';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('gd-wrapper')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="wrapper"]')!.getAttribute('popover')).toBe('manual');
    el.remove();
  });
});
