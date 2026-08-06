# 02 — Architecture Options Comparison

**Owner:** CTORNDSD-646a · **Answers:** CTORNDSD-646 acceptance criteria 2, 3, 5 · **Status:** Delivered

## The 8 candidate approaches

CTORNDSD-646 names eight. Four have real evidence on this branch; four do not. Which is which
matters more than the table itself, so it is stated first.

| ID    | Approach                                                      | Evidence status                                                                                                                                |
| ----- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | Lit Web Components as the primary implementation              | **Built and measured** — the 5 ported atoms                                                                                                    |
| **B** | Lit Web Components with React wrapper components              | **Built and measured** — 5 `@lit/react` wrappers in `harness/Gd*React.tsx`                                                                     |
| **C** | Direct use of custom elements inside React applications       | **Partially measured** — property/attribute assignment works; custom events do not auto-wire on React 18, and the React 19 claim is unverified |
| **D** | Lit templates without custom elements                         | **Not attempted**                                                                                                                              |
| **E** | Native Web Components without Lit                             | **Not attempted** — probe deferred to 646c                                                                                                     |
| **F** | Parallel React and Lit implementations                        | **Not attempted** as a deliberate strategy, though it is the de-facto state of the branch today                                                |
| **G** | Shared headless logic with separate React and Lit renderers   | **Built** — `gd-design-core` consumed by both `libs/web-components` and `spike-react-native`                                                   |
| **H** | Native HTML and CSS for components needing no custom behavior | **Not attempted** — analyzed in `05-native-html-guidelines.md`                                                                                 |

## Comparison matrix

Cell labels: **M** = measured (cite follows), **R** = reasoned, **—** = not attempted.

| Axis                   | A · Native Lit                                                                                 | B · Lit + React wrappers                               | C · Direct CE in React                                       | D · Lit templates, no CE                                    | E · Native WC, no Lit                              | F · Parallel impls                    | G · Shared core, 2 renderers                                       | H · Native HTML + tokens                 |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| Framework independence | **M** Full                                                                                     | **M** Full core, React-specific wrapper layer          | **M** Full                                                   | **R** None — Lit-only rendering                             | **R** Full                                         | **R** None                            | **M** Full logic, per-platform render                              | **R** Full                               |
| Maintainability        | **M** One implementation per component                                                         | **M** Two artifacts, wrapper is 5 lines and mechanical | **M** One artifact, consumer absorbs the glue                | **R** Poor fit — no encapsulation boundary                  | **R** Poor — hand-rolled reactivity and templating | **R** Worst — every change made twice | **M** Good, with a real constraint: core must stay dependency-free | **R** Best where it applies              |
| Bundle size            | **M** 9.11 kB / 5 atoms, +6.88 kB `lit` runtime once                                           | **M** Same, + `@lit/react` glue                        | **M** Same as A                                              | **R** No `lit` runtime saving                               | **—** Would isolate the 6.88 kB question           | **R** Both costs, no saving           | **M** Core is small; adapters pay their own                        | **R** Zero JS                            |
| Runtime performance    | **M** Mount ~28 ms/300, update ~13 ms/300                                                      | **R** Wrapper adds a React render layer; unmeasured    | **M** Same as A                                              | **R** Comparable to A minus upgrade cost                    | **—**                                              | **R** N/A                             | **M** Same as A on web                                             | **R** Fastest                            |
| SSR support            | **M** Works via `@lit-labs/ssr` + DSD, incl. zero-JS                                           | **R** Wrapper is React, so SSR follows React's path    | **R** Same as A                                              | **R** Lit SSR without DSD; no encapsulation                 | **R** Manual DSD authoring                         | **R** N/A                             | **M** Web side = A; RN side N/A                                    | **R** Trivially                          |
| Hydration complexity   | **M** DOM node reused, marker survived, stayed interactive                                     | **R** Two hydration passes, Lit's and React's          | **R** Same as A                                              | **R** Lower — no upgrade step                               | **R** Manual                                       | **R** N/A                             | **M** Same as A                                                    | **R** None                               |
| Accessibility          | **M** a11y tree flattens correctly; focus ring matches real `getFocusStyles`                   | **M** Same element, same a11y                          | **M** Same                                                   | **R** Same as light DOM React                               | **R** Same as A                                    | **R** N/A                             | **M** Same as A                                                    | **R** Best — native semantics by default |
| Styling and theming    | **M** Real token objects resolved live; theme switching verified incl. nested pseudo-selectors | **M** Same, `theme` passed as a prop                   | **M** Same, `theme` assigned as a property                   | **R** No encapsulation — reintroduces the CTORNDSD-286 risk | **R** Same as A, hand-rolled                       | **R** Two theming models              | **M** Same core resolver both sides                                | **R** CSS custom properties only         |
| React integration      | **M** Needs `@lit/react` for events                                                            | **M** Idiomatic JSX, `onGdChange` works                | **M** Properties fine; events need manual `addEventListener` | **R** Not applicable                                        | **R** Same as A                                    | **R** Native                          | **M** Same as A                                                    | **R** Native                             |
| Developer experience   | **M** Familiar decorator API; no `ReactNode` analogue for icon props                           | **M** Best for React consumers                         | **M** Worst — consumer writes the glue                       | **R** Unfamiliar, no encapsulation payoff                   | **R** Poor                                         | **R** Poor                            | **M** Good — one logic surface                                     | **R** Simplest                           |
| Testing effort         | **R** Needs a real-browser runner; jsdom insufficient                                          | **R** As A, plus wrapper tests                         | **R** As A                                                   | **R** jsdom-testable                                        | **R** As A                                         | **R** Doubled                         | **M** Core unit-testable in isolation; 100+ tests exist            | **R** Minimal                            |
| Migration complexity   | **M** 5 atoms ported; 58 remain, 44 in unmeasured categories                                   | **M** Wrappers are mechanical and generatable          | **M** No library work; cost moves to consumers               | **R** Full rewrite, no isolation gain                       | **R** Higher than A                                | **R** Highest                         | **M** Core extraction already done                                 | **R** Lowest where applicable            |
| Long-term maintenance  | **R** Single implementation, standards-based                                                   | **R** Wrapper layer is generatable, so low             | **R** Low for the library, high for consumers                | **R** Lit-coupled with no upside                            | **R** High — reimplementing Lit                    | **R** Untenable                       | **R** Moderate — boundary discipline required                      | **R** Lowest                             |

