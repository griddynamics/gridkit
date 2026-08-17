# 05 — Native HTML Versus Custom Element Guidelines

**Owner:** CTORNDSD-646a · **Answers:** CTORNDSD-646 acceptance criterion 6 · **Status:** Delivered

CTORNDSD-646 asks whether _all_ existing GridKit components should become custom elements. The
answer is **no**, and the dividing line is empirical rather than stylistic.

This analysis uses only components that already exist. No component was built for it.

## The question that actually decides it

Shadow DOM is not free. It buys style isolation — the measured fix for CTORNDSD-286 (**measured**,
`FINDINGS.md` §1) — and it charges three things:

1. **Light-DOM discoverability.** `document.querySelector('h1')` cannot reach a heading rendered
   inside a shadow root (**measured**, §5). The accessibility tree is unaffected — screen readers see
   a real heading — so this is a DOM-query gap, not an a11y regression. But SEO crawlers, link
   checkers, browser extensions, analytics selectors, E2E selectors, and testing-library shortcuts
   all use light-DOM queries.
2. **A containing block per element.** A percentage width on a shadow-DOM child resolves against the
   host's box, and `:host` defaults to `auto`. This is not theoretical: `gd-select` collapsed to
   icon-only width and clipped its dropdown text for exactly this reason, fixed by setting an
   explicit width on the host (**measured**, §10).
3. **Per-instance setup cost.** Custom-element upgrade plus shadow-root attachment, paid per node. At
   300 instances this is measurable (**measured**, §14).

So the decision rule is not "is this a component?" but **"does this element own behavior worth paying
isolation for, and does anything outside need to find its internals?"**

## Decision rule

Apply in order; stop at the first match.

| Ship                                    | When                                                                                                                                                                                                                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lit custom element**                  | It owns interaction state or behavior the browser does not provide natively, **and** it renders a visual surface that must survive a hostile host reset, **and** nothing external needs to query its internals by light-DOM tag or attribute                                 |
| **Native element + shared token CSS**   | It renders a real semantic element whose **discoverability matters** (SEO, crawlers, link checkers, analytics, E2E selectors) — even if it carries a little behavior. Behavior small enough to express as a documented pattern or a thin hook does not justify a shadow root |
| **No abstraction — shared utility CSS** | It carries no behavior **and** no visual surface of its own. Pure layout and spacing wrappers                                                                                                                                                                                |
| **Documentation only**                  | The value is a naming convention over CSS that already exists                                                                                                                                                                                                                |
| **React wrapper**                       | Orthogonal, not exclusive — applies **on top of** a Lit element whenever consumers are React. See `08-react-and-nextjs.md`                                                                                                                                                   |

## Verdicts

Behavior signals below are **measured** — line counts and hook/state/effect counts read from each
component's `.tsx`. Bundle figures are **measured** from `FINDINGS.md` §3.

| Group           | Existing component(s)                                 | Behavior signal                                            | Verdict                                        | Confidence      |
| --------------- | ----------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- | --------------- |
| Button          | `atoms/Button`                                        | 82 lines, 0 state                                          | **Lit custom element**                         | High            |
| Input           | `atoms/Input`                                         | 106 lines, 0 state, 7 hooks                                | **Lit custom element** — conditional           | High            |
| Select          | `atoms/Select`                                        | 533 lines, 10 state, 6 effects, 5 context                  | **Lit custom element**                         | High            |
| Checkbox        | `atoms/Checkbox`                                      | 97 lines, 2 state, 3 effects                               | **Lit custom element** — conditional           | High            |
| Link            | `atoms/Link`                                          | 58 lines, 0 state                                          | **Native `<a>` + shared token CSS**            | High            |
| Image           | `atoms/Image`                                         | 91 lines, 3 state                                          | **Native `<img>` + shared token CSS**          | Medium          |
| Typography      | `atoms/Typography`                                    | 46 lines, 0 state                                          | **Native element + shared token CSS**          | High — measured |
| Layout and grid | `layout/Row`, `layout/Column`, `layout/FlexContainer` | 38 / 41 / 30 lines, 0 state each                           | **No abstraction — shared utility CSS**        | High — measured |
| Containers      | `atoms/Box`, `atoms/Wrapper`                          | 41 / 22 lines, 0 state                                     | **No abstraction — shared utility CSS**        | High            |
| Containers      | `layout/ChatContainer`                                | 163 lines, 2 state, `useMediaQuery`, `useImperativeHandle` | **Lit custom element** — it is not a container | Medium          |

### Ship as Lit custom elements

**Button.** The most-used interactive primitive, and CTORNDSD-286 was a button bug — style isolation
is the whole point here. It carries variant, loading, and focus-ring states that native `<button>`
plus a stylesheet cannot express without the host's cascade being able to reach them. Ported at
1.87 kB gzip against 19.07 kB (10.4×). Nothing external needs to query the inner `<button>`.

