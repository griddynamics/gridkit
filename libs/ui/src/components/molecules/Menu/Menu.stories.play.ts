import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  menuTrigger: () => canvas.getByText('Menu'),
  menuItems: () => within(document.body).queryAllByTestId('DropdownItem'),
  openMenu: () => canvas.getByText('Open Menu'),
  closeMenu: () => canvas.getByText('Close Menu'),
});

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the menu trigger button', async () => {
    await expect(locators.menuTrigger()).toBeVisible();
    await expect(locators.menuItems()).toHaveLength(0);
  });

  await step('Should open the menu and render all items on click', async () => {
    await userEvent.click(locators.menuTrigger());
    await shouldVerifyMenuState(locators, ['Profile', 'Settings', 'Logout']);
  });

  await step('Should handle Profile item selection and call onSelect', async () => {
    await userEvent.click(locators.menuItems()[0]);
    if (args['onSelect']) {
      await expect(args['onSelect']).toHaveBeenCalled();
      expectSelection(args['onSelect'], 0, 'Profile', 'profile');
    }
  });

  await step('Should close menu after clicking an item', async () => {
    await waitFor(() => expect(locators.menuItems()).toHaveLength(0));
  });

  const remainingItems = [
    { label: 'Settings', value: 'settings', index: 1, callIndex: 1 },
    { label: 'Logout', value: 'logout', index: 2, callIndex: 2 },
  ];

  for (const item of remainingItems) {
    await step(`Should handle ${item.label} item selection and call onSelect`, async () => {
      await userEvent.click(locators.menuTrigger());
      await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

      await userEvent.click(locators.menuItems()[item.index]);
      expectSelection(args['onSelect'], item.callIndex, item.label, item.value);

      await waitFor(() => expect(locators.menuItems()).toHaveLength(0));
    });
  }

  await step('Should open menu and navigate items with Tab key', async () => {
    await userEvent.click(locators.menuTrigger());
    await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

    for (const items of locators.menuItems()) {
      await userEvent.tab();
      await waitFor(() => expect(items).toHaveFocus());
    }
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

export const withRefControlActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the menu trigger button', async () => {
    await expect(locators.menuItems()).toHaveLength(0);
  });

  await step('Should render the menu trigger buttons', async () => {
    await expect(locators.openMenu()).toBeVisible();
    await expect(locators.closeMenu()).toBeVisible();
  });

  await step('Should handle Profile item selection and call onSelect', async () => {
    await userEvent.click(locators.openMenu());
    await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

    await userEvent.click(locators.menuItems()[0]);
    await waitFor(() => {
      expectSelection(args['onSelect'], 0, 'Profile', 'profile');
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
    await step(`Should handle ${item.label} item selection and call onSelect`, async () => {
      await userEvent.click(locators.openMenu());
      await waitFor(() => expect(locators.menuItems()).toHaveLength(3));

      await userEvent.click(locators.menuItems()[item.index]);
      await waitFor(() => {
        expectSelection(args['onSelect'], item.callIndex, item.label, item.value);
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

      await userEvent.click(body.getByRole('button', { name: config.btn }));
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

const expectSelection = (onSelect: any, index: number, name: string, value: string) => {
  if (onSelect?.mock?.calls?.[index]?.[0]) {
    const callArgs = onSelect.mock.calls[index][0];
    expect(callArgs.data).toMatchObject({ name, value });
  }
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
