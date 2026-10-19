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

  it('applies Box style properties like the source component, with `styles` last', async () => {
    const element = document.createElement('gd-box');
    element.theme = defaultTheme;
    Object.assign(element, { padding: '20px', width: '300px', gap: '10px', styles: { width: '320px' } });
    document.body.append(element);
    await element.updateComplete;
    const style = getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!);
    expect(style.paddingTop).toBe('20px');
    expect(style.gap).toBe('10px');
    expect(style.width).toBe('320px');
    expect(style.boxSizing).toBe('border-box');
    element.remove();
  });

  it('keeps the root focusable by default (tabIndex 0) and lets the host stay transparent', async () => {
    const element = document.createElement('gd-box');
    element.theme = defaultTheme;
    document.body.append(element);
    await element.updateComplete;
    const root = element.shadowRoot!.querySelector<HTMLElement>('[part="root"]')!;
    expect(root.tabIndex).toBe(0);
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(getComputedStyle(element).display).toBe('contents');
    element.tabIndex = -1;
    await element.updateComplete;
    expect(root.tabIndex).toBe(-1);
    element.remove();
  });
});
