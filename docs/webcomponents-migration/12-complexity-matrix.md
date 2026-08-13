# 12 — Component Migration Complexity Matrix

**Owner:** CTORNDSD-646d · **Answers:** CTORNDSD-646 acceptance criterion 14 · **Status:** Delivered

**Supersedes** `FINDINGS.md`'s "Extrapolated full-catalog migration cost" paragraph. Where the two
disagree, this document wins.

## The headline: it is not a 63-component port

Applying `05-native-html-guidelines.md`'s decision rule **before** costing changes the shape of the
work substantially. A component only earns a Lit custom element if it owns behavior the browser does
not provide natively _and_ renders a surface needing isolation _and_ nothing external must query its
internals. Most presentational and layout components fail the first test — they have no behavior at
all — so they are **stylesheet work, not element work**.

| Delivery mode                                                   | Count  | Meaning                                           |
| --------------------------------------------------------------- | ------ | ------------------------------------------------- |
| **CSS** — native element + shared token CSS, or utility classes | **21** | No custom element. Token-driven styling only      |
| **Element** — a Lit custom element                              | **39** | Of which **4 are already ported** → **35 remain** |
| **Blocked** — a dependency decision comes first                 | **3**  | `Chart`, `Carousel`, `ContentCarousel`            |
| **Total**                                                       | **63** |                                                   |

Two consequences worth stating plainly:

1. **The real remaining port is 35 elements, not 58 components.** That is the single most useful number
   in this document.
2. **One of the 5 already-ported atoms falls on the CSS side of the rule.** `gd-typography` should be
   native + shared CSS (`05-native-html-guidelines.md`), so it counts as evidence about the mechanism
   rather than as a component that needed porting. That is a finding, not wasted work — the port is what
   produced the measured discoverability data.

## Rating scale, calibrated against the 4 ported elements

Signals are **measured** — implementation-only line counts (stories, tests, and visual specs excluded)
and occurrence counts of `useState`, `useEffect`/`useLayoutEffect`, `createContext`, and
`useImperativeHandle`, read from `libs/ui/src`.

| Rating | Calibration anchor                                                                                      | Criteria                                           |
| ------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **XS** | —                                                                                                       | < 120 impl LOC, no state, no effects               |
| **S**  | `Typography` (141, 0 state) · `Checkbox` (229, 2 state)                                                 | 120–250 LOC, ≤ 2 state                             |
| **M**  | `Button` (235) with the full prop surface                                                               | 250–450 LOC, or ≥ 3 state, or effects              |
| **L**  | `Input` (453, 18 files)                                                                                 | 450–850 LOC, or context, or an imperative handle   |
| **XL** | `Select` (809, 10 state, 6 effects, 2 context, 2 imperative) — **and that was a reduced-scope rebuild** | > 850 LOC, compound context, or dependency-blocked |

**The XL anchor is the important caveat.** `Select` is the most complex thing actually built, it took
the largest share of the spike, and it is still **not feature-equivalent** to `atoms/Select`
(Confluence, and `01-current-architecture.md` §7). Every XL estimate below is therefore anchored to an
_incomplete_ example, which biases XL low.

## The matrix

Calibration column, three values rather than two — the earlier draft over-claimed by marking unported
components "measured":

- **P** — this component was actually **ported**. Directly measured. 5 components.
- **C** — **calibrated by proximity**: not ported, but a component in the same category was, so the
  rating rests on a comparable port. 23 components.
- **E** — **extrapolated** from static signals only. No component in this category was ported. 35
  components.

`P + C + E = 63`, and the 35 **E** rows are exactly the five categories with no measured data point.

### 1. Presentational — 18 components

