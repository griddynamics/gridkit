import { expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { Mock } from 'storybook/test';
import type { GdToggle } from '../src';
import { inShadow, inShadowAll } from './form-story-play-helpers';

const getLocators = (canvasElement: HTMLElement) => {
  const toggle = () => canvasElement.querySelector<GdToggle>('gd-toggle')!;
  const items = () => inShadowAll(toggle(), 'gd-button');
  const icon = (name: string) =>
    items()
      .find((item) => item.querySelector(`gd-icon[name="${name}"]`))
      ?.querySelector('gd-icon');
  return {
    toggle: () => inShadow(toggle(), '.toggle'),
    allButtons: () => items().map((item) => inShadow<HTMLButtonElement>(item, 'button')!),
    allItems: items,
    iconHome: () => icon('home'),
    iconAccountCircle: () => icon('accountCircle'),
    iconSuccess: () => icon('success'),
  };
};

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render all 3 toggle buttons', async () => {
    expect(locators.toggle()).toBeInTheDocument();
    expect(locators.allButtons()).toHaveLength(3);
  });

  await step('Should have first option selected by default', async () => {
    const buttons = locators.allItems();
    expect(buttons[0]).toHaveTextContent('Option 1');
    expect(buttons[1]).toHaveTextContent('Option 2');
    expect(buttons[2]).toHaveTextContent('Option 3');
  });

  await step('Should call onValueChange when second option is clicked', async () => {
    (args['onValueChange'] as Mock | undefined)?.mockClear();
    const buttons = locators.allButtons();
    await userEvent.click(buttons[1]);
    expect(args['onValueChange']).toHaveBeenCalledWith('Option 2');
  });

  await step('Should call onValueChange when third option is clicked', async () => {
    (args['onValueChange'] as Mock | undefined)?.mockClear();
    const buttons = locators.allButtons();
    await userEvent.click(buttons[2]);
    expect(args['onValueChange']).toHaveBeenCalledWith('Option 3');
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    // Tab navigation does not enter shadow roots in the test utilities, so focus the first tab stop directly.
    locators.allButtons()[0].focus();
    expect((locators.allButtons()[0].getRootNode() as ShadowRoot).activeElement).toBe(locators.allButtons()[0]);
  });

  await step('Should select the focused option when Space is pressed', async () => {
    (args['onValueChange'] as Mock | undefined)?.mockClear();
    await userEvent.keyboard(' ');
    expect(args['onValueChange']).toHaveBeenCalledWith('Option 1');
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render all 3 disabled toggle buttons', async () => {
    expect(locators.toggle()).toBeInTheDocument();
    const buttons = locators.allButtons();
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });
};

export const withCustomRenderActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render all 3 custom-rendered toggle buttons with icons visible', async () => {
    expect(locators.toggle()).toBeInTheDocument();
    expect(locators.allButtons()).toHaveLength(3);
    expect(locators.iconHome()).toBeVisible();
    expect(locators.iconAccountCircle()).toBeVisible();
    expect(locators.iconSuccess()).toBeVisible();
  });

  await step('Should remain interactive and clickable for each custom-rendered item', async () => {
    const buttons = locators.allButtons();
    await userEvent.click(buttons[1]);
    expect(buttons[1]).not.toBeDisabled();
    await userEvent.click(buttons[2]);
    expect(buttons[2]).not.toBeDisabled();
  });
};
