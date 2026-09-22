import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-avatar';
import type { GdAvatar } from './gd-avatar';

let host: HTMLDivElement;
const settle = async (el: GdAvatar) => {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 20));
};

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => host.remove());

function mount(markup: string) {
  host.innerHTML = markup;
  const el = host.querySelector<GdAvatar>('gd-avatar')!;
  el.theme = defaultTheme;
  return el;
}

describe('gd-avatar', () => {
  it('resolves its real Avatar size and background tokens', async () => {
    const el = mount('<gd-avatar size="lg" fallback="GD"></gd-avatar>');
    await settle(el);
    const avatar = el.shadowRoot!.querySelector<HTMLElement>('[part="avatar"]')!;
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('[part="image-wrapper"]')!;
    expect(getComputedStyle(avatar).width).toBe('56px');
    expect(getComputedStyle(wrapper).backgroundColor).toBe('rgb(255, 184, 0)');
  });

  it('renders scalar and slotted fallback content when no image is available', async () => {
    const scalar = mount('<gd-avatar fallback="GD"></gd-avatar>');
    await settle(scalar);
    expect(scalar.shadowRoot!.querySelector('[part="fallback-text"]')!.textContent).toBe('GD');

    const slot = mount('<gd-avatar><span slot="fallback">Custom</span></gd-avatar>');
    await settle(slot);
    expect(slot.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="fallback"]')!.assignedNodes().length).toBe(1);
  });

  it('switches to fallback after the image fails and exposes stable CSS parts', async () => {
    const el = mount(
      '<gd-avatar src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="Ada" with-badge></gd-avatar>'
    );
    await settle(el);
    el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));
    await settle(el);
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="fallback"]')?.getAttribute('aria-label')).toBe('Ada');
    const parts = Array.from(el.shadowRoot!.querySelectorAll('[part]')).map((node) => node.getAttribute('part'));
    expect(parts).toEqual(expect.arrayContaining(['avatar', 'image-wrapper', 'fallback', 'badge']));
  });
});
