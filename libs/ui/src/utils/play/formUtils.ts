import { userEvent } from 'storybook/test';

/**
 * Fill an input field (clear + type)
 * @param input - The input element to fill
 * @param value - The value to type
 */
export async function fillInput(input: HTMLElement, value: string): Promise<void> {
  await userEvent.clear(input);
  await userEvent.type(input, value);
}

/**
 * Type into an input with optional delay between keystrokes
 * @param input - The input element
 * @param value - The value to type
 * @param delay - Delay in ms between keystrokes (default: 0)
 */
export async function typeIntoInput(input: HTMLElement, value: string, delay = 0): Promise<void> {
  await userEvent.type(input, value, { delay });
}

/**
 * Clear an input field
 * @param input - The input element to clear
 */
export async function clearInput(input: HTMLElement): Promise<void> {
  await userEvent.clear(input);
}

/**
 * Click a checkbox or radio button
 * @param input - The checkbox/radio element
 */
export async function clickInput(input: HTMLElement): Promise<void> {
  await userEvent.click(input);
}

/**
 * Tab to next element
 */
export async function tabToNext(): Promise<void> {
  await userEvent.tab();
}