**Select.** The strongest case in the catalog. The real component is 533 lines with 10 state hooks, 6
effects, and 5 context uses, and it hand-rolls a portal plus a `document.addEventListener`
outside-click listener. The native `popover` attribute genuinely replaces that machinery, verified
with trusted browser input (**measured**, §6). 2.44 kB against 30.09 kB.

Two caveats that do not change the verdict: the port is a **reduced-scope rebuild**, not
feature-equivalent; and the real component's compound-context pattern (`useSelectContext`) has no
direct custom-element analogue and is **not yet investigated**.

**Input and Checkbox — conditional on `ElementInternals`.** Both clear the behavior bar: Input owns
label, helper text, border, and controlled-value semantics including the measured cursor-stability
guard (**measured**, §4); Checkbox owns indeterminate state and a custom indicator that native
`<input type="checkbox">` styling cannot reproduce. Ratios are strong — 10.4× and 15.4×.

**The condition is load-bearing.** Neither participates in a native `<form>` today; both are listed
as unsupported in `libs/web-components/README.md`. A form control that does not submit is not a
replacement for one that does. If `ElementInternals` cannot support the existing controlled-value
model — and `gd-checkbox` already had to declare `checked` as `attribute: false` because an HTML
boolean attribute cannot express "unset" (**measured**, §8) — these two verdicts should be revisited,
along with the other 8 components in the native-control-wrapper category. 646b resolves this.

**ChatContainer, which is not really a container.** Grouped under "Containers" by name only. At 163
lines with `useMediaQuery`-driven responsive sidebar state and an `useImperativeHandle` public
surface, it is a domain-specific component with real behavior. It belongs with the Lit elements.
Confidence is Medium because no component with an imperative handle has been ported, so the cost of
re-expressing that surface as element methods is unmeasured.

### Ship as native elements with shared token CSS

**Typography — the clearest verdict, and the only one with direct measured support.** It is 46 lines
with zero state; its entire job is mapping a `variant` to token-driven CSS. As a custom element it
achieves the best bundle ratio in the catalog (0.88 kB against 18.09 kB, 20.6×) and simultaneously
hides a real `<h1>` from every light-DOM query (**measured**, §5). Written as `<h1 class="gk-h1">`
against a shared stylesheet, consumers get a discoverable heading _and_ the byte saving, because a
stylesheet is what delivers the saving in the first place. Paying a shadow root to hide your own
semantics is the wrong trade.

**Link.** 58 lines, zero state, no behavior. An `<a>` inside a shadow root is invisible to crawlers,
link checkers, and `a[href]` queries — and SEO is precisely where that matters most. There is no
behavioral gain to offset it.

**Image — Medium confidence.** It does carry behavior: 3 state hooks for load, error, and fallback.
But `<img>` discovery by crawlers is load-bearing, and `srcset`, `sizes`, `loading`, and
`fetchpriority` are native attributes a wrapper must re-plumb and keep current. Ship native plus a
documented fallback pattern (or a thin hook) rather than an element.

What would flip this to a custom element: if the skeleton/fallback behavior proves substantial enough
that consumers reimplement it inconsistently. That is a product observation, not something this spike
can settle.

### Ship no abstraction

**Layout and grid (`Row`, `Column`, `FlexContainer`) and containers (`Box`, `Wrapper`).** 22–41 lines
each, zero state, zero behavior. Pure flex and spacing wrappers whose value is entirely token-driven
CSS.

Three reasons this is the firmest "no" in the table:

1. **They are the highest-count nodes on any page.** Per-instance upgrade and shadow-root attachment
   cost scales with exactly the elements you use most.
2. **Shadow DOM actively fights layout.** A percentage width on a shadow child resolves against the
   host, and `:host` is `auto` by default — the measured `gd-select` width collapse (**measured**,
   §10). A layout primitive is where that failure mode is most likely and most confusing, because the
   symptom is a child rendering at `0px` rather than an error.
3. **Nothing is gained.** There is no behavior to encapsulate and no visual surface of their own to
   protect from the host's reset.

Utility classes over the same tokens deliver the same result at zero runtime cost.

## Consequence for the recommendation

Of the 9 groups CTORNDSD-646 names, **4 should be Lit custom elements and 5 should not.** This does
not weaken the case for Lit — it sharpens it. The measured wins concentrate exactly where behavior
and style isolation coincide, and the components that should stay native are the ones that never
needed isolation.

It does, however, mean the migration is smaller than a straight 63-component port.
`12-complexity-matrix.md` must apply this rule before costing the catalog: the 18 presentational and
5 layout/container components are largely stylesheet work, not element work. Two of the 5
already-ported atoms — `gd-typography` most clearly — fall on the native side of this rule, which is
a finding, not a mistake: the port was built to test the mechanism, and it did.

## Story description updates

Each verdict is recorded in the corresponding existing component's Storybook story, in the
`parameters.docs.description.component` block, following the convention in
`libs/ui/src/components/molecules/RadioGroup/RadioGroup.stories.tsx`. All 13 target stories already
had a component-level description block, so the verdict is **appended** to each rather than replacing
anything.

This is documentation-only. No component source, `*Styled.tsx`, `*.types.ts`, or token file is
modified.
