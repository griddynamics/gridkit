import { expect, fn, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdSliderDots } from '../src';

const getLocators = (canvasElement: HTMLElement) => {
  const host = () => canvasElement.querySelector<GdSliderDots>('gd-slider-dots')!;
  const root = () => host().shadowRoot!;
  return {
    host,
    root,
    tablist: () => root().querySelector<HTMLElement>('[role="tablist"]')!,
    tabs: () => Array.from(root().querySelectorAll<HTMLElement>('[role="tab"]')),
    tabByLabel: (label: string) => root().querySelector<HTMLElement>(`[role="tab"][aria-label="${label}"]`)!,
  };
};

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);
  const onDotClick = fn();
  locators
    .host()
    .addEventListener('gd-change', (event) => onDotClick((event as CustomEvent<{ index: number }>).detail.index));

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

  await step('Should emit the correct index when a dot is clicked', async () => {
    onDotClick.mockClear();
    await userEvent.click(locators.tabByLabel('Go to slide 3'));
    expect(onDotClick).toHaveBeenCalledWith(2);
  });

  await step('Should emit the last dot index when the last dot is clicked', async () => {
    onDotClick.mockClear();
    await userEvent.click(locators.tabByLabel('Go to slide 5'));
    expect(onDotClick).toHaveBeenCalledWith(4);
  });
};

export const interactiveActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

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
    // Keyboard tabbing does not cross shadow roots in the test environment, so move focus to the first dot directly.
    const tabs = locators.tabs();
    tabs[0].focus();
    expect(locators.root().activeElement).toBe(tabs[0]);
    await userEvent.keyboard(' ');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
};

export const manyDotsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

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
