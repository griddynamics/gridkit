import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GridKitIconName } from 'gd-design-library/icons';
import type { GdToggle } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { defaultActions, disabledActions, withCustomRenderActions } from './Toggle.stories.play';

type Args = Pick<GdToggle, 'items' | 'value' | 'disabled' | 'renderItemContent' | 'styles'> & {
  onValueChange?: (value: unknown) => void;
};

const meta = {
  title: 'Atoms/Toggle',
  component: 'gd-toggle',
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
      description: 'Event fired (gd-change) when the value changes',
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
        type: { summary: '(item: unknown) => Node | string' },
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
  render: ({ onValueChange, ...args }: Args) => {
    const toggle = element('gd-toggle', args);
    toggle.addEventListener('gd-change', (event) =>
      onValueChange?.((event as CustomEvent<{ value: unknown }>).detail.value)
    );
    return toggle;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    items: ['Option 1', 'Option 2', 'Option 3'],
    value: 'Option 1',
    onValueChange: fn(),
  },
  play: defaultActions,
};

export const Disabled: Story = {
  args: {
    items: ['Option 1', 'Option 2', 'Option 3'],
    value: 'Option 1',
    disabled: true,
  },
  play: disabledActions,
};

export const WithCustomRender: Story = {
  args: {
    items: [
      { label: 'Fire', value: 'home' },
      { label: 'Water', value: 'accountCircle' },
      { label: 'Earth', value: 'success' },
    ],
    value: 'fire',
    renderItemContent: (item) =>
      typeof item === 'string' ? item : element('gd-icon', { name: (item as { value: GridKitIconName }).value }),
  },
  play: withCustomRenderActions,
};

export const WithAccessibility: Story = {
  args: {
    items: ['Option 1', 'Option 2', 'Option 3'],
    value: 'Option 1',
  },
  tags: ['a11y'],
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
      const wrapper = document.createElement('div');
      const label = document.createElement('label');
      label.htmlFor = 'toggle-group';
      label.style.cssText = 'display: block; margin-bottom: 10px; font-weight: bold';
      label.textContent = 'Select an option:';
      const group = document.createElement('div');
      group.id = 'toggle-group';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Toggle options');
      group.append(story() as Node);
      wrapper.append(label, group);
      return wrapper;
    },
  ],
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('switchToggle'),
  parameters: {
    layout: 'padded',
  },
};
