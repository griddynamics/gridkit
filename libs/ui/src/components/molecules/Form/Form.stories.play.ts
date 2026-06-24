import { within, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { fillInput, clearInput, clickInput, getLastCallArgs, getMockCallResult, getMockCallArgs } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  usernameInput: () => canvas.getByPlaceholderText('Username'),
  passwordInput: () => canvas.getByPlaceholderText('Password'),
  checkboxInput: () => canvas.getByTestId('checkbox-input'),
  radioButton1: () => canvas.getByTestId('radio-input-1'),
  radioButton2: () => canvas.getByTestId('radio-input-2'),
  radioButton3: () => canvas.getByTestId('radio-input-3'),
  submitButton: () => canvas.getByRole('button', { name: /submit/i }),
});

const testData = { username: 'gridkit', password: 'password1' };

export const withSubmitActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should submit form with valid data', async () => {
    await step('Fill out form fields', async () => {
      await fillInput(locators.usernameInput(), testData.username);
      await fillInput(locators.passwordInput(), testData.password);
      await clickInput(locators.checkboxInput());
    });

    await step('Submit form', async () => {
      await clickInput(locators.submitButton());
    });

    await step('Verify onSubmit was called with correct form data', async () => {
      await expect(args['onSubmit']).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.objectContaining({
            username: expect.objectContaining({ value: testData.username }),
            password: expect.objectContaining({ value: testData.password }),
            agreed: expect.objectContaining({ isChecked: true }),
          }),
        })
      );
    });
  });
};

export const withOnChangeActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should change username', async () => {
    await step('Type username', async () => {
      await fillInput(locators.usernameInput(), testData.username);
    });

    await step('Verify onChange was called', async () => {
      await expect(args['onChange']).toHaveBeenCalled();
    });

    const lastUsernameCall = getLastCallArgs(args['onChange']);

    await step('Verify changedControlNames contains the changed field', async () => {
      await expect(lastUsernameCall.changedControlNames).toContain('username');
      await expect(lastUsernameCall.controlValues).toHaveProperty('username');
      await expect(lastUsernameCall.controlValues.username.value).toBe(testData.username);
    });

    await step('Verify formData contains all form fields with current values', async () => {
      await expect(lastUsernameCall.formData).toHaveProperty('username');
      await expect(lastUsernameCall.formData.username.value).toBe(testData.username);
    });
  });

  await step('Should change password', async () => {
    await step('Type password', async () => {
      await fillInput(locators.passwordInput(), testData.password);
    });

    await step('Verify onChange was called', async () => {
      await expect(args['onChange']).toHaveBeenCalled();
    });

    const lastPasswordCall = getLastCallArgs(args['onChange']);

    await step('Verify changedControlNames contains the changed field', async () => {
      await expect(lastPasswordCall.changedControlNames).toContain('password');
      await expect(lastPasswordCall.controlValues.password.value).toBe(testData.password);
    });

    await step('Verify formData contains both username and password', async () => {
      await expect(lastPasswordCall.formData.username.value).toBe(testData.username);
      await expect(lastPasswordCall.formData.password.value).toBe(testData.password);
    });
  });

  await step('Should check checkbox', async () => {
    await step('Click checkbox', async () => {
      await clickInput(locators.checkboxInput());
    });

    const lastCheckboxCall = getLastCallArgs(args['onChange']);

    await step('Verify changedControlNames contains the changed field', async () => {
      await expect(lastCheckboxCall.changedControlNames).toContain('agreed');
      await expect(lastCheckboxCall.controlValues.agreed.isChecked).toBe(true);
    });

    await step('Verify formData contains all fields including checkbox state', async () => {
      await expect(lastCheckboxCall.formData).toMatchObject({
        username: expect.objectContaining({ value: testData.username }),
        password: expect.objectContaining({ value: testData.password }),
        agreed: expect.objectContaining({ isChecked: true }),
      });
    });
  });
};

export const validationErrorsActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should submit empty form', async () => {
    await step('Click submit button', async () => {
      await clickInput(locators.submitButton());
    });

    await expect(args['onSubmit']).toHaveBeenCalled();

    const emptyFormErrors = getMockCallResult(args['onSubmit'], 0);

    await step('Verify all required field errors are present', async () => {
      await expect(emptyFormErrors).toHaveProperty('username', 'Username is required');
      await expect(emptyFormErrors).toHaveProperty('password', 'Password is required');
      await expect(emptyFormErrors).toHaveProperty('agreed', 'You must agree to the terms and conditions');
      await expect(Object.keys(emptyFormErrors).length).toBeGreaterThanOrEqual(3);
    });
  });

  await step('Should fill only username, leave password and checkbox empty', async () => {
    await step('Type username', async () => {
      await fillInput(locators.usernameInput(), testData.username);
    });

    await step('Submit form', async () => {
      await clickInput(locators.submitButton());
    });

    const partialSubmitCall = getMockCallArgs(args['onSubmit'], 1);
    const partialFormErrors = getMockCallResult(args['onSubmit'], 1);

    await step('Verify username error is gone but password and checkbox errors remain', async () => {
      await expect(partialFormErrors).not.toHaveProperty('username');
      await expect(partialFormErrors).toHaveProperty('password', 'Password is required');
      await expect(partialFormErrors).toHaveProperty('agreed', 'You must agree to the terms and conditions');
      await expect(partialSubmitCall.formData.username.value).toBe(testData.username);
    });
  });

  await step('Should valid password but missing checkbox', async () => {
    await step('Clear password', async () => {
      await clearInput(locators.passwordInput());
    });

    await step('Type password', async () => {
      await fillInput(locators.passwordInput(), testData.password);
    });

    await step('Submit form', async () => {
      await clickInput(locators.submitButton());
    });

    const missingCheckboxCall = getMockCallArgs(args['onSubmit'], 2);
    const missingCheckboxErrors = getMockCallResult(args['onSubmit'], 2);

    await step('Verify only checkbox error remains', async () => {
      await expect(missingCheckboxErrors).not.toHaveProperty('username');
      await expect(missingCheckboxErrors).not.toHaveProperty('password');
      await expect(missingCheckboxErrors).toHaveProperty('agreed', 'You must agree to the terms and conditions');
      await expect(missingCheckboxCall.formData.agreed?.isChecked || false).toBe(false);
    });
  });

  await step('Should fill all fields correctly - no errors', async () => {
    await step('Clear username', async () => {
      await clearInput(locators.usernameInput());
    });

    await step('Clear password', async () => {
      await clearInput(locators.passwordInput());
    });

    await step('Type username', async () => {
      await fillInput(locators.usernameInput(), testData.username);
    });

    await step('Type password', async () => {
      await fillInput(locators.passwordInput(), testData.password);
    });

    await step('Click checkbox', async () => {
      await clickInput(locators.checkboxInput());
    });

    await step('Submit form', async () => {
      await clickInput(locators.submitButton());
    });

    const validSubmitCall = getMockCallArgs(args['onSubmit'], 3);
    const validFormErrors = getMockCallResult(args['onSubmit'], 3);

    await step('Verify NO errors when form is valid', async () => {
      await expect(Object.keys(validFormErrors).length).toBe(0);
      await expect(validFormErrors).toEqual({});
    });

    await step('Verify all form data is correct', async () => {
      await expect(validSubmitCall.formData).toMatchObject({
        username: expect.objectContaining({ value: testData.username }),
        password: expect.objectContaining({ value: testData.password }),
        agreed: expect.objectContaining({ isChecked: true }),
      });
    });
  });
};
