import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import type { GdInput } from '../src';
import { defaultTokenViewer, element } from './helpers';
import {
  checkboxWithLabelActions,
  disabledActions,
  errorWithLabelAndHelperTextActions,
  primaryDefaultWithLabelAndHelperTextActions,
  radioControlledWithLabelActions,
  radioGroupWithLabelActions,
  readOnlyActions,
  successWithLabelAndHelperTextActions,
  warningWithLabelAndHelperTextActions,
  withAdornmentsActions,
  withEndAdornmentAsIconActions,
  withStartAdornmentActions,
  wrapperAsSpanActions,
} from './Input.stories.play';

const COMPONENT_NAME = 'Input';
const inputVariants = [
  'text',
  'password',
  'email',
  'search',
  'url',
  'tel',
  'date',
  'time',
  'month',
  'week',
  'color',
  'range',
  'number',
  'radio',
  'checkbox',
];
const inputRoles = ['textbox', 'spinbutton', 'checkbox', 'radio', 'radiogroup', 'combobox'];

type Handler = (event: Event) => void;
type Args = Partial<
  Pick<
    GdInput,
    | 'variant'
    | 'color'
    | 'role'
    | 'name'
    | 'width'
    | 'disabled'
    | 'required'
    | 'readOnly'
    | 'checked'
    | 'placeholder'
    | 'defaultValue'
    | 'value'
    | 'tabIndex'
    | 'styles'
    | 'label'
    | 'helperText'
    | 'debounceCallbackTime'
    | 'wrapperAs'
    | 'ariaDescribedBy'
  >
> & {
  className?: string;
  ariaRequired?: boolean;
  adornmentStart?: string;
  adornmentEnd?: string;
  onChange?: Handler;
  onFocus?: Handler;
  onBlur?: Handler;
  onClick?: Handler;
};

