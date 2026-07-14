import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

type BaseOption = { value: string; label?: string; disabled?: boolean };

const getLocators = (canvas: ReturnType<typeof within>) => ({
  radioGroupWrapper: () => canvas.getByRole('radiogroup'),
  allRadios: () => canvas.getAllByRole('radio'),
  radioByValue: (value: string) => canvas.getByTestId(`RadioGroupItem-input-${value}`),
  radioItemByValue: (value: string) => canvas.getByTestId(`RadioGroupItem-${value}`),
  tooltipWrappers: () => canvas.getAllByTestId('Tooltip-wrapper'),
  cards: () => canvas.getAllByTestId('Card'),
});

type Locators = ReturnType<typeof getLocators>;

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as BaseOption[];

  await step('Should render the radio group and all options correctly', async () => {
    const wrapper = locators.radioGroupWrapper();
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toBeVisible();

    const radios = locators.allRadios();
    shouldVerifyRadiosMatchOptions(radios, options);

    for (const radio of radios) {
      expect(radio).not.toBeChecked();
    }
  });

  await step('Should allow selecting only one option via mouse click', async () => {
    await shouldVerifyExclusiveSelection(locators, options[0].value, options[1].value);
  });

  await step('Should not allow selecting a disabled option', async () => {
    const disabledOption = options.find((opt) => opt.disabled);
    if (!disabledOption) return;

    await shouldVerifyDisabledNotSelectable(locators, disabledOption.value);
  });

  await step('Should support standard keyboard navigation (Arrow keys)', async () => {
    const enabledOptions = options.filter((opt) => !opt.disabled);

    await userEvent.click(document.body);
    const firstEnabledRadio = locators.radioByValue(enabledOptions[0].value);
    firstEnabledRadio.focus();
    expect(firstEnabledRadio).toHaveFocus();

    for (let i = 0; i < enabledOptions.length - 1; i++) {
      const currentRadio = locators.radioByValue(enabledOptions[i].value);
      const nextRadio = locators.radioByValue(enabledOptions[i + 1].value);

      await userEvent.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(nextRadio).toBeChecked();
        expect(nextRadio).toHaveFocus();
        expect(currentRadio).not.toBeChecked();
      });
    }
  });
};

export const withColorsActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as (BaseOption & { hex: string })[];
  const enabledOptions = options.filter((opt) => !opt.disabled);

  await step('Should render all color options correctly without text labels', async () => {
    expect(locators.radioGroupWrapper()).toBeInTheDocument();

    const radios = locators.allRadios();
    shouldVerifyRadiosMatchOptions(radios, options);

    for (const radio of radios) {
      expect(radio).not.toBeChecked();

      const siblingLabel = radio.nextElementSibling;
      if (siblingLabel && siblingLabel.tagName.toLowerCase() === 'label') {
        expect(siblingLabel).toBeEmptyDOMElement();
      }
    }
  });

  await step('Should allow selecting an active color option', async () => {
    await shouldVerifyExclusiveSelection(locators, enabledOptions[0].value, enabledOptions[1].value);
  });

  await step('Should not select a disabled color option', async () => {
    const disabledOption = options.find((opt) => opt.disabled);
    if (!disabledOption) return;

    await shouldVerifyDisabledNotSelectable(locators, disabledOption.value, enabledOptions[1].value);
  });
};

export const withImagesAndTooltipActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as (BaseOption & { tooltip: string })[];

  await step('Should render all options with their tooltip wrappers', async () => {
    expect(locators.radioGroupWrapper()).toBeInTheDocument();

    const radios = locators.allRadios();
    const tooltipWrappers = locators.tooltipWrappers();

    shouldVerifyRadiosMatchOptions(radios, options);
    expect(tooltipWrappers).toHaveLength(options.length);

    for (const [index, radio] of radios.entries()) {
      expect(radio).not.toBeChecked();
      expect(tooltipWrappers[index]).toBeInTheDocument();
    }
  });

  await step('Should display tooltip on hover and hide on unhover', async () => {
    const targetWrapper = locators.tooltipWrappers()[0];
    const expectedTooltipText = options[0].tooltip;
    const body = within(document.body);

    await userEvent.hover(targetWrapper);

    await waitFor(() => {
      expect(body.getByText(expectedTooltipText)).toBeVisible();
    });

    await userEvent.unhover(targetWrapper);

    await waitFor(() => {
      expect(body.queryByText(expectedTooltipText)).not.toBeInTheDocument();
    });
  });

  await step('Should select active option and ignore disabled one', async () => {
    const disabledOption = options.find((opt) => opt.disabled);
    if (!disabledOption) return;

    await userEvent.click(locators.radioItemByValue(options[0].value));
    await waitFor(() => {
      expect(locators.radioByValue(options[0].value)).toBeChecked();
    });

    await shouldVerifyDisabledNotSelectable(locators, disabledOption.value, options[0].value);
  });
};

