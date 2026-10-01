# Slider controls migration manifest

The generators were unavailable. This reviewed manual manifest uses the complete React source, public types, tokens, tests, exports, and published Storybook evidence allowed by the self-migration-agent fallback.

| Component  | Classification      | Platform contract                                                                                                                                                                                                                                                    |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skeleton   | element, re-audited | `gd-skeleton`; scalar shape/dimension/animation attributes, object `styles`/`theme` properties, default slot, `skeleton` part, native host ARIA.                                                                                                                     |
| Slider     | element             | `gd-slider`; numeric `min`, `max`, `value`, `step`; boolean `disabled`; `styles`/`theme`; `slider` part; bubbling/composed `gd-change` with `{ value }`; native range keyboard and ARIA behavior.                                                                    |
| SliderDots | element             | `gd-slider-dots`; numeric `count` and `activeIndex`; `styles`/`theme`; `dots` and `dot` parts; bubbling/composed `gd-change` with `{ index }`; tablist/tab roles and accessible names.                                                                               |
| Switch     | element             | `gd-switch`; `checked`, `disabled`, `isLoading`, `label`, `name`; default label slot; exposed parts; bubbling/composed `gd-change` with `{ checked }`; native checkbox keyboard behavior; composes `gd-loader`.                                                      |
| Textarea   | element             | `gd-textarea`; native value, naming, placeholder, disabled, readonly, rows and length properties plus resize, variant, color, dynamic height, sizing, counter and style properties; exposed parts; `gd-input`/`gd-change` with `{ value }`; public `focus()` method. |

React callbacks map to native custom events. React children map to the Switch default slot. React synthetic change events map to value-bearing DOM custom events. No React-only runtime is embedded.
