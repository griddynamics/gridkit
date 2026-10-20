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
  it('only renders icon wrappers for slotted icons so empty slots add no flex gap', async () => {
    const element = document.createElement('gd-badge');
    element.theme = defaultTheme;
    element.textContent = 'Plain';
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[part="icon-start"]')).toBeNull();
    expect(element.shadowRoot!.querySelector('[part="icon-end"]')).toBeNull();
    const root = element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!;
    // padding 0 + 8px each side + the text only: no gap tracks around the content.
    expect(root.getBoundingClientRect().width).toBe(
      element.shadowRoot!.querySelector('[part="content"]')!.getBoundingClientRect().width + 16
    );

    const end = document.createElement('span');
    end.slot = 'icon-end';
    end.textContent = '!';
    element.append(end);
    await new Promise((resolve) => setTimeout(resolve, 20));
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[part="icon-end"]')).not.toBeNull();
    expect(element.shadowRoot!.querySelector('[part="icon-start"]')).toBeNull();
    expect(getComputedStyle(element).display).toBe('contents');
    element.remove();
  });
});
