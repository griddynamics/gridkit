import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  tooltipWrapper: () => canvas.getByTestId('Tooltip-wrapper'),
  tooltipWrappers: () => canvas.getAllByTestId('Tooltip-wrapper'),
});

const getTooltip = () => within(document.body).queryByTestId('Tooltip');
const getAllTooltips = () => within(document.body).queryAllByTestId('Tooltip');

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const body = within(document.body);

  await step('Should render the tooltip wrapper without showing tooltip initially', async () => {
    expect(locators.tooltipWrapper()).toBeInTheDocument();
    expect(locators.tooltipWrapper()).toBeVisible();
    expect(getTooltip()).not.toBeInTheDocument();
  });

  await step('Should show tooltip on hover with correct content and role', async () => {
    await userEvent.hover(locators.tooltipWrapper());
    await waitFor(() => {
      const tooltip = body.getByTestId('Tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('role', 'tooltip');
      expect(tooltip).toHaveTextContent(args['content'] as string);
    });
  });

  await step('Should hide tooltip when pressing Escape key', async () => {
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });

  await step('Should show tooltip again on hover after hiding', async () => {
    await userEvent.hover(locators.tooltipWrapper());
    await waitFor(() => {
      expect(body.getByTestId('Tooltip')).toBeInTheDocument();
    });
  });

  await step('Should hide tooltip on unhover', async () => {
    await userEvent.unhover(locators.tooltipWrapper());
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });

  await step('Should hide tooltip when clicking on the wrapper while visible', async () => {
    await userEvent.hover(locators.tooltipWrapper());
    await waitFor(() => {
      expect(body.getByTestId('Tooltip')).toBeInTheDocument();
    });
    await userEvent.click(locators.tooltipWrapper());
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });
};

export const customDelayActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const body = within(document.body);
  const delay = (args['delay'] as number) ?? 1000;

  await step('Should render the tooltip wrapper without showing tooltip initially', async () => {
    expect(locators.tooltipWrapper()).toBeInTheDocument();
    expect(getTooltip()).not.toBeInTheDocument();
  });

  await step('Should show tooltip after the configured delay on hover', async () => {
    await userEvent.hover(locators.tooltipWrapper());
    await waitFor(
      () => {
        const tooltip = body.getByTestId('Tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent(args['content'] as string);
      },
      { timeout: delay + 1000 }
    );
  });

  await step('Should hide tooltip on unhover', async () => {
    await userEvent.unhover(locators.tooltipWrapper());
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });
};

export const customGapActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const body = within(document.body);

  await step('Should render the tooltip wrapper without showing tooltip initially', async () => {
    expect(locators.tooltipWrapper()).toBeInTheDocument();
    expect(getTooltip()).not.toBeInTheDocument();
  });

  await step('Should show tooltip on hover with correct content', async () => {
    await userEvent.hover(locators.tooltipWrapper());
    await waitFor(() => {
      const tooltip = body.getByTestId('Tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(args['content'] as string);
    });
  });

  await step('Should hide tooltip on unhover', async () => {
    await userEvent.unhover(locators.tooltipWrapper());
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });
};

export const customPositionActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const body = within(document.body);
  const position = (args['position'] as string) ?? 'bottom';

  await step('Should render the tooltip wrapper without showing tooltip initially', async () => {
    expect(locators.tooltipWrapper()).toBeInTheDocument();
    expect(getTooltip()).not.toBeInTheDocument();
  });

  await step('Should show tooltip with the configured position class on hover', async () => {
    await userEvent.hover(locators.tooltipWrapper());
    await waitFor(() => {
      const tooltip = body.getByTestId('Tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(args['content'] as string);
      expect(tooltip).toHaveClass(`tooltip-${position}`);
    });
  });

  await step('Should hide tooltip on unhover', async () => {
    await userEvent.unhover(locators.tooltipWrapper());
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });
};

export const multipleTooltipsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const body = within(document.body);

  await step('Should render all 10 tooltip wrappers with no tooltip visible', async () => {
    expect(locators.tooltipWrappers()).toHaveLength(10);
    expect(getTooltip()).not.toBeInTheDocument();
  });

  await step('Should show tooltip for the first item on hover', async () => {
    await userEvent.hover(locators.tooltipWrappers()[0]);
    await waitFor(() => {
      const tooltip = body.getByTestId('Tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Tooltip content for item 1');
    });
  });

  await step('Should show only one tooltip when switching to another item', async () => {
    await userEvent.hover(locators.tooltipWrappers()[4]);
    await waitFor(() => {
      const tooltips = getAllTooltips();
      expect(tooltips).toHaveLength(1);
      expect(tooltips[0]).toHaveTextContent('Tooltip content for item 5');
    });
  });

  await step('Should show correct tooltip when hovering the last item', async () => {
    await userEvent.hover(locators.tooltipWrappers()[9]);
    await waitFor(() => {
      const tooltips = getAllTooltips();
      expect(tooltips).toHaveLength(1);
      expect(tooltips[0]).toHaveTextContent('Tooltip content for item 10');
    });
  });

  await step('Should hide tooltip when unhovering', async () => {
    await userEvent.unhover(locators.tooltipWrappers()[9]);
    await waitFor(() => {
      expect(getTooltip()).not.toBeInTheDocument();
    });
  });
};
