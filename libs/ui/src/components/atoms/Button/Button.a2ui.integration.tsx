import { it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import * as React from 'react';
import { render } from '../../../test-utils';
import type { A2UISpec } from '../../../ai';
import { renderA2UISpec } from '../../../utils/a2ui';
import { describeA2ui, assertLlmJudge, fetchA2uiSpecResult } from '../../../utils/a2ui.integration.helpers';
import { ATOMIC } from '../../../ai/testing_prompts';

describeA2ui('Button A2UI integration', () => {
  it('SHOULD successfully generate, render and interact with all 6 button variants', async () => {
    const result = await fetchA2uiSpecResult(ATOMIC.button.prompt);

    render(<React.Fragment>{renderA2UISpec(result.spec as Pick<A2UISpec, 'ui'>)}</React.Fragment>);

    await page.mark(ATOMIC.button.steps.defaultPrimary, async () => {
      const btn1 = page.getByRole('button', { name: 'Click me' });
      await expect.element(btn1).toBeVisible();
      await btn1.click();
    });

    await page.mark(ATOMIC.button.steps.secondaryWithIcons, async () => {
      const btn2 = page.getByRole('button', { name: "Don't Click" });
      await expect.element(btn2).toBeVisible();
      await btn2.click();

      const iconRight = btn2.getByTestId('Icon-arrowRight');
      const iconCheck = btn2.getByTestId('Icon-check');

      expect(iconRight).toBeVisible();
      expect(iconCheck).toBeVisible();
    });

    await page.mark(ATOMIC.button.steps.tertiaryIconOnly, async () => {
      const btn3 = page.getByRole('button', { name: 'Close' });
      await expect.element(btn3).toBeVisible();
      await btn3.click();

      const iconCross = btn3.getByTestId('Icon-cross');
      expect(iconCross).toBeVisible();
    });

    await page.mark(ATOMIC.button.steps.disabledOutlined, async () => {
      const btn4 = page.getByRole('button', { name: 'Disabled' });
      await expect.element(btn4).toBeVisible();
      await expect.element(btn4).toBeDisabled();
    });

    await page.mark(ATOMIC.button.steps.submitRounded, async () => {
      const btn5 = page.getByRole('button', { name: 'Submit' });
      await expect.element(btn5).toBeVisible();
      await expect.element(btn5).toHaveAttribute('type', 'submit');
    });

    await page.mark(ATOMIC.button.steps.loadingState, async () => {
      const btn6 = page.getByRole('button', { name: 'Loading state' });
      await expect.element(btn6).toBeVisible();
      await expect.element(btn6).toBeDisabled();
    });

    await page.mark('LLM Judge Validation', async () => {
      await assertLlmJudge(ATOMIC.button.prompt);
    });
  });
});
