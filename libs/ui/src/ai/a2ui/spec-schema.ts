/**
 * A2UI Specification Schema
 *
 * TypeScript schema for the A2UI JSON format produced by LLMs and validated
 * before rendering with gd-design-library (GridKit) components.
 *
 * This is the companion to the JSON Schema at:
 *   libs/ui/src/ai/a2ui/ui-specification-schema.json
 *
 * Use A2UI_SPEC_SCHEMA with Gemini's responseSchema to enforce structured output.
 * Use A2UI_SPEC_SCHEMA_SIMPLE for basic structural validation.
 *
 * A2UI protocol: https://a2ui.org
 */

import { A2UI_COMPONENT_TYPES, A2UI_BUTTON_VARIANTS } from './component-map';

/**
 * Full A2UI specification schema.
 *
 * Pass to Gemini as:
 *   generationConfig: { responseMimeType: 'application/json', responseSchema: A2UI_SPEC_SCHEMA }
 */
export const A2UI_SPEC_SCHEMA = {
  type: 'object',
  required: ['version', 'metadata', 'ui'],
  properties: {
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',
      description: 'Semantic version of the UI specification',
      example: '1.0.0',
    },
    metadata: {
      type: 'object',
      required: ['agentId', 'agentName', 'timestamp'],
      properties: {
        agentId: { type: 'string', description: 'Unique identifier for the agent' },
        agentName: { type: 'string', description: 'Human-readable agent name' },
        agentVersion: {
          type: 'string',
          pattern: '^\\d+\\.\\d+\\.\\d+$',
        },
        timestamp: { type: 'string', format: 'date-time', description: 'ISO 8601 timestamp of UI generation' },
        sessionId: { type: 'string', description: 'Session identifier for conversation continuity' },
        provider: {
          type: 'string',
          description:
            'LLM provider or orchestration source for the generated spec, for example openai, anthropic, gemini, or local',
        },
        scenario: {
          type: 'string',
          description: 'Scenario, use case, or workflow identifier associated with this spec',
        },
        segment: {
          type: 'string',
          description: 'Optional orchestration segment or stage identifier when a flow is generated in multiple parts',
        },
        isSimulated: {
          type: 'boolean',
          description: 'Demo-only flag indicating the spec was simulated or replayed instead of generated live',
        },
        locale: {
          type: 'string',
          default: 'en-US',
          pattern: '^[a-z]{2}-[A-Z]{2}$',
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'auto'],
          default: 'auto',
        },
        customData: { type: 'object', description: 'Agent-specific metadata' },
      },
    },
    ui: {
      type: 'object',
      required: ['layout', 'components'],
      properties: {
        layout: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: ['vertical', 'horizontal', 'grid', 'flex', 'stack', 'split'],
              description: 'Layout type mapping to GD Design Library layout components',
            },
            spacing: {
              type: 'string',
              description:
                "Spacing between elements — must be a real CSS value (e.g. '16px', '1rem'). Never use token strings like 'xs', 'sm', 'md', 'lg', 'xl', 'none'.",
            },
            gridColumns: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              description: 'Number of columns for grid layout',
            },
            alignment: {
              type: 'string',
              enum: ['start', 'center', 'end', 'stretch', 'baseline'],
            },
            justification: {
              type: 'string',
              enum: ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'],
            },
            responsive: {
              type: 'object',
              properties: {
                mobile: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    gridColumns: { type: 'integer' },
                    spacing: { type: 'string' },
                  },
                },
                tablet: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    gridColumns: { type: 'integer' },
                    spacing: { type: 'string' },
                  },
                },
                desktop: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    gridColumns: { type: 'integer' },
                    spacing: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        components: {
          type: 'array',
          minItems: 1,
          description: 'Array of UI components to render.',
          items: {
            type: 'object',
            required: ['id', 'type'],
            properties: {
              id: {
                type: 'string',
                description: 'Unique component identifier',
              },
              type: {
                type: 'string',
                enum: A2UI_COMPONENT_TYPES,
                description:
                  'Component type — maps to gd-design-library (GridKit) React component. Source of truth: ./component-map.ts',
              },
              label: { type: 'string', description: 'Component label or title' },
              value: { description: 'Component value (any type)' },
              initial: {
                type: 'number',
                description: 'Initial numeric value used by counter components.',
              },
              caption: {
                type: 'string',
                description: 'Optional caption text for images. Only used by type "image".',
              },
              placeholder: { type: 'string' },
              helpText: { type: 'string', description: 'Helper text or description' },
              ariaLabel: {
                type: 'string',
                description: 'Accessible label used when visible text alone is not sufficient.',
              },
              content: {
                type: 'string',
                description: 'Tooltip text content. Only used by type "tooltip".',
              },
              name: {
                type: 'string',
                description:
                  'Component-specific name. For avatar-user: user display name. For loader: animation type ("circle" or "dots"). For rating: radio group name. Prefer dedicated props where documented.',
              },
              subtitle: {
                type: 'string',
                description: 'Secondary text line. Only used by type "avatar-user".',
              },
              className: {
                type: 'string',
                description: 'Optional CSS class name forwarded to wrapper-style primitives such as box and wrapper.',
              },
              tabIndex: {
                type: 'number',
                description: 'Keyboard tab order for focusable primitives such as box.',
              },
              layout: {
                type: 'string',
                enum: ['horizontal', 'vertical'],
                description: 'Carousel layout direction. Only used by type "carousel".',
              },
              as: {
                type: 'string',
                description:
                  'Underlying HTML tag override (for example "section", "article", "figure", "figcaption", "span").',
              },
              htmlFor: {
                type: 'string',
                description: 'Associated form control ID for label components. Only used by type "label".',
              },
              captionAs: {
                type: 'string',
                description: 'HTML tag override for image captions. Only used by type "image".',
              },
              WrapperView: {
                type: 'string',
                description: 'Underlying HTML tag for the optional portal wrapper. Only used by type "portal".',
              },
              container: {
                type: 'string',
                description:
                  'CSS selector for an existing DOM node that should receive portal content. Only used by type "portal".',
              },
              href: { type: 'string', description: 'Link destination URL. Top-level field for type "link".' },
              target: {
                type: 'string',
                enum: ['_blank', '_self', '_parent', '_top'],
                description: 'Link browsing context. Top-level field for type "link".',
              },
              rel: { type: 'string', description: 'Link relationship attribute. Top-level field for type "link".' },
              buttonType: {
                type: 'string',
                enum: ['button', 'submit', 'reset'],
                description: 'HTML button type attribute. Only used by type "button".',
              },
              placement: {
                type: 'string',
                enum: [
                  'top',
                  'bottom',
                  'left',
                  'right',
                  'top-left',
                  'top-center',
                  'top-right',
                  'bottom-left',
                  'bottom-center',
                  'bottom-right',
                ],
                description:
                  'Component placement. Used by tooltip ("top" | "bottom" | "left" | "right"), menu corner placement, and snackbar overlay placement.',
              },
              delay: {
                type: 'number',
                description: 'Tooltip open delay in milliseconds.',
              },
              length: {
                type: 'string',
                description:
                  'Separator explicit length (for example "40px" or "100%"). Especially useful for vertical separators. Only used by type "separator".',
              },
              required: { type: 'boolean', default: false },
              disabled: { type: 'boolean', default: false },
              readOnly: { type: 'boolean', default: false },
              visible: { type: 'boolean', default: true },
              isOpen: {
                type: 'boolean',
                description: 'Controlled open state for collapsible layout components such as chat-container.',
              },
              bordered: {
                type: 'boolean',
                description: 'Whether the component renders with a bordered container. Used by type "breadcrumbs".',
              },
              checked: {
                type: 'boolean',
                description: 'Checked/on state for checkbox and switch components.',
              },
              indeterminate: {
                type: 'boolean',
                description: 'Mixed state for checkbox components.',
              },
              allowMultipleExpand: {
                type: 'boolean',
                description: 'Whether accordion allows multiple items to stay expanded at once.',
              },
              withoutSeparator: {
                type: 'boolean',
                description: 'Whether accordion items render without divider lines.',
              },
              isInline: {
                type: 'boolean',
                description: 'Whether accordion headers render using inline layout.',
              },
              defaultValue: {
                description:
                  'Initial uncontrolled value. Used by accordion, radio-group, and rating components. Type depends on the component.',
              },
              max: {
                type: 'number',
                description:
                  'Maximum numeric value. Used by counter as the upper bound, by rating as the total item count, and by slider when modeled as a top-level prop.',
              },
              min: {
                type: 'number',
                description:
                  'Minimum numeric value. Used by counter as the lower bound and by slider when modeled as a top-level prop.',
              },
              variant: {
                type: 'string',
                description:
                  'Visual variant for the component. Button: primary|secondary|tertiary|outlined|text|inherit. Separator: solid|dashed|dotted. Card: vertical|horizontal. Badge: primary|secondary|tertiary|quaternary|quinary. Inline-notification: success|warning|error|info.',
              },
              appearance: {
                type: 'string',
                description:
                  'Secondary visual appearance modifier. For badge: filled|filledLight|outline|outlineFilledLight.',
              },
              size: {
                type: 'string',
                enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
                default: 'md',
                description: '"xxl" is Avatar-only — no other component type using this field supports the xxl tier.',
              },
              styleVariant: {
                type: ['string', 'array'],
                items: { type: 'string' },
                description:
                  'Typography style modifiers. Use a string or array such as "bold" or ["italic", "underline"]. Only used by type "typography".',
              },
              underline: {
                type: 'string',
                enum: ['default', 'highlight', 'none'],
                description: 'Link underline behavior. Top-level field for type "link".',
              },
              labelSide: {
                type: 'string',
                enum: ['left', 'right'],
                description: 'Switch label placement relative to the control. Only used by type "switch".',
              },
              separator: {
                type: 'string',
                description:
                  'Breadcrumb text separator (for example "/" or ">"). Also used by type "attachment-file" as the character between fileType and fileSize (defaults to "·").',
              },
              separatorIcon: {
                type: 'string',
                description: 'Icon name used as the breadcrumb separator. Only used by type "breadcrumbs".',
              },
              separatorAfterLastItem: {
                type: 'boolean',
                description: 'Whether breadcrumbs should render a separator after the last item.',
              },
              rounded: {
                type: 'string',
                enum: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
                description: 'Loader border radius for dots animation. Top-level field for type "loader".',
              },
              withWrapper: {
                type: 'boolean',
                description:
                  'Whether a helper wrapper container should be rendered. Used by type "loader" and "portal".',
              },
              wrapperVariant: {
                type: 'string',
                enum: ['inline', 'section', 'fullPage'],
                description: 'Wrapper preset used by the portal helper wrapper. Only used by type "portal".',
              },
              blocksScroll: {
                type: 'boolean',
                description: 'Whether the portal should lock background document scrolling while mounted.',
              },
              animationName: {
                type: ['string', 'null'],
                description:
                  'Skeleton animation keyframe name. Accepts theme animation token names such as "blinkKeyframes", raw CSS animation names, or null to disable the built-in animation. Only used by type "skeleton".',
              },
              animationProps: {
                type: 'string',
                description:
                  'Custom CSS animation shorthand forwarded to skeleton or loader when fine-grained animation control is needed.',
              },
              color: {
                type: 'string',
                description:
                  'Top-level color prop. Prefer theme color token paths (e.g. "text.secondary", "border.default"). Palette-style aliases like "brand.500" and "theme.palette.warning.main" are also accepted. Use raw CSS/hex only when no theme token fits. Used by typography and separator.',
              },
              icon: {
                type: 'string',
                description:
                  'Icon name from GD icon set. Used by the icon component, snackbar, accordion header expand icons, and avatar icon fallbacks. Also accepted as a legacy alias for iconStart on some leading-adornment components.',
              },
              iconStart: {
                type: 'string',
                description:
                  'Leading icon name from GD icon set. Preferred field for components with a start icon or adornment such as badge, button, input, input-file, menu triggers, and select.',
              },
              iconEnd: {
                type: 'string',
                description:
                  'Trailing icon name from GD icon set. Used by button, badge, input, input-file, and select.',
              },
              fill: {
                type: 'string',
                description:
                  'Fill color for multi-path icons. Prefer theme color token paths (e.g. "icon.error", "icon.primary", "icon.default"). Use raw CSS/hex only when no theme token fits. Used by type "icon" and avatar icon fallbacks.',
              },
              fillSvg: {
                type: 'string',
                description:
                  'Uniform fill color for the entire SVG. Prefer theme color token paths (same options as fill). Use raw CSS/hex only when no theme token fits. Overrides fill. Used by type "icon" and avatar icon fallbacks.',
              },
              width: {
                description:
                  'Width. For icon: pixel number (e.g. 24). For layout components: CSS string (e.g. "100%", "200px").',
              },
              height: {
                description:
                  'Height. For icon: pixel number (e.g. 24). For layout components: CSS string (e.g. "100px").',
              },
              minHeight: {
                type: ['string', 'number'],
                description:
                  'Minimum height constraint. Use CSS strings for layout components (for example "120px") or numbers for menu positioning logic.',
              },
              count: {
                type: 'number',
                description: 'SliderDots total dot count. Only used by type "slider-dots".',
              },
              activeIndex: {
                type: ['string', 'number'],
                description: 'Active index or active option value. Used by slider-dots and select components.',
              },
              step: {
                type: 'number',
                description: 'Slider step increment. Only used by type "slider".',
              },
              lines: {
                type: 'number',
                description: 'Maximum number of lines before truncation. Only used by type "truncate".',
              },
              objectFit: {
                type: 'string',
                enum: ['cover', 'contain', 'fill', 'none', 'scale-down'],
                description: 'Image object-fit behavior. Only used by type "image".',
              },
              isBordered: { type: 'boolean' },
              isHighlighted: { type: 'boolean' },
              withShadowHover: { type: 'boolean' },
              fullWidth: {
                type: 'boolean',
                description:
                  'Whether the internal button should stretch to the full container width. Used by button/input-file.',
              },
              isIcon: {
                type: 'boolean',
                description: 'Whether the control should render as an icon-only button. Used by button/input-file.',
              },
              showArrows: {
                type: 'boolean',
                description:
                  'Whether carousel navigation arrows are visible. Used by type "carousel" and "content-carousel".',
              },
              showDots: {
                type: 'boolean',
                description:
                  'Whether carousel dot indicators are visible. Used by type "carousel" and "content-carousel".',
              },
              thumbs: {
                type: 'string',
                enum: ['start', 'end'],
                description: 'Thumbnail strip position. Only used by type "carousel".',
              },
              isFocusable: {
                type: 'boolean',
                description:
                  'Whether the carousel root receives keyboard focus. Used by type "carousel" and "content-carousel".',
              },
              visibleItems: {
                type: 'number',
                description: 'Number of items visible at once. Only used by type "content-carousel".',
              },
              scrollStep: {
                type: 'number',
                description: 'Number of items to scroll per navigation action. Only used by type "content-carousel".',
              },
              scrollAlignment: {
                type: 'string',
                enum: ['left', 'centered'],
                description: 'Content carousel scroll alignment. Only used by type "content-carousel".',
              },
              vertical: {
                type: 'string',
                enum: ['hidden', 'visible', 'auto'],
                description: 'Vertical scrollbar visibility. Only used by type "scroll".',
              },
              horizontal: {
                type: 'string',
                enum: ['hidden', 'visible', 'auto'],
                description: 'Horizontal scrollbar visibility. Only used by type "scroll".',
              },
              autoHide: {
                type: 'boolean',
                description:
                  'Whether visible scrollbars should fade out after scrolling stops. Only used by type "scroll".',
              },
              showSidebarAsideControl: {
                type: 'boolean',
                description: 'Whether the chat sidebar shows its internal collapse/close control.',
              },
              showSidebarHeaderControl: {
                type: 'boolean',
                description: 'Whether the main chat header shows the control that reopens the sidebar.',
              },
              multiple: {
                type: 'boolean',
                description: 'Multi-value selection mode for select/input-file components.',
              },
              searchable: {
                type: 'boolean',
                description: 'Whether the select shows a search field.',
              },
              searchPlaceholder: {
                type: 'string',
                description: 'Placeholder text for the select search field.',
              },
              autoOpen: {
                type: 'boolean',
                description: 'Whether the select dropdown opens automatically on render.',
              },
              accept: {
                type: 'string',
                description: 'Accepted file MIME types or extensions for input-file.',
              },
              capture: {
                type: ['boolean', 'string'],
                enum: [true, false, 'user', 'environment'],
                description: 'Mobile capture mode for input-file.',
              },
              inputFileButtonLabel: {
                type: 'string',
                description: 'Visible label for the drag-and-drop file picker button.',
              },
              acceptedFileTypes: {
                type: 'array',
                items: { type: 'string' },
                description: 'Allowed MIME types for drag-and-drop file validation.',
              },
              maxFileSize: {
                type: 'number',
                description: 'Maximum allowed file size in bytes for each dropped or selected file.',
              },
              maxFiles: {
                type: 'number',
                description: 'Maximum total number of files allowed by drag-and-drop.',
              },
              debounceCallbackTime: {
                type: 'number',
                description: 'Debounce delay in milliseconds for input change handlers.',
              },
              ariaDescribedBy: {
                type: 'string',
                description: 'ID of helper/error text announced by screen readers.',
              },
              resize: {
                type: 'string',
                enum: ['none', 'both', 'horizontal', 'vertical'],
                description: 'Textarea resize mode. Only used by type "textarea".',
              },
              dynamicHeightAdjustment: {
                type: 'boolean',
                description: 'Whether textarea height should auto-grow with content.',
              },
              maxCharacters: {
                type: 'number',
                description: 'Maximum character count for textarea. Shows a counter in the UI.',
              },
              maxLength: {
                type: 'number',
                description: 'Maximum character count for InputArea.',
              },
              currentValue: {
                type: 'string',
                description: 'Current formatted price value without the currency symbol. Only used by type "price".',
              },
              oldValue: {
                type: 'string',
                description:
                  'Optional previous price shown as the struck-through comparison value. Only used by type "price".',
              },
              currencySymbol: {
                type: 'string',
                description: 'Currency symbol displayed by price components (for example "$", "€", or "zł").',
              },
              currencySymbolPosition: {
                type: 'string',
                enum: ['before', 'after'],
                description:
                  'Where the currency symbol should appear relative to the value. Only used by type "price".',
              },
              gutter: {
                type: ['string', 'number'],
                description: 'Gap between direct children for row, column, and card container components.',
              },
              gap: {
                type: 'string',
                description: 'Top-level gap prop used by flex-container and as an alias for row/column gutter.',
              },
              padding: { type: 'string', description: 'CSS inner padding for card and related layout containers.' },
              align: {
                type: 'string',
                enum: ['start', 'center', 'end', 'stretch'],
                description: 'Cross-axis alignment for row and column layout primitives.',
              },
              justify: {
                type: 'string',
                enum: ['start', 'center', 'end', 'space-between', 'space-around'],
                description: 'Main-axis distribution for row and column layout primitives.',
              },
              isWrap: {
                type: 'boolean',
                description: 'Whether row or column children are allowed to wrap.',
              },
              flex: {
                type: 'string',
                description:
                  'CSS flex shorthand for row or column components when they are children of another flex container.',
              },
              isReversed: {
                type: 'boolean',
                description: 'Whether row or column direction is visually reversed.',
              },
              flexDirection: {
                type: 'string',
                enum: ['row', 'column', 'row-reverse', 'column-reverse'],
                description: 'Top-level flex direction prop for flex-container.',
              },
              alignItems: {
                type: 'string',
                description: 'Top-level align-items prop for flex-container or alias for row/column alignment.',
              },
              justifyContent: {
                type: 'string',
                description: 'Top-level justify-content prop for flex-container or alias for row/column justification.',
              },
              showPercentage: {
                type: 'boolean',
                description: 'Whether the progress bar should show a numeric percentage label.',
              },
              fillColor: {
                type: 'string',
                description:
                  'Filled-track color for progress bars. Prefer theme token paths before raw CSS or hex colors.',
              },
              closeOnSelect: {
                type: 'boolean',
                description: 'Whether a menu closes immediately after an option is selected.',
              },
              offsetX: {
                type: 'number',
                description: 'Horizontal offset in pixels used by menu positioning.',
              },
              offsetY: {
                type: 'number',
                description: 'Vertical offset in pixels used by menu positioning.',
              },
              gridColumns: {
                type: ['number', 'string'],
                description: 'Radio-group grid column count when variant is "grid".',
              },
              gridRows: {
                type: ['number', 'string'],
                description: 'Radio-group grid row count when variant is "grid".',
              },
              gridColumnGutter: {
                type: ['number', 'string'],
                description: 'Horizontal spacing between radio-group grid items.',
              },
              gridRowGutter: {
                type: ['number', 'string'],
                description: 'Vertical spacing between radio-group grid rows.',
              },
              wrapItems: {
                type: 'boolean',
                description: 'Whether radio-group items should wrap in row or column layouts.',
              },
              itemWidth: {
                type: 'string',
                description: 'Per-option width for radio-group visual tiles.',
              },
              itemHeight: {
                type: 'string',
                description: 'Per-option height for radio-group visual tiles.',
              },
              isIconsView: {
                type: 'boolean',
                description: 'Whether stepper indicators should render icons instead of step numbers.',
              },
              duration: {
                type: ['number', 'null'],
                description: 'Auto-dismiss duration in milliseconds. Only used by type "snackbar".',
              },
              dismissOnClick: {
                type: 'boolean',
                description: 'Whether clicking the snackbar should dismiss it.',
              },
              colored: {
                type: 'boolean',
                description: 'Whether the snackbar uses a filled background matching its variant.',
              },
              isAnimated: {
                type: 'boolean',
                description: 'Whether the snackbar should animate in and out.',
              },
              stickyHeader: {
                type: 'boolean',
                description: 'Whether the table header should remain visible while scrolling.',
              },
              stickyFooter: {
                type: 'boolean',
                description: 'Whether the table footer should remain visible while scrolling.',
              },
              stickyPagination: {
                type: 'boolean',
                description: 'Whether the table pagination row should remain visible while scrolling.',
              },
              pagination: {
                type: 'boolean',
                description: 'Whether the table should render built-in pagination controls.',
              },
              pageSize: {
                type: 'number',
                description: 'Initial number of rows per page when table pagination is enabled.',
              },
              pageSizes: {
                type: 'array',
                items: { type: 'number' },
                description: 'Selectable page-size options for table pagination.',
              },
              virtualized: {
                type: 'boolean',
                description: 'Whether the table should use virtualization for large row sets.',
              },
              rowHeight: {
                type: 'number',
                description: 'Row height in pixels for virtualized tables.',
              },
              minVisibleRange: {
                type: 'number',
                description: 'Minimum buffered visible range for virtualized tables.',
              },
              options: {
                type: 'array',
                description: 'Options for select, radio, checkbox groups',
                items: {
                  type: 'object',
                  required: ['value', 'label'],
                  properties: {
                    value: { description: 'Option value' },
                    label: { type: 'string', description: 'Display label' },
                    disabled: { type: 'boolean', default: false },
                    icon: { type: 'string' },
                  },
                },
              },
              columns: {
                type: 'array',
                description: 'Column definitions for table component',
                items: {
                  type: 'object',
                  required: ['key', 'label'],
                  properties: {
                    key: { type: 'string', description: 'Column key/field name.' },
                    label: { type: 'string', description: 'Column header label.' },
                    width: { type: 'string', description: 'CSS column width (e.g. "120px", "20%").' },
                    sortable: { type: 'boolean', default: false },
                    filterable: { type: 'boolean', default: false },
                    align: { type: 'string', enum: ['left', 'center', 'right'], default: 'left' },
                    formatter: {
                      type: 'string',
                      enum: ['text', 'number', 'currency', 'date', 'datetime', 'boolean', 'custom'],
                    },
                  },
                },
              },
              rows: {
                type: 'array',
                description: 'Data rows for table or list component',
              },
              data: {
                type: 'array',
                description: 'Alias for rows — accepted when LLM generates data instead of rows',
              },
              errors: {
                type: 'array',
                items: { type: 'string' },
                description: 'Inline validation or upload error messages, used by drag-and-drop.',
              },
              files: {
                type: 'array',
                description: 'Current file metadata for drag-and-drop controlled state.',
                items: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    size: { type: 'number' },
                    type: { type: 'string' },
                  },
                },
              },
              children: {
                type: 'array',
                description: 'Nested child components (not recursively validated to avoid cascading errors)',
                items: { type: 'object' },
              },
              dragOverContent: {
                type: 'array',
                description: 'Custom nested components shown while drag-and-drop is in its active hover state.',
                items: { type: 'object' },
              },
              loadingOverlay: {
                type: 'array',
                description: 'Custom nested components shown while drag-and-drop isLoading is true.',
                items: { type: 'object' },
              },
              dragOverChildren: {
                type: 'array',
                description: 'A2UI child components shown while drag-and-drop is in its hover state.',
                items: { type: 'object' },
              },
              footer: {
                type: 'array',
                description:
                  'Footer components rendered in the modal footer bar (e.g. action buttons). Only used by type "modal".',
                items: { type: 'object' },
              },
              actionChildren: {
                type: 'array',
                description:
                  'Nested child components rendered in a dedicated action area such as chat-bubble actions or header utilities.',
                items: { type: 'object' },
              },
              logoChildren: {
                type: 'array',
                description: 'Header logo slot content. Only used by type "header".',
                items: { type: 'object' },
              },
              menuChildren: {
                type: 'array',
                description: 'Header primary navigation slot content. Only used by type "header".',
                items: { type: 'object' },
              },
              bannerChildren: {
                type: 'array',
                description: 'Header top banner content. Only used by type "header".',
                items: { type: 'object' },
              },
              advChildren: {
                type: 'array',
                description: 'Header promo/supporting content shown below the mobile menu. Only used by type "header".',
                items: { type: 'object' },
              },
              headerChildren: {
                type: 'array',
                description: 'Sidebar header slot content. Only used by type "sidebar".',
                items: { type: 'object' },
              },
              footerChildren: {
                type: 'array',
                description: 'Sidebar footer slot content. Only used by type "sidebar".',
                items: { type: 'object' },
              },
              headerContent: {
                type: 'array',
                description: 'Named slot content for the main chat header. Only used by type "chat-container".',
                items: { type: 'object' },
              },
              sidebarContent: {
                type: 'array',
                description: 'Named slot content for the expanded chat sidebar. Only used by type "chat-container".',
                items: { type: 'object' },
              },
              sidebarMinifiedContent: {
                type: 'array',
                description:
                  'Named slot content for the collapsed chat sidebar rail. Only used by type "chat-container".',
                items: { type: 'object' },
              },
              sidebarHeaderContent: {
                type: 'array',
                description: 'Named slot content above the expanded chat sidebar. Only used by type "chat-container".',
                items: { type: 'object' },
              },
              items: {
                type: 'array',
                description:
                  'Component-specific items collection. Used by sidebar for nested navigation items and by search-modal grouped sections.',
                items: { type: 'object' },
              },
              images: {
                type: 'array',
                description: 'ImagePreview image items with src, optional alt text, and optional caption.',
                items: {
                  type: 'object',
                  required: ['src'],
                  properties: {
                    src: { type: 'string' },
                    alt: { type: 'string' },
                    caption: { type: 'string' },
                  },
                },
              },
              results: {
                type: 'array',
                description: 'SearchModal result items or grouped sections displayed for an active query.',
                items: { type: 'object' },
              },
              historyResults: {
                type: 'array',
                description: 'SearchModal recent or grouped history items displayed before a query is typed.',
                items: { type: 'object' },
              },
              popularItems: {
                type: 'object',
                description: 'Optional SearchModal section object with title and items[].',
              },
              aiSuggestions: {
                type: 'object',
                description: 'Optional SearchModal AI suggestions section object with title and items[].',
              },
              articles: {
                type: 'object',
                description: 'Optional SearchModal articles section object with title and items[].',
              },
              src: { type: 'string', description: 'Image URL for image/avatar/carousel media.' },
              alt: { type: 'string', description: 'Alternative text for image/avatar/carousel media.' },
              sizeVariant: {
                type: 'string',
                enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
                description: 'Avatar size variant — alias for "size" on avatar components.',
              },
              orientation: {
                type: 'string',
                enum: ['horizontal', 'vertical'],
                description: 'Separator direction. Only used by type "separator".',
              },
              labelPosition: {
                type: 'string',
                enum: ['start', 'center', 'end'],
                description: 'Separator label position. Only used by type "separator".',
              },
              backgroundColor: {
                type: 'string',
                description:
                  'Avatar background color for initials fallback, or skeleton fill color. Prefer theme color token paths (e.g. "bg.fill.secondary", "bg.fill.success.primary.default") or palette-style aliases like "brand.500" and "theme.palette.success.main". Use raw CSS/hex only when no theme token fits.',
              },
              withBadge: { type: 'boolean', description: 'Avatar: show status dot badge.' },
              badgeColor: {
                type: 'string',
                description:
                  'Avatar badge dot color. Prefer theme color token paths (e.g. "bg.fill.success.primary.default"). Use raw CSS/hex only when no theme token fits. Only when withBadge is true.',
              },
              labelColor: {
                type: 'string',
                description:
                  'Separator label text color. Prefer theme color token paths (e.g. "text.caption", "text.warning"). Palette-style aliases like "brand.500" and "theme.palette.warning.main" are also accepted. Use raw CSS/hex only when no theme token fits. Only used by type "separator".',
              },
              showCloseButton: {
                type: 'boolean',
                description:
                  'Whether to show the × close button in the modal header. Only used by type "modal". Defaults to true.',
              },
              closeOnEscape: {
                type: 'boolean',
                description: 'Whether pressing Escape closes the modal. Only used by type "modal".',
              },
              closeOnClickOutside: {
                type: 'boolean',
                description: 'Whether clicking the backdrop closes the modal. Only used by type "modal".',
              },
              isCustomView: {
                type: 'boolean',
                description:
                  'Whether the modal uses a fully custom layout without the default header/footer chrome. Only used by type "modal".',
              },
              title: {
                type: 'string',
                description:
                  'Component-specific title text. Used by chart for accessible titles and by modal as an alternate heading field.',
              },
              description: {
                type: 'string',
                description:
                  'Component-specific descriptive text, for example chart descriptions or drag-and-drop helper text.',
              },
              status: {
                type: 'string',
                enum: ['pending', 'fulfilled', 'rejected'],
                description: 'Chat bubble generation status. Only used by type "chat-bubble".',
              },
              bgColor: {
                type: 'string',
                description:
                  'Header background color override. Prefer theme color token paths (for example "bg.surface") before raw CSS/hex colors.',
              },
              mobileMenuList: {
                type: 'array',
                description: 'Header mobile drawer menu items. Only used by type "header".',
                items: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    path: { type: 'string' },
                    icon: { type: 'string' },
                  },
                },
              },
              emptyItemsResult: {
                type: 'string',
                description: 'Search empty-state message shown when no options match the current value.',
              },
              carouselOptions: {
                type: 'object',
                description: 'Embla carousel options such as loop or align. Only used by type "carousel".',
              },
              chartHeight: {
                type: 'number',
                description: 'Height of the chart canvas in pixels. Only used by type "chart".',
              },
              xKey: {
                type: 'string',
                description: 'Data key used for the chart x-axis. Only used by type "chart".',
              },
              series: {
                type: 'array',
                description: 'Chart series definitions for line, bar, and area charts.',
                items: { type: 'object' },
              },
              pieConfig: {
                type: 'object',
                description: 'Pie or donut chart configuration.',
              },
              colors: {
                type: 'array',
                description: 'Custom color palette for charts.',
                items: { type: 'string' },
              },
              legend: {
                type: 'object',
                description: 'Chart legend configuration.',
              },
              xAxis: {
                type: 'object',
                description: 'Chart x-axis configuration.',
              },
              yAxis: {
                type: 'object',
                description: 'Chart y-axis configuration.',
              },
              grid: {
                type: 'object',
                description: 'Chart grid configuration.',
              },
              tooltip: {
                type: 'object',
                description: 'Chart tooltip configuration using JSON-safe fields only.',
              },
              chartMargin: {
                type: 'object',
                description: 'Chart inner margin configuration.',
              },
              animate: {
                type: 'boolean',
                description: 'Whether chart transitions are animated.',
              },
              loading: {
                type: 'boolean',
                description: 'Whether the chart is in a loading state.',
              },
              error: {
                type: 'boolean',
                description: 'Whether the chart is in an error state.',
              },
              loadingText: {
                type: 'string',
                description: 'Default loading-state text for charts.',
              },
              emptyText: {
                type: 'string',
                description: 'Default empty-state text for charts.',
              },
              errorText: {
                type: 'string',
                description: 'Default error-state text for charts.',
              },
              searchValue: {
                type: 'string',
                description: 'Current search query. Used by type "search-modal".',
              },
              noHistoryResultsLabel: {
                type: 'string',
                description: 'SearchModal empty-state label shown before a query is typed.',
              },
              noResultsLabel: {
                type: 'string',
                description: 'SearchModal empty-state label shown when a query returns no results.',
              },
              newSearchCta: {
                type: 'string',
                description: 'SearchModal CTA label for starting a new search or chat.',
              },
              loaderItemsCount: {
                type: 'number',
                description: 'Number of skeleton rows shown by SearchModal while loading.',
              },
              showSearch: {
                type: 'boolean',
                description: 'Whether header renders its built-in search affordance.',
              },
              showTopBanner: {
                type: 'boolean',
                description: 'Whether header renders its top banner area.',
              },
              showCharacterCount: {
                type: 'boolean',
                description: 'Whether InputArea shows a live character counter.',
              },
              showAttachmentButton: {
                type: 'boolean',
                description: 'Whether InputArea shows its attachment button.',
              },
              showSendButton: {
                type: 'boolean',
                description: 'Whether InputArea shows its send button.',
              },
              showSendButtonTooltip: {
                type: 'boolean',
                description: 'Whether to show a tooltip on hover of the InputArea send button.',
              },
              sendButtonLabel: {
                type: 'string',
                description: 'Accessible label for the InputArea send button.',
              },
              attachmentButtonLabel: {
                type: 'string',
                description: 'Tooltip and accessible label for the InputArea attachment button.',
              },
              recordingState: {
                type: 'string',
                enum: ['idle', 'recording', 'processing'],
                description:
                  'Voice recording state for InputArea. "idle" shows normal input, "recording" shows cancel/confirm controls, "processing" disables confirm and shows a spinner.',
              },
              recordButtonLabel: {
                type: 'string',
                description: 'Accessible label for the InputArea record button.',
              },
              minRows: {
                type: 'number',
                description: 'Minimum visible textarea rows for InputArea.',
              },
              maxRows: {
                type: 'number',
                description: 'Maximum visible textarea rows for InputArea before scrolling.',
              },
              initialIndex: {
                type: 'number',
                description: 'Initial image index for ImagePreview.',
              },
              showThumbnails: {
                type: 'boolean',
                description: 'Whether ImagePreview shows its thumbnail strip.',
              },
              showCounter: {
                type: 'boolean',
                description: 'Whether ImagePreview shows the current/total counter.',
              },
              thumbnailPosition: {
                type: 'string',
                enum: ['bottom', 'left'],
                description: 'Thumbnail strip position for ImagePreview.',
              },
              activeItemId: {
                type: 'string',
                description: 'Currently active sidebar item id.',
              },
              collapsed: {
                type: 'boolean',
                description: 'Whether sidebar renders in collapsed mode.',
              },
              collapsedWidth: {
                type: 'string',
                description: 'Collapsed sidebar width.',
              },
              fileName: {
                type: 'string',
                description:
                  'Name of the attached file displayed in the AttachmentFile chip. Truncates with a tooltip on hover when long.',
              },
              fileType: {
                type: 'string',
                description:
                  'File type label shown below the file name in AttachmentFile (e.g. "PDF", "doc"). Truncates with ellipsis when long.',
              },
              fileSize: {
                type: 'string',
                description: 'File size label shown below the file name in AttachmentFile (e.g. "1.2 MB").',
              },
              removeButtonLabel: {
                type: 'string',
                description: 'Accessible aria-label for the AttachmentFile remove button.',
                default: 'Remove file',
              },
              isLoading: {
                type: 'boolean',
                description:
                  'Shows a spinner in place of the remove button while uploading. Only takes effect when actions[] is also provided.',
                default: false,
              },
              actions: {
                type: 'array',
                items: { type: 'string' },
                description:
                  'Action IDs from ui.actions to trigger when the remove button is clicked. The remove button is only rendered when this array is non-empty. Maps to onRemove in TSX.',
              },
              validation: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional validation rule IDs associated with this component.',
              },
              attributes: {
                type: 'object',
                description: 'Additional HTML/component attributes',
              },
              styling: {
                type: 'object',
                description:
                  "CSS styling for the component. All values MUST be real CSS values (e.g. '16px', '1rem', '50%'). NEVER use design token strings like 'xs', 'sm', 'md', 'lg', 'xl', 'none'.",
                properties: {
                  margin: {
                    type: ['string', 'number'],
                    description: "CSS margin value (e.g. '8px 0', '1rem', '0 auto')",
                  },
                  padding: {
                    type: ['string', 'number'],
                    description: "CSS padding value (e.g. '16px', '8px 16px', '1rem')",
                  },
                  width: { type: ['string', 'number'], description: "CSS width value (e.g. '100%', '320px', 'auto')" },
                  height: {
                    type: ['string', 'number'],
                    description: "CSS height value (e.g. '48px', '100vh', 'auto')",
                  },
                  maxWidth: { type: ['string', 'number'], description: 'CSS max-width value' },
                  minWidth: { type: ['string', 'number'], description: 'CSS min-width value' },
                  maxHeight: { type: ['string', 'number'], description: "CSS max-height value (e.g. '300px', '80vh')" },
                  minHeight: { type: ['string', 'number'], description: "CSS min-height value (e.g. '120px', '2rem')" },
                  color: { type: 'string', description: 'CSS color value' },
                  backgroundColor: { type: 'string', description: 'CSS background-color value' },
                  fontSize: { type: ['string', 'number'], description: "CSS font-size value (e.g. '14px', '1rem')" },
                  fontWeight: { type: ['string', 'number'], description: 'CSS font-weight value' },
                  textAlign: {
                    type: 'string',
                    description: "CSS text-align value (e.g. 'left', 'center', 'right', 'justify')",
                  },
                  display: { type: 'string', description: 'CSS display value' },
                  flexDirection: {
                    type: 'string',
                    description: "CSS flex-direction value (e.g. 'row', 'column', 'row-reverse', 'column-reverse')",
                  },
                  alignItems: {
                    type: 'string',
                    description:
                      "CSS align-items value (e.g. 'flex-start', 'flex-end', 'center', 'baseline', 'stretch')",
                  },
                  justifyContent: {
                    type: 'string',
                    description:
                      "CSS justify-content value (e.g. 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly')",
                  },
                  gap: { type: ['string', 'number'], description: "CSS gap value (e.g. '8px', '1rem')" },
                  borderRadius: { type: ['string', 'number'], description: 'CSS border-radius value' },
                  border: { type: 'string', description: 'CSS border shorthand' },
                  boxShadow: { type: 'string', description: "CSS box-shadow value (e.g. '0 1px 3px rgba(0,0,0,0.1)')" },
                  cursor: { type: 'string', description: "CSS cursor value (e.g. 'pointer', 'default')" },
                  flex: {
                    type: ['string', 'number'],
                    description:
                      "CSS flex shorthand for the component itself inside a flex container (e.g. '1', '0 0 auto', '1 1 50%')",
                  },
                  flexWrap: { type: 'string', description: "CSS flex-wrap value (e.g. 'wrap', 'nowrap')" },
                  flexGrow: { type: ['string', 'number'], description: 'CSS flex-grow value' },
                  flexShrink: { type: ['string', 'number'], description: 'CSS flex-shrink value' },
                  flexBasis: { type: ['string', 'number'], description: 'CSS flex-basis value' },
                  marginTop: { type: ['string', 'number'], description: 'CSS margin-top value' },
                  marginBottom: { type: ['string', 'number'], description: 'CSS margin-bottom value' },
                  marginLeft: { type: ['string', 'number'], description: 'CSS margin-left value' },
                  marginRight: { type: ['string', 'number'], description: 'CSS margin-right value' },
                  paddingTop: { type: ['string', 'number'], description: 'CSS padding-top value' },
                  paddingBottom: { type: ['string', 'number'], description: 'CSS padding-bottom value' },
                  paddingLeft: { type: ['string', 'number'], description: 'CSS padding-left value' },
                  paddingRight: { type: ['string', 'number'], description: 'CSS padding-right value' },
                  letterSpacing: { type: ['string', 'number'], description: 'CSS letter-spacing value' },
                  lineHeight: { type: ['string', 'number'], description: 'CSS line-height value' },
                  overflow: {
                    type: 'string',
                    description: "CSS overflow value (e.g. 'hidden', 'auto', 'scroll', 'visible')",
                  },
                  objectFit: {
                    type: 'string',
                    description: "CSS object-fit value (e.g. 'cover', 'contain', 'fill', 'none', 'scale-down')",
                  },
                  opacity: { type: ['string', 'number'], description: 'CSS opacity value (0–1, e.g. 0.5 or "0.5")' },
                  position: {
                    type: 'string',
                    description: "CSS position value (e.g. 'static', 'relative', 'absolute', 'fixed', 'sticky')",
                  },
                  zIndex: { type: ['string', 'number'], description: 'CSS z-index value' },
                  top: { type: ['string', 'number'], description: 'CSS top offset' },
                  right: { type: ['string', 'number'], description: 'CSS right offset' },
                  bottom: { type: ['string', 'number'], description: 'CSS bottom offset' },
                  left: { type: ['string', 'number'], description: 'CSS left offset' },
                },
              },
            },
          },
        },
        actions: {
          type: 'array',
          description: 'Available actions referenced by component actions[] arrays.',
          items: {
            type: 'object',
            required: ['id', 'type'],
            properties: {
              id: { type: 'string', description: 'Unique action ID.' },
              type: {
                type: 'string',
                description:
                  'Custom action type string matching an A2UIActionDefinition type (e.g. "add-to-cart", "action-view-all").',
              },
              label: { type: 'string', description: 'Action label for UI elements.' },
              trigger: {
                type: 'string',
                enum: ['click', 'change', 'input', 'blur', 'focus', 'submit', 'load', 'custom'],
                default: 'click',
              },
              payload: {
                type: 'object',
                description: 'Data payload for the action.',
              },
              endpoint: { type: 'string', description: 'API endpoint for api-call or agent-call types.' },
              method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], default: 'POST' },
              confirmation: {
                type: 'object',
                properties: {
                  required: { type: 'boolean', default: false },
                  message: { type: 'string' },
                  confirmText: { type: 'string', default: 'Confirm' },
                  cancelText: { type: 'string', default: 'Cancel' },
                },
              },
              onSuccess: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  action: { type: 'string', description: 'ID of action to execute on success.' },
                  redirect: { type: 'string', description: 'URL to redirect to on success.' },
                },
              },
              onError: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  action: { type: 'string', description: 'ID of action to execute on error.' },
                },
              },
              loading: { type: 'boolean', default: false, description: 'Show loading state during action execution.' },
              debounce: { type: 'integer', description: 'Debounce delay in milliseconds.' },
              throttle: { type: 'integer', description: 'Throttle delay in milliseconds.' },
            },
          },
        },
        validations: {
          type: 'array',
          description: 'Form validation rules associated with components.',
          items: {
            type: 'object',
            required: ['id', 'componentId', 'rules'],
            properties: {
              id: { type: 'string', description: 'Unique validation identifier.' },
              componentId: { type: 'string', description: 'ID of the component to validate.' },
              rules: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['type'],
                  properties: {
                    type: {
                      type: 'string',
                      enum: [
                        'required',
                        'email',
                        'url',
                        'phone',
                        'min-length',
                        'max-length',
                        'min-value',
                        'max-value',
                        'pattern',
                        'custom',
                      ],
                    },
                    value: {},
                    message: { type: 'string', description: 'Error message to display.' },
                    customValidator: { type: 'string', description: 'Name of custom validation function.' },
                  },
                },
              },
              trigger: {
                type: 'string',
                enum: ['change', 'blur', 'submit'],
                default: 'blur',
              },
            },
          },
        },
      },
    },
    state: {
      type: 'object',
      description: 'Current UI state for state management',
      properties: {
        formData: { type: 'object' },
        errors: { type: 'object' },
        loading: { type: 'boolean', default: false },
        disabled: { type: 'boolean', default: false },
      },
    },
  },
} as const;

