import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  dropdownItem: () => canvas.getByTestId('DropdownItem'),
});

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the dropdown item with the correct name', async () => {
    const item = locators.dropdownItem();
    expect(item).toBeInTheDocument();
    expect(item).toBeVisible();
    expect(item).toHaveTextContent(args['name'] as string);
  });

  await step('Should have tabIndex 0 when not disabled', async () => {
    expect(locators.dropdownItem()).toHaveAttribute('tabindex', '0');
  });

  await step('Should not have the active class when value does not match context', async () => {
    expect(locators.dropdownItem()).not.toHaveClass('active');
  });

  await step('Should receive focus on Tab key press', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.dropdownItem()).toHaveFocus();
  });
};

export const activeActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the active dropdown item with the correct name', async () => {
    const item = locators.dropdownItem();
    expect(item).toBeInTheDocument();
    expect(item).toBeVisible();
    expect(item).toHaveTextContent(args['name'] as string);
  });

  await step('Should have the active class when value matches context value', async () => {
    expect(locators.dropdownItem()).toHaveClass('active');
  });

  await step('Should have tabIndex 0 when not disabled', async () => {
    expect(locators.dropdownItem()).toHaveAttribute('tabindex', '0');
  });
};

export const interactiveWithDefinedOnSelectActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the dropdown item with the custom children content', async () => {
    const item = locators.dropdownItem();
    expect(item).toBeInTheDocument();
    expect(item).toBeVisible();
    expect(item).toHaveTextContent(args['children'] as string);
  });

  await step('Should call onSelect with correct data on click', async () => {
    await userEvent.click(locators.dropdownItem());
    expect(args['onSelect']).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: args['name'] as string, value: args['value'] },
      })
    );
  });

  await step('Should call onSelect when Enter key is pressed', async () => {
    await userEvent.click(document.body);
    locators.dropdownItem().focus();
    await userEvent.keyboard('{Enter}');
    expect(args['onSelect']).toHaveBeenCalledTimes(2);
  });
};
