import { useState } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Row, Button, Select, FlexContainer } from '@components';
import { defaultTheme } from '@tokens';
import { Modal, ModalProps } from './';
import {
  defaultActions,
  noEscapeCloseContentWithScrollActions,
  noClickOutsideCloseActions,
  customViewActions,
} from './Modal.stories.play';

const ModalWithMocks = (args: ModalProps) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);
  const handleClose = () => {
    action('On close.');
    setIsOpen(false);
  };

  return (
    <div>
      <button data-testid="open-modal" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={handleClose}
        footer={
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
        }
      />
    </div>
  );
};

// Meta-configuration for Storybook
const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: ModalWithMocks,
  tags: ['autodocs'],

  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open or closed (controlled by button in stories)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behavior',
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback function when the modal is closed',
      table: {
        type: { summary: '() => void' },
        category: 'Behavior',
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show or hide the close button',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: 'Behavior',
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Enable closing the modal with the Escape key',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Behavior',
      },
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Enable closing the modal when clicking outside (on the backdrop)',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
        category: 'Behavior',
      },
    },
    title: {
      control: 'text',
      description: 'Title of the modal',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    children: {
      control: 'text',
      description: 'Content inside the modal body',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    footer: {
      control: 'text',
      description: 'Footer content (e.g., buttons)',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content',
      },
    },
    styles: {
      control: 'object',
      description:
        'Custom CSS styles for the modal. Supports all standard CSS properties including display, overflow, dimensions (width, height, minWidth, maxWidth, minHeight, maxHeight), spacing (margin, padding and their variants), positioning (position, top, right, bottom, left, zIndex), flexbox properties (flexDirection, justifyContent, alignItems, flex, gap, etc.), and more.',
      table: {
        type: { summary: 'CSSObject' },
        defaultValue: { summary: '{}' },
        category: 'Styling & Appearance',
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Modal\` component is a versatile and fully customizable UI element that provides an overlay dialog window for focused interactions.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Structure Options</b>
<ul>
<li>Standard layout with header, body, footer</li>
<li>Custom layout mode for full control</li>
<li>Flexible content positioning</li>
</ul>
</li>
<li>
<b>Close Behaviors</b>
<ul>
<li>Header close button</li>
<li>Escape key dismissal</li>
<li>Overlay click handling</li>
</ul>
</li>
<li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
<li><b>Focus Management</b> – Trap focus within modal</li>
<li><b>Customization</b> – Themeable styles and layouts</li>
</ul>
<br/>
<h3>Layout Props:</h3>
<ul>
<li><b>Dimensions</b>
<ul>
<li><code>width/height</code>: Size control</li>
<li><code>maxWidth/maxHeight</code>: Size limits</li>
</ul>
</li>
<li><b>Spacing</b>
<ul>
<li><code>padding</code>: Internal spacing</li>
<li><code>margin</code>: External spacing</li>
</ul>
</li>
<li><code>position</code>: Overlay positioning</li>
<li><code>zIndex</code>: Stack order control</li>
</ul>
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;
const selectItemsList = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: { test: 'option2' } },
  { name: 'Option 3', value: 'option3' },
  { name: 'Option 4', value: 'option4' },
  { name: 'Option 5', value: 'option5' },
  { name: 'Option 6', value: 'option6' },
  { name: 'Option 7', value: 'option7' },
  { name: 'Option 8', value: 'option8' },
  { name: 'Option 9', value: 'option9' },
  { name: 'Option 10', value: 'option10' },
];
// Default story with an open button and footer close
export const Default: Story = {
  args: {
    isOpen: false,
    showCloseButton: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    title: 'Modal Title',
    children: (
      <FlexContainer gap="10px">
        <Row>This is the modal content.</Row>
        <Select items={selectItemsList} />
        <Select items={selectItemsList} />
        <Select items={selectItemsList} />
      </FlexContainer>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<Modal 
  isOpen={isOpen} 
  onClose={handleClose} 
  title="Modal Title"
  showCloseButton={true}
  closeOnEscape={true}
  closeOnClickOutside={true}
>
  <FlexContainer gap="10px">
    <Row>This is the modal content.</Row>
    <Select items={selectItemsList} />
  </FlexContainer>
</Modal>`,
      },
    },
  },
};
Default.play = defaultActions;

// Modal without Escape key closing
export const NoEscapeCloseContentWithScroll: Story = {
  args: {
    ...Default.args,
    children: (
      <FlexContainer>
        <Select items={selectItemsList} />
        <Row>
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscingLorem
          ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit.
        </Row>
        <Select items={selectItemsList} />
      </FlexContainer>
    ),
    closeOnEscape: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<Modal 
  isOpen={isOpen} 
  onClose={handleClose} 
  title="Modal Title"
  closeOnEscape={false}
>
  <FlexContainer>
    <Select items={selectItemsList} />
    <Row>Long scrollable content...</Row>
  </FlexContainer>
</Modal>`,
      },
    },
  },
};
NoEscapeCloseContentWithScroll.play = noEscapeCloseContentWithScrollActions;

// Modal that doesn't close on backdrop click
export const NoClickOutsideClose: Story = {
  args: {
    ...Default.args,
    title: 'Modal with Click Outside Disabled',
    children: (
      <FlexContainer gap="10px">
        <Row>This modal cannot be closed by clicking outside. You must use the close button or Escape key.</Row>
        <Select items={selectItemsList} />
      </FlexContainer>
    ),
    closeOnClickOutside: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal with Click Outside Disabled"
  closeOnClickOutside={false}
>
  <FlexContainer gap="10px">
    <Row>This modal cannot be closed by clicking outside. You must use the close button or Escape key.</Row>
    <Select items={selectItemsList} />
  </FlexContainer>
</Modal>`,
      },
    },
  },
};
NoClickOutsideClose.play = noClickOutsideCloseActions;

// Custom view modal (no standard header/body/footer structure)
export const CustomView: Story = {
  args: {
    isOpen: false,
    isCustomView: true,
    children: (
      <div style={{ padding: '40px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 20px 0' }}>Custom modal content</h2>
        <p>This modal uses isCustomView mode, bypassing the standard header/body/footer structure.</p>
        <Button variant="primary" onClick={() => action('Custom action clicked')}>
          Custom Action
        </Button>
      </div>
    ),
  },
};
CustomView.play = customViewActions;

export const WithAccessibility: StoryFn<ModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    action('On close.');
    setIsOpen(false);
  };

  return (
    <div>
      <button data-testid="open-modal" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={handleClose}
        title="Confirm Action"
        showCloseButton={true}
        closeOnEscape={true}
        closeOnClickOutside={true}
        footer={
          <Row gutter="10px">
            <Button variant="primary" onClick={handleClose}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Row>
        }
      >
        Are you sure you want to proceed with this action? This cannot be undone.
      </Modal>
    </div>
  );
};
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ modal: defaultTheme.modal }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
