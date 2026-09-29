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
