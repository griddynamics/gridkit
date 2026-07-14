import { aiComponentsSchema, type ComponentSchema } from './schemas/components';

/**
 * Discovery utilities for finding components by various criteria
 */
export const discovery = {
  /**
   * Get component by name
   */
  getComponent: (name: string): ComponentSchema | undefined => {
    return aiComponentsSchema.components.find((c) => c.name === name);
  },

  /**
   * Search components by query (searches name, description, category)
   */
  searchComponents: (query: string): ComponentSchema[] => {
    const lowerQuery = query.toLowerCase();
    return aiComponentsSchema.components.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        (c as any).category?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get related components (components mentioned in composition tips)
   */
  getRelatedComponents: (componentName: string): ComponentSchema[] => {
    const component = discovery.getComponent(componentName);
    if (!component) return [];

    const related: ComponentSchema[] = [];
    const componentSchema = component as any;

    // Find components mentioned in composition tips
    if (componentSchema.compositionTips) {
      componentSchema.compositionTips.forEach((tip: string) => {
        aiComponentsSchema.components.forEach((c) => {
          if (tip.includes(c.name) && c.name !== componentName) {
            if (!related.find((r) => r.name === c.name)) {
              related.push(c);
            }
          }
        });
      });
    }

    return related;
  },

  /**
   * Get components by complexity level
   */
  getComponentsByComplexity: (complexity: 'Low' | 'Medium' | 'High'): ComponentSchema[] => {
    return aiComponentsSchema.components.filter((c) => (c as any).complexity === complexity);
  },
};

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentSchema[] {
  return aiComponentsSchema.components.filter((c) => {
    const componentCategory = (c as any).category;
    // Handle both 'Forms & Input' and 'Forms & Inputs' for backward compatibility
    if (category === 'Forms & Inputs' && componentCategory === 'Forms & Input') {
      return true;
    }
    return componentCategory === category;
  });
}

/**
 * Get components by feature (searches description and best practices)
 */
export function getComponentsByFeature(feature: string): ComponentSchema[] {
  const lowerFeature = feature.toLowerCase();
  return aiComponentsSchema.components.filter((c) => {
    const schema = c as any;
    return (
      schema.description?.toLowerCase().includes(lowerFeature) ||
      schema.bestPractices?.some((bp: string) => bp.toLowerCase().includes(lowerFeature))
    );
  });
}

/**
 * Get components by use case (searches common patterns)
 */
export function getComponentsByUseCase(useCase: string): ComponentSchema[] {
  const lowerUseCase = useCase.toLowerCase();
  return aiComponentsSchema.components.filter((c) => {
    const schema = c as any;
    if (schema.commonPatterns) {
      return Object.values(schema.commonPatterns).some((pattern: any) =>
        pattern.useCase?.toLowerCase().includes(lowerUseCase)
      );
    }
    return false;
  });
}

/**
 * Find patterns for given components and optional use case
 */
export interface Pattern {
  component: string;
  name: string;
  code: string;
  useCase: string;
}

export function findPatterns(components: string[], useCase?: string): Pattern[] {
  const patterns: Pattern[] = [];

  components.forEach((componentName) => {
    const schema = discovery.getComponent(componentName);
    if (schema) {
      const componentSchema = schema as any;
      if (componentSchema.commonPatterns) {
        Object.entries(componentSchema.commonPatterns).forEach(([name, pattern]: [string, any]) => {
          if (!useCase || pattern.useCase?.toLowerCase().includes(useCase.toLowerCase())) {
            patterns.push({
              component: componentName,
              name,
              code: pattern.code || '',
              useCase: pattern.useCase || '',
            });
          }
        });
      }
    }
  });

  return patterns;
}

/**
 * Get component schema by name (helper function)
 */
export function getComponentSchema(name: string): ComponentSchema | undefined {
  return discovery.getComponent(name);
}
