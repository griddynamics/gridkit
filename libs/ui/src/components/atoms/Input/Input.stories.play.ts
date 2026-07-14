import { within, expect, userEvent, waitFor, fn } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  input: () => canvas.getByTestId('Input'),
  label: () => canvas.getByText(/^label$/i),
  helperText: () => canvas.getByText(/^helper text$/i),
  checkbox: () => canvas.getByRole('checkbox'),
  radio: () => canvas.getByRole('radio'),
  allRadioInputs: () => canvas.getAllByRole('radio'),
  adornmentEuro: () => canvas.getByText('€'),
  adornmentDecimal: () => canvas.getByText('.00'),
  adornmentAtSign: () => canvas.getByText('@'),
  eyeIcon: () => canvas.getByTestId('Icon-eye'),
});

export const primaryDefaultWithLabelAndHelperTextActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render input with label, helper text, and default value', async () => {
    expect(locators.label()).toBeInTheDocument();
    expect(locators.helperText()).toBeInTheDocument();
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('Default Input');
  });

  await step('Should fire onChange when typing', async () => {
    (args['onChange'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.clear(locators.input());
    await userEvent.type(locators.input(), 'hello');
    await waitFor(
      () => {
        expect(args['onChange']).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.input()).toHaveFocus();
  });
};

export const successWithLabelAndHelperTextActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render input with label, helper text, and default value', async () => {
    expect(locators.label()).toBeInTheDocument();
    expect(locators.helperText()).toBeInTheDocument();
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('Success Input');
  });
};

export const warningWithLabelAndHelperTextActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render input with label, helper text, and default value', async () => {
    expect(locators.label()).toBeInTheDocument();
    expect(locators.helperText()).toBeInTheDocument();
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('Warning Input');
  });
};

export const errorWithLabelAndHelperTextActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render input with label, helper text, and default value', async () => {
    expect(locators.label()).toBeInTheDocument();
    expect(locators.helperText()).toBeInTheDocument();
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('Error Input');
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render disabled input with label', async () => {
    expect(locators.label()).toBeInTheDocument();
    expect(locators.input()).toBeDisabled();
    expect(locators.input()).toHaveValue('Disabled Input');
  });
};

export const readOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render read-only input with expected value', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('ReadOnly Input');
    expect(locators.input()).toHaveAttribute('readonly');
  });

  await step('Should support keyboard focus while read-only', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.input()).toHaveFocus();
  });
};

export const wrapperAsSpanActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render input with default value', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('Input wrapper span');
  });
};

export const withAdornmentsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render input with start and end adornments', async () => {
    expect(locators.adornmentEuro()).toBeInTheDocument();
    expect(locators.adornmentDecimal()).toBeInTheDocument();
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue('Input with adornments');
  });
};

export const withStartAdornmentActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render email input with start adornment', async () => {
    expect(locators.adornmentAtSign()).toBeInTheDocument();
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveAttribute('type', 'email');
  });
};

export const withEndAdornmentAsIconActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render password input with eye icon toggle', async () => {
    expect(locators.input()).toHaveAttribute('type', 'password');
    expect(locators.eyeIcon()).toBeInTheDocument();
  });

  await step('Should reveal password text when eye icon is clicked', async () => {
    await userEvent.click(locators.eyeIcon());
    await waitFor(() => {
      expect(locators.input()).toHaveAttribute('type', 'text');
    });
  });

  await step('Should hide password text when eye icon is clicked again', async () => {
    await userEvent.click(locators.eyeIcon());
    await waitFor(() => {
      expect(locators.input()).toHaveAttribute('type', 'password');
    });
  });
};

export const checkboxWithLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render unchecked checkbox with label', async () => {
    expect(locators.checkbox()).toBeInTheDocument();
    expect(locators.checkbox()).not.toBeChecked();
    expect(locators.label()).toBeInTheDocument();
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
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render unchecked radio with label', async () => {
    expect(locators.radio()).toBeInTheDocument();
    expect(locators.radio()).not.toBeChecked();
    expect(locators.label()).toBeInTheDocument();
  });

  await step('Should select radio on click', async () => {
    await userEvent.click(locators.radio());
    expect(locators.radio()).toBeChecked();
  });
};

export const radioGroupWithLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render all 3 radio inputs', async () => {
    expect(locators.allRadioInputs()).toHaveLength(3);
  });

  await step('Should have first radio pre-selected by default', async () => {
    const radios = locators.allRadioInputs();
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  await step('Should select second radio on click', async () => {
    const radios = locators.allRadioInputs();
    await userEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  });
};
