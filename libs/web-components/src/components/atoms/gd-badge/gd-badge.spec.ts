import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-badge';

describe('gd-badge', () => {
  it('resolves variant, appearance, size, disabled state, and icon slots from Badge tokens', async () => {
    const element = document.createElement('gd-badge');
    element.theme = defaultTheme;
    element.variant = 'secondary';
    element.appearance = 'outline';
    element.size = 'lg';
    element.disabled = true;
    element.innerHTML = '<span slot="icon-start">!</span>Warning';
    document.body.append(element);
    await element.updateComplete;
    const root = element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!;
    expect(root.style.height).toBe('38px');
    expect(root.style.border).not.toBe('');
    expect(root.style.opacity).toBe('0.7');
    expect(root.getAttribute('aria-disabled')).toBe('true');
    expect(element.querySelector('[slot="icon-start"]')?.textContent).toBe('!');
    element.remove();
  });
});
