import { beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-select';
import type { GdSelect } from './gd-select';

const items = [
  { name: 'Alpha', value: 'a' },
  { name: 'Beta', value: 'b' },
  { name: 'Gamma', value: 'c' },
];

describe('gd-select React parity', () => {
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
  it('supports multiple values and item toggling', async () => {
    const el = await mount({ multiple: true, value: [items[0]] });
    const changes: unknown[] = [];
    el.addEventListener('gd-change', (event) => changes.push((event as CustomEvent).detail.value));
    el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')[1].click();
    await el.updateComplete;
    expect(el.value).toEqual([items[0], items[1]]);
    expect(changes).toEqual([[items[0], items[1]]]);
  });
  it('uses the shared icon catalog for the trigger arrow', async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelector('gd-icon')?.getAttribute('name')).toBe('keyboardArrowDown');
  });
  it('filters searchable options with the configured stringifier', async () => {
    const el = await mount({ searchable: true, searchPlaceholder: 'Find' });
    const search = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="search"]')!;
    search.value = 'bet';
    search.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect([...el.shadowRoot!.querySelectorAll('[role="option"]')].map((item) => item.textContent?.trim())).toEqual([
      'Beta',
    ]);
  });
  it('matches React autoOpen click semantics and defaults', async () => {
    const automatic = await mount();
    expect(automatic.autoOpen).toBe(true);
    automatic.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.click();
    expect(automatic.shadowRoot!.querySelector('.dropdown')!.matches(':popover-open')).toBe(true);

    const manual = await mount({ autoOpen: false });
    manual.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.click();
    expect(manual.shadowRoot!.querySelector('.dropdown')!.matches(':popover-open')).toBe(false);
    manual.open();
    expect(manual.shadowRoot!.querySelector('.dropdown')!.matches(':popover-open')).toBe(true);
  });
  it('keeps the open dropdown anchored while a scroll ancestor moves the trigger', async () => {
    host.style.cssText = 'height:120px;overflow:auto;width:360px';
    const before = document.createElement('div');
    before.style.height = '160px';
    host.append(before);
    const el = await mount({ width: '300px' });
    const after = document.createElement('div');
    after.style.height = '300px';
    host.append(after);
    host.scrollTop = 100;
    el.open();
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector<HTMLElement>('.trigger')!;
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    const initialGap = dropdown.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;
    host.scrollTop += 24;
    host.dispatchEvent(new Event('scroll'));
    const movedGap = dropdown.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;

    expect(initialGap).toBeCloseTo(1, 0);
    expect(movedGap).toBeCloseTo(initialGap, 0);
    expect(dropdown.getBoundingClientRect().width).toBeCloseTo(trigger.getBoundingClientRect().width, 0);
    el.close();
    expect(document.body.style.overflow).toBe('');
  });
  it('matches React viewport placement and flips above when there is more room', async () => {
    const el = await mount({ width: '300px', dropdownMaxHeight: '240px' });
    el.style.cssText += ';position:fixed;bottom:8px;left:8px';
    el.open();
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector<HTMLElement>('.trigger')!;
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    expect(trigger.getBoundingClientRect().top - dropdown.getBoundingClientRect().bottom).toBeCloseTo(1, 0);
    expect(Number.parseFloat(dropdown.style.maxHeight)).toBeLessThanOrEqual(240);
  });
  it('supports the React keyboard path through opening, option navigation, and selection', async () => {
    const el = await mount();
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    const options = [...el.shadowRoot!.querySelectorAll<HTMLElement>('.option')];
    options[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(el.shadowRoot!.activeElement).toBe(options[1]);
    options[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    expect(el.value).toEqual(items[1]);
    expect(el.shadowRoot!.querySelector('.dropdown')!.matches(':popover-open')).toBe(false);
  });
  it('supports placeholder, adornment, initiator, empty, and custom option extension points', async () => {
    const el = await mount({ items: [], placeholder: 'Choose', renderOption: ({ item }) => `Custom ${item.name}` });
    el.innerHTML =
      '<span slot="adornment-start">Start</span><span slot="adornment-end">End</span><span slot="initiator">Initiator</span><span slot="empty">Nothing</span>';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('slot[name="adornment-start"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('slot[name="adornment-end"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('slot[name="initiator"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('slot[name="empty"]')).toBeTruthy();
  });
});
