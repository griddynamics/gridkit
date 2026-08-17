# 06 — Styling and Theming

**Owner:** CTORNDSD-646b · **Answers:** CTORNDSD-646 acceptance criterion 8 · **Status:** Delivered

> **Premise correction.** CTORNDSD-646 says GridKit uses styled-components. It uses **Emotion**. See
> [README](./README.md#premise-correction). The requirement is unaffected; the mechanisms differ.

## What is being replaced

Emotion via the `css` prop, with `(theme) => value` token trees resolved through
`get(theme, path, default)` and nested pseudo-selector keys (`'&:hover, &.hover'`) that Emotion
compiles. Full detail in `01-current-architecture.md` §3 — not restated here.

## Recommended replacement: per-instance Constructable StyleSheet

`gd-button` is the reference implementation (**measured**, `FINDINGS.md` §12): a dedicated
`CSSStyleSheet` appended once to `shadowRoot.adoptedStyleSheets`, with `render()` building real CSS
text from the resolved tokens and swapping it in via `replaceSync` — guarded by a string-equality
check so unrelated re-renders don't force a reparse.

Why this over the alternatives:

| Mechanism                                 | Verdict                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Per-instance Constructable StyleSheet** | **Recommended.** Real CSS pseudo-classes (`:hover`, `:disabled`) so the browser's style engine owns interaction matching, exactly as Emotion's `&:hover` does — instead of the JS-tracked `mouseenter`/`mousedown` flags the first port used (**measured**, §12) |
| Inline styles / `styleMap`                | Works, still used by the other four components, but cannot express pseudo-classes — which is why `gd-button` moved off it                                                                                                                                        |
| CSS custom properties for every token     | A second theming mechanism alongside the token objects. See §5 below                                                                                                                                                                                             |
| Static baked CSS                          | No runtime theme override                                                                                                                                                                                                                                        |
| Global CSS                                | Cannot cross the shadow boundary; defeats the isolation win                                                                                                                                                                                                      |

**Interaction state must be CSS, not JS.** That is the substantive lesson from §12 — the first port
hand-rolled an approximation of what the platform already does.

## Token source of truth

Components import the **real** token object from `gd-design-library/tokens` and resolve it with
`resolveThemeTree`. No hand-mirrored copy exists (**measured**, §§13, 16) — proved by editing
`libs/ui/src/tokens/button.ts` and watching a live element change through HMR alone, then reverting.

Two rules this establishes:

- **Generic mechanism in the core, library-specific knowledge in the adapter.** `resolveThemeTree` has
  no opinion about which token tree it walks, which is what keeps `gd-design-core` free of any
  `gd-design-library` dependency (`03-monorepo-structure.md` §2).
- **Never re-introduce a second copy.** Sections 13 and 16 deleted five hand-mirrored resolvers
  precisely to eliminate competing sources of truth.

### Two measured traps

1. **The real token files' fallbacks are debug placeholder strings**, e.g.
   `get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary')`. A themeless render produces
   invalid CSS, not a sane default. This is the real component's own behavior, faithfully reproduced —
   but it means **a real theme is mandatory** in every harness, fixture, test, and story (**measured**,
   §§13, 16).
2. **A partial theme can silently produce invalid CSS.** A test theme missing `values.borderThin`
   yielded `border: "theme.values.borderThin solid #654321"` — an invalid length, which CSSOM rejects
   silently, leaving the previous border in place while every other property on the same object
   applied. It looked like a resolution bug and was not (**measured**, §16).

## Consumer customization — three tiers

Now complete, in precedence order:

1. **A schema-backed component prop** — `variant`, `size`, `rounded`.
2. **The `theme` property** — a whole token tree. Must be a **new object**; reference equality drives
   re-render (**measured**, §13).
3. **`::part()`** — for internals no prop covers. Delivered and verified in 646b (**measured**, §17.2);
   see `07-shadow-dom.md` for the part inventory.

Tier 3 is the one that was missing when the spike ended, and it was the strongest argument against
Shadow DOM. Consumers no longer have to choose between encapsulation and customization.

## Runtime theme switching — verified end-to-end

Not merely "the resolver takes a theme argument". Assigning a full custom theme to a live element
updated, on the very next paint with no manual re-render: resting background, `gap`, `padding`,
`font-family`, the **nested pseudo-selector** paths (hover background via trusted `hover()`, and the
`::after` focus ring's border colour via trusted Tab), and then switched back to `defaultTheme`
correctly — so it is neither one-directional nor sticky (**measured**, §§12, 13, 16).

Verified for all five components, not just Button (**measured**, §16).

## Requirements not yet met

| Requirement                   | Status                                                                                                                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime theme switching       | **Measured working**                                                                                                                                                                     |
| Application overrides         | **Measured working** — pass a custom theme object                                                                                                                                        |
| Component-level customization | **Measured working** — props, `theme`, `::part()`                                                                                                                                        |
| Light and dark modes          | **Not attempted.** No dark theme exists in `libs/ui` to port                                                                                                                             |
| Brand themes                  | **Reasoned.** A theme is a plain object, so multiple brands are multiple objects. Unexercised                                                                                            |
| Nested themes                 | **Not attempted.** React context nests naturally; a per-element property does **not**. This is a genuine capability regression and the most significant gap in this document — see below |
| Tailwind compatibility        | **Not attempted.** Tailwind utilities cannot cross the shadow boundary; `::part()` is the integration surface                                                                            |

### Nested themes are the real gap

`ThemeProvider` nesting is free in React: an inner provider overrides an outer one for its subtree.
A per-element `theme` property has **no equivalent** — each element must be assigned individually,
and nothing propagates down a subtree.

Options, none yet built:

- A `<gd-theme-provider>` element using the Context Protocol (`@lit/context`), which would restore
  subtree semantics.
- CSS custom properties for the subset of tokens that need to cascade — they inherit through shadow
  boundaries natively, which is exactly the property nesting requires.
- Accept the regression and require explicit per-element assignment.

**Recommendation: evaluate the Context Protocol before committing.** It is the mechanism designed for
this problem, and the alternative — assigning themes element by element — is the kind of ergonomic tax
that makes consumers reach for `!important` instead.

## ThemeProvider migration path

| React today                                 | Lit equivalent                          | Notes                              |
| ------------------------------------------- | --------------------------------------- | ---------------------------------- |
| `<ThemeProvider theme={t}>` wrapping a tree | Assign `.theme = t` per element         | No subtree propagation — see above |
| `useTheme()` inside a component             | `this.theme`                            | Direct                             |
| Nested providers                            | **No equivalent yet**                   | The gap above                      |
| Mutating the theme object                   | **Does not work** — assign a new object | Same rule React already follows    |

For the migration, the practical bridge is a small helper that walks a container and assigns `theme` to
every GridKit element within it — which is what every harness and fixture in this spike already does by
hand. That helper should ship rather than be re-written by each consumer.

## Token-to-CSS-custom-property export — deferred, with a reason

`FINDINGS.md` carries this as an open question. **Recommendation: not as a prerequisite.** The current
mechanism is verified working, and a custom-property layer would be a _second_ theming mechanism
alongside the token objects — the exact duplication Sections 13 and 16 spent their effort removing.

It becomes worth revisiting for one specific reason, and it is now a stronger one than when the
question was first raised: **custom properties inherit through shadow boundaries**, which makes them the
natural mechanism for nested themes. If the Context Protocol option above is rejected, this stops being
an optimization and becomes the implementation.

## Figma token distribution

Unchanged by this migration. Tokens remain the source (`libs/ui/src/tokens/`), and the pre-computed
Figma→GridKit lookup tables in `libs/ui/src/ai/figma-maps/` continue to serve design intake. The Lit
components consume the same objects, so a token change reaches React and Lit simultaneously — verified
(**measured**, §§13, 16).
