import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import { GdMenu } from '../../../../harness/GdMenuReact';
import type { GdMenu as GdMenuElement } from './gd-menu';

let host: HTMLDivElement;
let root: Root;

const settle = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  root.unmount();
  host.remove();
});

describe('GdMenu React adapter', () => {
  it('maps gd-change to onGdChange', async () => {
    const onGdChange = vi.fn();
    flushSync(() => {
      root.render(
        createElement(
          GdMenu,
          { theme: defaultTheme, onGdChange },
          createElement('span', { slot: 'trigger' }, 'Menu'),
          createElement(
            'div',
            { slot: 'content' },
            createElement(
              'div',
              { tabIndex: 0, 'data-gd-menu-name': 'Profile', 'data-gd-menu-value': 'profile' },
              'Profile'
            )
          )
        )
      );
    });
    await settle();

    const menu = host.querySelector<GdMenuElement>('gd-menu')!;
    menu.dispatchEvent(
      new CustomEvent('gd-change', {
        bubbles: true,
        composed: true,
        detail: { data: { name: 'Profile', value: 'profile' }, value: 'profile' },
      })
    );

    expect(onGdChange).toHaveBeenCalledTimes(1);
    expect(onGdChange.mock.calls[0][0].detail).toEqual({
      data: { name: 'Profile', value: 'profile' },
      value: 'profile',
    });
  });

  it('keeps a slotted React content wrapper intrinsically sized beside its trigger', async () => {
    host.style.marginTop = '600px';
    flushSync(() => {
      root.render(
        createElement(
          GdMenu,
          { theme: defaultTheme },
          createElement('span', { slot: 'trigger' }, 'Actions ▾'),
          createElement(
            'div',
            { slot: 'content' },
            createElement('button', { 'data-gd-menu-value': 'edit' }, 'Edit'),
            createElement('button', { 'data-gd-menu-value': 'archive' }, 'Archive')
          )
        )
      );
    });
    await settle();

    const menu = host.querySelector<GdMenuElement>('gd-menu')!;
    menu.openMenu();
    await settle();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const trigger = menu.shadowRoot!.querySelector<HTMLElement>('[part="trigger"]')!.getBoundingClientRect();
    const content = menu.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.getBoundingClientRect();

    expect(content.width).toBeLessThan(window.innerWidth);
    expect(content.left).toBeCloseTo(trigger.right + menu.offsetX, 0);
    expect(content.top).toBeCloseTo(trigger.bottom + menu.offsetY, 0);
  });
});
