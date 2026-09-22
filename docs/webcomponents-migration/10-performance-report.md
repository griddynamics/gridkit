# 10 — Performance Report

**Owner:** CTORNDSD-646c · **Answers:** CTORNDSD-646 acceptance criterion 11 · **Status:** Partially delivered

## The headline: the hypothesis was right, and it is still not enough

`FINDINGS.md` §14 measured React mounting ~2× faster than Lit and offered an untested explanation —
that `gd-button` rebuilt its own stylesheet per instance while Emotion caches a class per unique style
combination. **GO condition 5 existed to test that.** It is now tested.

A content-keyed Constructable StyleSheet cache was implemented (one shared, immutable sheet per unique
CSS text) and measured before/after **in the same session on the same machine** — which matters,
because this machine is slower than the one §14 ran on, so §14's absolute numbers are not comparable.

| Measurement (median of 5)     | Before cache | After cache  | Change         | React, same session |
| ----------------------------- | ------------ | ------------ | -------------- | ------------------- |
| Mount 300 identical           | 48.9 ms      | **24.5 ms**  | **50% faster** | 10.6 ms             |
| Mount 300 mixed (5 variants)  | 49.1 ms      | **23.6 ms**  | **52% faster** | —                   |
| Mount 1 (per button, 50 reps) | 0.364 ms     | **0.248 ms** | **32% faster** | 0.072 ms            |
| Update 300 (variant swap)     | 20.8 ms      | **9.0 ms**   | **57% faster** | 10.0 ms             |

**Verdict, stated plainly: hypothesis confirmed, gap narrowed, gap not closed.**

- The per-instance stylesheet work was roughly **half** of Lit's mount cost. §14's reasoning was
  correct.
- Lit is now **2.3× slower than React** to mount 300 (was 4.6× on this machine), and **3.4× slower**
  for a single mount.
- **Update is now faster than React** — 9.0 ms vs 10.0 ms. That is a new result; §14 reported update
  as roughly even.

So condition 5 does not clear. Runtime mount cost remains a real, named cost of this migration, just a
substantially smaller one. It should stay a condition on the GO rather than be quietly dropped.

### Two honesty checks that the result survived

1. **The cache is not just an artifact of the best case.** 300 identical buttons is the most flattering
   possible input for a content-keyed cache. The mixed scenario (5 variants, so 5 distinct CSS texts)
   improved by **52%** — as much as identical. The win is real for realistic pages.
2. **Single-instance mount was measured**, closing §14's own caveat. §14 speculated the gap "may
   shrink, hold, or reverse at low count". It does **not** shrink: 3.4× at N=1 versus 2.3× at N=300.
   The fixed per-element cost (custom-element upgrade, shadow-root attachment) is the residual, and no
   caching removes it.

### Correctness was verified, not assumed

A shared-sheet cache fails dangerously — by letting one instance's styles bleed into another's.
Verified in a real browser with trusted input, plus 8 automated tests:

- Identical buttons share one sheet object; different variants get different objects.
- Rethemeing one button leaves a sibling of the same variant untouched (`rgb(255, 184, 0)` before and
  after) — sheets are swapped, never mutated in place.
- Trusted `hover()` still matches `:hover` and yields `rgb(242, 145, 0)`; `:disabled` still yields
  `rgb(229, 229, 229)` background and `rgb(163, 163, 163)` text — byte-identical to the pre-cache
  values in §12.
- 25 identical buttons add at most 1 cache entry, not 25.

### The tradeoff, stated rather than hidden

The cache is keyed by full CSS text and never evicted. For a design system this is bounded in
practice — distinct texts equal variants × states × themes actually in use, a few dozen. It is **not**
bounded if a consumer assigns a distinct per-instance theme object to every element, which is the
pathological case where the cache is pure overhead and grows without limit. No real consumer does that
(a theme is an app- or brand-level object), but a bounded LRU is the fix if one ever did.

## Bundle size