/**
 * Simplified schema for basic structural validation only.
 * Use when you don't need full component type enforcement.
 */
export const A2UI_SPEC_SCHEMA_SIMPLE = {
  type: 'object',
  required: ['version', 'metadata', 'ui'],
  properties: {
    version: { type: 'string' },
    metadata: {
      type: 'object',
      required: ['agentId', 'agentName', 'timestamp'],
    },
    ui: {
      type: 'object',
      required: ['components'],
      properties: {
        components: { type: 'array', minItems: 1 },
        actions: { type: 'array' },
      },
    },
  },
} as const;

/**
 * TypeScript types derived from the schema shape.
 */
export type A2UIVariant =
  | (typeof A2UI_BUTTON_VARIANTS)[number]
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'vertical'
  | 'horizontal';

export type A2UILayoutType = 'vertical' | 'horizontal' | 'grid' | 'flex' | 'stack' | 'split';

export type A2UIAction = {
  id: string;
  type: string;
  label?: string;
  trigger?: 'click' | 'change' | 'input' | 'blur' | 'focus' | 'submit' | 'load' | 'custom';
  payload?: Record<string, unknown>;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  confirmation?: {
    required?: boolean;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  };
  onSuccess?: {
    message?: string;
    action?: string;
    redirect?: string;
  };
  onError?: {
    message?: string;
    action?: string;
  };
  loading?: boolean;
  debounce?: number;
  throttle?: number;
};

