import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => {
  const getDotsWrapper = () => canvas.getByTestId('ContentCarousel-dots');

  return {
    carouselWrapper: () => canvas.getByTestId('ContentCarousel'),
    viewport: () => canvas.getByTestId('ContentCarousel-viewport'),
    sliderWrapper: () => canvas.getByTestId('ContentCarousel-slider-wrapper'),
    footer: () => canvas.getByTestId('ContentCarousel-footer'),

    slide: (index: number) => canvas.getByTestId(`ContentCarousel-content-slide-${index}`),
    allSlides: () => canvas.getAllByTestId(/ContentCarousel-content-slide-/),

    controlNext: () => canvas.getByTestId('ContentCarousel-control-next'),
    controlPrevious: () => canvas.getByTestId('ContentCarousel-control-previous'),

    dotsWrapper: getDotsWrapper,
    allDots: () => within(getDotsWrapper()).getAllByRole('button'),
    dot: (index: number) => within(getDotsWrapper()).getAllByRole('button')[index],
  };
};

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicContentCarouselComponents(locators, step);

  await step('Should verify initial state of controls and dots', async () => {
    expect(locators.controlPrevious()).toBeDisabled();
    expect(locators.controlNext()).not.toBeDisabled();

    await expect(locators.dot(0)).toHaveAttribute('data-active', 'true');
    await expect(locators.dot(1)).toHaveAttribute('data-active', 'false');
  });

  await step('Should navigate using arrow controls', async () => {
    await userEvent.click(locators.controlNext());

    await waitFor(() => {
      expect(locators.controlNext()).not.toBeDisabled();
      expect(locators.controlPrevious()).not.toBeDisabled();
    });

    await waitFor(() => {
      expect(locators.dot(0)).toHaveAttribute('data-active', 'false');
      expect(locators.dot(1)).toHaveAttribute('data-active', 'true');
    });
  });

  await step('Should navigate using all pagination dots', async () => {
    const dots = locators.allDots();

    for (const [index, dot] of dots.entries()) {
      await userEvent.click(dot);

      await waitFor(() => {
        expect(dot).toHaveAttribute('data-active', 'true');
        if (index > 0) {
          expect(dots[index - 1]).toHaveAttribute('data-active', 'false');
        }
      });
    }
  });

  await step('Should support keyboard navigation using Arrow keys', async () => {
    await userEvent.click(document.body);

    const dots = locators.allDots();
    const last = dots.length - 1;
    const prev = dots.length - 2;

    await expect(locators.carouselWrapper()).toHaveAttribute('tabindex', '0');
    await userEvent.tab();
    expect(locators.carouselWrapper()).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(locators.dot(prev)).toHaveAttribute('data-active', 'true');
      expect(locators.dot(last)).toHaveAttribute('data-active', 'false');
    });

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(locators.dot(last)).toHaveAttribute('data-active', 'true');
      expect(locators.dot(prev)).toHaveAttribute('data-active', 'false');
    });
  });

  await step('Should support keyboard navigation using Enter on UI controls', async () => {
    const dots = locators.allDots();
    const last = dots.length - 1;
    const prev = dots.length - 2;

    let count = 0;
    while (document.activeElement !== locators.controlPrevious() && count++ < 15) {
      await userEvent.tab();
    }
    expect(locators.controlPrevious()).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(locators.dot(prev)).toHaveAttribute('data-active', 'true');
      expect(locators.dot(last)).toHaveAttribute('data-active', 'false');
    });

    count = 0;
    while (document.activeElement !== locators.dot(0) && count++ < 15) {
      await userEvent.tab();
    }
    expect(locators.dot(0)).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(locators.dot(0)).toHaveAttribute('data-active', 'true');
      expect(locators.dot(prev)).toHaveAttribute('data-active', 'false');
    });
  });
};

export const customScrollStepActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicContentCarouselComponents(locators, step);

  await step('Should calculate pagination dots correctly based on custom scroll step', async () => {
    const dotsCount = locators.allDots().length;
    const slidesCount = locators.allSlides().length;

    expect(dotsCount).toBeGreaterThan(0);
    expect(dotsCount).toBeLessThan(slidesCount);
  });

  await step('Should correctly disable "Next" button when reaching the last group of items', async () => {
    const dots = locators.allDots();
    const lastIndex = dots.length - 1;
    const lastDot = locators.dot(lastIndex);

    await userEvent.click(lastDot);

    await waitFor(() => {
      expect(lastDot).toHaveAttribute('data-active', 'true');
      expect(locators.controlNext()).toBeDisabled();
      expect(locators.controlPrevious()).not.toBeDisabled();
    });
  });

  await step('Should correctly disable "Previous" button when returning to the first group', async () => {
    const firstDot = locators.dot(0);
    await userEvent.click(firstDot);

    await waitFor(() => {
      expect(firstDot).toHaveAttribute('data-active', 'true');
      expect(locators.controlPrevious()).toBeDisabled();
      expect(locators.controlNext()).not.toBeDisabled();
    });
  });
};

const shouldRenderBasicContentCarouselComponents = async (
  locators: ReturnType<typeof getLocators>,
  step: StoryContext['step']
) => {
  await step('Should render basic ContentCarousel components', async () => {
    expect(locators.carouselWrapper()).toBeVisible();
    expect(locators.viewport()).toBeVisible();
    expect(locators.sliderWrapper()).toBeVisible();
    expect(locators.footer()).toBeVisible();
    expect(locators.slide(0)).toBeVisible();
  });

  await step('Should render all slides in the DOM dynamically', async () => {
    const allSlides = locators.allSlides();
    expect(allSlides.length).toBeGreaterThan(0);

    for (const slide of allSlides) {
      expect(slide).toBeInTheDocument();
    }
  });
};
