import { waitFor, expect } from 'storybook/test';

/**
 * Wait for an element to appear in the DOM
 * @param getter - Function that returns the element
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function waitForElementToAppear(getter: () => HTMLElement, timeout = 1000): Promise<void> {
  await waitFor(() => expect(getter()).toBeInTheDocument(), { timeout });
}

/**
 * Wait for an element to disappear from the DOM
 * Use with query variants (queryBy*) that return null when element doesn't exist
 * @param getter - Function that returns the element or null
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function waitForElementToDisappear(getter: () => HTMLElement | null, timeout = 1000): Promise<void> {
  await waitFor(() => expect(getter()).not.toBeInTheDocument(), { timeout });
}

/**
 * Wait for an element to become visible
 * @param getter - Function that returns the element
 * @param timeout - Maximum time to wait in milliseconds (default: 500ms)
 */
export async function waitForElementToBeVisible(getter: () => HTMLElement, timeout = 500): Promise<void> {
  await waitFor(() => expect(getter()).toBeVisible(), { timeout });
}

/**
 * Wait for text content to change to expected value
 * @param getter - Function that returns the element
 * @param expectedText - Expected text content (string or regex)
 * @param timeout - Maximum time to wait in milliseconds (default: 2000ms)
 */
export async function waitForTextChange(
  getter: () => HTMLElement,
  expectedText: string | RegExp,
  timeout = 2000
): Promise<void> {
  await waitFor(() => expect(getter()).toHaveTextContent(expectedText), { timeout });
}

/**
 * Wait for an input value to change to expected value
 * @param getter - Function that returns the input element
 * @param expectedValue - Expected input value
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function waitForValueChange(
  getter: () => HTMLElement,
  expectedValue: string,
  timeout = 1000
): Promise<void> {
  await waitFor(() => expect(getter()).toHaveValue(expectedValue), { timeout });
}

/**
 * Wait for an element to have a specific attribute value
 * @param getter - Function that returns the element
 * @param attribute - Attribute name
 * @param expectedValue - Expected attribute value (optional - checks for existence if not provided)
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function waitForAttribute(
  getter: () => HTMLElement,
  attribute: string,
  expectedValue?: string,
  timeout = 1000
): Promise<void> {
  await waitFor(
    () => {
      if (expectedValue !== undefined) {
        expect(getter()).toHaveAttribute(attribute, expectedValue);
      } else {
        expect(getter()).toHaveAttribute(attribute);
      }
    },
    { timeout }
  );
}

/**
 * Wait for loading to complete (loading element disappears)
 * @param queryLoadingGetter - Function that returns the loading element or null
 * @param timeout - Maximum time to wait in milliseconds (default: 3000ms)
 */
export async function waitForLoadingToComplete(
  queryLoadingGetter: () => HTMLElement | null,
  timeout = 3000
): Promise<void> {
  await waitFor(() => expect(queryLoadingGetter()).not.toBeInTheDocument(), { timeout });
}

/**
 * Wait for a specific number of elements to be present in the DOM
 * @param getter - Function that returns an array of elements
 * @param expectedCount - Expected number of elements
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 */
export async function waitForElementCount(
  getter: () => HTMLElement[],
  expectedCount: number,
  timeout = 1000
): Promise<void> {
  await waitFor(
    () => {
      const elements = getter();
      expect(elements.length).toBe(expectedCount);
    },
    { timeout }
  );
}
