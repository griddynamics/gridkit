# Toggle, Truncate, Typography, and Wrapper migration manifest

The generators were unavailable. This reviewed manual manifest uses the complete React source, public types, tokens, tests, exports, and the published React Storybook evidence allowed by the self-migration-agent fallback.

| Component  | Classification      | Platform contract                                                                                                                                                                                               |
| ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toggle     | element             | `gd-toggle`; string/object `items`, controlled `value`, `disabled`, `renderItemContent`, `styles` and `theme`; composes `gd-button`; bubbling/composed `gd-change` with `{ value }`; group semantics.           |
| Truncate   | element             | `gd-truncate`; numeric `lines`, `styles` and `theme`; default slot; `content` part; reactive overflow measurement through `isTruncated` and public `measure()`; ResizeObserver support.                         |
| Typography | element, re-audited | `gd-typography`; all React variants, display sizes, style variants, alignment, color, semantic `as`, token typography selection, default slot, and `typography` part remain covered.                            |
| Wrapper    | element             | `gd-wrapper`; `inline`, `section`, and `fullPage` variants, semantic `as`, `styles` and `theme`; default slot and `wrapper` part. The explicit migration request overrides the earlier CSS-only classification. |

React callbacks map to native custom events, React children map to default slots, and function/object props remain JavaScript properties. The published Atoms inventory is recorded in `published-atoms-audit.json` and enforced against the local atom ports and parity story counts.
