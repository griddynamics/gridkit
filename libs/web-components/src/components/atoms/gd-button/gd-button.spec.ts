import { describe, expect, it, beforeEach, afterEach } from 'vitest';
// `vitest/browser`, not the `@vitest/browser/context` path — the latter is deprecated and warns.
import { userEvent } from 'vitest/browser';
import { defaultTheme } from 'gd-design-library/tokens';
// Side-effect import registers <gd-button>; the named export is the cache-size diagnostic hook.
import { __sharedSheetCacheSize } from './gd-button';

/**
 * CTORNDSD-646c. The shared-sheet tests here guard the content-keyed Constructable StyleSheet cache
 * added in this ticket — it halved mount cost, and the way it could silently break is by letting one
 * instance's styles bleed into another's. That is what most of this file asserts.
 *
 * jsdom cannot host these: `adoptedStyleSheets` + `replaceSync` are not implemented reliably.
 */

let host: HTMLDivElement;

type GdButtonEl = HTMLElement & { theme: unknown; variant: string; updateComplete: Promise<unknown> };

function add(variant: string, theme: unknown = defaultTheme, text = variant): GdButtonEl {
  const el = document.createElement('gd-button') as GdButtonEl;
  el.variant = variant;
  el.theme = theme;
  el.textContent = text;
  host.appendChild(el);
  return el;
}

const settle = async (...els: GdButtonEl[]) => {
  await Promise.all(els.map((e) => e.updateComplete));
  await new Promise((r) => setTimeout(r, 20));
};

const innerBg = (el: GdButtonEl) => getComputedStyle(el.shadowRoot!.querySelector('button')!).backgroundColor;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});

afterEach(() => {
  host.remove();
});