| Component            | Tier      | LOC | State | Eff | Mode        | Rating | Cal   |
| -------------------- | --------- | --- | ----- | --- | ----------- | ------ | ----- |
| `Wrapper`            | atoms     | 63  | 0     | 0   | CSS         | XS     | C     |
| `Label`              | atoms     | 74  | 0     | 0   | CSS         | XS     | C     |
| `SliderDots`         | atoms     | 76  | 0     | 0   | CSS         | XS     | C     |
| `Row`                | layout    | 95  | 0     | 0   | CSS         | XS     | C     |
| `Column`             | layout    | 97  | 0     | 0   | CSS         | XS     | C     |
| `Box`                | atoms     | 98  | 0     | 0   | CSS         | XS     | C     |
| `InlineNotification` | molecules | 107 | 0     | 0   | CSS         | XS     | C     |
| `Skeleton`           | atoms     | 108 | 0     | 0   | CSS         | XS     | C     |
| `FlexContainer`      | layout    | 73  | 0     | 0   | CSS         | XS     | C     |
| `Typography`         | atoms     | 141 | 0     | 0   | CSS         | XS     | **P** |
| `Badge`              | atoms     | 153 | 0     | 0   | CSS         | S      | C     |
| `Icon`               | atoms     | 180 | 0     | 0   | CSS         | S      | C     |
| `Loader`             | atoms     | 179 | 0     | 0   | CSS         | S      | C     |
| `Image`              | atoms     | 206 | 3     | 0   | CSS         | S      | C     |
| `ProgressBar`        | molecules | 207 | 0     | 0   | CSS         | S      | C     |
| `Separator`          | atoms     | 237 | 0     | 0   | CSS         | S      | C     |
| `Avatar`             | atoms     | 246 | 2     | 0   | CSS         | S      | C     |
| `Truncate`           | atoms     | 119 | 2     | 2   | **Element** | M      | C     |

**17 CSS, 1 Element.** `Truncate` is the exception: it measures overflow, so it needs JS and an
imperative handle. `Image` and `Avatar` carry load/error state but keep native `<img>` for crawler
discoverability, with the fallback shipped as a documented pattern (`05-native-html-guidelines.md`).

### 2. Native-control wrappers — 10 components

| Component   | Tier  | LOC | State | Eff | Impr | Mode    | Rating | Cal                   |
| ----------- | ----- | --- | ----- | --- | ---- | ------- | ------ | --------------------- |
| `Toggle`    | atoms | 93  | 0     | 0   | 0    | Element | XS     | C                     |
| `Slider`    | atoms | 118 | 2     | 2   | 0    | Element | S      | C                     |
| `InputFile` | atoms | 131 | 0     | 0   | 2    | Element | S      | C                     |
| `Link`      | atoms | 162 | 0     | 0   | 0    | **CSS** | XS     | C                     |
| `Checkbox`  | atoms | 229 | 2     | 3   | 0    | Element | S      | **P**                 |
| `Button`    | atoms | 235 | 0     | 0   | 0    | Element | M      | **P**                 |
| `Switch`    | atoms | 236 | 2     | 2   | 0    | Element | S      | C                     |
| `Textarea`  | atoms | 312 | 2     | 4   | 2    | Element | M      | C                     |
| `Input`     | atoms | 453 | 2     | 0   | 0    | Element | L      | **P**                 |
| `Select`    | atoms | 809 | 10    | 6   | 2    | Element | XL     | **P** — reduced scope |

**1 CSS, 9 Element — the best-evidenced category.** 4 of 10 are ported, and every remaining one is a
form control, so all of them depend on the `ElementInternals` work now proven in 646b
(`07-shadow-dom.md`). This is the category to migrate first.

### 3. Form — 4 components

| Component    | Tier      | LOC | State | Eff | Mode    | Rating | Cal |
| ------------ | --------- | --- | ----- | --- | ------- | ------ | --- |
| `Counter`    | molecules | 209 | 3     | 2   | Element | M      | E   |
| `Form`       | molecules | 164 | 0     | 0   | Element | S      | E   |
| `InputArea`  | organisms | 373 | 2     | 2   | Element | M      | E   |
| `RadioGroup` | molecules | 471 | 2     | 0   | Element | L      | E   |

**All extrapolated.** `RadioGroup` is the risk: a radio group is inherently a _set_ whose members must
coordinate, which is the compound-component problem below.

### 4. Interactive — 10 components

| Component          | Tier      | LOC | State | Eff | Ctx   | Impr | Mode        | Rating | Cal |
| ------------------ | --------- | --- | ----- | --- | ----- | ---- | ----------- | ------ | --- |
| `Breadcrumbs`      | molecules | 138 | 0     | 0   | 0     | 0    | **CSS**     | XS     | E   |
| `Tabs`             | molecules | 211 | 2     | 0   | 0     | 0    | Element     | S      | E   |
| `Rating`           | molecules | 208 | 3     | 0   | 0     | 0    | Element     | M      | E   |
| `Stepper`          | molecules | 241 | 0     | 0   | 0     | 0    | Element     | S      | E   |
| `DragAndDropFiles` | organisms | 284 | 4     | 2   | 0     | 2    | Element     | M      | E   |
| `Accordion`        | molecules | 334 | 2     | 0   | **2** | 0    | Element     | L      | E   |
| `DragAndDrop`      | widget    | 349 | 0     | 0   | 0     | 0    | Element     | M      | E   |
| `Scroll`           | layout    | 391 | 4     | 4   | 0     | 2    | Element     | M      | E   |
| `ContentCarousel`  | organisms | 292 | 2     | 2   | 0     | 2    | **Blocked** | L      | E   |
| `Carousel`         | organisms | 609 | 0     | 2   | 0     | 2    | **Blocked** | L      | E   |

