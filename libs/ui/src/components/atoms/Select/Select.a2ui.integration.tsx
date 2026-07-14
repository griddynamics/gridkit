import { it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import * as React from 'react';
import { render } from '../../../test-utils';
import type { A2UISpec } from '../../../ai';
import { renderA2UISpec } from '../../../utils/a2ui';
import { assertLlmJudge, describeA2ui, fetchA2uiSpecResult } from '../../../utils/a2ui.integration.helpers';
import { ATOMIC } from '../../../ai/testing_prompts';

const FRUIT_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' },
] as const;

async function expectFruitOptionsVisible() {
  const dropdown = page.getByTestId('Select-dropdown');
  for (const { label } of FRUIT_OPTIONS) {
    await expect.element(dropdown.getByText(label)).toBeVisible();
  }
  return dropdown;
}

describeA2ui('Select A2UI integration', () => {
  it('SHOULD successfully generate, render and interact with all 4 select variants', async () => {
    const result = await fetchA2uiSpecResult(ATOMIC.select.prompt);

    render(<React.Fragment>{renderA2UISpec(result.spec as unknown as Pick<A2UISpec, 'ui'>)}</React.Fragment>);

    await page.mark(ATOMIC.select.steps.searchable, async () => {
      const select1 = page.getByRole('button', { name: 'Searchable select' });
      await expect.element(select1).toBeVisible();

      const crossIcon = select1.getByTestId('Icon-cross');
      await expect.element(crossIcon).toBeVisible();

      await select1.click();

      const dropdown = await expectFruitOptionsVisible();

      const searchInput = dropdown.getByTestId('Select-search');
      await searchInput.fill('Banana');

      await dropdown.getByText('Banana').click();

      const updatedSelect = page.getByRole('button', { name: 'Banana' });
      await expect.element(updatedSelect).toBeVisible();
    });

    await page.mark(ATOMIC.select.steps.multiple, async () => {
      const select2 = page.getByRole('button', { name: 'Multiple Select' });
      await expect.element(select2).toBeVisible();

      await select2.click();

      const dropdown = await expectFruitOptionsVisible();

      for (const { label } of FRUIT_OPTIONS) {
        await dropdown.getByText(label).click();
      }

      const updatedSelect = page.getByRole('button', { name: 'Apple, Banana, Grape' });
      await expect.element(updatedSelect).toBeVisible();
    });

    await page.mark(ATOMIC.select.steps.emptyItems, async () => {
      const select3 = page.getByRole('button', { name: 'Empty Select' });
      await expect.element(select3).toBeVisible();
    });

    await page.mark(ATOMIC.select.steps.disabled, async () => {
      const select4 = page.getByRole('button', { name: 'Disabled option' });
      await expect.element(select4).toBeVisible();
      await expect.element(select4).toBeDisabled();
    });

    await page.mark('LLM Judge Validation', async () => {
      await assertLlmJudge(ATOMIC.select.prompt);
    });
  });
});
