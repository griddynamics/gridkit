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
});