export type A2UIValidationRule = {
  type:
    | 'required'
    | 'email'
    | 'url'
    | 'phone'
    | 'min-length'
    | 'max-length'
    | 'min-value'
    | 'max-value'
    | 'pattern'
    | 'custom';
  value?: unknown;
  message?: string;
  customValidator?: string;
};

export type A2UIValidation = {
  id: string;
  componentId: string;
  rules: A2UIValidationRule[];
  trigger?: 'change' | 'blur' | 'submit';
};

/**
 * Defines an application action available to the LLM and the renderer.
 *
 * Pass an array of these to both `buildA2UISystemPrompt` and `renderA2UISpec`
 * so the LLM knows which action types exist and the renderer can execute them.
 */
export type A2UIActionDefinition = {
  /** Action type string used as `type` in A2UI JSON — must be unique across definitions */
  type: string;
  /** Human-readable description injected into the LLM system prompt */
  description: string;
  /** Runtime handler called when the action fires in the rendered UI */
  handler?: (action: A2UIAction) => void;
};

export type A2UIStyling = {
  margin?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  color?: string;
  backgroundColor?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  letterSpacing?: string | number;
  lineHeight?: string | number;
  textAlign?: string;
  display?: string;
  flexDirection?: string;
  flex?: string | number;
  flexWrap?: string;
  flexGrow?: string | number;
  flexShrink?: string | number;
  flexBasis?: string | number;
  alignItems?: string;
  justifyContent?: string;
  gap?: string | number;
  borderRadius?: string | number;
  border?: string;
  boxShadow?: string;
  cursor?: string;
  overflow?: string;
  objectFit?: string;
  opacity?: string | number;
  position?: string;
  zIndex?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  [key: string]: string | number | undefined;
};

