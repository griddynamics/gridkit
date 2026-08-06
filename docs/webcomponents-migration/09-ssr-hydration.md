# 09 — SSR and Hydration

**Owner:** CTORNDSD-646b · **Answers:** CTORNDSD-646 acceptance criterion 9 · **Status:** Delivered

## The headline

Two results that look contradictory until you see what separates them:

| Environment                | Declarative Shadow DOM emitted?                                         | No-JS rendering?                                              |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| `@lit-labs/ssr` standalone | **Yes** (**measured**, `FINDINGS.md` §2)                                | **Yes** — fully styled with zero `<script>` tags              |
| **Next.js App Router**     | **No** — `<template shadowrootmode>` count is `0` (**measured**, §17.4) | **No** — bare tags, unstyled text, and **no headings at all** |

Section 2's result is real and stands. It is also **`@lit-labs/ssr`-specific**. It does not happen
automatically in the framework the consuming applications actually use, and nothing in the original
spike claimed otherwise — the gap simply had not been tested until now.

This is the single most consequential correction 646b makes to the spike's SSR story.

## What the Next.js server HTML actually contains

Fetched with `curl`, so zero JavaScript executed:

```html
<gd-button id="server-button" variant="primary">Server-rendered label</gd-button>
<gd-typography id="server-typography" variant="h2" as="h2">Server-rendered heading</gd-typography>
```

- `<template shadowrootmode>` count: **0**
- `<h2>` count: **0**

React streams the custom-element tags and their children happily. But with JavaScript disabled or
still loading, a consumer sees unstyled text — and, because `gd-typography` renders its `h2` _inside_
the shadow root, **the page has no headings for a crawler that does not execute JS**. That is a
concrete SEO consequence, not a theoretical one, and it independently reinforces
`05-native-html-guidelines.md`'s verdict that Typography should ship native.

After hydration everything upgrades correctly: shadow roots populate, the server-streamed text is
slotted rather than lost, and a real theme colour renders.

## Option comparison

| Option                               | Verdict                                                                                                                                                       | Basis                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Client-only custom element rendering | **What Next gives you today.** Works, but no no-JS content and a flash of unstyled text                                                                       | **measured**, §17.4                                 |
| Declarative Shadow DOM               | **The goal.** Fully styled with zero JS                                                                                                                       | **measured**, §2                                    |
| Lit SSR (`@lit-labs/ssr`)            | Produces DSD correctly, standalone                                                                                                                            | **measured**, §2                                    |
| Lit hydration                        | Reuses the server-rendered DOM node rather than discarding it — verified via a pre-hydration `data-` marker that survived, and the element stayed interactive | **measured**, §2                                    |
| React SSR with Web Component islands | The fixture's working pattern: server component renders tags, client island registers                                                                         | **measured**, §17.4 and `08-react-and-nextjs.md` §4 |
| `@lit-labs/ssr-react` inside Next    | **Not attempted.** Installed in the fixture, not wired up. This is the pivotal open question                                                                  | —                                                   |
| Server-rendered fallback markup      | **Reasoned.** Slotted light-DOM content already survives; deliberate fallback markup in slots would give unstyled-but-present content without DSD             | reasoned                                            |
| Progressive enhancement              | Follows from whichever of the above is chosen                                                                                                                 | reasoned                                            |

## Recommended strategy

**Short term (what works today):** the island pattern — server components render the tags, a client
component registers the elements and assigns themes. Accept client-only shadow rendering, and place
`gd-typography` and `gd-link` as native elements so the server HTML retains real semantics and
headings.

**The decision that needs making:** whether Next must emit Declarative Shadow DOM. If yes, wire
`@lit-labs/ssr-react` and re-measure. That work is scoped but **not attempted** here, and it is the
right next step for whoever owns SSR fidelity. The prerequisite finding is already in hand:
`gd-design-library/tokens` cannot be imported in a React Server Component at all
(`08-react-and-nextjs.md` §3, Finding B), so an RSC-safe token entry point is a dependency of any
server-side rendering of these components — not an optimization.

**Fallback:** if DSD proves impractical under Next, the honest position is that these components are
client-rendered islands, and any content that must exist without JavaScript stays in native elements.
That is a legitimate architecture; it just needs to be a stated decision rather than an accident.

## Measurements deferred to 646c

FCP, TTI, layout shift, and hydration cost are **defined here and executed by 646c** as scenario 6 of
the benchmark matrix, so they are measured once and reported in both documents. `10-performance-report.md`
owns the numbers.

## Browser support — the unresolved prerequisite

Declarative Shadow DOM is Baseline "newly available": Chrome/Edge 111+, Firefox 123+, Safari 16.4+.
Section 2's result was obtained on this environment's evergreen Chromium.

**GO condition 2 is open and cannot be closed from inside this repo.** The organization's real
minimum-supported-browser matrix determines whether DSD and `popover` can be load-bearing at all. If
the floor sits below those versions, the no-JS story is unavailable regardless of what Next does, and
`gd-select`'s `popover`-based dismissal (**measured**, §6) needs a fallback. Carried to `14-risks.md`.

## Existing SSR contract that must not regress

`libs/ui` already ships `ssr-check.mjs` and `rsc-render-check.mjs` as 2 of the 10 `verify:ui` gates
(`01-current-architecture.md` §6). A Lit port must not regress them, and — per Finding B — RSC
compatibility for the token package is currently **worse** than that gate implies for anything
importing tokens through the Emotion-dependent path. Worth confirming whether `rsc-render-check`
exercises the `./tokens` subpath specifically.
