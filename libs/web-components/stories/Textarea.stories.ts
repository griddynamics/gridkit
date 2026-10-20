import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GdTextarea } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';
import {
  autoFocusActions,
  controlledEraseOnEnterActions,
  defaultActions,
  disabledActions,
  maxCharactersActions,
  readOnlyActions,
  withCharLimitActions,
} from './Textarea.stories.play';

type Handler = (event: Event) => void;
type Args = Partial<
  Pick<
    GdTextarea,
    | 'name'
    | 'placeholder'
    | 'ariaDescribedBy'
    | 'value'
    | 'minHeight'
    | 'maxHeight'
    | 'disabled'
    | 'readOnly'
    | 'autoFocus'
    | 'resize'
    | 'rows'
    | 'dynamicHeightAdjustment'
    | 'variant'
    | 'color'
    | 'maxLength'
    | 'maxCharacters'
    | 'defaultValue'
    | 'styles'
  >
> & { id?: string; onChange?: Handler; onCustomResize?: Handler };

type ArgType = NonNullable<NonNullable<Meta['argTypes']>[string]>;

const argType = (
  control: ArgType['control'],
  description: string,
  category: string,
  summary: string,
  defaultValue: string,
  extra: Partial<ArgType> = {}
): ArgType => ({
  control,
  ...extra,
  description,
  table: { type: { summary }, defaultValue: { summary: defaultValue }, category },
});

