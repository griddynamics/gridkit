import { it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import * as React from 'react';
import { act } from 'react';
import { render } from '../../../test-utils';
import type { A2UISpec } from '../../../ai';
import { renderA2UISpec } from '../../../utils/a2ui';
import { describeA2ui, assertLlmJudge, fetchA2uiSpecResult } from '../../../utils/a2ui.integration.helpers';
import { ATOMIC } from '../../../ai/testing_prompts';

describeA2ui('Textarea A2UI integration', () => {
  it('SHOULD render textarea by an A2UI spec', async () => {
    const result = await fetchA2uiSpecResult(ATOMIC.textarea.prompt);

    await act(async () => {
      render(<React.Fragment>{renderA2UISpec(result.spec as Pick<A2UISpec, 'ui'>)}</React.Fragment>);
    });

    await page.mark(ATOMIC.textarea.steps.defaultSuccess, async () => {
      const textAr1 = page.getByPlaceholder('Hello');
      await expect.element(textAr1).toBeVisible();

      await textAr1.click();
      await expect.element(textAr1).toHaveFocus();

      await textAr1.fill('Grid Dynamics');
      await expect.element(textAr1).toHaveValue('Grid Dynamics');

      await textAr1.fill('');
      await expect.element(textAr1).toHaveValue('');
    });

    await page.mark(ATOMIC.textarea.steps.resizableCounter, async () => {
      const textAr2 = page.getByPlaceholder('Resizable input');
      await expect.element(textAr2).toBeVisible();

      await textAr2.click();
      await textAr2.fill('Hello World!');
      await expect.element(textAr2).toHaveValue('Hello World!');

      await textAr2.fill('Exceeding twenty chars!');
      await expect.element(textAr2).toHaveValue('Exceeding twenty chars!');
    });

    await page.mark(ATOMIC.textarea.steps.inlineVariant, async () => {
      const textAr3 = page.getByPlaceholder('Inline input');

      await textAr3.click();
      await textAr3.fill('Inline content');
      await expect.element(textAr3).toHaveValue('Inline content');
    });

    await page.mark(ATOMIC.textarea.steps.disabled, async () => {
      const textAr5 = page.getByPlaceholder('Disabled');
      await expect.element(textAr5).toBeVisible();
      await expect.element(textAr5).toBeDisabled();
    });

    await page.mark('LLM Judge Validation', async () => {
      await assertLlmJudge(ATOMIC.textarea.prompt);
    });
  });
});
