import { PropsWithChildren, useState } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Icon, Label } from '@components';
import { defaultTheme } from '@tokens';
import { InputColorVariant, InputRole, InputVariantType } from '@types';
import {
  primaryDefaultWithLabelAndHelperTextActions,
  successWithLabelAndHelperTextActions,
  warningWithLabelAndHelperTextActions,
  errorWithLabelAndHelperTextActions,
  disabledActions,
  readOnlyActions,
  wrapperAsSpanActions,
  withAdornmentsActions,
  withStartAdornmentActions,
  withEndAdornmentAsIconActions,
  checkboxWithLabelActions,
  radioControlledWithLabelActions,
  radioGroupWithLabelActions,
} from './Input.stories.play';

import { COMPONENT_NAME } from './constants';
import { Input, InputFieldProps, InputFieldRestHtmlProps } from './';

// Common args for stories to reduce redundancy
const COMMON_ARGS = {
  variant: InputVariantType.Text,
  color: 'primary' as InputColorVariant,
  role: InputRole.Textbox,
  name: 'input',
  width: '100%',
  disabled: false,
  required: false,
  readOnly: false,
  checked: false,
  placeholder: 'placeholder',
  defaultValue: 'defaultValue',
  tabIndex: 0,
  className: '',
  ariaRequired: false,
  debounceCallbackTime: 300,
  styles: {},
  adornmentStart: '',
  adornmentEnd: '',
  label: '',
  helperText: '',
  onChange: action('changed'),
  onFocus: action('onFocus'),
  onBlur: action('onBlur'),
  onClick: action('onClick'),
};

