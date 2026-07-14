# Atomic Component Testing Prompts

## PROMPT FOR AVATAR

Generate 5 different avatars:

1. Default Avatar with random picture, size s
2. Avatar with badge and custom color: #99322b, size m
3. Avatar with initials : TJ and custom background color : #cfaaa7, size l
4. Avatar with icon of star, size xl
5. Two Avatar.User variants side by side: a card variant with name = 'Jane Doe', subtitle = 'Engineer', and a badge; and a profile variant with name = 'John Smith', subtitle = 'Admin', and an action button labeled 'Edit'

---

## PROMPT FOR BADGE

Generate 5 different badges:

1. Small badge with primary color
2. Medium badge with secondary light background
3. Large badge with tertiary outline and with start icon
4. Large Quaternary Outline Filled Light disabled badge and with icon on the end
5. Medium quinary badge with filled appearance and text label = 'Beta'

---

## PROMPT FOR BOX

Generate 4 different types of boxes:

1. Default vertical box with centered content (use flex alignment so children are centered)
2. Highlighted horizontal box with a border
3. Box with hover shadow effect
4. Vertical box with content 'Skip region' and tabIndex set so the box is removed from the tab order (not keyboard-focusable)

---

## PROMPT FOR BUTTON

Generate 6 different buttons:

1. Default primary button with text 'Click me' and small size
2. Secondary button with check icon on the start, text 'Don't Click' and arrow-right icon on the end, size medium
3. Tertiary Icon-only button using `isIcon`, cross icon, NO visible label text, with `ariaLabel` = 'Close'
4. Disabled outlined button with text 'Disabled', size large
5. `type` submit with rounded styling
6. Button in loading state

---

## PROMPT FOR CHECKBOX

Generate 3 different checkboxes using `input` with `variant=”checkbox”`:

1. Default unchecked checkbox input with label “Accept terms”, name=”terms”, value=”yes”, and an action that toggles its checked state.
2. Checkbox input with indeterminate state and label 'Select all'
3. Small checkbox input with disabled state, checked true, label 'Unavailable option'

---

## PROMPT FOR ICON

Generate 3 different icons:

1. Cross icon with error color
2. thumbUp icon with `size` = xl
3. Check icon with explicit `width` = 24 and `height` = 24 (no `size` prop)

---

## PROMPT FOR IMAGE

Generate 4 different images:

1. Default image where set as = 'figure' and captionAs = 'figcaption' with explicit caption text = 'This is a semantic image caption'.
2. Image with placeholder: loading image
3. Image with valid src. Set objectFit = 'cover' and an explicit caption text = 'Cropped Cover Test'
4. Image where src points to a totally broken/invalid URL (e.g., '<http://invalid.url/image.jpg>'). The fallbackComponent must be a Row containing an explicit text = 'Image failed to load'

---

## PROMPT FOR INPUT

Generate 9 different inputs:

1. Success color input with label 'Simple Label', helper text 'Need some help', and `required` (or `ariaRequired`) true
2. Disabled input with placeholder 'Disabled'
3. Password input (`variant` password) with an `adornmentEnd` control that toggles between masked and visible text
4. Text input with rounded corners
5. Checkbox input (`variant` checkbox) with label 'This is checkbox', `name`, `value`, and `onChange` handler
6. Radio input (`variant` radio) with label 'This is radio', `name` (group name), `value`, and either controlled `checked` or `onChange`
7. Error color input with label, helper text as the error message
8. Read-only text input with `readOnly` true and `value` 'Cannot edit';
9. Separate text input that shows `adornmentStart` currency € with a short label

---

## PROMPT FOR INPUTFILE

Generate 5 different input files:

1. Input file with custom text: 'Pick a file'.
2. Disabled input file
3. Input file as an icon ONLY (no text) include `buttonProps` `ariaLabel` for accessibility
4. Input file with `multiple` true so several files can be selected, with `onChange`
5. Input file with `accept` restricting types (e.g. `.pdf` / PDF MIME types, or `image/*`)

---

## PROMPT FOR LABEL

Generate 4 different labels:

1. Label with text 'Label with star icon' and a child star icon beside the text
2. Label with custom `styles` error background and white text and text 'Hello'
3. Form label: set `htmlFor` to match a paired field's `id` (e.g. input `id` = 'user-email', label text 'Email address')
4. Label with an `onClick` handler and text 'More details' (interactive label pattern)

---

## PROMPT FOR LINK

Generate 6 different links:

1. Primary link with text 'Go to Dashboard', `variant` primary, and `underline` = 'highlight' (underline appears on hover)
2. External link: `href` '<https://react.dev>', text 'React documentation', `target` '\_blank', and `rel` = 'noopener noreferrer'
3. Disabled link with text 'Coming Soon', `disabled` true, and custom error color styling
4. Inline link with `href` '#setup' (or another fragment), text 'Jump to setup', `size` 'lg', used inside a paragraph; target section has matching `id`
5. Link with `href` 'mailto:support@example.com', text 'Email support', and `role` = 'button' for a toolbar-style control (still navigates via mailto when not disabled)
6. Secondary variant link with text 'Learn more', and a separate inverted variant link suitable on a dark background with text 'Privacy'

