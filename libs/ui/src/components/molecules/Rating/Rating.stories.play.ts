import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { tabToNext } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  rating: () => canvas.getByTestId('Rating'),
  allStarLabels: () => canvas.getAllByTestId('Rating-label'),
  allStarInputs: () => canvas.getAllByTestId('Rating-input'),
});

export const preSelectedValueActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Rating component', async () => {
    const rating = locators.rating();
    expect(rating).toBeInTheDocument();
    expect(rating).toBeVisible();
  });

  await step('Should render all 5 stars', async () => {
    const stars = locators.allStarInputs();
    expect(stars).toHaveLength(5);
  });

  await step('Should have initial value 3 selected', async () => {
    const inputs = locators.allStarInputs();
    expect(inputs[2]).toBeChecked();
  });

  await step('Should update selection for each star', async () => {
    const labels = locators.allStarLabels();
    const inputs = locators.allStarInputs();

    for (const [i, currentInput] of inputs.entries()) {
      const currentLabel = labels[i];
      const starValue = i + 1;

      await step(`Should update selection for star ${starValue}`, async () => {
        await userEvent.click(currentLabel);
        expect(currentLabel).toHaveFocus();

        expect(currentInput).toBeChecked();
        expect(currentInput).toHaveAttribute('aria-checked', 'true');
        expect(currentInput.value).toBe(starValue.toString());

        const starIcon = within(currentLabel).getByTestId('Icon-star');
        expect(starIcon).toBeVisible();

        const style = window.getComputedStyle(starIcon);
        expect(style.fill).toBe('none');
      });
    }
  });

  await step('Should have input role for accessibility', async () => {
    const allStarInputs = locators.allStarInputs();
    for (const starInput of allStarInputs) {
      expect(starInput).toHaveAttribute('type', 'radio');
    }
  });

  await step('Should belong to the same radio group', async () => {
    const inputs = locators.allStarInputs() as HTMLInputElement[];
    const groupName = inputs[0].getAttribute('name');
    for (const input of inputs) {
      expect(input).toHaveAttribute('name', groupName);
    }
  });

  await step('Should show hover state on stars', async () => {
    const labels = locators.allStarLabels();
    const thirdStarLabel = labels[2];

    await userEvent.hover(thirdStarLabel);

    const starIcon = within(thirdStarLabel).getByTestId('Icon-star');
    expect(starIcon).toBeVisible();

    const style = window.getComputedStyle(thirdStarLabel);
    expect(style.cursor).toBe('pointer');
  });

  await step('Should remove hover state when mouse leaves', async () => {
    const labels = locators.allStarLabels();
    const thirdStarLabel = labels[2];

    await userEvent.hover(thirdStarLabel);
    await userEvent.unhover(thirdStarLabel);

    const starIcon = within(thirdStarLabel).getByTestId('Icon-star');
    expect(starIcon).toBeVisible();
  });

  await step('Should allow keyboard navigation through tabs', async () => {
    const allStarLabels = locators.allStarLabels();
    await userEvent.click(document.body);

    for (const starLabel of allStarLabels) {
      await tabToNext();
      expect(starLabel).toHaveFocus();
    }
  });
};

export const readOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Rating component', async () => {
    const rating = locators.rating();
    expect(rating).toBeInTheDocument();
  });

  await step('Should render all 5 stars', async () => {
    const stars = locators.allStarInputs();
    expect(stars).toHaveLength(5);
  });

  await step('Should not allow selection of stars (Read Only)', async () => {
    const stars = locators.allStarInputs();
    for (const star of stars) {
      expect(star).toHaveAttribute('readonly');
    }
  });

  await step('Should NOT change value when clicked in Read Only mode', async () => {
    const star1Label = locators.allStarLabels()[0];
    const star3Input = locators.allStarInputs()[3];

    await userEvent.click(star1Label);
    expect(star3Input).not.toBeChecked();
  });
};

export const maxValueCustom10Actions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Rating component', async () => {
    const rating = locators.rating();
    expect(rating).toBeInTheDocument();
  });

  await step('Should render all 10 stars', async () => {
    const stars = locators.allStarInputs();
    expect(stars).toHaveLength(10);
  });

  await step('Should update selection for each star', async () => {
    const labels = locators.allStarLabels();
    const inputs = locators.allStarInputs();

    for (const [i, currentInput] of inputs.entries()) {
      const currentLabel = labels[i];
      const starValue = i + 1;

      await step(`Should update selection for star ${starValue}`, async () => {
        await userEvent.click(currentLabel);

        expect(currentInput).toBeChecked();
        expect(currentInput).toHaveAttribute('aria-checked', 'true');
        expect(currentInput.value).toBe(starValue.toString());
      });
    }
  });
};

export const withCustomOnChangeControlActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Rating component', async () => {
    const rating = locators.rating();
    expect(rating).toBeInTheDocument();
    expect(rating).toBeVisible();
  });

  await step('Should render initial state (value 0)', async () => {
    const inputs = locators.allStarInputs();
    for (const input of inputs) {
      expect(input).not.toBeChecked();
    }
  });

  await step('Should update selection for each star', async () => {
    const labels = locators.allStarLabels();
    const inputs = locators.allStarInputs();

    for (const [i, currentInput] of inputs.entries()) {
      const currentLabel = labels[i];
      const starValue = i + 1;

      await step(`Should update selection for star ${starValue}`, async () => {
        await userEvent.click(currentLabel);

        expect(currentInput).toBeChecked();
        expect(currentInput).toHaveAttribute('aria-checked', 'true');
        expect(currentInput.value).toBe(starValue.toString());
      });
    }
  });
};
