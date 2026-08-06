# GridKit → Lit Web Components: Migration Decision Document

**Ticket:** CTORNDSD-646 "[Spike] Webcomponents" · **Epic:** CTORNDSD-580 "Add webcomponents support"
· **Branch:** `feature/CTORNDSD-646`

## Reading this document

This is the decision page. It exists so a reviewer can approve, reject, or revise the React → Lit
migration initiative without reading the underlying engineering log.

Three artifacts sit behind it, at three levels of detail and for three audiences:

| Artifact                                                                                                                                 | Audience                         | Role                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Confluence: `[Spike] Web Components`**](https://griddynamics.atlassian.net/wiki/spaces/RNDM/pages/4737106015) (space `RNDM`, CTO R&D) | Stakeholders, non-engineers      | The plain-English CTORNDSD-581 summary — the two-option framing (Lit shell vs. native Lit rebuild), the side-by-side table, and the GO recommendation. **This is the canonical published spike outcome.**                                                                    |
| **This directory**                                                                                                                       | Engineers, architects, reviewers | The CTORNDSD-646 deliverable set. Organized by question, not chronology. Supersets Confluence's two options with all 8 the ticket names                                                                                                                                      |
| **`libs/web-components/FINDINGS.md`**                                                                                                    | Implementers, auditors           | The CTORNDSD-581 engineering log. Chronological, retains reversed earlier conclusions, and is the audit trail for every **measured** claim cited here. Deliberately not restructured — its value is showing how each conclusion was reached and where one superseded another |

**Relationship to Confluence.** The Confluence page and this directory must not diverge. Confluence
is the published, stakeholder-facing outcome; this directory is the engineering substrate that
supports it and extends it to CTORNDSD-646's full scope. Where the two overlap — the GO verdict, the
three-way comparison, the bundle and speed numbers, the conditions — **Confluence is the version
that has been socialized**, so any change here that alters a conclusion must be mirrored there.

**Both artifacts are now aligned** (Confluence v16, updated 2026-08-05). The two divergences that
existed are resolved:

1. Confluence said "5 of ~68 components ported". Corrected there and here to **63 total**, and
   reframed around what the work actually is — 21 styling-only conversions, 35 element rebuilds, 3
   dependency decisions (`12-complexity-matrix.md`).
2. Confluence's record that **`Select` is a reduced-scope rebuild** — a caveat neither `FINDINGS.md`
   nor this directory originally carried — is now reflected in both, and in the scope-limitation
   section below.

Confluence v16 also carries the round-two results in stakeholder language: the render-speed fix and
its residual gap, form participation and CSS Parts, the React 19 result, the Next.js server-rendering
limitation, the nested-theme and compound-component gaps, and the current status of all five
conditions.

Every claim in this directory carries a provenance label:

| Label             | Meaning                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| **measured**      | Verified empirically in this repo, with a `FINDINGS.md` section or script cited |
| **reasoned**      | Derived from documentation or code reading, not independently verified here     |
| **not attempted** | Named in CTORNDSD-646, deliberately not investigated, with the reason given     |

A reader who wants to challenge a conclusion should start with its label. **Reasoned** and
**not attempted** claims are where the risk is.

## Status: DECISION-READY

CTORNDSD-646 was split into four tickets. All four have run. This page is the recommendation.

Two things are deliberately **not** claimed: that every acceptance criterion is fully satisfied, and
that the effort estimate is firm. Both are qualified below and in `14-risks.md`.

| Ticket | Scope                                                                                           | Status                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 646a   | Architecture assessment, options comparison, native-HTML guidelines, monorepo structure         | **Complete** — documents 01, 02, 03, 05 delivered                                          |
| 646b   | Next.js/SSR, Shadow DOM strategy, `::part()`, `ElementInternals`, React 19, styling and theming | **Complete** — documents 04, 06, 07, 08, 09 delivered                                      |
| 646c   | Performance benchmark matrix, test infrastructure, Storybook for Lit atoms                      | **Partial** — documents 10, 11 delivered; Storybook and several benchmark axes outstanding |
| 646d   | Complexity matrix, migration roadmap, consumer path, risk register, final recommendation        | **Complete** — documents 12, 13, 14 delivered                                              |

## Recommendation

**Conditional GO for native Lit** as the primary implementation, with generated React wrappers as the
consumer-facing layer, built on the shared `gd-design-core`. Three approaches that compose rather than
compete — and all three already exist on this branch.

**The four conditions in the table below are not paperwork. Two of them can change the answer**, and
one of those cannot be resolved by engineering at all.

The case rests on three measured results and is weakened by one:

**For.** Shadow DOM concretely prevents the CTORNDSD-286 style-collision failure mode — the control
condition reproduces the bug and a second Emotion cache provides zero isolation, while the Lit
components are unaffected in both directions (**measured**, Section 1). Per-atom bundle size is
7–16× smaller than the React+Emotion equivalents; the 5-atom total is 11.06 kB gzip, or 17.94 kB
including the one-time 6.88 kB `lit` runtime, against 105.72 kB (**measured**,
`10-performance-report.md`, which supersedes `FINDINGS.md` §3's pre-646b figures). SSR via
Declarative Shadow DOM works, including with zero client JavaScript, and Lit's hydration reuses the
server-rendered DOM node rather than discarding it (**measured**, Section 2).

**Against — now measured, and it did not resolve in Lit's favour.** React mounts faster. The
hypothesis that a per-content-hash stylesheet cache would close the gap was tested: the cache made
mount **50% faster** and update **57% faster** (update is now faster than React), confirming §14's
reasoning — but Lit remains **2.3×** slower than React at 300 mounts and **3.4×** slower at a single
mount, because the residual is fixed custom-element upgrade and shadow-root attachment cost that no
caching removes (**measured**, `FINDINGS.md` §18.1). Runtime mount cost is therefore a real, named
cost of this migration rather than a footnote — smaller than it was, and not eliminated.

**Also relevant.** The intuitively appealing middle path — a Lit element that wraps the real React
component — was built and measured rather than assumed, and it fails in a non-obvious way: it is the
_slowest_ of the three options to mount (~44 ms/300), and the naive version renders with **no
styling at all**. The Shadow DOM boundary that keeps the page's hostile reset out also keeps the
component's own `document.head`-injected Emotion styles out. Same mechanism, both directions
(**measured**, Section 15).

### Conditions on the GO

| #   | Condition                                                                                                                                     | Status                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Typography's DOM-discoverability gap must be an accepted, documented trade-off, not silently absorbed                                         | **RESOLVED BY DESIGN** — `05-native-html-guidelines.md` ships Typography and Link as native elements rather than absorbing the gap. Confirmed to hold under Next.js too (**measured**, §17.4)                                                                 |
| 2   | The organization's real minimum browser-support matrix must be confirmed before treating `popover` and Declarative Shadow DOM as load-bearing | **Open — needs organizational input.** No ticket can close this from inside the repo                                                                                                                                                                          |
| 3   | React 19's event-mapping scope must be independently verified, not inherited from a React-18-only environment                                 | **CLOSED** — measured against React 19.2.8. Property assignment works natively; custom events still need `@lit/react` and fail **silently** (**measured**, `FINDINGS.md` §17.3)                                                                               |
| 4   | Any full-catalog rollout needs its own scoping pass, not an extrapolation from the ported atoms                                               | **CLOSED** — `12-complexity-matrix.md` rates all 63. Outcome: **21 CSS conversions, 35 remaining element ports, 3 dependency decisions** — not a 63-component port. 35 ratings remain extrapolated (R12)                                                      |
| 5   | Runtime mount performance must be re-measured after the stylesheet-cache fix                                                                  | **MEASURED — still open.** The cache made mount **50% faster** and update **57% faster**, confirming §14's hypothesis, but Lit remains **2.3×** slower than React at 300 mounts and **3.4×** at one. Narrowed, not closed (**measured**, `FINDINGS.md` §18.1) |

## Scope limitation you should know about before reading further

The proof of concept covers **5 atoms**: `gd-button`, `gd-checkbox`, `gd-input`, `gd-select`,
`gd-typography`. CTORNDSD-646's PoC section also names Card, Modal, and one domain-specific
component; **those were dropped by direction and will not be built.**

The consequence is concrete and affects how much weight the effort estimate can carry. Against the
7 component categories in `01-current-architecture.md`, the ported atoms cover only **2** —
native-control wrappers and presentational. There is **no measured data point** for form,
interactive, overlay, data-heavy, or domain-specific components. In particular, no overlay component
was ported, so the focus-trapping, scroll-locking, and native-`<dialog>`-versus-portal questions
remain open, and **35 of the 63 complexity ratings are extrapolated** rather than calibrated
(`12-complexity-matrix.md`).

**`Select` is a reduced-scope rebuild**, per the Confluence page. This matters more than it first
appears, because `Select` is the most complex of the 5 and therefore carries the most weight in any
per-component effort extrapolation. The parts that _were_ validated are real and load-bearing — the
native `popover` attribute genuinely replaces the React original's hand-rolled portal plus
`document.addEventListener` outside-click logic, verified with trusted browser input (**measured**,
`FINDINGS.md` §6) — but the port is not feature-equivalent to `atoms/Select`. `12-complexity-matrix.md`
must not treat it as a full-fidelity data point.

## What the work actually is

Applying `05-native-html-guidelines.md`'s rule **before** costing changes the shape of the migration.
A component earns a custom element only if it owns behavior the browser does not provide _and_ needs
style isolation _and_ has no externally-queried internals. Most presentational and layout components
fail the first test outright.

|                                                                      | Count  | Notes                                                                                              |
| -------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| CSS conversions (native element + shared tokens, or utility classes) | **21** | Cheap, low-risk, no shadow root                                                                    |
| Lit element ports                                                    | **39** | 4 already done → **35 remain**                                                                     |
| Dependency decisions before any porting                              | **3**  | `Chart` (6 × `@visx/*`, no custom-element path), `Carousel` + `ContentCarousel` (one hook to swap) |

**The real remaining port is 35 elements, not 58 components.** That is the most useful number in this
document, and it is materially smaller than a naive reading of the catalog suggests.

## If you are approving or rejecting, read this

**What is proven.** Shadow DOM fixes a real production bug that was already experienced. Bundle size
improves by an order of magnitude. SSR with zero JavaScript works via `@lit-labs/ssr`. Form
participation, CSS Parts, theme switching, and React 19 interop are all measured working. The
single-source-of-truth token binding is real.

**What is not.** Runtime mount stays 2.3–3.4× slower than React. Nested theming has no equivalent —
a genuine capability regression. The compound-component pattern has no Web Components analogue and
gates 5+ components. Next.js emits no Declarative Shadow DOM, so there is no no-JS rendering in the
framework consumers actually use. 35 of 63 estimates are extrapolated, with **zero** evidence for the
9 overlay components.

**The two questions that should decide it:**

1. **Is the CTORNDSD-286 class of style collision a recurring, costly problem?** If yes, Shadow DOM is
   the only option here that measurably fixes it, and that alone can justify the work. If it was a
   one-off, the case rests on bundle size, which is real but less urgent.
2. **What is the minimum browser-support floor?** (Condition 2.) Below Chrome/Edge 111 / FF 123 /
   Safari 16.4, both Declarative Shadow DOM and `popover` stop being available, which removes the SSR
   story and forces fallbacks across the overlay category. **Nobody in this repo can answer this** — it
   needs an organizational answer, and it should be obtained before approval rather than after.

**If approved, do these three things before writing component code:** answer condition 2; evaluate
`@lit/context` (it resolves both nested theming and the compound-component gap); and port `Modal`,
which closes the largest evidence gap in the estimate. All three are Phase 0 in
`13-migration-roadmap.md`.

**A recommended middle path.** Phases 3–5 of the roadmap — build infrastructure, the 21 CSS
conversions, and the 13 form/control ports — are the best-evidenced, lowest-risk two-thirds of the
value. They can be approved independently of the overlay, data-heavy, and domain-specific phases,
which is where the uncertainty concentrates. Approving incrementally is a legitimate answer to a spike
whose evidence is genuinely uneven.

## Premise correction

CTORNDSD-646's description states that GridKit is built with **styled-components**. It is not — it
uses **Emotion** (`@emotion/react` and `@emotion/styled`, both peer dependencies; the `css` prop
rather than the `styled` builder in component code). Every "replacement for styled-components"
requirement in the ticket should be read as "replacement for Emotion". The substance of the
requirement is unaffected, but the mechanisms differ enough to matter — see
`06-styling-theming.md`.

## Reproduce every measurement yourself

Every number in these documents comes from something you can re-run. **All commands are root commands
— no `cd` required.**

```bash
npm run demo:setup    # once: builds dist/ + installs the fixtures (~2-3 min)
npm run demo:index    # the authoritative demo list, with URLs and prerequisites
```

| Claim in these docs                                    | Reproduce with                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Shadow DOM blocks the CTORNDSD-286 collision           | `npm run demo:harness` → `/harness/shell-isolation-check.html`               |
| Zero-JS server rendering via Declarative Shadow DOM    | `npm run check:web-components-ssr`, then open `/harness/ssr-dsd-static.html` |
| Bundle sizes and the regression gate                   | `npm run check:web-components-size`                                          |
| Mount/update speed, incl. the stylesheet-cache result  | `npm run demo:harness` → `/harness/perf-check.html`                          |
| Form participation and `::part()`                      | `npm run demo:harness` → `/harness/form-participation-check.html`            |
| Input cursor guard · Typography gap · Select `popover` | `npm run demo:harness` → `/harness/remaining-findings-repro.html`            |
| Visual fidelity against the real components            | `npm run demo:harness` + `npm run storybook` side by side                    |
| React 19: properties work, custom events don't         | `npm run demo:react19` → read `window.__react19Check`                        |
| Next.js emits no DSD; tokens aren't RSC-safe           | `npm run demo:next`, then `curl -s localhost:5373 \| grep -c shadowrootmode` |
| The a11y bug, and all component behavior               | `npm run test:web-components`                                                |
| Everything non-interactive, as CI runs it              | `npm run verify:web-components`                                              |

Two reproduction caveats worth knowing before you compare numbers:

- **Speed figures are machine-specific.** `10-performance-report.md`'s before/after comparison is valid
  because both halves ran back-to-back on one machine. Your absolute numbers will differ; the
  _percentages_ are the portable result.
- **The perf harness auto-runs on load** and takes ~30 seconds. Results land in the page and on
  `window.__PERF_RESULTS__`, including the raw per-trial arrays.

## Document index

| #   | Document                                                     | Answers                                                                | Owner | Status        |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | ----- | ------------- |
| 01  | [Current architecture](./01-current-architecture.md)         | What exactly is being migrated, and how are the 63 components grouped? | 646a  | **Delivered** |
| 02  | [Architecture options](./02-architecture-options.md)         | Which of the 8 candidate approaches wins, and on what evidence?        | 646a  | **Delivered** |
| 03  | [Monorepo structure](./03-monorepo-structure.md)             | Package layout, boundaries, versioning, release                        | 646a  | **Delivered** |
| 04  | [Component API guidelines](./04-component-api-guidelines.md) | Naming, props, events, slots, a11y, i18n, usage per framework          | 646b  | **Delivered** |
| 05  | [Native HTML guidelines](./05-native-html-guidelines.md)     | Which elements should be custom elements at all?                       | 646a  | **Delivered** |
| 06  | [Styling and theming](./06-styling-theming.md)               | What replaces Emotion, and how does theming work?                      | 646b  | **Delivered** |
| 07  | [Shadow DOM strategy](./07-shadow-dom.md)                    | Open, closed, light, or hybrid?                                        | 646b  | **Delivered** |
| 08  | [React and Next.js](./08-react-and-nextjs.md)                | How do existing consumers use these?                                   | 646b  | **Delivered** |
| 09  | [SSR and hydration](./09-ssr-hydration.md)                   | Does it server-render, and at what cost?                               | 646b  | **Delivered** |
| 10  | [Performance report](./10-performance-report.md)             | Full benchmark matrix and methodology                                  | 646c  | **Delivered** |
| 11  | [Testing and documentation](./11-testing-documentation.md)   | How is this tested and documented?                                     | 646c  | **Delivered** |
| 12  | [Complexity matrix](./12-complexity-matrix.md)               | How hard is each of the 63 components?                                 | 646d  | **Delivered** |
| 13  | [Migration roadmap](./13-migration-roadmap.md)               | In what order, and how do React and Lit coexist?                       | 646d  | **Delivered** |
| 14  | [Risks](./14-risks.md)                                       | What could go wrong, and who owns it?                                  | 646d  | **Delivered** |
