# 08 — React and Next.js Compatibility

**Owner:** CTORNDSD-646b · **Answers:** CTORNDSD-646 acceptance criteria 5 and 10 · **Status:** Delivered

Fixtures: `fixtures/react19-check/` (Vite + React 19.2.8) and `fixtures/next-ssr-check/` (Next.js
16.3.0, App Router, Turbopack, React 19.2.8). Both sit outside npm workspaces with their own
`node_modules`, so React 19 never mixes with the repo's pinned 18.3.1 — verified: the root remains
18.3.1 and `package-lock.json` is untouched.

## 1. Direct usage versus React wrappers — the difference is exactly one thing

The comparison CTORNDSD-646 asks for (acceptance criterion 5) is narrow and now fully measured on
**both** React versions.

| Capability                              | Direct custom element in JSX                                                                                                        | With `@lit/react` wrapper                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Primitive props (`variant`, `label`)    | Works                                                                                                                               | Works                                                           |
| Object / array props (`theme`)          | **Works on React 19** (**measured**, `FINDINGS.md` §17.3) — passed by reference, not stringified. Needs the wrapper on React 18     | Works on both                                                   |
| Custom events (`gd-change`, `gd-input`) | **Does not work on either version.** `onGdChange` fires zero times and is **silently dropped** — no attribute, no warning, no error | Works — `createComponent({ events })` maps them to `onGdChange` |
| Refs                                    | Works — the ref is the element                                                                                                      | Works                                                           |
| Controlled patterns                     | Manual `addEventListener` + property write                                                                                          | Idiomatic `value` / `onGdInput`                                 |

**Recommendation: ship wrappers, support direct usage.** React 19 narrows the gap to events only, but
events are the half that matters for a form library, and the failure is silent. A consumer who writes
`onGdChange` on a bare custom element gets no error and a handler that never fires.

### Generate the wrappers, do not hand-maintain them

Each wrapper is ~5 lines of `createComponent({ tagName, elementClass, react, events })`; the only
per-component input is the event map. Hand-maintaining 63 of them guarantees drift, and — per the
measured silent-drop behavior above — **a missing event entry produces a prop that simply never
fires, with no diagnostic**. That is the strongest argument for code generation in this whole
document. See `03-monorepo-structure.md` §9.

## 2. React 19 — GO condition 3 is closed

Measured against React 19.2.8 (**measured**, §17.3):

```json
{
  "object prop reached the PROPERTY by reference (theme === defaultTheme)": true,
  "object prop stringified into an attribute?": null,
  "boolean prop reached the property": true,
  "theme actually rendered — indicator background": "rgb(255, 184, 0)",
  "addEventListener('gd-change') fired (control)": 1,
  "onGdChange JSX prop fired": 0
}
```

Section 7's documented guidance is confirmed exactly, and `libs/web-components/README.md` has been
updated from "documented guidance" to a measured result. **GO condition 3 is closed.**

## 3. Next.js — two findings that change how this ships

### Finding A: the package must be consumed as built output, never as source

Pointing the fixture at `libs/web-components/src` produced **empty shadow roots on every element** —
components registered, attached a shadow root, and rendered nothing. Cause:

```text
Error: The following properties on element gd-typography will not trigger updates as expected
because they are set using class fields: variant, as, styleVariant, theme.
```

`tsconfig.base.json` sets `experimentalDecorators: true` / `target: es2015` and
`libs/web-components/tsconfig.json` sets `useDefineForClassFields: false`. Vite honors these.
**Turbopack does not apply the consuming project's tsconfig to source outside its own project root**,
so it emits native class fields that shadow Lit's `@property` accessors. Repointing at the built
package restored rendering (shadow content 0 → 350 and 178 bytes) (**measured**, §17.4).

