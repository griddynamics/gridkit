# Organism Component Testing Prompts

---

## PROMPT FOR CARD

Generate 7 different cards:

1. Default vertical product card with `isBordered` = true, root `padding` + `gutter`, image (`src`, `alt`), title, description, price (`currentValue` + `oldValue`), rating (`value` + `label`), and outlined CTA button
2. Horizontal card with `variant` = 'horizontal', explicit image `width` + `height` (numbers), and a `Card.Row` for price + button using `align`, `justify`, `gutter` = '16px', and `isWrap` = false
3. Compact card using `size` = 'sm' across title, description, price, rating, and button, with `isHighlighted` = true and `withShadowHover` = true
4. Counter card with `initial` = 5, `min` = 3, `max` = 10, and counter `actions`; include a second counter in the same card with `disabled` = true and `size` = 'sm'
5. Button-variant card containing 5 CTAs: `primary`, `secondary`, `tertiary`, `text`, and `outlined`; one button must be `disabled`, and enabled ones should include `actions`
6. Scrollable content card with explicit root `styling` for overflow behavior (fixed-height area), enough description text to overflow, and required root `padding` + `gutter`
7. Subcomponent styling stress-test card: apply `styling` overrides to image, title, description, price, button, and rating to verify each style object is parsed

---

## PROMPT FOR CAROUSEL

Generate 5 types of carousel:

1. Default horizontal carousel with 3 random images, navigation arrows (showArrows = true), and navigation dots (showDots = true)
2. Carousel with custom content inside the first slide (using Carousel.Slide with a Column/Row containing Typography and a Button), followed by standard image slides. Navigation arrows (showArrows = false) and navigation dots (showDots = false)
3. Vertical carousel with 4 random images, `layout` = 'vertical', fixed height in `styling`, and `thumbs` = 'start'
4. Single-focus carousel with `variant` = 'single', `showArrows` = true, `showDots` = false, and `isFocusable` = true

---

## PROMPT FOR CHART

Generate 8 different charts:

1. Line chart with `variant` = 'line', 4 months of data, `xKey` = 'month', and 2 series (`Revenue`, `Profit`) with custom labels
2. Bar chart with `variant` = 'bar', category data, `xKey` = 'quarter', and 2 series rendered side-by-side; enable legend with `interactive` = true and place it at the top
3. Stacked bar chart with `variant` = 'bar', 3 series sharing the same `stackId` so bars stack in each category
4. Area chart with `variant` = 'area', cumulative data, `xKey` = 'week', and series-level visual tuning (`curveType` + `fillOpacity`)
5. Pie chart with `variant` = 'pie' using `pieConfig` (`nameKey`, `dataKey`, `showLabels` = true), plus custom `colors` palette
6. Donut chart with `variant` = 'donut' using `pieConfig` (`nameKey`, `dataKey`, `showLabels` = true, `innerRadius`, `outerRadius`, `paddingAngle`, `startAngle`, `endAngle`)
7. Fully configured cartesian chart that includes `xAxis`, `yAxis`, `grid`, `tooltip` (`enabled` = true), `chartHeight`, `chartMargin`, `animate` = false, and accessibility text (`title`, `label`, `description`)
8. State coverage chart set: one `loading` chart with custom `loadingText`, one empty-data chart with custom `emptyText`, and one `error` chart with custom `errorText`; include `styling` overrides on the chart container

---

## PROMPT FOR CHATBUBBLE

Generate 7 types of chat bubble:

1. Default question bubble with message text = 'Hello my friend!!' in children
2. Answer bubble with `status` = 'fulfilled' and 4 icon buttons in `actionChildren` (volume, copy, like, dislike)
3. Pending answer bubble with `status` = 'pending' and short streaming-style message text
4. Rejected answer bubble with `status` = 'rejected', retry-style `actionChildren`, and subtle error-oriented `styling`
5. Size coverage set: render 3 bubbles side by side using `size` = 'sm', `size` = 'md', and `size` = 'lg' (same content, answer variant)
6. Chat bubble with `ChatBubble.ImageGallery` containing 4 images
7. Chat bubble with rich child content: message text plus a link-preview style block inside children, custom root `styling`, and `variant` = 'answer'

---

## PROMPT FOR CONTENTCAROUSEL

Generate 4 different content carousels:

1. Default content carousel with 3 text slides (`Slide 1`, `Slide 2`, `Slide 3`), `showArrows` = true, `showDots` = true, and `isFocusable` = true
2. Content carousel with 6 slides, `visibleItems` = 2, `scrollStep` = 1, and `scrollAlignment` = 'left'
3. Content carousel with 6 slides, `visibleItems` = 3, `scrollStep` = 2, and `scrollAlignment` = 'centered'
4. Minimal navigation mode carousel with 4 slides, `showArrows` = false, `showDots` = true, and custom root `styling` for spacing/width

