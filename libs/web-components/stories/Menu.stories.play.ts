import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdMenu } from '../src';

/** Pointer input is dispatched to the native button inside the `gd-button`, which is the element that takes focus. */
const nativeButton = (host: HTMLElement) => host.shadowRoot?.querySelector<HTMLElement>('button') ?? host;

const getLocators = (canvas: ReturnType<typeof within>) => ({
  menuTrigger: () => canvas.getByText('Menu'),
  // Items stay in the document while the menu is closed, so only the items of an open menu count.
  menuItems: () =>
    Array.from(document.body.querySelectorAll<HTMLElement>('[data-testid="DropdownItem"]')).filter(
      (item) => item.closest<GdMenu>('gd-menu')?.open
    ),
  openMenu: () => nativeButton(canvas.getByText('Open Menu')),
  closeMenu: () => nativeButton(canvas.getByText('Close Menu')),
});

/** Records every selection reported by the menu in the canvas, the way a callback prop would. */
const trackSelections = (canvasElement: HTMLElement) => {
  const onSelect = fn();
  canvasElement
    .querySelector<GdMenu>('gd-menu')!
    .addEventListener('gd-change', (event) => onSelect((event as CustomEvent<{ data: unknown }>).detail.data));
  return onSelect;
};

const expectSelection = (onSelect: ReturnType<typeof fn>, index: number, name: string, value: string) => {
  const data = onSelect.mock.calls[index]?.[0];
  if (data) expect(data).toMatchObject({ name, value });
};

const shouldVerifyMenuState = async (locators: ReturnType<typeof getLocators>, expectedLabels: string[]) => {
  await waitFor(() => {
    const items = locators.menuItems();
    expect(items).toHaveLength(expectedLabels.length);
    for (const [index, label] of expectedLabels.entries()) {
      expect(items[index]).toHaveTextContent(label);
    }
    expect(items[0]).toHaveAttribute('tabindex', '0');
  });
};

/** Keyboard tabbing is performed on the light DOM items, which are the only tab stops of an open menu. */
const tabThroughItems = async (locators: ReturnType<typeof getLocators>) => {
  for (const item of locators.menuItems()) {
    await userEvent.tab();
    await waitFor(() => expect(item).toHaveFocus());
  }
};

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const onSelect = trackSelections(canvasElement);

  await step('Should render the menu trigger button', async () => {
    await expect(locators.menuTrigger()).toBeVisible();
    await expect(locators.menuItems()).toHaveLength(0);
  });

  await step('Should open the menu and render all items on click', async () => {
    await userEvent.click(locators.menuTrigger());
    await shouldVerifyMenuState(locators, ['Profile', 'Settings', 'Logout']);
  });

  await step('Should handle Profile item selection and emit gd-change', async () => {
    await userEvent.click(locators.menuItems()[0]);
    await expect(onSelect).toHaveBeenCalled();
    expectSelection(onSelect, 0, 'Profile', 'profile');
  });

  await step('Should close menu after clicking an item', async () => {
    await waitFor(() => expect(locators.menuItems()).toHaveLength(0));
  });

  const remainingItems = [
    { label: 'Settings', value: 'settings', index: 1, callIndex: 1 },
    { label: 'Logout', value: 'logout', index: 2, callIndex: 2 },
  ];

  for (const item of remainingItems) {
    await step(`Should handle ${item.label} item selection and emit gd-change`, async () => {
      await userEvent.click(locators.menuTrigger());
      await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

      await userEvent.click(locators.menuItems()[item.index]);
      expectSelection(onSelect, item.callIndex, item.label, item.value);

      await waitFor(() => expect(locators.menuItems()).toHaveLength(0));
    });
  }

  await step('Should open menu and navigate items with Tab key', async () => {
    await userEvent.click(locators.menuTrigger());
    await waitFor(() => expect(locators.menuItems()).toHaveLength(3));
    await tabThroughItems(locators);
  });
};

