import { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { StoryObj, Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { DropdownItem, SelectContext } from '@components';
import { defaultActions, activeActions, interactiveWithDefinedOnSelectActions } from './DropdownItem.stories.play';

const MockSelectProvider = ({
  children,
  value = -1,
  name = 'test',
}: {
  children: ReactNode;
  value?: number;
  name?: string;
}) => (
  <SelectContext.Provider
    value={{
      itemIdentifier: (a, b) => a?.value === b?.value,
      value: { name, value },
    }}
  >
    {children}
  </SelectContext.Provider>
);

// Storybook Meta configuration
const meta: Meta<typeof DropdownItem> = {
  title: 'Molecules/DropdownItem',
  component: DropdownItem,
  decorators: [
    (Story) => (
      <MockSelectProvider>
        <Story />
      </MockSelectProvider>
    ),
  ],

  argTypes: {
    children: {
      description: 'Content of the dropdown item',
      control: { type: 'text' },
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      description: 'Value of the dropdown item',
      control: { type: 'object' },
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: undefined },
      },
    },
    name: {
      description: 'Name of the dropdown item',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    onSelect: {
      description: 'Callback when item is selected',
      action: 'selected',
      table: {
        type: {
          summary: 'SelectOnSelect = <T = HTMLDivElement>(props: OnSelectProps<T>) => void',
          detail:
            'OnSelectProps<T = HTMLDivElement> {\n' +
            '  event: MouseEvent<T> | KeyboardEvent<T> | ChangeEvent<T>;\n' +
            '  data?: Option;\n' +
            '  index?: number;\n' +
            '}',
        },
        defaultValue: { summary: undefined },
      },
    },
    className: {
      description: 'Custom CSS class',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`DropdownItem\` component is designed to work within the \`SelectContext\` context and serves as a selectable item in dropdown menus and select components. It receives its selection state and handling through the context integration.
  <br/>
  <br/>
  \`\`\`tsx
import { DropdownItem, SelectContext } from "gd-design-library";

const GDOptions = ({
  value = -1,
  name = 'test',
}) => (
  <SelectContext.Provider
    value={{
      itemIdentifier: (a, b) => a?.value === b?.value,
      value: { name, value },
    }}
  >
    <DropdownItem name="Item 1" value={-1}>
      Active Dropdown Item
    </DropdownItem>
  </SelectContext.Provider>
)
  \`\`\`
  <h3>Key Features:</h3>
  <ul>
  <li><b>SelectContext Integration</b> - Fully integrated with SelectContext for state management and selection handling</li>
  <li><b>Selection Support</b> - Handles both single and multiple selection patterns through context</li>
  <li><b>Accessibility</b> - Keyboard navigation and ARIA support</li>
  <li><b>Customization</b> - Flexible styling through custom classes</li>
  <li><b>State Management</b> - Active and hover states managed via context</li>
  </ul>
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DropdownItem>;

// Default story
export const Default: Story = {
  args: {
    value: { index: 0, label: 'Item 1' },
    name: 'Dropdown Item',
  },
};
Default.play = defaultActions;

export const Active: Story = {
  args: {
    value: -1,
    name: 'Active Dropdown Item',
  },
};
Active.play = activeActions;

export const InteractiveWithDefinedOnSelect: Story = {
  args: {
    children: 'Click Me',
    value: { index: 2, label: 'Item 3' },
    name: 'Item 3',
    onSelect: fn(),
  },
};
InteractiveWithDefinedOnSelect.play = interactiveWithDefinedOnSelectActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ select: { item: defaultTheme.select.item } }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
