import { describe, expect, it, vi } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-counter';
import type { GdCounter } from './gd-counter';

const mount = async (props: Partial<GdCounter> = {}) => {
  const el = document.createElement('gd-counter');
  Object.assign(el, { theme: defaultTheme }, props);
  document.body.append(el);
  await el.updateComplete;
  const gdInput = el.shadowRoot!.querySelector('gd-input')!;
  await gdInput.updateComplete;
  return { el, input: gdInput.shadowRoot!.querySelector('input')! };
};

describe('gd-counter', () => {
  it('has no upper bound unless one is set, like the source component', async () => {
    const { el, input } = await mount();
    expect(el.max).toBe(Infinity);
    expect(input.hasAttribute('aria-valuemax')).toBe(false);
    el.remove();
  });

  it('increments and decrements within the bounds and reports every value', async () => {
    const { el } = await mount({ min: 1, max: 3, initial: 2 });
    const listener = vi.fn();
    el.addEventListener('gd-change', listener);
    const click = async (part: string) => {
      el.shadowRoot!.querySelector<HTMLElement>(`[part="${part}"]`)!.click();
      await el.updateComplete;
    };
    await click('increment');
    await click('increment');
    await click('decrement');
    expect(listener.mock.calls.map(([event]) => (event as CustomEvent).detail.value)).toEqual([3, 2]);
    el.remove();
  });

  it('puts the committed value back when the input is emptied and loses focus', async () => {
    const { el, input } = await mount({ initial: 25 });
    input.focus();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.blur();
    await el.updateComplete;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    expect(input.value).toBe('25');
    el.remove();
  });

  it('clamps a typed value into the bounds on blur', async () => {
    const { el, input } = await mount({ min: 2, max: 10, initial: 5 });
    input.focus();
    input.value = '50';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.blur();
    await el.updateComplete;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    expect(input.value).toBe('10');
    el.remove();
  });
});
