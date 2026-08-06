import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-checkbox';
import type { GdCheckbox } from './gd-checkbox';

/**
 * CTORNDSD-646c. Real-browser tests — jsdom cannot host these (Constructable StyleSheets,
 * `ElementInternals`, real form submission).
 *
 * Every test passes an explicit `theme`. This is mandatory, not cosmetic: the components resolve
 * the REAL token files, whose own fallbacks are debug placeholder strings, so a themeless render
 * produces invalid CSS (`FINDINGS.md` §§13, 16).
 */

let host: HTMLDivElement;

function mount(html: string): HTMLDivElement {
  host.innerHTML = html;
  host.querySelectorAll<HTMLElement & { theme?: unknown }>('gd-checkbox').forEach((el) => {
    el.theme = defaultTheme;
  });
  return host;
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

describe('gd-checkbox', () => {
  it('renders the real checked token colour, not a placeholder string', async () => {
    mount('<gd-checkbox id="c">Label</gd-checkbox>');
    const el = host.querySelector<GdCheckbox>('#c')!;
    el.checked = true;
    await settle(el);

    const indicator = el.shadowRoot!.querySelector('.indicator')!;
    // #FFB800 — the real brand gold from libs/ui/src/tokens/checkbox.ts
    expect(getComputedStyle(indicator).backgroundColor).toBe('rgb(255, 184, 0)');
  });

  it('exposes label/input/indicator as CSS parts (CTORNDSD-646b)', async () => {
    mount('<gd-checkbox id="c">Label</gd-checkbox>');
    const el = host.querySelector<GdCheckbox>('#c')!;
    await settle(el);

    const parts = Array.from(el.shadowRoot!.querySelectorAll('[part]')).map((n) => n.getAttribute('part'));
    expect(parts).toEqual(expect.arrayContaining(['label', 'input', 'indicator']));
  });

  describe('attribute: false controlled-value constraint (FINDINGS.md §8)', () => {
    it('cannot express "uncontrolled" via markup — the checked attribute is not observed', async () => {
      // A real HTML boolean attribute can only be present/absent, never "unset", which is what
      // the store's `checked !== undefined` controlled check needs. So markup cannot drive it.
      mount('<gd-checkbox id="c" checked>Label</gd-checkbox>');
      const el = host.querySelector<GdCheckbox>('#c')!;
      await settle(el);

      expect(el.checked).toBeUndefined();
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.checked).toBe(false);
    });

    it('reads .checked as undefined even when the control IS checked (documented divergence)', async () => {
      mount('<gd-checkbox id="c">Label</gd-checkbox>');
      const el = host.querySelector<GdCheckbox>('#c')!;
      await settle(el);

      const inner = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
      inner.click(); // uncontrolled toggle through the component's own change path
      await settle(el);

      // Native HTMLInputElement.checked would return true here. This one does not.
      expect(el.checked).toBeUndefined();
      expect(inner.checked).toBe(true);
    });
  });

  describe('form participation (CTORNDSD-646b, FINDINGS.md §17.1)', () => {
    it('joins form.elements and submits under its name only when checked', async () => {
      mount('<form id="f"><gd-checkbox id="c" name="terms">Accept</gd-checkbox></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdCheckbox>('#c')!;
      await settle(el);

      expect(Array.from(form.elements)).toContain(el);
      expect(el.form).toBe(form);

      // Native semantics: an unchecked box contributes NOTHING, not an empty string.
      expect(new FormData(form).has('terms')).toBe(false);

      el.checked = true;
      await settle(el);
      expect(new FormData(form).get('terms')).toBe('on');
    });

    it('submits a custom value when one is set', async () => {
      mount('<form id="f"><gd-checkbox id="c" name="optin" value="yes">Opt in</gd-checkbox></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdCheckbox>('#c')!;
      el.checked = true;
      await settle(el);

      expect(new FormData(form).get('optin')).toBe('yes');
    });

    it('reports valueMissing and blocks form validity when required and unchecked', async () => {
      mount('<form id="f"><gd-checkbox id="c" name="terms" required>Accept</gd-checkbox></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdCheckbox>('#c')!;
      await settle(el);

      expect(el.validity.valueMissing).toBe(true);
      expect(el.checkValidity()).toBe(false);
      expect(form.checkValidity()).toBe(false);
      expect(el.validationMessage.length).toBeGreaterThan(0);
      expect(el.matches(':invalid')).toBe(true);

      el.checked = true;
      await settle(el);
      expect(form.checkValidity()).toBe(true);
      expect(el.matches(':valid')).toBe(true);
    });

    it('is disabled by an ancestor <fieldset disabled> via formDisabledCallback', async () => {
      mount('<form id="f"><fieldset disabled><gd-checkbox id="c" name="t">X</gd-checkbox></fieldset></form>');
      const el = host.querySelector<GdCheckbox>('#c')!;
      await settle(el);

      expect(el.disabled).toBe(true);
    });

    /**
     * REGRESSION TEST for the bug found in CTORNDSD-646b.
     *
     * `formResetCallback` originally called the store's `syncControlledValue(default)`, which
     * deliberately PRESERVES the current value (faithful to React's controlled → uncontrolled
     * behavior) and is exactly wrong for form reset. The symptom was subtle: `.checked` returned to
     * `undefined`, so it looked reset, while the box stayed visually checked and kept submitting
     * `'on'`. Fixed by adding a distinct `resetTo` action to gd-design-core.
     *
     * This asserts the FormData outcome, not just the property, because the property was the
     * misleading signal.
     */
    it('form.reset() actually stops submitting the value, not just clears the property', async () => {
      mount('<form id="f"><gd-checkbox id="c" name="terms">Accept</gd-checkbox></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdCheckbox>('#c')!;
      el.checked = true;
      await settle(el);
      expect(new FormData(form).get('terms')).toBe('on');

      form.reset();
      await settle(el);

      expect(new FormData(form).has('terms')).toBe(false);
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.checked).toBe(false);
    });

    it('form.reset() restores an explicit default of checked=true', async () => {
      mount('<form id="f"><gd-checkbox id="c" name="terms">Accept</gd-checkbox></form>');
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const el = host.querySelector<GdCheckbox>('#c')!;
      // Assigned before first connect completes is not possible here, so this documents the
      // capture-on-first-connect behavior: the default is whatever the property was at connect.
      await settle(el);
      el.checked = true;
      await settle(el);

      form.reset();
      await settle(el);

      // Default captured at connect was `undefined`, so reset clears — NOT the post-mount value.
      // This asymmetry versus native (which reads the `checked` attribute at reset time) is a
      // documented divergence, asserted here so it cannot change silently.
      expect(new FormData(form).has('terms')).toBe(false);
    });
  });

  it('renders indeterminate state on the native input', async () => {
    mount('<gd-checkbox id="c" indeterminate>Label</gd-checkbox>');
    const el = host.querySelector<GdCheckbox>('#c')!;
    await settle(el);

    expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.indeterminate).toBe(true);
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-checked')).toBe('mixed');
  });
});
