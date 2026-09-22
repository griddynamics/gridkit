import { useState } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Column, Row, Typography } from '@components';
import { defaultTheme } from '@tokens';

import { Checkbox } from './';
import {
  defaultActions,
  controlledActions,
  indeterminateActions,
  disabledActions,
  sizesActions,
} from './Checkbox.stories.play';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
      description: 'Callback fired when the checkbox value changes',
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
<li>Controlled mode: Provide <code>checked</code> prop to control state externally</li>
<li>Uncontrolled mode: Omit <code>checked</code> prop for internal state management</li>
<li>Indeterminate state for partial selections</li>
<li><code>onValueChange</code> callback fires when value changes</li>
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
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — Lit custom element (conditional).</b> Owns indeterminate state and a custom indicator that native input styling cannot reproduce. Conditional on ElementInternals form participation. Note the ported &lt;gd-checkbox&gt; must declare checked as a JS property only, because an HTML boolean attribute cannot express &quot;unset&quot;. 1.63 kB gzip vs 24.99 kB.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
} as Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    children: 'Accept terms',
    onValueChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default checkbox with a label. Click to toggle between checked and unchecked states.',
      },
      source: {
        code: `<Checkbox>Accept terms</Checkbox>`,
      },
    },
  },
};
Default.play = defaultActions;

export const Controlled: StoryObj<typeof Checkbox> = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(false);

    const handleChange = (value: boolean) => {
      action('onValueChange')(value);
      setChecked(value);
    };

    return (
      <Column gap="16px">
        <Typography>Current state: {checked ? 'Checked' : 'Unchecked'}</Typography>
        <Checkbox checked={checked} onValueChange={handleChange}>
          Controlled Checkbox
        </Checkbox>
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Controlled Checkbox - state is managed externally via `checked` prop. The `onValueChange` callback updates the parent state.',
      },
      source: {
        code: `import { useState } from 'react';
import { Checkbox, Column, Typography } from 'gd-design-library';

const Example = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (value: boolean) => {
    console.log('Checkbox changed to:', value);
    setChecked(value);
  };

  return (
    <Column gap="16px">
      <Typography>Current state: {checked ? 'Checked' : 'Unchecked'}</Typography>
      <Checkbox checked={checked} onValueChange={handleChange}>
        Controlled Checkbox
      </Checkbox>
    </Column>
  );
};`,
      },
    },
  },
};
Controlled.play = controlledActions;

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    children: 'Select all',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox in the indeterminate (mixed) state. This is typically used for "select all" controls when only some items in a group are selected.',
      },
      source: {
        code: `<Checkbox indeterminate>Select all</Checkbox>`,
      },
    },
  },
};
Indeterminate.play = indeterminateActions;

export const Disabled: Story = {
  render: () => (
    <Column gap="16px">
      <Checkbox disabled>Disabled unchecked</Checkbox>
      <Checkbox disabled checked>
        Disabled checked
      </Checkbox>
      <Checkbox disabled indeterminate>
        Disabled indeterminate
      </Checkbox>
    </Column>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox in disabled state across all visual states: unchecked, checked, and indeterminate. Disabled checkboxes cannot be interacted with.',
      },
      source: {
        code: `<Column gap="16px">
  <Checkbox disabled>Disabled unchecked</Checkbox>
  <Checkbox disabled checked>Disabled checked</Checkbox>
  <Checkbox disabled indeterminate>Disabled indeterminate</Checkbox>
</Column>`,
      },
    },
  },
};
Disabled.play = disabledActions;

export const Sizes: Story = {
  render: () => (
    <Row gap="24px" alignItems="center">
      <Checkbox size="sm">Small checkbox</Checkbox>
      <Checkbox size="md">Medium checkbox</Checkbox>
    </Row>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox component in all available sizes: small (`sm`) and medium (`md`).',
      },
      source: {
        code: `<Row gap="24px" alignItems="center">
  <Checkbox size="sm">Small checkbox</Checkbox>
  <Checkbox size="md">Medium checkbox</Checkbox>
</Row>`,
      },
    },
  },
};
Sizes.play = sizesActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ checkbox: defaultTheme.checkbox }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