**1 CSS, 7 Element, 2 Blocked.**

### 5. Overlay — 9 components

| Component      | Tier      | LOC | State | Eff | Ctx   | Impr | Mode    | Rating | Cal |
| -------------- | --------- | --- | ----- | --- | ----- | ---- | ------- | ------ | --- |
| `Portal`       | layout    | 61  | 0     | 2   | 0     | 0    | Element | S      | E   |
| `Dropdown`     | molecules | 103 | 0     | 0   | **2** | 0    | Element | L      | E   |
| `DropdownItem` | molecules | 115 | 0     | 0   | 0     | 0    | Element | S      | E   |
| `Modal`        | organisms | 242 | 0     | 2   | 0     | 0    | Element | M      | E   |
| `ImagePreview` | organisms | 332 | 4     | 5   | 0     | 0    | Element | M      | E   |
| `Menu`         | molecules | 390 | 4     | 2   | 0     | 2    | Element | L      | E   |
| `Snackbar`     | molecules | 410 | 4     | 4   | 0     | 0    | Element | M      | E   |
| `Tooltip`      | molecules | 419 | 4     | 4   | 0     | 0    | Element | M      | E   |
| `SearchModal`  | organisms | 498 | 0     | 0   | 0     | 0    | Element | L      | E   |

**All 9 Element, all extrapolated — and this is the highest-risk category in the catalog.** No overlay
was ported, so focus trapping, scroll locking, `inert`, and the native-`<dialog>`-versus-portal
decision are entirely uninvestigated (`07-shadow-dom.md`).

The one real datum in this category's favour: `gd-select` proved the native `popover` attribute
replaces hand-rolled portal + outside-click logic, with trusted-input verification
(`FINDINGS.md` §6). That is genuine evidence for the _dismissal_ half of the problem and none for the
focus-management half. **Treat every L here as potentially XL.**

### 6. Data-heavy — 3 components

| Component | Tier      | LOC  | State | Eff | Impr | Mode        | Rating | Cal |
| --------- | --------- | ---- | ----- | --- | ---- | ----------- | ------ | --- |
| `List`    | molecules | 134  | 0     | 0   | 0    | Element     | S      | E   |
| `Table`   | molecules | 1164 | 5     | 3   | 2    | Element     | **XL** | E   |
| `Chart`   | organisms | 2250 | 12    | 17  | 0    | **Blocked** | **XL** | E   |

`Table` at 1164 impl LOC across 12 files is the largest non-blocked component in the catalog — 1.4×
`Select`, which was itself only completed at reduced scope.

### 7. Domain-specific — 9 components

| Component        | Tier      | LOC | State | Eff | Impr | Mode    | Rating | Cal |
| ---------------- | --------- | --- | ----- | --- | ---- | ------- | ------ | --- |
| `AvatarUser`     | molecules | 95  | 0     | 0   | 0    | **CSS** | XS     | E   |
| `Price`          | molecules | 104 | 0     | 0   | 0    | Element | S      | E   |
| `Search`         | organisms | 139 | 0     | 0   | 2    | Element | S      | E   |
| `AttachmentFile` | molecules | 153 | 0     | 0   | 0    | Element | S      | E   |
| `Header`         | organisms | 294 | 2     | 0   | 0    | Element | M      | E   |
| `ChatBubble`     | organisms | 310 | 0     | 0   | 0    | **CSS** | S      | E   |
| `Sidebar`        | organisms | 317 | 2     | 2   | 0    | Element | M      | E   |
| `ChatContainer`  | layout    | 322 | 2     | 0   | 2    | Element | M      | E   |
| `Card`           | organisms | 679 | 0     | 0   | 0    | Element | L      | E   |

**2 CSS, 7 Element.** `Card` has zero state but **40 files** — it is a compound component whose cost is
composition and slotting, not logic. Line counts alone would rate it M; the file count is what makes it
L.

## Dependency-blocked components — a decision, not a port

These cannot be estimated as porting work at all until a dependency decision is made.

