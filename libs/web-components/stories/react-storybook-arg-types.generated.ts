/* This file is generated from the React Storybook metadata. Do not edit it by hand. */
export const reactStorybookArgTypes = {
  Toggle: {
    items: {
      control: {
        type: 'object',
        disable: false,
      },
      name: 'items',
      type: {
        name: 'union',
        value: [
          {
            raw: 'string[]',
            name: 'array',
            value: [
              {
                name: 'string',
              },
            ],
          },
          {
            raw: 'ToggleItem[]',
            name: 'array',
            value: [
              {
                name: 'other',
                value: 'ToggleItem',
              },
            ],
          },
        ],
        required: false,
        raw: 'string[] | ToggleItem[]',
      },
      description: 'List of items to toggle between',
      table: {
        type: {
          summary: 'Array<string | { label: string; value: string }>',
        },
        defaultValue: {
          summary: '[]',
        },
      },
    },
    value: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'value',
      type: {
        name: 'other',
        required: false,
        value: 'unknown',
      },
      description: 'Currently selected value',
      table: {
        type: {
          summary: 'string | unknown',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    onValueChange: {
      name: 'onValueChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Function triggered when the value changes Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      action: 'value changed',
      control: {
        disable: true,
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'disabled',
      description: 'Disables interaction with the component',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    renderItemContent: {
      name: 'renderItemContent',
      description: 'Custom render function for each item',
      type: {
        required: false,
        raw: '(item: ToggleItem | string, index: number) => Node | string',
        name: 'function',
      },
      table: {
        type: {
          summary: '(item: unknown) => Node | string',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom styles for the component',
      table: {
        type: {
          summary: 'InlineBoxStyles',
        },
        defaultValue: {
          summary: '{}',
        },
      },
    },
  },
  Truncate: {
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      table: {
        category: 'Content',
        type: {
          summary: 'default slot',
        },
      },
      description:
        'Node | string content to display. Accepts string text or any Node | string for flexible content. Web Components provide this content through the default slot.',
    },
    lines: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'lines',
      description: 'Number of lines before truncation (default: 1)',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '1',
        },
        category: 'Truncation',
      },
    },
    styles: {
      control: {
        type: 'object',
        disable: false,
      },
      name: 'styles',
      description:
        'Custom CSS styles object for one-off styling needs. Accepts Emotion CSS object syntax with support for nested selectors, pseudo-classes, and media queries.',
      type: {
        required: false,
      },
      table: {
        defaultValue: {
          summary: '{}',
        },
        category: 'Appearance',
      },
    },
    ref: {
      name: 'ref',
      description:
        'Forwarded ref providing imperative access to truncation state. Exposes `isTruncated` (boolean) indicating if content is truncated. Useful for conditionally showing tooltips or for analytics.',
      table: {
        category: 'Ref API',
        type: {
          summary: 'Ref<TruncateRef>',
          detail: 'TruncateRef: { ref: Ref<HTMLSpanElement>; isTruncated: boolean; }',
        },
      },
      control: {
        disable: true,
      },
    },
  },
  Wrapper: {
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<WrapperVariant>',
        value: 'EnumOrPrimitive',
      },
      description: 'Determines the semantic HTML element and associated styles for different layout contexts.',
      table: {
        type: {
          summary: 'WrapperVariant',
        },
        defaultValue: {
          summary: 'inline',
        },
      },
      options: ['Inline', 'Section', 'FullPage'],
    },
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description:
        'Content to be rendered inside the wrapper. Can be text, components, or other elements. Web Components provide this content through the default slot.',
      table: {
        type: {
          summary: 'default slot',
        },
      },
    },
    styles: {
      control: {
        type: 'object',
        disable: false,
      },
      name: 'styles',
      type: {
        name: 'object',
        value: {
          padding: {
            name: 'string',
          },
          border: {
            name: 'string',
          },
          borderRadius: {
            name: 'string',
          },
          backgroundColor: {
            name: 'string',
          },
        },
      },
      description: 'Custom CSS styles object to override or extend default wrapper styling.',
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
      },
    },
    as: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'as',
      description:
        'Overrides the default wrapper HTML element used for rendering (e.g., "div", "section", "article"). Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: 'keyof HTMLElementTagNameMap',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'HTMLElementTagNameMap',
          },
          {
            name: 'other',
            value: 'keyof HTMLElementTagNameMap',
          },
        ],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
      },
    },
    className: {
      name: 'className',
      description: 'Additional CSS class names to be applied to the wrapper element.',
      table: {
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    display: {
      name: 'display',
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid'],
      description: 'CSS display property to control the layout behavior of the wrapper.',
      table: {
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
    position: {
      name: 'position',
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      description: 'CSS position property to control the positioning context of the wrapper.',
      table: {
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
  },
  Slider: {
    min: {
      control: {
        type: 'number',
      },
      name: 'min',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Minimum value of the slider range',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '1',
        },
      },
    },
    max: {
      control: {
        type: 'number',
      },
      name: 'max',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Maximum value of the slider range',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '100',
        },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      name: 'disabled',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'Whether the slider is disabled',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    styles: {
      control: {
        type: 'object',
      },
      name: 'styles',
      type: {
        name: 'object',
        value: {},
      },
      description: 'Custom styles to apply to the slider component',
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
      },
    },
    value: {
      control: {
        type: 'number',
      },
      name: 'value',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Current value of the slider',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '1',
        },
      },
    },
    onChange: {
      name: 'onChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Callback function triggered when slider value changes Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        disable: true,
      },
    },
    step: {
      control: {
        type: 'number',
      },
      name: 'step',
      description: '',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
      },
    },
  },
  SliderDots: {
    count: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'count',
      type: {
        name: 'number',
        required: true,
      },
      description: 'Total number of dots to render',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
        category: 'Core Properties',
      },
    },
    activeIndex: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'activeIndex',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Index of the currently active dot (zero-based)',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
        category: 'Core Properties',
      },
    },
    onDotClick: {
      name: 'onDotClick',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Callback fired when a dot is clicked, receives the dot index Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      action: 'Dot clicked',
      control: {
        disable: true,
      },
    },
  },
  Switch: {
    name: {
      control: {
        type: 'text',
      },
      name: 'name',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Name attribute of the switch input',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'switch',
        },
        category: 'Identification',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'disabled',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'Disables the switch interaction',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description: 'Label content for the switch Web Components provide this content through the default slot.',
      table: {
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'Label',
        },
        category: 'Content',
      },
    },
    onValueChange: {
      name: 'onValueChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Callback fired when the switch value changes Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      action: 'Switch value changed',
      control: {
        disable: true,
      },
    },
    label: {
      control: {
        type: 'radio',
      },
      options: ['left ', ' right'],
      name: 'label',
      description: 'Position of the label relative to the switch',
      type: {
        required: false,
        raw: "'left' | 'right'",
        name: 'enum',
        value: ['left', 'right'],
      },
      table: {
        type: {
          summary: 'LabelPosition',
          detail: 'left | right',
        },
        defaultValue: {
          summary: 'right',
        },
        category: 'Layout',
      },
    },
    isLoading: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'isLoading',
      description: 'Shows loading state and disables the switch',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
    checked: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'checked',
      description: 'Controls the checked state of the switch',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
  },
  Textarea: {
    name: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'name',
      type: {
        name: 'string',
      },
      description: 'Input field name attribute',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'textarea',
        },
        category: 'Basics',
      },
    },
    placeholder: {
      control: {
        disable: true,
      },
      name: 'placeholder',
      type: {
        name: 'other',
        value: 'slot="placeholder"',
      },
      description: 'Placeholder text Web Components provide this content through the slot="placeholder".',
      table: {
        type: {
          summary: 'slot="placeholder"',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Basics',
      },
    },
    defaultValue: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'defaultValue',
      type: {
        name: 'string',
      },
      description: 'Initial textarea content',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Basics',
      },
    },
    onChange: {
      name: 'onChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      action: 'changed',
      description:
        'Callback when textarea content changes Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      control: {
        disable: true,
      },
    },
    resize: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'resize',
      description: 'Controls how the textarea can be resized',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<TextareaResize>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'TextareaResize',
        },
        defaultValue: {
          summary: 'TextareaResize.None',
        },
        category: 'Behavior',
      },
      options: ['none', 'both', 'horizontal', 'vertical'],
    },
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['default', 'inline'],
      name: 'variant',
      description: 'Visual variant of the textarea',
      type: {
        required: false,
        raw: "'default' | 'inline'",
        name: 'enum',
        value: ['default', 'inline'],
      },
      table: {
        type: {
          summary: 'TextareaVariant',
        },
        defaultValue: {
          summary: "'default'",
        },
        category: 'Styling',
      },
    },
    color: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'color',
      description: 'Color variant of the textarea',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<InputColorVariant>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'InputColorVariant',
        },
        defaultValue: {
          summary: "'primary'",
        },
        category: 'Styling',
      },
      options: ['primary', 'success', 'warning', 'error'],
    },
    ariaDescribedBy: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'ariaDescribedBy',
      description: 'ID of element that describes this textarea',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Accessibility',
      },
    },
    dynamicHeightAdjustment: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'dynamicHeightAdjustment',
      description: 'Enable/disable dynamic height adjustment',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Behavior',
      },
    },
    onCustomResize: {
      name: 'onCustomResize',
      description: 'Callback triggered when textarea is manually resized by user',
      type: {
        required: false,
        raw: '(newSize: { height: number; width: number }) => void',
        name: 'function',
      },
      table: {
        type: {
          summary: '(newSize: { height: number; width: number }) => void',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      action: 'resized',
    },
    minHeight: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'minHeight',
      description: 'Minimum height of textarea',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Sizing & Layout',
      },
    },
    maxHeight: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'maxHeight',
      description: 'Maximum height of textarea',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Sizing & Layout',
      },
    },
    maxCharacters: {
      control: {
        type: 'number',
      },
      name: 'maxCharacters',
      description: '',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
      },
    },
    autoFocus: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'autoFocus',
      description: 'Whether the textarea should auto focus',
      type: {
        required: false,
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Accessibility',
      },
    },
    value: {
      name: 'value',
      description: 'Controlled value of the textarea',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Basics',
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    disabled: {
      name: 'disabled',
      description: 'Whether the textarea is disabled',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Accessibility',
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    readOnly: {
      name: 'readOnly',
      description: 'Whether the textarea is read only',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Accessibility',
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    rows: {
      name: 'rows',
      description: 'Number of rows',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Sizing & Layout',
      },
      control: {
        type: 'number',
        disable: false,
      },
    },
    maxLength: {
      name: 'maxLength',
      description: 'Maximum character limit',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Behavior',
      },
      control: {
        type: 'number',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom CSS styles to override default styling',
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Styling',
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Separator: {
    orientation: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'orientation',
      description: 'The orientation of the separator.',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<Orientation>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'Orientation',
        },
        defaultValue: {
          summary: 'horizontal',
        },
      },
      options: ['vertical', 'horizontal'],
    },
    length: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'length',
      description: 'The length of the separator (e.g., "100px", "50%").',
      type: {
        required: false,
        name: 'other',
        value: 'literal',
      },
      table: {
        type: {
          summary: '`${number}${Unit}`',
        },
      },
    },
    color: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'color',
      description:
        'The color of the separator line. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path / palette-style alias (e.g., "border.error", "text.secondary", "brand.500", "theme.palette.warning.main").',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    size: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'size',
      description: 'The thickness/size of the separator line.',
      type: {
        required: false,
        name: 'other',
        value: 'SizeVariant',
      },
      table: {
        type: {
          summary: 'SizeVariant',
        },
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      description: 'The visual style variant of the separator (e.g., "solid", "dashed").',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<SeparatorVariant>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'SeparatorVariant',
        },
      },
      options: ['solid', 'dashed', 'dotted'],
    },
    as: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['div', 'hr', 'span'],
      name: 'as',
      description: 'The HTML element to render the separator as. Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: "'div' | 'hr' | 'span'",
        name: 'enum',
        value: ['div', 'hr', 'span'],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
        defaultValue: {
          summary: 'div',
        },
      },
    },
    label: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'label',
      description: 'Text to display within the separator.',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    labelPosition: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'labelPosition',
      description: 'The position of the label when present.',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<SeparatorLabelPosition>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'SeparatorLabelPosition',
        },
        defaultValue: {
          summary: 'center',
        },
      },
      options: ['start', 'center', 'end'],
    },
    labelColor: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'labelColor',
      description:
        'The color of the label text. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path / palette-style alias (e.g., "text.caption", "text.secondary", "brand.500").',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom styles for the separator.',
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
      },
      subControls: {
        backgroundColor: {
          control: {
            type: 'color',
          },
          description: 'Background color of the separator.',
          table: {
            type: {
              summary: 'string',
            },
          },
        },
        border: {
          control: {
            type: 'text',
          },
          description: 'Border style of the separator.',
          table: {
            type: {
              summary: 'string',
            },
          },
        },
        margin: {
          control: {
            type: 'text',
          },
          description: 'Margin around the separator.',
          table: {
            type: {
              summary: 'string',
            },
          },
        },
        padding: {
          control: {
            type: 'text',
          },
          description: 'Padding within the separator.',
          table: {
            type: {
              summary: 'string',
            },
          },
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Skeleton: {
    width: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'width',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Sets the width of the skeleton. Accepts any valid CSS width value.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'auto',
        },
      },
    },
    height: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'height',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Sets the height of the skeleton. Accepts any valid CSS height value.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'auto',
        },
      },
    },
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<SkeletonVariant>',
        value: 'EnumOrPrimitive',
      },
      description: 'Controls the shape of the skeleton.',
      table: {
        type: {
          summary: 'select',
        },
        defaultValue: {
          summary: 'rounded',
        },
      },
      options: ['rectangular', 'rounded', 'circular'],
    },
    animationName: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'animationName',
      description:
        'Overrides the default animation keyframe name. Accepts theme animation token names such as "blinkKeyframes", raw CSS animation names, or `null` to disable the built-in animation.',
      type: {
        required: false,
        raw: 'NullableType<string>',
        name: 'other',
        value: 'NullableType',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'blinkKeyframes',
        },
      },
    },
    animationProps: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'animationProps',
      description:
        'Custom animation timing string appended to `animationName` (for example "1200ms ease-in-out 0ms infinite").',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    backgroundColor: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'backgroundColor',
      description:
        'Sets the skeleton fill color. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path / palette-style alias (e.g., "bg.fill.success.primary.default", "brand.500", "theme.palette.success.main").',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    className: {
      name: 'className',
      description: 'Provides a way to apply custom CSS classes, such as utility CSS utility classes for animations.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    children: {
      name: 'children',
      description:
        'Content to be rendered inside the skeleton wrapper. Web Components provide this content through the default slot.',
      table: {
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'default slot',
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom CSS properties to apply to the skeleton.',
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
      },
      subControls: {
        backgroundColor: {
          control: 'color',
          description: 'Background color of the skeleton.',
          table: {
            type: {
              summary: 'string',
            },
          },
        },
        borderRadius: {
          control: 'text',
          description: 'Border radius of the skeleton.',
          table: {
            type: {
              summary: 'string',
            },
          },
        },
        opacity: {
          control: 'number',
          description: 'Opacity of the skeleton.',
          table: {
            type: {
              summary: 'number',
            },
          },
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Icon: {
    name: {
      name: 'name',
      description: 'The name of the icon to display from the registered list.',
      type: {
        required: true,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Icon Selection',
      },
      options: [
        'cross',
        'success',
        'error',
        'warning',
        'info',
        'dot',
        'check',
        'arrowDown',
        'arrowRight',
        'arrowLeft',
        'mobileMenu',
        'home',
        'slash',
        'arrowForward',
        'localShipping',
        'favorite',
        'favoriteOutlined',
        'deleteOutlined',
        'accountCircle',
        'shoppingBag',
        'errorOutline',
        'star',
        'starOutlined',
        'starHalf',
        'minus',
        'plus',
        'filter',
        'ruler',
        'processing',
        'paymentCard',
        'eye',
        'attachment',
        'upload',
        'folder',
        'folderOpen',
        'wifiTethering',
        'portrait',
        'search',
        'edit',
        'volumeUp',
        'contentCopy',
        'thumbUp',
        'thumbDown',
        'fileCopy',
        'keyboardArrowDown',
        'keyboardArrowUp',
        'send',
        'thumbUpFilled',
        'thumbDownFilled',
        'chat',
        'chatBubble',
        'phone',
        'mic',
        'fullscreen',
        'fullscreenExit',
      ],
      control: {
        type: 'select',
        disable: false,
      },
    },
    width: {
      name: 'width',
      description: 'Sets the width of the icon in pixels.',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Size & Dimensions',
      },
      control: {
        type: 'number',
        disable: false,
      },
    },
    height: {
      name: 'height',
      description: 'Sets the height of the icon in pixels.',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Size & Dimensions',
      },
      control: {
        type: 'number',
        disable: false,
      },
    },
    fill: {
      name: 'fill',
      description: 'Sets the `fill` color for specific paths within the SVG that are designed to inherit it.',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'currentColor',
        },
        category: 'Styling & Colors',
      },
      control: {
        type: 'color',
        disable: false,
      },
    },
    fillSvg: {
      name: 'fillSvg',
      description: 'Sets the `fill` color of the SVG element itself. Useful for single-color icons.',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'none',
        },
        category: 'Styling & Colors',
      },
      control: {
        type: 'color',
        disable: false,
      },
    },
    onClick: {
      name: 'onClick',
      description:
        'Event handler for click events on the icon. Listen for the native "click" event with addEventListener().',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      table: {
        type: {
          summary: 'Event ("click")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Interactions',
      },
      action: 'clicked',
      control: {
        disable: true,
      },
    },
    size: {
      name: 'size',
      description: 'Predefined size variants that set both width and height according to the theme configuration.',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<SizeVariant>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'SizeVariant',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Size & Dimensions',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      control: {
        type: 'select',
        disable: false,
      },
    },
    minWidth: {
      name: 'minWidth',
      description: 'CSS min-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxWidth: {
      name: 'maxWidth',
      description: 'CSS max-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minHeight: {
      name: 'minHeight',
      description: 'CSS min-height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxHeight: {
      name: 'maxHeight',
      description: 'CSS max-height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    margin: {
      name: 'margin',
      description: 'CSS margin property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginTop: {
      name: 'marginTop',
      description: 'CSS margin-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginRight: {
      name: 'marginRight',
      description: 'CSS margin-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginBottom: {
      name: 'marginBottom',
      description: 'CSS margin-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginLeft: {
      name: 'marginLeft',
      description: 'CSS margin-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    padding: {
      name: 'padding',
      description: 'CSS padding property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingTop: {
      name: 'paddingTop',
      description: 'CSS padding-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingRight: {
      name: 'paddingRight',
      description: 'CSS padding-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingBottom: {
      name: 'paddingBottom',
      description: 'CSS padding-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingLeft: {
      name: 'paddingLeft',
      description: 'CSS padding-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexDirection: {
      name: 'flexDirection',
      description: 'CSS flex-direction property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifyContent: {
      name: 'justifyContent',
      description: 'CSS justify-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignItems: {
      name: 'alignItems',
      description: 'CSS align-items property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignContent: {
      name: 'alignContent',
      description: 'CSS align-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexWrap: {
      name: 'flexWrap',
      description: 'CSS flex-wrap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    gap: {
      name: 'gap',
      description: 'CSS gap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flex: {
      name: 'flex',
      description: 'CSS flex property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexGrow: {
      name: 'flexGrow',
      description: 'CSS flex-grow property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexShrink: {
      name: 'flexShrink',
      description: 'CSS flex-shrink property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexBasis: {
      name: 'flexBasis',
      description: 'CSS flex-basis property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignSelf: {
      name: 'alignSelf',
      description: 'CSS align-self property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifySelf: {
      name: 'justifySelf',
      description: 'CSS justify-self property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    order: {
      name: 'order',
      description: 'CSS order property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    position: {
      name: 'position',
      description: 'CSS position property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    top: {
      name: 'top',
      description: 'CSS top property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    right: {
      name: 'right',
      description: 'CSS right property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    bottom: {
      name: 'bottom',
      description: 'CSS bottom property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    left: {
      name: 'left',
      description: 'CSS left property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    overflow: {
      name: 'overflow',
      description: 'CSS overflow property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    zIndex: {
      name: 'zIndex',
      description: 'CSS z-index property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    border: {
      name: 'border',
      description: 'CSS border property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom styles object for the icon',
      table: {
        category: 'Custom Styling',
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  InputFile: {
    accept: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'accept',
      type: {
        name: 'string',
        value: {},
        required: false,
      },
      description: 'Accepted file types (MIME types or file extensions)',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'File Handling',
      },
      options: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc,.docx', '.txt'],
    },
    capture: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'capture',
      type: {
        name: 'union',
        value: [
          {
            name: 'boolean',
          },
          {
            name: 'other',
            value: 'literal',
          },
          {
            name: 'other',
            value: 'literal',
          },
        ],
        required: false,
        raw: "boolean | 'user' | 'environment'",
      },
      description: 'Preferred media capture method on mobile devices',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Mobile Features',
      },
      options: ['user', 'environment'],
    },
    multiple: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'multiple',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'Allow selection of multiple files',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'File Handling',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'disabled',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'Disable the input and button',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
    onClick: {
      name: 'onClick',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      action: 'button clicked',
      description: 'Called when the button is clicked Listen for the native "click" event with addEventListener().',
      table: {
        disable: true,
        type: {
          summary: 'Event ("click")',
        },
        category: 'Events',
      },
      control: {
        disable: true,
      },
    },
    onChange: {
      name: 'onChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Called when files are selected Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        disable: true,
        category: 'Events',
      },
      action: 'file(s) selected',
      control: {
        disable: true,
      },
    },
    buttonProps: {
      control: {
        type: 'object',
        disable: false,
      },
      name: 'buttonProps',
      description: 'Props to customize the Button component',
      type: {
        required: false,
        name: 'other',
        value: 'ButtonProps',
      },
      table: {
        type: {
          summary: 'ButtonProps',
          detail:
            "ButtonProps {\n            variant?: 'text' | 'outlined' | 'contained';\n            color?: 'primary' | 'secondary' | 'error';\n            iconStart?: Node | string;\n            iconEnd?: Node | string;\n            onClick?: (event: Event) => void;\n            type?: 'button' | 'submit' | 'reset';\n            disabled?: boolean;\n            fullWidth?: boolean;\n            isIcon?: boolean;\n            ariaLabel?: string;\n            ariaPressed?: boolean;\n            role?: 'button' | 'menuitem' | 'switch';\n            tabIndex?: number;\n          }",
        },
        defaultValue: {
          summary: '{}',
        },
        category: 'Button Customization',
      },
    },
    isIcon: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'isIcon',
      description: 'Render the button as an icon-only button (no text label, square sizing)',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Button Customization',
      },
    },
    styles: {
      control: {
        type: 'object',
        disable: false,
      },
      name: 'styles',
      description: 'CSS style overrides for the wrapper element',
      type: {
        required: false,
      },
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
        category: 'Styling',
      },
    },
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      description:
        'Content for the button label (text or components) Web Components provide this content through the default slot.',
      type: {
        name: 'other',
        value: 'default slot',
      },
      table: {
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'Browse Files',
        },
        category: 'Content',
      },
    },
  },
  Label: {
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description:
        'Content to be rendered inside the label Web Components provide this content through the default slot.',
      table: {
        category: 'Content',
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    onClick: {
      name: 'onClick',
      description: 'Click event handler for the label Listen for the native "click" event with addEventListener().',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      table: {
        type: {
          summary: 'Event ("click")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      action: 'clicked',
      control: {
        disable: true,
      },
    },
    ariaLabel: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'ariaLabel',
      description: 'Accessible label for screen readers',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    htmlFor: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'htmlFor',
      description: 'Associates the label with form control',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Core Properties',
      },
    },
    gap: {
      name: 'gap',
      description: 'Gap between label elements',
      table: {
        category: 'Layout & Spacing',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '4px',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    className: {
      name: 'className',
      description: 'Additional CSS classes to apply',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom inline styles to apply to the label',
      table: {
        category: 'Styling',
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Link: {
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<LinkVariant>',
        value: 'EnumOrPrimitive',
      },
      description: 'Visual style variant of the link',
      table: {
        type: {
          summary: 'LinkVariant',
        },
        defaultValue: {
          summary: 'LinkVariant.Primary',
        },
        category: 'Core Properties',
      },
      options: ['primary', 'secondary', 'inverted', 'inherit'],
    },
    rel: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'rel',
      type: {
        name: 'union',
        required: false,
        raw: 'EnumOrPrimitive<LinkRel> | string',
        value: [
          {
            raw: 'EnumOrPrimitive<LinkRel>',
            name: 'other',
            value: 'EnumOrPrimitive',
          },
          {
            name: 'string',
          },
        ],
      },
      description: 'Relationship attribute for the link',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
        category: 'Navigation & Behavior',
      },
    },
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description:
        'Content to be rendered inside the link Web Components provide this content through the default slot.',
      table: {
        category: 'Content',
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    onClick: {
      name: 'onClick',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      description: 'Click handler for the anchor element. Listen for the native "click" event with addEventListener().',
      table: {
        type: {
          summary: 'Event ("click")',
        },
        category: 'Events',
      },
      action: 'clicked',
      control: {
        disable: true,
      },
    },
    size: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['sm', 'md', 'lg'],
      name: 'size',
      description: 'Size variant of the link text.',
      type: {
        required: false,
        raw: "'sm' | 'md' | 'lg'",
        name: 'enum',
        value: ['sm', 'md', 'lg'],
      },
      table: {
        type: {
          summary: '"sm" | "md" | "lg"',
        },
        category: 'Appearance',
      },
    },
    underline: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['default', 'highlight', 'none'],
      name: 'underline',
      description: 'Underline behavior for the link.',
      type: {
        required: false,
        raw: "'default' | 'highlight' | 'none'",
        name: 'enum',
        value: ['default', 'highlight', 'none'],
      },
      table: {
        type: {
          summary: '"default" | "highlight" | "none"',
        },
        category: 'Appearance',
      },
    },
    color: {
      control: {
        type: 'color',
      },
      name: 'color',
      description: '',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    cursor: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'cursor',
      description: 'Cursor style used when hovering the link.',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<Cursors>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'Cursors',
        },
        category: 'Appearance',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'disabled',
      description: 'Disables the link interaction',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State & Behavior',
      },
    },
    target: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'target',
      description: 'Target window behavior for the link',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<LinkTarget>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'LinkTarget',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Navigation & Behavior',
      },
      options: ['_blank', '_self', '_parent', '_top', 'framename'],
    },
    href: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'href',
      description: 'URL or destination for the link',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Core Properties',
      },
    },
    ariaLabel: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'ariaLabel',
      description: 'Accessible label announced by assistive technologies.',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        category: 'Accessibility',
      },
    },
    role: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'role',
      description: 'Explicit ARIA role for the rendered anchor.',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        category: 'Accessibility',
      },
    },
    tabindex: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'tabindex',
      description: 'Tab order for keyboard navigation.',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        category: 'Accessibility',
      },
    },
    className: {
      name: 'className',
      description: 'Additional CSS classes to apply',
      table: {
        category: 'Styling',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom inline styles to apply to the link',
      table: {
        category: 'Styling',
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Loader: {
    withWrapper: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'withWrapper',
      type: {
        name: 'boolean',
        required: false,
      },
      description:
        'Whether to wrap the loader in a container element. When false, the loader renders directly without wrapper styling. Useful for embedding loaders in buttons or other custom containers',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'true',
        },
        category: 'Layout & Positioning',
      },
    },
    name: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['circle', 'dots'],
      name: 'name',
      type: {
        name: 'enum',
        required: false,
        raw: "'circle' | 'dots'",
        value: ['circle', 'dots'],
      },
      description:
        'Type of loader animation to display. "circle" provides a smooth rotating animation, while "dots" offers a rhythmic pulsing sequence',
      table: {
        type: {
          summary: '"circle" | "dots"',
        },
        defaultValue: {
          summary: 'circle',
        },
        category: 'Appearance',
      },
    },
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<WrapperVariant>',
        value: 'EnumOrPrimitive',
      },
      description:
        'Layout wrapper variant that determines positioning and container behavior. Inline: flows naturally in content, Section: absolute positioned overlay within container, FullPage: fixed position full-screen overlay with portal',
      table: {
        type: {
          summary: 'inline | section | fullPage',
        },
        defaultValue: {
          summary: 'inline',
        },
        category: 'Layout & Positioning',
      },
      options: ['inline', 'section', 'fullPage'],
    },
    size: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'size',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<SizeVariant>',
        value: 'EnumOrPrimitive',
      },
      description:
        'Size variant of the loader. Controls both the loader animation size and wrapper dimensions. Available sizes: xs, sm, md (default), lg, xl',
      table: {
        type: {
          summary: 'SizeVariant',
        },
        defaultValue: {
          summary: 'SizeVariant.Md',
        },
        category: 'Appearance',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'rounded',
      description:
        'Border radius style for the loader. Available options: none, default, round, xs, sm, md, lg, xl. Note: Only applies to "dots" animation type, not "circle"',
      type: {
        required: false,
        name: 'other',
        value: 'Rounded',
      },
      table: {
        type: {
          summary: "'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
        },
        defaultValue: {
          summary: 'none',
        },
        category: 'Appearance',
      },
      options: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    animationProps: {
      control: {
        type: 'text',
      },
      name: 'animationProps',
      description:
        'Custom CSS animation properties string. Overrides default animation timing and easing for advanced customization. Use sparingly—prefer size and variant props for standard use cases',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'BASE_ANIMATION',
        },
        category: 'Content & Customization',
      },
    },
    WrapperView: {
      control: {
        type: 'object',
      },
      name: 'WrapperView',
      description:
        'HTML element type or custom elements to use for the wrapper container. Defaults to "span" for inline usage. Use semantic elements like "div", "section", or custom components for better accessibility Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: 'keyof HTMLElementTagNameMap',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'HTMLElementTagNameMap',
          },
          {
            name: 'other',
            value: 'keyof HTMLElementTagNameMap',
          },
        ],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
        defaultValue: {
          summary: 'span',
        },
        category: 'Layout & Positioning',
      },
    },
    children: {
      name: 'children',
      description:
        'Custom slotted content to replace the default loader animation. Use this to create custom loading indicators while maintaining Loader wrapper and positioning functionality Web Components provide this content through the default slot.',
      table: {
        category: 'Content & Customization',
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'default slot',
      },
    },
    styles: {
      name: 'styles',
      description:
        'Custom CSS styles object to override default theme tokens. Use for one-off styling needs. Prefer theme tokens and component props for consistent design system styling',
      table: {
        category: 'Custom Styling',
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
      },
    },
    className: {
      name: 'className',
      description:
        'Additional CSS class names to apply to the loader element. Use for custom styling, state management, or integration with CSS frameworks',
      table: {
        category: 'Custom Styling',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '""',
        },
      },
    },
  },
  Badge: {
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description: 'Badge content (text or elements) Web Components provide this content through the default slot.',
      table: {
        category: 'Content',
        type: {
          summary: 'default slot',
        },
      },
    },
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      description: 'Visual style variant of the badge',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<BadgeVariant>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'BadgeVariant',
        },
        defaultValue: {
          summary: 'primary',
        },
        category: 'Visual Style',
      },
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'],
    },
    disabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'disabled',
      description: 'Whether the badge is disabled',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Visual Style',
      },
    },
    appearance: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'appearance',
      description: 'Visual appearance/style of the badge (filled, filledLight, outline, outlineFilledLight)',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<BadgeAppearance>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'BadgeAppearance',
        },
        defaultValue: {
          summary: 'filled',
        },
        category: 'Visual Style',
      },
      options: ['outline', 'outlineFilledLight', 'filled', 'filledLight'],
    },
    size: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'size',
      description: 'Size of the badge (xs, sm, md, lg)',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<BadgeSize>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'BadgeSize',
        },
        defaultValue: {
          summary: 'md',
        },
        category: 'Visual Style',
      },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    iconStart: {
      control: {
        disable: true,
      },
      name: 'iconStart',
      description:
        'Icon element to display at the start of the badge Web Components provide this content through the slot="icon-start".',
      type: {
        name: 'other',
        value: 'slot="icon-start"',
      },
      table: {
        type: {
          summary: 'slot="icon-start"',
        },
        category: 'Icons',
      },
    },
    iconEnd: {
      control: {
        disable: true,
      },
      name: 'iconEnd',
      description:
        'Icon element to display at the end of the badge Web Components provide this content through the slot="icon-end".',
      type: {
        name: 'other',
        value: 'slot="icon-end"',
      },
      table: {
        type: {
          summary: 'slot="icon-end"',
        },
        category: 'Icons',
      },
    },
    styles: {
      name: 'styles',
      description: 'CSSObject for custom inline styles',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'CSSObject',
        },
      },
      control: {
        disable: true,
      },
    },
    display: {
      name: 'display',
      description: 'CSS display property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    overflow: {
      name: 'overflow',
      description: 'CSS overflow property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minWidth: {
      name: 'minWidth',
      description: 'CSS min-width property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    width: {
      name: 'width',
      description: 'CSS width property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxWidth: {
      name: 'maxWidth',
      description: 'CSS max-width property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minHeight: {
      name: 'minHeight',
      description: 'CSS min-height property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    height: {
      name: 'height',
      description: 'CSS height property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxHeight: {
      name: 'maxHeight',
      description: 'CSS max-height property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    margin: {
      name: 'margin',
      description: 'CSS margin property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginTop: {
      name: 'marginTop',
      description: 'CSS margin-top property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginRight: {
      name: 'marginRight',
      description: 'CSS margin-right property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginBottom: {
      name: 'marginBottom',
      description: 'CSS margin-bottom property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginLeft: {
      name: 'marginLeft',
      description: 'CSS margin-left property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    padding: {
      name: 'padding',
      description: 'CSS padding property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingTop: {
      name: 'paddingTop',
      description: 'CSS padding-top property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingRight: {
      name: 'paddingRight',
      description: 'CSS padding-right property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingBottom: {
      name: 'paddingBottom',
      description: 'CSS padding-bottom property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingLeft: {
      name: 'paddingLeft',
      description: 'CSS padding-left property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    zIndex: {
      name: 'zIndex',
      description: 'CSS z-index property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    position: {
      name: 'position',
      description: 'CSS position property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    top: {
      name: 'top',
      description: 'CSS top property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    right: {
      name: 'right',
      description: 'CSS right property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    bottom: {
      name: 'bottom',
      description: 'CSS bottom property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    left: {
      name: 'left',
      description: 'CSS left property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexDirection: {
      name: 'flexDirection',
      description: 'CSS flex-direction property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifyContent: {
      name: 'justifyContent',
      description: 'CSS justify-content property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifySelf: {
      name: 'justifySelf',
      description: 'CSS justify-self property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignItems: {
      name: 'alignItems',
      description: 'CSS align-items property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignSelf: {
      name: 'alignSelf',
      description: 'CSS align-self property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignContent: {
      name: 'alignContent',
      description: 'CSS align-content property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexWrap: {
      name: 'flexWrap',
      description: 'CSS flex-wrap property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flex: {
      name: 'flex',
      description: 'CSS flex property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexGrow: {
      name: 'flexGrow',
      description: 'CSS flex-grow property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexShrink: {
      name: 'flexShrink',
      description: 'CSS flex-shrink property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexBasis: {
      name: 'flexBasis',
      description: 'CSS flex-basis property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    order: {
      name: 'order',
      description: 'CSS order property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    gap: {
      name: 'gap',
      description: 'CSS gap property',
      table: {
        category: 'Box Styles',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
  },
  Box: {
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['horizontal', 'vertical'],
      name: 'variant',
      type: {
        name: 'enum',
        required: false,
        raw: "'horizontal' | 'vertical'",
        value: ['horizontal', 'vertical'],
      },
      description: 'Box orientation variant',
      table: {
        type: {
          summary: "'horizontal' | 'vertical'",
        },
        defaultValue: {
          summary: 'vertical',
        },
        category: 'Core Props',
      },
    },
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description: 'Box content (any DOM nodes) Web Components provide this content through the default slot.',
      table: {
        category: 'Core Props',
        type: {
          summary: 'default slot',
        },
      },
    },
    padding: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'padding',
      type: {
        name: 'string',
      },
      description: 'CSS padding property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
    },
    isBordered: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'isBordered',
      description: 'Adds border to the box',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Visual Style',
      },
    },
    isHighlighted: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'isHighlighted',
      description: 'Enables highlight effect on hover (adds outline on hover)',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Visual Style',
      },
    },
    withShadowHover: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'withShadowHover',
      description: 'Adds box shadow on hover for elevation effect',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Visual Style',
      },
    },
    tabIndex: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'tabIndex',
      description: 'Tab index for keyboard navigation',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<TabIndex>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
        category: 'Accessibility',
      },
    },
    width: {
      name: 'width',
      description: 'CSS width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    height: {
      name: 'height',
      description: 'CSS height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minWidth: {
      name: 'minWidth',
      description: 'CSS min-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minHeight: {
      name: 'minHeight',
      description: 'CSS min-height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxWidth: {
      name: 'maxWidth',
      description: 'CSS max-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxHeight: {
      name: 'maxHeight',
      description: 'CSS max-height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingTop: {
      name: 'paddingTop',
      description: 'CSS padding-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingRight: {
      name: 'paddingRight',
      description: 'CSS padding-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingBottom: {
      name: 'paddingBottom',
      description: 'CSS padding-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingLeft: {
      name: 'paddingLeft',
      description: 'CSS padding-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    margin: {
      name: 'margin',
      description: 'CSS margin property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginTop: {
      name: 'marginTop',
      description: 'CSS margin-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginRight: {
      name: 'marginRight',
      description: 'CSS margin-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginBottom: {
      name: 'marginBottom',
      description: 'CSS margin-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginLeft: {
      name: 'marginLeft',
      description: 'CSS margin-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexDirection: {
      name: 'flexDirection',
      description: 'CSS flex-direction property',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
    justifyContent: {
      name: 'justifyContent',
      description: 'CSS justify-content property',
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
    alignItems: {
      name: 'alignItems',
      description: 'CSS align-items property',
      options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
    alignContent: {
      name: 'alignContent',
      description: 'CSS align-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexWrap: {
      name: 'flexWrap',
      description: 'CSS flex-wrap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    gap: {
      name: 'gap',
      description: 'CSS gap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flex: {
      name: 'flex',
      description: 'CSS flex property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexGrow: {
      name: 'flexGrow',
      description: 'CSS flex-grow property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexShrink: {
      name: 'flexShrink',
      description: 'CSS flex-shrink property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexBasis: {
      name: 'flexBasis',
      description: 'CSS flex-basis property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    position: {
      name: 'position',
      description: 'CSS position property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    overflow: {
      name: 'overflow',
      description: 'CSS overflow property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom styles object',
      table: {
        category: 'Custom Styling',
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Image: {
    width: {
      control: {
        type: 'number',
      },
      name: 'width',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Width of the image in pixels',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Dimensions',
      },
    },
    height: {
      control: {
        type: 'number',
      },
      name: 'height',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Height of the image in pixels',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Dimensions',
      },
    },
    alt: {
      control: {
        type: 'text',
      },
      name: 'alt',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Alternative text for the image',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'required',
        },
        category: 'Core Properties',
      },
    },
    src: {
      control: {
        type: 'text',
      },
      name: 'src',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Source URL of the image',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'required',
        },
        category: 'Core Properties',
      },
    },
    id: {
      control: {
        type: 'text',
      },
      name: 'id',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Unique identifier for the image',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Core Properties',
      },
    },
    className: {
      control: {
        type: 'text',
      },
      name: 'className',
      type: {
        name: 'string',
      },
      description: 'Additional CSS classes to apply',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Styling',
      },
    },
    placeholder: {
      control: {
        disable: true,
      },
      name: 'placeholder',
      type: {
        name: 'other',
        value: 'slot="placeholder"',
      },
      description:
        'Text to display while image is loading Web Components provide this content through the slot="placeholder".',
      table: {
        type: {
          summary: 'slot="placeholder"',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Content & Display',
      },
    },
    caption: {
      control: {
        type: 'text',
      },
      name: 'caption',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Caption text to display below the image',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Content & Display',
      },
    },
    onClick: {
      name: 'onClick',
      description: 'Click event handler for the image Listen for the native "click" event with addEventListener().',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      table: {
        type: {
          summary: 'Event ("click")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      control: {
        disable: true,
      },
    },
    onError: {
      name: 'onError',
      description: 'Error event handler when image fails to load',
      type: {
        required: false,
        raw: '() => void',
        name: 'function',
      },
      table: {
        type: {
          summary: '() => void',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
    },
    onLoad: {
      name: 'onLoad',
      description: 'Load event handler when image successfully loads',
      type: {
        required: false,
        raw: '() => void',
        name: 'function',
      },
      table: {
        type: {
          summary: '() => void',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
    },
    fallbackComponent: {
      control: {
        disable: true,
      },
      name: 'fallbackComponent',
      description:
        'Component to display when image fails to load Web Components provide this content through the slot="fallback".',
      type: {
        name: 'other',
        value: 'slot="fallback"',
      },
      table: {
        type: {
          summary: 'slot="fallback"',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Content & Display',
      },
    },
    objectFit: {
      control: {
        type: 'radio',
      },
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      name: 'objectFit',
      description: 'CSS object-fit property for image scaling',
      type: {
        required: false,
        raw: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'",
        name: 'enum',
        value: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Styling',
      },
    },
    as: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'as',
      description:
        'Polymorphic prop that changes the rendered wrapper element while preserving all Image styles. Accepts HTML tag names (e.g., "div", "span", "figure") or custom elements. Useful for semantic HTML and accessibility. Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: 'keyof HTMLElementTagNameMap',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'HTMLElementTagNameMap',
          },
          {
            name: 'other',
            value: 'keyof HTMLElementTagNameMap',
          },
        ],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
        defaultValue: {
          summary: 'div',
        },
        category: 'Core Properties',
      },
    },
    captionAs: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'captionAs',
      description:
        'Polymorphic prop that changes the rendered caption element while preserving all Image caption styles. Accepts HTML tag names (e.g., "figcaption", "p", "span") or custom elements. Defaults to "figcaption" for semantic HTML. Useful for custom caption styling or when not using semantic figure/caption structure. Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: 'keyof HTMLElementTagNameMap',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'HTMLElementTagNameMap',
          },
          {
            name: 'other',
            value: 'keyof HTMLElementTagNameMap',
          },
        ],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
        defaultValue: {
          summary: 'figcaption',
        },
        category: 'Core Properties',
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom CSS styles object',
      table: {
        type: {
          summary: 'CSSObject',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Styling',
      },
    },
  },
  Avatar: {
    backgroundColor: {
      control: {
        type: 'color',
        disable: false,
      },
      name: 'backgroundColor',
      type: {
        name: 'string',
        required: false,
      },
      description:
        'The background color of the avatar when no image is loaded, or when the image fails. Also used for the fallback content container.  Accepts CSS color values (e.g., hex, named colors) and  supports theme colors (e.g. `primary.default`).',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Appearance',
      },
    },
    src: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'src',
      type: {
        name: 'string',
      },
      description:
        'The URL of the image to display in the avatar. If no `src` is provided or the image fails to load, the `fallback` content will be rendered.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Image',
      },
    },
    sizeVariant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'sizeVariant',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<SizeVariant>',
        value: 'EnumOrPrimitive',
      },
      description: 'Defines the predefined size of the avatar.',
      table: {
        type: {
          summary: 'SizeVariant',
        },
        defaultValue: {
          summary: 'md',
        },
        category: 'Appearance',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    withBadge: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'withBadge',
      description:
        'If `true`, a small badge will be displayed at the top-right corner of the avatar, often indicating online status or notifications.',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Badge',
      },
    },
    badgeColor: {
      control: {
        type: 'color',
        disable: false,
      },
      name: 'badgeColor',
      description:
        'The color of the badge when `withBadge` is `true`. Accepts CSS color values (e.g., hex, named colors). Also supports theme colors (e.g. `primary.default`)',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '#34A853',
        },
        category: 'Badge',
      },
    },
    fallbackComponent: {
      control: {
        disable: true,
      },
      name: 'fallbackComponent',
      description:
        'Content to display when `src` is not provided or the image fails to load. Can be a string, number, or any Node | string (e.g., an icon, initials, or a custom component). Web Components provide this content through the slot="fallback".',
      type: {
        name: 'other',
        value: 'slot="fallback"',
      },
      table: {
        type: {
          summary: 'slot="fallback"',
        },
        category: 'Fallback',
      },
    },
    onClick: {
      name: 'onClick',
      description:
        'Callback function triggered when the avatar is clicked. Listen for the native "click" event with addEventListener().',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      table: {
        type: {
          summary: 'Event ("click")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      action: 'clicked',
      control: {
        disable: true,
      },
    },
    alt: {
      name: 'alt',
      description:
        'Alternative text for the avatar image, important for accessibility. This will be used as the `aria-label` for the avatar.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '""',
        },
        category: 'Image',
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    id: {
      name: 'id',
      description: 'A unique identifier for the avatar element.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Core',
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    className: {
      name: 'className',
      description: 'Additional CSS class names to apply to the avatar component.',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Styling',
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    placeholder: {
      name: 'placeholder',
      description:
        'Passed to the internal `Image` component. Web Components provide this content through the slot="placeholder".',
      table: {
        type: {
          summary: 'slot="placeholder"',
        },
        category: 'Image',
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'slot="placeholder"',
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom CSS-in-JS styles to apply to the top-level container of the Avatar.',
      table: {
        type: {
          summary: 'CSSObject',
        },
        defaultValue: {
          summary: '{}',
        },
        category: 'Styling',
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Button: {
    variant: {
      name: 'variant',
      description: 'Visual style variant of the button',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<ButtonVariant>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'ButtonVariant',
        },
        defaultValue: {
          summary: 'primary',
        },
        category: 'Visual Style',
      },
      options: ['primary', 'secondary', 'tertiary', 'outlined', 'text', 'inherit'],
      control: {
        type: 'select',
        disable: false,
      },
    },
    rounded: {
      name: 'rounded',
      description: 'Border radius style for the button',
      type: {
        required: false,
        name: 'other',
        value: 'Rounded',
      },
      table: {
        type: {
          summary: "'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
        },
        defaultValue: {
          summary: 'none',
        },
        category: 'Visual Style',
      },
      options: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
      control: {
        type: 'select',
        disable: false,
      },
    },
    iconStart: {
      name: 'iconStart',
      description:
        'Icon element to display at the start of the button Web Components provide this content through the slot="icon-start".',
      type: {
        name: 'other',
        value: 'slot="icon-start"',
      },
      table: {
        type: {
          summary: 'slot="icon-start"',
        },
        category: 'Icons',
      },
      control: {
        disable: true,
      },
    },
    iconEnd: {
      name: 'iconEnd',
      description:
        'Icon element to display at the end of the button Web Components provide this content through the slot="icon-end".',
      type: {
        name: 'other',
        value: 'slot="icon-end"',
      },
      table: {
        type: {
          summary: 'slot="icon-end"',
        },
        category: 'Icons',
      },
      control: {
        disable: true,
      },
    },
    onClick: {
      name: 'onClick',
      description: 'Click event handler Listen for the native "click" event with addEventListener().',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      table: {
        type: {
          summary: 'Event ("click")',
        },
        category: 'Content & Behavior',
      },
      action: 'clicked',
      control: {
        disable: true,
      },
    },
    type: {
      name: 'type',
      description: 'HTML button type attribute',
      type: {
        required: false,
        raw: 'ButtonTypes | `${ButtonTypes}`',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'ButtonTypes',
          },
          {
            name: 'other',
            value: 'literal',
          },
        ],
      },
      table: {
        type: {
          summary: 'ButtonTypes',
        },
        defaultValue: {
          summary: 'button',
        },
        category: 'Content & Behavior',
      },
      options: ['button', 'submit', 'reset'],
      control: {
        type: 'select',
        disable: false,
      },
    },
    disabled: {
      name: 'disabled',
      description: 'Disables the button and prevents interaction',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Content & Behavior',
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    fullWidth: {
      name: 'fullWidth',
      description: 'Makes button take full width of its container',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Visual Style',
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    isIcon: {
      name: 'isIcon',
      description: 'Renders button as icon-only with equal width and height',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Visual Style',
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    isLoading: {
      name: 'isLoading',
      description: '',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
      },
    },
    ariaLabel: {
      name: 'ariaLabel',
      description: 'Accessibility label for screen readers',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        category: 'Accessibility',
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    ariaPressed: {
      name: 'ariaPressed',
      description: 'Indicates the pressed state for toggle buttons',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        category: 'Accessibility',
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    role: {
      name: 'role',
      description: 'ARIA role for the button',
      type: {
        required: false,
        raw: 'ButtonRole | `${ButtonRole}`',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'ButtonRole',
          },
          {
            name: 'other',
            value: 'literal',
          },
        ],
      },
      table: {
        type: {
          summary: 'ButtonRole',
        },
        defaultValue: {
          summary: 'button',
        },
        category: 'Accessibility',
      },
      options: ['button', 'link', 'checkbox', 'switch', 'tab'],
      control: {
        type: 'select',
        disable: false,
      },
    },
    tabIndex: {
      name: 'tabIndex',
      description: 'Tab index for keyboard navigation',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
        category: 'Accessibility',
      },
      control: {
        type: 'number',
        disable: false,
      },
    },
    children: {
      name: 'children',
      description: 'Button content (text or elements) Web Components provide this content through the default slot.',
      table: {
        category: 'Content & Behavior',
        type: {
          summary: 'default slot',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'default slot',
      },
    },
    width: {
      name: 'width',
      description: 'CSS width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    height: {
      name: 'height',
      description: 'CSS height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minWidth: {
      name: 'minWidth',
      description: 'CSS min-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minHeight: {
      name: 'minHeight',
      description: 'CSS min-height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxWidth: {
      name: 'maxWidth',
      description: 'CSS max-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxHeight: {
      name: 'maxHeight',
      description: 'CSS max-height property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    margin: {
      name: 'margin',
      description: 'CSS margin property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginTop: {
      name: 'marginTop',
      description: 'CSS margin-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginRight: {
      name: 'marginRight',
      description: 'CSS margin-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginBottom: {
      name: 'marginBottom',
      description: 'CSS margin-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginLeft: {
      name: 'marginLeft',
      description: 'CSS margin-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    padding: {
      name: 'padding',
      description: 'CSS padding property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingTop: {
      name: 'paddingTop',
      description: 'CSS padding-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingRight: {
      name: 'paddingRight',
      description: 'CSS padding-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingBottom: {
      name: 'paddingBottom',
      description: 'CSS padding-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingLeft: {
      name: 'paddingLeft',
      description: 'CSS padding-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexDirection: {
      name: 'flexDirection',
      description: 'CSS flex-direction property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifyContent: {
      name: 'justifyContent',
      description: 'CSS justify-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignItems: {
      name: 'alignItems',
      description: 'CSS align-items property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignContent: {
      name: 'alignContent',
      description: 'CSS align-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexWrap: {
      name: 'flexWrap',
      description: 'CSS flex-wrap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    gap: {
      name: 'gap',
      description: 'CSS gap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flex: {
      name: 'flex',
      description: 'CSS flex property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexGrow: {
      name: 'flexGrow',
      description: 'CSS flex-grow property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexShrink: {
      name: 'flexShrink',
      description: 'CSS flex-shrink property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexBasis: {
      name: 'flexBasis',
      description: 'CSS flex-basis property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignSelf: {
      name: 'alignSelf',
      description: 'CSS align-self property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifySelf: {
      name: 'justifySelf',
      description: 'CSS justify-self property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    order: {
      name: 'order',
      description: 'CSS order property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    display: {
      name: 'display',
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property to control the layout behavior',
      table: {
        type: {
          summary: 'string',
        },
        category: 'Box Styles - Position & Display',
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
    position: {
      name: 'position',
      description: 'CSS position property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    top: {
      name: 'top',
      description: 'CSS top property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    right: {
      name: 'right',
      description: 'CSS right property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    bottom: {
      name: 'bottom',
      description: 'CSS bottom property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    left: {
      name: 'left',
      description: 'CSS left property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    overflow: {
      name: 'overflow',
      description: 'CSS overflow property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    zIndex: {
      name: 'zIndex',
      description: 'CSS z-index property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom styles object for the button',
      table: {
        category: 'Custom Styling',
        type: {
          summary: 'BoxCssComponentProps<HTMLButtonElement>',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
    className: {
      name: 'className',
      description: 'Custom CSS class names',
      table: {
        category: 'Custom Styling, predefined classes hover, active, and disabled',
        type: {
          summary: '("hover" | "active" | "disabled" | string)[]',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
  },
  Checkbox: {
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      description:
        'Label content displayed next to the checkbox Web Components provide this content through the default slot.',
      table: {
        type: {
          summary: 'default slot',
        },
        category: 'Content',
      },
    },
    onValueChange: {
      name: 'onValueChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Callback fired when the checkbox value changes Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      action: 'Checkbox value changed',
      control: {
        disable: true,
      },
    },
    checked: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'checked',
      description: 'Controls the checked state of the checkbox',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
    indeterminate: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'indeterminate',
      description: 'Displays the checkbox in an indeterminate (mixed) state',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'disabled',
      description: 'Disables the checkbox interaction',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State',
      },
    },
    name: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'name',
      description: 'Name attribute of the checkbox input',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Identification',
      },
    },
    value: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'value',
      description: 'Value attribute of the checkbox input',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Identification',
      },
    },
    size: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['sm', 'md'],
      name: 'size',
      description: 'Size of the checkbox',
      type: {
        required: false,
        raw: "'sm' | 'md'",
        name: 'enum',
        value: ['sm', 'md'],
      },
      table: {
        type: {
          summary: 'CheckboxSize',
          detail: 'sm | md',
        },
        defaultValue: {
          summary: 'md',
        },
        category: 'Layout',
      },
    },
  },
  Input: {
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Input field type variant',
      table: {
        type: {
          summary: 'InputVariantType',
        },
        defaultValue: {
          summary: 'text',
        },
        category: 'Core Properties',
      },
      options: [
        'text',
        'password',
        'email',
        'search',
        'url',
        'tel',
        'date',
        'time',
        'month',
        'week',
        'color',
        'range',
        'number',
        'radio',
        'checkbox',
      ],
    },
    color: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'color',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Color variant of the input',
      table: {
        type: {
          summary: 'InputColorVariant',
        },
        defaultValue: {
          summary: "'primary'",
        },
        category: 'Appearance & Styling',
      },
      options: ['primary', 'success', 'warning', 'error'],
    },
    role: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'role',
      type: {
        name: 'string',
      },
      description: 'ARIA role of the input element',
      options: ['textbox', 'spinbutton', 'checkbox', 'radio', 'radiogroup', 'combobox'],
      table: {
        category: 'Accessibility',
        defaultValue: {
          summary: 'textbox',
        },
        type: {
          summary: 'InputRole',
        },
      },
    },
    name: {
      control: {
        type: 'text',
      },
      name: 'name',
      type: {
        name: 'string',
      },
      description: 'Input field name attribute',
      table: {
        category: 'Core Properties',
        defaultValue: {
          summary: 'input',
        },
        type: {
          summary: 'string',
        },
      },
    },
    width: {
      control: {
        type: 'text',
      },
      name: 'width',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Width of the input field',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '100%',
        },
        category: 'Appearance & Styling',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      name: 'disabled',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'Disabled state of the input',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State & Behavior',
      },
    },
    required: {
      control: {
        type: 'boolean',
      },
      name: 'required',
      type: {
        name: 'boolean',
      },
      description: 'Required state of the input',
      table: {
        category: 'State & Behavior',
        defaultValue: {
          summary: 'false',
        },
        type: {
          summary: 'boolean',
        },
      },
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
      name: 'readOnly',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'Read-only state of the input',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'State & Behavior',
      },
    },
    checked: {
      control: {
        type: 'boolean',
      },
      name: 'checked',
      type: {
        name: 'boolean',
      },
      description: 'Checked state for checkbox/radio inputs',
      table: {
        category: 'State & Behavior',
        defaultValue: {
          summary: 'false',
        },
        type: {
          summary: 'boolean',
        },
      },
    },
    placeholder: {
      control: {
        disable: true,
      },
      name: 'placeholder',
      type: {
        name: 'other',
        value: 'slot="placeholder"',
      },
      description: 'Placeholder text Web Components provide this content through the slot="placeholder".',
      table: {
        category: 'Content & Labels',
        defaultValue: {
          summary: 'placeholder',
        },
        type: {
          summary: 'slot="placeholder"',
        },
      },
    },
    defaultValue: {
      control: {
        type: 'text',
      },
      name: 'defaultValue',
      type: {
        name: 'string',
      },
      description: 'Default value of the input',
      table: {
        category: 'Content & Labels',
        defaultValue: {
          summary: 'defaultValue',
        },
        type: {
          summary: 'string',
        },
      },
    },
    tabIndex: {
      control: {
        type: 'number',
      },
      name: 'tabIndex',
      type: {
        name: 'number',
        required: false,
      },
      description: 'Tab index for keyboard navigation',
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
        category: 'Accessibility',
      },
    },
    className: {
      control: {
        type: 'text',
      },
      name: 'className',
      type: {
        name: 'string',
        required: false,
      },
      description: 'Additional CSS classes',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
        category: 'Appearance & Styling',
      },
    },
    ariaRequired: {
      control: {
        type: 'boolean',
      },
      name: 'ariaRequired',
      type: {
        name: 'boolean',
        required: false,
      },
      description: 'ARIA required attribute',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Accessibility',
      },
    },
    debounceCallbackTime: {
      control: {
        type: 'number',
      },
      name: 'debounceCallbackTime',
      type: {
        name: 'number',
      },
      description: 'Debounce timeout for onChange callback',
      table: {
        category: 'State & Behavior',
        defaultValue: {
          summary: '300',
        },
        type: {
          summary: 'number',
        },
      },
    },
    styles: {
      control: {
        type: 'object',
      },
      name: 'styles',
      type: {
        name: 'object',
        value: {},
        required: false,
      },
      description: 'Custom styles object',
      table: {
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
        category: 'Appearance & Styling',
      },
    },
    adornmentStart: {
      control: {
        disable: true,
      },
      name: 'adornmentStart',
      type: {
        name: 'other',
        value: 'slot="adornment-start"',
      },
      description: 'Start adornment element Web Components provide this content through the slot="adornment-start".',
      table: {
        type: {
          summary: 'slot="adornment-start"',
        },
        defaultValue: {
          summary: '',
        },
        category: 'Content & Labels',
      },
    },
    adornmentEnd: {
      control: {
        disable: true,
      },
      name: 'adornmentEnd',
      type: {
        name: 'other',
        value: 'slot="adornment-end"',
      },
      description: 'End adornment element Web Components provide this content through the slot="adornment-end".',
      table: {
        type: {
          summary: 'slot="adornment-end"',
        },
        defaultValue: {
          summary: '',
        },
        category: 'Content & Labels',
      },
    },
    label: {
      control: {
        type: 'object',
      },
      name: 'label',
      type: {
        name: 'other',
        required: false,
        value: 'Node | string',
      },
      description: 'Input label text',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
        category: 'Content & Labels',
      },
    },
    helperText: {
      control: {
        type: 'object',
      },
      name: 'helperText',
      type: {
        name: 'other',
        required: false,
        value: 'Node | string',
      },
      description: 'Helper text below input',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '',
        },
        category: 'Content & Labels',
      },
    },
    onChange: {
      name: 'onChange',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'onChange event handler Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        category: 'Events',
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
      },
      control: {
        disable: true,
      },
    },
    onFocus: {
      name: 'onFocus',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      description: 'onFocus event handler Listen for the native "focus" event with addEventListener().',
      table: {
        category: 'Events',
        type: {
          summary: 'Event ("focus")',
        },
      },
      control: {
        disable: true,
      },
    },
    onBlur: {
      name: 'onBlur',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      description: 'onBlur event handler Listen for the native "blur" event with addEventListener().',
      table: {
        category: 'Events',
        type: {
          summary: 'Event ("blur")',
        },
      },
      control: {
        disable: true,
      },
    },
    onClick: {
      name: 'onClick',
      type: {
        name: 'function',
        value: 'EventListener',
      },
      description: 'onClick event handler Listen for the native "click" event with addEventListener().',
      table: {
        category: 'Events',
        type: {
          summary: 'Event ("click")',
        },
      },
      control: {
        disable: true,
      },
    },
    wrapperAs: {
      control: {
        type: 'object',
      },
      name: 'wrapperAs',
      description: 'HTML element or component to wrap the input Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: 'keyof HTMLElementTagNameMap',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'HTMLElementTagNameMap',
          },
          {
            name: 'other',
            value: 'keyof HTMLElementTagNameMap',
          },
        ],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
        defaultValue: {
          summary: 'label',
        },
        category: 'Core Properties',
      },
    },
    ariaDescribedBy: {
      name: 'ariaDescribedBy',
      description: 'ARIA describedby attribute',
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
  },
  Select: {
    items: {
      name: 'items',
      description: 'Array of items to be displayed in the select dropdown',
      table: {
        category: 'Core',
        type: {
          summary: '(never | Option)[]',
          detail: 'Option { name: string;  value: unknown; }',
        },
        defaultValue: {
          summary: '[]',
        },
      },
    },
    value: {
      name: 'value',
      description: 'Currently selected value (Option for single select, Option[] for multiple select)',
      table: {
        category: 'Core',
        type: {
          summary: 'Option | Option[] | null',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    multiple: {
      name: 'multiple',
      description: 'Enable multiple selection mode',
      table: {
        category: 'Core',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
      control: {
        type: 'boolean',
        disable: false,
      },
    },
    placeholder: {
      name: 'placeholder',
      description:
        'Text to display when no value is selected Web Components provide this content through the slot="placeholder".',
      table: {
        category: 'Core',
        type: {
          summary: 'slot="placeholder"',
        },
        defaultValue: {
          summary: 'Select',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'slot="placeholder"',
      },
    },
    onSelect: {
      name: 'onSelect',
      description:
        'Callback when item is selected Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      action: 'selected',
      table: {
        category: 'Events',
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
    },
    onChange: {
      name: 'onChange',
      description:
        'Callback fired when value changes (receives Option for single select, Option[] for multiple select) Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        category: 'Events',
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
    },
    onKeyDown: {
      name: 'onKeyDown',
      description: 'Callback fired on keyboard events Listen for the native "keydown" event with addEventListener().',
      table: {
        category: 'Events',
        type: {
          summary: 'Event ("keydown")',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'function',
        value: 'EventListener',
      },
    },
    onInitiatorClick: {
      name: 'onInitiatorClick',
      description: 'Callback fired when initiator is clicked',
      table: {
        category: 'Events',
        type: {
          summary: '(event: Event) => void',
        },
      },
    },
    renderOption: {
      name: 'renderOption',
      description: 'Custom renderer for option items',
      table: {
        category: 'Customization',
        type: {
          summary: '(value: renderOptionType) => Node | string',
          detail:
            'renderOptionType = {\n  item: Option;\n  index: number;\n  isActiveItem: boolean;\n  className: string;\n};',
        },
      },
    },
    itemStringifier: {
      name: 'itemStringifier',
      description: 'Function to convert item value to display string',
      table: {
        category: 'Customization',
        type: {
          summary: '(data: Option) => string',
          detail: 'Option { name: string;  value: unknown; }',
        },
      },
    },
    itemIdentifier: {
      name: 'itemIdentifier',
      description: 'Function to compare items for equality',
      table: {
        category: 'Customization',
        type: {
          summary: 'ItemIdentifier',
          detail: 'ItemIdentifier = (selected: Option, current: Option) => boolean',
        },
      },
    },
    width: {
      name: 'width',
      description: 'Width of the select component',
      table: {
        category: 'Layout',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    minWidth: {
      name: 'minWidth',
      description: 'Minimum width of the select component',
      table: {
        category: 'Layout',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    maxWidth: {
      name: 'maxWidth',
      description: 'Maximum width of the select component',
      table: {
        category: 'Layout',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'initial',
        },
      },
    },
    dropdownMaxHeight: {
      name: 'dropdownMaxHeight',
      description: 'Maximum height of the dropdown list',
      table: {
        category: 'Layout',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: '240px',
        },
      },
    },
    adornmentStart: {
      name: 'adornmentStart',
      description:
        'Element to be rendered at the start of the select Web Components provide this content through the slot="adornment-start".',
      table: {
        category: 'Layout',
        type: {
          summary: 'slot="adornment-start"',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'slot="adornment-start"',
      },
    },
    adornmentEnd: {
      name: 'adornmentEnd',
      description:
        'Element to be rendered at the end of the select Web Components provide this content through the slot="adornment-end".',
      table: {
        category: 'Layout',
        type: {
          summary: 'slot="adornment-end"',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'slot="adornment-end"',
      },
    },
    disabled: {
      name: 'disabled',
      description: 'Whether the select is disabled',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
    autoOpen: {
      name: 'autoOpen',
      description: 'Whether to automatically open the dropdown',
      table: {
        category: 'State',
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    activeIndex: {
      name: 'activeIndex',
      description: 'Currently active item index',
      table: {
        category: 'State',
        type: {
          summary: 'string | number',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    ref: {
      name: 'ref',
      description:
        'Forwarded ref that provides access to container methods: `isOpen`, `open()`, `close()`, `toggle() and onSelect()`.',
      table: {
        category: 'Advanced',
        type: {
          summary: 'Ref<SelectRef>',
          detail:
            '{ isOpen: boolean; open: () => void; close: () => void; toggle: () => void;  onSelect: <T = HTMLDivElement>(event: Event | Event | Event, data: Option) => void}',
        },
      },
    },
    initiator: {
      name: 'initiator',
      description:
        'Custom initiator element to trigger the dropdown Web Components provide this content through the slot="initiator".',
      table: {
        category: 'Advanced',
        type: {
          summary: 'slot="initiator"',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'slot="initiator"',
      },
    },
    children: {
      name: 'children',
      description:
        'Child elements of the select component Web Components provide this content through the default slot.',
      table: {
        category: 'Advanced',
        type: {
          summary: 'default slot',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'default slot',
      },
    },
    emptyItemsResult: {
      name: 'emptyItemsResult',
      description:
        'Text or Component to display when no items are available Web Components provide this content through the slot="empty-items-result".',
      table: {
        category: 'Advanced',
        type: {
          summary: 'slot="empty-items-result"',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'slot="empty-items-result"',
      },
    },
    itemsCount: {
      name: 'itemsCount',
      description: 'Number of items in the select',
      table: {
        category: 'Advanced',
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom styles object for the select',
      table: {
        category: 'Appearance & Styling',
        type: {
          summary: 'BoxCssComponentProps<HTMLDivElement>',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
    color: {
      name: 'color',
      description: 'Color variant of the select',
      options: ['primary', 'success', 'warning', 'error'],
      table: {
        category: 'Appearance & Styling',
        type: {
          summary: 'InputColorVariant',
        },
        defaultValue: {
          summary: "'primary'",
        },
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
  },
  Typography: {
    children: {
      control: {
        disable: true,
      },
      name: 'children',
      type: {
        name: 'other',
        value: 'default slot',
      },
      table: {
        category: 'Content',
        type: {
          summary: 'default slot',
        },
      },
      description:
        'The content to render inside the Typography component. Accepts text strings, numbers, DOM elements, or other Typography components for nested styling. Typography components can be nested to create rich text formatting with different styles. Web Components provide this content through the default slot.',
    },
    variant: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'variant',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<TypographyVariant>',
        value: 'EnumOrPrimitive',
      },
      description:
        'Determines the semantic HTML element and corresponding typography styles. Options include headings (h1-h6), body text (p, small), display (div), code (code, kbd), and special elements (span, strong, i, caption, header). Each variant maps to theme tokens for consistent styling.',
      table: {
        type: {
          summary: 'EnumOrPrimitive',
        },
        defaultValue: {
          summary: 'p',
        },
        category: 'Appearance',
      },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'small',
        'div',
        'span',
        'strong',
        'i',
        'code',
        'kbd',
        'caption',
        'header',
        'sup',
        'sub',
      ],
    },
    align: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'align',
      type: {
        name: 'other',
        required: false,
        raw: 'EnumOrPrimitive<TextAlign>',
        value: 'EnumOrPrimitive',
      },
      description:
        'Sets text-align CSS property. Options include "start" (default, respects RTL/LTR), "end", "center", "left", "right", "justify", "match-parent", and CSS keywords (initial, inherit, revert, unset). Use logical values (start/end) for international layouts.',
      table: {
        type: {
          summary: 'EnumOrPrimitive',
        },
        defaultValue: {
          summary: 'start',
        },
        category: 'Layout',
      },
      options: [
        'start',
        'end',
        'center',
        'left',
        'right',
        'justify',
        'match-parent',
        'inherit',
        'initial',
        'revert',
        'revert-layer',
        'unset',
      ],
    },
    as: {
      control: {
        type: 'text',
        disable: false,
      },
      name: 'as',
      description:
        'Polymorphic prop that changes the rendered element/component while preserving all Typography styles. Accepts HTML tag names ("div", "span", "label") or custom elements (Row, Column, Link). Useful for maintaining visual consistency across different semantic elements (e.g., h1 styles on a div for SEO flexibility). Use a native HTML tag name in the Web Component API.',
      type: {
        required: false,
        raw: 'keyof HTMLElementTagNameMap',
        name: 'union',
        value: [
          {
            name: 'other',
            value: 'HTMLElementTagNameMap',
          },
          {
            name: 'other',
            value: 'keyof HTMLElementTagNameMap',
          },
        ],
      },
      table: {
        type: {
          summary: 'keyof HTMLElementTagNameMap',
        },
        category: 'Behavior',
      },
    },
    color: {
      control: {
        type: 'color',
        disable: false,
      },
      name: 'color',
      description:
        'Controls the text color. Accepts any valid CSS color value (hex, rgb, named colors) or theme token path (e.g., "text.primary", "brand.500"). Defaults to theme token "colors.text.default" for consistent theming. Use "inherit" to inherit color from parent elements.',
      type: {
        required: false,
        name: 'string',
      },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'text.default',
        },
        category: 'Appearance',
      },
    },
    size: {
      control: {
        type: 'select',
        disable: false,
      },
      name: 'size',
      description:
        'Controls font size and line height for Display variant (variant="div") ONLY. Available sizes: xs, sm, md (default), lg, xl. This enables fine-grained control over hero text and marketing headlines. Ignored for all other variants.',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<SizeVariant>',
        name: 'other',
        value: 'EnumOrPrimitive',
      },
      table: {
        type: {
          summary: 'EnumOrPrimitive',
        },
        defaultValue: {
          summary: 'md',
        },
        category: 'Appearance',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    styleVariant: {
      control: {
        type: 'multi-select',
        disable: false,
      },
      name: 'styleVariant',
      description:
        'Applies one or more style modifiers to enhance text appearance. Options: "light" (lighter weight), "normal" (normal weight), "semibold" (medium weight), "bold" (bold weight), "italic" (italic style), "small" (smaller font size), "uppercase", "lowercase", "underline", "strike" (strikethrough). Multiple values can be combined for rich formatting (e.g., ["bold", "italic", "uppercase"]).',
      type: {
        required: false,
        raw: 'EnumOrPrimitive<TypographyStyleVariant> | EnumOrPrimitive<TypographyStyleVariant>[]',
        name: 'union',
        value: [
          {
            raw: 'EnumOrPrimitive<TypographyStyleVariant>',
            name: 'other',
            value: 'EnumOrPrimitive',
          },
          {
            raw: 'EnumOrPrimitive<TypographyStyleVariant>[]',
            name: 'array',
            value: [
              {
                raw: 'EnumOrPrimitive<TypographyStyleVariant>',
                name: 'other',
                value: 'EnumOrPrimitive',
              },
            ],
          },
        ],
      },
      table: {
        type: {
          summary: 'union',
        },
        defaultValue: {
          summary: '[]',
        },
        category: 'Appearance',
      },
      options: [
        'light',
        'normal',
        'semibold',
        'bold',
        'italic',
        'small',
        'uppercase',
        'lowercase',
        'underline',
        'strike',
      ],
    },
    styles: {
      name: 'styles',
      table: {
        defaultValue: {
          summary: '{}',
        },
        category: 'Appearance',
      },
      description:
        'Custom CSS styles object for one-off styling needs. Use sparingly—prefer variant and styleVariant props for consistent design. Accepts Emotion CSS object syntax with support for nested selectors, pseudo-classes, and media queries.',
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
  Counter: {
    min: {
      control: {
        type: 'number',
      },
      name: 'min',
      description: 'Minimum allowed value',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '1',
        },
        category: 'Value & Constraints',
      },
    },
    max: {
      control: {
        type: 'number',
      },
      name: 'max',
      description: 'Maximum allowed value',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '999',
        },
        category: 'Value & Constraints',
      },
    },
    initial: {
      control: {
        type: 'number',
      },
      name: 'initial',
      description: 'Initial value of the counter',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '1',
        },
        category: 'Value & Constraints',
      },
    },
    isDisabled: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'isDisabled',
      description: 'Disables the counter component, preventing user interaction',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
        category: 'Value & Constraints',
      },
    },
    onCounterChange: {
      name: 'onCounterChange',
      description:
        'Callback function triggered when counter value changes Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Events',
      },
      control: {
        disable: true,
      },
    },
    styles: {
      name: 'styles',
      description: 'CSS properties applied to the counter container',
      table: {
        category: 'Styling',
        type: {
          summary: 'Partial<CSSStyleDeclaration>',
        },
        defaultValue: {
          summary: '{}',
        },
      },
    },
  },
  Menu: {
    onSelect: {
      control: {
        disable: true,
      },
      name: 'onSelect',
      type: {
        name: 'function',
        value: 'EventListener<CustomEvent>',
      },
      description:
        'Callback fired when a menu item is selected. Receives the selected item data Listen for the CustomEvent dispatched as "gd-change" with addEventListener().',
      table: {
        type: {
          summary: 'CustomEvent ("gd-change")',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Behavior & Interaction',
      },
      action: 'selected',
    },
    itemIdentifier: {
      control: {
        type: 'object',
      },
      name: 'itemIdentifier',
      description: 'Function to extract unique identifier from menu items for selection tracking',
      type: {
        required: false,
        name: 'other',
        value: 'ItemIdentifier',
      },
      table: {
        type: {
          summary: '(item: unknown) => string | number',
        },
        defaultValue: {
          summary: 'undefined',
          detail: '(selected, current) => selected?.value === current?.value',
        },
        category: 'Behavior & Interaction',
      },
    },
    content: {
      control: {
        disable: true,
      },
      name: 'content',
      description:
        'Menu content to be rendered inside the dropdown (typically DropdownItem components) Web Components provide this content through the slot="content".',
      type: {
        name: 'other',
        value: 'slot="content"',
      },
      table: {
        type: {
          summary: 'slot="content"',
        },
        defaultValue: {
          summary: 'undefined',
        },
        category: 'Content & Trigger',
      },
    },
    closeOnSelect: {
      control: {
        type: 'boolean',
        disable: false,
      },
      name: 'closeOnSelect',
      description:
        'Whether to close the menu when an option is clicked. Set to false to keep menu open for multiple selections',
      type: {
        required: false,
        name: 'boolean',
      },
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'true',
        },
        category: 'Behavior & Interaction',
      },
    },
    offsetX: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'offsetX',
      description:
        'Horizontal distance in pixels between the menu and the trigger element. Used for positioning calculations',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '4',
        },
        category: 'Menu Options (Positioning & Dimensions)',
      },
    },
    offsetY: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'offsetY',
      description:
        'Vertical distance in pixels between the menu and the trigger element. Used for positioning calculations',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '4',
        },
        category: 'Menu Options (Positioning & Dimensions)',
      },
    },
    minHeight: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'minHeight',
      description:
        'Minimum height constraint for the menu dropdown in pixels. Used for dynamic height calculations based on available viewport space',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '80',
        },
        category: 'Menu Options (Positioning & Dimensions)',
      },
    },
    maxHeight: {
      control: {
        type: 'number',
        disable: false,
      },
      name: 'maxHeight',
      description:
        'Maximum height constraint for the menu dropdown in pixels. Used for dynamic height calculations based on available viewport space',
      type: {
        required: false,
        name: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '400',
        },
        category: 'Menu Options (Positioning & Dimensions)',
      },
    },
    placement: {
      control: {
        type: 'select',
        disable: false,
      },
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      name: 'placement',
      description: 'Position of the menu relative to the trigger. Defaults to "bottom-right" if not specified',
      type: {
        required: false,
        raw: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        name: 'enum',
        value: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      },
      table: {
        type: {
          summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        },
        defaultValue: {
          summary: "'bottom-right'",
        },
        category: 'Menu Options (Positioning & Dimensions)',
      },
    },
    children: {
      name: 'children',
      description:
        'Trigger element that opens the menu when clicked (button, text, icon, etc.) Web Components provide this content through the default slot.',
      table: {
        category: 'Content & Trigger',
        type: {
          summary: 'default slot',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        disable: true,
      },
      type: {
        name: 'other',
        value: 'default slot',
      },
    },
    width: {
      name: 'width',
      description: 'Sets the width of the menu container',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    height: {
      name: 'height',
      description: 'Sets the height of the menu container',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    minWidth: {
      name: 'minWidth',
      description: 'CSS min-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    maxWidth: {
      name: 'maxWidth',
      description: 'CSS max-width property',
      table: {
        category: 'Box Styles - Layout & Sizing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    margin: {
      name: 'margin',
      description: 'CSS margin property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginTop: {
      name: 'marginTop',
      description: 'CSS margin-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginRight: {
      name: 'marginRight',
      description: 'CSS margin-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginBottom: {
      name: 'marginBottom',
      description: 'CSS margin-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    marginLeft: {
      name: 'marginLeft',
      description: 'CSS margin-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    padding: {
      name: 'padding',
      description: 'CSS padding property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingTop: {
      name: 'paddingTop',
      description: 'CSS padding-top property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingRight: {
      name: 'paddingRight',
      description: 'CSS padding-right property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingBottom: {
      name: 'paddingBottom',
      description: 'CSS padding-bottom property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    paddingLeft: {
      name: 'paddingLeft',
      description: 'CSS padding-left property',
      table: {
        category: 'Box Styles - Spacing',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexDirection: {
      name: 'flexDirection',
      description: 'CSS flex-direction property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifyContent: {
      name: 'justifyContent',
      description: 'CSS justify-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    justifySelf: {
      name: 'justifySelf',
      description: 'CSS justify-self property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignItems: {
      name: 'alignItems',
      description: 'CSS align-items property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignSelf: {
      name: 'alignSelf',
      description: 'CSS align-self property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    alignContent: {
      name: 'alignContent',
      description: 'CSS align-content property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexWrap: {
      name: 'flexWrap',
      description: 'CSS flex-wrap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexGrow: {
      name: 'flexGrow',
      description: 'CSS flex-grow property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexShrink: {
      name: 'flexShrink',
      description: 'CSS flex-shrink property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flexBasis: {
      name: 'flexBasis',
      description: 'CSS flex-basis property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    flex: {
      name: 'flex',
      description: 'CSS flex property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    order: {
      name: 'order',
      description: 'CSS order property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    gap: {
      name: 'gap',
      description: 'CSS gap property',
      table: {
        category: 'Box Styles - Flexbox',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    display: {
      name: 'display',
      options: ['block', 'flex', 'inline', 'inline-flex', 'grid', 'none'],
      description: 'CSS display property to control the layout behavior',
      table: {
        type: {
          summary: 'string',
        },
        category: 'Box Styles - Position & Display',
      },
      control: {
        type: 'select',
        disable: false,
      },
    },
    position: {
      name: 'position',
      description: 'CSS position property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    top: {
      name: 'top',
      description: 'CSS top property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    right: {
      name: 'right',
      description: 'CSS right property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    bottom: {
      name: 'bottom',
      description: 'CSS bottom property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    left: {
      name: 'left',
      description: 'CSS left property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    overflow: {
      name: 'overflow',
      description: 'CSS overflow property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    zIndex: {
      name: 'zIndex',
      description: 'CSS z-index property',
      table: {
        category: 'Box Styles - Position & Display',
        type: {
          summary: 'string | number',
        },
      },
      control: {
        type: 'text',
        disable: false,
      },
    },
    styles: {
      name: 'styles',
      description: 'Custom CSS styles object to be applied to the menu dropdown container',
      table: {
        category: 'Custom Styling',
        type: {
          summary: 'CSSObject',
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
      control: {
        type: 'object',
        disable: false,
      },
    },
  },
} as const;