// Common args for stories to reduce redundancy
const COMMON_ARGS: Args = {
  variant: 'text',
  color: 'primary',
  role: 'textbox',
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

type Story = StoryObj<Args>;
const createStory = (args: Args): Story => ({ args: { ...COMMON_ARGS, ...args } });

/** Wrap a plain string in a slotted span; the custom element renders the slot inside its adornment wrapper. */
const adornment = (slot: 'adornment-start' | 'adornment-end', content: string | Node, style = '') => {
  const node = document.createElement('span');
  node.slot = slot;
  node.style.cssText = style;
  node.append(content);
  return node;
};

/** Build the custom element from story args; handlers become listeners for the matching events. */
const createInput = (args: Args) => {
  const { className, ariaRequired, adornmentStart, adornmentEnd, onChange, onFocus, onBlur, onClick, ...props } = args;
  const input = element('gd-input', {
    ...props,
    wrapperClass: className ?? '',
    ariaRequiredValue: ariaRequired ?? false,
  } as Partial<GdInput>);
  if (adornmentStart) input.append(adornment('adornment-start', adornmentStart));
  if (adornmentEnd) input.append(adornment('adornment-end', adornmentEnd));
  if (onChange) input.addEventListener('gd-change', onChange);
  if (onFocus) input.addEventListener('focusin', onFocus);
  if (onBlur) input.addEventListener('focusout', onBlur);
  if (onClick) input.addEventListener('click', onClick);
  return input;
};

const adornmentStyle = (padding: string) => `padding:${padding};display:flex;color:#838383`;

const category = (name: string, summary: string, defaultValue?: string) => ({
  category: name,
  ...(defaultValue === undefined ? {} : { defaultValue: { summary: defaultValue } }),
  type: { summary },
});

const meta = {
  title: 'Atoms/Input',
  component: 'gd-input',
  argTypes: {
    // Core Properties
    name: {
      description: 'Input field name attribute',
      table: category('Core Properties', 'string', 'input'),
    },
    variant: {
      description: 'Input field type variant',
      options: inputVariants,
      table: category('Core Properties', 'InputVariantType', 'text'),
      control: { type: 'select' },
    },
    wrapperAs: {
      description: 'HTML element or component to wrap the input',
      table: category('Core Properties', "'label' | 'span'", 'label'),
    },

    // Appearance & Styling
    color: {
      description: 'Color variant of the input',
      options: ['primary', 'success', 'warning', 'error'],
      table: category('Appearance & Styling', 'InputColorVariant', "'primary'"),
      control: { type: 'select' },
    },
    width: {
      description: 'Width of the input field',
      table: category('Appearance & Styling', 'string', '100%'),
    },
    className: {
      description: 'Additional CSS classes',
      table: category('Appearance & Styling', 'string', ''),
    },
    styles: {
      description: 'Custom styles object',
      table: category('Appearance & Styling', 'CSSProperties', '{}'),
    },

    // Content & Labels
    placeholder: {
      description: 'Placeholder text',
      table: category('Content & Labels', 'string', 'placeholder'),
    },
    defaultValue: {
      description: 'Default value of the input',
      table: category('Content & Labels', 'string', 'defaultValue'),
    },
    label: {
      description: 'Input label text',
      table: category('Content & Labels', 'string', ''),
    },
    helperText: {
      description: 'Helper text below input',
      table: category('Content & Labels', 'string', ''),
    },
    adornmentStart: {
      description: 'Start adornment element (slot "adornment-start")',
      table: category('Content & Labels', 'Node', ''),
    },
    adornmentEnd: {
      description: 'End adornment element (slot "adornment-end")',
      table: category('Content & Labels', 'Node', ''),
    },

    // State & Behavior
    disabled: {
      description: 'Disabled state of the input',
      table: category('State & Behavior', 'boolean', 'false'),
    },
    required: {
      description: 'Required state of the input',
      table: category('State & Behavior', 'boolean', 'false'),
    },
    readOnly: {
      description: 'Read-only state of the input',
      table: category('State & Behavior', 'boolean', 'false'),
    },
    checked: {
      description: 'Checked state for checkbox/radio inputs',
      table: category('State & Behavior', 'boolean', 'false'),
    },
    debounceCallbackTime: {
      description: 'Debounce timeout for the gd-input event',
      table: category('State & Behavior', 'number', '300'),
    },

    // Accessibility
    role: {
      description: 'ARIA role of the input element',
      options: inputRoles,
      table: category('Accessibility', 'InputRole', 'textbox'),
      control: { type: 'select' },
    },
    tabIndex: {
      description: 'Tab index for keyboard navigation',
      table: category('Accessibility', 'number', '0'),
    },
    ariaRequired: {
      description: 'ARIA required attribute',
      table: category('Accessibility', 'boolean', 'false'),
    },
    ariaDescribedBy: {
      description: 'ARIA describedby attribute',
      table: category('Accessibility', 'string'),
    },

    // Events
    onChange: {
      description: 'gd-change event handler',
      table: category('Events', '(event: CustomEvent<{ value: string; checked: boolean }>) => void'),
    },
    onFocus: {
      description: 'focusin event handler',
      table: category('Events', '(event: FocusEvent) => void'),
    },
    onBlur: {
      description: 'focusout event handler',
      table: category('Events', '(event: FocusEvent) => void'),
    },
    onClick: {
      description: 'click event handler',
      table: category('Events', '(event: MouseEvent) => void'),
    },
  },
  tags: ['autodocs'],
  render: createInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`gd-input\` custom element is a versatile and customizable form element that handles various types of user input with extensive customization options.
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
  <li><b>gd-change</b>: Input value changes</li>
  <li><b>focusin</b>: Input receives focus</li>
  <li><b>focusout</b>: Input loses focus</li>
  <li><b>click</b>: Input is clicked</li>
  </ul>
        `,
      },
    },
  },
} satisfies Meta<Args>;
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