export const closeOnSelectActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the menu trigger button', async () => {
    await expect(locators.menuTrigger()).toBeVisible();
    await expect(locators.menuItems()).toHaveLength(0);
  });

  await step('Should open the menu and render all items on click', async () => {
    await userEvent.click(locators.menuTrigger());
    await shouldVerifyMenuState(locators, ['Profile', 'Settings', 'Logout']);
  });

  await step('Should not close the menu after selecting an item ', async () => {
    for (const item of locators.menuItems()) {
      await userEvent.click(item);
    }
    await waitFor(() => expect(locators.menuItems()).toHaveLength(3));
  });
};

export const withRefControlActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const onSelect = trackSelections(canvasElement);

  await step('Should render the menu trigger button', async () => {
    await expect(locators.menuItems()).toHaveLength(0);
  });

  await step('Should render the menu trigger buttons', async () => {
    await expect(locators.openMenu()).toBeVisible();
    await expect(locators.closeMenu()).toBeVisible();
  });

  await step('Should handle Profile item selection and emit gd-change', async () => {
    await userEvent.click(locators.openMenu());
    await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

    await userEvent.click(locators.menuItems()[0]);
    await waitFor(() => {
      expectSelection(onSelect, 0, 'Profile', 'profile');
    });
  });

  await step('Should close menu after clicking an item', async () => {
    await waitFor(() => expect(locators.menuItems()).toHaveLength(0));
  });

  const refTests = [
    { label: 'Settings', value: 'settings', index: 1, callIndex: 1 },
    { label: 'Logout', value: 'logout', index: 2, callIndex: 2 },
  ];

  for (const item of refTests) {
    await step(`Should handle ${item.label} item selection and emit gd-change`, async () => {
      await userEvent.click(locators.openMenu());
      await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

      await userEvent.click(locators.menuItems()[item.index]);
      await waitFor(() => {
        expectSelection(onSelect, item.callIndex, item.label, item.value);
      });

      await waitFor(() => expect(locators.menuItems()).toHaveLength(0));
    });
  }

  await step('Should open the menu and render all items on click', async () => {
    await userEvent.click(locators.openMenu());
    await shouldVerifyMenuState(locators, ['Profile', 'Settings', 'Logout']);
  });
};

export const withEditAndDeleteModalsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const body = within(document.body);

  await step('Should render the menu trigger button', async () => {
    await expect(locators.menuTrigger()).toBeVisible();
  });

  await step('Should open the menu and render all items on click', async () => {
    // A pointer press focuses the nearest focusable ancestor of the trigger, here the box root, which is
    // inside a shadow root where user-event does not look. Focus it the way the press would.
    canvasElement.querySelector('gd-box')?.shadowRoot?.querySelector<HTMLElement>('[part="root"]')?.focus();
    await userEvent.click(locators.menuTrigger());
    await shouldVerifyMenuState(locators, ['Edit', 'Delete', 'View']);
  });

  const modalConfigs = [
    { index: 0, title: 'Edit modal for item: Edit', btn: 'Edit', trigger: false },
    { index: 1, title: 'Are you sure you want to delete: Delete?', btn: 'Delete', trigger: true },
  ];

  for (const config of modalConfigs) {
    await step(`Should open and close the ${config.btn} modal`, async () => {
      if (config.trigger) {
        await userEvent.click(locators.menuTrigger());
        await waitFor(() => expect(locators.menuItems()).toHaveLength(3));
      }

      await userEvent.click(locators.menuItems()[config.index]);
      await waitFor(() => expect(body.getByText(config.title)).toBeVisible());

      await userEvent.click(body.getByText(config.btn, { selector: 'gd-button' }));
      await waitFor(() => expect(body.queryByText(config.title)).not.toBeInTheDocument());
    });
  }

  await step('Should not open any modal when View is selected', async () => {
    await userEvent.click(locators.menuTrigger());
    await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

    await userEvent.click(locators.menuItems()[2]);
    await waitFor(() => {
      expect(body.queryByText(/Edit modal for item/i)).not.toBeInTheDocument();
      expect(body.queryByText(/Are you sure you want to delete/i)).not.toBeInTheDocument();
    });
  });
};