export type A2UISearchModalItem = {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  date?: number;
  items?: A2UISearchModalItem[];
};

export type A2UISearchModalSection = {
  title?: string;
  items: A2UISearchModalItem[];
};

export type A2UIImagePreviewItem = {
  src: string;
  alt?: string;
  caption?: string;
};

export type A2UISidebarItem = {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  disabled?: boolean;
  children?: A2UISidebarItem[];
};

export type A2UIHeaderMenuItem = {
  id?: string;
  title: string;
  path?: string;
  icon?: string;
};

export type A2UIComponent = {
  id: string;
  type: (typeof A2UI_COMPONENT_TYPES)[number];
  label?: string;
  value?: unknown;
  initial?: number; // counter: starting numeric value
  caption?: string;
  placeholder?: string;
  helpText?: string;
  ariaLabel?: string;
  content?: string; // tooltip: overlay text
  name?: string; // avatar-user: display name; loader: animation type ("circle" | "dots"); rating: radio group name
  subtitle?: string; // avatar-user: secondary line beneath the name
  className?: string;
  tabIndex?: number;
  layout?: 'horizontal' | 'vertical'; // carousel: layout direction
  as?: string;
  htmlFor?: string; // label: associated form control id
  captionAs?: string;
  href?: string; // link: destination URL
  target?: '_blank' | '_self' | '_parent' | '_top'; // link: browsing context
  rel?: string; // link: relationship attribute
  buttonType?: 'button' | 'submit' | 'reset'; // button: html button type
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'; // tooltip/menu/snackbar placement
  delay?: number; // tooltip: open delay
  length?: string; // separator: explicit line length, especially useful for vertical separators
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  visible?: boolean;
  isOpen?: boolean; // chat-container: sidebar open state
  bordered?: boolean; // breadcrumbs: bordered container
  checked?: boolean; // checkbox/switch: checked state
  indeterminate?: boolean; // checkbox: indeterminate state
  allowMultipleExpand?: boolean; // accordion: allow many open items
  withoutSeparator?: boolean; // accordion: remove item dividers
  isInline?: boolean; // accordion: inline header layout
  defaultValue?: unknown; // accordion/radio-group/rating: initial uncontrolled value
  variant?: string;
  appearance?: string; // badge: secondary appearance variant
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; // icon also supports xxl (40px)
  styleVariant?: string | string[]; // typography: additional style modifiers
  underline?: 'default' | 'highlight' | 'none'; // link: underline behavior
  labelSide?: 'left' | 'right'; // switch: label placement
  separator?: string; // breadcrumbs: text separator
  separatorIcon?: string; // breadcrumbs: icon separator
  separatorAfterLastItem?: boolean; // breadcrumbs: keep trailing separator
  color?: string; // typography/separator: prefer theme color token paths or supported palette aliases
  rounded?: 'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // button/loader: rounded corners
  animationName?: string | null; // skeleton: animation token/name, or null to disable built-in animation
  animationProps?: string; // skeleton/loader: custom CSS animation shorthand
  withWrapper?: boolean; // loader/portal: whether to render an extra helper wrapper
  wrapperVariant?: 'inline' | 'section' | 'fullPage'; // portal: wrapper preset
  blocksScroll?: boolean; // portal: lock background scrolling while mounted
  icon?: string; // generic icon name; avatar also uses this for icon fallback content, and some components accept it as a legacy iconStart alias
  iconStart?: string; // preferred icon name for leading adornments
  iconEnd?: string; // icon name for trailing adornments
  fill?: string; // icon/avatar fallback: prefer theme tokens (e.g. "icon.error", "icon.primary"), CSS/hex fallback
  fillSvg?: string; // icon/avatar fallback: uniform SVG fill — prefer theme tokens, CSS/hex fallback
  WrapperView?: string; // portal: wrapper tag override
  container?: string; // portal: CSS selector for target mount node
  // Avatar-specific top-level fields
  src?: string; // avatar: image URL
  alt?: string; // avatar: alt text
  sizeVariant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // avatar: alias for size
  orientation?: 'horizontal' | 'vertical'; // separator: direction
  labelPosition?: 'start' | 'center' | 'end'; // separator: label placement
  labelColor?: string; // separator: prefer theme color token paths or supported palette aliases
  backgroundColor?: string; // avatar/skeleton: background color — prefer theme tokens or supported palette aliases
  withBadge?: boolean; // avatar: show status dot badge
  badgeColor?: string; // avatar: badge dot color — prefer theme tokens, CSS/hex fallback
  width?: string | number; // layout: CSS string ("100%"); icon: pixel number (24)
  height?: string | number; // layout: CSS string ("100px"); icon: pixel number (24)
  minHeight?: string | number; // textarea/layout/menu: minimum height
  count?: number; // slider-dots: total number of dots
  activeIndex?: string | number; // slider-dots: active dot index; select: active option
  step?: number; // slider: step increment
  lines?: number; // truncate: max lines
  objectFit?: string; // image: object-fit behavior
  isBordered?: boolean;
  isHighlighted?: boolean;
  withShadowHover?: boolean;
  fullWidth?: boolean; // button/input-file: stretch to container width
  isIcon?: boolean; // button/input-file: icon-only rendering
  showArrows?: boolean; // carousel: show previous/next buttons
  showDots?: boolean; // carousel/content-carousel: show dot indicators
  thumbs?: 'start' | 'end'; // carousel: thumbnail strip position
  isFocusable?: boolean; // carousel/content-carousel: allow keyboard focus on root
  visibleItems?: number; // content-carousel: number of visible items
  scrollStep?: number; // content-carousel: scroll items per action
  scrollAlignment?: 'left' | 'centered'; // content-carousel: item alignment
  vertical?: 'hidden' | 'visible' | 'auto'; // scroll: vertical scrollbar visibility
  horizontal?: 'hidden' | 'visible' | 'auto'; // scroll: horizontal scrollbar visibility
  autoHide?: boolean; // scroll: fade scrollbars when inactive
  showSidebarAsideControl?: boolean; // chat-container: sidebar collapse/close button visibility
  showSidebarHeaderControl?: boolean; // chat-container: header reopen button visibility
  multiple?: boolean; // select/input-file: multi-select mode
  searchable?: boolean; // select: searchable dropdown
  searchPlaceholder?: string; // select: search input placeholder
  autoOpen?: boolean; // select: open on render
  accept?: string; // input-file: accepted MIME types/extensions
  capture?: boolean | 'user' | 'environment'; // input-file: mobile capture mode
  inputFileButtonLabel?: string; // drag-and-drop: label for the internal file picker button
  acceptedFileTypes?: string[]; // drag-and-drop: allowed MIME types
  maxFileSize?: number; // drag-and-drop: maximum size per file in bytes
  maxFiles?: number; // drag-and-drop: maximum total file count
  debounceCallbackTime?: number; // input: debounced callbacks
  ariaDescribedBy?: string; // input/textarea: helper text id
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'; // textarea: resize mode
  dynamicHeightAdjustment?: boolean; // textarea: auto-grow height
  maxCharacters?: number; // textarea: character counter
  maxLength?: number; // input-area: character limit
  currentValue?: string; // price: formatted current value without symbol
  oldValue?: string; // price: previous/struck-through value
  currencySymbol?: string; // price: "$", "€", etc.
  currencySymbolPosition?: 'before' | 'after'; // price: symbol placement
  gutter?: string | number;
  padding?: string;
  showPercentage?: boolean; // progress-bar: show numeric percentage
  fillColor?: string; // progress-bar: filled track color
  closeOnSelect?: boolean; // menu: close on option click
  offsetX?: number; // menu: horizontal offset
  offsetY?: number; // menu: vertical offset
  carouselOptions?: Record<string, unknown>; // carousel: Embla options
  options?: Array<{
    value: unknown;
    label: string;
    disabled?: boolean;
    icon?: string;
    href?: string;
    noticeCounter?: number | string;
    hex?: string;
    image?: string;
    tooltip?: string;
    validationStatus?: 'success' | 'error';
  }>;
  columns?: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    filterable?: boolean;
    align?: 'left' | 'center' | 'right';
    formatter?: 'text' | 'number' | 'currency' | 'date' | 'datetime' | 'boolean' | 'custom';
  }>;
  rows?: Record<string, unknown>[];
  errors?: string[]; // drag-and-drop: inline validation/upload messages
  files?: Array<{ name: string; size?: number; type?: string }>; // drag-and-drop: controlled file metadata
  data?: Record<string, unknown>[]; // alias for rows (LLMs commonly generate this)
  children?: A2UIComponent[];
  dragOverContent?: A2UIComponent[]; // drag-and-drop: hover-state override content
  dragOverChildren?: A2UIComponent[]; // drag-and-drop-files: hover-state override content
  loadingOverlay?: A2UIComponent[]; // drag-and-drop: loading-state override content
  footer?: A2UIComponent[];
  actionChildren?: A2UIComponent[];
  logoChildren?: A2UIComponent[];
  menuChildren?: A2UIComponent[];
  bannerChildren?: A2UIComponent[];
  advChildren?: A2UIComponent[];
  headerChildren?: A2UIComponent[];
  footerChildren?: A2UIComponent[];
  headerContent?: A2UIComponent[];
  sidebarContent?: A2UIComponent[];
  sidebarMinifiedContent?: A2UIComponent[];
  sidebarHeaderContent?: A2UIComponent[];
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  isCustomView?: boolean;
  actions?: string[];
  validation?: string[];
  attributes?: Record<string, unknown>;
  styling?: A2UIStyling;
  // Layout primitive props (row, column, flex-container)
  align?: string;
  justify?: string;
  isWrap?: boolean;
  isReversed?: boolean;
  gap?: string | number;
  flex?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  maxHeight?: string | number;
  gridColumns?: number | string; // radio-group: grid column count
  gridRows?: number | string; // radio-group: grid row count
  gridColumnGutter?: number | string; // radio-group: horizontal grid gap
  gridRowGutter?: number | string; // radio-group: vertical grid gap
  wrapItems?: boolean; // radio-group: wrap row/column items
  itemWidth?: string; // radio-group: option width
  itemHeight?: string; // radio-group: option height
  isIconsView?: boolean; // stepper: icon indicators instead of step numbers
  duration?: number | null; // snackbar: auto-dismiss time
  dismissOnClick?: boolean; // snackbar: click-to-dismiss
  colored?: boolean; // snackbar: filled background
  isAnimated?: boolean; // snackbar: animate in/out
  stickyHeader?: boolean; // table: sticky header
  stickyFooter?: boolean; // table: sticky footer
  stickyPagination?: boolean; // table: sticky pagination
  pagination?: boolean; // table: show pagination controls
  pageSize?: number; // table: initial rows per page
  pageSizes?: number[]; // table: selectable page sizes
  virtualized?: boolean; // table: virtualization enabled
  rowHeight?: number; // table: virtualized row height
  minVisibleRange?: number; // table: virtualized buffer size
  expandableRows?: boolean; // table: render expand affordance per row; expanded content is auto-rendered from non-column row fields
  // Content props (drag-and-drop)
  title?: string;
  description?: string;
  status?: 'pending' | 'fulfilled' | 'rejected'; // chat-bubble: generation status
  bgColor?: string; // header: background override
  mobileMenuList?: A2UIHeaderMenuItem[]; // header: mobile drawer menu items
  emptyItemsResult?: string; // search: empty-state message
  // Numeric range props
  max?: number;
  min?: number;
  // State props (search-modal, drag-and-drop)
  isLoading?: boolean;
  loading?: boolean; // chart: loading state
  error?: boolean; // chart: error state
  loadingText?: string; // chart: loading text
  emptyText?: string; // chart: empty text
  errorText?: string; // chart: error text
  chartHeight?: number; // chart: canvas height
  xKey?: string; // chart: x-axis data key
  series?: Record<string, unknown>[]; // chart: series config
  pieConfig?: Record<string, unknown>; // chart: pie/donut config
  colors?: string[]; // chart: custom palette
  legend?: Record<string, unknown>; // chart legend config
  xAxis?: Record<string, unknown>; // chart x-axis config
  yAxis?: Record<string, unknown>; // chart y-axis config
  grid?: Record<string, unknown>; // chart grid config
  tooltip?: Record<string, unknown>; // chart tooltip config
  chartMargin?: { top?: number; right?: number; bottom?: number; left?: number }; // chart inner margin
  animate?: boolean; // chart: animate transitions
  // Search-modal specific
  searchValue?: string;
  noHistoryResultsLabel?: string;
  noResultsLabel?: string;
  newSearchCta?: string;
  loaderItemsCount?: number;
  results?: A2UISearchModalItem[];
  historyResults?: A2UISearchModalItem[];
  popularItems?: A2UISearchModalSection;
  aiSuggestions?: A2UISearchModalSection;
  articles?: A2UISearchModalSection;
  // Header specific
  showSearch?: boolean;
  showTopBanner?: boolean;
  // InputArea specific
  showCharacterCount?: boolean;
  showAttachmentButton?: boolean;
  showSendButton?: boolean;
  showSendButtonTooltip?: boolean;
  sendButtonLabel?: string;
  attachmentButtonLabel?: string;
  recordingState?: 'idle' | 'recording' | 'processing';
  recordButtonLabel?: string;
  minRows?: number;
  maxRows?: number;
  // ImagePreview specific
  images?: A2UIImagePreviewItem[];
  initialIndex?: number;
  showThumbnails?: boolean;
  showCounter?: boolean;
  thumbnailPosition?: 'bottom' | 'left';
  // Sidebar specific
  items?: A2UISidebarItem[];
  activeItemId?: string;
  collapsed?: boolean;
  collapsedWidth?: string;
  cursor?: string;
  role?: string;
};

