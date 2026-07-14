import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { colors } from '@tokens';
import { EXPECTED_TEXT, STEP_INDICES, STEP_STYLES } from '@components/molecules/Stepper/constants';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  stepper: () => canvas.getByTestId('Stepper'),
  allSteps: () => canvas.getAllByTestId('Stepper-step'),
  allStepsIcons: () => canvas.getAllByTestId('Stepper-step-icon'),
  allStepsLabels: () => canvas.getAllByTestId('Stepper-step-label'),
  currentStepLabel: () => canvas.getByTestId('Stepper-current-step-label'),
  nextStepButton: () => canvas.getByTestId('Stepper-next-button'),
  fixButton: () => canvas.queryByTestId('Stepper-fix-button'),
  errorLabel: () => canvas.queryByTestId('Stepper-error-label'),
});

export const stepperSimpleScenarioActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderAllInitialElements(locators, step);

  await step('Should render all initial Buttons and Labels', async () => {
    expect(locators.currentStepLabel()).toBeVisible();
    expect(locators.nextStepButton()).toBeVisible();
  });

  await step('Should display correct initial text and icon values', async () => {
    expect(locators.currentStepLabel()).toHaveTextContent(EXPECTED_TEXT.currentStep(1));
    expect(locators.nextStepButton()).toHaveTextContent(EXPECTED_TEXT.nextStep(2));

    for (const [index, stepIcon] of locators.allStepsIcons().entries()) {
      expect(stepIcon).toHaveTextContent((index + 1).toString());
    }

    for (const [index, stepLabel] of locators.allStepsLabels().entries()) {
      expect(stepLabel).toHaveTextContent(EXPECTED_TEXT.stepLabel(index + 2));
    }
  });

  await step('Should be initial State: Step 1 Active, others Future', async () => {
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.FIRST], 'active');
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.SECOND], 'future');
  });

  await step('Should click Next button (step 1 -> 2) and verify UI', async () => {
    await userEvent.click(locators.nextStepButton());

    expect(locators.currentStepLabel()).toHaveTextContent(EXPECTED_TEXT.currentStep(2));
    expect(locators.nextStepButton()).toHaveTextContent(EXPECTED_TEXT.nextStep(3));

    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.FIRST], 'completed');
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.SECOND], 'active');
  });

  await step('Should click Next button (step 2 -> 3, triggers error)', async () => {
    await userEvent.click(locators.nextStepButton());
  });

  await step('Should display error state on step 2', async () => {
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.SECOND], 'error');

    expect(locators.errorLabel()).toBeVisible();
    expect(locators.errorLabel()).toHaveTextContent(EXPECTED_TEXT.errorLabel);

    expect(locators.fixButton()).toBeVisible();
    expect(locators.fixButton()).toHaveTextContent(EXPECTED_TEXT.fixButton);
  });

  await step('Should fix error and remove error UI', async () => {
    expect(locators.fixButton()).toBeVisible();
    await userEvent.click(locators.fixButton()!);

    await waitFor(() => {
      expect(locators.fixButton()).not.toBeInTheDocument();
      expect(locators.errorLabel()).not.toBeInTheDocument();
    });
  });

  await step('Should be Step Icon 2 Complete, Step Icon 3 Active after fix', async () => {
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.SECOND], 'completed');
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.THIRD], 'active');
  });

  await step('Should click Next button (step 3 -> 4) and verify UI', async () => {
    await userEvent.click(locators.nextStepButton());

    expect(locators.currentStepLabel()).toHaveTextContent(EXPECTED_TEXT.currentStep(4));
    expect(locators.nextStepButton()).toHaveTextContent(EXPECTED_TEXT.complete);

    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.THIRD], 'completed');
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.FOURTH], 'active');
  });

  await step('Should complete all steps and display completed state', async () => {
    await userEvent.click(locators.nextStepButton());

    expect(locators.currentStepLabel()).toHaveTextContent(EXPECTED_TEXT.congrats);

    for (const icon of locators.allStepsIcons()) {
      await shouldVerifyStepAppearance(icon, 'completed');
    }
  });

  await step('Should navigate back to step 1 by clicking first step icon', async () => {
    await userEvent.click(locators.allStepsIcons()[STEP_INDICES.FIRST]);
  });

  await step('Should reset all values to the initial', async () => {
    expect(locators.currentStepLabel()).toHaveTextContent(EXPECTED_TEXT.currentStep(1));
    expect(locators.nextStepButton()).toHaveTextContent(EXPECTED_TEXT.nextStep(2));
  });
};

export const withActiveErrorStepActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  await shouldRenderAllInitialElements(locators, step);

  await step('Should verify first and second step to be in the completed status', async () => {
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.FIRST], 'completed');
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.SECOND], 'completed');
  });

  await step('Should verify third step to be in the failed status', async () => {
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.THIRD], 'failed');
  });

  await step('Should verify third step to be in the future status', async () => {
    await shouldVerifyStepAppearance(locators.allStepsIcons()[STEP_INDICES.FOURTH], 'future');
  });
};

export const withIconsViewActiveErrorStepActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  await shouldRenderAllInitialElements(locators, step);

  await step('Should verify first step to be in the completed status', async () => {
    const firstIcon = locators.allStepsIcons()[STEP_INDICES.FIRST];
    await shouldVerifyStepAppearance(firstIcon, 'completed');
    expect(within(firstIcon).getByTestId('Icon-check')).toBeVisible();
  });

  await step('Should verify second step to be in the failed status', async () => {
    const secondIcon = locators.allStepsIcons()[STEP_INDICES.SECOND];
    await shouldVerifyStepAppearance(secondIcon, 'failed');
    expect(within(secondIcon).getByTestId('Icon-cross')).toBeVisible();
  });

  await step('Should verify third and fourth step to be in the future status', async () => {
    const icons = locators.allStepsIcons();
    await shouldVerifyStepAppearance(icons[STEP_INDICES.THIRD], 'future');
    await shouldVerifyStepAppearance(icons[STEP_INDICES.FOURTH], 'future');

    expect(within(icons[STEP_INDICES.THIRD]).getByTestId('Icon-check')).toBeVisible();
    expect(within(icons[STEP_INDICES.FOURTH]).getByTestId('Icon-check')).toBeVisible();
  });
};

export const withIconsViewCompletedErrorStepActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  await shouldRenderAllInitialElements(locators, step);

  await step('Should verify first step to be in the completed status', async () => {
    const firstIcon = locators.allStepsIcons()[STEP_INDICES.FIRST];
    await shouldVerifyStepAppearance(firstIcon, 'completed');
    expect(within(firstIcon).getByTestId('Icon-check')).toBeVisible();
  });

  await step('Should verify second step to be in the error status', async () => {
    const secondIcon = locators.allStepsIcons()[STEP_INDICES.SECOND];
    await shouldVerifyStepAppearance(secondIcon, 'error');
    expect(within(secondIcon).getByTestId('Icon-cross')).toBeVisible();
  });

  await step('Should verify third  be in the active status', async () => {
    const thirdIcon = locators.allStepsIcons()[STEP_INDICES.THIRD];
    await shouldVerifyStepAppearance(thirdIcon, 'active');
    expect(within(thirdIcon).getByTestId('Icon-check')).toBeVisible();
  });

  await step('Should verify fourth to be in the future status', async () => {
    const fourthIcon = locators.allStepsIcons()[STEP_INDICES.FOURTH];
    await shouldVerifyStepAppearance(fourthIcon, 'future');
    expect(within(fourthIcon).getByTestId('Icon-check')).toBeVisible();
  });
};

export const withCustomIconsViewStepActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  await shouldRenderAllInitialElements(locators, step);

  await step('Should verify first step to be in the completed status and have check icon', async () => {
    const firstIcon = locators.allStepsIcons()[STEP_INDICES.FIRST];
    await shouldVerifyStepAppearance(firstIcon, 'completed');
    expect(within(firstIcon).getByTestId('Icon-check')).toBeVisible();
  });

  await step('Should verify second step to be in the error status and have cross icon', async () => {
    const secondIcon = locators.allStepsIcons()[STEP_INDICES.SECOND];
    await shouldVerifyStepAppearance(secondIcon, 'error');
    expect(within(secondIcon).getByTestId('Icon-cross')).toBeVisible();
  });

  await step('Should verify third  be in the active status and have home icon', async () => {
    const thirdIcon = locators.allStepsIcons()[STEP_INDICES.THIRD];
    await shouldVerifyStepAppearance(thirdIcon, 'active');
    expect(within(thirdIcon).getByTestId('Icon-home')).toBeVisible();
  });

  await step('Should verify fourth to be in the future status and have star icon', async () => {
    const fourthIcon = locators.allStepsIcons()[STEP_INDICES.FOURTH];
    await shouldVerifyStepAppearance(fourthIcon, 'future');
    expect(within(fourthIcon).getByTestId('Icon-star')).toBeVisible();
  });
};

const shouldVerifyStepAppearance = async (stepElement: HTMLElement, state: keyof typeof STEP_STYLES) => {
  const styles = STEP_STYLES[state];

  await waitFor(() => {
    for (const [property, value] of Object.entries(styles)) {
      expect(stepElement).toHaveStyle({ [property]: value });
    }

    if (state === 'future') {
      expect(stepElement).not.toHaveStyle({ 'border-color': colors.border.primary });
    }
  });
};

const shouldRenderAllInitialElements = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should render all initial UI elements', async () => {
    expect(locators.stepper()).toBeVisible();

    const steps = locators.allSteps();
    expect(steps).toHaveLength(4);

    for (const stepElement of steps) {
      expect(stepElement).toBeVisible();
    }
  });
};
