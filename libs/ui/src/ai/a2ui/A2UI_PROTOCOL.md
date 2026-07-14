# A2UI Protocol Specification

**Canonical location:** `./a2ui/`

A2UI (Agent-to-UI) is a JSON-based protocol that enables AI agents to describe interactive user interfaces. The client application renders these specs using the GridKit design system (`gd-design-library`) from Grid Dynamics.

---

## Message Format

A2UI responses are delivered as agent messages with `type: "a2ui"`:

```json
{
  "type": "a2ui",
  "actor": "Agent",
  "payload": {
    "version": "1.0.0",
    "metadata": {
      "agentId": "my-agent",
      "agentName": "My Assistant",
      "timestamp": "2026-01-01T00:00:00.000Z",
      "provider": "openai",
      "scenario": "knowledge-sharing",
      "segment": "summary",
      "isSimulated": true,
      "theme": "light"
    },
    "ui": {
      "layout": { "type": "vertical", "spacing": "16px" },
      "components": [],
      "actions": []
    }
  }
}
```

---

## A2UISpec Structure

```typescript
interface A2UISpec {
  version: string; // always "1.0.0"
  metadata: {
    agentId: string; // unique agent identifier
    agentName: string; // human-readable agent name
    timestamp: string; // ISO 8601 datetime
    provider?: string; // provider or orchestration source, e.g. "openai" | "anthropic" | "gemini" | "local"
    scenario?: string; // scenario or use-case id for sharing/tracing
    segment?: string; // optional orchestration segment, e.g. "list" | "summary" | "checkout"
    isSimulated?: boolean; // demo-only flag for replayed or simulated specs
    theme?: 'light' | 'dark' | 'auto';
    locale?: string; // BCP 47 locale code (e.g. "en-US")
    sessionId?: string; // optional conversation session ID
  };
  ui: {
    layout?: A2UILayout;
    components: A2UIComponent[];
    actions?: A2UIAction[];
  };
  state?: {
    formData?: Record<string, unknown>;
    errors?: Record<string, unknown>;
    loading?: boolean;
    disabled?: boolean;
  };
}
```

---

## Layout Types

| `type`         | Description                                      |
| -------------- | ------------------------------------------------ |
| `"vertical"`   | Stack components top to bottom (default)         |
| `"horizontal"` | Stack components left to right                   |
| `"grid"`       | CSS grid — add `gridColumns: number` for columns |

Additional layout fields:

| Field           | Type     | Description                                                                                              |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `spacing`       | `string` | CSS gap between top-level components (e.g. `"16px"`). Never use token strings.                           |
| `gridColumns`   | `number` | Number of columns for `"grid"` layout (e.g. `2` or `3`)                                                  |
| `alignment`     | `string` | Cross-axis alignment: `"start"` `"center"` `"end"` `"stretch"` `"baseline"`                              |
| `justification` | `string` | Main-axis distribution: `"start"` `"center"` `"end"` `"space-between"` `"space-around"` `"space-evenly"` |

---

## Action Types

Action types are **fully application-defined** via the `actions` option in `buildA2UISystemPrompt()`.
There are no built-in action types — only the actions you declare will be available to the LLM.

