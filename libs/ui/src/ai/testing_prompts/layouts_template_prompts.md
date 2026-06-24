# Template & Layout Component Testing Prompts

---

## Layout & Structure Component Testing Prompts

## PROMPT FOR CHATCONTAINER

Generate 3 different ChatContainer layouts so every ChatContainer property is covered in realistic chat UI scenarios:

1. Fully populated default state: Set `isOpen` = true and provide all slots (`sidebarMinifiedContent`, `sidebarHeaderContent`, `sidebarContent`, `headerContent`, and `children`). Use a natural chat example: history list in the sidebar, compact icon rail (plus/chat/edit), top header with title "AI Assistant", and several `ChatBubble` messages in the main area.
2. Collapsed-first state: Set `isOpen` = false, keep all slots populated, and make the minified sidebar content clearly usable (icon-only quick actions). Keep header visible so the reopen behavior can be validated visually.
3. Hidden controls state: Set both `showSidebarAsideControl` = false and `showSidebarHeaderControl` = false while still rendering sidebar and header content.

---

## PROMPT FOR COLUMN

Generate 4 different columns:

1. Default content stack for a settings panel: `gutter` = 24, 3 text blocks (`Block A`, `Block B`, `Block C`), and simple `padding` so spacing is easy to validate.
2. Reversed timeline-style stack: `isReversed` = true, `gutter` = 16, and 3 text items (`Step 1`, `Step 2`, `Step 3`).
3. Tight card column with explicit alignment behavior: use `align` = 'center', `justify` = 'space-between', fixed `height`, and `isWrap` = false so content distribution is clearly visible.
4. Semantic + styling case: render as `as` = 'section', set `flex` (for example `1 1 auto`), and apply root `styling` (background, border, borderRadius). Use `gap` instead of `gutter` in this case to confirm alias parsing.

---

## PROMPT FOR FLEXCONTAINER

Generate 5 different flex containers without hardcoded fixed width/height constraints:

1. Basic horizontal toolbar: `flexDirection` = 'row', `gap` = '16px', with 3 short items (`Item A`, `Item B`, `Item C`).
2. Vertical alignment check: `flexDirection` = 'column', `alignItems` = 'center', and 3 text items with very different lengths (`Short`, long sentence, `Tiny`) to confirm centering behavior.
3. Space distribution case: `flexDirection` = 'row', `justifyContent` = 'space-between', with 2 edge items (`Start edge`, `End edge`).
4. Wrapped tag list: `flexDirection` = 'row', `styling` = { `flexWrap`: 'wrap' }, `gap` = '8px', and at least 6 tag-like items (`Tag 1` ... `Tag 6`).
5. Reverse-flow action group: use `flexDirection` = 'row-reverse', keep `alignItems` + `justifyContent` explicitly set, add a custom `className`, and include root `styling` (for example subtle border/background).

---

## PROMPT FOR ROW

Generate 4 different rows:

1. Default horizontal row for small info chips: `gutter` = 16 with 3 explicit text items (`Block 1`, `Block 2`, `Block 3`).
2. Reversed row: `isReversed` = true and `gutter` = 8 with 3 items (`Start`, `Middle`, `End`).
3. Navigation-style row with alignment rules: set `align` = 'center', `justify` = 'space-between', and `isWrap` = false, with two edge labels (`Left action`, `Right action`).
4. Semantic + styling row: render as `as` = 'nav', set `flex` (for example `1 1 auto`), apply root `styling` (background/border/padding), and use `gap` instead of `gutter`.

---

## PROMPT FOR PORTAL

Generate a wrapper component with 4 distinct buttons. Each button should toggle the rendering of a different Portal configuration using local state. Ensure every portal content includes a button to close/hide itself.

1. Default Global Portal triggered by an 'Open Global Portal' button. Do not pass a container prop (so it defaults to document.body). Provide children with text 'Global portal content injected into body' and a 'Close' button.
2. Targeted Portal: render a standard div with id="custom-portal-target", some padding, and a distinct background color to serve as an anchor. Next to it, render an 'Open Targeted Portal' button. The Portal should use container = '#custom-portal-target' and withWrapper = false.
3. Semantic Wrapper Portal: Triggered by an 'Open Semantic Portal' button. Pass WrapperView="main" and a specific wrapperVariant (e.g., WrapperVariant.Section or "section"). Include explicit text .
4. Scroll-lock Portal: Triggered by an 'Open Blocking Portal' button. Render a modal-like portal with `blocksScroll` = true, keep `withWrapper` = true, and include root `styling` overrides (for example z-index and padding) .

---

## PROMPT FOR SCROLL

Generate 4 different scroll containers:

1. Vertical-first content region: set `vertical` = 'auto' and `horizontal` = 'hidden', then place a `Column` with at least 5 text rows (`Row 1` ... `Row 5`) and enough height pressure to require vertical scrolling.
2. Horizontal-only lane: set `vertical` = 'hidden' and `horizontal` = 'auto', then place a `Row` with `isWrap` = false and at least 4 wide items (`Column A` ... `Column D`) so horizontal overflow is obvious.
3. Always-visible bars case: set both `vertical` = 'visible' and `horizontal` = 'visible', and include a short "Corner intersection test" label plus overflowing row content.
4. Auto-hide behavior case: set `autoHide` = true with `vertical` = 'auto', include long scrollable content, and apply root `styling` (for example fixed `height`, border, and padding) .

---

## Templates Component Testing Prompts

## PROMPT FOR DRAG AND DROP

Generate 6 different drag and drop templates:

1. Default document upload area with `title` = 'Drop some files here', `description` that explains allowed uploads, `inputFileButtonLabel` = 'Choose files', `maxFileSize` = 20000000 (20 MB), and `acceptedFileTypes` = ['application/pdf', 'application/msword'].
2. Single-file strict upload variant with `maxFiles` = 1 (for example avatar or contract upload), clear helper text in `description`, and realistic label text for the button.
3. Disabled drag and drop area where interaction is blocked but title/description remain visible.
4. Loading state with `isLoading` = true and a custom `loadingOverlay` (for example loader + text "Uploading files...").
5. Error-focused state using `errors` with at least one explicit message such as 'File is too large (max 20 MB)' and another like 'Unsupported file type'.
6. Custom idle content state: provide `children` to replace the default internal layout (for example icon + short instructions), plus `actions` so file selection/drop can dispatch upload-related events.
