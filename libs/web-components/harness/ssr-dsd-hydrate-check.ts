import '../src/components/gd-button/gd-button';
import '../src/components/gd-typography/gd-typography';
import { defaultTheme } from 'gd-design-library/tokens';

/**
 * Companion script for ssr-dsd-hydrated.html — checks what actually happens once Lit's
 * client JS loads on top of server-rendered Declarative Shadow DOM: does Lit reuse the
 * existing shadow-root DOM nodes (true hydration), or does it discard and fully
 * client-re-render into the already-attached shadow root? Either outcome is acceptable —
 * only confirmed hydration behavior matters, not a specific mechanism — record whichever
 * one actually happens, don't assume.
 */
function log(message: string) {
  const el = document.createElement('pre');
  el.id = 'hydration-result';
  el.style.cssText = 'background:#eee;padding:12px;white-space:pre-wrap;';
  el.textContent = message;
  document.body.appendChild(el);
  console.log('[SSR-DSD-HYDRATE]', message);
}

window.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('gd-button');
  const typography = document.querySelector('gd-typography');
  const innerButtonBefore = button?.shadowRoot?.querySelector('button') ?? null;

  if (innerButtonBefore) innerButtonBefore.setAttribute('data-pre-hydration-marker', 'true');

  // Server-rendered DSD carries `gd-button`'s `static styles` but NOT its theme CSS, which lives
  // in a runtime constructable stylesheet that cannot be serialized into a
  // `<template shadowrootmode>` (see ssr-dsd-static.html's own copy). So the button arrives
  // unstyled and only becomes styled once client JS both loads AND is handed a theme. Assigning
  // it here is what makes this page demonstrate the actual trade-off: zero JS = structural markup
  // only for this component; JS = fully styled. `gd-typography` is already styled from SSR
  // because it uses inline styles, so this changes nothing for it.
  const backgroundBeforeTheme = innerButtonBefore ? getComputedStyle(innerButtonBefore).backgroundColor : null;
  document.querySelectorAll<HTMLElement & { theme?: unknown }>('gd-button, gd-typography').forEach((el) => {
    el.theme = defaultTheme;
  });

  requestAnimationFrame(() => {
    setTimeout(async () => {
      const innerButtonAfter = button?.shadowRoot?.querySelector('button') ?? null;
      const domNodeReusedAcrossHydration = innerButtonAfter === innerButtonBefore;
      const dataMarkerSurvived = innerButtonAfter?.getAttribute('data-pre-hydration-marker') === 'true';

      let clickFired = false;
      button?.addEventListener('click', () => (clickFired = true));
      innerButtonAfter?.click();

      // `tokens.default.transition` animates `background-color`, so reading the computed style
      // immediately after the theme lands returns a mid-transition value (observed:
      // `rgb(241, 232, 208)` on the way to the real token colour) and makes this check look wrong.
      // Wait for the element's own running animations to settle rather than guessing a duration.
      if (innerButtonAfter) {
        await Promise.race([
          Promise.allSettled(innerButtonAfter.getAnimations().map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 1000)),
        ]);
      }

      const result = {
        buttonHasShadowRoot: !!button?.shadowRoot,
        typographyHasShadowRoot: !!typography?.shadowRoot,
        domNodeReusedAcrossHydration,
        dataMarkerSurvived,
        interactivityWorksAfterHydration: clickFired,
        // Evidences the constructable-stylesheet gap: unstyled from SSR alone, themed once
        // client JS runs. Compare against ssr-dsd-static.html, which never gets the second value.
        'gd-button background from SSR alone (expect browser default)': backgroundBeforeTheme,
        'gd-button background after client theme (expect the real token colour)': innerButtonAfter
          ? getComputedStyle(innerButtonAfter).backgroundColor
          : null,
        'gd-button adoptedStyleSheets after hydration (expect > 0)': button?.shadowRoot?.adoptedStyleSheets.length ?? 0,
      };
      log(JSON.stringify(result, null, 2));
    }, 50);
  });
});
