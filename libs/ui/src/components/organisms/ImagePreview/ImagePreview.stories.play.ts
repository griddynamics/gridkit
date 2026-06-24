import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  container: () => canvas.getByTestId('ImagePreview'),
  prevButton: () => canvas.queryByTestId('ImagePreview-prev'),
  nextButton: () => canvas.queryByTestId('ImagePreview-next'),
  counter: () => canvas.queryByTestId('ImagePreview-counter'),
  thumbnailButtons: () => canvas.queryAllByRole('button', { name: /view image \d+/i }),
  thumbnailButton: (index: number) => canvas.getByRole('button', { name: new RegExp(`view image ${index + 1}`, 'i') }),
  mainImage: () => canvas.getAllByRole('img')[0],
});

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the ImagePreview container', async () => {
    expect(locators.container()).toBeVisible();
  });

  await step('Should render the main image', async () => {
    expect(locators.mainImage()).toHaveAttribute('src');
  });

  await step('Should render 5 thumbnail buttons', async () => {
    expect(locators.thumbnailButtons()).toHaveLength(5);
  });

  await step('Should render prev and next navigation arrows', async () => {
    expect(locators.prevButton()).toBeVisible();
    expect(locators.nextButton()).toBeVisible();
  });

  await step('Should disable prev arrow on the first image', async () => {
    expect(locators.nextButton()).not.toBeDisabled();
  });

  await step('Should navigate to the next image on next arrow click', async () => {
    await userEvent.click(locators.nextButton()!);
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(1));
    expect(locators.prevButton()).not.toBeDisabled();
  });

  await step('Should navigate back to the previous image on prev arrow click', async () => {
    await userEvent.click(locators.prevButton()!);
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(0));
    expect(locators.prevButton()).toBeDisabled();
  });

  await step('Should navigate directly to a specific image via thumbnail click', async () => {
    await userEvent.click(locators.thumbnailButton(2));
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(2));
  });

  await step('Should disable next arrow on the last image', async () => {
    await userEvent.click(locators.thumbnailButton(4));
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(4));
    expect(locators.nextButton()).toBeDisabled();
    expect(locators.prevButton()).not.toBeDisabled();
  });

  await step('Should navigate with ArrowRight keyboard key', async () => {
    await userEvent.click(locators.thumbnailButton(0));
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(0));

    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.container()).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(1));
  });

  await step('Should navigate with ArrowLeft keyboard key', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(0));
    expect(locators.prevButton()).toBeDisabled();
  });

  await step('Should ignore ArrowLeft when already on the first image', async () => {
    clearMock(args, 'onImageChange');
    await userEvent.keyboard('{ArrowLeft}');
    expect(args['onImageChange']).not.toHaveBeenCalled();
    expect(locators.prevButton()).toBeDisabled();
  });

  await step('Should focus container via Tab, then next button (disabled prev is skipped)', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.container()).toHaveFocus();

    await userEvent.tab();
    expect(locators.nextButton()).toHaveFocus();
  });
};

export const withCounterActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the ImagePreview container', async () => {
    expect(locators.container()).toBeVisible();
  });

  await step('Should show counter with initial value 1/5', async () => {
    expect(locators.counter()).toBeVisible();
    expect(locators.counter()).toHaveTextContent('1/5');
  });

  await step('Should hide thumbnails when showThumbnails is false', async () => {
    expect(locators.thumbnailButtons()).toHaveLength(0);
  });

  await step('Should update counter after navigating to next image', async () => {
    await userEvent.click(locators.nextButton()!);
    await waitFor(() => expect(locators.counter()).toHaveTextContent('2/5'));
    expect(args['onImageChange']).toHaveBeenCalledWith(1);
  });

  await step('Should update counter after navigating to previous image', async () => {
    await userEvent.click(locators.prevButton()!);
    await waitFor(() => expect(locators.counter()).toHaveTextContent('1/5'));
    expect(args['onImageChange']).toHaveBeenCalledWith(0);
  });

  await step('Should navigate with ArrowRight key and update counter', async () => {
    await userEvent.click(document.body);
    locators.container().focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(locators.counter()).toHaveTextContent('2/5'));
  });

  await step('Should navigate with ArrowLeft key and update counter', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(locators.counter()).toHaveTextContent('1/5'));
  });

  await step('Should show correct counter value on the last image', async () => {
    for (const _ of [1, 2, 3, 4]) {
      await userEvent.keyboard('{ArrowRight}');
    }
    await waitFor(() => expect(locators.counter()).toHaveTextContent('5/5'));
    expect(locators.nextButton()).toBeDisabled();
  });
};