const createStory = (args: PropsWithChildren<InputFieldProps & InputFieldRestHtmlProps>): StoryObj<typeof Input> => ({
  args: { ...COMMON_ARGS, ...args },
});

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,

  argTypes: {
    // Core Properties
    name: {
      description: 'Input field name attribute',
      table: {
        category: 'Core Properties',
        defaultValue: { summary: 'input' },
        type: { summary: 'string' },
      },
    },
    variant: {
      description: 'Input field type variant',
      options: Object.values(InputVariantType),
      table: {
        category: 'Core Properties',
        defaultValue: { summary: InputVariantType.Text },
        type: { summary: 'InputVariantType' },
      },
      control: { type: 'select' },
    },
    wrapperAs: {
      description: 'HTML element or component to wrap the input',
      table: {
        category: 'Core Properties',
        defaultValue: { summary: 'label' },
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
      },
    },

    // Appearance & Styling
    color: {
      description: 'Color variant of the input',
      options: ['primary', 'success', 'warning', 'error'],
      table: {
        category: 'Appearance & Styling',
        defaultValue: { summary: "'primary'" },
        type: { summary: 'InputColorVariant' },
      },
      control: { type: 'select' },
    },
    width: {
      description: 'Width of the input field',
      table: {
        category: 'Appearance & Styling',
        defaultValue: { summary: '100%' },
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional CSS classes',
      table: {
        category: 'Appearance & Styling',
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    styles: {
      description: 'Custom styles object',
      table: {
        category: 'Appearance & Styling',
        defaultValue: { summary: '{}' },
        type: { summary: 'React.CSSProperties' },
      },
    },

    // Content & Labels
    placeholder: {
      description: 'Placeholder text',
      table: {
        category: 'Content & Labels',
        defaultValue: { summary: 'placeholder' },
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description: 'Default value of the input',
      table: {
        category: 'Content & Labels',
        defaultValue: { summary: 'defaultValue' },
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Input label text',
      table: {
        category: 'Content & Labels',
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    helperText: {
      description: 'Helper text below input',
      table: {
        category: 'Content & Labels',
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    adornmentStart: {
      description: 'Start adornment element',
      table: {
        category: 'Content & Labels',
        defaultValue: { summary: '' },
        type: { summary: 'ReactNode' },
      },
    },
    adornmentEnd: {
      description: 'End adornment element',
      table: {
        category: 'Content & Labels',
        defaultValue: { summary: '' },
        type: { summary: 'ReactNode' },
      },
    },

    // State & Behavior
    disabled: {
      description: 'Disabled state of the input',
      table: {
        category: 'State & Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    required: {
      description: 'Required state of the input',
      table: {
        category: 'State & Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    readOnly: {
      description: 'Read-only state of the input',
      table: {
        category: 'State & Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    checked: {
      description: 'Checked state for checkbox/radio inputs',
      table: {
        category: 'State & Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    debounceCallbackTime: {
      description: 'Debounce timeout for onChange callback',
      table: {
        category: 'State & Behavior',
        defaultValue: { summary: '300' },
        type: { summary: 'number' },
      },
    },

    // Accessibility
    role: {
      description: 'ARIA role of the input element',
      options: Object.values(InputRole),
      table: {
        category: 'Accessibility',
        defaultValue: { summary: InputRole.Textbox },
        type: { summary: 'InputRole' },
      },
      control: { type: 'select' },
    },
    tabIndex: {
      description: 'Tab index for keyboard navigation',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
      },
    },
    ariaRequired: {
      description: 'ARIA required attribute',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    ariaDescribedBy: {
      description: 'ARIA describedby attribute',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
      },
    },

    // Events
    onChange: {
      description: 'onChange event handler',
      table: {
        category: 'Events',
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    onFocus: {
      description: 'onFocus event handler',
      table: {
        category: 'Events',
        type: { summary: '(event: FocusEvent<HTMLInputElement>) => void' },
      },
    },
    onBlur: {
      description: 'onBlur event handler',
      table: {
        category: 'Events',
        type: { summary: '(event: FocusEvent<HTMLInputElement>) => void' },
      },
    },
    onClick: {
      description: 'onClick event handler',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent<HTMLInputElement>) => void' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Input\` component is a versatile and customizable form element that handles various types of user input with extensive customization options.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Input Variants</b>
  <ul>
  <li>Text - Standard text input</li>
  <li>Password - Secured password entry</li>
  <li>Email - Email validation format</li>
  <li>Checkbox - Single toggle selection</li>
  <li>Radio - Option from a group</li>
  </ul>
  </li>
  <li>
  <b>Visual Feedback</b>
  <ul>
  <li>Success/Error/Warning states</li>
  <li>Disabled and readonly modes</li>
  <li>Focus and hover effects</li>
  </ul>
  </li>
  <li>
  <b>Customization</b>
  <ul>
  <li>Custom styles and themes</li>
  <li>Tailwind CSS support</li>
  <li>Flexible width control</li>
  </ul>
  </li>
  <li>
  <b>Enhanced UX</b>
  <ul>
  <li>Debounced input handling</li>
  <li>Label and helper text</li>
  <li>Custom adornments</li>
  </ul>
  </li>
  <li><b>Accessibility</b> - ARIA attributes and keyboard navigation</li>
  </ul>
  <br/>
  <h3>Event Handlers:</h3>
  <ul>
  <li><b>onChange</b>: Input value changes</li>
  <li><b>onFocus</b>: Input receives focus</li>
  <li><b>onBlur</b>: Input loses focus</li>
  <li><b>onClick</b>: Input is clicked</li>
  </ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — Lit custom element (conditional).</b> Owns label, helper text, border and controlled-value semantics including a verified cursor-stability guard. Conditional on ElementInternals form participation, which is not implemented yet — a form control that does not submit is not a replacement for one that does. Ported as &lt;gd-input&gt;: 1.83 kB gzip vs 18.99 kB.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
};

export default meta;

export const PrimaryDefaultWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: `Default ${COMPONENT_NAME}`,
  color: 'primary',
  onChange: fn(),
});
PrimaryDefaultWithLabelAndHelperText.play = primaryDefaultWithLabelAndHelperTextActions;

export const SuccessWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: `Success ${COMPONENT_NAME}`,
  color: 'success',
});
SuccessWithLabelAndHelperText.play = successWithLabelAndHelperTextActions;

export const WarningWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: `Warning ${COMPONENT_NAME}`,
  color: 'warning',
});
WarningWithLabelAndHelperText.play = warningWithLabelAndHelperTextActions;

export const ErrorWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: `Error ${COMPONENT_NAME}`,
  color: 'error',
});
ErrorWithLabelAndHelperText.play = errorWithLabelAndHelperTextActions;

export const Disabled = createStory({
  label: 'Label',
  defaultValue: `Disabled ${COMPONENT_NAME}`,
  disabled: true,
});
Disabled.play = disabledActions;

export const ReadOnly = createStory({
  defaultValue: `ReadOnly ${COMPONENT_NAME}`,
  readOnly: true,
});
ReadOnly.play = readOnlyActions;

export const WrapperAsSpan = createStory({
  defaultValue: `Input wrapper span`,
  wrapperAs: 'span',
});
WrapperAsSpan.play = wrapperAsSpanActions;

export const WithAdornments = createStory({
  defaultValue: 'Input with adornments',
  adornmentStart: <span style={{ padding: '0 0 0 10px', display: 'flex', color: '#838383' }}>€</span>,
  adornmentEnd: <span style={{ padding: '0 10px 0 0', display: 'flex', color: '#838383' }}>.00</span>,
});
WithAdornments.play = withAdornmentsActions;

export const WithStartAdornment = createStory({
  variant: 'email',
  defaultValue: 'user@example.com',
  adornmentStart: <span style={{ padding: '0 0 0 10px', display: 'flex', color: '#838383' }}>@</span>,
});
WithStartAdornment.play = withStartAdornmentActions;

export const WithEndAdornmentAsIcon: StoryFn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      name="test"
      width="150px"
      variant={showPassword ? InputVariantType.Text : InputVariantType.Password}
      defaultValue="qwerty"
      adornmentEnd={
        <span style={{ padding: '0 10px 0 0', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
          <Icon name="eye" width={18} height={18} fill="#838383" />
        </span>
      }
    />
  );
};
WithEndAdornmentAsIcon.play = withEndAdornmentAsIconActions;

export const DefaultWithTailwind = createStory({
  defaultValue: `Default with tailwind ${COMPONENT_NAME}`,
  className: 'border-2 px-3 py-2 rounded-xl text-xl font-bold underline',
});

export const CustomStyles = createStory({
  defaultValue: `CustomStyles ${COMPONENT_NAME}`,
  styles: { backgroundColor: 'lightblue', border: 'black', padding: '1rem' },
});

export const CheckboxWithLabel: StoryFn = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Label>
      <Input
        name="test"
        checked={isChecked}
        role={InputRole.Checkbox}
        variant={InputVariantType.Checkbox}
        onChange={(e) => {
          setIsChecked(!isChecked);
          action('changed')(e);
        }}
      />
      Label
    </Label>
  );
};
CheckboxWithLabel.play = checkboxWithLabelActions;

export const RadioControlledWithLabel: StoryFn = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Label>
      <Input
        name="test"
        checked={isChecked}
        role={InputRole.Radio}
        variant={InputVariantType.Radio}
        onChange={(e) => {
          setIsChecked(!isChecked);
          action('changed')(e);
        }}
      />
      Label
    </Label>
  );
};
RadioControlledWithLabel.play = radioControlledWithLabelActions;

export const RadioGroupWithLabel: StoryFn = () => (
  <div>
    {['1', '2', '3'].map((value, index) => (
      <Label key={index}>
        <Input
          key={index}
          wrapperAs="span"
          name="test_group"
          onChange={action('changed')}
          variant={InputVariantType.Radio}
          color="primary"
          value={value}
          defaultChecked={value === '1'}
        />
        {`Label ${value}`}
      </Label>
    ))}
  </div>
);
RadioGroupWithLabel.play = radioGroupWithLabelActions;

export const WithAccessibility: StoryObj<typeof Input> = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Input
        {...args}
        label="Email"
        helperText={<span id="error-id">Error message</span>}
        color="error"
        ariaDescribedBy="error-id"
      />
      <Input
        variant={InputVariantType.Checkbox}
        role={InputRole.Checkbox}
        name="terms"
        aria-label="terms"
        label="Agree to terms"
      />
    </div>
  ),
};
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
    options: {
      rules: {
        'form-field-multiple-labels': { enabled: false },
      },
    },
  },
  docs: {
    disable: true,
  },
  tags: ['a11y'],
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ input: defaultTheme.input }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
