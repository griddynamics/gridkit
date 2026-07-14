import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Icon } from '@components/atoms/Icon';
import { defaultTheme } from '@tokens';

import { Toggle, ToggleProps } from '.';
import { defaultActions, disabledActions, withCustomRenderActions } from './Toggle.stories.play';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  argTypes: {
    items: {
      control: 'object',
      description: 'List of items to toggle between',
      table: {
        type: { summary: 'Array<string | { label: string; value: string }>' },
        defaultValue: { summary: '[]' },
      },
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
      table: {
        type: { summary: 'string | unknown' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onValueChange: {
      action: 'value changed',
      description: 'Function triggered when the value changes',
      table: {
        type: { summary: '(value: unknown) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with the component',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    renderItemContent: {
      description: 'Custom render function for each item',
      table: {
        type: { summary: '(item: unknown) => ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      description: 'Custom styles for the component',
      table: {
        type: { summary: 'InlineBoxStyles' },
        defaultValue: { summary: '{}' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Toggle\` component is a versatile UI element that allows users to switch between multiple options.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Input Types</b>
<ul>
<li>String arrays for simple options</li>
<li>Object arrays with label and value properties</li>
<li>Custom rendering support</li>
</ul>
</li>
<li>
<b>Interaction Modes</b>
<ul>
<li>Controlled state management</li>
<li>Uncontrolled operation</li>
<li>Disabled state support</li>
</ul>
</li>
<li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
<li><b>Theming</b> – Integration with global theme system</li>
<li><b>Customization</b> – Flexible item rendering</li>
</ul>
<br/>
<h3>Usage Examples:</h3>
<ul>
<li>Content filtering</li>
<li>View switching</li>
<li>Option selection</li>
<li>Navigation toggles</li>
</ul>
        `,
      },
    },
  },
} as Meta<typeof Toggle>;

export default meta;

const Template: StoryFn<ToggleProps<unknown>> = (args) => {
  const [val, setVal] = useState(args.value);

  const handleChange = (newVal: unknown) => {
    setVal(newVal);
    args.onValueChange?.(newVal);
  };

  return <Toggle {...args} value={val} onValueChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  items: ['Option 1', 'Option 2', 'Option 3'],
  value: 'Option 1',
  onValueChange: fn(),
};
Default.play = defaultActions;

export const Disabled = Template.bind({});
Disabled.args = {
  items: ['Option 1', 'Option 2', 'Option 3'],
  value: 'Option 1',
  disabled: true,
};
Disabled.play = disabledActions;

export const WithCustomRender = Template.bind({});
WithCustomRender.args = {
  items: [
    { label: 'Fire', value: 'home' },
    { label: 'Water', value: 'accountCircle' },
    { label: 'Earth', value: 'success' },
  ],
  value: 'fire',
  renderItemContent: (item) => (typeof item === 'string' ? item : <Icon name={item.value as string} />),
};
WithCustomRender.play = withCustomRenderActions;

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  items: ['Option 1', 'Option 2', 'Option 3'],
  value: 'Option 1',
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
WithAccessibility.decorators = [
  (Story) => (
    <>
      <label htmlFor="toggle-group" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
        Select an option:
      </label>
      <div id="toggle-group" role="group" aria-label="Toggle options">
        <Story />
      </div>
    </>
  ),
];

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ switchToggle: defaultTheme.switchToggle }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