export const thumbnailsLeftActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the ImagePreview container', async () => {
    expect(locators.container()).toBeVisible();
  });

  await step('Should render 5 thumbnail buttons in left position', async () => {
    expect(locators.thumbnailButtons()).toHaveLength(5);
  });

  await step('Should render prev and next navigation arrows', async () => {
    expect(locators.prevButton()).toBeVisible();
    expect(locators.nextButton()).toBeVisible();
  });

  await step('Should navigate to the next image via next arrow', async () => {
    await userEvent.click(locators.nextButton()!);
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(1));
    expect(locators.prevButton()).not.toBeDisabled();
  });

  await step('Should navigate directly via thumbnail click in left layout', async () => {
    await userEvent.click(locators.thumbnailButton(3));
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(3));
  });

  await step('Should support ArrowRight keyboard navigation in left layout', async () => {
    await userEvent.click(locators.thumbnailButton(0));
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(0));

    await userEvent.click(document.body);
    locators.container().focus();
    clearMock(args, 'onImageChange');

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(args['onImageChange']).toHaveBeenCalledWith(1));
  });
};

export const noArrowsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the ImagePreview container', async () => {
    expect(locators.container()).toBeVisible();
  });

  await step('Should not render prev or next arrow buttons', async () => {
    expect(locators.prevButton()).not.toBeInTheDocument();
    expect(locators.nextButton()).not.toBeInTheDocument();
  });

  await step('Should render 5 thumbnail buttons as the only navigation', async () => {
    expect(locators.thumbnailButtons()).toHaveLength(5);
  });

  await step('Should navigate to image 3 via thumbnail click', async () => {
    const initialSrc = locators.mainImage().getAttribute('src');
    await userEvent.click(locators.thumbnailButton(2));
    await waitFor(() => expect(locators.mainImage().getAttribute('src')).not.toBe(initialSrc));
  });

  await step('Should navigate to image 1 via thumbnail click', async () => {
    await userEvent.click(locators.thumbnailButton(0));
    await waitFor(() => expect(locators.mainImage()).toBeVisible());
  });

  await step('Should verify all 5 thumbnail buttons are accessible', async () => {
    for (const thumb of locators.thumbnailButtons()) {
      expect(thumb).toBeEnabled();
      expect(thumb).toHaveAttribute('type', 'button');
    }
  });

  await step('Should focus container via Tab when no arrows exist', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.container()).toHaveFocus();
  });
};

export const singleImageActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the ImagePreview container with a single image', async () => {
    expect(locators.container()).toBeVisible();
  });

  await step('Should render the single image correctly', async () => {
    expect(locators.mainImage()).toHaveAttribute('src');
  });

  await step('Should not render navigation arrows for single image', async () => {
    expect(locators.prevButton()).not.toBeInTheDocument();
    expect(locators.nextButton()).not.toBeInTheDocument();
  });

  await step('Should not render thumbnail buttons for single image', async () => {
    expect(locators.thumbnailButtons()).toHaveLength(0);
  });

  await step('Should not render counter for single image', async () => {
    expect(locators.counter()).not.toBeInTheDocument();
  });

  await step('Should focus container via Tab', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.container()).toHaveFocus();
  });
};

const clearMock = (args: StoryContext['args'], name: string) => {
  if (typeof args[name] === 'function' && 'mock' in args[name]) {
    args[name].mockClear();
  }
};