export type A2UIMetadata = {
  agentId: string;
  agentName: string;
  agentVersion?: string;
  timestamp: string;
  sessionId?: string;
  provider?: string;
  scenario?: string;
  segment?: string;
  isSimulated?: boolean;
  locale?: string;
  theme?: 'light' | 'dark' | 'auto';
  customData?: Record<string, unknown>;
  [key: string]: unknown;
};

export type A2UISpec = {
  version: string;
  metadata: A2UIMetadata;
  ui: {
    layout?: {
      type?: A2UILayoutType;
      spacing?: string;
      gridColumns?: number;
      alignment?: string;
      justification?: string;
      responsive?: {
        mobile?: { type?: string; gridColumns?: number; spacing?: string };
        tablet?: { type?: string; gridColumns?: number; spacing?: string };
        desktop?: { type?: string; gridColumns?: number; spacing?: string };
      };
    };
    components: A2UIComponent[];
    actions?: A2UIAction[];
    validations?: A2UIValidation[];
  };
  state?: {
    formData?: Record<string, unknown>;
    errors?: Record<string, unknown>;
    loading?: boolean;
    disabled?: boolean;
  };
};

/**
 * Metadata describing a custom component for use in the LLM system prompt.
 *
 * Pass an array of these as `customComponents` to `buildA2UISystemPrompt`.
 * To wire runtime rendering, extend this with `A2UICustomComponentDefinition`.
 */
