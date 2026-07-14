import { within, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  truncate: () => canvas.getByTestId('Truncate'),
  tooltip: () => canvas.queryByTestId('Tooltip'),
  tooltipTrigger: () => canvas.queryByTestId('Tooltip-trigger'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render truncate component', async () => {
    expect(locators.truncate()).toBeInTheDocument();
  });

  await step('Should apply single line truncation', async () => {
    const element = locators.truncate();
    const styles = window.getComputedStyle(element);
    expect(styles.webkitLineClamp).toBe('1');
  });

  await step('Should render text content', async () => {
    const element = locators.truncate();
    expect(element.textContent).toContain('Lorem ipsum');
  });
};

export const lineTruncationActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render truncate component', async () => {
    expect(locators.truncate()).toBeInTheDocument();
  });

  await step('Should apply 2-line truncation', async () => {
    const element = locators.truncate();
    const styles = window.getComputedStyle(element);
    expect(styles.webkitLineClamp).toBe('2');
  });

  await step('Should render text content', async () => {
    const element = locators.truncate();
    expect(element.textContent).toContain('This is a very long text');
  });
};

export const withCustomStylingActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render truncate component', async () => {
    expect(locators.truncate()).toBeInTheDocument();
  });

  await step('Should apply single line truncation', async () => {
    const element = locators.truncate();
    const styles = window.getComputedStyle(element);
    expect(styles.webkitLineClamp).toBe('1');
  });

  await step('Should apply custom styles', async () => {
    const element = locators.truncate();
    const styles = window.getComputedStyle(element);

    expect(styles.color).toBe('rgb(220, 38, 38)');
    expect(styles.fontWeight).toBe('600');
    expect(styles.fontSize).toBe('18px');
  });

  await step('Should render text content', async () => {
    const element = locators.truncate();
    expect(element.textContent).toContain('This text has custom styling');
  });
};
