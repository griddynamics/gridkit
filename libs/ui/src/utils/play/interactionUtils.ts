import { userEvent } from 'storybook/test';

/**
 * Press a keyboard key
 * @param key - Key to press (e.g., 'Enter', 'Escape', 'Tab', 'Space', 'ArrowDown')
 * @example
 * await pressKey('Enter');
 * await pressKey('Escape');
 * await pressKey('Tab');
 */
export async function pressKey(key: string): Promise<void> {
  await userEvent.keyboard(`{${key}}`);
}

/**
 * Press multiple keys in sequence
 * @param keys - Array of keys to press
 * @example
 * await pressKeys(['Tab', 'Tab', 'Enter']);
 */
export async function pressKeys(keys: string[]): Promise<void> {
  for (const key of keys) {
    await pressKey(key);
  }
}