export type A2UICustomComponentMeta = {
  /** Component type string used as `type` in A2UI JSON — must not clash with built-in types */
  type: string;
  /** Human-readable description injected into the LLM system prompt */
  description: string;
  /** Prop names mapped to type/description strings, formatted the same way as built-in props */
  props?: Record<string, string>;
  /** Additional usage notes appended below the component description in the prompt */
  notes?: string[];
  /** Category group shown in the component list (default: "Custom") */
  category?: string;
};

function getUniqueCustomComponentTypes(customTypes: string[]): string[] {
  const seenTypes = new Set<string>(A2UI_COMPONENT_TYPES);
  const uniqueCustomTypes: string[] = [];

  for (const type of customTypes) {
    if (seenTypes.has(type)) {
      continue;
    }

    seenTypes.add(type);
    uniqueCustomTypes.push(type);
  }

  return uniqueCustomTypes;
}

/**
 * Returns a copy of `A2UI_SPEC_SCHEMA` with `customTypes` appended to the allowed
 * component `type` enum. The original schema is never mutated.
 *
 * Use this with AJV or Gemini `responseSchema` when your spec includes custom component types.
 *
 * Built-in types always take precedence — pass only the extra types you added.
 */
export function extendA2UISpecSchema(customTypes: string[]): object {
  const uniqueCustomTypes = getUniqueCustomComponentTypes(customTypes);

  if (uniqueCustomTypes.length === 0) {
    return A2UI_SPEC_SCHEMA;
  }

  const baseTypeEnum = A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties.type.enum;

  return {
    ...A2UI_SPEC_SCHEMA,
    properties: {
      ...A2UI_SPEC_SCHEMA.properties,
      ui: {
        ...A2UI_SPEC_SCHEMA.properties.ui,
        properties: {
          ...A2UI_SPEC_SCHEMA.properties.ui.properties,
          components: {
            ...A2UI_SPEC_SCHEMA.properties.ui.properties.components,
            items: {
              ...A2UI_SPEC_SCHEMA.properties.ui.properties.components.items,
              properties: {
                ...A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties,
                type: {
                  ...A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties.type,
                  enum: [...baseTypeEnum, ...uniqueCustomTypes],
                },
              },
            },
          },
        },
      },
    },
  };
}
