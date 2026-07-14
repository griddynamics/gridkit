import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getBtn = (container: () => ReturnType<typeof within>, testId: string) =>
  container().queryByTestId(testId)?.closest('button') as HTMLElement;

const getLocators = (canvas: ReturnType<typeof within>) => {
  const mainContent = () => within(canvas.getByTestId('ChatContainer-content'));
  const sidebar = () => within(canvas.getByTestId('ChatContainer-sidebar'));
  const sidebarMinified = () => within(canvas.getByTestId('ChatContainer-sidebar-minified'));
  const headerContent = () => within(canvas.getByTestId('ChatContainer-main-header'));

  return {
    // --- Layout Elements ---
    chatContainerMainHeader: () => canvas.getByTestId('ChatContainer-main-header'),
    chatContainerSidebarMinified: () => canvas.getByTestId('ChatContainer-sidebar-minified'),
    chatContainerSidebar: () => canvas.getByTestId('ChatContainer-sidebar'),
    chatContainerMainContent: () => canvas.getByTestId('ChatContainer-content'),
    sidebarWrapper: () => canvas.getByTestId('ChatContainer-sidebar-wrapper'),

    // --- Chat Main Content Elements ---
    chatBubbles: () => mainContent().getAllByTestId('ChatBubble'),
    btnVolumeUp: () => getBtn(mainContent, 'Icon-volumeUp'),
    btnCopy: () => getBtn(mainContent, 'Icon-contentCopy'),
    btnThumbUp: () => getBtn(mainContent, 'Icon-thumbUp'),
    btnThumbDown: () => getBtn(mainContent, 'Icon-thumbDown'),
    btnRetry: () => mainContent().getByRole('button', { name: /retry/i }),
    snackbar: () => mainContent().getByTestId('Snackbar'),
    loader: () => mainContent().getByTestId('Loader'),
    btnToggleSidebarProgrammatically: () =>
      mainContent().getByRole('button', { name: /Toggle Sidebar Programmatically/i }),

    // --- Sidebar Elements ---
    sidebarItems: () => sidebar().getAllByTestId('Box'),
    sidebarHeaderTitle: () => sidebar().getByText('Chat History'),
    btnSidebarClose: () => getBtn(sidebar, 'Icon-arrowDown'),

    // --- Sidebar Minified Elements ---
    sidebarNewChatBtn: () => getBtn(sidebarMinified, 'Icon-plus'),
    sidebarHistoryBtn: () => getBtn(sidebarMinified, 'Icon-chat'),
    sidebarEditBtn: () => getBtn(sidebarMinified, 'Icon-edit'),

    // --- Header Elements ---
    btnIconArrowToggleSidebar: () => getBtn(headerContent, 'Icon-arrowDown'),
    btnToggle: () => headerContent().getByRole('button', { name: /Toggle/i }),
    btnOpen: () => headerContent().getByRole('button', { name: /Open/i }),
    btnClose: () => headerContent().getByRole('button', { name: /Close/i }),
  };
};

type PlayLocators = ReturnType<typeof getLocators>;

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyDefaultMainContentScenario(locators, step, args);
  await shouldVerifyDefaultMinifiedSidebarScenario(locators, step, args);

  await step('Should verify Header Layout & Accessibility', async () => {
    await expect(locators.chatContainerMainHeader()).toBeInTheDocument();
    await shouldAssertButtonAccessible(locators.btnIconArrowToggleSidebar(), 'Header sidebar toggle');
  });

  await step('Should verify Header Interactions', async () => {
    await clickAndExpect(locators.btnIconArrowToggleSidebar(), args['onToggleSidebar']);
  });

  await shouldVerifySidebarContent(locators, step);
  await shouldVerifySidebarInteractions(locators, step, args);
};

export const minimalLayoutWithRefControlActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyDefaultMainContentScenario(locators, step, args);

  await step('Should verify Toggle Sidebar Programmatically button Interactions', async () => {
    const btn = await shouldAssertButtonAccessible(
      locators.btnToggleSidebarProgrammatically(),
      'Toggle Sidebar Programmatically'
    );
    await userEvent.click(btn);
  });

  await shouldVerifySidebarContent(locators, step);
};

export const interactiveDemoActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifySidebarContent(locators, step);
  await shouldVerifySidebarInteractions(locators, step, args);
  await shouldVerifyDefaultMainContentScenario(locators, step, args);
  await shouldVerifyDefaultMinifiedSidebarScenario(locators, step, args);

  await step('Should verify Header Render', async () => {
    const headerContent = locators.chatContainerMainHeader();
    await expect(headerContent).toBeVisible();
    await expect(headerContent).toBeInTheDocument();
  });

  await step('Should verify Header Buttons', async () => {
    await shouldAssertButtonAccessible(locators.btnToggle(), 'Header toggle');
    await shouldAssertButtonAccessible(locators.btnOpen(), 'Header open');
    await shouldAssertButtonAccessible(locators.btnClose(), 'Header close');
  });

  await step('Should open sidebar when Toggle button is clicked', async () => {
    await clickAndExpect(locators.btnToggle(), args['onToggleSidebar']);
  });

  await step('Should render Sidebar after Toggle', async () => {
    await waitForSidebarToBeVisible(locators);
  });

  await step('Should close sidebar when Close button is clicked', async () => {
    await clickAndExpect(locators.btnClose(), args['onToggleSidebar']);
  });

  await step('Should open sidebar when Open button is clicked', async () => {
    await userEvent.click(locators.btnOpen());
  });

  await step('Should render Sidebar after Open', async () => {
    await waitForSidebarToBeVisible(locators);
  });
};

