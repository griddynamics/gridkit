# Molecular Component Testing Prompts

## PROMPT FOR ACCORDION

Generate 2 different accordions:

1. Single-expand accordion with icons. Wrap two `AccordionItem` components (with `id` values `'cappuccino'` and `'latte'`). Each item must include an `AccordionHeader` (with titles **Cappuccino** and **Latte**) and an `AccordionContent` containing 1–2 sentences about coffee. Set `defaultValue={['cappuccino']}` on the root `Accordion` component so the first section starts open.
2. Multiple-expand accordion without icons. Wrap two `AccordionItem` components (with `id` values `'cappuccino'` and `'latte'`). Each item must include an `AccordionHeader` (with titles **Cappuccino** and **Latte**) and an `AccordionContent` containing 1–2 sentences about coffee. Set `allowMultipleExpand={true}`, include an `onChange` prop, and configure the accordion to display inline without a separator.

---

## PROMPT FOR ATTACHMENT FILE

Generate 6 different attachment files:

1. Default attachment with full metadata and remove action: `fileName` = 'report.pdf', `fileType` = 'PDF', `fileSize` = '1.2 MB', and `onRemove`.
2. Attachment without metadata: `fileName` = 'notes.txt'.
3. Attachment with metadata and without remove button: `fileName` = 'diagram.png', `fileType` = 'PNG', `fileSize` = '450 KB'.
4. Disabled removable attachment: `fileName` = 'contract.docx', `fileType` = 'docx', `fileSize` = '2.4 MB'.
5. Loading removable attachment: `fileName` = 'uploading.zip', `fileType` = 'ZIP', `fileSize` = '8.0 MB', `onRemove`.
6. Attachment with custom visual/accessibility props: `fileName` = 'error-log.json', `fileType` = 'Upload failed', custom `fileIcon` (error icon), custom `separator` = '|', `onRemove`, and `removeButtonLabel` = 'Delete attachment'.

---

## PROMPT FOR BREADCRUMBS

Generate 2 different breadcrumbs:

1. Breadcrumbs with string separator = `|`, content = 'product', 'home', 'category', and with an information icon at the end, colored with border. The first one content should be disabled.
2. Breadcrumbs with icon separator (arrow-right icon), `itemStart` as a clickable home icon link, `separatorAfterLastItem` = true, and custom `ariaLabel` = 'product-breadcrumb-trail'. Use content = 'Home', 'Products', 'Category', where the last item is disabled.

---

## PROMPT FOR COUNTER

Generate 2 different counters:

1. Counter with initial value = 5, min = 0, and max = 20
2. Disabled counter with initial value = 25

---

## PROMPT FOR DROPDOWN

Generate 3 different dropdowns:

1. Simple dropdown with 2 options: 'drop' and 'down'
2. Dropdown with checkboxes: 'drop' and 'up'
3. Accessible dropdown with `role` = 'listbox', `aria-label` = 'sorting-options', and `aria-expanded` = true.

---

## PROMPT FOR FORM

Generate a complete form containing the following components:

- Input with email variant/type
- Input with password variant/type
- Checkbox input with label = 'Remember me'
- Radio input group with options = 'yes', 'no', 'maybe'
- Submit button with text = 'Submit data'

---

## PROMPT FOR INLINE NOTIFICATION

Generate 6 types of inline notifications:

1. Default inline notification with text: 'Default InlineNotification'
2. Warning inline notification with text: 'Warning InlineNotification'
3. Success inline notification with text: 'Success InlineNotification'
4. Error inline notification with text: 'Error InlineNotification'
5. Info inline notification with text: 'Info InlineNotification'
6. Inline notification with custom non-primitive content (to cover `isPrimitive = false`): title 'Actions Required!' and unordered bullet list with 3 short action items.

---

## PROMPT FOR LIST

Generate 3 types of lists:

1. Unordered component with 3 list items: 'Item1', 'Item2', 'Item3', size = md
2. List component with 2 items: 'Item1', 'Item2', and numbered (numerical) ordering, size = sm
3. Unordered list with check markers using 3 items: 'Fast setup', 'Reusable components', 'Theme support'

---

## PROMPT FOR MENU

Generate 3 different menu components:

1. Default menu with 3 items: 'Open', 'Close', 'Profile', and `onSelect` handler.
2. Menu with `closeOnSelect` = false so the menu stays open after item selection.
3. Menu with custom positioning: `placement` = 'top-left', `offsetX` = 12, and `offsetY` = 8.

---

## PROMPT FOR PRICE

