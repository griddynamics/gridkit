import { userEvent, waitFor, expect } from 'storybook/test';
import { pressKey } from './interactionUtils';

/**
 * Open a modal by clicking the trigger and waiting for it to appear
 * @param triggerGetter - Function that returns the trigger button element
 * @param modalGetter - Function that returns the modal element
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function openModal(
  triggerGetter: () => HTMLElement,
  modalGetter: () => HTMLElement,
  timeout = 1000
): Promise<void> {
  await userEvent.click(triggerGetter());
  await waitFor(() => expect(modalGetter()).toBeInTheDocument(), { timeout });
}

/**
 * Close a modal by clicking the close button and waiting for it to disappear
 * @param closeButtonGetter - Function that returns the close button element
 * @param queryModalGetter - Function that returns the modal element or null (use query variant)
 * @param timeout - Maximum time to wait in milliseconds (default: 2000ms)
 */
export async function closeModal(
  closeButtonGetter: () => HTMLElement,
  queryModalGetter: () => HTMLElement | null,
  timeout = 2000
): Promise<void> {
  await userEvent.click(closeButtonGetter());
  await waitFor(() => expect(queryModalGetter()).not.toBeInTheDocument(), { timeout });
}

/**
 * Close a modal by pressing the Escape key and waiting for it to disappear
 * @param queryModalGetter - Function that returns the modal element or null (use query variant)
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function closeModalWithEscape(queryModalGetter: () => HTMLElement | null, timeout = 1000): Promise<void> {
  await pressKey('Escape');
  await waitFor(() => expect(queryModalGetter()).not.toBeInTheDocument(), { timeout });
}

/**
 * Wait for modal to be visible (checks both existence and visibility)
 * @param modalGetter - Function that returns the modal element
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function waitForModalToBeVisible(modalGetter: () => HTMLElement, timeout = 1000): Promise<void> {
  await waitFor(
    () => {
      const modal = modalGetter();
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();
    },
    { timeout }
  );
}
