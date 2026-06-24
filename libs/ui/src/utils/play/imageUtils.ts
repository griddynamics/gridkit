import { waitFor, expect } from 'storybook/test';

/**
 * Wait for an image to load
 * @param imageGetter - Function that returns the image element
 * @param timeout - Maximum time to wait in milliseconds (default: 3000ms)
 */
export async function waitForImageLoad(imageGetter: () => HTMLElement, timeout = 3000): Promise<void> {
  await waitFor(
    () => {
      const image = imageGetter();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src');
    },
    { timeout }
  );
}

/**
 * Wait for image to be visible
 * @param imageGetter - Function that returns the image element
 * @param timeout - Maximum time to wait in milliseconds (default: 3000ms)
 */
export async function waitForImageToBeVisible(imageGetter: () => HTMLElement, timeout = 3000): Promise<void> {
  await waitFor(
    () => {
      const image = imageGetter();
      expect(image).toBeInTheDocument();
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src');
    },
    { timeout }
  );
}