| Component                     | Dependency             | Assessment                                                                                                                                                                                                                                                                         |
| ----------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Chart`                       | 6 × `@visx/*`          | **No custom-element path exists.** visx is React-first by design. Either `Chart` stays React-only indefinitely, or a different charting approach is selected. A roadmap decision, not an implementation task                                                                       |
| `Carousel`, `ContentCarousel` | `embla-carousel-react` | **Tractable.** The React binding is confined to a single hook (`hooks/useCarousel/useCarousel.tsx`) and the underlying `embla-carousel` is framework-agnostic — replace one hook with direct core usage and both components follow (**measured**, `01-current-architecture.md` §2) |

Also surfaced and unrelated to porting: **`@react-spring/web` appears to be an unused dependency** —
zero usages anywhere in `libs/`, and not in `knip.json`'s ignore list.

## The compound-component problem — unsolved, and it spans 5 components

`01-current-architecture.md` counted 6 `createContext` sites. Three are parent-to-descendant
coordination _within_ one component's subtree: `Select`, `Dropdown`, and `Accordion`. Web Components
have **no context primitive**, and the compound pattern
(`<Dropdown><DropdownItem/></Dropdown>`) has no direct analogue.

Affected, directly or by the same shape: `Dropdown` + `DropdownItem`, `Accordion`, `RadioGroup`,
`Tabs`, `Menu`. `Select` shipped only because it was reduced in scope.

`06-styling-theming.md` recommends evaluating `@lit/context` for nested themes; **the same evaluation
answers this**, and it should happen once, early, for both. It is the highest-leverage unknown in the
matrix — it gates 5+ components across three categories.

## Calibration honesty

| Category                | Components | Measured data point?                                       |
| ----------------------- | ---------- | ---------------------------------------------------------- |
| Native-control wrappers | 10         | **Yes — 4 ported.** Strong                                 |
| Presentational          | 18         | **Yes — Typography ported**, and it landed on the CSS side |
| Form                    | 4          | **No**                                                     |
| Interactive             | 10         | **No**                                                     |
| Overlay                 | 9          | **No**                                                     |
| Data-heavy              | 3          | **No**                                                     |
| Domain-specific         | 9          | **No**                                                     |

**35 of 63 components sit in categories with no measured data point** — exactly the 35 rows marked
**E** above. Each is a reasoned estimate from static signals, not a projection from a comparable port.
The other 28 split into **5 ported (P)** and **23 calibrated by proximity (C)**, where a component in
the same category was ported. This is a direct consequence of the decision not to extend the proof of concept, and
it is the dominant uncertainty in the effort estimate.

The two sharpest gaps: **Overlay** (9 components, zero focus-management evidence) and **Table/Chart**
(both XL, both larger than the largest thing actually built).

## Effort estimate

Stated as a range with confidence, not a point number. Arithmetic: **21 CSS + 35 element ports + 3
dependency decisions = 59 remaining items** (4 of the 39 elements are already done). The XL row below is
a subset callout, not an additional line item.

| Class                                                          | Count remaining                            | Basis                                                                                                              |
| -------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| CSS conversions                                                | 21                                         | Cheap and low-risk — token-driven stylesheet work, no element, no shadow root, no tests against browser mechanisms |
| Element ports, calibrated by proximity (**C**)                 | 6 (rest of native-control wrappers)        | Highest confidence — same category as 4 ported components                                                          |
| Element ports, extrapolated (**E**)                            | 29                                         | Low confidence                                                                                                     |
| XL element ports — **a subset of the row above, not additive** | 2 (`Table`, `Card`) + `Chart` if unblocked | Lowest confidence; both exceed the largest completed port                                                          |
| Dependency decisions                                           | 3                                          | Not porting work                                                                                                   |
| Cross-cutting prerequisites                                    | —                                          | `@lit/context` evaluation, wrapper generation, registration/tree-shaking fix, test infrastructure per component    |

**Confidence: low-to-moderate overall.** Moderate for native-control wrappers; low for the other five
categories.

**What would narrow it, in order of leverage:**

1. **Port one overlay component** (`Modal` is the natural choice). It closes the largest evidence gap
   and answers focus trapping, scroll locking, and `<dialog>`-versus-portal in one pass.
2. **Resolve `@lit/context`** — gates 5+ compound components and nested theming simultaneously.
3. **Port `Card`** — the compound/slotting cost class, and a prerequisite for judging `Table`.
4. **Decide `Chart`'s dependency question** — it either leaves the catalog or becomes the largest single
   item in it.

Any estimate produced before item 1 should be treated as an order-of-magnitude figure. The spike
deliberately sampled 5 atoms chosen to stress 5 _risk axes_, not to be representative — so
extrapolating a per-component average from them would be a misuse of the data, and this document does
not do it.
