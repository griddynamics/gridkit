import { it, expect } from 'vitest';
import { page } from '@vitest/browser/context';
import * as React from 'react';
import { render } from '../../../test-utils';
import type { A2UISpec } from '../../../ai';
import { renderA2UISpec } from '../../../utils/a2ui';
import { describeA2ui, assertLlmJudge, fetchA2uiSpecResult } from '../../../utils/a2ui.integration.helpers';
import { ATOMIC } from '../../../ai/testing_prompts';

// After bug fixing will add some more checks
describeA2ui('Checkbox A2UI integration', () => {
  it.skip('SHOULD successfully generate, render and interact with all 3 checkbox variants', async () => {
    const result = await fetchA2uiSpecResult(ATOMIC.checkbox.prompt);

    render(<React.Fragment>{renderA2UISpec(result.spec as Pick<A2UISpec, 'ui'>)}</React.Fragment>);

    await page.mark(ATOMIC.checkbox.steps.defaultUnchecked, async () => {
      const check1 = page.getByLabelText('Accept terms');
      expect(check1).toBeVisible();
      expect(check1).not.toBeChecked();
    });

    await page.mark(ATOMIC.checkbox.steps.indeterminate, async () => {
      const check2 = page.getByLabelText('Select all');
      expect(check2).toBeVisible();
      expect(check2).not.toBeChecked();
    });

    await page.mark(ATOMIC.checkbox.steps.smallDisabled, async () => {
      const check3 = page.getByLabelText('Unavailable option');
      expect(check3).toBeDisabled();
      expect(check3).toBeChecked();
    });

    await page.mark('LLM Judge Validation', async () => {
      await assertLlmJudge(ATOMIC.checkbox.prompt);
    });
  });
});