---

## PROMPT FOR LOADER

Generate 3 different loaders:

1. Default loader with circle animation
2. Loader with dots animation size = large
3. Loader with dots animation , which are rounded

---

## PROMPT FOR SELECT

Generate 6 different selects:

1. Searchable select with `searchPlaceholder` = 'Search fruits...', several fruit options, and an `onChange` (or `onSelect`) handler when the user picks an item
2. Multiple select with `itemStringifier` formatting chips/labels from options (e.g. uppercase names), several options, and `onChange` reflecting the multi-value updates
3. Single select with `adornmentStart` (e.g. euro symbol or Icon), `color` = 'success', placeholder, and a short list of options
4. Single select with `items` = `[]` (or undefined) and `emptyItemsResult` text 'No data available' when the menu opens
5. Disabled select with `disabled` true, `placeholder` = 'Disabled option', and sample items that cannot be chosen
6. Single select with `color` 'error' or 'warning' (whichever contrasts in the theme), default items, and optional `dropdownMaxHeight` constrained (e.g. '120px') to show scrolling behavior with many items

---

## PROMPT FOR SEPARATOR

Generate 3 different separators:

1. Default horizontal separator with label = 'OR'
2. Vertical dotted type separator with RED custom color
3. Dashed separator with size = 'lg', label = 'Next Section' positioned at the start

---

## PROMPT FOR SKELETON

Generate 3 different skeletons:

1. Circular skeleton with basic animation
2. Rectangular skeleton with content inside = 'Loading'
3. Default skeleton with success background color

---

## PROMPT FOR SLIDER

Generate 4 different sliders:

1. Default slider with `value` = 30, `min` = 0, `max` = 100, and an `onChange` handler that updates or logs the numeric value
2. Disabled slider (same range as 1 or any range), `disabled` true
3. Slider with `step` = 10, `min` = 0, `max` = 50, initial `value` = 25, so the thumb jumps in steps of 5
4. Slider with a non-zero range: `min` = 10, `max` = 90, `value` = 40 (or controlled `value` + `onChange`)

---

## PROMPT FOR SLIDERDOTS

Generate slider dots:

1. Default slider dots with count = 5

---

## PROMPT FOR SWITCH

Generate 4 different switches:

1. Controlled switch with `checked` and `onValueChange`, label on the right = 'Enable notifications'
2. Disabled switch with `label` = 'left', children text 'Dark mode'
3. Switch with `isLoading` true and children text 'Auto-save'
4. Checked switch (`checked` true) with no visible label children; set an accessible name with `aria-label` = 'Toggle sound' on the component (or equivalent on the focusable control)

---

## PROMPT FOR TEXTAREA

Generate 5 different textareas.

1. Default `variant` with `placeholder` 'Hello', `char limit` 10, `color` 'success'
2. Textarea with `resize` 'vertical' or 'both', `maxCharacters` 20, and visible character counter (wrapper with count), `placeholder` ‘Resizable input’
3. `variant` 'inline' with `placeholder` 'Inline notes' and `color` 'primary’, `placeholder` ‘Inline input’
4. Textarea with `dynamicHeightAdjustment` true, multiline content = 'This is some initial content that will expand the textarea as you type more text into it. The height will adjust automatically to fit the content, making it a dynamic input experience.' height, `placeholder` ‘Dynamic input’
5. Disabled textarea with `disabled` true and `placeholder` 'Disabled'

---

## PROMPT FOR TOGGLE

Generate 4 different toggles:

1. Toggle with `items` as string array ['Hello', 'Bye'], controlled `value` (e.g. 'Hello'), and `onValueChange` updating or logging the selected value
2. Toggle with three `ToggleItem` objects where `label` is text but `value` is an id (e.g. `{ label: 'Day', value: 'day' }`, `{ label: 'Week', value: 'week' }`, `{ label: 'Month', value: 'month' }`), `value` set to one id, and `onValueChange`
3. Disabled toggle with `disabled` true, same or similar `items`, and `value` frozen on one option (clicks should not change selection)
4. Toggle with three options using `renderItemContent` to render home, user, and info Icons; use `ToggleItem` entries with stable `value` per option and readable names (e.g. text beside icons or visually hidden labels) since each control is a `Button` child

---

## PROMPT FOR TRUNCATE

Generate 2 different truncate:

1. Default truncate
2. Line truncation with error color text

---

## PROMPT FOR TYPOGRAPHY

Generate 4 different typography elements:

1. Text = 'This is simple text' with 'xl' size, underlined, and centered alignment
2. SEO-friendly title that visually looks like 'h2' but renders as a 'h1' element
3. Small text showing a crossed-out original price (using 'strike' style variant) in a secondary text color
4. Category label using the 'caption' variant, styled as uppercase and semibold, with direct padding applied

---

## PROMPT FOR WRAPPER

Generate 2 different wrappers:

1. Inline wrapper used to highlight text, with a success background, and bold text styling 2
2. Custom tag wrapper rendered as an 'article' with a dashed blue border and border-radius
