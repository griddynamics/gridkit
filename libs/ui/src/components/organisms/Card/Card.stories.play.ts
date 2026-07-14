import { within, expect, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { waitForImageLoad, clickInput, clearInput, fillInput, tabToNext, typeIntoInput } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  cardImage: () => canvas.getByRole('img'),
  cardTitleHeading: () => canvas.getByRole('heading'),
  cardDescriptionText: () => canvas.getByTestId('CardDescription'),
  cardRatingContainer: () => canvas.getByTestId('CardRating'),
  cardRatingProgressBar: () => canvas.getByTestId('Rating-progress'),
  cardPriceText: () => canvas.getByTestId('CardPrice'),
  counterDecrementButton: () => canvas.getByTestId('Counter-button-decrease'),
  counterIncrementButton: () => canvas.getByTestId('Counter-button-increase'),
  counterInput: () => canvas.getByTestId('Counter-input'),
  cardProductSkuText: () => canvas.getByTestId('card-product-sku'),
  cardProductVariantText: () => canvas.getByTestId('card-product-variant'),
  cardContainer: () => canvas.getByTestId('Card'),
  queryNotificationAlert: () => canvas.queryByRole('alert'),
});

const testImageLoading = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should load image', async () => {
    await waitForImageLoad(() => locators.cardImage());
    const imageSrc = locators.cardImage().getAttribute('src');
    expect(imageSrc).toBeTruthy();
  });
};

const testCardDetails = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should display card details', async () => {
    const cardTitle = locators.cardTitleHeading();
    const cardDescription = locators.cardDescriptionText();
    const cardPrice = locators.cardPriceText();

    expect(cardTitle).toBeInTheDocument();
    expect(cardTitle).toHaveTextContent('Card Title');
    expect(cardDescription).toBeInTheDocument();
    expect(cardDescription).toHaveTextContent(/example text to build on the card title/i);
    expect(cardPrice).toBeInTheDocument();
    expect(cardPrice).toHaveTextContent('20$');
  });
};

const testCardRating = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should display card rating', async () => {
    const cardRating = locators.cardRatingContainer();
    const cardRatingProgress = locators.cardRatingProgressBar();

    expect(cardRating).toBeInTheDocument();
    expect(cardRatingProgress).toBeInTheDocument();
  });
};

const testHorizontalCardDetails = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should display product SKU and variant', async () => {
    const cardProductSku = locators.cardProductSkuText();
    const cardProductVariant = locators.cardProductVariantText();

    expect(cardProductSku).toBeInTheDocument();
    expect(cardProductSku).toHaveTextContent('ID 5463728');
    expect(cardProductVariant).toBeInTheDocument();
    expect(cardProductVariant).toHaveTextContent('Color:');
    expect(cardProductVariant).toHaveTextContent('Size:');
  });
};

const testCounterIncrement = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should increment counter', async () => {
    const counterInput = locators.counterInput();
    const counterIncrement = locators.counterIncrementButton();
    const valueBeforeIncrement = parseInt(counterInput.value, 10);
    await clickInput(counterIncrement);
    await waitFor(() => {
      expect(parseInt(locators.counterInput().value, 10)).toBe(valueBeforeIncrement + 1);
    });
  });
};

const testCounterDecrement = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should decrement counter', async () => {
    const counterInput = locators.counterInput();
    const counterDecrement = locators.counterDecrementButton();
    const valueBeforeDecrement = parseInt(counterInput.value, 10);
    await clickInput(counterDecrement);
    await waitFor(() => {
      expect(parseInt(locators.counterInput().value, 10)).toBe(valueBeforeDecrement - 1);
    });
  });
};

const testCounterMinimumValue = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should not allow counter to go below minimum', async () => {
    while (parseInt(locators.counterInput().value, 10) > 1) {
      await clickInput(locators.counterDecrementButton());
      await waitFor(() => {
        const currentValue = parseInt(locators.counterInput().value, 10);
        expect(currentValue).toBeGreaterThanOrEqual(1);
      });
    }

    await step('Verify decrement button is disabled at minimum', async () => {
      expect(locators.counterInput().value).toBe('1');
      expect(locators.counterDecrementButton()).toBeDisabled();
      expect(locators.counterIncrementButton()).not.toBeDisabled();
    });

    await step('Verify decrement enables after incrementing', async () => {
      await clickInput(locators.counterIncrementButton());
      await waitFor(() => expect(locators.counterInput().value).toBe('2'));
      expect(locators.counterDecrementButton()).not.toBeDisabled();
    });
  });
};

const testCounterInput = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should input counter value', async () => {
    const counterInput = locators.counterInput();
    await fillInput(counterInput, '7');
    expect(locators.counterInput().value).toBe('7');

    await tabToNext();
    await waitFor(() => {
      expect(locators.counterInput().value).toBe('7');
    });
  });
};

