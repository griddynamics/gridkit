import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { tabToNext } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => {
  const actionButton = (iconName: string) =>
    canvas.getByTestId(`Icon-${iconName}`).closest('button') as HTMLButtonElement;

  return {
    chatBubble: () => canvas.getByTestId('ChatBubble'),
    chatBubbleContent: () => canvas.getByTestId('ChatBubble-content'),
    chatBubbleActions: () => canvas.getByTestId('ChatBubble-actions'),
    volumeUpButton: () => actionButton('volumeUp'),
    contentCopyButton: () => actionButton('contentCopy'),
    likeButton: () => actionButton('thumbUp'),
    dislikeButton: () => actionButton('thumbDown'),
    loader: () => canvas.getByTestId('Loader'),
  };
};

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await shouldRenderBasicChatBubbleComponents(locators, step);

  await step('Should display basic text', async () => {
    const chatBubbleContent = locators.chatBubbleContent();
    expect(chatBubbleContent).toHaveTextContent(args['children'] as string);
  });
};

export const answersWithActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  const buttons = [
    locators.volumeUpButton(),
    locators.contentCopyButton(),
    locators.likeButton(),
    locators.dislikeButton(),
  ];

  await shouldRenderBasicChatBubbleComponents(locators, step);

  await step('Should display basic text', async () => {
    const chatBubbleContent = locators.chatBubbleContent();
    expect(chatBubbleContent).toHaveTextContent(args['children'] as string);
  });

  await step('Should render Chat Bubble Actions', async () => {
    const chatBubbleActions = locators.chatBubbleActions();
    expect(chatBubbleActions).toBeInTheDocument();
  });

  await step('Should render  Chat Bubble action buttons', async () => {
    for (const button of buttons) {
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    }
  });

  await step('Should have button roles for accessibility ', async () => {
    for (const button of buttons) {
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('tabindex', '0');
      expect(button).toHaveAttribute('type', 'button');
    }
  });

  await step('Should trigger all buttons correctly', async () => {
    const actionConfigs = [
      { locator: locators.volumeUpButton(), key: 'volumeUp' },
      { locator: locators.contentCopyButton(), key: 'contentCopy' },
      { locator: locators.likeButton(), key: 'thumbUp' },
      { locator: locators.dislikeButton(), key: 'thumbDown' },
    ];

    for (const { locator, key } of actionConfigs) {
      await userEvent.click(locator);
      const handler = args['actions'].find((a: ReactElement) => a.key === key)?.props.onClick;
      expect(handler).toHaveBeenCalled();
    }
  });

  await step('Should allow keyboard navigation through buttons', async () => {
    await userEvent.click(document.body);

    for (const button of buttons) {
      await tabToNext();
      expect(button).toHaveFocus();
    }
  });
};

export const answerWithStatusActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await shouldRenderBasicChatBubbleComponents(locators, step);

  await step('Should render Loader component', async () => {
    const loader = locators.loader();
    expect(loader).toBeInTheDocument();
    expect(loader).toBeVisible();
  });

  await step('Should display text about pending component', async () => {
    const chatBubbleContent = locators.chatBubbleContent();
    expect(chatBubbleContent).toHaveTextContent(args['children'] as string);
  });
};

const shouldRenderBasicChatBubbleComponents = async (
  locators: ReturnType<typeof getLocators>,
  step: StoryContext['step']
) => {
  await step('Should render Chat Bubble component', async () => {
    const chatBubble = locators.chatBubble();
    expect(chatBubble).toBeInTheDocument();
    expect(chatBubble).toBeVisible();
  });

  await step('Should render Chat Bubble Content', async () => {
    const chatBubbleContent = locators.chatBubbleContent();
    expect(chatBubbleContent).toBeInTheDocument();
    expect(chatBubbleContent).toBeVisible();
  });
};
