/**
 * Shared infrastructure for A2UI component integration tests.
 * Import `describeA2ui` and `assertLlmJudge` in each component-specific
 * *.a2ui.integration.tsx file — no other boilerplate needed.
 */
import { afterEach, beforeAll, describe, expect } from 'vitest';
import { commands, page } from 'vitest/browser';
import { screen } from '../test-utils';
import type { FetchA2uiSpecResult } from './commands/vitest-a2ui-llm-command';
import type { ValidateA2uiSpecResult } from './commands/vitest-a2ui-schema-command';
import type {
  JudgeA2uiSpecResult,
  JudgeA2uiSpecVerdict,
  JudgeConfig,
  MetricName,
} from './commands/vitest-a2ui-judge-command';
import type { CheckA11yOptions, CheckA11yResult } from './commands/vitest-a11y-command';

/** Inlined by Vitest `define` for the `a2ui-integration` project only (presence of key, not the secret). */
declare const __A2UI_LLM_CONFIGURED__: boolean;

declare module 'vitest/browser' {
  interface BrowserCommands {
    fetchA2uiSpec: (userPrompt: string) => Promise<FetchA2uiSpecResult>;
    validateA2uiSpec: (spec: unknown) => Promise<ValidateA2uiSpecResult>;
    judgeA2uiSpec: (userPrompt: string, screenshotDataUrl: string) => Promise<JudgeA2uiSpecResult>;
    checkA11y: (options?: CheckA11yOptions) => Promise<CheckA11yResult>;
  }
}

/**
 * Default judge config: taskCompletion and promptAlignment are hard failures at 0.7;
 * imageCoherence and hallucination are soft warnings at 0.6 and 0.7 respectively.
 */
export const DEFAULT_JUDGE_CONFIG = {
  taskCompletion: { enabled: true, threshold: 0.7, failureMode: 'hard' },
  promptAlignment: { enabled: true, threshold: 0.7, failureMode: 'soft' },
  imageCoherence: { enabled: true, threshold: 0.6, failureMode: 'soft' },
  hallucination: { enabled: true, threshold: 0.7, failureMode: 'soft' },
} as const satisfies JudgeConfig;

function buildJudgeDiagnostics(result: JudgeA2uiSpecVerdict): string {
  const metrics = (Object.keys(result.metrics) as MetricName[])
    .map((name) => {
      const { score, reasoning } = result.metrics[name];
      return `- ${name}: ${score.toFixed(2)} (${reasoning})`;
    })
    .join('\n');

  return `Summary: ${result.summary}\nMetrics:\n${metrics}`;
}

/** Polyfills ResizeObserver when running in a jsdom environment that lacks it. */
export function polyfillResizeObserver(): void {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    /* eslint-disable @typescript-eslint/no-empty-function */
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    /* eslint-enable @typescript-eslint/no-empty-function */
  }
}

/** Registers an afterEach that runs an axe-core accessibility audit. */
export function registerA11yAfterEach(): void {
  afterEach(async () => {
    await page.mark('accessibility audit', async () => {
      const hasLayoutRoot = screen.queryByTestId('a2ui-layout-root') !== null;
      const a11y = await commands.checkA11y({
        selector: hasLayoutRoot ? '[data-testid="a2ui-layout-root"]' : 'body',
        // Temporary policy: keep color contrast checks non-blocking.
        disableRules: ['color-contrast'],
      });
      expect(a11y.violations, `A11y violation(s):\n${JSON.stringify(a11y.violations, null, 2)}`).toHaveLength(0);
    });
  });
}

/**
 * Captures a screenshot of the rendered component, sends it to the LLM judge,
 * and asserts per-metric thresholds based on the provided config.
 *
 * Hard failures (score < threshold with failureMode: 'hard') fail the test.
 * Soft failures (score < threshold with failureMode: 'soft') emit a console.warn.
 * Skips silently when ANTHROPIC_API_KEY is absent.
 *
 * @param userPrompt  The original prompt describing the UI intent.
 * @param config      Optional metric config override. Defaults to DEFAULT_JUDGE_CONFIG.
 */
export async function assertLlmJudge(userPrompt: string, config: JudgeConfig = DEFAULT_JUDGE_CONFIG): Promise<void> {
  await page.mark('llm judge', async () => {
    const hasLayoutRoot = screen.queryByTestId('a2ui-layout-root') !== null;
    const target = hasLayoutRoot ? page.getByTestId('a2ui-layout-root') : page.getByRole('document');
    const { base64 } = await target.screenshot({ base64: true });
    const dataUrl = `data:image/png;base64,${base64}`;
    const result = await commands.judgeA2uiSpec(userPrompt, dataUrl);
    if ('skipped' in result) return;
    const diagnostics = buildJudgeDiagnostics(result);

    const hardFailures: string[] = [];
    const softFailures: string[] = [];
    for (const name of Object.keys(result.metrics) as MetricName[]) {
      const cfg = config[name];
      if (!cfg?.enabled) continue;
      const { score, reasoning } = result.metrics[name];
      if (score < cfg.threshold) {
        const msg = `[${name}] score ${score.toFixed(2)} < ${cfg.threshold}: ${reasoning}`;
        if (cfg.failureMode === 'hard') {
          hardFailures.push(msg);
        } else {
          softFailures.push(msg);
        }
      }
    }
    if (softFailures.length > 0) {
      console.warn(`LLM judge soft warning(s):\n${softFailures.join('\n')}\n${diagnostics}`);
    }
    if (hardFailures.length > 0) {
      expect(hardFailures, `LLM judge hard failure(s):\n${hardFailures.join('\n')}\n${diagnostics}`).toHaveLength(0);
    }
  });
}

/** Asserts the A2UI spec is valid against the A2UI_SPEC_SCHEMA. */
export async function assertA2uiSpec(spec: unknown): Promise<void> {
  const validation = await commands.validateA2uiSpec(spec);
  expect.soft(validation.valid, `A2UI spec validation failed:\n${validation.errors}`).toBe(true);
}

/**
 * Wraps `describe.skipIf(!__A2UI_LLM_CONFIGURED__)` and registers the
 * ResizeObserver polyfill and accessibility afterEach automatically.
 *
 * Usage:
 *   describeA2ui('Button — A2UI integration', () => { it(...) });
 */
export function describeA2ui(suiteName: string, fn: () => void): void {
  describe.skipIf(!__A2UI_LLM_CONFIGURED__)(suiteName, () => {
    beforeAll(polyfillResizeObserver);
    registerA11yAfterEach();
    fn();
  });
}

/** Fetches the A2UI spec and asserts it is valid. */
export async function fetchA2uiSpecResult(userPrompt: string): Promise<FetchA2uiSpecResult> {
  const result = await commands.fetchA2uiSpec(userPrompt);
  await assertA2uiSpec(result.spec);
  return result;
}
