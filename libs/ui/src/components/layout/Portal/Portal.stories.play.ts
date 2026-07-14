import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => {
  const body = within(document.body);

  return {
    container: () => canvas.getByTestId('Container-wrapper'),
    showPortalLink: () => canvas.getByTestId('Portal-show-link'),
    portalContainer: () => body.queryByTestId('Portal-wrapper'),
    portalContent: () => body.queryByTestId('Portal-content'),
    portalCloseLink: () => body.queryByTestId('Portal-close-link'),
  };
};

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderInitialComponents(locators, step);

  await step('Should click on the Portal Link and update Trigger Text', async () => {
    await userEvent.click(locators.showPortalLink());
    expect(locators.showPortalLink()).toHaveTextContent('Hide Portal');
  });

  await step('Should render portal container', async () => {
    expect(locators.portalContainer()).toBeVisible();
  });

  await step('Should render portal content', async () => {
    expect(locators.portalContent()).toBeVisible();
    expect(locators.portalContent()).toHaveTextContent('This content is in a global portal.');

    expect(locators.portalCloseLink()).toBeVisible();
    expect(locators.portalCloseLink()).toHaveTextContent('Close');
  });

  await step('Should click on the Portal Close Link', async () => {
    expect(locators.portalCloseLink()).toBeInTheDocument();
    await userEvent.click(locators.portalCloseLink()!);
  });

  await step('Should not render portal container', async () => {
    expect(locators.portalContainer()).not.toBeInTheDocument();
  });
};

export const renderingInTargetActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderInitialComponents(locators, step);

  await step('Should click on the Portal Link and update Trigger Text', async () => {
    await userEvent.click(locators.showPortalLink());
    expect(locators.showPortalLink()).toHaveTextContent('Hide Portal');
  });

  await step('Should render portal container', async () => {
    expect(locators.portalContainer()).toBeVisible();
  });

  await step('Should render portal content', async () => {
    expect(locators.portalContent()).toBeVisible();
    expect(locators.portalContent()).toHaveTextContent(
      'This content is inside a portal, rendered within the green container.'
    );

    expect(locators.portalCloseLink()).toBeVisible();
    expect(locators.portalCloseLink()).toHaveTextContent('Hide');
  });

  await step('Should click on the Portal Close Link', async () => {
    expect(locators.portalCloseLink()).toBeInTheDocument();
    await userEvent.click(locators.portalCloseLink()!);
  });

  await step('Should not render portal container', async () => {
    expect(locators.portalContainer()).not.toBeInTheDocument();
  });
};

export const withWrapperActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderInitialComponents(locators, step);

  await step('Should click on the Portal Link and update Trigger Text', async () => {
    await userEvent.click(locators.showPortalLink());
    expect(locators.showPortalLink()).toHaveTextContent('Hide Portal');
  });

  await step('Should render portal content', async () => {
    expect(locators.portalContent()).toBeVisible();
    expect(locators.portalContent()).toHaveTextContent('This content is styled by a `section` wrapper.');

    expect(locators.portalCloseLink()).toBeVisible();
    expect(locators.portalCloseLink()).toHaveTextContent('Hide');
  });

  await step('Should click on the Portal Close Link', async () => {
    expect(locators.portalCloseLink()).toBeInTheDocument();
    await userEvent.click(locators.portalCloseLink()!);
  });

  await step('Should not render portal components', async () => {
    expect(locators.portalContent()).not.toBeInTheDocument();
    expect(locators.portalCloseLink()).not.toBeInTheDocument();
  });
};

export const withWrapperAsTagMainActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderInitialComponents(locators, step);

  await step('Should click on the Portal Link and update Trigger Text', async () => {
    await userEvent.click(locators.showPortalLink());
    expect(locators.showPortalLink()).toHaveTextContent('Hide Portal');
  });

  await step('Should render portal content', async () => {
    expect(locators.portalContent()).toBeVisible();
    expect(locators.portalContent()).toHaveTextContent('This content is styled by a `section` wrapper.');

    expect(locators.portalCloseLink()).toBeVisible();
    expect(locators.portalCloseLink()).toHaveTextContent('Hide');
  });

  await step('Should click on the Portal Close Link', async () => {
    expect(locators.portalCloseLink()).toBeInTheDocument();
    await userEvent.click(locators.portalCloseLink()!);
  });

  await step('Should not render portal components', async () => {
    expect(locators.portalContent()).not.toBeInTheDocument();
    expect(locators.portalCloseLink()).not.toBeInTheDocument();
  });
};

const shouldRenderInitialComponents = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should render container', async () => {
    expect(locators.container()).toBeVisible();
  });

  await step('Should render show portal link', async () => {
    expect(locators.showPortalLink()).toBeVisible();
    expect(locators.showPortalLink()).toHaveTextContent('Show Portal');
  });
};
