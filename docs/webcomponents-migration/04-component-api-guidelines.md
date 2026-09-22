# 04 — Component API Guidelines

**Owner:** CTORNDSD-646b · **Answers:** the API-surface half of CTORNDSD-646's Component Implementation Strategy · **Status:** Delivered

Rules a GridKit Lit component must follow. Each is grounded in a measured result rather than
convention where one exists.

## Naming

| Thing              | Rule                                                              | Example                                      |
| ------------------ | ----------------------------------------------------------------- | -------------------------------------------- |
| Tag                | `gd-` prefix, kebab-case, matching the React component lowercased | `Button` → `gd-button`                       |
| Class              | `Gd` + PascalCase                                                 | `GdButton`                                   |
| Event              | `gd-` prefix, kebab-case, payload in `detail`                     | `gd-change` → `detail: { checked }`          |
| React wrapper prop | `on` + PascalCase event                                           | `gd-change` → `onGdChange`                   |
| CSS part           | Short semantic role, **not** the internal class name              | `::part(content)`, not `.gd-button__content` |

Part names are public API; internal classes are not. `gd-button`'s dynamic stylesheet targets
`.gd-button__content`, and that class may change — the part name must not.

## Attributes versus properties

**Default to a reflected attribute.** Use `attribute: false` only when the property has a meaning an
attribute cannot express.

There is exactly one such case in the ported set, and it has consequences worth generalizing:

> `gd-checkbox.checked` is `attribute: false` because the controlled/uncontrolled distinction depends
> on `checked !== undefined`, and an HTML boolean attribute can only be present or absent — it cannot
> represent "unset" (**measured**, `FINDINGS.md` §8).

**Rule: any nullable or optional boolean prop hits this same constraint.** Two follow-on costs, both
measured (§17.1):

1. The distinction is only reachable via the JS property. Markup cannot express "uncontrolled".
2. **The property becomes a poor mirror of state.** `gd-checkbox.checked` reads `undefined` for an
   uncontrolled checkbox _even when it is checked_. Native `HTMLInputElement.checked` always returns a
   boolean. Document this per component; do not let consumers assume native parity.

**Rule: form-reset defaults must be captured explicitly.** A native control reads its reset value from
an _attribute_ at reset time. With `attribute: false` there is no attribute, so the default must be
captured on first connect — and assigning the property later changes current state but **not** what
`form.reset()` restores. That asymmetry is real and must be documented, not smoothed over.

## Complex data properties

Objects and arrays are properties only, `attribute: false`. Two measured constraints:

- **Reference equality drives re-render.** `theme` is a normal Lit reactive property compared by
  reference: consumers must assign a **new** object. Mutating in place does nothing (**measured**, §13).
- **React 19 assigns them natively**; React 18 needs `@lit/react` (**measured**, §17.3).

## Events

**Rule: every custom event needs a React wrapper entry. There is no version of React where this is
optional.** `onGdChange` on a bare custom element fires zero times on both 18 and 19, and is **silently
dropped** — no attribute, no warning, no error (**measured**, §17.3). Generate the wrapper layer rather
than hand-maintaining it, precisely because the failure is silent.

Events are `bubbles: true, composed: true` so they cross the shadow boundary. Native events that
already bubble (`click`) need no re-dispatch.

## Slots

Named slots for structural children (`icon-start`, `icon-end`, `adornment-start`, `placeholder`).
Default slot for content.

**Rule: only render a slot's wrapper element when the slot has assigned content.** An always-rendered
empty wrapper still occupies a `gap` track between flex children, which the React original — which
renders nothing when absent — does not. Track with `slotchange` (**measured**, §12 follow-up).

**Slotted content is light DOM.** It survives SSR and is returned by `slot.assignedNodes()`, but it is
**not** in the shadow root's `textContent` — a real trap when writing assertions (**measured**, §17.4).

## Public methods

Keep the surface minimal and native-shaped. The form-associated components expose exactly what
`HTMLInputElement` does: `form`, `validity`, `validationMessage`, `willValidate`, `checkValidity()`,
`reportValidity()`.

**Not implemented:** imperative methods like `.focus()`. Note for the roadmap that `useImperativeHandle`
appears in the real catalog (`layout/ChatContainer`), and no component with an imperative handle has
been ported — so the cost of re-expressing that surface as element methods is **not attempted**.

## Focus management

- Use real `:focus-visible`, not JS-tracked interaction state. The browser's style engine owns
  interaction matching (**measured**, §12).
