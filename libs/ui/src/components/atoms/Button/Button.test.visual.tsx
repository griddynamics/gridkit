import { test, expect } from 'vitest';
import { composeStories } from '@storybook/react';
import { page } from 'vitest/browser';

import * as stories from './Button.stories';

const { Default } = composeStories(stories);

test('button-visual', async () => {
  await Default.run();
  await expect.element(page.getByTestId('Button')).toMatchScreenshot('Button');
});
