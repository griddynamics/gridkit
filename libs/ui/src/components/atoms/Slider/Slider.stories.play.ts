import { within, expect, fireEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { waitForAttribute } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  slider: () => canvas.getByTestId('Slider'),
});

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with correct initial ARIA attributes', async () => {
    expect(locators.slider()).toBeInTheDocument();
    expect(locators.slider()).toHaveAttribute('role', 'slider');
    expect(locators.slider()).toHaveAttribute('aria-valuenow', '1');
    expect(locators.slider()).toHaveAttribute('aria-valuemin', '1');
    expect(locators.slider()).toHaveAttribute('aria-valuemax', '100');
  });

  await step('Should update value when clicking on the slider track', async () => {
    locators.slider().focus();
    fireEvent.change(locators.slider(), { target: { value: '50' } });
    await waitForAttribute(locators.slider, 'aria-valuenow', '50');
    expect(args['onChange']).toHaveBeenCalledWith(50);
  });

  await step('Should update aria-valuenow when pressing ArrowRight', async () => {
    locators.slider().focus();
    fireEvent.change(locators.slider(), { target: { value: '51' } });
    await waitForAttribute(locators.slider, 'aria-valuenow', '51');
    expect(args['onChange']).toHaveBeenCalledWith(51);
  });
};

export const withInitialValueActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with aria-valuenow reflecting the initial value of 50', async () => {
    expect(locators.slider()).toBeInTheDocument();
    expect(locators.slider()).toHaveAttribute('aria-valuenow', '50');
    expect(locators.slider()).toHaveAttribute('aria-valuemin', '1');
    expect(locators.slider()).toHaveAttribute('aria-valuemax', '100');
  });

  await step('Should update aria-valuenow when pressing ArrowLeft', async () => {
    locators.slider().focus();
    fireEvent.change(locators.slider(), { target: { value: '49' } });
    await waitForAttribute(locators.slider, 'aria-valuenow', '49');
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the disabled slider with correct ARIA attributes', async () => {
    expect(locators.slider()).toBeInTheDocument();
    expect(locators.slider()).toHaveAttribute('aria-valuenow', '30');
    expect(locators.slider()).toHaveAttribute('aria-disabled', 'true');
  });

  await step('Should be disabled via the disabled attribute', async () => {
    expect(locators.slider()).toBeDisabled();
  });
};

export const customStylesActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with aria-valuenow reflecting the initial value of 70', async () => {
    expect(locators.slider()).toBeInTheDocument();
    expect(locators.slider()).toHaveAttribute('aria-valuenow', '70');
  });
};

export const controlledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the controlled slider with initial aria-valuenow of 25', async () => {
    expect(locators.slider()).toBeInTheDocument();
    expect(locators.slider()).toHaveAttribute('aria-valuenow', '25');
  });

  await step('Should update aria-valuenow when pressing ArrowRight and reflect controlled state', async () => {
    locators.slider().focus();
    fireEvent.change(locators.slider(), { target: { value: '26' } });
    await waitForAttribute(locators.slider, 'aria-valuenow', '26');
  });
};