export const WithAdornments: Story = {
  ...createStory({ defaultValue: 'Input with adornments' }),
  render: (args) => {
    const input = createInput(args);
    input.append(
      adornment('adornment-start', '€', adornmentStyle('0 0 0 10px')),
      adornment('adornment-end', '.00', adornmentStyle('0 10px 0 0'))
    );
    return input;
  },
};
WithAdornments.play = withAdornmentsActions;

export const WithStartAdornment: Story = {
  ...createStory({ variant: 'email', defaultValue: 'user@example.com' }),
  render: (args) => {
    const input = createInput(args);
    input.append(adornment('adornment-start', '@', adornmentStyle('0 0 0 10px')));
    return input;
  },
};
WithStartAdornment.play = withStartAdornmentActions;

export const WithEndAdornmentAsIcon: Story = {
  render: () => {
    const input = element('gd-input', { name: 'test', width: '150px', variant: 'password', defaultValue: 'qwerty' });
    const toggle = adornment(
      'adornment-end',
      element('gd-icon', { name: 'eye', width: 18, height: 18, fill: '#838383' })
    );
    toggle.style.cssText = 'padding:0 10px 0 0;cursor:pointer';
    toggle.addEventListener('click', () => {
      input.variant = input.variant === 'password' ? 'text' : 'password';
    });
    input.append(toggle);
    return input;
  },
};
WithEndAdornmentAsIcon.play = withEndAdornmentAsIconActions;

export const DefaultWithTailwind: Story = {
  ...createStory({
    defaultValue: `Default with tailwind ${COMPONENT_NAME}`,
    // Wrapper classes of the source story, resolved to their declarations:
    // `border-2 px-3 py-2 rounded-xl text-xl font-bold underline`.
    styles: {
      padding: '8px 12px',
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 700,
      textDecorationLine: 'underline',
    },
  }),
};

export const CustomStyles = createStory({
  defaultValue: `CustomStyles ${COMPONENT_NAME}`,
  styles: { backgroundColor: 'lightblue', border: 'black', padding: '1rem' },
});

const labelled = (...children: Array<Node | string>) => {
  const label = element('gd-label');
  label.append(...children);
  return label;
};

export const CheckboxWithLabel: Story = {
  render: () => {
    const input = element('gd-input', { name: 'test', checked: false, role: 'checkbox', variant: 'checkbox' });
    input.addEventListener('gd-change', (event) => {
      input.checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
      action('changed')(event);
    });
    return labelled(input, 'Label');
  },
};
CheckboxWithLabel.play = checkboxWithLabelActions;

export const RadioControlledWithLabel: Story = {
  render: () => {
    const input = element('gd-input', { name: 'test', checked: false, role: 'radio', variant: 'radio' });
    input.addEventListener('gd-change', (event) => {
      input.checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
      action('changed')(event);
    });
    return labelled(input, 'Label');
  },
};
RadioControlledWithLabel.play = radioControlledWithLabelActions;

export const RadioGroupWithLabel: Story = {
  render: () => {
    const group = document.createElement('div');
    group.append(
      ...['1', '2', '3'].map((value) => {
        const input = element('gd-input', {
          wrapperAs: 'span',
          name: 'test_group',
          variant: 'radio',
          color: 'primary',
          value,
          defaultChecked: value === '1',
        });
        input.addEventListener('gd-change', action('changed'));
        return labelled(input, `Label ${value}`);
      })
    );
    return group;
  },
};
RadioGroupWithLabel.play = radioGroupWithLabelActions;

export const WithAccessibility: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;gap:20px';
    wrapper.append(
      element('gd-input', {
        label: 'Email',
        helperText: 'Error message',
        color: 'error',
        ariaDescribedBy: 'error-id',
      }),
      element('gd-input', {
        variant: 'checkbox',
        role: 'checkbox',
        name: 'terms',
        ariaLabel: 'terms',
        label: 'Agree to terms',
      })
    );
    return wrapper;
  },
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

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('input'),
};
DefaultTokens.parameters = {
  layout: 'padded',
};
