import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { get } from '@utils';
import { InputVariantType, TypographyVariant } from '@types';
import { Button, Input, Typography, Label } from '@components';

import { defaultTheme } from '@tokens';
import { Form, FormProps, FormFieldsData } from '.';

import { withSubmitActions, withOnChangeActions, validationErrorsActions } from './Form.stories.play';

const meta: Meta<typeof Form> = {
  title: 'Molecules/Form',
  component: Form,

  argTypes: {
    onSubmit: {
      description: 'Handler function called when the form is submitted',
      table: {
        type: { summary: '(formData: FormSubmitEventData) => void' },
        defaultValue: { summary: 'undefined' },
      },
      action: 'submitted',
    },
    onChange: {
      description: 'Handler function called when any form field value changes',
      table: {
        type: { summary: '(formData: FormChangeEventData) => void' },
        defaultValue: { summary: 'undefined' },
      },
      action: 'changed',
    },
    children: {
      description: 'Form content elements',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      description: 'Custom CSS styles to apply to the form element',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    className: {
      description: 'Additional CSS class names',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Form\` component is a versatile and customizable UI element designed to handle user input efficiently.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Flexible Input Handling</b>
  <ul>
  <li>Text inputs</li>
  <li>Password fields</li>
  <li>Checkboxes</li>
  <li>Radio buttons</li>
  <li>Custom input types</li>
  </ul>
  </li>
  <li>
  <b>Event Management</b>
  <ul>
  <li>onChange event handling</li>
  <li>onSubmit processing</li>
  <li>Form data serialization</li>
  <li>Validation support</li>
  </ul>
  </li>
  <li>
  <b>Customization</b>
  <ul>
  <li>Custom styling</li>
  <li>Theming support</li>
  <li>Flexible layout</li>
  </ul>
  </li>
  </ul>
  <br/>
  <h3>Form Data Structure:</h3>
  <ul>
  <li><b>FormFieldsData</b>
  <ul>
  <li><code>value</code>: Field value</li>
  <li><code>isChecked</code>: Checkbox/radio state</li>
  <li><code>type</code>: Input type</li>
  <li><code>role</code>: ARIA role of the input element</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Form>;

export default meta;
const Template: StoryFn<PropsWithChildren<FormProps>> = (args) => {
  return (
    <Form {...args}>
      <Typography variant={TypographyVariant.Body1}>
        <Input name="username" placeholder="Username" />
      </Typography>
      <Typography variant={TypographyVariant.Body1}>
        <Input name="password" variant={InputVariantType.Password} placeholder="Password" />
      </Typography>
      <Typography variant={TypographyVariant.Body1}>
        <Label htmlFor="agreed">
          <Input
            name="agreed"
            id="agreed"
            value="agree"
            variant={InputVariantType.Checkbox}
            data-testid="checkbox-input"
            role="checkbox"
          />
          Agree to terms and conditions
        </Label>
      </Typography>

      <Typography variant={TypographyVariant.Body1}>
        <div>
          <span>Select an option:</span>
          <Label htmlFor="testOption-1">
            <Input
              name="testOption"
              id="testOption-1"
              value="1"
              variant={InputVariantType.Radio}
              data-testid="radio-input-1"
            />
            Option 1
          </Label>
          <Label htmlFor="testOption-2">
            <Input
              name="testOption"
              id="testOption-2"
              value="2"
              variant={InputVariantType.Radio}
              data-testid="radio-input-2"
            />
            Option 2
          </Label>
          <Label htmlFor="testOption-3">
            <Input
              name="testOption"
              id="testOption-3"
              value="3"
              variant={InputVariantType.Radio}
              data-testid="radio-input-3"
            />
            Option 3
          </Label>
        </div>
      </Typography>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export const WithSubmit = Template.bind({});
WithSubmit.args = {
  onSubmit: fn((formSubmitEventData) => {
    action('Form submitted event data')(formSubmitEventData);
    get(formSubmitEventData, 'event').preventDefault();
  }),
};
WithSubmit.play = withSubmitActions;

export const WithOnChange = Template.bind({});
WithOnChange.args = {
  onChange: fn((formChangeEventData) => {
    action('Form changed event data')(formChangeEventData);
  }),
};
WithOnChange.play = withOnChangeActions;

export const WithCustomErrorHandlingOnChangeSubmit = Template.bind({});
const handleValidate = (formData: FormFieldsData): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const name in formData) {
    switch (name) {
      case 'username':
        if (!get(formData, [name, 'value'])) {
          errors[name] = 'Username is required';
        }
        break;
      case 'password':
        if (!get(formData, [name, 'value'])) {
          errors[name] = 'Password is required';
        } else if (get(formData, [name, 'value', 'length']) < 6) {
          errors[name] = 'Password must be at least 6 characters long';
        }
        break;
      case 'agreed':
        if (!get(formData, [name, 'isChecked'])) {
          errors[name] = 'You must agree to the terms and conditions';
        }
        break;
      default:
        break;
    }
  }

  return errors;
};
WithCustomErrorHandlingOnChangeSubmit.args = {
  onSubmit: fn((formSubmitEventData) => {
    const errors = handleValidate(get(formSubmitEventData, 'formData', {}));
    action('Validation: onSubmit errors')(errors);
    action('Form submitted event data')(formSubmitEventData);
    get(formSubmitEventData, 'event').preventDefault();
    return errors;
  }),
  onChange: fn((formChangeEventData) => {
    action('Form changed event data')(formChangeEventData);
  }),
};
WithCustomErrorHandlingOnChangeSubmit.play = validationErrorsActions;

export const WithCustomStyles = Template.bind({});
WithCustomStyles.args = {
  styles: { border: '1px solid red', padding: '10px 15px' },
};

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  ariaLabelBy: 'form-title',
  describedBy: 'form-description',
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
      <Typography variant={TypographyVariant.H1} id="form-title">
        User Registration Form
      </Typography>
      <Typography variant={TypographyVariant.Body2} id="form-description">
        Please fill out all required fields to create your account.
      </Typography>
      <Story />
    </>
  ),
];

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ form: defaultTheme.form }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