Generate 5 different types of price:

1. Default price = 50 with decimals, size small
2. With old price: new = 120, old = 300, European convention, size medium
3. Free price, old one is 300, size large
4. Price without old value: `currentValue` = '99.99', `currencySymbol` = '$', and `size` = 'md'.
5. Large European formatted price: `currentValue` = '1 299,99', `oldValue` = '1 499,99', `currencySymbol` = '€', `currencySymbolPosition` = 'after', and `size` = 'lg'.

---

## PROMPT FOR PROGRESSBAR

Generate 4 different types of progress bar:

1. Default progress bar with value = 20 and percentage text displayed on it
2. Progress bar with value = 50, no percentage displayed on it
3. Indeterminate progress bar with `indeterminate` = true and `aria-label` = 'Loading progress'.
4. Custom styled progress bar with value = 75, `showPercentage` = true, `fillColor` = '#ff4500', and `backgroundColor` = '#E5E5E5'.

---

## PROMPT FOR RADIOGROUP

Generate 5 different radio groups:

1. Default radio group with 5 basic options: 'xs', 's', 'm', 'l', 'xl', where the second option is disabled and with a pre-selected `defaultValue` = 3
2. Color picker using the 'grid' variant with `gridColumns` = 3 and `gridColumnGutter`
3. Visual image picker where options contain an `image` URL and `tooltip`
4. Controlled radio group with `value` and `onChange` handler, `variant` = 'row', and custom `name` = 'size-selector'.
5. Radio group using `renderOption` to render custom card-like option content with payload fields (`title`, `subtitle`, `description`, `price`).

---

## PROMPT FOR RATING

Generate 4 different ratings:

1. Default interactive rating with a pre-selected `defaultValue` = 3
2. Read-only rating with a fractional value = 4.5 and size = 'lg'
3. Rating with max = 10, value = 7, size = 'sm', with custom color = #FF0000
4. Rating with custom `groupName` = 'product-feedback' and initial value = 0

---

## PROMPT FOR SNACKBAR

Generate a component with 6 buttons that trigger different snackbars using the `showSnackbar` function:

1. Success snackbar with title = 'Saved' and a short duration of 3000ms
2. Persistent error snackbar (duration = 0, dismissOnClick = false) containing an 'action' button 'Retry'
3. Warning snackbar with the 'colored' property enabled (filled background)
4. Info snackbar that overrides the default icon with a custom icon
5. Top-left positioned info snackbar with `position` = 'top-left' and `dismissOnClick` = true.
6. Non-animated snackbar with `isAnimated` = false, title = 'Instant close', and `onClose` callback to verify immediate closing behavior.

---

## PROMPT FOR STEPPER

Generate 4 different steppers:

1. Default checkout stepper with 4 steps ('Cart', 'Shipping', 'Payment', 'Review') where activeStep = 1
2. Stepper displaying validation states: first step has validationStatus = 'success', second step has validationStatus = 'error', and activeStep = 2
3. Icons view stepper (`isIconsView` = true) with 3 steps
4. Icons view stepper with custom `customView` icons per step (for example success/info/home/star) and one step marked with `validationStatus` = 'error'.

---

## PROMPT FOR TABLE

Generate 5 different tables:

1. Basic table where the first column has a fixed width of '200px' and the second has a width of '15%', using a small dataset
2. Table with expandable rows (`expandableRows` = true) that renders a custom Box with text inside `renderExpandedContent`
3. Table with stickyHeader and sticky footer including a generated large dataset of 30 items
4. Table in a loading state (`loading` = true) that displays a custom `loadingState` using Skeleton components instead of data
5. Table with pagination enabled (`pagination` = true) using 50 rows, `pageSize` = 10, and `onPageChange` + `onPageSizeChange` handlers.

---

## PROMPT FOR TABS

Generate 2 different tabs:

1. Default tabs with 3 items ('Overview', 'Details', 'Reviews') where activeTab = 1
2. 3 tabs (Main, Home, Dashboard) with a noticeCounter (from 1 to 3), where the last tab is disabled.

---

## PROMPT FOR TOOLTIP

Generate 4 different tooltips:

1. Default tooltip with content = 'Save your changes' wrapping a basic typography text = 'Hello'
2. Tooltip with rich content (very long text for the tooltip)
3. Tooltip with custom behavior: `position` = 'bottom', `delay` = 1000, and `gap` = 20.
4. Accessible tooltip with `ariaLabel` = 'Additional information tooltip' and concise content for keyboard/focus usage.

---