See [`buildA2UISystemPrompt` Options](#builda2uisystemprompt-options) for usage details and examples.

Valid trigger values: `"click"` `"change"` `"submit"` `"load"` `"blur"` `"focus"` `"custom"`

---

## Component JSON Shape

Every entry in `ui.components` (and recursively in `children[]`) has this shape.
Only include fields relevant to the component type — omit all unused fields.

```typescript
interface A2UIComponent {
  id: string; // unique snake_case identifier
  type: string; // see Available Component Types below
  label?: string; // primary visible text
  value?: unknown; // string | number | boolean | array — depends on type
  placeholder?: string;
  helpText?: string; // helper text shown below inputs
  name?: string; // loader: animation type ("circle" | "dots")
  href?: string; // link destination URL
  target?: '_blank' | '_self' | '_parent' | '_top'; // link browsing context
  rel?: string; // link relationship attribute
  length?: string; // separator: explicit line length, especially useful for vertical separators
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: string; // visual variant — see component definition
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  underline?: 'default' | 'highlight' | 'none'; // link underline behavior
  rounded?: 'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // loader: border radius for dots
  animationName?: string | null; // skeleton: theme animation token/raw CSS animation name, or null to disable built-in animation
  withWrapper?: boolean; // loader: whether to render inside a wrapper
  color?: string; // typography/separator: prefer theme color token paths or supported palette aliases
  icon?: string; // generic icon name from A2UI_AVAILABLE_ICONS; avatar also uses this for icon fallback content and some components accept it as a legacy iconStart alias
  iconStart?: string; // preferred leading icon name from A2UI_AVAILABLE_ICONS for badge/button/input/input-file/menu/select
  iconEnd?: string; // trailing icon name from A2UI_AVAILABLE_ICONS for badge/button/input/input-file/select
  fill?: string; // icon/avatar fallback: prefer theme tokens (e.g. "icon.error", "icon.primary"), CSS/hex fallback
  fillSvg?: string; // icon/avatar fallback: uniform SVG fill — prefer theme tokens, CSS/hex fallback
  width?: number | string; // icon: pixel number (e.g. 24); layout: CSS string (e.g. "100%")
  height?: number | string; // icon: pixel number (e.g. 24); layout: CSS string (e.g. "100px")
  count?: number; // slider-dots: total number of dots
  activeIndex?: number; // slider-dots: zero-based active dot index
  isBordered?: boolean; // card: adds a border
  isHighlighted?: boolean; // card: outline on hover
  withShadowHover?: boolean; // card: elevation on hover (requires styling.backgroundColor)
  gutter?: string; // card: CSS gap between children (e.g. "12px")
  padding?: string; // card: CSS inner padding (e.g. "16px")
  options?: Array<{ value: unknown; label: string; disabled?: boolean; icon?: string; href?: string }>;
  columns?: Array<{ key: string; label: string; sortable?: boolean; width?: string }>;
  rows?: Record<string, unknown>[];
  attributes?: Record<string, unknown>; // component-specific extras (src, alt, min, max, etc.)
  actions?: string[]; // action IDs from ui.actions
  children?: A2UIComponent[];
  styling?: A2UIStyling;
  // Layout primitives (row, column, flex-container)
  align?: string;
  justify?: string;
  isWrap?: boolean;
  gap?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  width?: string;
  maxHeight?: string;
  // Content (drag-and-drop)
  title?: string;
  description?: string;
  inputFileButtonLabel?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  errors?: string[];
  files?: Array<{ name: string; size?: number; type?: string }>;
  dragOverContent?: A2UIComponent[];
  loadingOverlay?: A2UIComponent[];
  // State (search-modal, drag-and-drop)
  isLoading?: boolean;
  searchValue?: string;
  noHistoryResultsLabel?: string;
  noResultsLabel?: string;
  // Header
  showSearch?: boolean;
  showTopBanner?: boolean;
  orientation?: 'horizontal' | 'vertical'; // separator: direction
  labelPosition?: 'start' | 'center' | 'end'; // separator: label placement
  labelColor?: string; // separator: prefer theme color token paths or supported palette aliases
  backgroundColor?: string; // avatar/skeleton: background color — prefer theme tokens or supported palette aliases
}

interface A2UIStyling {
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  minWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  display?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  borderRadius?: string;
  border?: string;
  cursor?: string;
}
```

> **CSS VALUE RULE:** All styling values MUST be real CSS (e.g. `"16px"`, `"1rem"`, `"100%"`).
> NEVER use design token strings: `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`, `"none"`.
>
> **COLOR TOKEN RULE:** For component color props such as `color`, `fill`, `fillSvg`, `backgroundColor`, `badgeColor`, and `labelColor`, prefer theme color token paths first. Use raw CSS/hex colors only when no theme token fits.

---

## Available Component Types

All types are derived from `aiComponentsSchema` via [`./component-map.ts`](./component-map.ts). The schema files in `../schemas/components/` are the single source of truth — each component's `a2uiName` field determines its A2UI type key.

### Content & Text

| Type           | GridKit component | Notes                                                                                                                                                                                                                                                                                             |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"typography"` | `Typography`      | `variant`: `"h1"`–`"h6"`, `"p"`, `"span"`, `"strong"`, `"code"`, `"caption"`, etc. `variant="caption"` renders a real `<caption>` element, so outside tables set top-level `as` to `"div"` or `"span"`. Use top-level `color` and prefer theme tokens like `"text.secondary"` before raw CSS/hex. |

### Layout & Structure

| Type               | GridKit component | Notes                                                                                                                                                                                       |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"card"`           | `Card`            | Container with border/highlight/shadow-hover. Supports `children[]`.                                                                                                                        |
| `"separator"`      | `Separator`       | Horizontal or vertical divider. Use top-level `variant` values `solid`, `dashed`, or `dotted`, plus `color` and `labelColor`. For vertical separators, set `length` (for example `"40px"`). |
| `"scroll"`         | `Scroll`          | Scrollable container. Set `styling.maxHeight`.                                                                                                                                              |
| `"accordion"`      | `Accordion`       | Collapsible section. Supports `children[]`.                                                                                                                                                 |
| `"row"`            | `Row`             | Horizontal stack. Props: `gutter`, `align`, `justify`, `isWrap`.                                                                                                                            |
| `"column"`         | `Column`          | Vertical stack. Props: `gutter` (number px), `align`, `justify`.                                                                                                                            |
| `"flex-container"` | `FlexContainer`   | Flexbox with `gap`, `flexDirection`, `alignItems`, `justifyContent`.                                                                                                                        |

### Forms & Input

| Type              | GridKit component | Notes                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"form"`          | `Form`            | Semantic `<form>` wrapper. Supports `children[]`.                                                                                                                                                                                                                                                                                                                                       |
| `"input"`         | `Input`           | `variant`: `"text"` `"email"` `"password"` `"number"` `"tel"` `"url"` `"search"`.                                                                                                                                                                                                                                                                                                       |
| `"textarea"`      | `Textarea`        | Multi-line. `attributes: { minHeight?, maxHeight? }`.                                                                                                                                                                                                                                                                                                                                   |
| `"select"`        | `Select`          | Dropdown. Uses `options[]`.                                                                                                                                                                                                                                                                                                                                                             |
| `"switch"`        | `Switch`          | Boolean toggle.                                                                                                                                                                                                                                                                                                                                                                         |
| `"toggle"`        | `Toggle`          | Toggle control.                                                                                                                                                                                                                                                                                                                                                                         |
| `"slider"`        | `Slider`          | Range input. `attributes: { min, max, step }`.                                                                                                                                                                                                                                                                                                                                          |
| `"radio-group"`   | `RadioGroup`      | Mutually exclusive options. Uses `options[]`.                                                                                                                                                                                                                                                                                                                                           |
| `"label"`         | `Label`           | Form label. `attributes: { for: "inputId" }`.                                                                                                                                                                                                                                                                                                                                           |
| `"input-file"`    | `InputFile`       | File picker button. `attributes: { accept?, multiple? }`.                                                                                                                                                                                                                                                                                                                               |
| `"drag-and-drop"` | `DragAndDrop`     | Full upload widget with validation. Use top-level `title`, `description`, `inputFileButtonLabel`, `acceptedFileTypes`, `maxFiles`, `maxFileSize`, optional `errors`/`files`, and `actions[]`. Optional `dragOverContent[]` and `loadingOverlay[]` customize hover/loading states. Never emit React callbacks or refs such as `onFilesChanged`, `onError`, `targetRef`, or `triggerRef`. |

### Actions & Controls

| Type              | GridKit component | Notes                                                                                                                                                    |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"button"`        | `Button`          | `variant`: `"primary"` `"secondary"` `"tertiary"` `"outlined"` `"text"` `"inherit"` only.                                                                |
| `"link"`          | `Link`            | Use top-level `label`, `href`, `variant`, `underline`, `target?`, `rel?`, and optional `styling` for hover overrides. Do not put `href` in `attributes`. |
| `"menu"`          | `Menu`            | Dropdown menu. Uses `options[]`.                                                                                                                         |
| `"dropdown"`      | `Dropdown`        | Keyboard-navigable dropdown container. Supports `children[]`.                                                                                            |
| `"dropdown-item"` | `DropdownItem`    | Option inside `dropdown`. `label`, `value`, `disabled`.                                                                                                  |
| `"counter"`       | `Counter`         | Quantity stepper. `attributes: { initial, min?, max? }`.                                                                                                 |

### Display & Content

| Type         | GridKit component | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"list"`     | `List`            | Ordered/unordered items. Uses `options[]` or `value` array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `"table"`    | `Table`           | `columns[]` + `rows[]` required.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `"tabs"`     | `Tabs`            | Tabbed panels. `options[]` for tabs, `children[]` for content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `"badge"`    | `Badge`           | `variant`: `"primary"` `"secondary"` `"success"` `"warning"` `"error"` `"info"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `"avatar"`   | `Avatar`          | All props top-level — do NOT use `attributes` or `fallbackComponent`. `label`/`value` for initials. `src`/`alt` for image. `size`/`sizeVariant` for size. `backgroundColor` for fallback bg. `icon` plus optional `fill`/`fillSvg` renders an icon inside the avatar via the existing `fallbackComponent` path. `withBadge`+`badgeColor` renders the normal avatar badge dot. Do NOT place a separate sibling `icon` when the icon should appear inside the avatar. Prefer theme tokens such as `"bg.fill.secondary"` and `"icon.primary"` before raw CSS/hex. Example: `{"type":"avatar","icon":"star","size":"xl","backgroundColor":"#cfaaa7","fill":"#646464"}`. |
| `"icon"`     | `Icon`            | All props are top-level. `icon`: name from `A2UI_AVAILABLE_ICONS`. `size`: `xs`(14) `sm`(16) `md`(18) `lg`(24) `xl`(32) `xxl`(40) — overrides `width`/`height`. `width`/`height`: pixel numbers. `fill`/`fillSvg`: prefer theme tokens from `colors` (e.g. `"icon.error"`, `"icon.primary"`) before raw CSS/hex. Example: `{"type":"icon","icon":"star","size":"lg","fill":"icon.primary"}`.                                                                                                                                                                                                                                                                        |
| `"image"`    | `Image`           | Use top-level `src` and optional top-level `alt`. `width`/`height` may be numbers, or use CSS sizing in `styling`. Optional top-level `objectFit` is supported. Do not hide `src` inside `attributes`.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `"price"`    | `Price`           | `attributes: { currentValue, oldValue?, currencySymbol? }`. Pass numeric strings in `currentValue`/`oldValue` (e.g. `"9.99"` or `"99"`); set `currencySymbol` separately (e.g. `"$"`, `"€"`). Renders as `"$9.99"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `"rating"`   | `Rating`          | `value`: 0–5. `readOnly?: boolean`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `"truncate"` | `Truncate`        | Long text with "show more". `attributes: { maxLines: number }`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `"search"`   | `Search`          | Search input with built-in clear.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Data Visualization

| Type      | GridKit component | Notes                                                                                                                                                 |
| --------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"chart"` | `Chart`           | `variant`: `"line"` `"bar"` `"area"` `"pie"` `"donut"`. Cartesian needs `attributes.xKey` + `attributes.series`. Radial needs `attributes.pieConfig`. |

### Feedback & Status

| Type                    | GridKit component    | Notes                                                                                                                                                             |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `"progress-bar"`        | `ProgressBar`        | `value`: 0–100.                                                                                                                                                   |
| `"loader"`              | `Loader`             | Loading indicator. Use top-level `name: "circle"                                                                                                                  | "dots"`, optional `rounded`for dots,`size`, `variant`, and `withWrapper`. |
| `"skeleton"`            | `Skeleton`           | Placeholder. Prefer top-level `variant`, `width`, `height`, optional `backgroundColor`, and optional `animationName`. Use `styling` for extra CSS overrides only. |
| `"inline-notification"` | `InlineNotification` | `variant`: `"success"` `"warning"` `"error"` `"info"`.                                                                                                            |
| `"snackbar"`            | `Snackbar`           | Floating auto-dismiss notification.                                                                                                                               |
| `"tooltip"`             | `Tooltip`            | Hover tooltip. Supports `children[]` as trigger.                                                                                                                  |

### Overlay & Dialog

| Type             | GridKit component | Notes                                                          |
| ---------------- | ----------------- | -------------------------------------------------------------- |
| `"modal"`        | `Modal`           | Dialog overlay. Supports `children[]`. Open/close via actions. |
| `"search-modal"` | `SearchModal`     | Global search modal. Toggle with `open-modal` / `close-modal`. |

### Navigation

| Type            | GridKit component | Notes                                                                                                    |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| `"breadcrumbs"` | `Breadcrumbs`     | `options: [{ label, href? }]`.                                                                           |
| `"stepper"`     | `Stepper`         | Multi-step wizard. `value`: current step (0-based). `options: [{ label }]`.                              |
| `"slider-dots"` | `SliderDots`      | Dot pagination. Use top-level `count` and optional `activeIndex`; bind `actions[]` to handle dot clicks. |
| `"header"`      | `Header`          | Page-level site header. `showSearch`, `showTopBanner`, `children[]`.                                     |

### Media

| Type                 | GridKit component | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"carousel"`         | `Carousel`        | Single-focus image carousel. Supports top-level `layout`, `showArrows`, `showDots`, `thumbs`, `isFocusable`, and `styling`. Use `children[]` of direct `"image"` items or `"carousel-slide"` wrappers containing one `"image"` child. Use this for prompts like image gallery, gallery, slider, slideshow, or plain image-only requests such as "generate carousel 7 images", and whenever vertical layout is required. For vertical carousels, set an explicit height in `styling`.                                                                                                                                                      |
| `"carousel-slide"`   | `Carousel.Slide`  | Optional slide wrapper used inside `"carousel"` or `"content-carousel"`. Usually contains a single `"image"` child.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `"content-carousel"` | `ContentCarousel` | Horizontal repeated-item carousel. Supports top-level `showArrows`, `showDots`, `isFocusable`, `visibleItems`, `scrollStep`, `scrollAlignment`, and `styling`. Use `children[]` of `"image"`, `"card"`, or `"carousel-slide"` items. Never emit React-only `items` or `renderItem` fields in A2UI JSON. Prefer this over `"carousel"` for prompts like "generate carousel 5 image items", "carousel of cards", "carousel of text blocks", "carousel of blocks", or other horizontally scrolling repeated item collections that explicitly say items/cards/blocks/text. Plain image-only carousel prompts should use `"carousel"` instead. |

### Chat Interface

| Type               | GridKit component | Notes                                                                                                    |
| ------------------ | ----------------- | -------------------------------------------------------------------------------------------------------- |
| `"chat-bubble"`    | `ChatBubble`      | `variant`: `"question"` (user) or `"answer"` (agent). `attributes: { status?: "pending"\|"fulfilled" }`. |
| `"chat-container"` | `ChatContainer`   | Full chat shell. `children[]` for message area.                                                          |

---

## LLM Integration

### System Prompt Builder

`buildA2UISystemPrompt(options?)` in [`./system-prompt.ts`](./system-prompt.ts) generates a complete LLM instruction from the live component map. See [`buildA2UISystemPrompt` Options](#builda2uisystemprompt-options) below.

### Icon Catalog

`A2UI_ICON_CATALOG` in [`./component-map.ts`](./component-map.ts) — semantic usage guide grouped by category. The `label` prop of an `"icon"` component **must** be a name from `A2UI_AVAILABLE_ICONS`.

### Schema Validation

A2UI responses are validated with AJV against [`./ui-specification-schema.json`](./ui-specification-schema.json). The TypeScript counterpart is in [`./spec-schema.ts`](./spec-schema.ts). The agent service retries up to 3 times on validation failure.

---

## `buildA2UISystemPrompt` Options

```typescript
`buildA2UISystemPrompt(options?: A2UISystemPromptOptions): string`;
```

| Option             | Type                                | Default                     | Description                                                                                                                                                                                                                                    |
| ------------------ | ----------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agentId`          | `string`                            | `"a2ui-agent"`              | Unique agent identifier placed in `metadata.agentId` of every generated spec.                                                                                                                                                                  |
| `agentName`        | `string`                            | `"Grid Dynamics Assistant"` | Human-readable agent name placed in `metadata.agentName`.                                                                                                                                                                                      |
| `provider`         | `string`                            | —                           | Optional LLM provider or orchestration source placed in `metadata.provider`. Useful for knowledge sharing across any LLM integration.                                                                                                          |
| `scenario`         | `string`                            | —                           | Optional scenario, route, or use-case identifier placed in `metadata.scenario`.                                                                                                                                                                |
| `segment`          | `string`                            | —                           | Optional orchestration segment identifier placed in `metadata.segment` when a larger flow is split into parts.                                                                                                                                 |
| `isSimulated`      | `boolean`                           | —                           | Optional demo-only metadata flag placed in `metadata.isSimulated` for replayed, mocked, or simulated specs. Not intended for regular live LLM output.                                                                                          |
| `theme`            | `"light" \| "dark" \| "auto"`       | `"light"`                   | Default UI theme placed in `metadata.theme`.                                                                                                                                                                                                   |
| `imageSources`     | `string \| string[]`                | —                           | Restrict `image` component `src` values to specific hosts. When omitted the LLM may use any public CDN. Pass a host or list of hosts to limit to those only. Pass `[]` to disable all remote images (LLM will omit image components entirely). |
| `locale`           | `string`                            | —                           | BCP 47 locale code (e.g. `"de-DE"`, `"fr-FR"`). Injected into `metadata.locale` and used to hint the LLM to generate content in that language. Also auto-selects price format (EU languages → EU convention, others → US).                     |
| `context`          | `string`                            | —                           | Free-form description of the application or use case. Injected as a `## USE CASE CONTEXT` section near the top of the prompt — gives the LLM domain knowledge before generating the UI.                                                        |
| `priceFormat`      | `"us" \| "eu" \| PriceFormatCustom` | —                           | Explicit price/currency formatting convention. Overrides locale-based detection. `"us"`: `$1,299.99` (symbol before). `"eu"`: `1 299,99 €` (symbol after). Object: fine-grained control — see below.                                           |
| `customGuardrails` | `string[]`                          | `[]`                        | Additional guardrail rules appended after the 15 system-defined guardrails under `### ADDITIONAL GUARDRAILS`. Each string is one rule line.                                                                                                    |
| `customRules`      | `string[]`                          | `[]`                        | Additional generation rules appended after the 15 system-defined rules, auto-numbered.                                                                                                                                                         |
| `actions`          | `A2UIActionDefinition[]`            | `[]`                        | Application-defined actions injected into the LLM prompt and reused by `renderA2UISpec` at runtime. This is the **only** way to make action types available to the LLM — no built-in action types exist.                                       |

### `priceFormat` — custom object shape (`PriceFormatCustom`)

| Field                | Type                  | Default    | Description                                                               |
| -------------------- | --------------------- | ---------- | ------------------------------------------------------------------------- |
| `symbolPosition`     | `"before" \| "after"` | `"before"` | Symbol before the value (`$99.99`) or after with a space (`99,99 €`).     |
| `decimalSeparator`   | `"." \| ","`          | `"."`      | Character used to separate the integer and fractional parts.              |
| `thousandsSeparator` | `"," \| " " \| "."`   | `","`      | Character used to group thousands (e.g. `1,299` / `1 299` / `1.299`).     |
| `trailingZeros`      | `boolean`             | `false`    | When `false`, whole amounts omit `.00`/`,00` (e.g. `"99"` not `"99.00"`). |

### Usage Examples

**Minimal — all defaults:**

```typescript
import { buildA2UISystemPrompt } from 'gd-design-library/ai';

const systemInstruction = buildA2UISystemPrompt();
```

**E-commerce agent with brand image CDN:**

```typescript
const systemInstruction = buildA2UISystemPrompt({
  agentId: 'shop-agent',
  agentName: 'Shop Assistant',
  theme: 'light',
  imageSources: ['cdn.myshop.com', 'assets.myshop.com'],
  context: 'E-commerce product catalog and checkout assistant for MyShop retail platform.',
  customGuardrails: [
    'Always show prices in USD with the $ symbol.',
    'Product names must be realistic retail product names — never use "Product 1", "Item A".',
    'Every product card must include price, rating, and an "Add to Cart" button.',
  ],
  customRules: [
    'Use grid layout with gridColumns: 2 for product listings.',
    'Always include a progress-bar for stock level on product cards.',
  ],
  actions: [
    {
      type: 'add-to-cart',
      description: 'Add a product to the cart. payload: { productId: string, quantity: number }',
    },
    {
      type: 'open-checkout',
      description: 'Navigate to the checkout flow. No payload required.',
    },
  ],
});
```

**Multi-language support:**

```typescript
const systemInstruction = buildA2UISystemPrompt({
  agentId: 'support-agent',
  agentName: 'Support Assistant',
  locale: 'de-DE',
  context: 'German-language customer support portal for enterprise software.',
});
```

**European e-commerce — explicit EU price format (overrides locale detection):**

```typescript
const systemInstruction = buildA2UISystemPrompt({
  agentId: 'shop-eu',
  locale: 'fr-FR',
  priceFormat: 'eu',
  // Price component will use: currentValue="1 299,99" currencySymbol="€" currencySymbolPosition="after" → "1 299,99 €"
});
```

**US store — lock to US convention regardless of locale:**

```typescript
const systemInstruction = buildA2UISystemPrompt({
  agentId: 'shop-us',
  locale: 'en-US',
  priceFormat: 'us',
  // Price component will use: currentValue="1,299.99" currencySymbol="$" → "$1,299.99"
});
```

**Custom price format (e.g. Swiss: period thousands, comma decimal, symbol before):**

```typescript
const systemInstruction = buildA2UISystemPrompt({
  priceFormat: {
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    trailingZeros: false,
  },
  // Produces: CHF 1.299,99 → currencySymbol="CHF" currentValue="1.299,99" currencySymbolPosition="before"
});
```

**Using the convenience helper for Gemini:**

```typescript
import { buildA2UIGeminiRequest } from 'gd-design-library/ai';

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const result = await model.generateContent(
  buildA2UIGeminiRequest('Show a product analytics dashboard with charts and a product list', {
    agentId: 'analytics-agent',
    context: 'Product analytics dashboard for an e-commerce platform.',
    customGuardrails: ['Always include at least one chart on analytics pages.'],
  })
);
```

### Showcase Prompt

Use this user prompt to exercise the full breadth of component types and features:

```text
Show me a product analytics dashboard with:
1. A header with page title "Product Analytics" and a search button that opens a search modal
2. KPI row: 4 stat cards — Total Revenue ($128,450), Orders (1,842), Avg Order Value ($69.7),
   Return Rate (3.2%) — each with an icon and trend badge
3. A line chart showing monthly revenue vs profit for Jan–Jun with interactive legend
4. A bar chart showing top 5 product categories by sales volume
5. A product grid of 10 items (2 columns). Each card: product image, name, category badge,
   star rating, price (with strikethrough old price), stock progress bar, quantity counter
   (min 1 max 99), "Add to Cart" primary button and wishlist icon button
6. A "Load 10 more" outlined button at the bottom
```

This exercises: `header`, `search-modal`, `chart` (line + bar), `card`, `badge`, `icon`, `image`, `typography`, `price`, `rating`, `progress-bar`, `counter`, `button` (multiple variants), `grid` layout.