This generalizes beyond Turbopack: **`gd-design-web` must be consumed as built output.** The
`resolve.alias` in `libs/web-components/vite.config.ts` is gated to `command === 'serve'` for this
repo's own hot-reload ergonomics — it is not a consumption pattern, and `03-monorepo-structure.md`'s
release plan should state that consumers get the built package only.

The failure mode is the dangerous kind: no build error, no console error in the common case, just
components that render nothing.

### Finding B: `gd-design-library/tokens` is not RSC-safe

A try/catch probe importing the element module inside a **server component** returned:

```json
{ "ok": false, "error": "TypeError: ...vendored/rsc/react.js.createContext is not a function" }
```

Not the expected `HTMLElement is not defined` — it fails _earlier_. The token barrel transitively
imports `@emotion/react` (via `libs/ui/src/tokens/utils.ts`'s `keyframes`, the same import Section 13
flagged as a bundle-size risk), and `@emotion/react` calls `React.createContext`, which the RSC React
build does not provide (**measured**, §17.4).

So the supposedly framework-agnostic **token** package cannot be imported in a server component. Two
consequences:

- The `'use client'` boundary is **mandatory**, not a stylistic choice.
- A dynamic `import()` inside a try/catch does **not** protect you — Turbopack pulls the module into
  the server graph at resolve time, so this is a build-graph problem, not a runtime one.

This is worth a follow-up beyond the Lit migration: an RSC-safe token entry point (tokens without the
`keyframes` import) would benefit React consumers too.

## 4. Client boundary placement — the working pattern

Verified working in `fixtures/next-ssr-check`:

```tsx
// app/page.tsx — SERVER component. Renders the tags; imports nothing from the package.
<gd-button id="server-button" variant="primary">Server-rendered label</gd-button>
<ClientIsland />
```

```tsx
// app/client-island.tsx — 'use client'. Importing the package here is what registers the elements.
'use client';
import { defaultTheme } from 'gd-design-library/tokens';
import 'gd-design-web';
```

Rules, all measured:

- **A server component may render the tags.** React streams unknown custom-element tags with their
  children into the HTML.
- **Registration must happen in a client component.** That import is what calls
  `customElements.define`.
- **Theme assignment must happen client-side**, because it is a property, not an attribute.
- **The side-effect barrel is viable but blunt.** `import 'gd-design-web'` registers all five
  elements. Per-component `define` entry points (`03-monorepo-structure.md` §3) would let a route
  register only what it renders — the same change that fixes tree-shaking.

## 5. Registration timing and hydration

Elements upgrade correctly after Next hydrates. The server-streamed text is **not lost** — it is
slotted light-DOM content, so `slot.assignedNodes()` returns it (an earlier reading of the inner
`<button>`'s `textContent` as empty was a measurement error on our side: `textContent` excludes
slotted nodes).

The Section 5 discoverability gap holds under Next: after hydration `document.querySelector('h2')`
still returns `null` while the `h2` exists inside `gd-typography`'s shadow root — reinforcing
`05-native-html-guidelines.md`'s verdict that Typography should be native.

## 6. Not attempted

- **Streaming SSR and Suspense boundaries** — not exercised. The fixture is a single static route.
- **Production `next build`** — dev server only.
- **FCP / TTI / CLS / hydration cost** — defined here, executed by 646c as scenario 6 of the benchmark
  matrix so it is measured once and reported in both places.
- **A `@lit-labs/ssr-react` integration** to make Next emit Declarative Shadow DOM. Installed in the
  fixture but not wired up; see `09-ssr-hydration.md` for why it is the pivotal open question.

## 7. Incidental finding worth keeping

Placing a Next.js fixture inside the repo **breaks Nx repo-wide**: Next generates
`fixtures/next-ssr-check/.next/dev/package.json` with no `name`, and Nx then refuses to build the
project graph at all — every `nx` command fails until excluded. Fixed with a `.nxignore` containing
`fixtures/**` (**measured**, §17.4). Any future in-repo Next app needs the same guard.