**Measured-cell citations** (all `libs/web-components/FINDINGS.md`): isolation §1; SSR and hydration
§2; bundle size §3; Input cursor stability §4; DOM discoverability §5; Select `popover` §6; React
event mapping §7; theming and token source of truth §§9, 12, 13, 16; CSS mechanism §12; render speed
§14; shell §15.

## Why the four unexercised approaches were not built

Each was assessed for whether a probe could change the recommendation. Three could not; one could,
and was deferred rather than dropped.

**D — Lit templates without custom elements.** _Reasoned, no probe._ This uses Lit's templating while
discarding the custom-element boundary, which means discarding Shadow DOM. Shadow DOM _is_ the
primary measured win (§1): it is the only mechanism that prevented the CTORNDSD-286 collision, and a
second Emotion cache provided zero isolation. Removing it while adding a Lit dependency inverts the
cost-benefit. No probe can rescue that shape.

**E — Native Web Components without Lit.** _Deferred to 646c, not dismissed._ This is the one
approach where a cheap probe yields a real number: it would isolate the 6.88 kB `lit` runtime cost —
currently the honest "cost of entry" a React-only consumer pays — by direct measurement rather than
subtraction. It is deferred because the bundle-measurement harness (`scripts/measure-bundle-size.mjs`)
is the natural home for it, and that harness is 646c's territory. It is scoped there as a throwaway
`harness/` fixture, not a library component.

The probe is unlikely to change the recommendation. Lit's 6.88 kB buys reactive properties,
templating, Constructable StyleSheet management, and the SSR/hydration package that §2 measured
working. Hand-rolling those is the "reimplement a framework badly" failure mode. But the number is
worth having, because it is the figure a skeptical reviewer will ask for.

**F — Parallel React and Lit implementations.** _Reasoned, no probe._ Every change made twice,
forever, with inevitable drift. Worth naming precisely because it is the de-facto state of the branch
_today_ — `libs/ui` and `libs/web-components` both exist — but as a transitional state, not a target.
The distinction matters for the roadmap: coexistence during migration is necessary; coexistence as an
end state is not a strategy.

**H — Native HTML and CSS.** _Not attempted here; owned by `05-native-html-guidelines.md`._ This is
not a whole-library approach but a per-component judgment, so it belongs in the guidelines document
where each of the 9 element groups gets a verdict.

## The B-versus-C question: wrappers or direct usage

CTORNDSD-646 asks for these specifically (acceptance criterion 5). The answer is **measured and
narrow**:

Property and attribute assignment works either way — passing primitives, objects, and arrays into a
custom element needs no wrapper. **Custom event dispatch is the entire difference.** A custom event
(`gd-change`, `gd-input`) never auto-wires to an `onFoo` JSX callback. On React 18 this is confirmed
(**measured**, §7); every harness wrapper routes events through `@lit/react`'s
`createComponent({ events: {...} })` and works end-to-end. React 19's native heuristic covers
property/attribute _assignment_ only and does not extend to events — but that is **documented
guidance, not verified here**, because this repo is pinned to React 18.3.1 (646b closes it).

