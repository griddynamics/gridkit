import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-badge';
import '../gd-icon/gd-icon';

describe('gd-badge', () => {
  it('resolves variant, appearance, size, disabled state, and icon slots from Badge tokens', async () => {
    const element = document.createElement('gd-badge');
    element.theme = defaultTheme;
    element.variant = 'secondary';
    element.appearance = 'outline';
    element.size = 'lg';
    element.disabled = true;
    element.innerHTML = '<gd-icon slot="icon-start" name="warning" size="md"></gd-icon>Warning';
    document.body.append(element);
    await element.updateComplete;
    const root = element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!;
    expect(root.style.height).toBe('38px');
    expect(root.style.border).not.toBe('');
    expect(root.style.opacity).toBe('0.7');
    expect(root.getAttribute('aria-disabled')).toBe('true');
    await element.updateComplete;
    const icon = element.querySelector('gd-icon')!;
    await icon.updateComplete;
    expect(icon.name).toBe('warning');
    expect(element.shadowRoot!.querySelector('[part="icon-start"]')).not.toBeNull();
    const iconRect = icon.getBoundingClientRect();
    const contentRect = element.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.getBoundingClientRect();
    expect(Math.abs(iconRect.top + iconRect.height / 2 - (contentRect.top + contentRect.height / 2))).toBeLessThan(1);
    element.remove();
  });

  it('does not render empty icon wrappers that add flex gaps', async () => {
    const element = document.createElement('gd-badge');
    element.theme = defaultTheme;
    element.textContent = 'Plain';
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[part="icon-start"]')).toBeNull();
    expect(element.shadowRoot!.querySelector('[part="icon-end"]')).toBeNull();
    element.remove();
  });
});
