# 07 — Shadow DOM Strategy

**Owner:** CTORNDSD-646b · **Answers:** CTORNDSD-646 acceptance criterion 7 · **Status:** Delivered

## Recommendation

**Open Shadow DOM as the default**, which is what the ported components already use. Two exceptions
and one hard prerequisite follow.

This is not "Shadow DOM everywhere". `05-native-html-guidelines.md` concludes 5 of the 9 element
groups should not be custom elements at all, so they never reach this decision. This document governs
the components that do.

## Mode comparison

| Axis                      | Open (recommended)                                                                                          | Closed                                                                         | Light DOM                                                        | Hybrid                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------ |
| Style encapsulation       | **Full, measured** — blocks the CTORNDSD-286 collision both directions (**measured**, `FINDINGS.md` §1)     | Identical — encapsulation is not what `mode` controls                          | **None.** Reintroduces the exact bug the migration exists to fix | Per-component; full where it matters |
| Consumer customization    | `::part()` + `theme` property, **measured working** (§17.2)                                                 | `::part()` works, but `shadowRoot` is inaccessible so there is no escape hatch | Unrestricted, which is the problem                               | As open, where used                  |
| Design-token inheritance  | Inheritable properties (`color`, `font-family`) cross; the rest via `theme`                                 | Same                                                                           | Everything inherits                                              | Same                                 |
| Accessibility             | a11y tree flattens correctly; `invalid="true"` and fieldset `disabled` both propagate (**measured**, §17.1) | Same                                                                           | Same                                                             | Same                                 |
| Testing                   | Must pierce `shadowRoot`; jsdom insufficient                                                                | **Worse** — `shadowRoot` is `null`, internals unassertable                     | Easiest                                                          | Mixed                                |
| Analytics / E2E selectors | Light-DOM queries miss internals (**measured**, §5)                                                         | Same, and unfixable                                                            | No impact                                                        | Mixed                                |
| Global typography         | Inherited properties still apply                                                                            | Same                                                                           | Full                                                             | Mixed                                |
| Third-party integrations  | Anything doing `querySelector` on internals breaks                                                          | Same                                                                           | No impact                                                        | Mixed                                |
| SSR / hydration           | Declarative Shadow DOM works standalone (**measured**, §2); **not** under Next (**measured**, §17.4)        | DSD cannot express closed mode                                                 | Trivial                                                          | Mixed                                |
| Debuggability             | Inspectable; `shadowRoot` reachable from the console                                                        | **Materially worse**                                                           | Best                                                             | Mixed                                |

**Closed mode is rejected.** `mode: 'closed'` only hides `element.shadowRoot` — encapsulation comes
from the shadow boundary itself, not from `mode`. It is not a security boundary. So it costs testing,
debugging, and incident triage while buying nothing.

**Light DOM is rejected as a default** because it discards the one measured, previously-experienced
production win.

**Hybrid is the real answer, one layer up:** the per-component custom-element-versus-native decision in
`05-native-html-guidelines.md`. Within a component that _is_ a custom element, mixing modes buys
nothing.

## Exceptions to the default

1. **Components whose semantics must be externally discoverable ship native instead** — Typography and
   Link. This is the correct resolution of the Section 5 gap: don't weaken the shadow root, don't use
   one.
2. **Layout and container primitives ship as utility CSS**, no element and no shadow root — both
   because per-node cost scales with the most-used nodes, and because a percentage width on a shadow
   child resolves against an `auto`-width `:host`, the measured cause of the `gd-select` width collapse
   (**measured**, §10).

## Hard prerequisite

**GO condition 2 remains open and cannot be closed inside this repo.** Declarative Shadow DOM and
`popover` are load-bearing (Chrome/Edge 111+, Firefox 123+, Safari 16.4+). The organization's real
minimum-supported-browser matrix must be confirmed. See `14-risks.md`.

## CSS Parts — delivered

`::part()` is the sanctioned way for consumer CSS to reach inside a shadow root, and it now works —
**measured** (§17.2), with a control proving a plain descendant selector cannot.

| Component     | Parts                                                           |
| ------------- | --------------------------------------------------------------- |
| `gd-button`   | `button`, `content`, `icon-start`, `icon-end`, `spinner`        |
| `gd-input`    | `outer`, `label`, `row`, `input`, `border`, `outline`, `helper` |
| `gd-checkbox` | `label`, `input`, `indicator`                                   |

Part names are the short semantic role, not internal class names — `::part(content)`, not
`.gd-button__content`. The classes are what the dynamic stylesheet targets and may change; part names
are public API and must stay stable.

`gd-select` and `gd-typography` do not yet expose parts. For Typography that is moot under
`05-native-html-guidelines.md`'s verdict; `gd-select` should get them before the package ships.

This closes the "consumer customization" axis, which was the strongest argument against Shadow DOM
before it existed. Consumers now have three tiers: a schema-backed prop, the `theme` property, then
`::part()`.

## Form participation — delivered, with a documented collision

`gd-input` and `gd-checkbox` are form-associated custom elements. Full results in `FINDINGS.md` §17.1.
Everything native forms require works — `form.elements`, `FormData`, constraint validation,
`:valid`/`:invalid`, `formResetCallback`, `formDisabledCallback` via ancestor `<fieldset disabled>` —
and a **trusted** submit on an invalid form is correctly blocked with the inner `<input>` focused.

Three things to carry into the roadmap:

1. **A real bug was found by measuring rather than reviewing.** `formResetCallback` initially used the
   store's `syncControlledValue`, which deliberately _preserves_ the current value (faithful to React)
   and is exactly wrong for reset — the box stayed checked and kept submitting. Fixed by adding a
   distinct `resetTo` action to `gd-design-core`. This is the `attribute: false` collision Section 8
   predicted, and it was real.
2. **Two divergences from native remain**, documented in `libs/web-components/README.md` rather than
   hidden: `gd-checkbox.checked` reads `undefined` for an uncontrolled checkbox even when checked, and
   `form.reset()` restores the value captured at first connect rather than a `checked` attribute.
3. **`delegatesFocus` is not required.** Passing the inner `<input>` as `setValidity`'s anchor is
   enough for the browser to focus it — which matters, because `delegatesFocus` would have disturbed
   the carefully-matched `:focus-visible` treatment (**measured**, §12).

Both verdicts in `05-native-html-guidelines.md` that were _conditional_ on this work — Input and
Checkbox as Lit elements — are now unconditional. That removes the largest risk from the 10-component
native-control-wrapper category.

## Selector and analytics impact

Section 5 measured the gap for Typography; it generalizes to any internal node. Two additions here:

- **Confirmed under Next.js.** After hydration `document.querySelector('h2')` still returns `null`
  while the `h2` exists inside the shadow root (**measured**, §17.4).
- **Zero-size internals are not clickable by role.** `gd-checkbox`'s native input is `0x0`, so a
  trusted click on the checkbox a11y node times out; E2E suites must target the label or indicator
  (**measured**, §17.1). This only surfaced by driving real input.

The mitigation is not to weaken the boundary. It is: native elements where discoverability matters,
`::part()` for styling, and documented stable hooks for E2E.

## Not attempted

**No overlay component was ported**, so focus trapping, scroll locking, `inert`, and the native
`<dialog>`-versus-portal decision are uninvestigated. This follows from the direction not to add new
components, and it leaves the 9-component overlay category with no measured data point. Carried to
`14-risks.md`.
