import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => {
  const queryContentContainer = () => canvas.queryByTestId('Carousel-content-container');
  const getContentContainer = () => {
    const contentContainer = queryContentContainer();

    if (!contentContainer) {
      throw new Error('Carousel content container is only expected for stories with custom overlay content.');
    }

    return contentContainer;
  };

  return {
    carouselWrapper: () => canvas.getByTestId('Carousel'),
    carouselThumbnails: () => canvas.getByTestId('Carousel-thumbnails'),
    carouselContentContainer: queryContentContainer,

    carouselControlNext: () => canvas.queryByTestId('Carousel-control-next'),
    carouselControlPrevious: () => canvas.queryByTestId('Carousel-control-previous'),

    carouselThumbnailControlNext: () => canvas.getByTestId('Carousel-thumbnail-control-next'),
    carouselThumbnailControlPrevious: () => canvas.getByTestId('Carousel-thumbnail-control-previous'),

    allImages: () => canvas.getAllByTestId('Image'),
    mainSlideImage: (index: number) => within(canvas.getByTestId(`Carousel-slide-${index}`)).getByTestId('Image'),
    thumbnailImage: (index: number) => within(canvas.getByTestId(`Carousel-thumbnail-${index}`)).getByTestId('Image'),

    carouselThumbnailButton: (index: number) => canvas.getByTestId(`Carousel-thumbnail-${index}`),

    carouselDotsWrapper: () => canvas.getByTestId('Carousel-dots'),
    carouselDot: (index: number) => within(canvas.getByTestId('Carousel-dots')).getAllByRole('button')[index],

    contentText: (text: string) => within(getContentContainer()).getByText(text),
    contentButton: (name: string | RegExp) => within(getContentContainer()).getByRole('button', { name }),
  };
};

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicCarouselComponents(locators, step);

  await step('Should allow to navigate through the carousel', async () => {
    expect(locators.carouselControlNext()).toBeInTheDocument();
    expect(locators.carouselControlNext()).toBeVisible();
    expect(locators.carouselControlNext()).not.toBeDisabled();

    expect(locators.carouselControlPrevious()).toBeInTheDocument();
    expect(locators.carouselControlPrevious()).toBeVisible();
    expect(locators.carouselControlPrevious()).toBeDisabled();

    await userEvent.click(locators.carouselControlNext()!);
  });

  await step('Should verify that the carousel is navigated to the next slide', async () => {
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });
  });

  await step('Should allow to navigate through the carousel thumbnails', async () => {
    expect(locators.carouselThumbnailControlNext()).toBeInTheDocument();
    expect(locators.carouselThumbnailControlNext()).toBeVisible();
    expect(locators.carouselThumbnailControlNext()).toBeDisabled();

    expect(locators.carouselThumbnailControlPrevious()).toBeInTheDocument();
    expect(locators.carouselThumbnailControlPrevious()).toBeVisible();
    expect(locators.carouselThumbnailControlPrevious()).not.toBeDisabled();

    await userEvent.click(locators.carouselThumbnailControlPrevious());
  });

  await step('Should verify that the carousel is navigated to the previous slide', async () => {
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'true');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'false');
    });

    expect(locators.carouselThumbnailControlPrevious()).toBeDisabled();
  });

  await step('Should navigate to specific slide by clicking a thumbnail directly', async () => {
    await userEvent.click(locators.carouselThumbnailButton(1));
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });

    await userEvent.click(locators.carouselThumbnailButton(0));
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'true');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'false');
    });
  });

  await step('Should render images with valid source attributes', async () => {
    const allImages = locators.allImages();
    expect(allImages.length).toBeGreaterThan(0);

    for (const image of allImages) {
      expect(image).toHaveAttribute('src');
    }
  });

  await step('Should display the correct main image that matches the clicked thumbnail', async () => {
    const expectedSrc = locators.thumbnailImage(1).getAttribute('src');
    expect(expectedSrc).toBeTruthy();

    await userEvent.click(locators.carouselThumbnailButton(1));

    await waitFor(() => {
      expect(locators.mainSlideImage(1)).toHaveAttribute('src', expectedSrc!);
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });
  });

  await step('Should support Arrows keys keyboard navigation and focus management inside the carousel', async () => {
    await userEvent.click(document.body);

    await userEvent.tab();

    await expect(locators.carouselWrapper()).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'true');
    });
  });

  await step('Should focus carousel next button and activate it via keyboard', async () => {
    await userEvent.tab();
    await expect(locators.carouselControlNext()).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });
  });

  await step('Should support keyboard navigation and focus management inside the thumbnails', async () => {
    await userEvent.click(document.body);

    const thumb0 = locators.carouselThumbnailButton(0);

    let safetyCounter = 0;
    while (document.activeElement !== thumb0 && safetyCounter < 15) {
      await userEvent.tab();
      safetyCounter++;
    }

    const thumbIndices = [0, 1];

    for (const index of thumbIndices) {
      const thumb = locators.carouselThumbnailButton(index);

      await expect(thumb).toHaveFocus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(thumb).toHaveAttribute('data-active', 'true');
      });

      if (index < thumbIndices.length - 1) {
        await userEvent.tab();
      }
    }
  });
};

