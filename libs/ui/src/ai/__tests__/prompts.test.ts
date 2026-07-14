import { describe, it, expect } from 'vitest';
import {
  CLAUDE_GRIDKIT_SYSTEM_PROMPT,
  buildClaudeGridkitSystemPrompt,
  buildClaudeSystemPrompt,
  buildContextualPrompt,
  buildGPT4Prompt,
  buildGeminiPrompt,
  buildGDLibraryPrompt,
  defaultAIPromptIntro,
} from '../prompts';
import { aiComponentsSchema } from '../schemas/components';

describe('Prompt Generation', () => {
  describe('CLAUDE_GRIDKIT_SYSTEM_PROMPT', () => {
    it('SHOULD generate system prompt', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toBeTruthy();
      expect(typeof CLAUDE_GRIDKIT_SYSTEM_PROMPT).toBe('string');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT.length).toBeGreaterThan(0);
    });

    it('SHOULD include hard requirements', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Hard requirements');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('gd-design-library');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('TSX');
    });

    it('SHOULD include API constraints', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('API constraints');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('guardrails');
    });

    it('SHOULD include component catalog', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Available components');
      // Check that at least some components are mentioned
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Button');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Input');
    });

    it('SHOULD include composition tips', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Composition tips');
    });

    it('SHOULD include guardrails', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Icon');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('ONLY use');
    });

    it('SHOULD include image sourcing guidance', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('omit the image instead of guessing');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('any public CDN');
    });
  });

  describe('buildClaudeGridkitSystemPrompt', () => {
    it('SHOULD accept imageSources as string or array', () => {
      const promptWithString = buildClaudeGridkitSystemPrompt({ imageSources: 'cdn.example.com' });
      const promptWithArray = buildClaudeGridkitSystemPrompt({
        imageSources: ['cdn.example.com', 'images.example.com'],
      });

      expect(promptWithString).toContain('cdn.example.com');
      expect(promptWithArray).toContain('cdn.example.com, images.example.com');
    });
  });

  describe('buildClaudeSystemPrompt', () => {
    it('SHOULD build prompt with user request', () => {
      const request = 'Create a sign-in form';
      const prompt = buildClaudeSystemPrompt(request);

      expect(prompt).toContain(CLAUDE_GRIDKIT_SYSTEM_PROMPT);
      expect(prompt).toContain('Task:');
      expect(prompt).toContain(request);
    });

    it('SHOULD handle empty request', () => {
      const prompt = buildClaudeSystemPrompt('');
      expect(prompt).toContain(CLAUDE_GRIDKIT_SYSTEM_PROMPT);
      expect(prompt).toContain('Task:');
    });

    it('SHOULD handle complex requests', () => {
      const request = 'Create a form with email, password, and confirm password fields with validation';
      const prompt = buildClaudeSystemPrompt(request);

      expect(prompt).toContain(request);
      expect(prompt.length).toBeGreaterThan(CLAUDE_GRIDKIT_SYSTEM_PROMPT.length);
    });
  });

  describe('buildContextualPrompt', () => {
    it('SHOULD build contextual prompt with components', () => {
      const request = 'Create a form';
      const prompt = buildContextualPrompt(request, {
        components: ['Form', 'Input', 'Button'],
      });

      expect(prompt).toContain(CLAUDE_GRIDKIT_SYSTEM_PROMPT);
      expect(prompt).toContain('Detailed Component Documentation');
      expect(prompt).toContain('## Form');
      expect(prompt).toContain('## Input');
      expect(prompt).toContain('## Button');
    });

    it('SHOULD include component props in contextual prompt', () => {
      const prompt = buildContextualPrompt('Create a button', {
        components: ['Button'],
      });

      expect(prompt).toContain('Props:');
      expect(prompt).toContain('variant');
    });

    it('SHOULD include examples in contextual prompt', () => {
      const prompt = buildContextualPrompt('Create a button', {
        components: ['Button'],
      });

      expect(prompt).toContain('Examples:');
      expect(prompt).toContain('Quick Start:');
    });

    it('SHOULD work without context', () => {
      const request = 'Create a form';
      const prompt = buildContextualPrompt(request);

      expect(prompt).toBe(buildClaudeSystemPrompt(request));
    });

    it('SHOULD handle non-existent components gracefully', () => {
      const prompt = buildContextualPrompt('Create a form', {
        components: ['NonExistentComponent'],
      });

      expect(prompt).toBe(buildClaudeSystemPrompt('Create a form'));
    });
  });

  describe('buildGPT4Prompt', () => {
    it('SHOULD build GPT-4 format prompt', () => {
      const request = 'Create a form';
      const messages = buildGPT4Prompt(request);

      expect(Array.isArray(messages)).toBe(true);
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
      expect(messages[0].content).toContain(CLAUDE_GRIDKIT_SYSTEM_PROMPT);
      expect(messages[1].content).toBe(request);
    });

    it('SHOULD have correct message structure', () => {
      const messages = buildGPT4Prompt('Test');
      expect(messages[0]).toHaveProperty('role');
      expect(messages[0]).toHaveProperty('content');
      expect(messages[1]).toHaveProperty('role');
      expect(messages[1]).toHaveProperty('content');
    });
  });

  describe('buildGeminiPrompt', () => {
    it('SHOULD build Gemini format prompt', () => {
      const request = 'Create a form';
      const prompt = buildGeminiPrompt(request);

      expect(prompt).toHaveProperty('contents');
      expect(prompt).toHaveProperty('generationConfig');
      expect(Array.isArray(prompt.contents)).toBe(true);
      expect(prompt.contents[0]).toHaveProperty('parts');
      expect(Array.isArray(prompt.contents[0].parts)).toBe(true);
    });

    it('SHOULD include system prompt in text', () => {
      const request = 'Create a form';
      const prompt = buildGeminiPrompt(request);

      const text = prompt.contents[0].parts[0].text;
      expect(text).toContain(CLAUDE_GRIDKIT_SYSTEM_PROMPT);
      expect(text).toContain('Task:');
      expect(text).toContain(request);
    });

    it('SHOULD have generation config', () => {
      const prompt = buildGeminiPrompt('Test');
      expect(prompt.generationConfig).toHaveProperty('temperature');
      expect(prompt.generationConfig).toHaveProperty('topK');
      expect(prompt.generationConfig).toHaveProperty('topP');
      expect(prompt.generationConfig.temperature).toBe(0.7);
      expect(prompt.generationConfig.topK).toBe(40);
      expect(prompt.generationConfig.topP).toBe(0.95);
    });
  });

  describe('buildGDLibraryPrompt', () => {
    it('SHOULD be same as buildClaudeSystemPrompt', () => {
      const request = 'Create a form';
      const prompt1 = buildGDLibraryPrompt(request);
      const prompt2 = buildClaudeSystemPrompt(request);

      expect(prompt1).toBe(prompt2);
    });
  });

  describe('Guardrail Extraction', () => {
    it('SHOULD extract guardrails from schemas', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Icon');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('ONLY use');
    });

    it('SHOULD include component-specific guardrails', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('Row/Column');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('isWrap');
    });

    it('SHOULD include caption nesting guardrails for Typography', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('variant="caption" renders a real <caption> element');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('always set as="div"');
    });

    it('SHOULD include theme color token guardrails for targeted components', () => {
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('prefer theme color token paths');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('icon.primary');
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain('text.secondary');
    });
  });

  describe('Component Count', () => {
    it('SHOULD mention correct component count', () => {
      const componentCount = aiComponentsSchema.components.length;
      expect(CLAUDE_GRIDKIT_SYSTEM_PROMPT).toContain(componentCount.toString());
    });
  });

  describe('defaultAIPromptIntro', () => {
    it('SHOULD include image host guidance', () => {
      expect(defaultAIPromptIntro).toContain('remote images');
      expect(defaultAIPromptIntro).toContain('any public CDN');
    });
  });
});
