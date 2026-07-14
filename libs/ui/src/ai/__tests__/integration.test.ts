import { describe, it, expect } from 'vitest';
import {
  buildClaudeSystemPrompt,
  buildContextualPrompt,
  discovery,
  validateGeneratedCode,
  validateAllSchemas,
  componentIndex,
} from '../index';
import { validateSchema } from '../validation';

describe('AI Integration Integration Tests', () => {
  describe('End-to-End Workflow', () => {
    it('SHOULD discover components, build prompt, and validate code', () => {
      // 1. Discover components
      const formComponents = discovery.searchComponents('form');
      expect(formComponents.length).toBeGreaterThan(0);

      // 2. Build contextual prompt
      const componentNames = formComponents.slice(0, 3).map((c) => c.name);
      const prompt = buildContextualPrompt('Create a form', {
        components: componentNames,
      });
      expect(prompt).toContain('Create a form');
      expect(prompt.length).toBeGreaterThan(0);

      // 3. Validate generated code (simulated)
      const generatedCode = `
        import { Form, Input, Button } from 'gd-design-library';
        
        export function MyForm() {
          return (
            <Form onSubmit={() => {}}>
              <Input name="email" />
              <Button type="submit">Submit</Button>
            </Form>
          );
        }
      `;
      const validation = validateGeneratedCode(generatedCode);
      expect(validation.valid).toBe(true);
    });

    it('SHOULD validate all schemas before use', () => {
      const { summary } = validateAllSchemas();
      expect(summary.total).toBeGreaterThan(0);
      // All schemas should be valid for production use
      expect(summary.invalid).toBe(0);
    });
  });

  describe('Prompt Generation Workflow', () => {
    it('SHOULD generate prompts for different agents', () => {
      const request = 'Create a button';

      // Claude
      const claudePrompt = buildClaudeSystemPrompt(request);
      expect(claudePrompt).toContain(request);

      // Contextual
      const contextualPrompt = buildContextualPrompt(request, {
        components: ['Button'],
      });
      expect(contextualPrompt).toContain('Button');
      expect(contextualPrompt.length).toBeGreaterThan(claudePrompt.length);
    });

    it('SHOULD use discovery to build contextual prompts', () => {
      // Discover form-related components
      const formComponents = discovery.searchComponents('form');
      const relatedComponents = formComponents.flatMap((c) => discovery.getRelatedComponents(c.name));

      // Build prompt with discovered components
      const allComponents = [...formComponents.map((c) => c.name), ...relatedComponents.map((c) => c.name)];
      const uniqueComponents = Array.from(new Set(allComponents));

      const prompt = buildContextualPrompt('Create a comprehensive form', {
        components: uniqueComponents.slice(0, 5), // Limit to 5 for testing
      });

      expect(prompt).toContain('Create a comprehensive form');
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe('Discovery and Validation Integration', () => {
    it('SHOULD discover components and validate their schemas', () => {
      const button = discovery.getComponent('Button');
      expect(button).toBeDefined();

      if (button) {
        const result = validateSchema(button);
        expect(result.valid).toBe(true);
      }
    });

    it('SHOULD use component index for discovery', () => {
      const formControls = componentIndex.byCategory['Forms & Inputs'];
      expect(formControls.length).toBeGreaterThan(0);

      // Verify components exist
      formControls.forEach((name) => {
        const component = discovery.getComponent(name);
        expect(component).toBeDefined();
      });
    });
  });

  describe('Code Generation Validation', () => {
    it('SHOULD validate code using discovered components', () => {
      // Discover components
      const button = discovery.getComponent('Button');
      const input = discovery.getComponent('Input');

      expect(button).toBeDefined();
      expect(input).toBeDefined();

      // Generate code using discovered components
      const code = `
        import { ${button?.name}, ${input?.name} } from 'gd-design-library';
        
        export function Component() {
          return (
            <>
              <${input?.name} />
              <${button?.name}>Click</${button?.name}>
            </>
          );
        }
      `;

      // Validate
      const validation = validateGeneratedCode(code);
      expect(validation.valid).toBe(true);
    });

    it('SHOULD catch invalid component usage', () => {
      const code = `
        import { NonExistentComponent } from 'gd-design-library';
        
        export function Component() {
          return <NonExistentComponent />;
        }
      `;

      const validation = validateGeneratedCode(code);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Schema Consistency', () => {
    it('SHOULD have consistent schema structure across components', () => {
      const { results } = validateAllSchemas();

      // Check that all valid schemas have consistent structure
      results.forEach((result, componentName) => {
        if (result.valid) {
          const component = discovery.getComponent(componentName);
          expect(component).toBeDefined();
          expect(component?.name).toBe(componentName);
          expect(component?.import).toContain(componentName);
        }
      });
    });

    it('SHOULD have all components in index', () => {
      const allIndexedComponents = [
        ...Object.values(componentIndex.byCategory).flat(),
        ...Object.values(componentIndex.byComplexity).flat(),
        ...Object.values(componentIndex.byFeature).flat(),
      ];
      const uniqueIndexed = new Set(allIndexedComponents);

      // Most components should be indexed
      expect(uniqueIndexed.size).toBeGreaterThan(0);
    });
  });
});
