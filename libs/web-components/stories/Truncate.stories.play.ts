import { expect } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdTruncate } from '../src';

const getLocators = (canvasElement: HTMLElement) => ({
  truncate: () =>
    canvasElement
      .querySelector<GdTruncate>('gd-truncate')!
      .shadowRoot!.querySelector<HTMLElement>('[data-testid="Truncate"]')!,
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render truncate component', async () => {
    expect(locators.truncate()).toBeInTheDocument();
  });

  await step('Should apply single line truncation', async () => {
    const styles = window.getComputedStyle(locators.truncate());
    expect(styles.webkitLineClamp).toBe('1');
  });

  await step('Should render text content', async () => {
    expect(canvasElement.querySelector('gd-truncate')!.textContent).toContain('Lorem ipsum');
  });
};

export const lineTruncationActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render truncate component', async () => {
    expect(locators.truncate()).toBeInTheDocument();
  });

  await step('Should apply 2-line truncation', async () => {
    const styles = window.getComputedStyle(locators.truncate());
    expect(styles.webkitLineClamp).toBe('2');
  });

  await step('Should render text content', async () => {
    expect(canvasElement.querySelector('gd-truncate')!.textContent).toContain('This is a very long text');
  });
};

export const withCustomStylingActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render truncate component', async () => {
    expect(locators.truncate()).toBeInTheDocument();
  });

  await step('Should apply single line truncation', async () => {
    const styles = window.getComputedStyle(locators.truncate());
    expect(styles.webkitLineClamp).toBe('1');
  });

  await step('Should apply custom styles', async () => {
    const styles = window.getComputedStyle(locators.truncate());

    expect(styles.color).toBe('rgb(220, 38, 38)');
    expect(styles.fontWeight).toBe('600');
    expect(styles.fontSize).toBe('18px');
  });

  await step('Should render text content', async () => {
    expect(canvasElement.querySelector('gd-truncate')!.textContent).toContain('This text has custom styling');
  });
};
