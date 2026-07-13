import '../src/components/gd-button/gd-button';
import '../src/components/gd-typography/gd-typography';

/**
 * Companion script for ssr-dsd-hydrated.html — checks what actually happens once Lit's
 * client JS loads on top of server-rendered Declarative Shadow DOM: does Lit reuse the
 * existing shadow-root DOM nodes (true hydration), or does it discard and fully
 * client-re-render into the already-attached shadow root? Either outcome can be a pass
 * for CTORNDSD-581's purposes (the plan only requires confirmed hydration behavior, not a
 * specific mechanism) — record whichever one actually happens, don't assume.
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

  requestAnimationFrame(() => {
    setTimeout(() => {
      const innerButtonAfter = button?.shadowRoot?.querySelector('button') ?? null;
      const domNodeReusedAcrossHydration = innerButtonAfter === innerButtonBefore;
      const dataMarkerSurvived = innerButtonAfter?.getAttribute('data-pre-hydration-marker') === 'true';

      let clickFired = false;
      button?.addEventListener('click', () => (clickFired = true));
      innerButtonAfter?.click();

      const result = {
        buttonHasShadowRoot: !!button?.shadowRoot,
        typographyHasShadowRoot: !!typography?.shadowRoot,
        domNodeReusedAcrossHydration,
        dataMarkerSurvived,
        interactivityWorksAfterHydration: clickFired,
      };
      log(JSON.stringify(result, null, 2));
    }, 50);
  });
});
