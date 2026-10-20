import { expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdScroll } from '../src';

const getLocators = (canvasElement: HTMLElement) => {
  const scrollContainer = () => canvasElement.querySelector<GdScroll>('gd-scroll')!;
  const shadowPart = (part: string) => scrollContainer().shadowRoot!.querySelector<HTMLElement>(`[part~="${part}"]`);

  return {
    scrollContainer,
    scrollContent: () => shadowPart('content'),
    scrollbars: () => shadowPart('scrollbars'),
    verticalScrollbar: () => shadowPart('vertical-scrollbar'),
    verticalThumb: () => shadowPart('vertical-thumb'),
    horizontalScrollbar: () => shadowPart('horizontal-scrollbar'),
    horizontalThumb: () => shadowPart('horizontal-thumb'),
    contentLines: () => Array.from(scrollContainer().querySelectorAll('gd-typography')),
  };
};

const focusContainer = async (container: GdScroll) => {
  await userEvent.click(document.body);
  container.tabIndex = 0;
  await userEvent.tab();
  await waitFor(() => expect(container).toHaveFocus(), { timeout: 500 });
};

const pressKey = async (container: GdScroll, key: string) => {
  expect(container).toHaveFocus();
  await userEvent.keyboard(key);
  expect(container).toHaveFocus();
};

const scrollProgrammatically = async (
  container: GdScroll,
  property: 'scrollTop' | 'scrollLeft',
  value: number,
  reset = false
) => {
  container[property] = value;
  await waitFor(() => expect(container[property]).toBe(value), { timeout: 500 });
  if (reset) container[property] = 0;
};

export const interactiveExampleActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render scroll container with content', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
    expect(locators.scrollbars()).toBeVisible();
  });
  await step('Should render all 20 scrollable content lines', async () => {
    expect(locators.contentLines()).toHaveLength(20);
  });
  await step('Should display vertical scrollbar for overflowing content', async () => {
    await waitFor(() => expect(locators.verticalScrollbar()).toBeVisible(), { timeout: 1000 });
    expect(locators.verticalThumb()).toBeVisible();
  });
  await step('Should focus scroll container via Tab', async () => focusContainer(locators.scrollContainer()));
  await step('Should accept ArrowDown keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowDown}')
  );
  await step('Should accept ArrowUp keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowUp}')
  );
  await step('Should maintain scroll position tracking after programmatic scroll', async () =>
    scrollProgrammatically(locators.scrollContainer(), 'scrollTop', 100)
  );
  await step('Should verify scroll container is visible', async () => {
    expect(locators.scrollContainer()).toBeVisible();
  });
};

export const verticalScrollOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render scroll container with vertical content', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });
  await step('Should render all 20 vertical content lines', async () => {
    expect(locators.contentLines()).toHaveLength(20);
  });
  await step('Should display vertical scrollbar', async () => {
    await waitFor(() => expect(locators.verticalScrollbar()).toBeVisible(), { timeout: 1000 });
  });
  await step('Should hide horizontal scrollbar', async () => {
    expect(locators.horizontalScrollbar()).toBeNull();
  });
  await step('Should constrain content width when horizontal is hidden', async () => {
    expect(locators.scrollContent()).toHaveStyle({ maxWidth: '100%' });
  });
  await step('Should focus scroll container via Tab for keyboard navigation', async () =>
    focusContainer(locators.scrollContainer())
  );
  await step('Should accept ArrowDown keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowDown}')
  );
  await step('Should accept ArrowUp keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowUp}')
  );
  await step('Should allow programmatic vertical scrolling', async () =>
    scrollProgrammatically(locators.scrollContainer(), 'scrollTop', 80, true)
  );
};

export const horizontalScrollOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render scroll container with horizontal content', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });
  await step('Should render all 10 horizontal items', async () => {
    expect(locators.contentLines()).toHaveLength(10);
  });
  await step('Should hide vertical scrollbar', async () => {
    expect(locators.verticalScrollbar()).toBeNull();
  });
  await step('Should display horizontal scrollbar for overflowing content', async () => {
    await waitFor(() => expect(locators.horizontalScrollbar()).toBeVisible(), { timeout: 1000 });
    expect(locators.horizontalThumb()).toBeVisible();
  });
  await step('Should focus scroll container via Tab for keyboard navigation', async () =>
    focusContainer(locators.scrollContainer())
  );
  await step('Should accept ArrowRight keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowRight}')
  );
  await step('Should accept ArrowLeft keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowLeft}')
  );
  await step('Should allow programmatic horizontal scrolling', async () =>
    scrollProgrammatically(locators.scrollContainer(), 'scrollLeft', 100, true)
  );
};

export const autoHideScrollbarsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

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
    await waitFor(() => expect(locators.verticalScrollbar()).not.toBeNull(), { timeout: 1000 });
  });
  await step('Should focus scroll container via Tab with autoHide', async () =>
    focusContainer(locators.scrollContainer())
  );
  await step('Should accept ArrowDown keyboard input in autoHide mode', async () =>
    pressKey(locators.scrollContainer(), '{ArrowDown}')
  );
};

export const autoHideVerticalOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render scroll container with autoHide vertical only', async () => {
    expect(locators.scrollContainer()).toBeVisible();
    expect(locators.scrollContent()).toBeVisible();
  });
  await step('Should display vertical scrollbar with autoHide', async () => {
    await waitFor(() => expect(locators.verticalScrollbar()).not.toBeNull(), { timeout: 1000 });
  });
  await step('Should hide horizontal scrollbar', async () => {
    expect(locators.horizontalScrollbar()).toBeNull();
  });
  await step('Should constrain content width when horizontal is hidden', async () => {
    expect(locators.scrollContent()).toHaveStyle({ maxWidth: '100%' });
  });
  await step('Should focus scroll container via Tab for keyboard accessibility', async () =>
    focusContainer(locators.scrollContainer())
  );
  await step('Should accept ArrowDown keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowDown}')
  );
  await step('Should accept ArrowUp keyboard input while focused', async () =>
    pressKey(locators.scrollContainer(), '{ArrowUp}')
  );
  await step('Should allow programmatic vertical scrolling', async () =>
    scrollProgrammatically(locators.scrollContainer(), 'scrollTop', 80, true)
  );
};
