import React, { ReactNode } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Dropdown, DropdownItem, Input, Label, FlexContainer } from '@components';
import { SelectContext } from '@components/atoms/Select/hooks/useSelectContext';
import { DropdownContext } from '@components/molecules/Dropdown/hooks/useDropdown';
import { DROPDOWN_ITEMS_LIST } from './constants';
import { defaultActions, withCheckboxItemsActions } from './Dropdown.stories.play';

const MockDropdownProvider = ({ children }: { children: React.ReactNode }) => (
  <DropdownContext.Provider
    value={{
      onSelect: action('onDropdownSelect'),
    }}
  >
    {children}
  </DropdownContext.Provider>
);

const MockSelectProvider = ({ children }: { children: ReactNode; activeItemIndex?: number; activeIndex?: number }) => (
  <SelectContext.Provider value={{}}>{children}</SelectContext.Provider>
);

// Define the meta configuration for Storybook
const meta: Meta<typeof Dropdown> = {
  title: 'Molecules/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <MockDropdownProvider>
        <MockSelectProvider>
          <FlexContainer minHeight="150px" minWidth="250px">
            <Story />
          </FlexContainer>
        </MockSelectProvider>
      </MockDropdownProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    // Content
    children: {
      description: 'Content to be rendered inside the dropdown',
      control: 'object',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: undefined },
        category: 'Content',
      },
    },
    // Appearance & Styling
    styles: {
      control: 'object',
      description: 'CSS style overrides for the wrapper element',
      table: {
        type: { summary: 'BoxCssComponentProps<HTMLDivElement>' },
        defaultValue: { summary: '{}' },
        category: 'Appearance & Styling',
      },
    },
    className: {
      description: 'Additional CSS class names to apply to the dropdown',
      control: 'text',
      table: {
        category: 'Appearance & Styling',
      },
    },
    // Behavior
    onKeyDown: {
      description: 'Keyboard event handler for dropdown navigation',
      action: 'keyDown',
      table: {
        category: 'Behavior',
      },
    },
    // Accessibility
    role: {
      description: 'ARIA role for the dropdown',
      control: 'text',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'listbox' },
      },
    },
    'aria-label': {
      description: 'Accessibility label for the dropdown',
      control: 'text',
      table: {
        category: 'Accessibility',
      },
    },
    'aria-expanded': {
      description: 'Indicates whether the dropdown is expanded',
      control: 'boolean',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'false' },
      },
    },
    // Box Props - Layout & Sizing
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    width: {
      description: 'CSS width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    height: {
      description: 'CSS height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    maxHeight: {
      description: 'CSS max-height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    // Box Props - Spacing
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    // Box Props - Flexbox & Layout
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
  },

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Dropdown\` component is a customizable UI element that displays a list of selectable options.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Flexible Content</b>
  <ul>
  <li>Custom trigger elements</li>
  <li>Configurable dropdown items</li>
  <li>Support for checkboxes and custom content</li>
  </ul>
  </li>
  <li>
  <b>Keyboard Navigation</b>
  <ul>
  <li>Arrow key navigation between items</li>
  <li>Enter/Space to select</li>
  <li>Escape to close dropdown</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard support</li>
  <li><b>States</b> – Open, closed, disabled states</li>
  <li><b>Positioning</b> – Automatic positioning relative to trigger</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width/height</code>: Exact dimensions</li>
  <li><code>minWidth/minHeight</code>: Minimum constraints</li>
  <li><code>maxWidth/maxHeight</code>: Maximum constraints</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Overall spacing</li>
  <li><code>marginTop/paddingTop</code>: Top spacing</li>
  <li><code>marginRight/paddingRight</code>: Right spacing</li>
  <li><code>marginBottom/paddingBottom</code>: Bottom spacing</li>
  <li><code>marginLeft/paddingLeft</code>: Left spacing</li>
  </ul>
  </li>
  <li><code>position</code>: CSS position property</li>
  <li><code>overflow</code>: Content overflow behavior</li>
  </ul>
          `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

// Default story: Basic Dropdown with items
export const Default: Story = {
  render: (args) => (
    <Dropdown {...args}>
      {DROPDOWN_ITEMS_LIST.map((item) => (
        <DropdownItem key={item.value} name={item.name} value={item.value} />
      ))}
    </Dropdown>
  ),
};
Default.play = defaultActions;

// Story: Dropdown with checkbox items
export const WithCheckboxItems: Story = {
  render: (args) => (
    <Dropdown {...args}>
      {DROPDOWN_ITEMS_LIST.map((item) => (
        <DropdownItem key={item.value} name={item.name} value={item.value}>
          <Label key={item.value}>
            <Input variant="checkbox" />
            {item.name}
          </Label>
        </DropdownItem>
      ))}
    </Dropdown>
  ),
};
WithCheckboxItems.play = withCheckboxItemsActions;

export const WithAccessibility: Story = {
  render: (args) => (
    <Dropdown {...args}>
      {DROPDOWN_ITEMS_LIST.map((item) => (
        <DropdownItem key={item.value} name={item.name} value={item.value} />
      ))}
    </Dropdown>
  ),
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

export const DefaultTokens: StoryFn = () => (
  <TokenViewer tokens={{ select: { dropdown: defaultTheme.select.dropdown } }} />
);
DefaultTokens.parameters = {
  layout: 'padded',
};