Re-measured after 646b and 646c. **Note the React baseline also moved** (105.72 kB vs §3's 113.18 kB)
because `libs/ui` was rebuilt in this session, so ratios are not directly comparable to §3.

| Atom       | Lit gzip | React+Emotion gzip | Ratio | vs §3 (Lit) |
| ---------- | -------- | ------------------ | ----- | ----------- |
| Button     | 1.93 kB  | 18.66 kB           | 9.7×  | +0.06 kB    |
| Checkbox   | 2.11 kB  | 23.22 kB           | 11.0× | +0.48 kB    |
| Typography | 1.09 kB  | 17.64 kB           | 16.2× | +0.21 kB    |
| Input      | 2.50 kB  | 18.51 kB           | 7.4×  | +0.67 kB    |
| Select     | 2.91 kB  | 27.69 kB           | 9.5×  | +0.47 kB    |

- 5-atom total, excluding the `lit` runtime: **11.06 kB** (was 9.11 kB)
- 5-atom total, including it: **17.94 kB** (was 16.38 kB)
- React+Emotion total: **105.72 kB**

**The new features cost real bytes: +1.95 kB across 5 atoms, about +21%.** `ElementInternals` and
`::part()` account for the growth in Checkbox and Input. Typography and Select were **not modified**,
yet their reported sizes moved — Rollup redistributes shared-helper bytes between chunks whenever any
chunk changes size, the same artifact §13 documented. Still an order of magnitude smaller than React.

## Bundle-size regression gate — delivered

`libs/web-components/scripts/check-bundle-size.mjs`, wired as `npm run check:web-components-size`,
with a committed `bundle-size-baseline.json`. `libs/ui` has `size-check` among its 10 `verify:ui`
phases; this package had no equivalent, so a regression here would have gone unnoticed.

Verified in **both** directions: green against the current baseline, and exit code 1 with a clear
message when a size is artificially regressed. A gate never seen to fail is not a gate.

Tolerance is 10%, deliberately not zero, because of the Rollup chunk-redistribution noise above. A
zero-tolerance gate would fail on noise and get disabled, which is worse than an honest threshold.

## Not attempted — and this is the larger half of criterion 11

Reported as gaps rather than quietly omitted.

| Axis                                         | Status                                                                                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Bundle size, per atom and total              | **Measured**                                                                                                                              |
| Mount / update at 300                        | **Measured**                                                                                                                              |
| Single-instance mount                        | **Measured**                                                                                                                              |
| Mixed-variant mount                          | **Measured**                                                                                                                              |
| Lit-wraps-React shell                        | **Measured** (§15)                                                                                                                        |
| Memory usage                                 | **Not attempted**                                                                                                                         |
| Tree-shaking effectiveness                   | **Not attempted** — and `03-monorepo-structure.md` §3 shows it currently does not work at all, so this would measure a known-broken thing |
| Parse / execution time                       | **Not attempted**                                                                                                                         |
| Custom-element upgrade cost, isolated        | **Not attempted.** Inferable as the residual after the cache, but not isolated                                                            |
| Hydration cost                               | **Not attempted**                                                                                                                         |
| Shadow DOM overhead, isolated                | **Not attempted**                                                                                                                         |
| Large-list performance                       | **Partially** — 300 instances is a bulk-list scenario, but no virtualized/1000+ case                                                      |
| Form-interaction latency                     | **Not attempted**                                                                                                                         |
| CPU-throttled low-end behavior               | **Not attempted**                                                                                                                         |
| `lit` runtime isolated via a native-WC probe | **Not attempted** — deferred from 646a W4, still deferred                                                                                 |

Of the ticket's 6 named scenarios, only two are covered (a basic page of buttons; a bulk list).
**Complex form, product listing, dashboard, and overlay interactions were not built**, and
**FCP / TTI / CLS / hydration cost were not measured** — the scenario 6 work that `09-ssr-hydration.md`
delegated here is still outstanding.

The single most useful remaining measurement is **hydration cost under Next.js**, because
`08-react-and-nextjs.md` established that Next renders these client-only, which makes hydration the
whole cost of first paint rather than an optimization detail.

## Methodology

- Harness: `libs/web-components/harness/perf-check.{html,tsx}`, driven in real Chromium.
- Median of 5 trials; raw per-trial arrays retained in the harness output and on
  `window.__PERF_RESULTS__`.
- Single-instance figures are total time over 50 sequential mounts divided by 50, because one mount is
  sub-millisecond and a lone `performance.now()` delta is mostly noise.
- Both sides batched identically: Lit via `DocumentFragment` + `await updateComplete`; React via
  `flushSync` so the commit is synchronous and comparably timed.
- **One machine, one browser, one session.** Before/after comparisons are valid because they were run
  back-to-back here; absolute numbers are not portable and should not be quoted against §14's.
- This is an order-of-magnitude signal, not a benchmark-suite result. No warm-up isolation, no
  `tachometer`, no statistical treatment beyond the median.
