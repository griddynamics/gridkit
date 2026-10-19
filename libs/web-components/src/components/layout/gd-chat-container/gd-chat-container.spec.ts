import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-chat-container';

function slotted(name: string, text: string) {
  const node = document.createElement('span');
  node.slot = name;
  node.textContent = text;
  return node;
}

async function fixture(open = false) {
  const element = document.createElement('gd-chat-container');
  Object.assign(element, { theme: defaultTheme, isOpen: open });
  element.append(
    slotted('sidebar-header', 'History'),
    slotted('sidebar', 'Conversation'),
    slotted('sidebar-minified', 'Compact'),
    slotted('header', 'Assistant'),
    document.createTextNode('Messages')
  );
  document.body.append(element);
  await element.updateComplete;
  return element;
}

describe('gd-chat-container', () => {
  it('maps React content props to dedicated native slots and semantic regions', async () => {
    const element = await fixture(true);

    expect(element.shadowRoot?.querySelector('aside[aria-label="Sidebar content"]')).not.toBeNull();
    expect(element.shadowRoot?.querySelector('header[part="sidebar-header"]')).not.toBeNull();
    expect(element.shadowRoot?.querySelector('header[part="main-header"]')).not.toBeNull();
    expect(element.shadowRoot?.querySelector('main[part="content"]')).not.toBeNull();
    expect(element.shadowRoot?.querySelector('slot[name="sidebar"]')).not.toBeNull();
    expect(element.shadowRoot?.querySelector('slot:not([name])')).not.toBeNull();
    element.remove();
  });

  it('opens, closes, and toggles through the imperative element API', async () => {
    const element = await fixture();
    expect(element.isOpen).toBe(false);

    element.open();
    await element.updateComplete;
    expect(element.isOpen).toBe(true);
    await vi.waitFor(() =>
      expect(getComputedStyle(element.shadowRoot!.querySelector('[part="sidebar-wrapper"]')!).opacity).toBe('1')
    );

    element.close();
    await element.updateComplete;
    expect(element.isOpen).toBe(false);
    await vi.waitFor(() =>
      expect(getComputedStyle(element.shadowRoot!.querySelector('[part="sidebar-wrapper"]')!).opacity).toBe('0')
    );

    element.toggle();
    await element.updateComplete;
    expect(element.isOpen).toBe(true);
    element.remove();
  });

  it('emits one typed bubbling and composed event for user-equivalent toggles', async () => {
    const element = await fixture();
    const listener = vi.fn();
    document.body.addEventListener('gd-toggle-sidebar', listener, { once: true });

    element.toggle();
    await element.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ open: true });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    element.remove();
  });

  it('uses migrated Button and Icon elements for both toggle controls', async () => {
    const element = await fixture();
    const openButton = element.shadowRoot?.querySelector('gd-button[aria-label="Toggle sidebar - open"]');
    expect(openButton?.querySelector('gd-icon')?.getAttribute('name')).toBe('arrowRight');

    element.open();
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector('gd-button[aria-label="Toggle sidebar - close"]');
    expect(closeButton?.querySelector('gd-icon')?.getAttribute('name')).toBe('arrowRight');
    element.remove();
  });

  it('respects control visibility and reacts to late slot insertion', async () => {
    const element = document.createElement('gd-chat-container');
    Object.assign(element, {
      theme: defaultTheme,
      showSidebarAsideControl: false,
      showSidebarHeaderControl: false,
    });
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[part="main-header"]')).toBeNull();

    element.append(slotted('header', 'Late header'), slotted('sidebar-header', 'Late sidebar header'));
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[part="main-header"]')).not.toBeNull();
    expect(element.shadowRoot?.querySelector('gd-button')).toBeNull();
    element.remove();
  });

  it('applies Box styles first and custom styles last on the public host', async () => {
    const element = document.createElement('gd-chat-container');
    Object.assign(element, {
      theme: defaultTheme,
      width: 500,
      styles: { width: 320, minHeight: 240 },
    });
    document.body.append(element);
    await element.updateComplete;

    expect(getComputedStyle(element).width).toBe('320px');
    expect(getComputedStyle(element).minHeight).toBe('240px');
    element.remove();
  });
});
