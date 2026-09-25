import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-input';
import type { GdInput } from './gd-input';

let host: HTMLDivElement;

function mount(markup: string): void {
  host.innerHTML = markup;
  host.querySelectorAll<HTMLElement & { theme?: unknown }>('gd-input').forEach((el) => {
    el.theme = defaultTheme;
  });
}

const settle = async (el: Element) => {
  await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  await new Promise((r) => setTimeout(r, 20));
};

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});

afterEach(() => {
  host.remove();
});

describe('gd-input', () => {
  it('renders label and helper text with the same resolved font family as the input', async () => {
    mount('<gd-input id="i" label="Email" helper-text="Required"></gd-input>');
    const el = host.querySelector<GdInput>('#i')!;
    await settle(el);

    const root = el.shadowRoot!;
    const fontOf = (sel: string) => getComputedStyle(root.querySelector(sel)!).fontFamily;
    // FINDINGS.md §10: label/helper previously relied on ambient inheritance and could silently
    // diverge from the input beside them.
    expect(fontOf('.label')).toBe(fontOf('input'));
    expect(fontOf('.helper')).toBe(fontOf('input'));
    expect(fontOf('input')).toContain('Fira Sans');
  });

  it('exposes input/label/border as CSS parts (CTORNDSD-646b)', async () => {
    mount('<gd-input id="i" label="Email"></gd-input>');
    const el = host.querySelector<GdInput>('#i')!;
    await settle(el);

    const parts = Array.from(el.shadowRoot!.querySelectorAll('[part]')).map((n) => n.getAttribute('part'));
    expect(parts).toEqual(expect.arrayContaining(['input', 'label', 'border', 'outline', 'row', 'outer']));
  });

  /**
   * The named high-risk finding from `FINDINGS.md` §4, promoted from a manual harness probe.
   *
   * A controlled `value` over a custom-element boundary has no React-style reconciliation protecting
   * cursor position. The component guards it by dropping an external `value` write while the inner
   * input has focus. The trade-off is deliberate and asserted here so it cannot regress silently in
   * either direction: the cursor must not move, AND the dropped value must be reconciled on blur.
   */
  describe('cursor-stability guard (FINDINGS.md §4)', () => {
    it('drops an external value write while focused, preserving the caret', async () => {
      mount('<gd-input id="i"></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);

      const inner = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
      inner.focus();
      inner.value = 'Hello World';
      inner.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      await settle(el);
      inner.setSelectionRange(11, 11);

      // A stale external write lands mid-typing — exactly the server-echo scenario.
      el.value = 'STALE';
      await settle(el);

      expect(inner.value).toBe('Hello World');
      expect(inner.selectionStart).toBe(11);
      expect(el.shadowRoot!.activeElement).toBe(inner);
    });

    it('reconciles the dropped external value on blur', async () => {
      mount('<gd-input id="i"></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);

      const inner = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
      inner.focus();
      inner.value = 'typed';
      inner.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      await settle(el);

      el.value = 'external';
      await settle(el);
      expect(inner.value).toBe('typed'); // still guarded

      inner.blur();
      await settle(el);
      expect(inner.value).toBe('external'); // reconciled
    });
  });

  it('emits gd-input with the typed value in detail', async () => {
    mount('<gd-input id="i"></gd-input>');
    const el = host.querySelector<GdInput>('#i')!;
    await settle(el);

    const seen: string[] = [];
    el.addEventListener('gd-input', (e) => seen.push((e as CustomEvent<{ value: string }>).detail.value));

    const inner = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    inner.value = 'abc';
    inner.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await settle(el);

    expect(seen).toEqual(['abc']);
  });

  describe('form participation (CTORNDSD-646b)', () => {
    it('joins the form, submits under name, and reports valueMissing when required and empty', async () => {
      mount('<form id="f"><gd-input id="i" name="email" required></gd-input></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);

      expect(Array.from(form.elements)).toContain(el);
      expect(el.form).toBe(form);
      expect(el.validity.valueMissing).toBe(true);
      expect(form.checkValidity()).toBe(false);
      expect(el.matches(':invalid')).toBe(true);

      el.value = 'user@example.com';
      await settle(el);

      expect(new FormData(form).get('email')).toBe('user@example.com');
      expect(form.checkValidity()).toBe(true);
      expect(el.matches(':valid')).toBe(true);
    });

    it('clears back to its captured default on form.reset()', async () => {
      mount('<form id="f"><gd-input id="i" name="email" required></gd-input></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);

      el.value = 'typed@example.com';
      await settle(el);

      form.reset();
      await settle(el);

      expect(el.value).toBe('');
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).toBe('');
      expect(el.validity.valueMissing).toBe(true);
    });

    it('is disabled by an ancestor <fieldset disabled>', async () => {
      mount('<form id="f"><fieldset disabled><gd-input id="i" name="x"></gd-input></fieldset></form>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);

      expect(el.disabled).toBe(true);
    });
  });
});
