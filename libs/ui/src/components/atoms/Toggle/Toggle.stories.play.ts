import { within, expect, userEvent, fn } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  toggle: () => canvas.getByTestId('Toggle'),
  allButtons: () => canvas.getAllByRole('button'),

  iconHome: () => canvas.getByTestId('Icon-home'),
  iconAccountCircle: () => canvas.getByTestId('Icon-accountCircle'),
  iconSuccess: () => canvas.getByTestId('Icon-success'),
});

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render all 3 toggle buttons', async () => {
    expect(locators.toggle()).toBeInTheDocument();
    expect(locators.allButtons()).toHaveLength(3);
  });

  await step('Should have first option selected by default', async () => {
    const buttons = locators.allButtons();
    expect(buttons[0]).toHaveTextContent('Option 1');
    expect(buttons[1]).toHaveTextContent('Option 2');
    expect(buttons[2]).toHaveTextContent('Option 3');
  });

  await step('Should call onValueChange when second option is clicked', async () => {
    (args['onValueChange'] as ReturnType<typeof fn>)?.mockClear();
    const buttons = locators.allButtons();
    await userEvent.click(buttons[1]);
    expect(args['onValueChange']).toHaveBeenCalledWith('Option 2');
  });

  await step('Should call onValueChange when third option is clicked', async () => {
    (args['onValueChange'] as ReturnType<typeof fn>)?.mockClear();
    const buttons = locators.allButtons();
    await userEvent.click(buttons[2]);
    expect(args['onValueChange']).toHaveBeenCalledWith('Option 3');
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.allButtons()[0]).toHaveFocus();
  });

  await step('Should select the focused option when Space is pressed', async () => {
    (args['onValueChange'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.keyboard(' ');
    expect(args['onValueChange']).toHaveBeenCalledWith('Option 1');
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

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
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

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
