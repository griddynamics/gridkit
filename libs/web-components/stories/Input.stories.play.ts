import { expect, userEvent, waitFor, fn } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdInput } from '../src';

const host = (canvasElement: HTMLElement, index = 0) => canvasElement.querySelectorAll<GdInput>('gd-input')[index]!;
const control = (canvasElement: HTMLElement, index = 0) =>
  host(canvasElement, index).shadowRoot!.querySelector<HTMLInputElement>('input')!;
const shadowText = (canvasElement: HTMLElement, selector: string) =>
  host(canvasElement).shadowRoot!.querySelector<HTMLElement>(selector);

const getLocators = (canvasElement: HTMLElement) => ({
  input: () => control(canvasElement),
  label: () => shadowText(canvasElement, '.label'),
  helperText: () => shadowText(canvasElement, '.helper'),
  checkbox: () => control(canvasElement),
  radio: () => control(canvasElement),
  allRadioInputs: () =>
    Array.from(canvasElement.querySelectorAll<GdInput>('gd-input')).map((_, i) => control(canvasElement, i)),
  adornment: (slot: string) => host(canvasElement).querySelector<HTMLElement>(`:scope > [slot="${slot}"]`),
  eyeIcon: () => host(canvasElement).querySelector<HTMLElement>('gd-icon[name="eye"]'),
});

const valueOf = (input: HTMLInputElement) => input.value;

/** Move focus onto the native control the way Tab does: the text is selected. The simulated Tab key of the
 * test library only walks the light DOM, so it cannot reach controls inside a shadow root. */
const tabTo = async (input: HTMLInputElement) => {
  await userEvent.click(document.body);
  input.focus();
  if (input.type === 'text') input.select();
};

/** Replace the content of a control inside a shadow root through simulated key presses. */
const replaceValue = async (input: HTMLInputElement, text: string) => {
  input.focus();
  await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
  await userEvent.keyboard(text);
};

export const primaryDefaultWithLabelAndHelperTextActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render input with label, helper text, and default value', async () => {
    expect(locators.label()).toHaveTextContent(/^label$/i);
    expect(locators.helperText()).toHaveTextContent(/^helper text$/i);
    expect(locators.input()).toBeInTheDocument();
    await waitFor(() => expect(valueOf(locators.input())).toBe('Default Input'));
  });

  await step('Should fire the change handler when typing', async () => {
    (args['onChange'] as ReturnType<typeof fn>)?.mockClear();
    await replaceValue(locators.input(), 'hello');
    await waitFor(
      () => {
        expect(args['onChange']).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await tabTo(locators.input());
    expect(host(canvasElement).shadowRoot!.activeElement).toBe(locators.input());
  });
};

const renderedWithLabelAndHelper =
  (expected: string) =>
  async ({ canvasElement, step }: StoryContext) => {
    const locators = getLocators(canvasElement);

    await step('Should render input with label, helper text, and default value', async () => {
      expect(locators.label()).toHaveTextContent(/^label$/i);
      expect(locators.helperText()).toHaveTextContent(/^helper text$/i);
      expect(locators.input()).toBeInTheDocument();
      await waitFor(() => expect(valueOf(locators.input())).toBe(expected));
    });
  };

export const successWithLabelAndHelperTextActions = renderedWithLabelAndHelper('Success Input');
export const warningWithLabelAndHelperTextActions = renderedWithLabelAndHelper('Warning Input');
export const errorWithLabelAndHelperTextActions = renderedWithLabelAndHelper('Error Input');

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render disabled input with label', async () => {
    expect(locators.label()).toHaveTextContent(/^label$/i);
    expect(locators.input()).toBeDisabled();
    await waitFor(() => expect(valueOf(locators.input())).toBe('Disabled Input'));
  });
};

export const readOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render read-only input with expected value', async () => {
    expect(locators.input()).toBeInTheDocument();
    await waitFor(() => expect(valueOf(locators.input())).toBe('ReadOnly Input'));
    expect(locators.input()).toHaveAttribute('readonly');
  });

  await step('Should support keyboard focus while read-only', async () => {
    await tabTo(locators.input());
    expect(host(canvasElement).shadowRoot!.activeElement).toBe(locators.input());
  });
};

export const wrapperAsSpanActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render input with default value', async () => {
    expect(locators.input()).toBeInTheDocument();
    await waitFor(() => expect(valueOf(locators.input())).toBe('Input wrapper span'));
    expect(shadowText(canvasElement, '.outer')!.localName).toBe('span');
  });
};

export const withAdornmentsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render input with start and end adornments', async () => {
    expect(locators.adornment('adornment-start')).toHaveTextContent('€');
    expect(locators.adornment('adornment-end')).toHaveTextContent('.00');
    expect(locators.input()).toBeInTheDocument();
    await waitFor(() => expect(valueOf(locators.input())).toBe('Input with adornments'));
  });
};

export const withStartAdornmentActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render email input with start adornment', async () => {
    expect(locators.adornment('adornment-start')).toHaveTextContent('@');
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveAttribute('type', 'email');
  });
};

export const withEndAdornmentAsIconActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render password input with eye icon toggle', async () => {
    expect(locators.input()).toHaveAttribute('type', 'password');
    expect(locators.eyeIcon()).toBeInTheDocument();
  });

  await step('Should reveal password text when eye icon is clicked', async () => {
    await userEvent.click(locators.eyeIcon()!);
    await waitFor(() => {
      expect(locators.input()).toHaveAttribute('type', 'text');
    });
  });

  await step('Should hide password text when eye icon is clicked again', async () => {
    await userEvent.click(locators.eyeIcon()!);
    await waitFor(() => {
      expect(locators.input()).toHaveAttribute('type', 'password');
    });
  });
};

export const checkboxWithLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render unchecked checkbox with label', async () => {
    expect(locators.checkbox()).toBeInTheDocument();
    expect(locators.checkbox()).not.toBeChecked();
    expect(canvasElement.querySelector('gd-label')).toHaveTextContent(/^label$/i);
  });

  await step('Should check checkbox on click', async () => {
    await userEvent.click(locators.checkbox());
    expect(locators.checkbox()).toBeChecked();
  });

  await step('Should uncheck checkbox on second click', async () => {
    await userEvent.click(locators.checkbox());
    expect(locators.checkbox()).not.toBeChecked();
  });
};

export const radioControlledWithLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render unchecked radio with label', async () => {
    expect(locators.radio()).toBeInTheDocument();
    expect(locators.radio()).not.toBeChecked();
    expect(canvasElement.querySelector('gd-label')).toHaveTextContent(/^label$/i);
  });

  await step('Should select radio on click', async () => {
    await userEvent.click(locators.radio());
    expect(locators.radio()).toBeChecked();
  });
};

export const radioGroupWithLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render all 3 radio inputs', async () => {
    expect(locators.allRadioInputs()).toHaveLength(3);
  });

  await step('Should have first radio pre-selected by default', async () => {
    await waitFor(() => expect(locators.allRadioInputs()[0]).toBeChecked());
    const radios = locators.allRadioInputs();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  await step('Should select second radio on click', async () => {
    const radios = locators.allRadioInputs();
    await userEvent.click(radios[1]!);
    await waitFor(() => expect(radios[0]).not.toBeChecked());
    expect(radios[1]).toBeChecked();
  });
};