---

## PROMPT FOR HEADER

Generate 3 different headers:

1. Complete dark-themed header with `logoChildren`, `menuChildren`, and `actionChildren` (Sign in + Cart), `showSearch` = true, and menu items: Home, Products, Contact, About
2. Header with top announcement banner: `showTopBanner` = true and `bannerChildren` containing promo text (for example, free shipping message), plus basic logo + menu
3. Search-first header where `showSearch` = true, minimal menu, and custom `bgColor` using error color theme token

---

## PROMPT FOR IMAGEPREVIEW

Generate 2 different image previews:

1. Default image preview with 3 images (`src` + `alt` + optional `caption`), `showArrows` = true, `showThumbnails` = true, and `showCounter` = true.
2. Image preview with `thumbnailPosition` = 'left', `showArrows` = false, `showCounter` = false and thumbnails used as the primary navigation.

---

## PROMPT FOR INPUTAREA

Generate 5 different input areas:

1. Default empty input area with `placeholder` = 'Write a message, please...', `showAttachmentButton` = true, and `showSendButton` = true
2. Create a disabled input area with a pre-filled value: 'This message cannot be edited'. The action buttons should remain visible but be in a disabled state.
3. Multi-line input area with `minRows` = 3, `maxRows` = 8, `maxLength` = 200, `maxHeight` = 112, and `showCharacterCount` = true
4. Input area with custom action labels: `sendButtonLabel` = 'Send now', `attachmentButtonLabel` = 'Attach files', and `showSendButtonTooltip` = true.
5. Input area with `showSendButton` = false but `showAttachmentButton` = true

---

## PROMPT FOR MODAL

Generate a modal component with 5 distinct buttons. Each button should open a different type of Modal (use local state to manage isOpen for each). Every modal must include a working close mechanism calling the close handler via a button in the footer.

1. Standard modal with `label` = 'Confirm Action', short body `children`, and `footer` with two buttons ('Confirm' and 'Cancel') that both close the modal.
2. Long-content modal with `title` = 'Terms and Conditions', very long body `children` that naturally overflows, and `footer` with one 'Accept' button.
3. Strict modal for critical actions with `showCloseButton` = false, `closeOnEscape` = false, and `closeOnClickOutside` = false, plus explicit close action in `footer`.
4. Custom-layout modal with `isCustomView` = true and fully custom `children` structure (custom header/body/actions inside the content area).
5. Styled modal with custom `styling` (for width/spacing), a small info body, and a simple one-button `footer` close action.

---

## PROMPT FOR SEARCH

Generate 3 different search components:

1. Default search with `placeholder` = 'Search products...', `value` = '', and `options` with 3 selectable items (`Red`, `Green`, `Blue`)
2. Search with an empty `options` array and `emptyItemsResult` = 'Loading results...' to simulate async loading state.
3. Search with no results (`options` = []) and `emptyItemsResult` = 'No products found. Try a different search term.' plus a non-empty `value`.

---

## PROMPT FOR SEARCHMODAL

Generate a wrapper component with 4 distinct buttons. Each button should open a different type of SearchModal (use local state to manage isOpen for each via modalProps={{ isOpen, onClose }}).Every modal must include a working close mechanism calling the close handler via a button in the footer.

1. History-first modal with empty `searchValue`, grouped `historyResults` (for example 'Today' and 'Yesterday'), and `placeholder` for the search input.
2. Active-results modal with `searchValue` = 'Dashboard', non-empty `results` (title/description/icon/date), and click `actions` wired for result selection.
3. Loading modal with `isLoading` = true, custom `loaderItemsCount`, and realistic `placeholder` while results are being fetched.
4. Empty-state + sections modal with empty `results` and `historyResults`, custom `noResultsLabel`, custom `noHistoryResultsLabel`, custom `newSearchCta`, plus `popularItems`, `aiSuggestions`, `articles`, extra `children`, and root `styling`.

---

## PROMPT FOR SIDEBAR

Generate 4 different sidebars:

1. Default sidebar with a flat `items` list (Dashboard, Projects, Tasks), `activeItemId` = 'dashboard', and simple `footerChildren` with user text.
2. Collapsed sidebar with `collapsed` = true, `collapsedWidth` = '64px'
3. Hierarchical sidebar where `items` includes nested `children` under 'Projects' (`Web App`, `Mobile App`), with one nested item set as `activeItemId`.
4. Sidebar with mixed item states: one `disabled` item, one item using `href`, plus extra `children` content after nav items and root `styling` overrides.
