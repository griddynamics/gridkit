import { within, expect, userEvent, fireEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  progressBar: () => canvas.getByTestId('ProgressBar'),
  fill: () => canvas.getByTestId('ProgressBar-fill'),
  slider: () => canvas.getByRole('slider'),
  queryPercentLabel: (value: number) => canvas.queryByText(`${value}%`),
});

export const interactiveActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the progress bar and slider with initial value of 0', async () => {
    expect(locators.progressBar()).toBeInTheDocument();
    expect(locators.progressBar()).toBeVisible();
    expect(locators.progressBar()).toHaveAttribute('role', 'progressbar');
    expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '0');
    expect(locators.progressBar()).toHaveAttribute('aria-valuemin', '0');
    expect(locators.progressBar()).toHaveAttribute('aria-valuemax', '100');
    expect(locators.fill()).toBeInTheDocument();
    expect(locators.slider()).toBeInTheDocument();
    expect(locators.queryPercentLabel(0)).not.toBeInTheDocument();
  });

  await step('Should update aria-valuenow and show percentage label when slider is changed to 50', async () => {
    fireEvent.change(locators.slider(), { target: { value: '50' } });
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '50');
      expect(locators.queryPercentLabel(50)).toBeInTheDocument();
    });
  });

  await step('Should update aria-valuenow and show percentage label when slider is changed to 100', async () => {
    fireEvent.change(locators.slider(), { target: { value: '100' } });
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '100');
      expect(locators.queryPercentLabel(100)).toBeInTheDocument();
    });
  });

  await step('Should hide percentage label when slider is reset to 0', async () => {
    fireEvent.change(locators.slider(), { target: { value: '0' } });
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '0');
      expect(locators.queryPercentLabel(0)).not.toBeInTheDocument();
    });
  });

  await step('Should focus the slider on Tab key press', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.slider()).toHaveFocus();
  });

  await step('Should increment value by 1 when ArrowRight is pressed', async () => {
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '1');
      expect(locators.queryPercentLabel(1)).toBeInTheDocument();
    });
  });

  await step('Should decrement value by 1 when ArrowLeft is pressed', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '0');
      expect(locators.queryPercentLabel(0)).not.toBeInTheDocument();
    });
  });

  await step('Should increment value by 1 when ArrowUp is pressed', async () => {
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '1');
      expect(locators.queryPercentLabel(1)).toBeInTheDocument();
    });
  });

  await step('Should decrement value by 1 when ArrowDown is pressed', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(locators.progressBar()).toHaveAttribute('aria-valuenow', '0');
      expect(locators.queryPercentLabel(0)).not.toBeInTheDocument();
    });
  });
};
