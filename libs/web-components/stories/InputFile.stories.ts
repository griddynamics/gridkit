import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GdInputFile } from '../src';
import { defaultTokenViewer, element } from './helpers';
import {
  defaultActions,
  disabledActions,
  iconLabelActions,
  multipleActions,
  withAcceptActions,
} from './InputFile.stories.play';

type Handler = (event: Event) => void;
type Args = Partial<
  Pick<GdInputFile, 'accept' | 'capture' | 'multiple' | 'disabled' | 'styles' | 'isIcon' | 'buttonProps'>
> & {
  children?: string;
  'aria-label'?: string;
  onClick?: Handler;
  onChange?: Handler;
};

/** Build the custom element: `children` becomes the default slot, handlers become event listeners. */
const createInputFile = ({ children, onClick, onChange, 'aria-label': ariaLabel, ...props }: Args) => {
  const input = element('gd-input-file', props as Partial<GdInputFile>, children ?? '');
  if (ariaLabel !== undefined) input.setAttribute('aria-label', ariaLabel);
  if (onClick) input.addEventListener('gd-click', onClick);
  if (onChange) input.addEventListener('gd-change', onChange);
  return input;
};

const meta = {
  title: 'Atoms/InputFile',
  component: 'gd-input-file',
  args: {
    accept: undefined,
    capture: undefined,
    multiple: false,
    disabled: false,
  },

  argTypes: {
    accept: {
      control: 'select',
      options: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc,.docx', '.txt'],
      description: 'Accepted file types (MIME types or file extensions)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'File Handling',
      },
    },
    capture: {
      control: 'select',
      options: ['user', 'environment'],
      description: 'Preferred media capture method on mobile devices',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Mobile Features',
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow selection of multiple files',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'File Handling',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input and button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    styles: {
      control: 'object',
      description: 'CSS style overrides for the wrapper element',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
        category: 'Styling',
      },
    },
    isIcon: {
      control: 'boolean',
      description: 'Render the button as an icon-only button (no text label, square sizing)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Button Customization',
      },
    },
    buttonProps: {
      control: 'object',
      description: 'Props to customize the Button component',
      table: {
        type: {
          summary: 'ButtonProps',
          detail: `ButtonProps {
            variant?: 'text' | 'outlined' | 'contained';
            color?: 'primary' | 'secondary' | 'error';
            type?: 'button' | 'submit' | 'reset';
            disabled?: boolean;
            fullWidth?: boolean;
            isIcon?: boolean;
            ariaLabel?: string;
            ariaPressed?: boolean;
            role?: 'button' | 'menuitem' | 'switch';
            tabIndex?: number;
          }`,
        },
        defaultValue: { summary: '{}' },
        category: 'Button Customization',
      },
    },
    children: {
      control: 'text',
      description: 'Content for the button label (text or components)',
      table: {
        type: { summary: 'Node' },
        defaultValue: { summary: 'Browse Files' },
        category: 'Content',
      },
    },
    onClick: {
      action: 'button clicked',
      description: 'Called when the button is clicked (gd-click event)',
      table: {
        disable: true,
        type: { summary: '(event: CustomEvent) => void' },
        category: 'Events',
      },
    },
    onChange: {
      action: 'file(s) selected',
      description: 'Called when files are selected (gd-change event)',
      table: {
        disable: true,
        type: { summary: '(event: CustomEvent<{ files: File[] }>) => void' },
        category: 'Events',
      },
    },
  },
  tags: ['autodocs'],
  render: createInputFile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`gd-input-file\` custom element provides an enhanced file upload experience by combining a hidden native file input with a customizable button interface. This component follows design system guidelines while maintaining full browser file handling capabilities.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>File Selection</b>
  <ul>
  <li>Flexible file selection with support for single or multiple files</li>
  <li>Comprehensive file type filtering through MIME types or extensions</li>
  <li>Direct camera/microphone access on mobile devices via capture attribute</li>
  </ul>
  </li>
  <li>
  <b>Customization</b>
  <ul>
  <li>Extensive button styling options through the buttonProps property</li>
  <li>Support for both text and icon-based labels</li>
  <li>Full control over wrapper styling using design tokens</li>
  </ul>
  </li>
  <li><b>Accessibility</b> - Fully accessible implementation with proper ARIA attributes and keyboard navigation</li>
  <li><b>State Management</b> - Comprehensive disabled state handling across all interactive elements</li>
  </ul>
  <br/>
  <h3>Usage Examples:</h3>
  <ul>
  <li>Basic file upload: \`<gd-input-file></gd-input-file>\` with a \`gd-change\` listener that reads \`event.detail.files\`</li>
  <li>Image selection: \`<gd-input-file accept="image/*" capture="environment"></gd-input-file>\`</li>
  <li>Enhanced styling: \`inputFile.styles = { border: '2px dashed', borderRadius: '8px' }\`</li>
  <li>Icon integration: \`inputFile.buttonProps = { variant: 'contained' }\` with a \`<gd-icon name="upload">\` child</li>
  </ul>
        `,
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
Default.args = { onClick: fn(), onChange: fn() };
Default.play = defaultActions;

export const Disabled: Story = {
  args: { disabled: true },
};
Disabled.play = disabledActions;

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};
Multiple.play = multipleActions;

export const WithAccept: Story = {
  args: {
    accept: 'image/*',
  },
};
WithAccept.play = withAcceptActions;

export const CustomLabel: Story = {
  args: {
    children: 'Pick a Photo',
  },
};

export const IconLabel: Story = {
  args: {
    buttonProps: {
      variant: 'text',
    },
    onClick: fn(),
    onChange: fn(),
  },
  render: (args) => {
    const input = createInputFile(args);
    input.append(element('gd-icon', { name: 'attachment' }));
    return input;
  },
};
IconLabel.play = iconLabelActions;

export const WithCustomStyles: Story = {
  args: {
    styles: {
      border: '2px dashed #FF6347',
      padding: '1rem',
      borderRadius: '4px',
      backgroundColor: '#fff8f0',
    },
  },
};

export const WithAccessibility: Story = {
  args: {
    children: 'Accessible Input File',
    'aria-label': 'Accessible InputFile',
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
    tags: ['a11y'],
  },
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('inputfile'),
};
DefaultTokens.parameters = {
  layout: 'padded',
};