describe('gd-button', () => {
  it('resolves the real primary token colour, not a placeholder string', async () => {
    const el = add('primary');
    await settle(el);
    // #FFB800 from libs/ui/src/tokens/button.ts, resolved through the REAL token object
    expect(innerBg(el)).toBe('rgb(255, 184, 0)');
  });

  it('exposes button/content as CSS parts (CTORNDSD-646b)', async () => {
    const el = add('primary');
    await settle(el);
    const parts = Array.from(el.shadowRoot!.querySelectorAll('[part]')).map((n) => n.getAttribute('part'));
    expect(parts).toEqual(expect.arrayContaining(['button', 'content']));
  });

  it('mutes text and background when disabled, via real CSS :disabled matching', async () => {
    const el = add('primary');
    (el as unknown as { disabled: boolean }).disabled = true;
    await settle(el);

    const inner = el.shadowRoot!.querySelector('button')!;
    expect(inner.matches(':disabled')).toBe(true);
    expect(getComputedStyle(inner).backgroundColor).toBe('rgb(229, 229, 229)');
    // colors.text.disabled — reached through button.ts's '&:disabled, &:disabled *' selector,
    // i.e. by genuine CSS matching rather than JS colour-passing (FINDINGS.md §12 third follow-up).
    expect(getComputedStyle(inner).color).toBe('rgb(163, 163, 163)');
  });

  describe('shared stylesheet cache (CTORNDSD-646c)', () => {
    it('adopts exactly two sheets: Lit static + one shared dynamic', async () => {
      const el = add('primary');
      await settle(el);
      expect(el.shadowRoot!.adoptedStyleSheets.length).toBe(2);
    });

    it('gives identical buttons the SAME sheet object and distinct ones DIFFERENT objects', async () => {
      const a = add('primary', defaultTheme, 'a');
      const b = add('primary', defaultTheme, 'b');
      const c = add('secondary', defaultTheme, 'c');
      await settle(a, b, c);

      const sheetOf = (el: GdButtonEl) => el.shadowRoot!.adoptedStyleSheets.at(-1);

      // The whole point of the cache: same resolved CSS text → one shared sheet.
      expect(sheetOf(a)).toBe(sheetOf(b));
      // ...and different CSS text must NOT share.
      expect(sheetOf(a)).not.toBe(sheetOf(c));
    });

    it('does not leak a per-instance theme override into a sibling using the same variant', async () => {
      // This is the regression the cache could plausibly introduce. If sheets were mutated in place
      // rather than swapped, rethemeing one button would repaint every button sharing its text.
      const control = add('primary', defaultTheme, 'control');
      const target = add('primary', defaultTheme, 'target');
      await settle(control, target);

      const controlBefore = innerBg(control);
      expect(controlBefore).toBe('rgb(255, 184, 0)');

      // NOT structuredClone: `defaultTheme`'s leaves are frequently `(theme) => value` FUNCTIONS
      // (see 01-current-architecture.md §3), which are not structured-cloneable — it throws
      // DataCloneError. A spread chain gives a new top-level reference (which is what Lit compares)
      // while preserving the function leaves everywhere else.
      target.theme = {
        ...defaultTheme,
        colors: {
          ...defaultTheme.colors,
          bg: {
            ...defaultTheme.colors.bg,
            fill: { ...defaultTheme.colors.bg.fill, primary: '#0044ff' },
          },
        },
      };
      await settle(target);
      // wait out the token-driven transition before sampling
      await new Promise((r) => setTimeout(r, 400));

      expect(innerBg(target)).toBe('rgb(0, 68, 255)');
      expect(innerBg(control)).toBe(controlBefore);
    });

    it('keeps the cache bounded by distinct CSS text, not by instance count', async () => {
      const before = __sharedSheetCacheSize();
      const els = Array.from({ length: 25 }, (_, i) => add('primary', defaultTheme, `b${i}`));
      await settle(...els);

      // 25 identical buttons must not add 25 sheets. Allow 0 (already cached from an earlier test).
      expect(__sharedSheetCacheSize() - before).toBeLessThanOrEqual(1);
    });
  });

  /**
   * CTORNDSD-646b. The inner `<button>` lives in a shadow root, so its form owner is `null` and the
   * platform never submits — `gd-button._onClick` supplies the activation behaviour instead. These
   * tests exist because the failure mode is silent: `type="submit"` still reaches the inner button
   * and the a11y tree still reports a button, so nothing looks wrong until a click does nothing.
   *
   * Clicks go through `userEvent` (trusted, via CDP) rather than `el.click()`. The JS handler would
   * in fact fire on a synthetic click too, but a synthetic click could not catch a regression to a
   * platform-dependent mechanism, and `FINDINGS.md` Section 6 records a false negative from that
   * shortcut.
   */
  describe('submit/reset activation behaviour (CTORNDSD-646b)', () => {
    /**
     * A trusted click leaves the real cursor wherever it landed, and it outlives the test — while
     * `innerBg()` elsewhere in this file reads a hover-sensitive computed style. Without parking the
     * pointer, the NEXT test's button renders under the stale cursor and samples `:hover` tokens:
     * that is what made 'ignores in-place theme mutation' read the hover gold rgb(246, 156, 0)
     * instead of rgb(255, 184, 0). Cheaper to neutralise here than to make every colour assertion
     * hover-proof.
     */
    let parking: HTMLDivElement;

    beforeEach(() => {
      parking = document.createElement('div');
      parking.style.cssText = 'position:fixed;right:0;bottom:0;width:40px;height:40px';
      document.body.appendChild(parking);
    });

    afterEach(async () => {
      await userEvent.hover(parking);
      parking.remove();
    });

    function mountForm(buttonMarkup: string) {
      host.innerHTML = `<form id="f"><input name="q" value="v" /><input name="req" required value="ok" />${buttonMarkup}</form>`;
      host.querySelectorAll<HTMLElement & { theme?: unknown }>('gd-button').forEach((el) => {
        el.theme = defaultTheme;
      });
      const form = host.querySelector<HTMLFormElement>('#f')!;
      const btn = host.querySelector<GdButtonEl>('gd-button')!;
      const submits: (SubmitEvent | Event)[] = [];
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        submits.push(event);
      });
      return { form, btn, submits };
    }

    it('documents the premise: the inner button has no form owner of its own', async () => {
      const { form, btn } = mountForm('<gd-button type="submit">Go</gd-button>');
      await settle(btn);

      expect(btn.shadowRoot!.querySelector('button')!.form).toBeNull();
      // Not form-associated either — unlike gd-input/gd-checkbox, there is no ElementInternals here.
      expect(Array.from(form.elements)).not.toContain(btn);
    });

    it('submits the owning form on a trusted click', async () => {
      const { btn, submits } = mountForm('<gd-button type="submit">Go</gd-button>');
      await settle(btn);

      await userEvent.click(btn);
      await settle(btn);

      expect(submits.length).toBe(1);
    });

    it('resets the owning form on a trusted click', async () => {
      const { form, btn } = mountForm('<gd-button type="reset">Clear</gd-button>');
      await settle(btn);
      const field = form.querySelector<HTMLInputElement>('[name=q]')!;
      field.value = 'typed';

      await userEvent.click(btn);
      await settle(btn);

      expect(field.value).toBe('v');
    });

    it('does nothing for the default type="button"', async () => {
      const { btn, submits } = mountForm('<gd-button>Plain</gd-button>');
      await settle(btn);

      await userEvent.click(btn);
      await settle(btn);

      expect(submits.length).toBe(0);
    });

    it('runs interactive validation instead of bypassing it', async () => {
      // requestSubmit(), not submit(): an invalid required field must block the submit event.
      const { form, btn, submits } = mountForm('<gd-button type="submit">Go</gd-button>');
      await settle(btn);
      form.querySelector<HTMLInputElement>('[name=req]')!.value = '';

      await userEvent.click(btn);
      await settle(btn);

      expect(submits.length).toBe(0);
      expect(form.checkValidity()).toBe(false);
    });

    /**
     * This test is the reason `_onClick` defers with `setTimeout` rather than `queueMicrotask`, and
     * it only fails under a TRUSTED click. With a browser-initiated dispatch the JS stack empties
     * between listener callbacks, so a microtask checkpoint runs before this listener and a
     * microtask-deferred check reads `defaultPrevented === false`. A synthetic `el.click()` keeps
     * the whole dispatch in one stack frame and would pass either way — so swapping `userEvent` for
     * `el.click()` here silently removes the only coverage of that distinction.
     */
    it('lets a consumer cancel submission with preventDefault() on the click', async () => {
      const { btn, submits } = mountForm('<gd-button type="submit">Go</gd-button>');
      await settle(btn);
      btn.addEventListener('click', (event) => event.preventDefault());

      await userEvent.click(btn);
      await settle(btn);

      expect(submits.length).toBe(0);
    });

    it('is cancelable from a light-DOM ancestor, not just the host', async () => {
      // A task-queue deferral resumes after the ENTIRE dispatch, so any listener in the path can
      // cancel — which is what the platform does for a native submit button.
      const { form, btn, submits } = mountForm('<gd-button type="submit">Go</gd-button>');
      await settle(btn);
      form.addEventListener('click', (event) => event.preventDefault());

      await userEvent.click(btn);
      await settle(btn);

      expect(submits.length).toBe(0);
    });

    it('does not submit when disabled', async () => {
      const { btn, submits } = mountForm('<gd-button type="submit" disabled>Go</gd-button>');
      await settle(btn);

      // force: the pointer-events/disabled state would otherwise make the click unperformable,
      // which would pass the assertion for the wrong reason.
      await userEvent.click(btn, { force: true });
      await settle(btn);

      expect(submits.length).toBe(0);
    });

    it('does not submit when there is no ancestor form', async () => {
      host.innerHTML = '<gd-button type="submit">Orphan</gd-button>';
      const btn = host.querySelector<GdButtonEl>('gd-button')!;
      btn.theme = defaultTheme;
      await settle(btn);

      // Must not throw on a null form owner.
      await userEvent.click(btn);
      await settle(btn);

      expect(btn.closest('form')).toBeNull();
    });

    it('does not reach a form that is only an ancestor in the flattened tree', async () => {
      // closest() deliberately does not pierce shadow boundaries — the same scoping the platform's
      // form-owner algorithm uses. A native <button> slotted in here would have no owner either.
      const outer = document.createElement('div');
      host.appendChild(outer);
      const shadow = outer.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<form id="inner"><slot></slot></form>';
      const btn = document.createElement('gd-button') as GdButtonEl;
      btn.theme = defaultTheme;
      (btn as unknown as { type: string }).type = 'submit';
      btn.textContent = 'Slotted';
      outer.appendChild(btn);

      const form = shadow.querySelector<HTMLFormElement>('#inner')!;
      const submits: Event[] = [];
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        submits.push(event);
      });
      await settle(btn);

      await userEvent.click(btn);
      await settle(btn);

      expect(submits.length).toBe(0);
    });
  });

  it('ignores in-place theme mutation — reference equality drives re-render', async () => {
    const el = add('primary');
    await settle(el);

    // Documented Lit semantics (FINDINGS.md §13): `theme` is a reactive property compared by
    // reference, so mutating the object the element already holds is invisible to it. Deliberately
    // no `requestUpdate()` here — that forces a render unconditionally and would defeat the point.
    (el.theme as { colors: { bg: { fill: { primary: string } } } }).colors.bg.fill.primary = '#00ff00';
    await settle(el);
    await new Promise((r) => setTimeout(r, 100));

    expect(innerBg(el)).toBe('rgb(255, 184, 0)');
  });
});
