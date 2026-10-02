import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdInput } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes, stack } from './helpers';

type Args = Partial<Omit<GdInput, 'ariaRequired'>> & {
  wrapperAs?: 'div' | 'span' | 'label';
  ariaRequired?: boolean;
  adornmentStart?: string;
  adornmentEnd?: string;
};
const common: Args = {
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
  ariaRequired: false,
  debounceCallbackTime: 300,
  styles: {},
  label: '',
  helperText: '',
};
function inputElement({ ariaRequired, adornmentStart, adornmentEnd, ...args }: Args) {
  const input = element('gd-input', { ...args, ariaRequiredValue: ariaRequired });
  for (const [slot, text] of [
    ['adornment-start', adornmentStart],
    ['adornment-end', adornmentEnd],
  ]) {
    if (!text) continue;
    const adornment = document.createElement('span');
    adornment.slot = slot!;
    adornment.style.cssText = `padding:${slot === 'adornment-start' ? '0 0 0 10px' : '0 10px 0 0'};display:flex;color:#838383`;
    adornment.textContent = text;
    input.append(adornment);
  }
  return input;
}
const meta = {
  title: 'Atoms/Input',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input with labels, helper text, validation colors, disabled and read-only states, adornments, checkbox/radio modes, accessibility, and native events.',
      },
    },
  },
  argTypes: sectionedArgTypes('Input', {}),
  render: (args: Args) => inputElement(args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
const createStory = (args: Args): Story => ({ args: { ...common, ...args } });
export const PrimaryDefaultWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: 'Default Input',
});
export const SuccessWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: 'Success Input',
  color: 'success',
});
export const WarningWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: 'Warning Input',
  color: 'warning',
});
export const ErrorWithLabelAndHelperText = createStory({
  label: 'Label',
  helperText: 'Helper text',
  defaultValue: 'Error Input',
  color: 'error',
});
export const Disabled = createStory({ label: 'Label', defaultValue: 'Disabled Input', disabled: true });
export const ReadOnly = createStory({ defaultValue: 'ReadOnly Input', readOnly: true });
export const WrapperAsSpan = createStory({ defaultValue: 'Input wrapper span', wrapperAs: 'span' });
export const WithAdornments = createStory({
  defaultValue: 'Input with adornments',
  adornmentStart: '€',
  adornmentEnd: '.00',
});
export const WithStartAdornment = createStory({
  variant: 'email',
  defaultValue: 'user@example.com',
  adornmentStart: '@',
});
export const WithEndAdornmentAsIcon: Story = {
  render: () => {
    const input = inputElement({ name: 'test', width: '150px', variant: 'password', defaultValue: 'qwerty' });
    const toggle = document.createElement('span');
    toggle.slot = 'adornment-end';
    toggle.style.cssText = 'padding:0 10px 0 0;cursor:pointer';
    toggle.append(element('gd-icon', { name: 'eye', width: 18, height: 18, fill: '#838383' }));
    toggle.addEventListener('click', () => {
      input.variant = input.variant === 'password' ? 'text' : 'password';
    });
    input.append(toggle);
    return input;
  },
};
export const CustomStyles = createStory({
  defaultValue: 'CustomStyles Input',
  styles: { backgroundColor: 'lightblue', border: 'black', padding: '1rem' },
});
function labelledChoice(variant: 'checkbox' | 'radio', text = 'Label', props: Args = {}) {
  const input = inputElement({ name: 'test', variant, role: variant, ...props });
  const label = element('gd-label', {});
  label.append(input, document.createTextNode(text));
  // Labels cannot activate a control through another element's shadow root.
  label.addEventListener('click', (event) => {
    if (event.composedPath().includes(input)) return;
    input.shadowRoot?.querySelector('input')?.click();
  });
  return label;
}
export const CheckboxWithLabel: Story = { render: () => labelledChoice('checkbox') };
export const RadioControlledWithLabel: Story = { render: () => labelledChoice('radio') };
export const RadioGroupWithLabel: Story = {
  render: () => {
    const root = document.createElement('div');
    const labels = ['1', '2', '3'].map((value) =>
      labelledChoice('radio', `Label ${value}`, {
        name: 'test_group',
        value,
        defaultChecked: value === '1',
        wrapperAs: 'span',
      })
    );
    root.append(...labels);
    return root;
  },
};
export const WithAccessibility: Story = {
  render: (args) =>
    stack(
      'column',
      '20px',
      inputElement({
        ...args,
        label: 'Email',
        helperText: 'Error message',
        color: 'error',
        ariaDescribedBy: 'error-id',
      }),
      inputElement({
        variant: 'checkbox',
        role: 'checkbox',
        name: 'terms',
        ariaLabel: 'terms',
        label: 'Agree to terms',
      })
    ),
};
export const DefaultTokens: Story = { parameters: { layout: 'padded' }, render: () => defaultTokenViewer('input') };
