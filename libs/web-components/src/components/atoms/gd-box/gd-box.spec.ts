import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-box';

describe('gd-box', () => {
  it('renders slotted content with the selected layout and public part', async () => {
    const element = document.createElement('gd-box');
    element.theme = defaultTheme;
    element.variant = 'horizontal';
    element.isBordered = true;
    element.textContent = 'Content';
    document.body.append(element);
    await element.updateComplete;
    const root = element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!;
    expect(getComputedStyle(root).display).toBe('flex');
    expect(getComputedStyle(root).flexDirection).toBe('row');
    expect(getComputedStyle(root).borderStyle).not.toBe('');
    expect(element.textContent).toBe('Content');
    element.remove();
  });
});