export const withoutNavigationArrowsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicCarouselComponents(locators, step);

  await step('Should render Carousel component without navigation arrows', async () => {
    expect(locators.carouselControlNext()).not.toBeInTheDocument();
    expect(locators.carouselControlPrevious()).not.toBeInTheDocument();
  });

  await step('Should allow to navigate through the carousel thumbnails', async () => {
    expect(locators.carouselThumbnailControlNext()).toBeInTheDocument();
    expect(locators.carouselThumbnailControlNext()).toBeVisible();
    expect(locators.carouselThumbnailControlNext()).not.toBeDisabled();

    expect(locators.carouselThumbnailControlPrevious()).toBeInTheDocument();
    expect(locators.carouselThumbnailControlPrevious()).toBeVisible();
    expect(locators.carouselThumbnailControlPrevious()).toBeDisabled();

    await userEvent.click(locators.carouselThumbnailControlNext());
  });

  await step('Should verify that the carousel is navigated to the previous slide', async () => {
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });

    expect(locators.carouselThumbnailControlPrevious()).not.toBeDisabled();
  });

  await step('Should navigate to specific slide by clicking a thumbnail directly', async () => {
    await userEvent.click(locators.carouselThumbnailButton(0));
    await waitFor(() => {
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'true');
    });
  });
};

export const withNavigationDotsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicCarouselComponents(locators, step);

  await step('Should render navigation dots wrapper and buttons', async () => {
    expect(locators.carouselDotsWrapper()).toBeInTheDocument();
    expect(locators.carouselDotsWrapper()).toBeVisible();

    expect(locators.carouselDot(0)).toBeInTheDocument();
    expect(locators.carouselDot(1)).toBeInTheDocument();
  });

  await step('Should display correct initial active state for dots', async () => {
    expect(locators.carouselDot(0)).toHaveAttribute('data-active', 'true');
    expect(locators.carouselDot(1)).toHaveAttribute('data-active', 'false');
  });

  await step('Should allow to navigate through the carousel using dots', async () => {
    await userEvent.click(locators.carouselDot(1));
    await waitFor(() => {
      expect(locators.carouselDot(0)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselDot(1)).toHaveAttribute('data-active', 'true');
    });
  });
};

export const layoutVerticalActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicCarouselComponents(locators, step);

  await step('Should allow vertical carousel navigation through the main controls', async () => {
    expect(locators.carouselControlNext()).toBeInTheDocument();
    expect(locators.carouselControlNext()).toBeVisible();
    expect(locators.carouselControlNext()).not.toBeDisabled();

    expect(locators.carouselControlPrevious()).toBeInTheDocument();
    expect(locators.carouselControlPrevious()).toBeVisible();
    expect(locators.carouselControlPrevious()).toBeDisabled();

    await userEvent.click(locators.carouselControlNext()!);

    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });
  });

  await step('Should allow returning to the previous slide in vertical layout', async () => {
    await userEvent.click(locators.carouselControlPrevious()!);

    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'true');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'false');
    });
  });

  await step('Should allow vertical carousel navigation through thumbnail buttons', async () => {
    await userEvent.click(locators.carouselThumbnailButton(1));

    await waitFor(() => {
      expect(locators.carouselThumbnailButton(0)).toHaveAttribute('data-active', 'false');
      expect(locators.carouselThumbnailButton(1)).toHaveAttribute('data-active', 'true');
    });
  });
};

export const withCustomContentActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBasicCarouselComponents(locators, step);

  await step('Should render Carousel content container for custom overlay content', async () => {
    expect(locators.carouselContentContainer()).toBeVisible();
  });

  await step('Should render custom content on initialization', async () => {
    expect(locators.contentText('Title')).toBeVisible();
    expect(locators.contentText('Text')).toBeVisible();
    expect(locators.contentButton(/more info/i)).toBeVisible();
  });

  await step('Should keep custom content visible after navigating to the next slide', async () => {
    await userEvent.click(locators.carouselControlNext()!);

    await waitFor(() => {
      expect(locators.contentText('Title')).toBeVisible();
      expect(locators.contentText('Text')).toBeVisible();
      expect(locators.contentButton(/more info/i)).toBeVisible();
    });
  });
};

const shouldRenderBasicCarouselComponents = async (
  locators: ReturnType<typeof getLocators>,
  step: StoryContext['step']
) => {
  await step('Should render Carousel component', async () => {
    expect(locators.carouselWrapper()).toBeVisible();
  });

  await step('Should render Carousel thumbnails', async () => {
    expect(locators.carouselThumbnails()).toBeVisible();
  });
};