const meta = {
  title: 'Atoms/Textarea',
  component: 'gd-textarea',
  args: {
    name: 'textarea',
  },
  argTypes: {
    name: argType('text', 'Input field name attribute', 'Basics', 'string', 'textarea'),
    placeholder: argType('text', 'Placeholder text', 'Basics', 'string', 'undefined'),
    ariaDescribedBy: argType(
      'text',
      'ID of element that describes this textarea',
      'Accessibility',
      'string',
      'undefined'
    ),
    value: argType('text', 'Controlled value of the textarea', 'Basics', 'string', 'undefined'),
    minHeight: argType('text', 'Minimum height of textarea', 'Sizing & Layout', 'string', 'undefined'),
    maxHeight: argType('text', 'Maximum height of textarea', 'Sizing & Layout', 'string', 'undefined'),
    disabled: argType('boolean', 'Whether the textarea is disabled', 'Accessibility', 'boolean', 'false'),
    readOnly: argType('boolean', 'Whether the textarea is read only', 'Accessibility', 'boolean', 'false'),
    autoFocus: argType('boolean', 'Whether the textarea should auto focus', 'Accessibility', 'boolean', 'false'),
    resize: argType(
      'select',
      'Controls how the textarea can be resized',
      'Behavior',
      'TextareaResize',
      'TextareaResize.None',
      { options: ['none', 'both', 'horizontal', 'vertical'] }
    ),
    rows: argType('number', 'Number of rows', 'Sizing & Layout', 'number', 'undefined'),
    dynamicHeightAdjustment: argType(
      'boolean',
      'Enable/disable dynamic height adjustment',
      'Behavior',
      'boolean',
      'false'
    ),
    variant: argType('select', 'Visual variant of the textarea', 'Styling', 'TextareaVariant', "'default'", {
      options: ['default', 'inline'],
    }),
    color: argType('select', 'Color variant of the textarea', 'Styling', 'InputColorVariant', "'primary'", {
      options: ['primary', 'success', 'warning', 'error'],
    }),
    maxLength: argType('number', 'Maximum character limit', 'Behavior', 'number', 'undefined'),
    maxCharacters: {
      control: 'number',
      description: 'Maximum character count; shows a current/max counter below the textarea',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'undefined' } },
    },
    defaultValue: argType('text', 'Initial textarea content', 'Basics', 'string', 'undefined'),
    styles: argType('object', 'Custom CSS styles to override default styling', 'Styling', 'CSSProperties', 'undefined'),
    onChange: {
      action: 'changed',
      description: 'Callback when textarea content changes (gd-input event)',
      table: {
        type: { summary: '(event: CustomEvent<{ value: string }>) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    onCustomResize: {
      action: 'resized',
      description: 'Callback triggered when textarea is manually resized by user (gd-resize event)',
      table: {
        type: { summary: '(event: CustomEvent<{ height: number; width: number }>) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
  },
  tags: ['autodocs'],
  render: ({ onChange, onCustomResize, ...props }: Args) => {
    const textarea = element('gd-textarea', props as Partial<GdTextarea>);
    if (onChange) textarea.addEventListener('gd-input', onChange);
    if (onCustomResize) textarea.addEventListener('gd-resize', onCustomResize);
    return textarea;
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`gd-textarea\` custom element is a sophisticated, production-ready multi-line text input field designed for handling larger blocks of text content. Built with accessibility, performance, and user experience in mind, it provides comprehensive functionality for text editing scenarios across web applications.

<br/>
<br/>

<h3>🎯 Core Capabilities</h3>
<ul>
<li><b>Multi-line Text Input:</b> Native support for line breaks, paragraphs, and extended text content with proper cursor positioning and text selection</li>
<li><b>Flexible Sizing:</b> Dynamic height adjustment that grows with content, fixed row configurations, or user-controlled resizing options</li>
<li><b>Content Management:</b> Character limits, default values, controlled/uncontrolled modes, and real-time content validation</li>
<li><b>State Management:</b> Support for both controlled (property-driven state) and uncontrolled (DOM state) input patterns</li>
<li><b>Accessibility First:</b> Full ARIA support, keyboard navigation, screen reader compatibility, and focus management</li>
</ul>

<br/>

<h3>⚙️ Advanced Features</h3>
<ul>
<li><b>Dynamic Height Adjustment:</b> Automatically expands and contracts based on content length, preventing scrollbars for optimal UX</li>
<li><b>Resize Control:</b> Configurable resize behavior - none, horizontal, vertical, or both directions with custom resize event handling</li>
<li><b>Character Limits:</b> Built-in maxLength support with browser-native validation and custom counter implementations</li>
<li><b>Focus Management:</b> Auto-focus capability, programmatic focus control, and proper tab order integration</li>
<li><b>Event System:</b> Comprehensive event handling for content changes, resize operations, focus events, and keyboard interactions</li>
<li><b>Custom Styling:</b> Full CSS customization support while maintaining accessibility and responsive behavior</li>
</ul>

<br/>

<h3>🎨 Input States & Modes</h3>
<ul>
<li><b>Standard Input:</b> Full editing capabilities with placeholder text and value management</li>
<li><b>Read-only Mode:</b> Content display without editing, useful for showing formatted text or user-generated content</li>
<li><b>Disabled State:</b> Visual and functional disabled state for conditional form interactions</li>
<li><b>Auto-focus:</b> Immediate focus on component mount for streamlined user workflows</li>
<li><b>Controlled vs Uncontrolled:</b> Flexible state management patterns to fit different application architectures</li>
</ul>

<br/>

<h3>🔧 Technical Implementation</h3>
<ul>
<li><b>Performance Optimized:</b> Efficient re-rendering with proper update batching and minimal DOM manipulation</li>
<li><b>Event Handling:</b> Native HTML5 textarea events re-dispatched as composed gd-input, gd-change and gd-resize custom events</li>
<li><b>Focus Method:</b> Full support for imperative operations like focus, selection, and measurement</li>
<li><b>TypeScript Support:</b> Complete type safety with proper event typing and property validation</li>
<li><b>Theme Integration:</b> Seamless integration with design system tokens and theme switching</li>
</ul>

<br/>

<h3>💡 Common Use Cases</h3>
<ul>
<li><b>Form Input:</b> Comments, descriptions, feedback, and multi-line form fields</li>
<li><b>Content Creation:</b> Rich text editors, markdown editors, and document composition</li>
<li><b>Communication:</b> Chat inputs, message composition, and social media posts</li>
<li><b>Data Entry:</b> Bulk text import, configuration files, and structured data input</li>
<li><b>Display Components:</b> Read-only content display, formatted text viewers, and documentation</li>
<li><b>Interactive Features:</b> Search filters, command inputs, and user-generated content</li>
</ul>

<br/>

<h3>🎯 Best Practices</h3>
<ul>
<li><b>Accessibility:</b> Always provide meaningful labels, use \`ariaDescribedBy\` for help text, and ensure proper focus management</li>
<li><b>Character Limits:</b> Implement \`maxLength\` for constrained inputs and provide clear feedback about remaining characters</li>
<li><b>Dynamic Sizing:</b> Use \`dynamicHeightAdjustment\` for content that varies significantly in length</li>
<li><b>Resize Behavior:</b> Choose appropriate resize options based on layout constraints and user needs</li>
<li><b>State Management:</b> Use controlled components for form validation and uncontrolled for simple input scenarios</li>
<li><b>Performance:</b> Avoid unnecessary re-renders by properly managing state and using appropriate event handlers</li>
<li><b>User Experience:</b> Provide clear placeholders, helpful error messages, and intuitive resize handles</li>
</ul>

<br/>

<h3>🔗 Integration Patterns</h3>
<ul>
<li><b>Form Integration:</b> Works seamlessly with \`Form\` component and validation libraries</li>
<li><b>Layout Components:</b> Integrates with \`FlexContainer\`, \`Column\`, and \`Row\` for responsive layouts</li>
<li><b>Validation:</b> Compatible with form validation patterns and error state management</li>
<li><b>Theme System:</b> Inherits colors, spacing, and typography from the design system</li>
<li><b>Event Handling:</b> Supports complex event patterns like Enter-to-submit, auto-save, and real-time validation</li>
</ul>

        `,
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const storyDescription = (story: string, source?: string) => ({
  docs: { ...(source ? formattedSource(source).docs : {}), description: { story } },
});

/**
 * Basic textarea component with a placeholder.
 */
export const Default: Story = {
  args: {
    placeholder: 'Type something...',
    defaultValue: 'This is a default value ',
    onChange: fn(),
  },
  play: defaultActions,
  parameters: storyDescription('Basic textarea component with a placeholder.'),
};

/**
 * Disabled state of the textarea when user interaction is not allowed.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'You cannot edit this...',
    disabled: true,
    defaultValue: 'This is a disabled value',
  },
  play: disabledActions,
  parameters: storyDescription('Disabled state of the textarea when user interaction is not allowed.'),
};

/**
 * Read-only state allows users to view but not modify the content.
 */
export const ReadOnly: Story = {
  args: {
    defaultValue: 'This text cannot be changed',
    readOnly: true,
  },
  play: readOnlyActions,
  parameters: storyDescription('Read-only state allows users to view but not modify the content.'),
};

/**
 * Inline variant of the textarea with minimal styling.
 */
export const VariantInline: Story = {
  args: {
    defaultValue: 'Styled text area...',
    variant: 'inline',
  },
  parameters: storyDescription('Inline variant of the textarea with minimal styling.'),
};

/**
 * Textarea with primary color variant (default).
 */
export const ColorPrimary: Story = {
  args: {
    placeholder: 'Primary color textarea...',
    color: 'primary',
    defaultValue: 'This is a primary color textarea',
  },
  parameters: storyDescription('Textarea with primary color variant (default).'),
};

/**
 * Textarea with success color variant for valid input indication.
 */
export const ColorSuccess: Story = {
  args: {
    placeholder: 'Success color textarea...',
    color: 'success',
    defaultValue: 'This is a success color textarea',
  },
  parameters: storyDescription('Textarea with success color variant for valid input indication.'),
};

/**
 * Textarea with warning color variant for caution states.
 */
export const ColorWarning: Story = {
  args: {
    placeholder: 'Warning color textarea...',
    color: 'warning',
    defaultValue: 'This is a warning color textarea',
  },
  parameters: storyDescription('Textarea with warning color variant for caution states.'),
};

/**
 * Textarea with error color variant for validation errors.
 */
export const ColorError: Story = {
  args: {
    placeholder: 'Error color textarea...',
    color: 'error',
    defaultValue: 'This is an error color textarea',
  },
  parameters: storyDescription('Textarea with error color variant for validation errors.'),
};

/**
 * Textarea with autofocus enabled - useful for forms where immediate input is expected.
 */
export const AutoFocus: Story = {
  args: {
    autoFocus: true,
    placeholder: 'This will be focused on load',
  },
  play: autoFocusActions,
  parameters: storyDescription('Textarea with autofocus enabled - useful for forms where immediate input is expected.'),
};

/**
 * Textarea that automatically adjusts its height based on content.
 */
export const DynamicHeight: Story = {
  args: {
    dynamicHeightAdjustment: true,
    placeholder:
      'Start typing to expand... Start typing to expand... Start typing to expand... Start typing to expand...',
  },
  parameters: storyDescription('Textarea that automatically adjusts its height based on content.'),
};

/**
 * Textarea with character limit and counter - useful for constrained input scenarios.
 */
export const WithCharLimit: Story = {
  args: {
    maxLength: 50,
    placeholder: 'Max 50 characters...',
  },
  play: withCharLimitActions,
  parameters: storyDescription('Textarea with character limit and counter - useful for constrained input scenarios.'),
};

/**
 * Textarea that can be resized by the user in both directions.
 */
export const Resizable: Story = {
  args: {
    placeholder: 'Resizable Textarea placeholder text...',
    resize: 'both',
  },
  parameters: storyDescription('Textarea that can be resized by the user in both directions.'),
};

export const WithControlledStateEraseOnEnterClick: Story = {
  render: () => {
    let value = 'This is a controlled textarea, initially 1 row';
    const textarea = element('gd-textarea', {
      name: 'customName',
      rows: 1,
      dynamicHeightAdjustment: true,
      value,
    });
    textarea.setAttribute('aria-invalid', 'false');
    textarea.addEventListener('gd-input', (event) => {
      value = (event as CustomEvent<{ value: string }>).detail.value;
      textarea.value = value;
    });
    textarea.addEventListener('keydown', (event) => {
      if ((event as KeyboardEvent).key === 'Enter') {
        event.preventDefault();
        value = '';
        textarea.value = value;
      }
    });
    return textarea;
  },
  play: controlledEraseOnEnterActions,
  parameters: {
    docs: {
      description: {
        story: `
Controlled example: pressing Enter clears the textarea value. This pattern is useful in chat inputs or command bars where Enter submits/clears instead of inserting a newline.

How to try:
<ul>
  <li>Type any text.</li>
  <li>Press Enter — the handler prevents the newline and resets the value to an empty string.</li>
</ul>

Notes:

Uses \`event.preventDefault()\` to avoid inserting a newline and manages state through the \`value\` property. The \`focus()\` method is available on the element for focus management if needed.
      `,
      },
      ...formattedSource(`
<gd-textarea
  name="customName"
  rows="1"
  dynamic-height-adjustment
  aria-invalid="false"
></gd-textarea>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  const textarea = document.querySelector('gd-textarea');
  textarea.theme = defaultTheme;
  textarea.value = 'This is a controlled textarea, initially 1 row';

  textarea.addEventListener('gd-input', (event) => {
    textarea.value = event.detail.value;
  });
  textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      textarea.value = '';
    }
  });
</script>
`).docs,
    },
  },
};

export const MaxCharacters: Story = {
  args: {
    placeholder: 'Type up to 100 characters...',
    maxCharacters: 100,
  },
  play: maxCharactersActions,
  parameters: {
    docs: {
      description: {
        story:
          'The `maxCharacters` prop displays a character counter showing current / max characters, providing visual feedback as users approach the limit.',
      },
      ...formattedSource(`<gd-textarea placeholder="Type up to 100 characters..." max-characters="100"></gd-textarea>`)
        .docs,
    },
  },
};

export const WithAccessibility: Story = {
  tags: ['a11y'],
  args: {
    name: 'comments',
    id: 'comments',
    placeholder: 'Enter your comments here...',
    ariaDescribedBy: 'textarea-helper',
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  decorators: [
    (story) => {
      const fragment = document.createDocumentFragment();
      const label = document.createElement('label');
      label.htmlFor = 'comments';
      label.textContent = 'Comments';
      const textarea = story() as HTMLElement;
      // The label references the host id; the inner control takes its accessible name from the host.
      textarea.setAttribute('aria-label', 'Comments');
      fragment.append(label, textarea);
      return fragment;
    },
  ],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('textarea'),
};
DefaultTokens.parameters = {
  layout: 'padded',
};
