import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import axe from 'axe-core';
import { defaultTheme } from 'gd-design-library/tokens';
import '../src/index';

/**
 * CTORNDSD-646c — the first automated accessibility coverage for this package.
 *
 * Two distinct things are asserted, and keeping them separate is the point:
 *
 *  1. **axe finds no serious or critical violations.** Standard automated a11y coverage.
 *  2. **The Shadow DOM discoverability gap is a DOM-query gap, not an a11y regression.** `FINDINGS.md`
 *     §5 established this by hand; it is asserted here so the distinction cannot quietly become
 *     untrue. A heading inside a shadow root is invisible to `document.querySelector('h1')` but
 *     present in the accessibility tree. If a future change broke the a11y half, this test fails —
 *     which is exactly the alarm that matters.
 */

let host: HTMLDivElement;

const settle = async (root: ParentNode) => {
  await Promise.all(
    Array.from(root.querySelectorAll('*'))
      .map((el) => (el as unknown as { updateComplete?: Promise<unknown> }).updateComplete)
      .filter(Boolean)
  );
  await new Promise((r) => setTimeout(r, 50));
};

function applyTheme(root: ParentNode) {
  root.querySelectorAll<HTMLElement & { theme?: unknown }>('*').forEach((el) => {
    if (el.tagName.startsWith('GD-')) el.theme = defaultTheme;
  });
}

async function auditSeriousOrWorse(target: Element) {
  const results = await axe.run(target, {
    resultTypes: ['violations'],
    rules: {
      // Colour-contrast needs a real painted layout with final fonts loaded; it is flaky in a
      // headless harness and belongs in the visual-regression pass. Excluded explicitly rather than
      // silently, so the gap stays visible.
      'color-contrast': { enabled: false },
      /**
       * `button-name` is disabled because axe reports a FALSE POSITIVE here, and this is verified,
       * not assumed.
       *
       * `gd-button` renders `<button><slot></slot></button>`, so its label is slotted light-DOM
       * content. The browser's accessible-name computation walks the FLATTENED tree and picks it up
       * correctly — confirmed against Chromium's own accessibility tree, which reports
       * `button "Primary"`, `button "Save"`, and `button "Styled via ::part()"` for exactly these
       * elements (CTORNDSD-646b browser verification, `FINDINGS.md` §17). axe does not follow slot
       * assignment, so it sees an empty `<button>`.
       *
       * The real risk this leaves is that a genuine unnamed button would also go unreported, so the
       * `accessible name reaches the button` test below asserts the flattened text directly — that
       * is the input to accessible-name computation, checked without relying on axe.
       *
       * Recorded in `11-testing-documentation.md`: automated a11y tooling has incomplete Shadow DOM
       * support, and that is a real limitation of this test layer, not of the components.
       */
      'button-name': { enabled: false },
    },
  });
  return results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});

afterEach(() => {
  host.remove();
});

