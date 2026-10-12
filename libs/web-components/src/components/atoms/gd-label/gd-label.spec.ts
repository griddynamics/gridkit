import { describe, expect, it } from 'vitest';
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

  it('maps color and ariaLabel to the rendered label', async () => {
    const el = document.createElement('gd-label');
    el.color = '#123456';
    el.ariaLabel = 'Account name';
    document.body.append(el);
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('label')!;
    expect(label.style.color).toBe('rgb(18, 52, 86)');
    expect(label.getAttribute('aria-label')).toBe('Account name');
    el.remove();
  });
});
