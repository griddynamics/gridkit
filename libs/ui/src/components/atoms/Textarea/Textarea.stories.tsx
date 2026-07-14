import { useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Textarea } from './Textarea';
import { TextareaResize } from './';
import {
  defaultActions,
  disabledActions,
  readOnlyActions,
  maxCharactersActions,
  autoFocusActions,
  controlledEraseOnEnterActions,
  withCharLimitActions,
} from './Textarea.stories.play';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  args: {
    name: 'textarea',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Input field name attribute',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'textarea' },
        category: 'Basics',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Basics',
      },
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element that describes this textarea',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Accessibility',
      },
    },
    value: {
      control: 'text',
      description: 'Controlled value of the textarea',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Basics',
      },
    },
    minHeight: {
      control: 'text',
      description: 'Minimum height of textarea',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Sizing & Layout',
      },
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of textarea',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Sizing & Layout',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Accessibility',
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the textarea is read only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Accessibility',
      },
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether the textarea should auto focus',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Accessibility',
      },
    },
    resize: {
      control: 'select',
      options: Object.values(TextareaResize),
      description: 'Controls how the textarea can be resized',
      table: {
        type: { summary: 'TextareaResize' },
        defaultValue: { summary: 'TextareaResize.None' },
        category: 'Behavior',
      },
    },
    rows: {
      control: 'number',
      description: 'Number of rows',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Sizing & Layout',
      },
    },
    dynamicHeightAdjustment: {
      control: 'boolean',
      description: 'Enable/disable dynamic height adjustment',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Behavior',
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'inline'],
      description: 'Visual variant of the textarea',
      table: {
        type: { summary: 'TextareaVariant' },
        defaultValue: { summary: "'default'" },
        category: 'Styling',
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error'],
      description: 'Color variant of the textarea',
      table: {
        type: { summary: 'InputColorVariant' },
        defaultValue: { summary: "'primary'" },
        category: 'Styling',
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character limit',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Behavior',
      },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial textarea content',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Basics',
      },
    },
    styles: {
      control: 'object',
      description: 'Custom CSS styles to override default styling',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: 'undefined' },
        category: 'Styling',
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback when textarea content changes',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLTextAreaElement>) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    onCustomResize: {
      action: 'resized',
      description: 'Callback triggered when textarea is manually resized by user',
      table: {
        type: { summary: '(newSize: { height: number; width: number }) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Textarea\` component is a sophisticated, production-ready multi-line text input field designed for handling larger blocks of text content. Built with accessibility, performance, and user experience in mind, it provides comprehensive functionality for text editing scenarios across web applications.

<br/>
<br/>

<h3>🎯 Core Capabilities</h3>
<ul>
<li><b>Multi-line Text Input:</b> Native support for line breaks, paragraphs, and extended text content with proper cursor positioning and text selection</li>
<li><b>Flexible Sizing:</b> Dynamic height adjustment that grows with content, fixed row configurations, or user-controlled resizing options</li>
<li><b>Content Management:</b> Character limits, default values, controlled/uncontrolled modes, and real-time content validation</li>
<li><b>State Management:</b> Support for both controlled (React state) and uncontrolled (DOM state) input patterns</li>
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
<li><b>Performance Optimized:</b> Efficient re-rendering with proper React patterns and minimal DOM manipulation</li>
<li><b>Event Handling:</b> Native HTML5 textarea events with React synthetic event integration</li>
<li><b>Ref Forwarding:</b> Full ref support for imperative operations like focus, selection, and measurement</li>
<li><b>TypeScript Support:</b> Complete type safety with proper event typing and prop validation</li>
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
};

export default meta;
type Story = StoryObj<typeof Textarea>;

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
};

/**
 * Inline variant of the textarea with minimal styling.
 */
export const VariantInline: Story = {
  args: {
    defaultValue: 'Styled text area...',
    variant: 'inline',
  },
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
};

/**
 * Textarea that can be resized by the user in both directions.
 */
export const Resizable: Story = {
  args: {
    placeholder: 'Resizable Textarea placeholder text...',
    resize: TextareaResize.Both,
  },
};

export const WithControlledStateEraseOnEnterClick: StoryFn = () => {
  const [value, setValue] = useState('This is a controlled textarea, initially 1 row');

  return (
    <Textarea
      name="customName"
      rows={1}
      dynamicHeightAdjustment
      aria-invalid="false"
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          setValue('');
        }
      }}
      value={value}
    />
  );
};
WithControlledStateEraseOnEnterClick.play = controlledEraseOnEnterActions;
WithControlledStateEraseOnEnterClick.parameters = {
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

Uses \`e.preventDefault()\` to avoid inserting a newline and manages state via \`e.useState()\`. A ref is provided to demonstrate access for focus/measure if needed.
      `,
    },
    source: {
      code: `
import { useState } from 'react';
import { Textarea } from 'gd-design-library';

export const WithControlledStateEraseOnEnterClick = () => {
  const [value, setValue] = useState('This is a controlled textarea, initially 1 row');

  return (
    <Textarea
      name="customName"
      rows={1}
      dynamicHeightAdjustment
      aria-invalid="false"
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          setValue('');
        }
      }}
      value={value}
    />
  );
};
`,
      language: 'tsx',
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
      source: {
        code: `<Textarea placeholder="Type up to 100 characters..." maxCharacters={100} />`,
      },
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
    (Story) => (
      <>
        <label htmlFor="comments">Comments</label>
        <Story />
      </>
    ),
  ],
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ textarea: defaultTheme.textarea }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
