import { within, expect, userEvent, fn } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  tablist: () => canvas.getByRole('tablist'),
  tabs: () => canvas.getAllByRole('tab'),
  tabByLabel: (label: string) => canvas.getByRole('tab', { name: label }),
});

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render tablist with 5 dots', async () => {
    expect(locators.tablist()).toBeInTheDocument();
    expect(locators.tabs()).toHaveLength(5);
  });

  await step('Should have first dot selected and all others unselected', async () => {
    const tabs = locators.tabs();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[4]).toHaveAttribute('aria-selected', 'false');
  });

  await step('Should call onDotClick with the correct index when a dot is clicked', async () => {
    (args['onDotClick'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.click(locators.tabByLabel('Go to slide 3'));
    expect(args['onDotClick']).toHaveBeenCalledWith(2);
  });

  await step('Should call onDotClick with the last dot index when the last dot is clicked', async () => {
    (args['onDotClick'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.click(locators.tabByLabel('Go to slide 5'));
    expect(args['onDotClick']).toHaveBeenCalledWith(4);
  });
};

export const interactiveActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render 5 dots with the first dot selected initially', async () => {
    expect(locators.tabs()).toHaveLength(5);
    expect(locators.tabs()[0]).toHaveAttribute('aria-selected', 'true');
  });

  await step('Should update active dot when a different dot is clicked', async () => {
    await userEvent.click(locators.tabByLabel('Go to slide 4'));
    const tabs = locators.tabs();
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  await step('Should move active state to the newly clicked dot', async () => {
    await userEvent.click(locators.tabByLabel('Go to slide 2'));
    const tabs = locators.tabs();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[3]).toHaveAttribute('aria-selected', 'false');
  });

  await step('Should focus the first dot on Tab and select it with Space', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    const tabs = locators.tabs();
    expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
};

export const manyDotsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render 10 dots', async () => {
    expect(locators.tabs()).toHaveLength(10);
  });

  await step('Should have the 5th dot selected (index 4) and boundary dots unselected', async () => {
    const tabs = locators.tabs();
    expect(tabs[4]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[9]).toHaveAttribute('aria-selected', 'false');
  });
};
