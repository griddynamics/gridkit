/**
 * Vitest browser command (runs on Node): LLM-as-a-judge using Claude SDK.
 * Sends the original user prompt + a PNG screenshot to Claude and evaluates
 * four DeepEval-inspired metrics in a single call using Function Calling.
 */
import type { BrowserCommand } from 'vitest/node';
import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export type MetricName = 'taskCompletion' | 'promptAlignment' | 'imageCoherence' | 'hallucination';

export interface MetricScore {
  score: number;
  reasoning: string;
}

export interface MetricConfig {
  enabled: boolean;
  threshold: number;
  failureMode: 'hard' | 'soft';
}

export type JudgeConfig = Record<MetricName, MetricConfig>;
export type JudgeA2uiSpecSkipped = { skipped: true };

export interface JudgeA2uiSpecVerdict {
  metrics: Record<MetricName, MetricScore>;
  summary: string;
  passed: boolean;
}

export type JudgeA2uiSpecResult = JudgeA2uiSpecSkipped | JudgeA2uiSpecVerdict;

const JUDGE_SYSTEM_PROMPT = `You are a UI quality judge evaluating AI-generated interfaces.
Analyze the user's prompt and the rendered PNG screenshot.

Evaluate 4 metrics on a scale from 0.0 to 1.0:
- 1.0: Perfect match / no errors.
- 0.5–0.9: Partial match (deduct proportionally for missing elements or minor errors).
- 0.0–0.4: Severe failure or complete mismatch.
Provide a max 10-word reasoning per metric.

Metrics:
1. taskCompletion: Component type match (e.g., textarea vs button). Ignore attributes.
2. promptAlignment: Visible attributes match. IGNORE invisible constraints (handlers, validation). Deduct for missing/wrong text, styling, or icons.
3. imageCoherence: Visual stability (no clipping, overlap, broken layout).
4. hallucination: Score 1.0 if ONLY requested elements appear. Deduct for unrequested additions.`;

const EVALUATION_TOOL: Anthropic.Tool = {
  name: 'submit_evaluation',
  description: 'Submit the final evaluation metrics and summary for the UI.',
  input_schema: {
    type: 'object',
    properties: {
      metrics: {
        type: 'object',
        properties: {
          taskCompletion: {
            type: 'object',
            properties: { score: { type: 'number' }, reasoning: { type: 'string' } },
            required: ['score', 'reasoning'],
          },
          promptAlignment: {
            type: 'object',
            properties: { score: { type: 'number' }, reasoning: { type: 'string' } },
            required: ['score', 'reasoning'],
          },
          imageCoherence: {
            type: 'object',
            properties: { score: { type: 'number' }, reasoning: { type: 'string' } },
            required: ['score', 'reasoning'],
          },
          hallucination: {
            type: 'object',
            properties: { score: { type: 'number' }, reasoning: { type: 'string' } },
            required: ['score', 'reasoning'],
          },
        },
        required: ['taskCompletion', 'promptAlignment', 'imageCoherence', 'hallucination'],
      },
      summary: { type: 'string' },
    },
    required: ['metrics', 'summary'],
  },
};

function stripDataUrlPrefix(dataUrl: string): string {
  const comma = dataUrl.indexOf(',');
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

function buildErrorVerdict(msg: string): JudgeA2uiSpecVerdict {
  const zero: MetricScore = { score: 0, reasoning: msg };
  return {
    metrics: {
      taskCompletion: zero,
      promptAlignment: zero,
      imageCoherence: zero,
      hallucination: zero,
    },
    summary: msg,
    passed: false,
  };
}

export const judgeA2uiSpecCommand: BrowserCommand<
  [userPrompt: string, screenshotDataUrl: string],
  JudgeA2uiSpecResult
> = async (_context, userPrompt, screenshotDataUrl) => {
  const apiKey = process.env['ANTHROPIC_API_KEY']?.trim();
  if (!apiKey) return { skipped: true };

  try {
    const model = process.env['A2UI_JUDGE_MODEL']?.trim() || DEFAULT_MODEL;
    const client = new Anthropic({ apiKey });
    const rawBase64 = stripDataUrlPrefix(screenshotDataUrl);

    const response = await client.messages.create({
      model,
      max_tokens: 512,
      system: JUDGE_SYSTEM_PROMPT,
      tools: [EVALUATION_TOOL],
      tool_choice: { type: 'tool', name: 'submit_evaluation' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/png', data: rawBase64 },
            },
            { type: 'text', text: `User intent: ${userPrompt}` },
          ],
        },
      ],
    });

    const toolBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      return buildErrorVerdict('No tool_use block in Claude response');
    }

    const parsed = toolBlock.input as unknown as { metrics: Record<MetricName, MetricScore>; summary: string };

    return { metrics: parsed.metrics, summary: parsed.summary, passed: true };
  } catch (err) {
    return buildErrorVerdict(err instanceof Error ? err.message : String(err));
  }
};
