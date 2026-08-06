import { describe, expect, it, beforeEach, afterEach } from 'vitest';
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