const shouldVerifyDefaultMainContentScenario = async (
  locators: PlayLocators,
  step: StoryContext['step'],
  args: StoryContext['args']
) => {
  await step('Should verify Main Container Layout', async () => {
    await expect(locators.chatContainerMainContent()).toBeInTheDocument();
  });

  await step('Should verify Conversation History', async () => {
    const bubbles = locators.chatBubbles();
    await expect(bubbles).toHaveLength(4);
    await expect(bubbles[0]).toHaveTextContent('Hi! Can you help me generate an SVG');
    await expect(bubbles[1]).toHaveTextContent('Sure! Please paste the code');
    await expect(bubbles[2]).toHaveTextContent('One more question.');
  });

  await step('Should verify Bot Action Buttons Accessibility', async () => {
    await shouldAssertButtonAccessible(locators.btnVolumeUp(), 'bot volume up action');
    await shouldAssertButtonAccessible(locators.btnCopy(), 'bot copy action');
    await shouldAssertButtonAccessible(locators.btnThumbUp(), 'bot thumb up action');
    await shouldAssertButtonAccessible(locators.btnThumbDown(), 'bot thumb down action');
    await shouldAssertButtonAccessible(locators.btnRetry(), 'bot retry action');
  });

  await step('Should verify Bot Action Buttons Interactions', async () => {
    await clickAndExpect(locators.btnVolumeUp(), args['onVolumeClick']);
    await clickAndExpect(locators.btnCopy(), args['onCopyClick']);
    await clickAndExpect(locators.btnThumbUp(), args['onThumbUpClick']);
    await clickAndExpect(locators.btnThumbDown(), args['onThumbDownClick']);
  });

  await step('Should verify Error Snackbar State', async () => {
    const snackbar = locators.snackbar();
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toHaveTextContent('Error');
    await expect(snackbar).toHaveTextContent('Click the button below to retry');
    await expect(locators.btnRetry()).toHaveTextContent('Retry');
  });

  await step('Should verify Error Retry Interaction', async () => {
    const retryBtn = await shouldAssertButtonAccessible(locators.btnRetry(), 'retry action');
    await clickAndExpect(retryBtn, args['onRetryClick']);
  });

  await step('Should verify Loading State', async () => {
    await expect(locators.loader()).toBeVisible();
  });
};

const shouldVerifyDefaultMinifiedSidebarScenario = async (
  locators: PlayLocators,
  step: StoryContext['step'],
  args: StoryContext['args']
) => {
  await step('Should verify Sidebar Minified Layout & Accessibility', async () => {
    await expect(locators.chatContainerSidebarMinified()).toBeVisible();
    await shouldAssertButtonAccessible(locators.sidebarNewChatBtn(), 'sidebar new chat action');
    await shouldAssertButtonAccessible(locators.sidebarHistoryBtn(), 'sidebar history action');
    await shouldAssertButtonAccessible(locators.sidebarEditBtn(), 'sidebar edit action');
  });

  await step('Should verify Minified Sidebar Interactions', async () => {
    await clickAndExpect(locators.sidebarNewChatBtn(), args['onNewChatClick']);
    await clickAndExpect(locators.sidebarHistoryBtn(), args['onHistoryClick']);
    await clickAndExpect(locators.sidebarEditBtn(), args['onEditClick']);
  });
};

const shouldVerifySidebarContent = async (locators: PlayLocators, step: StoryContext['step']) => {
  await step('Should verify Sidebar Content', async () => {
    await expect(locators.chatContainerSidebar()).toBeInTheDocument();

    const items = locators.sidebarItems();
    await expect(items).toHaveLength(3);
    await expect(items[0]).toHaveTextContent('Recent conversation 1');
    await expect(items[1]).toHaveTextContent('Recent conversation 2');
    await expect(items[2]).toHaveTextContent('Recent conversation 3');
  });
};

const shouldVerifySidebarInteractions = async (
  locators: PlayLocators,
  step: StoryContext['step'],
  args: StoryContext['args']
) => {
  await step('Should verify Sidebar Interactions', async () => {
    const firstItem = locators.sidebarItems()[0];
    await expect(firstItem).toHaveAttribute('tabindex', '0');
    await userEvent.click(firstItem);

    const closeBtn = await shouldAssertButtonAccessible(locators.btnSidebarClose(), 'Sidebar close');
    await expect(closeBtn).toHaveAttribute('aria-label', 'Toggle sidebar - close');

    await clickAndExpect(closeBtn, args['onToggleSidebar']);
  });
};

const shouldAssertButtonAccessible = async (button: HTMLElement | null, label: string) => {
  if (!button) throw new Error(`Expected ${label} button to be available`);

  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(button).toHaveAttribute('type', 'button');

  return button;
};

const waitForSidebarToBeVisible = async (locators: PlayLocators) => {
  await waitFor(() => {
    const sidebar = locators.chatContainerSidebar();
    expect(sidebar).toBeVisible();
    expect(sidebar).toBeInTheDocument();
  });
};

const clickAndExpect = async (button: HTMLElement, spy?: any) => {
  await userEvent.click(button);
  if (spy) await expect(spy).toHaveBeenCalled();
};
