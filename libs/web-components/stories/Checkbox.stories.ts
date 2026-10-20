import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import type { GdCheckbox } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { column, row, storyParameters, typography } from './form-story-helpers';
import {
  defaultActions,
  controlledActions,
  indeterminateActions,
  disabledActions,
  sizesActions,
} from './Checkbox.stories.play';

type Args = Partial<
  Pick<GdCheckbox, 'checked' | 'disabled' | 'indeterminate' | 'size' | 'name' | 'value' | 'required'>
> & {
  children?: string;
  onValueChange?: (checked: boolean) => void;
};

type ChangeEvent = CustomEvent<{ checked: boolean }>;

const checkboxNode = ({ children, onValueChange, ...props }: Args) => {
  const node = element('gd-checkbox', props, children);
  node.addEventListener('gd-change', (event) => onValueChange?.((event as ChangeEvent).detail.checked));
  return node;
};

const meta = {
  title: 'Atoms/Checkbox',
  component: 'gd-checkbox',
  argTypes: {
    // State Controls
    checked: {
      description: 'Controls the checked state of the checkbox',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    indeterminate: {
      description: 'Displays the checkbox in an indeterminate (mixed) state',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    disabled: {
      description: 'Disables the checkbox interaction',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },

    // Identification
    name: {
      description: 'Name attribute of the checkbox input',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Identification',
      },
    },
    value: {
      description: 'Value attribute of the checkbox input',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Identification',
      },
    },

    // Layout & Presentation
    size: {
      description: 'Size of the checkbox',
      control: { type: 'select' },
      options: ['sm', 'md'],
      table: {
        type: { summary: 'CheckboxSize', detail: 'sm | md' },
        defaultValue: { summary: 'md' },
        category: 'Layout',
      },
    },

    // Events & Callbacks
    onValueChange: {
      description: 'Event fired (gd-change) when the checkbox value changes',
      action: 'Checkbox value changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
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
The \`Checkbox\` component provides a standard way for users to toggle a boolean value or indicate an indeterminate state.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>State Management</b>
<ul>
<li>Controlled mode: Write the <code>checked</code> property back from the <code>gd-change</code> listener to control state externally</li>
<li>Uncontrolled mode: Leave the <code>checked</code> property unset for internal state management</li>
<li>Indeterminate state for partial selections</li>
<li>The <code>gd-change</code> event fires when value changes</li>
</ul>
</li>
<li>
<b>Sizes</b>
<ul>
<li>Small (<code>sm</code>) - Compact checkbox</li>
<li>Medium (<code>md</code>) - Default checkbox size</li>
</ul>
</li>
<li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
<li><b>States</b> – Unchecked, checked, indeterminate, disabled</li>
<li><b>Theming</b> – Customizable via theme tokens</li>
</ul>
<br/>
<h3>Styling:</h3>
<ul>
<li><b>Theme Tokens</b>
<ul>
<li>Colors - Indicator fill, border, focus states</li>
<li>Sizes - Checkbox dimensions per size variant</li>
<li>Icons - Check and minus icon sizing</li>
</ul>
</li>
</ul>
`,
      },
    },
  },
  render: (args: Args) => checkboxNode(args),
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    children: 'Accept terms',
    onValueChange: fn(),
  },
  play: defaultActions,
  parameters: storyParameters(
    'Default checkbox with a label. Click to toggle between checked and unchecked states.',
    `<gd-checkbox>Accept terms</gd-checkbox>`
  ),
};

export const Controlled: Story = {
  play: controlledActions,
  render: ({ onValueChange }) => {
    const state = typography('span', 'Current state: ', 'Unchecked');
    const control = checkboxNode({
      checked: false,
      children: 'Controlled Checkbox',
      onValueChange: (value) => {
        onValueChange?.(value);
        control.checked = value;
        (state.lastChild as Text).data = value ? 'Checked' : 'Unchecked';
      },
    });
    return column({ gap: '16px' }, state, control);
  },
  parameters: storyParameters(
    'Controlled Checkbox - state is managed externally via the `checked` property. The `gd-change` listener updates the parent state.',
    `<gd-column gap="16px">
  <gd-typography>Current state: Unchecked</gd-typography>
  <gd-checkbox id="controlled">Controlled Checkbox</gd-checkbox>
</gd-column>

<script type="module">
  const checkbox = document.querySelector('#controlled');
  checkbox.checked = false;

  checkbox.addEventListener('gd-change', (event) => {
    console.log('Checkbox changed to:', event.detail.checked);
    checkbox.checked = event.detail.checked;
  });
</script>`
  ),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    children: 'Select all',
  },
  play: indeterminateActions,
  parameters: storyParameters(
    'Checkbox in the indeterminate (mixed) state. This is typically used for "select all" controls when only some items in a group are selected.',
    `<gd-checkbox indeterminate>Select all</gd-checkbox>`
  ),
};

export const Disabled: Story = {
  play: disabledActions,
  render: () =>
    column(
      { gap: '16px' },
      checkboxNode({ disabled: true, children: 'Disabled unchecked' }),
      checkboxNode({ disabled: true, checked: true, children: 'Disabled checked' }),
      checkboxNode({ disabled: true, indeterminate: true, children: 'Disabled indeterminate' })
    ),
  parameters: storyParameters(
    'Checkbox in disabled state across all visual states: unchecked, checked, and indeterminate. Disabled checkboxes cannot be interacted with.',
    `<gd-column gap="16px">
  <gd-checkbox disabled>Disabled unchecked</gd-checkbox>
  <gd-checkbox id="disabled-checked" disabled>Disabled checked</gd-checkbox>
  <gd-checkbox disabled indeterminate>Disabled indeterminate</gd-checkbox>
</gd-column>

<script type="module">
  document.querySelector('#disabled-checked').checked = true;
</script>`
  ),
};

export const Sizes: Story = {
  play: sizesActions,
  render: () =>
    row(
      { gap: '24px', alignItems: 'center' },
      checkboxNode({ size: 'sm', children: 'Small checkbox' }),
      checkboxNode({ size: 'md', children: 'Medium checkbox' })
    ),
  parameters: storyParameters(
    'Checkbox component in all available sizes: small (`sm`) and medium (`md`).',
    `<gd-row gap="24px" align-items="center">
  <gd-checkbox size="sm">Small checkbox</gd-checkbox>
  <gd-checkbox size="md">Medium checkbox</gd-checkbox>
</gd-row>`
  ),
};

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('checkbox'),
  parameters: {
    layout: 'padded',
  },
};
