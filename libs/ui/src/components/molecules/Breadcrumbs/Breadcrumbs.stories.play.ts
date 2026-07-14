import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  breadcrumbsWrapper: () => canvas.getByTestId('Breadcrumbs'),
  items: () => canvas.getAllByTestId('Breadcrumbs-item'),
  links: () => canvas.getAllByRole('link'),
  separators: () => canvas.getAllByTestId('Breadcrumbs-separator'),
  iconStart: () => canvas.getByTestId('Breadcrumbs-item-start'),
});

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render the breadcrumbs wrapper with correct ARIA label', async () => {
    await expect(locators.breadcrumbsWrapper()).toBeVisible();
    await expect(locators.breadcrumbsWrapper()).toHaveAttribute('aria-label', 'breadcrumb');
  });

  await step('Should render all breadcrumb items correctly based on args', async () => {
    const items = locators.items();
    const links = locators.links();

    await expect(items).toHaveLength(args['items'].length);
    await expect(links).toHaveLength(args['items'].length);

    for (const [index, link] of links.entries()) {
      await expect(link).toBeVisible();

      const childrenProps = args['items'][index]?.props?.children?.props;
      await expect(childrenProps?.children).toBeDefined();
      await expect(link).toHaveTextContent(childrenProps.children);

      await expect(link).toHaveAttribute('tabindex', '0');

      const isLastItem = index === links.length - 1;
      const expectLink = isLastItem ? expect(link) : expect(link).not;
      await expectLink.toHaveClass('Link--disabled');

      if (!isLastItem && childrenProps?.target) {
        await expect(link).toHaveAttribute('target', childrenProps.target);
      }
    }
  });

  await step('Should have correct click behavior for each item', async () => {
    const links = locators.links();

    for (let index = 0; index < links.length - 1; index++) {
      const onClick = args['items'][index]?.props?.children?.props?.onClick;
      await expect(onClick).toBeDefined();

      await userEvent.click(links[index]);
      await waitFor(() => {
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    }
  });

  await step('Should support keyboard navigation (Tab through all links)', async () => {
    await userEvent.click(document.body);

    for (const link of locators.links()) {
      await userEvent.tab();
      await expect(link).toHaveFocus();
    }
  });
};

export const withStringSeparatorAndAfterLastItemActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBaseBreadcrumbs(locators, step);

  await step('Should render visible separators', async () => {
    const separators = locators.separators();
    await expect(separators).toHaveLength(args['items'].length);

    for (const separator of separators) {
      await expect(separator).toBeVisible();
    }
  });
};

export const withStartItemLinkIconActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBaseBreadcrumbs(locators, step);

  await step('Should render start item link with icon', async () => {
    await expect(locators.iconStart()).toBeVisible();
    await expect(within(locators.iconStart()).getByTestId('Icon-info')).toBeVisible();
  });

  await step('Should render icon separators correctly', async () => {
    const separators = locators.separators();
    await expect(separators).toHaveLength(locators.items().length - 1);

    for (const separator of separators) {
      await expect(separator).toBeVisible();
      await expect(within(separator).getByTestId('Icon-arrowRight')).toBeVisible();
    }
  });
};

const shouldRenderBaseBreadcrumbs = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should render the breadcrumbs wrapper', async () => {
    await expect(locators.breadcrumbsWrapper()).toBeDefined();
    await expect(locators.breadcrumbsWrapper()).toBeVisible();
  });
};
