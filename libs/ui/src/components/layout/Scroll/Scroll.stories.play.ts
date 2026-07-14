import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  scrollContainer: () => canvas.getByTestId('Scroll'),
  scrollContent: () => canvas.getByTestId('Scroll-content'),
  scrollbars: () => canvas.getByTestId('Scroll-scrollbars'),
  verticalScrollbar: () => canvas.getByTestId('Scroll-scrollbar_vertical'),
  verticalThumb: () => canvas.getByTestId('Scroll-scrollbar-thumb_vertical'),
  horizontalThumb: () => canvas.getByTestId('Scroll-scrollbar-thumb_horizontal'),
  queryVerticalScrollbar: () => canvas.queryByTestId('Scroll-scrollbar_vertical'),
  queryHorizontalScrollbar: () => canvas.queryByTestId('Scroll-scrollbar_horizontal'),
  contentLines: () => canvas.getAllByText(/scrollable content line/i),
  verticalContentLines: () => canvas.getAllByText(/vertical content line/i),
  horizontalItems: () => canvas.getAllByText(/item \d+/i),
});

export const interactiveExampleActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render scroll container with content', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
    expect(locators.scrollbars()).toBeVisible();
  });

  await step('Should render all 20 scrollable content lines', async () => {
    expect(locators.contentLines()).toHaveLength(20);
  });

  await step('Should display vertical scrollbar for overflowing content', async () => {
    await waitFor(() => expect(locators.queryVerticalScrollbar()).toBeVisible(), { timeout: 1000 });
    expect(locators.verticalThumb()).toBeVisible();
  });

  await step('Should focus scroll container via Tab', async () => {
    await focusContainer(locators.scrollContainer());
  });

  await step('Should accept ArrowDown keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowDown}');
  });

  await step('Should accept ArrowUp keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowUp}');
  });

  await step('Should maintain scroll position tracking after programmatic scroll', async () => {
    await scrollProgrammatically(locators.scrollContainer(), 'scrollTop', 100);
  });

  await step('Should verify scroll container is visible', async () => {
    expect(locators.scrollContainer()).toBeVisible();
  });
};

export const verticalScrollOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render scroll container with vertical content', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });

  await step('Should render all 20 vertical content lines', async () => {
    expect(locators.verticalContentLines()).toHaveLength(20);
  });

  await step('Should display vertical scrollbar', async () => {
    await waitFor(() => expect(locators.queryVerticalScrollbar()).toBeVisible(), { timeout: 1000 });
  });

  await step('Should hide horizontal scrollbar', async () => {
    expect(locators.queryHorizontalScrollbar()).not.toBeInTheDocument();
  });

  await step('Should constrain content width when horizontal is hidden', async () => {
    expect(locators.scrollContent()).toHaveStyle({ maxWidth: '100%' });
  });

  await step('Should focus scroll container via Tab for keyboard navigation', async () => {
    await focusContainer(locators.scrollContainer());
  });

  await step('Should accept ArrowDown keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowDown}');
  });

  await step('Should accept ArrowUp keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowUp}');
  });

  await step('Should allow programmatic vertical scrolling', async () => {
    await scrollProgrammatically(locators.scrollContainer(), 'scrollTop', 80, true);
  });
};

export const horizontalScrollOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render scroll container with horizontal content', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });

  await step('Should render all 10 horizontal items', async () => {
    expect(locators.horizontalItems()).toHaveLength(10);
  });

  await step('Should hide vertical scrollbar', async () => {
    expect(locators.queryVerticalScrollbar()).not.toBeInTheDocument();
  });

  await step('Should display horizontal scrollbar for overflowing content', async () => {
    await waitFor(() => expect(locators.queryHorizontalScrollbar()).toBeVisible(), { timeout: 1000 });
    expect(locators.horizontalThumb()).toBeVisible();
  });

  await step('Should focus scroll container via Tab for keyboard navigation', async () => {
    await focusContainer(locators.scrollContainer());
  });

  await step('Should accept ArrowRight keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowRight}');
  });

  await step('Should accept ArrowLeft keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowLeft}');
  });

  await step('Should allow programmatic horizontal scrolling', async () => {
    await scrollProgrammatically(locators.scrollContainer(), 'scrollLeft', 100, true);
  });
};

export const autoHideScrollbarsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render scroll container with autoHide enabled', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });

  await step('Should render all 20 scrollable content lines', async () => {
    expect(locators.contentLines()).toHaveLength(20);
  });

  await step('Should render scrollbars container', async () => {
    expect(locators.scrollbars()).toBeVisible();
  });

  await step('Should display vertical scrollbar with autoHide styling', async () => {
    await waitFor(
      () => {
        expect(locators.queryVerticalScrollbar()).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
    const scrollbar = locators.verticalScrollbar();
    expect(scrollbar).toHaveClass('gd-scroll--scrollbar__vertical');
  });

  await step('Should focus scroll container via Tab with autoHide', async () => {
    await focusContainer(locators.scrollContainer());
  });

  await step('Should accept ArrowDown keyboard input in autoHide mode', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowDown}');
  });
};

export const autoHideVerticalOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render scroll container with autoHide vertical only', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });

  await step('Should display vertical scrollbar with autoHide', async () => {
    await waitFor(
      () => {
        expect(locators.queryVerticalScrollbar()).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
    const scrollbar = locators.verticalScrollbar();
    expect(scrollbar).toHaveClass('gd-scroll--scrollbar__vertical');
  });

  await step('Should hide horizontal scrollbar', async () => {
    expect(locators.queryHorizontalScrollbar()).not.toBeInTheDocument();
  });

  await step('Should constrain content width when horizontal is hidden', async () => {
    expect(locators.scrollContent()).toHaveStyle({ maxWidth: '100%' });
  });

  await step('Should focus scroll container via Tab for keyboard accessibility', async () => {
    await focusContainer(locators.scrollContainer());
  });

  await step('Should accept ArrowDown keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowDown}');
  });

  await step('Should accept ArrowUp keyboard input while focused', async () => {
    await pressKey(locators.scrollContainer(), '{ArrowUp}');
  });

  await step('Should allow programmatic vertical scrolling', async () => {
    await scrollProgrammatically(locators.scrollContainer(), 'scrollTop', 80, true);
  });
};

const focusContainer = async (container: HTMLElement) => {
  await userEvent.click(document.body);
  container.setAttribute('tabindex', '0');
  await userEvent.tab();
  await waitFor(() => expect(container).toHaveFocus(), { timeout: 500 });
};

const pressKey = async (container: HTMLElement, key: string) => {
  expect(container).toHaveFocus();
  await userEvent.keyboard(key);
  expect(container).toHaveFocus();
};

const scrollProgrammatically = async (
  container: HTMLElement,
  prop: 'scrollTop' | 'scrollLeft',
  value: number,
  reset = false
) => {
  container[prop] = value;
  await waitFor(() => expect(container[prop]).toBe(value), { timeout: 500 });
  if (reset) container[prop] = 0;
};
