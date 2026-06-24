/**
 * A2UI Integration Testing Prompts
 *
 * Single-source-of-truth for all component testing prompts used in A2UI integration tests.
 * Organized by atomic design hierarchy: atoms → molecules → organisms → layouts/templates.
 *
 * Usage:
 *   import { ATOMIC } from './index';
 *   const userPrompt = ATOMIC.button.prompt;               // → full numbered prompt string
 *   const stepLabel = ATOMIC.button.steps.defaultPrimary;  // → TypeScript-typed step text
 *
 * Or flat:
 *   import { COMPONENT_PROMPTS } from './index';
 *   const userPrompt = COMPONENT_PROMPTS.button.prompt;
 */

// ─── HELPER ────────────────────────────────────────────────────────────────────

function createPromptConfig<T extends Record<string, string>>(
  title: string,
  steps: T,
  format: 'numbered' | 'bullet' = 'numbered'
) {
  const stepsList = Object.values(steps);
  const prompt =
    format === 'bullet'
      ? `${title}\n${stepsList.map((step) => `- ${step}`).join('\n')}`
      : `${title}\n${stepsList.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;

  return { prompt, steps };
}

// ─── ATOMIC ────────────────────────────────────────────────────────────────────

export const ATOMIC = {
  avatar: createPromptConfig('Generate 5 different avatars:', {
    defaultSmall: 'Default Avatar with random picture, size s',
    badgeMedium: 'Avatar with badge and custom color: #99322b, size m',
    initialsLarge: 'Avatar with initials : TJ and custom background color : #cfaaa7, size l',
    iconExtraLarge: 'Avatar with icon of star, size xl',
    variantsSideBySide:
      "Two Avatar.User variants side by side: a card variant with name = 'Jane Doe', subtitle = 'Engineer', and a badge; and a profile variant with name = 'John Smith', subtitle = 'Admin', and an action button labeled 'Edit'",
  }),

  badge: createPromptConfig('Generate 5 different badges:', {
    smallPrimary: 'Small badge with primary color',
    mediumSecondaryLight: 'Medium badge with secondary light background',
    largeTertiaryOutline: 'Large badge with tertiary outline and with start icon',
    largeQuaternaryDisabled: 'Large Quaternary Outline Filled Light disabled badge and with icon on the end',
    mediumQuinary: "Medium quinary badge with filled appearance and text label = 'Beta'",
  }),

  box: createPromptConfig('Generate 4 different types of boxes:', {
    defaultVertical: 'Default vertical box with centered content (use flex alignment so children are centered)',
    highlightedHorizontal: 'Highlighted horizontal box with a border',
    hoverShadow: 'Box with hover shadow effect',
    skipRegion:
      "Vertical box with content 'Skip region' and tabIndex set so the box is removed from the tab order (not keyboard-focusable)",
  }),

  button: createPromptConfig('Generate 6 different buttons:', {
    defaultPrimary: "Default primary button with text 'Click me' and small size",
    secondaryWithIcons:
      "Secondary button with check icon on the start, text 'Don't Click' and arrow-right icon on the end, size medium",
    tertiaryIconOnly:
      "Tertiary Icon-only button using `isIcon`, cross icon, NO visible label text, with `ariaLabel` = 'Close'",
    disabledOutlined: "Disabled outlined button with text 'Disabled', size large",
    submitRounded: '`type` submit with rounded styling',
    loadingState: 'Button in loading state with ariaLabel=`Loading state`',
  }),

  checkbox: createPromptConfig('Generate 3 different checkboxes:', {
    defaultUnchecked: 'Checkbox (label "Accept terms"). The checkbox must be clickable and toggle its state visually.',
    indeterminate:
      "Checkbox (label 'Select all'). Use a `ref` or `useState` to set the `indeterminate` property to true. The checkbox must be clickable and toggle its state visually.",
    smallDisabled:
      "Small checkbox = label 'Unavailable option'. It should be `disabled` and `checked={true}`. Explicitly add `readOnly` to the input.",
  }),

  icon: createPromptConfig('Generate 3 different icons:', {
    crossError: 'Cross icon with error color',
    thumbUpXl: '`thumbUp` icon with `size` = xl',
    checkExplicitSize: 'Check icon with explicit `width` = 24 and `height` = 24 (no `size` prop)',
  }),

  image: createPromptConfig('Generate 4 different images:', {
    semanticFigure:
      "Default image where set as = 'figure' and captionAs = 'figcaption' with explicit caption text = 'This is a semantic image caption'.",
    loadingPlaceholder: 'Image with placeholder: loading image',
    coverFit: "Image with valid src. Set objectFit = 'cover' and an explicit caption text = 'Cropped Cover Test'",
    brokenSrcFallback:
      "Image where src points to a totally broken/invalid URL (e.g., 'http://invalid.url/image.jpg'). The fallbackComponent must be a Row containing an explicit text = 'Image failed to load'",
  }),

  input: createPromptConfig('Generate 9 different inputs:', {
    successRequired:
      "Success color input with label 'Simple Label', helper text 'Need some help', and `required` (or `ariaRequired`) true",
    disabled: "Disabled input with placeholder 'Disabled'",
    passwordToggle:
      'Password input (`variant` password) with an `adornmentEnd` control that toggles between masked and visible text',
    roundedCorners: 'Text input with rounded corners',
    checkboxVariant:
      "Checkbox input (`variant` checkbox) with label 'This is checkbox', `name`, `value`, and `onChange` handler",
    radioVariant:
      "Radio input (`variant` radio) with label 'This is radio', `name` (group name), `value`, and either controlled `checked` or `onChange`",
    errorColor: 'Error color input with label, helper text as the error message',
    readOnly: "Read-only text input with `readOnly` true and `value` 'Cannot edit';",
    currencyAdornment: 'Separate text input that shows `adornmentStart` currency € with a short label',
  }),

  inputFile: createPromptConfig('Generate 5 different input files:', {
    customText: "Input file with custom text: 'Pick a file'.",
    disabled: 'Disabled input file',
    iconOnly: 'Input file as an icon ONLY (no text) include `buttonProps` `ariaLabel` for accessibility',
    multipleFiles: 'Input file with `multiple` true so several files can be selected, with `onChange`',
    acceptFilter: 'Input file with `accept` restricting types (e.g. `.pdf` / PDF MIME types, or `image/*`)',
  }),

  label: createPromptConfig('Generate 4 different labels:', {
    withStarIcon: "Label with text 'Label with star icon' and a child star icon beside the text",
    customErrorStyles: "Label with custom `styles` error background and white text and text 'Hello'",
    formHtmlFor:
      "Form label: set `htmlFor` to match a paired field's `id` (e.g. input `id` = 'user-email', label text 'Email address')",
    onClickHandler: "Label with an `onClick` handler and text 'More details' (interactive label pattern)",
  }),

  link: createPromptConfig('Generate 6 different links:', {
    primaryHighlight:
      "Primary link with text 'Go to Dashboard', `variant` primary, and `underline` = 'highlight' (underline appears on hover)",
    externalBlank:
      "External link: `href` 'https://react.dev', text 'React documentation', `target` '_blank', and `rel` = 'noopener noreferrer'",
    disabledComingSoon: "Disabled link with text 'Coming Soon', `disabled` true, and custom error color styling",
    inlineFragment:
      "Inline link with `href` '#setup' (or another fragment), text 'Jump to setup', `size` 'lg', used inside a paragraph; target section has matching `id`",
    mailtoSupport:
      "Link with `href` 'mailto:support@example.com', text 'Email support', and `role` = 'button' for a toolbar-style control (still navigates via mailto when not disabled)",
    secondaryInverted:
      "Secondary variant link with text 'Learn more', and a separate inverted variant link suitable on a dark background with text 'Privacy'",
  }),

  loader: createPromptConfig('Generate 3 different loaders:', {
    defaultCircle: 'Default loader with circle animation',
    dotsLarge: 'Loader with dots animation size = large',
    dotsRounded: 'Loader with dots animation, which are rounded',
  }),

  select: createPromptConfig('Generate 4 different selects:', {
    searchable:
      "Searchable select with `searchPlaceholder` = 'Searchable select', with `adornmentStart` with cross Icon, several fruit options = 'Apple', 'Banana', 'Grape', and an `onChange` (or `onSelect`) handler when the user picks an item",
    multiple:
      "Multiple select with `itemStringifier` formatting chips/labels from options (e.g. uppercase names), several options = 'Apple', 'Banana', 'Grape', and `onChange` reflecting the multi-value updates and placeholder = 'Multiple select'",
    emptyItems:
      "Single select with `items` = `[]` (or undefined) and `emptyItemsResult` text 'No data available' when the menu opens and placeholder = 'Empty Select'",
    disabled:
      "Disabled select with `disabled` true, `placeholder` = 'Disabled option', and sample items that cannot be chosen",
  }),

  separator: createPromptConfig('Generate 3 different separators:', {
    defaultOrLabel: "Default horizontal separator with label = 'OR'",
    verticalDottedRed: 'Vertical dotted type separator with RED custom color',
    dashedLargeStart: "Dashed separator with size = 'lg', label = 'Next Section' positioned at the start",
  }),

  skeleton: createPromptConfig('Generate 3 different skeletons:', {
    circular: 'Circular skeleton with basic animation',
    rectangularWithContent: "Rectangular skeleton with content inside = 'Loading'",
    successBackground: 'Default skeleton with success background color',
  }),

  slider: createPromptConfig('Generate 4 different sliders:', {
    defaultValue:
      'Default slider with `value` = 30, `min` = 0, `max` = 100, and an `onChange` handler that updates or logs the numeric value',
    disabled: 'Disabled slider (same range as 1 or any range), `disabled` true',
    withStep: 'Slider with `step` = 10, `min` = 0, `max` = 50, initial `value` = 25, so the thumb jumps in steps of 5',
    nonZeroRange:
      'Slider with a non-zero range: `min` = 10, `max` = 90, `value` = 40 (or controlled `value` + `onChange`)',
  }),

  sliderDots: createPromptConfig('Generate slider dots:', {
    defaultCount: 'Default slider dots with count = 5',
  }),

  switch: createPromptConfig('Generate 4 different switches:', {
    controlled: "Controlled switch with `checked` and `onValueChange`, label on the right = 'Enable notifications'",
    disabledLeft: "Disabled switch with `label` = 'left', children text 'Dark mode'",
    isLoading: "Switch with `isLoading` true and children text 'Auto-save'",
    checkedAriaLabel:
      "Checked switch (`checked` true) with no visible label children; set an accessible name with `aria-label` = 'Toggle sound' on the component (or equivalent on the focusable control)",
  }),

  textarea: createPromptConfig('Generate 4 different textareas.', {
    defaultSuccess: "Default `variant` with `placeholder` 'Hello', `char length` 5, `color` 'success'",
    resizableCounter:
      "Textarea with `resize` 'vertical' or 'both', `maxCharacters` 20, and visible character counter (wrapper with count), `placeholder` 'Resizable input'",
    inlineVariant: "`variant` 'inline' with `placeholder` 'Inline input' and `color` 'primary'",
    disabled: "Disabled textarea with `disabled` true and `placeholder` 'Disabled'",
  }),

  toggle: createPromptConfig('Generate 4 different toggles:', {
    stringItems:
      "Toggle with `items` as string array ['Hello', 'Bye'], controlled `value` (e.g. 'Hello'), and `onValueChange` updating or logging the selected value",
    objectItems:
      "Toggle with three `ToggleItem` objects where `label` is text but `value` is an id (e.g. `{ label: 'Day', value: 'day' }`, `{ label: 'Week', value: 'week' }`, `{ label: 'Month', value: 'month' }`), `value` set to one id, and `onValueChange`",
    disabled:
      'Disabled toggle with `disabled` true, same or similar `items`, and `value` frozen on one option (clicks should not change selection)',
    renderItemContent:
      'Toggle with three options using `renderItemContent` to render home, user, and info Icons; use `ToggleItem` entries with stable `value` per option and readable names (e.g. text beside icons or visually hidden labels) since each control is a `Button` child',
  }),

  truncate: createPromptConfig('Generate 2 different truncate:', {
    defaultTruncate: 'Default truncate',
    lineErrorColor: 'Line truncation with error color text',
  }),

  typography: createPromptConfig('Generate 4 different typography elements:', {
    xlUnderlinedCentered: "Text = 'This is simple text' with 'xl' size, underlined, and centered alignment",
    seoFriendlyTitle: "SEO-friendly title that visually looks like 'h2' but renders as a 'h1' element",
    strikethroughPrice:
      "Small text showing a crossed-out original price (using 'strike' style variant) in a secondary text color",
    captionUppercase:
      "Category label using the 'caption' variant, styled as uppercase and semibold, with direct padding applied",
  }),

  wrapper: createPromptConfig('Generate 2 different wrappers:', {
    inlineHighlight: 'Inline wrapper used to highlight text, with a success background, and bold text styling',
    customArticleTag: "Custom tag wrapper rendered as an 'article' with a dashed blue border and border-radius",
  }),
} as const;

// ─── MOLECULAR ─────────────────────────────────────────────────────────────────

export const MOLECULAR = {
  accordion: createPromptConfig('Generate 2 different accordions:', {
    singleExpand:
      "Single-expand accordion with icons. Wrap two `AccordionItem` components (with `id` values `'cappuccino'` and `'latte'`). Each item must include an `AccordionHeader` (with titles Cappuccino and Latte) and an `AccordionContent` containing 1-2 sentences about coffee. Set `defaultValue={['cappuccino']}` on the root `Accordion` component so the first section starts open.",
    multipleExpand:
      "Multiple-expand accordion without icons. Wrap two `AccordionItem` components (with `id` values `'cappuccino'` and `'latte'`). Each item must include an `AccordionHeader` (with titles Cappuccino and Latte) and an `AccordionContent` containing 1-2 sentences about coffee. Set `allowMultipleExpand={true}`, include an `onChange` prop, and configure the accordion to display inline without a separator.",
  }),

  attachmentFile: createPromptConfig('Generate 6 different attachment files:', {
    fullMetadata:
      "Default attachment with full metadata and remove action: `fileName` = 'report.pdf', `fileType` = 'PDF', `fileSize` = '1.2 MB', and `onRemove`.",
    withoutMetadata: "Attachment without metadata: `fileName` = 'notes.txt'.",
    withMetadataNoRemove:
      "Attachment with metadata and without remove button: `fileName` = 'diagram.png', `fileType` = 'PNG', `fileSize` = '450 KB'.",
    disabledRemovable:
      "Disabled removable attachment: `fileName` = 'contract.docx', `fileType` = 'docx', `fileSize` = '2.4 MB'.",
    loadingRemovable:
      "Loading removable attachment: `fileName` = 'uploading.zip', `fileType` = 'ZIP', `fileSize` = '8.0 MB', `onRemove`.",
    customVisual:
      "Attachment with custom visual/accessibility props: `fileName` = 'error-log.json', `fileType` = 'Upload failed', custom `fileIcon` (error icon), custom `separator` = '|', `onRemove`, and `removeButtonLabel` = 'Delete attachment'.",
  }),

  breadcrumbs: createPromptConfig('Generate 2 different breadcrumbs:', {
    stringSeparator:
      "Breadcrumbs with string separator = `|`, content = 'product', 'home', 'category', and with an information icon at the end, colored with border. The first one content should be disabled.",
    iconSeparator:
      "Breadcrumbs with icon separator (arrow-right icon), `itemStart` as a clickable home icon link, `separatorAfterLastItem` = true, and custom `ariaLabel` = 'product-breadcrumb-trail'. Use content = 'Home', 'Products', 'Category', where the last item is disabled.",
  }),

  counter: createPromptConfig('Generate 2 different counters:', {
    withMinMax: 'Counter with initial value = 5, min = 0, and max = 20',
    disabled: 'Disabled counter with initial value = 25',
  }),

  dropdown: createPromptConfig('Generate 3 different dropdowns:', {
    simpleOptions: "Simple dropdown with 2 options: 'drop' and 'down'",
    withCheckboxes: "Dropdown with checkboxes: 'drop' and 'up'",
    accessible:
      "Accessible dropdown with `role` = 'listbox', `aria-label` = 'sorting-options', and `aria-expanded` = true.",
  }),

  form: createPromptConfig(
    'Generate a complete form containing the following components:',
    {
      email: 'Input with email variant/type',
      password: 'Input with password variant/type',
      checkboxRemember: "Checkbox input with label = 'Remember me'",
      radioGroup: "Radio input group with options = 'yes', 'no', 'maybe'",
      submitButton: "Submit button with text = 'Submit data'",
    },
    'bullet'
  ),

  inlineNotification: createPromptConfig('Generate 6 types of inline notifications:', {
    defaultNotification: "Default inline notification with text: 'Default InlineNotification'",
    warning: "Warning inline notification with text: 'Warning InlineNotification'",
    success: "Success inline notification with text: 'Success InlineNotification'",
    error: "Error inline notification with text: 'Error InlineNotification'",
    info: "Info inline notification with text: 'Info InlineNotification'",
    customContent:
      "Inline notification with custom non-primitive content (to cover `isPrimitive = false`): title 'Actions Required!' and unordered bullet list with 3 short action items.",
  }),

  list: createPromptConfig('Generate 3 types of lists:', {
    unordered: "Unordered component with 3 list items: 'Item1', 'Item2', 'Item3', size = md",
    numbered: "List component with 2 items: 'Item1', 'Item2', and numbered (numerical) ordering, size = sm",
    checkMarkers:
      "Unordered list with check markers using 3 items: 'Fast setup', 'Reusable components', 'Theme support'",
  }),

  menu: createPromptConfig('Generate 3 different menu components:', {
    defaultItems: "Default menu with 3 items: 'Open', 'Close', 'Profile', and `onSelect` handler.",
    persistentOpen: 'Menu with `closeOnSelect` = false so the menu stays open after item selection.',
    customPositioning: "Menu with custom positioning: `placement` = 'top-left', `offsetX` = 12, and `offsetY` = 8.",
  }),

  price: createPromptConfig('Generate 5 different types of price:', {
    defaultSmall: 'Default price = 50 with decimals, size small',
    withOldPriceMedium: 'With old price: new = 120, old = 300, European convention, size medium',
    freePrice: 'Free price, old one is 300, size large',
    withoutOldValue: "Price without old value: `currentValue` = '99.99', `currencySymbol` = '$', and `size` = 'md'.",
    largeEuropean:
      "Large European formatted price: `currentValue` = '1 299,99', `oldValue` = '1 499,99', `currencySymbol` = '€', `currencySymbolPosition` = 'after', and `size` = 'lg'.",
  }),

  progressBar: createPromptConfig('Generate 4 different types of progress bar:', {
    defaultWithPercentage: 'Default progress bar with value = 20 and percentage text displayed on it',
    noPercentage: 'Progress bar with value = 50, no percentage displayed on it',
    indeterminate: "Indeterminate progress bar with `indeterminate` = true and `aria-label` = 'Loading progress'.",
    customStyled:
      "Custom styled progress bar with value = 75, `showPercentage` = true, `fillColor` = '#ff4500', and `backgroundColor` = '#E5E5E5'.",
  }),

  radioGroup: createPromptConfig('Generate 5 different radio groups:', {
    defaultOptions:
      "Default radio group with 5 basic options: 'xs', 's', 'm', 'l', 'xl', where the second option is disabled and with a pre-selected `defaultValue` = 3",
    colorPickerGrid: "Color picker using the 'grid' variant with `gridColumns` = 3 and `gridColumnGutter`",
    imagePicker: 'Visual image picker where options contain an `image` URL and `tooltip`',
    controlled:
      "Controlled radio group with `value` and `onChange` handler, `variant` = 'row', and custom `name` = 'size-selector'.",
    renderOptionCards:
      'Radio group using `renderOption` to render custom card-like option content with payload fields (`title`, `subtitle`, `description`, `price`).',
  }),

  rating: createPromptConfig('Generate 4 different ratings:', {
    defaultInteractive: 'Default interactive rating with a pre-selected `defaultValue` = 3',
    readOnlyFractional: "Read-only rating with a fractional value = 4.5 and size = 'lg'",
    customMaxColor: "Rating with max = 10, value = 7, size = 'sm', with custom color = #FF0000",
    customGroupName: "Rating with custom `groupName` = 'product-feedback' and initial value = 0",
  }),

  snackbar: createPromptConfig(
    'Generate a component with 6 buttons that trigger different snackbars using the `showSnackbar` function:',
    {
      successSnackbar: "Success snackbar with title = 'Saved' and a short duration of 3000ms",
      persistentError:
        "Persistent error snackbar (duration = 0, dismissOnClick = false) containing an 'action' button 'Retry'",
      warningColored: "Warning snackbar with the 'colored' property enabled (filled background)",
      infoCustomIcon: 'Info snackbar that overrides the default icon with a custom icon',
      topLeftPositioned: "Top-left positioned info snackbar with `position` = 'top-left' and `dismissOnClick` = true.",
      nonAnimated:
        "Non-animated snackbar with `isAnimated` = false, title = 'Instant close', and `onClose` callback to verify immediate closing behavior.",
    }
  ),

  stepper: createPromptConfig('Generate 4 different steppers:', {
    defaultCheckout:
      "Default checkout stepper with 4 steps ('Cart', 'Shipping', 'Payment', 'Review') where activeStep = 1",
    validationStates:
      "Stepper displaying validation states: first step has validationStatus = 'success', second step has validationStatus = 'error', and activeStep = 2",
    iconsView: 'Icons view stepper (`isIconsView` = true) with 3 steps',
    iconsCustomView:
      "Icons view stepper with custom `customView` icons per step (for example success/info/home/star) and one step marked with `validationStatus` = 'error'.",
  }),

  table: createPromptConfig('Generate 5 different tables:', {
    basicColumnWidths:
      "Basic table where the first column has a fixed width of '200px' and the second has a width of '15%', using a small dataset",
    expandableRows:
      'Table with expandable rows (`expandableRows` = true) that renders a custom Box with text inside `renderExpandedContent`',
    stickyHeaderFooter: 'Table with stickyHeader and sticky footer including a generated large dataset of 30 items',
    loadingState:
      'Table in a loading state (`loading` = true) that displays a custom `loadingState` using Skeleton components instead of data',
    withPagination:
      'Table with pagination enabled (`pagination` = true) using 50 rows, `pageSize` = 10, and `onPageChange` + `onPageSizeChange` handlers.',
  }),

  tabs: createPromptConfig('Generate 2 different tabs:', {
    defaultThree: "Default tabs with 3 items ('Overview', 'Details', 'Reviews') where activeTab = 1",
    withNoticeCounter:
      '3 tabs (Main, Home, Dashboard) with a noticeCounter (from 1 to 3), where the last tab is disabled.',
  }),

  tooltip: createPromptConfig('Generate 4 different tooltips:', {
    defaultTooltip: "Default tooltip with content = 'Save your changes' wrapping a basic typography text = 'Hello'",
    richContent: 'Tooltip with rich content (very long text for the tooltip)',
    customBehavior: "Tooltip with custom behavior: `position` = 'bottom', `delay` = 1000, and `gap` = 20.",
    accessible:
      "Accessible tooltip with `ariaLabel` = 'Additional information tooltip' and concise content for keyboard/focus usage.",
  }),
} as const;

// ─── ORGANISM ──────────────────────────────────────────────────────────────────

export const ORGANISM = {
  card: createPromptConfig('Generate 7 different cards:', {
    defaultVertical:
      'Default vertical product card with `isBordered` = true, root `padding` + `gutter`, image (`src`, `alt`), title, description, price (`currentValue` + `oldValue`), rating (`value` + `label`), and outlined CTA button',
    horizontal:
      "Horizontal card with `variant` = 'horizontal', explicit image `width` + `height` (numbers), and a `Card.Row` for price + button using `align`, `justify`, `gutter` = '16px', and `isWrap` = false",
    compact:
      "Compact card using `size` = 'sm' across title, description, price, rating, and button, with `isHighlighted` = true and `withShadowHover` = true",
    withCounter:
      "Counter card with `initial` = 5, `min` = 3, `max` = 10, and counter `actions`; include a second counter in the same card with `disabled` = true and `size` = 'sm'",
    buttonVariants:
      'Button-variant card containing 5 CTAs: `primary`, `secondary`, `tertiary`, `text`, and `outlined`; one button must be `disabled`, and enabled ones should include `actions`',
    scrollableContent:
      'Scrollable content card with explicit root `styling` for overflow behavior (fixed-height area), enough description text to overflow, and required root `padding` + `gutter`',
    stylingStressTest:
      'Subcomponent styling stress-test card: apply `styling` overrides to image, title, description, price, button, and rating to verify each style object is parsed',
  }),

  carousel: createPromptConfig('Generate 5 types of carousel:', {
    defaultHorizontal:
      'Default horizontal carousel with 3 random images, navigation arrows (showArrows = true), and navigation dots (showDots = true)',
    customContentSlide:
      'Carousel with custom content inside the first slide (using Carousel.Slide with a Column/Row containing Typography and a Button), followed by standard image slides. Navigation arrows (showArrows = false) and navigation dots (showDots = false)',
    verticalWithThumbs:
      "Vertical carousel with 4 random images, `layout` = 'vertical', fixed height in `styling`, and `thumbs` = 'start'",
    singleFocus:
      "Single-focus carousel with `variant` = 'single', `showArrows` = true, `showDots` = false, and `isFocusable` = true",
  }),

  chart: createPromptConfig('Generate 8 different charts:', {
    lineChart:
      "Line chart with `variant` = 'line', 4 months of data, `xKey` = 'month', and 2 series (`Revenue`, `Profit`) with custom labels",
    barChart:
      "Bar chart with `variant` = 'bar', category data, `xKey` = 'quarter', and 2 series rendered side-by-side; enable legend with `interactive` = true and place it at the top",
    stackedBar:
      "Stacked bar chart with `variant` = 'bar', 3 series sharing the same `stackId` so bars stack in each category",
    areaChart:
      "Area chart with `variant` = 'area', cumulative data, `xKey` = 'week', and series-level visual tuning (`curveType` + `fillOpacity`)",
    pieChart:
      "Pie chart with `variant` = 'pie' using `pieConfig` (`nameKey`, `dataKey`, `showLabels` = true), plus custom `colors` palette",
    donutChart:
      "Donut chart with `variant` = 'donut' using `pieConfig` (`nameKey`, `dataKey`, `showLabels` = true, `innerRadius`, `outerRadius`, `paddingAngle`, `startAngle`, `endAngle`)",
    fullConfiguration:
      'Fully configured cartesian chart that includes `xAxis`, `yAxis`, `grid`, `tooltip` (`enabled` = true), `chartHeight`, `chartMargin`, `animate` = false, and accessibility text (`title`, `label`, `description`)',
    stateCoverage:
      'State coverage chart set: one `loading` chart with custom `loadingText`, one empty-data chart with custom `emptyText`, and one `error` chart with custom `errorText`; include `styling` overrides on the chart container',
  }),

  chatBubble: createPromptConfig('Generate 7 types of chat bubble:', {
    defaultQuestion: "Default question bubble with message text = 'Hello my friend!!' in children",
    answerWithActions:
      "Answer bubble with `status` = 'fulfilled' and 4 icon buttons in `actionChildren` (volume, copy, like, dislike)",
    pendingAnswer: "Pending answer bubble with `status` = 'pending' and short streaming-style message text",
    rejectedAnswer:
      "Rejected answer bubble with `status` = 'rejected', retry-style `actionChildren`, and subtle error-oriented `styling`",
    sizeCoverage:
      "Size coverage set: render 3 bubbles side by side using `size` = 'sm', `size` = 'md', and `size` = 'lg' (same content, answer variant)",
    withImageGallery: 'Chat bubble with `ChatBubble.ImageGallery` containing 4 images',
    richContent:
      "Chat bubble with rich child content: message text plus a link-preview style block inside children, custom root `styling`, and `variant` = 'answer'",
  }),

  contentCarousel: createPromptConfig('Generate 4 different content carousels:', {
    defaultThreeSlides:
      'Default content carousel with 3 text slides (`Slide 1`, `Slide 2`, `Slide 3`), `showArrows` = true, `showDots` = true, and `isFocusable` = true',
    twoVisible: "Content carousel with 6 slides, `visibleItems` = 2, `scrollStep` = 1, and `scrollAlignment` = 'left'",
    threeVisibleCentered:
      "Content carousel with 6 slides, `visibleItems` = 3, `scrollStep` = 2, and `scrollAlignment` = 'centered'",
    minimalNavigation:
      'Minimal navigation mode carousel with 4 slides, `showArrows` = false, `showDots` = true, and custom root `styling` for spacing/width',
  }),

  header: createPromptConfig('Generate 3 different headers:', {
    darkThemed:
      'Complete dark-themed header with `logoChildren`, `menuChildren`, and `actionChildren` (Sign in + Cart), `showSearch` = true, and menu items: Home, Products, Contact, About',
    withBanner:
      'Header with top announcement banner: `showTopBanner` = true and `bannerChildren` containing promo text (for example, free shipping message), plus basic logo + menu',
    searchFirst:
      'Search-first header where `showSearch` = true, minimal menu, and custom `bgColor` using error color theme token',
  }),

  imagePreview: createPromptConfig('Generate 2 different image previews:', {
    defaultWithArrows:
      'Default image preview with 3 images (`src` + `alt` + optional `caption`), `showArrows` = true, `showThumbnails` = true, and `showCounter` = true.',
    thumbnailLeft:
      "`thumbnailPosition` = 'left', `showArrows` = false, `showCounter` = false and thumbnails used as the primary navigation.",
  }),

  inputArea: createPromptConfig('Generate 5 different input areas:', {
    defaultEmpty:
      "Default empty input area with `placeholder` = 'Write a message, please...', `showAttachmentButton` = true, and `showSendButton` = true",
    disabledPrefilled:
      "Create a disabled input area with a pre-filled value: 'This message cannot be edited'. The action buttons should remain visible but be in a disabled state.",
    multilineWithLimits:
      '`minRows` = 3, `maxRows` = 8, `maxLength` = 200, `maxHeight` = 112, and `showCharacterCount` = true',
    customActionLabels:
      "Input area with custom action labels: `sendButtonLabel` = 'Send now', `attachmentButtonLabel` = 'Attach files', and `showSendButtonTooltip` = true.",
    withoutSendButton: '`showSendButton` = false but `showAttachmentButton` = true',
  }),

  modal: createPromptConfig(
    'Generate a modal component with 5 distinct buttons. Each button should open a different type of Modal (use local state to manage isOpen for each). Every modal must include a working close mechanism calling the close handler via a button in the footer.',
    {
      standardConfirm:
        "Standard modal with `label` = 'Confirm Action', short body `children`, and `footer` with two buttons ('Confirm' and 'Cancel') that both close the modal.",
      longContent:
        "Long-content modal with `title` = 'Terms and Conditions', very long body `children` that naturally overflows, and `footer` with one 'Accept' button.",
      strictNoClose:
        'Strict modal for critical actions with `showCloseButton` = false, `closeOnEscape` = false, and `closeOnClickOutside` = false, plus explicit close action in `footer`.',
      customLayout:
        'Custom-layout modal with `isCustomView` = true and fully custom `children` structure (custom header/body/actions inside the content area).',
      styledModal:
        'Styled modal with custom `styling` (for width/spacing), a small info body, and a simple one-button `footer` close action.',
    }
  ),

  search: createPromptConfig('Generate 3 different search components:', {
    defaultWithOptions:
      "Default search with `placeholder` = 'Search products...', `value` = '', and `options` with 3 selectable items (`Red`, `Green`, `Blue`)",
    emptyLoading:
      "Search with an empty `options` array and `emptyItemsResult` = 'Loading results...' to simulate async loading state.",
    noResults:
      "Search with no results (`options` = []) and `emptyItemsResult` = 'No products found. Try a different search term.' plus a non-empty `value`.",
  }),

  searchModal: createPromptConfig(
    'Generate a wrapper component with 4 distinct buttons. Each button should open a different type of SearchModal (use local state to manage isOpen for each via modalProps={{ isOpen, onClose }}).Every modal must include a working close mechanism calling the close handler via a button in the footer.',
    {
      historyFirst:
        "History-first modal with empty `searchValue`, grouped `historyResults` (for example 'Today' and 'Yesterday'), and `placeholder` for the search input.",
      activeResults:
        "Active-results modal with `searchValue` = 'Dashboard', non-empty `results` (title/description/icon/date), and click `actions` wired for result selection.",
      loadingState:
        '`isLoading` = true, custom `loaderItemsCount`, and realistic `placeholder` while results are being fetched.',
      emptyWithSections:
        'Empty-state + sections modal with empty `results` and `historyResults`, custom `noResultsLabel`, custom `noHistoryResultsLabel`, custom `newSearchCta`, plus `popularItems`, `aiSuggestions`, `articles`, extra `children`, and root `styling`.',
    }
  ),

  sidebar: createPromptConfig('Generate 4 different sidebars:', {
    defaultFlat:
      "Default sidebar with a flat `items` list (Dashboard, Projects, Tasks), `activeItemId` = 'dashboard', and simple `footerChildren` with user text.",
    collapsed: "Collapsed sidebar with `collapsed` = true, `collapsedWidth` = '64px'",
    hierarchical:
      "Hierarchical sidebar where `items` includes nested `children` under 'Projects' (`Web App`, `Mobile App`), with one nested item set as `activeItemId`.",
    mixedStates:
      'Sidebar with mixed item states: one `disabled` item, one item using `href`, plus extra `children` content after nav items and root `styling` overrides.',
  }),
} as const;

// ─── LAYOUT ────────────────────────────────────────────────────────────────────

export const LAYOUT = {
  chatContainer: createPromptConfig(
    'Generate 3 different ChatContainer layouts so every ChatContainer property is covered in realistic chat UI scenarios:',
    {
      fullyPopulated:
        'Fully populated default state: Set `isOpen` = true and provide all slots (`sidebarMinifiedContent`, `sidebarHeaderContent`, `sidebarContent`, `headerContent`, and `children`). Use a natural chat example: history list in the sidebar, compact icon rail (plus/chat/edit), top header with title "AI Assistant", and several `ChatBubble` messages in the main area.',
      collapsedFirst:
        'Collapsed-first state: Set `isOpen` = false, keep all slots populated, and make the minified sidebar content clearly usable (icon-only quick actions). Keep header visible so the reopen behavior can be validated visually.',
      hiddenControls:
        'Hidden controls state: Set both `showSidebarAsideControl` = false and `showSidebarHeaderControl` = false while still rendering sidebar and header content.',
    }
  ),

  column: createPromptConfig('Generate 4 different columns:', {
    defaultStack:
      'Default content stack for a settings panel: `gutter` = 24, 3 text blocks (`Block A`, `Block B`, `Block C`), and simple `padding` so spacing is easy to validate.',
    reversedTimeline:
      'Reversed timeline-style stack: `isReversed` = true, `gutter` = 16, and 3 text items (`Step 1`, `Step 2`, `Step 3`).',
    alignmentBehavior:
      "Tight card column with explicit alignment behavior: use `align` = 'center', `justify` = 'space-between', fixed `height`, and `isWrap` = false so content distribution is clearly visible.",
    semanticStyling:
      "Semantic + styling case: render as `as` = 'section', set `flex` (for example `1 1 auto`), and apply root `styling` (background, border, borderRadius). Use `gap` instead of `gutter` in this case to confirm alias parsing.",
  }),

  flexContainer: createPromptConfig(
    'Generate 5 different flex containers without hardcoded fixed width/height constraints:',
    {
      horizontalToolbar:
        "Basic horizontal toolbar: `flexDirection` = 'row', `gap` = '16px', with 3 short items (`Item A`, `Item B`, `Item C`).",
      verticalAlignment:
        "Vertical alignment check: `flexDirection` = 'column', `alignItems` = 'center', and 3 text items with very different lengths (`Short`, long sentence, `Tiny`) to confirm centering behavior.",
      spaceDistribution:
        "Space distribution case: `flexDirection` = 'row', `justifyContent` = 'space-between', with 2 edge items (`Start edge`, `End edge`).",
      wrappedTagList:
        "Wrapped tag list: `flexDirection` = 'row', `styling` = { `flexWrap`: 'wrap' }, `gap` = '8px', and at least 6 tag-like items (`Tag 1` ... `Tag 6`).",
      reverseFlow:
        "Reverse-flow action group: use `flexDirection` = 'row-reverse', keep `alignItems` + `justifyContent` explicitly set, add a custom `className`, and include root `styling` (for example subtle border/background).",
    }
  ),

  row: createPromptConfig('Generate 4 different rows:', {
    defaultHorizontal:
      'Default horizontal row for small info chips: `gutter` = 16 with 3 explicit text items (`Block 1`, `Block 2`, `Block 3`).',
    reversed: 'Reversed row: `isReversed` = true and `gutter` = 8 with 3 items (`Start`, `Middle`, `End`).',
    navigationAlignment:
      "Navigation-style row with alignment rules: set `align` = 'center', `justify` = 'space-between', and `isWrap` = false, with two edge labels (`Left action`, `Right action`).",
    semanticStyling:
      "Semantic + styling row: render as `as` = 'nav', set `flex` (for example `1 1 auto`), apply root `styling` (background/border/padding), and use `gap` instead of `gutter`.",
  }),

  portal: createPromptConfig(
    'Generate a wrapper component with 4 distinct buttons. Each button should toggle the rendering of a different Portal configuration using local state. Ensure every portal content includes a button to close/hide itself.',
    {
      globalPortal:
        "Default Global Portal triggered by an 'Open Global Portal' button. Do not pass a container prop (so it defaults to document.body). Provide children with text 'Global portal content injected into body' and a 'Close' button.",
      targetedPortal:
        "Targeted Portal: render a standard div with id=\"custom-portal-target\", some padding, and a distinct background color to serve as an anchor. Next to it, render an 'Open Targeted Portal' button. The Portal should use container = '#custom-portal-target' and withWrapper = false.",
      semanticWrapper:
        'Semantic Wrapper Portal: Triggered by an \'Open Semantic Portal\' button. Pass WrapperView="main" and a specific wrapperVariant (e.g., WrapperVariant.Section or "section"). Include explicit text.',
      scrollLock:
        "Scroll-lock Portal: Triggered by an 'Open Blocking Portal' button. Render a modal-like portal with `blocksScroll` = true, keep `withWrapper` = true, and include root `styling` overrides (for example z-index and padding).",
    }
  ),

  scroll: createPromptConfig('Generate 4 different scroll containers:', {
    verticalFirst:
      "Vertical-first content region: set `vertical` = 'auto' and `horizontal` = 'hidden', then place a `Column` with at least 5 text rows (`Row 1` ... `Row 5`) and enough height pressure to require vertical scrolling.",
    horizontalOnly:
      "Horizontal-only lane: set `vertical` = 'hidden' and `horizontal` = 'auto', then place a `Row` with `isWrap` = false and at least 4 wide items (`Column A` ... `Column D`) so horizontal overflow is obvious.",
    alwaysVisible:
      "Always-visible bars case: set both `vertical` = 'visible' and `horizontal` = 'visible', and include a short \"Corner intersection test\" label plus overflowing row content.",
    autoHide:
      "Auto-hide behavior case: set `autoHide` = true with `vertical` = 'auto', include long scrollable content, and apply root `styling` (for example fixed `height`, border, and padding).",
  }),

  dragAndDrop: createPromptConfig('Generate 6 different drag and drop templates:', {
    defaultDocumentUpload:
      "Default document upload area with `title` = 'Drop some files here', `description` that explains allowed uploads, `inputFileButtonLabel` = 'Choose files', `maxFileSize` = 20000000 (20 MB), and `acceptedFileTypes` = ['application/pdf', 'application/msword'].",
    singleFileStrict:
      'Single-file strict upload variant with `maxFiles` = 1 (for example avatar or contract upload), clear helper text in `description`, and realistic label text for the button.',
    disabled: 'Disabled drag and drop area where interaction is blocked but title/description remain visible.',
    loadingState: '`isLoading` = true and a custom `loadingOverlay` (for example loader + text "Uploading files...").',
    errorFocused:
      "Error-focused state using `errors` with at least one explicit message such as 'File is too large (max 20 MB)' and another like 'Unsupported file type'.",
    customIdleContent:
      'Custom idle content state: provide `children` to replace the default internal layout (for example icon + short instructions), plus `actions` so file selection/drop can dispatch upload-related events.',
  }),
} as const;

// ─── FLAT EXPORT ───────────────────────────────────────────────────────────────

/**
 * All component prompts in a single flat object.
 * Usage: `COMPONENT_PROMPTS.button.prompt`, `COMPONENT_PROMPTS.card.prompt`, etc.
 */
export const COMPONENT_PROMPTS = {
  ...ATOMIC,
  ...MOLECULAR,
  ...ORGANISM,
  ...LAYOUT,
} as const;

// ─── TYPE UTILITIES ────────────────────────────────────────────────────────────

export type AtomicKey = keyof typeof ATOMIC;
export type MolecularKey = keyof typeof MOLECULAR;
export type OrganismKey = keyof typeof ORGANISM;
export type LayoutKey = keyof typeof LAYOUT;
export type ComponentKey = keyof typeof COMPONENT_PROMPTS;

export const PROMPT_KEYS = {
  atomic: Object.keys(ATOMIC) as AtomicKey[],
  molecular: Object.keys(MOLECULAR) as MolecularKey[],
  organism: Object.keys(ORGANISM) as OrganismKey[],
  layout: Object.keys(LAYOUT) as LayoutKey[],
  all: Object.keys(COMPONENT_PROMPTS) as ComponentKey[],
};
