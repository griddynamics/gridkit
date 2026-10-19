import { expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdChatContainer } from '../src';

const chat = (canvas: HTMLElement) => canvas.querySelector<GdChatContainer>('gd-chat-container')!;
const nativeButton = (host: Element | null) => host?.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
const lightButton = (canvas: HTMLElement, label: string) =>
  nativeButton(canvas.querySelector(`gd-button[aria-label="${label}"]`));
const internalButton = (canvas: HTMLElement, label: string) =>
  nativeButton(chat(canvas).shadowRoot?.querySelector(`gd-button[aria-label="${label}"]`) ?? null);
const textButton = (canvas: HTMLElement, label: string) =>
  Array.from(canvas.querySelectorAll('gd-button'))
    .find((host) => host.textContent?.trim() === label)
    ?.shadowRoot?.querySelector('button') as HTMLButtonElement | null;

async function click(button: HTMLButtonElement | null) {
  if (!button) throw new Error('Expected ChatContainer button');
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  await userEvent.click(button);
}

async function expectOpen(canvas: HTMLElement, open: boolean) {
  await waitFor(() => expect(chat(canvas).isOpen).toBe(open));
  const wrapper = chat(canvas).shadowRoot?.querySelector('[part="sidebar-wrapper"]') as HTMLElement;
  await waitFor(() => expect(getComputedStyle(wrapper).opacity).toBe(open ? '1' : '0'));
}

async function verifyMainContent(canvas: HTMLElement) {
  const bubbles = canvas.querySelectorAll('[data-testid="ChatBubble"]');
  expect(bubbles).toHaveLength(4);
  await expect(bubbles[0]).toHaveTextContent('Hi! Can you help me generate an SVG');
  await expect(canvas.querySelector('[data-testid="Snackbar"]')).toHaveTextContent('Click the button below to retry');
  await expect(canvas.querySelector('gd-loader')).toBeVisible();
  for (const label of ['Voice', 'Copy', 'Like', 'Dislike']) {
    await click(lightButton(canvas, label));
  }
  await click(textButton(canvas, 'Retry'));
}

async function verifySidebar(canvas: HTMLElement) {
  const items = canvas.querySelectorAll('gd-box');
  expect(items).toHaveLength(3);
  await expect(items[0]).toHaveTextContent('Recent conversation 1');
  await expect(items[1]).toHaveTextContent('Recent conversation 2');
  await expect(items[2]).toHaveTextContent('Recent conversation 3');
  await userEvent.click(items[0]);
}

async function verifyMinified(canvas: HTMLElement) {
  for (const label of ['New Chat', 'History', 'Edit']) {
    await click(lightButton(canvas, label));
  }
}

export async function defaultActions({ canvasElement, step }: StoryContext) {
  await step('Should verify default conversation and actions', () => verifyMainContent(canvasElement));
  await step('Should verify minified sidebar actions', () => verifyMinified(canvasElement));
  await step('Should open from the main header control', async () => {
    await click(internalButton(canvasElement, 'Toggle sidebar - open'));
    await expectOpen(canvasElement, true);
  });
  await step('Should verify and close the expanded sidebar', async () => {
    await verifySidebar(canvasElement);
    await click(internalButton(canvasElement, 'Toggle sidebar - close'));
    await expectOpen(canvasElement, false);
  });
}

export async function minimalLayoutWithRefControlActions({ canvasElement, step }: StoryContext) {
  await step('Should verify default conversation and actions', () => verifyMainContent(canvasElement));
  await step('Should toggle through the imperative element method', async () => {
    await click(textButton(canvasElement, 'Toggle Sidebar Programmatically'));
    await expectOpen(canvasElement, true);
    await verifySidebar(canvasElement);
  });
}

export async function interactiveDemoActions({ canvasElement, step }: StoryContext) {
  await step('Should verify and close the expanded sidebar', async () => {
    await verifySidebar(canvasElement);
    await click(internalButton(canvasElement, 'Toggle sidebar - close'));
    await expectOpen(canvasElement, false);
  });
  await step('Should verify conversation and minified actions', async () => {
    await verifyMainContent(canvasElement);
    await verifyMinified(canvasElement);
  });
  await step('Should toggle, close, and open through imperative controls', async () => {
    await click(textButton(canvasElement, 'Toggle'));
    await expectOpen(canvasElement, true);
    await click(textButton(canvasElement, 'Close'));
    await expectOpen(canvasElement, false);
    await click(textButton(canvasElement, 'Open'));
    await expectOpen(canvasElement, true);
  });
}