const testCounterInputValidation = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should reject invalid input', async () => {
    await step('Reject non-numeric characters', async () => {
      await clearInput(locators.counterInput());
      await fillInput(locators.counterInput(), 'abc');
      expect(locators.counterInput().value).toBe('');
    });

    await step('Filter mixed alphanumeric input', async () => {
      await typeIntoInput(locators.counterInput(), '1a2b3');
      expect(locators.counterInput().value).toBe('123');
    });

    await step('Revert to previous value when empty', async () => {
      await clearInput(locators.counterInput());
      await tabToNext();
      await waitFor(() => {
        const value = locators.counterInput().value;
        expect(value).not.toBe('');
        expect(parseInt(value, 10)).toBeGreaterThan(0);
      });
    });
  });
};

const testCompleteInteractionFlow = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should complete interaction flow', async () => {
    await step('Verify card content is visible', async () => {
      expect(locators.cardTitleHeading()).toBeVisible();
      expect(locators.cardTitleHeading()).toHaveTextContent('Card Title');
      expect(locators.cardDescriptionText()).toBeVisible();
      expect(locators.cardDescriptionText()).toHaveTextContent(/example text/i);
    });

    await step('Reset counter to initial state', async () => {
      const counterInput = locators.counterInput();
      await clearInput(counterInput);
      await fillInput(counterInput, '1');
      await tabToNext();
      await waitFor(() => expect(locators.counterInput().value).toBe('1'));
    });

    await step('Increment counter 3 times', async () => {
      for (let i = 0; i < 3; i++) {
        const currentValue = parseInt(locators.counterInput().value, 10);
        await clickInput(locators.counterIncrementButton());
        await waitFor(() => {
          expect(parseInt(locators.counterInput().value, 10)).toBe(currentValue + 1);
        });
      }
      expect(locators.counterInput().value).toBe('4');
    });

    await step('Fill counter input with 10', async () => {
      const counterInput = locators.counterInput();
      await clearInput(counterInput);
      await fillInput(counterInput, '10');
      await tabToNext();
      await waitFor(() => expect(locators.counterInput().value).toBe('10'));
    });
  });
};

export const withVerticalCardActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render and display vertical card with all elements', async () => {
    await testImageLoading(locators, step);
    await testCardDetails(locators, step);
    await testCardRating(locators, step);
  });

  await step('Should handle counter interactions correctly', async () => {
    await testCounterIncrement(locators, step);
    await testCounterDecrement(locators, step);
    await testCounterMinimumValue(locators, step);
    await testCounterInput(locators, step);
    await testCounterInputValidation(locators, step);
  });

  await step('Should complete full interaction flow', async () => {
    await testCompleteInteractionFlow(locators, step);
  });
};

export const withHorizontalCardActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render and display horizontal card with all elements', async () => {
    await testImageLoading(locators, step);
    await testCardDetails(locators, step);
    await testCardRating(locators, step);
    await testHorizontalCardDetails(locators, step);
  });

  await step('Should handle counter interactions correctly', async () => {
    await testCounterIncrement(locators, step);
    await testCounterDecrement(locators, step);
    await testCounterMinimumValue(locators, step);
    await testCounterInput(locators, step);
    await testCounterInputValidation(locators, step);
  });

  await testCompleteInteractionFlow(locators, step);
};

export const myCardWithFallbackImageActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should display fallback component when image fails to load', async () => {
    await waitFor(
      () => {
        const notification = locators.queryNotificationAlert();
        expect(notification).toBeInTheDocument();
      },
      { timeout: 3000, interval: 500 }
    );
  });

  await step('Should display error notification with correct message', async () => {
    const notification = locators.queryNotificationAlert();
    expect(notification).toHaveTextContent(/something wrong with image/i);
  });

  await step('Should display card title and description', async () => {
    const cardTitle = locators.cardTitleHeading();
    expect(cardTitle).toBeInTheDocument();
    expect(cardTitle).toHaveTextContent('Card Title');

    const cardDescription = locators.cardDescriptionText();
    expect(cardDescription).toBeInTheDocument();
    expect(cardDescription).toHaveTextContent(/example text/i);
  });

  await step('Should maintain card structure despite image failure', async () => {
    const card = locators.cardContainer();
    expect(card).toBeInTheDocument();

    expect(locators.cardTitleHeading()).toBeVisible();
    expect(locators.cardTitleHeading()).toHaveTextContent('Card Title');
    expect(locators.cardDescriptionText()).toBeVisible();
    expect(locators.cardDescriptionText()).toHaveTextContent(/example text/i);
  });
};
