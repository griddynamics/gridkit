/**
 * Vitest browser command (runs on Node): fetch A2UI JSON from Anthropic Claude.
 * Requires ANTHROPIC_API_KEY; optional A2UI_LLM_MODEL.
 */
import type { BrowserCommand } from 'vitest/node';
import Anthropic from '@anthropic-ai/sdk';
import { buildA2UISystemPrompt } from '../../ai';

const AGENT_ID = 'a2ui-agent';
const AGENT_NAME = 'Grid Dynamics Assistant';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export type FetchA2uiSpecResult = { spec: unknown };

function getModelId(): string {
  return process.env['A2UI_LLM_MODEL']?.trim() || DEFAULT_MODEL;
}

export const fetchA2uiSpecCommand: BrowserCommand<[userPrompt: string], FetchA2uiSpecResult> = async (
  _context,
  userPrompt
) => {
  const apiKey = process.env['ANTHROPIC_API_KEY']?.trim();

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to the workspace root .env or export it before running test-a2ui-integration.'
    );
  }

  const model = getModelId();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildA2UISystemPrompt({ agentId: AGENT_ID, agentName: AGENT_NAME });

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text block in Anthropic response');
  }

  let spec: unknown;
  const text = textBlock.text;

  // 1. Try to extract from a code fence (handles preamble + ```json ... ```)
  const codeFenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = codeFenceMatch ? codeFenceMatch[1].trim() : text.trim();

  try {
    spec = JSON.parse(candidate) as unknown;
  } catch {
    // 2. Fallback: find first { … last } to survive preamble/postamble text
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        spec = JSON.parse(candidate.slice(start, end + 1)) as unknown;
      } catch {
        throw new Error('LLM response was not valid JSON');
      }
    } else {
      throw new Error('LLM response was not valid JSON');
    }
  }

  return { spec };
};
