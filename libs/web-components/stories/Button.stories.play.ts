import { expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdButton } from '../src';

// The rendered `<button>` and its icon/content wrappers live inside the shadow root of `gd-button`.
const getLocators = (canvasElement: HTMLElement) => {
  const hosts = () => Array.from(canvasElement.querySelectorAll<GdButton>('gd-button'));
  const part = (host: GdButton, name: string) => host.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`);
  const required = (host: GdButton, name: string) => {
    const node = part(host, name);
    if (!node) throw new Error(`Missing "${name}" part`);
    return node;
  };
  return {
    host: () => hosts()[0],
    hosts,
    button: () => required(hosts()[0], 'button') as HTMLButtonElement,
    allButtons: () => hosts().map((item) => required(item, 'button') as HTMLButtonElement),
    iconStart: () => required(hosts()[0], 'icon-start'),
    iconEnd: () => required(hosts()[0], 'icon-end'),
    content: () => required(hosts()[0], 'content'),
    hasContent: () => Boolean(part(hosts()[0], 'content')),
  };
};

const clearMock = (args: StoryContext['args']) => {
  const onClick = args['onClick'] as { mockClear?: () => void } | undefined;
  onClick?.mockClear?.();
};

// `userEvent.tab()` only walks light-DOM tab stops and `toHaveFocus` only looks at the document's active
// element (the host for a shadow-DOM button), so focus the inner button directly and assert on the shadow root.
const focusButton = async (host: GdButton, button: HTMLElement) => {
  await userEvent.click(document.body);
  button.focus();
  expect(host.shadowRoot!.activeElement).toBe(button);
};

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render button with primary variant', async () => {
    expect(locators.button()).toBeVisible();
    expect(locators.button()).toHaveAttribute('type', 'button');
  });

  await step('Should handle click event', async () => {
    clearMock(args);
    await userEvent.click(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await focusButton(locators.host(), locators.button());
  });

  await step('Should activate on Enter and Space keys', async () => {
    for (const key of ['{Enter}', ' ']) {
      clearMock(args);
      await userEvent.keyboard(key);
      expect(args['onClick']).toHaveBeenCalledTimes(1);
    }
  });
};

export const withIconsActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render button with content and icons', async () => {
    expect(locators.content()).toBeVisible();
    expect(locators.iconStart()).toBeVisible();
    expect(locators.iconEnd()).toBeVisible();
  });

  await step('Should handle click and keyboard activation', async () => {
    clearMock(args);
    await userEvent.click(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);

    await focusButton(locators.host(), locators.button());
    clearMock(args);
    await userEvent.keyboard('{Enter}');
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });
};

export const iconOnlyActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render icon-only button with aria-label', async () => {
    expect(locators.iconStart()).toBeVisible();
    expect(locators.button()).toHaveAttribute('aria-label', 'Close');
    expect(locators.hasContent()).toBe(false);
  });

  await step('Should be accessible and handle clicks', async () => {
    clearMock(args);
    await userEvent.click(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);

    await focusButton(locators.host(), locators.button());
  });
};

export const disabledButtonActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render disabled button', async () => {
    expect(locators.button()).toBeDisabled();
  });

  await step('Should not respond to click when disabled', async () => {
    await userEvent.click(locators.button());
  });
};

export const isLoadingActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);
  const buttons = locators.allButtons();

  await step('Should render all loading buttons in disabled state', async () => {
    expect(buttons).toHaveLength(3);

    for (const btn of buttons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-busy', 'true');
    }
  });

  await step('Should not be clickable when loading', async () => {
    await userEvent.click(buttons[0]);
  });
};