export const withHorizontalLayoutActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as BaseOption[];

  await step('Should render the radio group wrapper', async () => {
    const wrapper = locators.radioGroupWrapper();
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toBeVisible();
  });

  await step(`Should render all options correctly in horizontal layout`, async () => {
    shouldVerifyRadiosMatchOptions(locators.allRadios(), options);
  });
};

export const withVerticalLayoutActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as BaseOption[];

  await step('Should render the radio group wrapper', async () => {
    const wrapper = locators.radioGroupWrapper();
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toBeVisible();
  });

  await step(`Should render all options correctly in vertical layout`, async () => {
    shouldVerifyRadiosMatchOptions(locators.allRadios(), options);
  });
};

export const withGridLayoutActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as BaseOption[];

  await step('Should render all options correctly in grid layout', async () => {
    shouldVerifyRadiosMatchOptions(locators.allRadios(), options);
  });
};

export const withCustomItemsActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const options = args['options'] as {
    value: string;
    payload: { title: string; subtitle: string; description: string; price: string };
  }[];

  await step('Should render custom card options correctly based on payload', async () => {
    const radios = locators.allRadios();
    const cards = locators.cards();

    expect(radios).toHaveLength(options.length);
    expect(cards).toHaveLength(options.length);

    for (const [index, card] of cards.entries()) {
      const { payload } = options[index];

      expect(card).toBeVisible();

      const cardContext = within(card);
      expect(cardContext.getByText(payload.title)).toBeVisible();
      expect(cardContext.getByText(payload.subtitle)).toBeVisible();
      expect(cardContext.getByText(payload.description)).toBeVisible();
      expect(cardContext.getByText(payload.price)).toBeVisible();
    }
  });

  await step('Should handle selection correctly', async () => {
    await shouldVerifyExclusiveSelection(locators, options[0].value, options[1].value);
  });
};

const shouldVerifyRadiosMatchOptions = (radios: HTMLElement[], options: BaseOption[]) => {
  expect(radios).toHaveLength(options.length);

  for (const [index, radio] of radios.entries()) {
    const option = options[index];
    expect(radio).toHaveAttribute('value', option.value);

    if (option.disabled) {
      expect(radio).toBeDisabled();
      expect(radio).toHaveAttribute('aria-disabled', 'true');
    } else {
      expect(radio).toBeEnabled();
    }
  }
};

const shouldVerifyExclusiveSelection = async (locators: Locators, firstValue: string, secondValue: string) => {
  const firstRadio = locators.radioByValue(firstValue);
  const secondRadio = locators.radioByValue(secondValue);

  await userEvent.click(locators.radioItemByValue(firstValue));
  await waitFor(() => {
    expect(firstRadio).toBeChecked();
  });

  await userEvent.click(locators.radioItemByValue(secondValue));
  await waitFor(() => {
    expect(secondRadio).toBeChecked();
    expect(firstRadio).not.toBeChecked();
  });
};

const shouldVerifyDisabledNotSelectable = async (
  locators: Locators,
  disabledValue: string,
  previouslySelectedValue?: string
) => {
  const disabledRadio = locators.radioByValue(disabledValue);

  await userEvent.click(locators.radioItemByValue(disabledValue));

  await waitFor(() => {
    expect(disabledRadio).not.toBeChecked();
    if (previouslySelectedValue) {
      expect(locators.radioByValue(previouslySelectedValue)).toBeChecked();
    }
  });
};
