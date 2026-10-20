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

  it('maps React input behavior and accessibility props to the inner native input', async () => {
    mount('<gd-input id="email" variant="email" readonly aria-required required></gd-input>');
    const el = host.querySelector<GdInput>('#email')!;
    el.width = '320px';
    el.inputmode = 'email';
    el.ariaDescribedBy = 'email-help';
    el.tabIndex = 2;
    await settle(el);
    const inner = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    expect(inner.type).toBe('email');
    expect(inner.readOnly).toBe(true);
    expect(inner.required).toBe(true);
    expect(inner.getAttribute('aria-required')).toBe('true');
    expect(inner.getAttribute('aria-describedby')).toBe('email-help');
    expect(inner.inputMode).toBe('email');
    expect(inner.tabIndex).toBe(2);
    expect(el.shadowRoot!.querySelector<HTMLElement>('[part="outer"]')!.style.width).toBe('320px');
  });

  describe('structure mirrors the source component', () => {
    it('renders a label wrapper with the helper elements, border and outline siblings', async () => {
      mount('<gd-input id="i" label="Label" helper-text="Helper"></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);
      const root = el.shadowRoot!;
      const outer = root.querySelector<HTMLElement>('[part="outer"]')!;
      expect(outer.localName).toBe('label');
      expect(getComputedStyle(outer).display).toBe('inline-flex');
      expect(getComputedStyle(outer).flexDirection).toBe('column');
      const field = root.querySelector('[part="row"]')!;
      const control = field.querySelector('input')!;
      expect(control.nextElementSibling!.className).toBe('Input__border');
      expect(control.nextElementSibling!.nextElementSibling!.className).toBe('Input__outline');
      expect(getComputedStyle(control).height).toBe('40px');
      expect(getComputedStyle(root.querySelector('.label')!).fontSize).toBe('14px');
      expect(getComputedStyle(root.querySelector('.helper')!).fontSize).toBe('12px');
    });

    it('supports a span wrapper and omits border and outline for checkbox and radio', async () => {
      mount('<gd-input id="i" wrapper-as="span" variant="checkbox"></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);
      const root = el.shadowRoot!;
      expect(root.querySelector('[part="outer"]')!.localName).toBe('span');
      expect(root.querySelector('[part="border"]')).toBeNull();
      expect(root.querySelector('[part="outline"]')).toBeNull();
      expect(getComputedStyle(root.querySelector('input')!).width).toBe('18px');
    });

    it('renders adornment wrappers only for slotted adornments', async () => {
      mount('<gd-input id="i"><span slot="adornment-start">@</span></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);
      expect(el.shadowRoot!.querySelector('[part="adornment-start"]')).not.toBeNull();
      expect(el.shadowRoot!.querySelector('[part="adornment-end"]')).toBeNull();
      el.insertAdjacentHTML('beforeend', '<span slot="adornment-end">.00</span>');
      await settle(el);
      expect(el.shadowRoot!.querySelector('[part="adornment-end"]')).not.toBeNull();
    });

    it('shows defaultValue until a value is supplied', async () => {
      mount('<gd-input id="i" default-value="initial"></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);
      expect(el.shadowRoot!.querySelector('input')!.value).toBe('initial');
    });

    it('unchecks other radios sharing a name across shadow roots', async () => {
      mount(
        '<gd-input id="a" variant="radio" name="g" value="1"></gd-input><gd-input id="b" variant="radio" name="g" value="2"></gd-input>'
      );
      const a = host.querySelector<GdInput>('#a')!;
      const b = host.querySelector<GdInput>('#b')!;
      await settle(a);
      await settle(b);
      a.shadowRoot!.querySelector('input')!.click();
      await settle(a);
      expect(a.checked).toBe(true);
      b.shadowRoot!.querySelector('input')!.click();
      await settle(b);
      await settle(a);
      expect(b.checked).toBe(true);
      expect(a.checked).toBe(false);
      expect(a.shadowRoot!.querySelector('input')!.checked).toBe(false);
    });

    it('links aria-describedby to the helper text rendered inside the shadow root', async () => {
      mount('<gd-input id="i" helper-text="Error message" aria-describedby="error-id"></gd-input>');
      const el = host.querySelector<GdInput>('#i')!;
      await settle(el);
      const root = el.shadowRoot!;
      expect(root.querySelector('input')!.getAttribute('aria-describedby')).toBe('error-id');
      expect(root.querySelector('.helper')!.id).toBe('error-id');
    });
  });
});
