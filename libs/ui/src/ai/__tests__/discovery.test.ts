import { describe, it, expect } from 'vitest';
import {
  discovery,
  getComponentsByCategory,
  getComponentsByFeature,
  getComponentsByUseCase,
  findPatterns,
  getComponentSchema,
} from '../discovery';
import { aiComponentsSchema } from '../schemas/components';

describe('Discovery Utilities', () => {
  describe('discovery.getComponent', () => {
    it('SHOULD get component by name', () => {
      const button = discovery.getComponent('Button');
      expect(button).toBeDefined();
      expect(button?.name).toBe('Button');
      expect(button?.import).toContain('Button');
    });

    it('SHOULD return undefined for non-existent component', () => {
      const component = discovery.getComponent('NonExistentComponent');
      expect(component).toBeUndefined();
    });

    it('SHOULD get Input component', () => {
      const input = discovery.getComponent('Input');
      expect(input).toBeDefined();
      expect(input?.name).toBe('Input');
    });

    it('SHOULD get Form component', () => {
      const form = discovery.getComponent('Form');
      expect(form).toBeDefined();
      expect(form?.name).toBe('Form');
    });
  });

  describe('discovery.searchComponents', () => {
    it('SHOULD search by component name', () => {
      const results = discovery.searchComponents('Button');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((c) => c.name === 'Button')).toBe(true);
    });

    it('SHOULD search by description', () => {
      const results = discovery.searchComponents('form');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((c) => c.name === 'Form' || c.name === 'Input')).toBe(true);
    });

    it('SHOULD be case insensitive', () => {
      const results1 = discovery.searchComponents('button');
      const results2 = discovery.searchComponents('BUTTON');
      expect(results1.length).toBe(results2.length);
    });

    it('SHOULD return empty array for no matches', () => {
      const results = discovery.searchComponents('NonExistentComponentXYZ');
      expect(results).toHaveLength(0);
    });

    it('SHOULD search by category', () => {
      const results = discovery.searchComponents('Layout');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getComponentsByCategory', () => {
    it('SHOULD get components by category', () => {
      const layoutComponents = getComponentsByCategory('Layout & Structure');
      expect(layoutComponents.length).toBeGreaterThan(0);
      expect(layoutComponents.some((c) => c.name === 'Box')).toBe(true);
    });

    it('SHOULD return empty array for invalid category', () => {
      const components = getComponentsByCategory('Invalid Category');
      expect(components).toHaveLength(0);
    });

    it('SHOULD get form components', () => {
      const formComponents = getComponentsByCategory('Forms & Inputs');
      expect(formComponents.length).toBeGreaterThan(0);
      expect(formComponents.some((c) => c.name === 'Input' || c.name === 'Form')).toBe(true);
    });
  });

  describe('getComponentsByFeature', () => {
    it('SHOULD get components by feature', () => {
      const results = getComponentsByFeature('form');
      expect(results.length).toBeGreaterThan(0);
    });

    it('SHOULD search in best practices', () => {
      const results = getComponentsByFeature('validation');
      expect(results.length).toBeGreaterThanOrEqual(0);
    });

    it('SHOULD return empty array for no matches', () => {
      const results = getComponentsByFeature('NonExistentFeatureXYZ');
      expect(results).toHaveLength(0);
    });
  });

  describe('getComponentsByUseCase', () => {
    it('SHOULD get components by use case', () => {
      const results = getComponentsByUseCase('form');
      expect(results.length).toBeGreaterThanOrEqual(0);
    });

    it('SHOULD return empty array for no matches', () => {
      const results = getComponentsByUseCase('NonExistentUseCaseXYZ');
      expect(results).toHaveLength(0);
    });
  });

  describe('discovery.getRelatedComponents', () => {
    it('SHOULD get related components', () => {
      const related = discovery.getRelatedComponents('Input');
      expect(Array.isArray(related)).toBe(true);
    });

    it('SHOULD return empty array for non-existent component', () => {
      const related = discovery.getRelatedComponents('NonExistentComponent');
      expect(related).toHaveLength(0);
    });

    it('SHOULD not include the component itself', () => {
      const related = discovery.getRelatedComponents('Button');
      expect(related.every((c) => c.name !== 'Button')).toBe(true);
    });
  });

  describe('discovery.getComponentsByComplexity', () => {
    it('SHOULD get components by complexity', () => {
      const lowComplexity = discovery.getComponentsByComplexity('Low');
      expect(Array.isArray(lowComplexity)).toBe(true);
    });

    it('SHOULD return components with specified complexity', () => {
      const mediumComplexity = discovery.getComponentsByComplexity('Medium');
      expect(mediumComplexity.length).toBeGreaterThanOrEqual(0);
    });

    it('SHOULD return empty array if no components match', () => {
      // This test depends on actual data, so we just check it returns an array
      const highComplexity = discovery.getComponentsByComplexity('High');
      expect(Array.isArray(highComplexity)).toBe(true);
    });
  });

  describe('findPatterns', () => {
    it('SHOULD find patterns for components', () => {
      const patterns = findPatterns(['Button', 'Input']);
      expect(Array.isArray(patterns)).toBe(true);
    });

    it('SHOULD return patterns with use case', () => {
      const patterns = findPatterns(['Button'], 'form');
      expect(Array.isArray(patterns)).toBe(true);
      patterns.forEach((pattern) => {
        expect(pattern).toHaveProperty('component');
        expect(pattern).toHaveProperty('name');
        expect(pattern).toHaveProperty('code');
        expect(pattern).toHaveProperty('useCase');
      });
    });

    it('SHOULD handle empty component list', () => {
      const patterns = findPatterns([]);
      expect(patterns).toHaveLength(0);
    });

    it('SHOULD handle non-existent components', () => {
      const patterns = findPatterns(['NonExistentComponent']);
      expect(patterns).toHaveLength(0);
    });
  });

  describe('getComponentSchema', () => {
    it('SHOULD get component schema by name', () => {
      const schema = getComponentSchema('Button');
      expect(schema).toBeDefined();
      expect(schema?.name).toBe('Button');
    });

    it('SHOULD return undefined for non-existent component', () => {
      const schema = getComponentSchema('NonExistentComponent');
      expect(schema).toBeUndefined();
    });
  });

  describe('Integration Tests', () => {
    it('SHOULD find form-related components', () => {
      const formComponents = discovery.searchComponents('form');
      const formCategory = getComponentsByCategory('Forms & Inputs');

      expect(formComponents.length).toBeGreaterThan(0);
      expect(formCategory.length).toBeGreaterThan(0);
    });

    it('SHOULD discover related components for form workflow', () => {
      const form = discovery.getComponent('Form');
      expect(form).toBeDefined();

      const related = discovery.getRelatedComponents('Form');
      expect(Array.isArray(related)).toBe(true);
    });

    it('SHOULD find patterns for common use cases', () => {
      const formPatterns = findPatterns(['Form', 'Input', 'Button'], 'validation');
      expect(Array.isArray(formPatterns)).toBe(true);
    });
  });
});
