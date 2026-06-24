'use client';
/**
 * Vitest browser command (runs on Node): inject axe-core into the Playwright
 * page and run an accessibility audit. Returns structured violation data.
 *
 * Usage in integration tests:
 *   const a11y = await commands.checkA11y({ selector: '[data-testid="root"]' });
 *   expect(a11y.passed).toBe(true);
 */
import * as path from 'node:path';
import type { BrowserCommand } from 'vitest/node';

export interface A11yViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{ html: string; target: string[]; failureSummary?: string }>;
}

export interface CheckA11yOptions {
  /** axe runOnly tags. Default: ['wcag2a', 'wcag2aa', 'aria'] */
  tags?: string[];
  /** CSS selector to scope the audit. Default: 'body' */
  selector?: string;
  /** axe rule IDs to disable */
  disableRules?: string[];
}

export type CheckA11yResult = { passed: true; violations: [] } | { passed: false; violations: A11yViolation[] };

export const checkA11yCommand: BrowserCommand<[options?: CheckA11yOptions], CheckA11yResult> = async (
  context,
  options = {}
) => {
  const { tags = ['wcag2a', 'wcag2aa'], selector = 'body', disableRules = [] } = options;

  // Resolve the axe-core UMD bundle — hoisted to the monorepo root node_modules
  // by @storybook/addon-a11y. Vitest always runs from the workspace root (cwd).
  const axeCorePath: string = path.resolve(process.cwd(), 'node_modules/axe-core/axe.js');

  // Vitest renders components inside a named iframe ("vitest-iframe").
  // context.frame() returns the Playwright Frame for that iframe — we must
  // inject and evaluate inside the frame, not the top-level page.
  const frame = await (
    context as unknown as {
      frame: () => Promise<
        {
          addScriptTag: (opts: { path: string }) => Promise<void>;
          evaluate: <T, A>(fn: (arg: A) => T | Promise<T>, arg: A) => Promise<T>;
        } & { evaluate: <T>(fn: () => T | Promise<T>) => Promise<T> }
      >;
    }
  ).frame();

  // Inject axe-core only once per frame session
  const alreadyInjected = await frame.evaluate(
    () => typeof (window as unknown as { axe?: unknown }).axe !== 'undefined'
  );
  if (!alreadyInjected) {
    await frame.addScriptTag({ path: axeCorePath });
  }

  type AxeRunResult = { violations: Record<string, unknown>[] };
  const { violations: raw } = await frame.evaluate(
    ({ selector: sel, tags: t, disableRules: dr }: { selector: string; tags: string[]; disableRules: string[] }) =>
      (
        window as unknown as {
          axe: { run: (sel: string, opts: unknown) => Promise<AxeRunResult> };
        }
      ).axe.run(sel, {
        runOnly: { type: 'tag', values: t },
        rules: Object.fromEntries(dr.map((id: string) => [id, { enabled: false }])),
      }),
    { selector, tags, disableRules }
  );

  if (raw.length === 0) {
    return { passed: true, violations: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const violations: A11yViolation[] = (raw as any[]).map((v) => ({
    id: v.id as string,
    impact: (v.impact ?? null) as A11yViolation['impact'],
    description: v.description as string,
    help: v.help as string,
    helpUrl: v.helpUrl as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: ((v.nodes ?? []) as any[]).map((n) => ({
      html: n.html as string,
      target: n.target as string[],
      failureSummary: n.failureSummary as string | undefined,
    })),
  }));

  const summary = violations
    .map((v) => `[${v.impact ?? 'unknown'}] ${v.id}: ${v.help}\n` + v.nodes.map((n) => `  - ${n.html}`).join('\n'))
    .join('\n\n');

  console.warn(`Accessibility violations found:\n\n${summary}`);

  return { passed: false, violations };
};