**Recommendation: ship B, support C.** Generate React wrappers so existing consumers get idiomatic
`onGdChange` props and a migration that is mostly a rename, while leaving direct custom-element usage
available for consumers who prefer it. Five hand-authored wrappers is sufficient evidence that the
layer is mechanical enough to generate rather than maintain by hand — that decision belongs in
`03-monorepo-structure.md`.

## The middle path that does not work

Option **A′** — a Lit element that mounts the real React component inside itself — was not in the
ticket's list but is the intuitive compromise, and reviewers reliably propose it. It was **built and
measured** rather than reasoned about (**measured**, §15), and it fails in two ways at once:

1. **Slowest of the three to mount**, not a middle ground: ~44 ms per 300 instances against ~28 ms for
   native Lit and ~11 ms for React. It pays custom-element and Shadow DOM attachment costs _plus_ a
   full `ReactDOM.createRoot` per instance.
2. **The naive version renders with no styling at all.** Computed background was
   `rgb(239, 239, 239)` — Chromium's default unstyled `<button>` — not the real `#FFB800`. The Shadow
   DOM boundary that keeps the page's hostile reset out also keeps the component's own Emotion
   `<style>` tag out, because Emotion injects into `document.head`. Same mechanism, both directions.

So the isolation test technically "passed" only because the component was rendering nothing correct.
Making it work would need a shadow-root-scoped Emotion cache wired per instance — plumbing that was
not built. And the marginal bundle figure (643 B of glue) is misleading at scale: unlike a native Lit
rewrite, the shell does not _remove_ the React+Emotion weight, it adds Lit's runtime on top.

This is the clearest argument in the whole spike for committing to one model rather than bridging.

## Recommendation

**Option A (native Lit) as the primary implementation, with Option B (generated React wrappers) as
the consumer-facing layer, built on Option G's shared headless core.**

These three compose rather than compete, and that composition is already real on this branch:
`gd-design-core` holds framework-agnostic stores and resolvers with no `gd-design-library` dependency;
`libs/web-components` holds the Lit elements; `harness/Gd*React.tsx` holds the wrappers;
`spike-react-native` proves the core serves a non-web renderer.

### Justification, ranked by evidence strength

1. **Shadow DOM solves a real, previously-experienced production failure.** CTORNDSD-286 reproduces
   exactly as described — the control button visibly breaks and a second Emotion cache gives zero
   isolation — while the Lit components are unaffected in both directions (**measured**, §1). This is
   the strongest single result and no other option delivers it.
2. **Bundle size improves by an order of magnitude per component.** 10.4×–20.6× smaller per atom;
   16.38 kB for 5 atoms including the `lit` runtime against 113.18 kB (**measured**, §3).
3. **SSR is not a compromise.** Zero-JavaScript static render works, and hydration reuses the
   server-rendered node rather than replacing it (**measured**, §2).
4. **The shared-core boundary is proven across two platforms**, not asserted (**measured**, §G above
   and `spike-react-native`).
5. **The single-source-of-truth token binding is real**, verified by editing a token file and watching
   the change reach a live element through HMR alone (**measured**, §§13, 16).

### Honest counterweights

- **Mount performance is currently worse than React** — ~2× at 300 instances (**measured**, §14). The
  hypothesis that a per-content-hash stylesheet cache closes it is **untested**. This is condition 5
  on the GO and the highest-value remaining measurement.
- **Shadow DOM has a real, structural cost:** `document.querySelector('h1')` cannot find a heading
  rendered inside a shadow root (**measured**, §5). The accessibility tree is unaffected — screen
  readers see a real heading — so this is a DOM-query gap, not an a11y regression. But host apps,
  extensions, and testing-library selector shortcuts will all miss it.
- **44 of 63 components sit in categories with no measured data point** (see
  `01-current-architecture.md` §7). The recommendation is well-evidenced for native-control wrappers
  and presentational components, and **extrapolated** for form, interactive, overlay, data-heavy, and
  domain-specific ones.
- **Two named gaps remain in the API surface:** `::part()` and `ElementInternals` form participation
  are unimplemented (646b). Form participation in particular is load-bearing for an entire category.
- **`Chart` may be unportable as specified.** Six `@visx/*` packages have no custom-element path; this
  is a dependency decision, not a porting task.

### What would change the recommendation

Stated up front so the decision is falsifiable rather than defended:

- The stylesheet-cache fix failing to close the mount gap, _and_ runtime mount cost mattering for the
  target applications.
- `ElementInternals` proving unable to support the existing controlled-value model, which would make
  the 4 form components and 10 native-control wrappers substantially more expensive than estimated.
- The organization's minimum browser-support matrix excluding Declarative Shadow DOM or `popover`
  (Chrome/Edge 111+, Firefox 123+, Safari 16.4+). Both are load-bearing, and **no ticket can close
  this from inside the repo** — it needs organizational input.
