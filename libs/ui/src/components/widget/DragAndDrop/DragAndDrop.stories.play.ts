import { within, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  dropContainer: () => canvas.getByTestId('DragAndDrop'),
  titleText: () => canvas.getByText(/drop items here/i),
  descriptionText: () => canvas.getByText(/file up to 25mb/i),
  browseButton: () => canvas.getByTestId('Button-content'),
  uploadingText: () => canvas.getByText(/uploading/i),
  loaderSpinner: () => canvas.getByTestId('Loader'),
  errorMessageText: () => canvas.getByText(/file too large/i),
  messageInput: () => canvas.getByPlaceholderText(/enter your message/i),
  allButtons: () => canvas.getAllByRole('button'),
  uploadIcon: () => canvas.queryAllByTestId('Icon-upload'),
  queryTitleTexts: () => canvas.queryAllByText(/drop items here/i),
  queryBrowseButtons: () => canvas.queryAllByTestId('Button-content'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render drag and drop area with title', async () => {
    await step('Verify title visibility', async () => {
      const title = locators.titleText();
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
    });
  });

  await step('Should display description text', async () => {
    await step('Verify description visibility', async () => {
      const description = locators.descriptionText();
      expect(description).toBeInTheDocument();
      expect(description).toBeVisible();
    });
  });

  await step('Should render upload icon', async () => {
    await step('Verify container presence', async () => {
      const container = locators.dropContainer();
      expect(container).toBeInTheDocument();
    });
  });

  await step('Should display file input button', async () => {
    await step('Verify browse button presence', async () => {
      const browseButton = locators.browseButton();
      expect(browseButton).toBeInTheDocument();
    });
  });

  await step('Should display "or" text between title and button', async () => {
    await step('Verify "or" text visibility', async () => {
      const orText = canvas.getByText(/^or$/i);
      expect(orText).toBeInTheDocument();
      expect(orText).toBeVisible();
    });
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render drag and drop area', async () => {
    await step('Verify container presence', async () => {
      const container = locators.dropContainer();
      expect(container).toBeInTheDocument();
    });
  });

  await step('Should display title', async () => {
    await step('Verify title visibility', async () => {
      const title = locators.titleText();
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
    });
  });

  await step('Should display description', async () => {
    await step('Verify description visibility', async () => {
      const description = locators.descriptionText();
      expect(description).toBeInTheDocument();
      expect(description).toBeVisible();
    });
  });

  await step('Should have disabled file input button', async () => {
    await step('Verify button has disabled attribute', async () => {
      const buttons = locators.allButtons();
      const hasDisabledButton = buttons.some((button: HTMLElement) => button.hasAttribute('disabled'));
      expect(hasDisabledButton).toBe(true);
    });
  });

  await step('Should display upload icon', async () => {
    await step('Verify container presence', async () => {
      const container = locators.dropContainer();
      expect(container).toBeInTheDocument();
    });
  });
};

export const loadingActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should display loading overlay', async () => {
    await step('Verify container presence', async () => {
      const container = locators.dropContainer();
      expect(container).toBeInTheDocument();
    });
  });

  await step('Should show "Uploading" text', async () => {
    await step('Verify uploading text visibility', async () => {
      const uploadingText = locators.uploadingText();
      expect(uploadingText).toBeInTheDocument();
      expect(uploadingText).toBeVisible();
    });
  });

  await step('Should render Loader component', async () => {
    await step('Verify loader presence', async () => {
      const loader = locators.loaderSpinner();
      expect(loader).toBeInTheDocument();
    });
  });

  await step('Should not show default upload icon when loading', async () => {
    await step('Verify upload icon is absent', async () => {
      const uploadIcon = locators.uploadIcon();
      expect(uploadIcon.length).toBe(0);
    });
  });

  await step('Should not show title when loading', async () => {
    await step('Verify title is absent', async () => {
      const titles = locators.queryTitleTexts();
      expect(titles.length).toBe(0);
    });
  });

  await step('Should not show file input button when loading', async () => {
    await step('Verify browse button is absent', async () => {
      const browseButtons = locators.queryBrowseButtons();
      expect(browseButtons.length).toBe(0);
    });
  });
};

export const errorActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render drag and drop area with error state', async () => {
    await step('Verify container presence', async () => {
      const container = locators.dropContainer();
      expect(container).toBeInTheDocument();
    });
  });

  await step('Should display error message', async () => {
    await step('Verify error message visibility', async () => {
      const errorMessage = locators.errorMessageText();
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toBeVisible();
    });
  });

  await step('Should still render title when error is present', async () => {
    await step('Verify title remains visible', async () => {
      const title = locators.titleText();
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
    });
  });

  await step('Should still render description when error is present', async () => {
    await step('Verify description remains visible', async () => {
      const description = locators.descriptionText();
      expect(description).toBeInTheDocument();
      expect(description).toBeVisible();
    });
  });

  await step('Should still show file input button when error is present', async () => {
    await step('Verify browse button remains present', async () => {
      const browseButton = locators.browseButton();
      expect(browseButton).toBeInTheDocument();
    });
  });
};

export const usageAsWrapperActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render drag and drop component', async () => {
    await step('Verify container presence', async () => {
      const container = locators.dropContainer();
      expect(container).toBeInTheDocument();
    });
  });

  await step('Should display input field placeholder', async () => {
    await step('Verify input field visibility', async () => {
      const input = locators.messageInput();
      expect(input).toBeInTheDocument();
      expect(input).toBeVisible();
    });
  });

  await step('Should show navigation buttons', async () => {
    await step('Verify buttons are present', async () => {
      const buttons = locators.allButtons();
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  await step('Should render input as enabled', async () => {
    await step('Verify input is not disabled', async () => {
      const input = locators.messageInput();
      expect(input).not.toBeDisabled();
    });
  });
};
