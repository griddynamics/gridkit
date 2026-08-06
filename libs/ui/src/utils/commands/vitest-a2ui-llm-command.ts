/**
 * Vitest browser command (runs on Node): fetch A2UI JSON from OpenAI (ChatGPT).
 * Requires OPENAI_API_KEY; optional A2UI_LLM_MODEL.
 */
import type { BrowserCommand } from 'vitest/node';
import OpenAI from 'openai';
import { buildA2UISystemPrompt } from '../../ai';

const AGENT_ID = 'a2ui-agent';
const AGENT_NAME = 'Grid Dynamics Assistant';

const DEFAULT_MODEL = 'gpt-4o-mini';

export type FetchA2uiSpecResult = { spec: unknown };

function getModelId(): string {
  return process.env['A2UI_LLM_MODEL']?.trim() || DEFAULT_MODEL;
}

export const fetchA2uiSpecCommand: BrowserCommand<[userPrompt: string], FetchA2uiSpecResult> = async (
  _context,
  userPrompt
) => {
  const apiKey = process.env['OPENAI_API_KEY']?.trim();

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to the workspace root .env or export it before running test-a2ui-integration.'
    );
  }

  const model = getModelId();
  const client = new OpenAI({ apiKey });

  const systemPrompt = buildA2UISystemPrompt({ agentId: AGENT_ID, agentName: AGENT_NAME });

  const response = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('No text content in OpenAI response');
  }

  let spec: unknown;

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
