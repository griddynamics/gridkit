import { beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-select';
import type { GdSelect } from './gd-select';

const items = [
  { name: 'Alpha', value: 'a' },
  { name: 'Beta', value: 'b' },
  { name: 'Gamma', value: 'c' },
];

const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('gd-select', () => {
  let host: HTMLElement;
  beforeEach(() => {
    host = document.createElement('div');
    document.body.replaceChildren(host);
  });
  async function mount(props: Partial<GdSelect> = {}) {
    const el = document.createElement('gd-select');
    Object.assign(el, { theme: defaultTheme, items, ...props });
    host.append(el);
    await el.updateComplete;
    return el;
  }
  const options = (el: GdSelect) => el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]');
  const trigger = (el: GdSelect) => el.shadowRoot!.querySelector<HTMLElement>('.trigger')!;
  const triggerButton = (el: GdSelect) => trigger(el).shadowRoot!.querySelector<HTMLButtonElement>('button')!;
  const dropdown = (el: GdSelect) => el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
  const open = async (el: GdSelect) => {
    el.open();
    await el.updateComplete;
  };

  it('renders the component root without a host box and the trigger as a button', async () => {
    const el = await mount({ placeholder: 'Choose' });
    expect(getComputedStyle(el).display).toBe('contents');
    expect(trigger(el).localName).toBe('gd-button');
    expect(trigger(el).getAttribute('variant')).toBe('inherit');
    expect(trigger(el).textContent).toContain('Choose');
    expect(el.shadowRoot!.querySelector('.arrow gd-icon')!.getAttribute('name')).toBe('keyboardArrowDown');
    // Width, maximum width and minimum width land on the positioned root element.
    const root = el.shadowRoot!.querySelector('.select')!;
    expect(getComputedStyle(root).position).toBe('relative');
    el.width = '200px';
    el.minWidth = '100px';
    await el.updateComplete;
    expect(getComputedStyle(root).width).toBe('200px');
    expect(getComputedStyle(root).minWidth).toBe('100px');
  });

  it('only renders the dropdown content while it is open', async () => {
    const el = await mount();
    expect(options(el)).toHaveLength(0);
    await open(el);
    expect(options(el)).toHaveLength(3);
    el.close();
    await el.updateComplete;
    expect(options(el)).toHaveLength(0);
  });

  it('supports multiple values and item toggling', async () => {
    const el = await mount({ multiple: true, value: [items[0]] });
    const changes: unknown[] = [];
    el.addEventListener('gd-change', (event) => changes.push((event as CustomEvent).detail.value));
    await open(el);
    options(el)[1].click();
    await el.updateComplete;
    expect(el.value).toEqual([items[0], items[1]]);
    expect(changes).toEqual([[items[0], items[1]]]);
    // Multiple selection keeps the dropdown open and joins the selected names in the trigger.
    expect(el.isOpen).toBe(true);
    expect(trigger(el).textContent).toContain('Alpha, Beta');
    options(el)[0].click();
    await el.updateComplete;
    expect(el.value).toEqual([items[1]]);
  });

  it('closes after a single selection and reports the chosen option with gd-select', async () => {
    const el = await mount();
    const selected: unknown[] = [];
    el.addEventListener('gd-select', (event) => selected.push((event as CustomEvent).detail));
    await open(el);
    options(el)[2].click();
    await el.updateComplete;
    expect(selected).toEqual([{ data: items[2], index: 2 }]);
    expect(el.value).toEqual(items[2]);
    expect(el.isOpen).toBe(false);
    expect(trigger(el).textContent).toContain('Gamma');
  });

  it('shows option names and uses the stringifier for the trigger and search only', async () => {
    const el = await mount({
      multiple: true,
      value: [items[0]],
      itemStringifier: (item) => `${item.name}!`,
    });
    await open(el);
    expect([...options(el)].map((item) => item.textContent?.trim())).toEqual(['Alpha', 'Beta', 'Gamma']);
    expect(trigger(el).textContent).toContain('Alpha!');
  });

  it('shows the placeholder for an empty selection and for a selected option without a value', async () => {
    const el = await mount({ value: { name: 'Reset', value: null }, placeholder: 'Pick' });
    expect(trigger(el).textContent).toContain('Pick');
  });

  it('filters searchable options with the configured stringifier', async () => {
    const el = await mount({ searchable: true, searchPlaceholder: 'Find' });
    await open(el);
    const search = el.shadowRoot!.querySelector<HTMLInputElement>('.search')!;
    expect(search.placeholder).toBe('Find');
    search.value = 'bet';
    search.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect([...options(el)].map((item) => item.textContent?.trim())).toEqual(['Beta']);
    el.close();
    await el.updateComplete;
    await open(el);
    expect(options(el)).toHaveLength(3);
  });

  it('matches autoOpen click semantics and defaults', async () => {
    const automatic = await mount();
    expect(automatic.autoOpen).toBe(true);
    triggerButton(automatic).click();
    expect(dropdown(automatic).matches(':popover-open')).toBe(true);
    triggerButton(automatic).click();
    expect(dropdown(automatic).matches(':popover-open')).toBe(false);

    const manual = await mount({ autoOpen: false });
    triggerButton(manual).click();
    expect(dropdown(manual).matches(':popover-open')).toBe(false);
    manual.open();
    expect(dropdown(manual).matches(':popover-open')).toBe(true);
    manual.toggle();
    expect(dropdown(manual).matches(':popover-open')).toBe(false);
  });

  it('lets a handler of gd-initiator-click replace the default toggle', async () => {
    const el = await mount();
    el.addEventListener('gd-initiator-click', (event) => event.preventDefault());
    triggerButton(el).click();
    expect(el.isOpen).toBe(false);
  });

  it('does not open while disabled', async () => {
    const el = await mount({ disabled: true });
    expect(triggerButton(el).disabled).toBe(true);
    el.open();
    expect(el.isOpen).toBe(false);
  });

  it('closes on Escape, on an outside click and on Tab, and focuses the trigger after Escape', async () => {
    const el = await mount();
    await open(el);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.isOpen).toBe(false);
    await open(el);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    expect(el.isOpen).toBe(false);
    await open(el);
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    document.dispatchEvent(tab);
    expect(el.isOpen).toBe(false);
    expect(tab.defaultPrevented).toBe(true);
    // A click inside the dropdown does not count as an outside click.
    await open(el);
    dropdown(el).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    expect(el.isOpen).toBe(true);
  });

  it('navigates the open dropdown with the arrow keys and selects with Enter', async () => {
    const el = await mount();
    triggerButton(el).focus();
    triggerButton(el).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true, cancelable: true })
    );
    await el.updateComplete;
    expect(el.isOpen).toBe(true);
    triggerButton(el).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true, cancelable: true })
    );
    expect(el.shadowRoot!.activeElement).toBe(options(el)[0]);
    options(el)[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true, cancelable: true })
    );
    expect(el.shadowRoot!.activeElement).toBe(options(el)[1]);
    options(el)[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true, cancelable: true })
    );
    expect(el.shadowRoot!.activeElement).toBe(options(el)[0]);
    options(el)[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true })
    );
    await el.updateComplete;
    expect(el.value).toEqual(items[0]);
    expect(el.isOpen).toBe(false);
    await nextFrame();
    // Single selection hands the focus back to the trigger.
    expect(trigger(el).shadowRoot!.activeElement).toBe(triggerButton(el));
  });

  it('marks the selected and active options and keeps disabled options inert', async () => {
    const el = await mount({
      value: items[1],
      activeIndex: 2,
      items: [...items, { name: 'Delta', value: 'd', disabled: true }],
    });
    await open(el);
    const list = options(el);
    expect(list[1].classList.contains('active')).toBe(true);
    expect(list[1].getAttribute('aria-selected')).toBe('true');
    expect(list[2].classList.contains('active')).toBe(true);
    expect(list[3].classList.contains('disabled')).toBe(true);
    expect(getComputedStyle(list[3]).pointerEvents).toBe('none');
    list[3].click();
    expect(el.value).toEqual(items[1]);
  });

  it('chooses an option programmatically', async () => {
    const el = await mount();
    const selected: unknown[] = [];
    el.addEventListener('gd-select', (event) => selected.push((event as CustomEvent).detail.data));
    el.selectOption({ name: 'Custom', value: { id: 1 } });
    await el.updateComplete;
    expect(el.selectedValue).toEqual({ name: 'Custom', value: { id: 1 } });
    expect(selected).toEqual([{ name: 'Custom', value: { id: 1 } }]);
  });

  it('reports open and close with events', async () => {
    const el = await mount();
    const log: string[] = [];
    el.addEventListener('gd-open', () => log.push('open'));
    el.addEventListener('gd-close', () => log.push('close'));
    await open(el);
    el.close();
    expect(log).toEqual(['open', 'close']);
  });

  it('supports placeholder, adornment, initiator, empty, and custom option extension points', async () => {
    const el = await mount({ items: [], placeholder: 'Choose', renderOption: ({ item }) => `Custom ${item.name}` });
    el.innerHTML =
      '<span slot="adornment-start">Start</span><span slot="adornment-end">End</span><span slot="empty">Nothing</span>';
    await nextFrame();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('slot[name="adornment-start"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('slot[name="adornment-end"]')).toBeTruthy();
    await open(el);
    expect(el.shadowRoot!.querySelector('slot[name="empty"]')).toBeTruthy();

    const custom = await mount({ renderOption: ({ item }) => `Custom ${item.name}` });
    await open(custom);
    expect(options(custom)[0].textContent?.trim()).toBe('Custom Alpha');

    const withInitiator = await mount();
    withInitiator.innerHTML = '<input slot="initiator" />';
    await nextFrame();
    await withInitiator.updateComplete;
    expect(withInitiator.shadowRoot!.querySelector('slot[name="initiator"]')).toBeTruthy();
    expect(withInitiator.shadowRoot!.querySelector('.trigger')).toBeNull();
  });

  it('flips the dropdown above the trigger when there is no room below', async () => {
    host.style.cssText = 'position: fixed; bottom: 0; left: 0; width: 300px';
    const el = await mount({ dropdownMaxHeight: '240px' });
    await open(el);
    const rect = dropdown(el).getBoundingClientRect();
    const anchor = el.shadowRoot!.querySelector('.initiator-wrapper')!.getBoundingClientRect();
    expect(rect.bottom).toBeLessThanOrEqual(anchor.top);
    host.removeAttribute('style');
  });
});
