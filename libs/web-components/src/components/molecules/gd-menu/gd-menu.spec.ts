import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-menu';
import type { GdMenu } from './gd-menu';

let host: HTMLDivElement;
const settle = async (el: GdMenu) => el.updateComplete;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => host.remove());

function mount() {
  host.innerHTML =
    '<gd-menu><span slot="trigger">Actions</span><button slot="content" data-gd-menu-value="edit">Edit</button></gd-menu>';
  const menu = host.querySelector<GdMenu>('gd-menu')!;
  menu.theme = defaultTheme;
  return menu;
}

describe('gd-menu', () => {
  it('exposes the trigger and content slots through stable CSS parts', async () => {
    const menu = mount();
    await settle(menu);
    expect(menu.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="trigger"]')!.assignedNodes()).toHaveLength(1);
    expect(menu.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="content"]')!.assignedNodes()).toHaveLength(1);
    expect(menu.shadowRoot!.querySelector('[part="trigger"]')).not.toBeNull();
    expect(menu.shadowRoot!.querySelector('[part="content"]')).not.toBeNull();
  });

  it('resets native popover inset and margins through menu tokens before applying runtime geometry', async () => {
    const menu = mount();
    await settle(menu);
    const content = menu.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!;
    expect(content.style.inset).toBe('auto');
    expect(content.style.margin).toBe('0px');
    expect(content.style.width).toBe('fit-content');
    expect(content.style.height).toBe('fit-content');
    expect(content.style.display).toBe('inline-block');
  });

  it('keeps the opened popover intrinsically sized and positioned beside its trigger with a slotted wrapper', async () => {
    host.innerHTML = `<gd-menu>
      <span slot="trigger">Actions</span>
      <div slot="content"><button data-gd-menu-value="edit">Edit</button><button data-gd-menu-value="archive">Archive</button></div>
    </gd-menu>`;
    const menu = host.querySelector<GdMenu>('gd-menu')!;
    menu.theme = defaultTheme;
    await settle(menu);
    menu.openMenu();
    await settle(menu);
    // Geometry is intentionally deferred until the native popover reports its open state, then
    // one layout frame later so slotted content has its final intrinsic size.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const trigger = menu.shadowRoot!.querySelector<HTMLElement>('[part="trigger"]')!.getBoundingClientRect();
    const content = menu.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!.getBoundingClientRect();

    expect(content.width).toBeLessThan(window.innerWidth);
    expect(content.height).toBeLessThan(window.innerHeight);
    expect(content.left).toBeCloseTo(trigger.right + menu.offsetX, 0);
    expect(content.top).toBeCloseTo(trigger.bottom + menu.offsetY, 0);
  });

  it('maps a composed selection event to an Option-shaped selectedValue and gd-change detail', async () => {
    const menu = mount();
    await settle(menu);
    menu.openMenu();
    await settle(menu);
    const changed = new Promise<CustomEvent<{ data: { name: string; value: string }; value: string }>>((resolve) =>
      menu.addEventListener(
        'gd-change',
        (event) => resolve(event as CustomEvent<{ data: { name: string; value: string }; value: string }>),
        { once: true }
      )
    );
    menu.querySelector('button')!.dispatchEvent(
      new CustomEvent('gd-menu-select', {
        bubbles: true,
        composed: true,
        detail: { data: { name: 'Edit', value: 'edit' } },
      })
    );
    expect((await changed).detail).toEqual({ data: { name: 'Edit', value: 'edit' }, value: 'edit' });
    expect(menu.selectedValue).toEqual({ name: 'Edit', value: 'edit' });
    expect(menu.open).toBe(false);
  });

  it('closes after a trusted click on the DropdownItem shape used by the React Storybook example', async () => {
    host.innerHTML = `<gd-menu>
      <span slot="trigger">Actions</span>
      <div slot="content"><div data-testid="DropdownItem" tabindex="0"><span>Profile</span></div></div>
    </gd-menu>`;
    const menu = host.querySelector<GdMenu>('gd-menu')!;
    menu.theme = defaultTheme;
    await settle(menu);
    const item = menu.querySelector('[data-testid="DropdownItem"] span')!;
    const changed = new Promise<CustomEvent<{ data: { name?: string; value: string }; value: string }>>((resolve) =>
      menu.addEventListener(
        'gd-change',
        (event) => resolve(event as CustomEvent<{ data: { name?: string; value: string }; value: string }>),
        { once: true }
      )
    );
    let changeCount = 0;
    menu.addEventListener('gd-change', () => changeCount++);

    menu.openMenu();
    await settle(menu);
    await userEvent.click(item);

    expect((await changed).detail).toEqual({ data: { name: 'Profile', value: 'Profile' }, value: 'Profile' });
    expect(changeCount).toBe(1);
    expect(menu.selectedValue).toEqual({ name: 'Profile', value: 'Profile' });
    expect(menu.open).toBe(false);
  });

  it('keeps the React Storybook DropdownItem shape open when closeOnSelect is false', async () => {
    host.innerHTML = `<gd-menu>
      <span slot="trigger">Actions</span>
      <div slot="content"><div data-testid="DropdownItem" tabindex="0">Profile</div></div>
    </gd-menu>`;
    const menu = host.querySelector<GdMenu>('gd-menu')!;
    menu.theme = defaultTheme;
    // Boolean false must be set as a property, not as `close-on-select="false"`
    // (whose attribute presence is truthy).
    menu.closeOnSelect = false;
    await settle(menu);

    menu.openMenu();
    await settle(menu);
    await userEvent.click(menu.querySelector('[data-testid="DropdownItem"]')!);

    expect(menu.selectedValue).toEqual({ name: 'Profile', value: 'Profile' });
    expect(menu.open).toBe(true);
  });

  it('keeps the menu open without selection when non-item popover space is clicked', async () => {
    host.innerHTML = `<gd-menu>
      <span slot="trigger">Actions</span>
      <div slot="content"><div data-testid="menu-padding">Empty menu space</div></div>
    </gd-menu>`;
    const menu = host.querySelector<GdMenu>('gd-menu')!;
    menu.theme = defaultTheme;
    let changeCount = 0;
    menu.addEventListener('gd-change', () => changeCount++);
    await settle(menu);

    menu.openMenu();
    await settle(menu);
    await userEvent.click(menu.querySelector('[data-testid="menu-padding"]')!);

    expect(changeCount).toBe(0);
    expect(menu.selectedValue).toBeUndefined();
    expect(menu.open).toBe(true);
  });
});