- Reset the UA outline (`button:focus-visible { outline: none }`) when drawing a custom ring, or you
  get two rings — a measured, reported bug (**measured**, §12 second follow-up).
- **`delegatesFocus` is not needed for form validation.** Passing the inner control as `setValidity`'s
  anchor is sufficient for the browser to focus it (**measured**, §17.1), and `delegatesFocus` would
  disturb the matched `:focus-visible` treatment.

## Form participation and validation

`static formAssociated = true`, `attachInternals()` **in the constructor** (it throws later), plus
`name`, `required`, and the lifecycle callbacks `formResetCallback`, `formDisabledCallback`,
`formStateRestoreCallback`. All verified (**measured**, §17.1).

**Rule: match native submission semantics exactly.** An unchecked checkbox submits **nothing** —
`setFormValue(null)`, so the key is absent from `FormData` — not an empty string.

**Rule: form reset must not fire a change event.** Native controls do not. This forced a distinct
`resetTo` action in `gd-design-core`, separate from `syncControlledValue`, which deliberately preserves
its value (**measured**, §17.1).

## Accessibility

- Shadow DOM flattens into the accessibility tree; screen readers see real roles. Verified further:
  `invalid="true"` and ancestor-`<fieldset>` `disabled` both propagate (**measured**, §17.1).
- **Do not rely on light-DOM tag queries reaching internals** — they cannot (**measured**, §5). Where
  external discoverability matters, ship native (`05-native-html-guidelines.md`).
- **Visually-hidden internals are not hittable.** `gd-checkbox`'s native input is `0x0`, so trusted
  clicks must target the label or indicator (**measured**, §17.1). E2E suites need documented hooks.

## Localization and directionality

**Not attempted.** No ported component carries user-facing strings, formatted values, or
direction-sensitive layout. `Price`, `Table`, and `Breadcrumbs` would exercise all three, and none was
ported. Flagged in `14-risks.md` rather than answered with a guess.

## Loading and error states

`gd-button` implements `isLoading` with a real spinner and `aria-busy` (**measured**, §9). `gd-input`
carries `helperText` with per-variant colour. Error state now also flows through constraint validation
(`:invalid`, `validationMessage`), so components should prefer the platform mechanism over a bespoke
`error` prop where one exists.

## Usage examples

### Plain HTML

```html
<gd-button variant="primary">Save</gd-button>
<gd-input label="Email" name="email" required></gd-input>

<script type="module">
  import 'gd-design-web';
  import { defaultTheme } from 'gd-design-library/tokens';
  document.querySelectorAll('gd-button, gd-input').forEach((el) => (el.theme = defaultTheme));
</script>
```

A real theme is **mandatory**, not cosmetic: the components resolve the real token files, whose own
fallbacks are debug placeholder strings, so a themeless render produces invalid CSS (**measured**,
§§13, 16).

### Lit

```ts
html`<gd-button variant="primary" .theme=${defaultTheme} @click=${this._onSave}>Save</gd-button>`;
```

### React

```tsx
import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdCheckbox as GdCheckboxElement } from 'gd-design-web';

export const GdCheckbox = createComponent({
  tagName: 'gd-checkbox',
  elementClass: GdCheckboxElement,
  react: React,
  events: { onGdChange: 'gd-change' },
});

<GdCheckbox theme={defaultTheme} checked={checked} onGdChange={(e) => setChecked(e.detail.checked)}>
  Accept terms
</GdCheckbox>;
```

The `events` map is required on **both** React 18 and 19.

### Next.js (App Router)

```tsx
// app/page.tsx — server component: renders tags, imports nothing from the package
<gd-button variant="primary">Save</gd-button>
<ClientIsland />
```

```tsx
// app/client-island.tsx
'use client';
import { defaultTheme } from 'gd-design-library/tokens';
import 'gd-design-web';
```

`'use client'` is **mandatory** — the token barrel cannot be imported in a server component
(**measured**, §17.4). See `08-react-and-nextjs.md`.

### Vue

```vue
<template>
  <gd-button variant="primary" :theme.prop="theme" @click="onSave">Save</gd-button>
</template>
```

Vue handles custom elements natively; `.prop` forces property assignment for objects, and `@gd-change`
binds custom events directly. **Reasoned, not verified** — no Vue fixture was built.

### Angular

```html
<gd-button variant="primary" [theme]="theme" (gd-change)="onChange($event)">Save</gd-button>
```

Requires `CUSTOM_ELEMENTS_SCHEMA` in the consuming module. **Reasoned, not verified** — no Angular
fixture was built.