describe('accessibility', () => {
  it('has no serious or critical axe violations across all five components', async () => {
    host.innerHTML = `
      <main>
        <gd-typography variant="h1" as="h1">Heading</gd-typography>
        <gd-button variant="primary">Save</gd-button>
        <form>
          <gd-input label="Email" name="email"></gd-input>
          <gd-checkbox name="terms">Accept terms</gd-checkbox>
        </form>
        <gd-select></gd-select>
      </main>
    `;
    applyTheme(host);
    await settle(host);

    const violations = await auditSeriousOrWorse(host);
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  it('gets an accessible name onto the button via slotted content (what axe cannot see)', async () => {
    host.innerHTML = '<gd-button variant="primary">Save changes</gd-button>';
    applyTheme(host);
    await settle(host);

    const inner = host.querySelector('gd-button')!.shadowRoot!.querySelector('button')!;
    const slot = inner.querySelector('slot:not([name])') as HTMLSlotElement | null;
    const flattened = (slot?.assignedNodes({ flatten: true }) ?? []).map((n) => n.textContent?.trim() ?? '').join('');

    // This is the text the browser's accessible-name computation consumes. Asserting it directly
    // covers the gap left by disabling axe's `button-name` rule above.
    expect(flattened).toBe('Save changes');
    expect(inner.getAttribute('aria-label')).toBeNull(); // name comes from content, not an override
  });

  it('gives the input an accessible name by associating its label (regression: CTORNDSD-646c)', async () => {
    // Found by this suite on its first run: the label was a bare <span> with nothing tying it to the
    // <input>, so the accessible name silently fell back to the placeholder. Now a real
    // <label for> inside the same shadow-root ID scope.
    host.innerHTML = '<gd-input label="Email address" placeholder="you@example.com"></gd-input>';
    applyTheme(host);
    await settle(host);

    const root = host.querySelector('gd-input')!.shadowRoot!;
    const label = root.querySelector('label')!;
    const input = root.querySelector('input')!;

    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.id).toBeTruthy();
    expect(label.textContent).toContain('Email address');
    expect(input.labels?.length).toBe(1);
  });

  it('falls back to aria-label from the placeholder when no visible label exists', async () => {
    host.innerHTML = '<gd-input placeholder="Search"></gd-input>';
    applyTheme(host);
    await settle(host);

    const input = host.querySelector('gd-input')!.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-label')).toBe('Search');
  });

  it('exposes a disabled button as disabled to assistive technology', async () => {
    host.innerHTML = '<gd-button variant="primary" disabled>Save</gd-button>';
    applyTheme(host);
    await settle(host);

    const inner = host.querySelector('gd-button')!.shadowRoot!.querySelector('button')!;
    expect(inner.disabled).toBe(true);
    expect(await auditSeriousOrWorse(host)).toEqual([]);
  });

  it('marks an indeterminate checkbox as aria-checked="mixed"', async () => {
    host.innerHTML = '<gd-checkbox indeterminate>Partial</gd-checkbox>';
    applyTheme(host);
    await settle(host);

    const inner = host.querySelector('gd-checkbox')!.shadowRoot!.querySelector('input')!;
    expect(inner.getAttribute('aria-checked')).toBe('mixed');
  });

  it('surfaces constraint-validation state to assistive technology', async () => {
    host.innerHTML = '<form><gd-input id="i" label="Email" name="email" required></gd-input></form>';
    applyTheme(host);
    await settle(host);

    const el = host.querySelector('#i') as HTMLElement & { validity: ValidityState };
    // The host matches :invalid, which is what AT and CSS both key off.
    expect(el.matches(':invalid')).toBe(true);
    expect(el.validity.valueMissing).toBe(true);
  });

  describe('Shadow DOM discoverability (FINDINGS.md §5)', () => {
    it('hides the heading from light-DOM tag queries but keeps it in the accessibility tree', async () => {
      // Deliberately no real <h1> anywhere except the one gd-typography renders internally.
      host.innerHTML = '<gd-typography variant="h1" as="h1">Only heading</gd-typography>';
      applyTheme(host);
      await settle(host);

      // The gap: a light-DOM query cannot pierce the shadow root.
      expect(host.querySelector('h1')).toBeNull();

      // The reassurance: the heading is real, and it is inside the shadow root.
      const inner = host.querySelector('gd-typography')!.shadowRoot!.querySelector('h1');
      expect(inner).not.toBeNull();

      // NOTE: `inner.textContent` is EMPTY. The text is slotted light-DOM content, so it is not a
      // child of the shadow node — it is assigned to a <slot> inside it. Read it through
      // `assignedNodes()`, or from the host. Asserting on shadow `textContent` is a recurring trap
      // (the same mistake was made once in 646b — see FINDINGS.md §17.4).
      const slot = inner!.querySelector('slot');
      const slottedText = slot
        ? slot
            .assignedNodes({ flatten: true })
            .map((n) => n.textContent?.trim() ?? '')
            .join('')
        : inner!.textContent;
      expect(slottedText).toContain('Only heading');

      // And it is NOT an a11y regression — axe, which walks the flattened tree, is clean.
      expect(await auditSeriousOrWorse(host)).toEqual([]);
    });
  });
});
