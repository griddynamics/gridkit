import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { aiComponentsSchema, type ComponentSchema } from '../schemas/components';
import { componentIndex } from '../schemas/index';

function readPublicComponentExports() {
  const barrels = [
    '../../components/atoms/index.ts',
    '../../components/molecules/index.ts',
    '../../components/organisms/index.ts',
    '../../components/layout/index.ts',
    '../../components/widget/index.ts',
  ] as const;

  return barrels
    .flatMap((barrel) =>
      Array.from(
        readFileSync(new URL(barrel, import.meta.url), 'utf8').matchAll(/export \* from '\.\/(.+)'/g),
        (match) => match[1]
      )
    )
    .filter((name) => name !== 'types/index.types')
    .sort();
}

describe('Component Schemas', () => {
  describe('Schema Registry', () => {
    it('SHOULD have components', () => {
      expect(aiComponentsSchema.components.length).toBeGreaterThan(0);
    });

    it('SHOULD have composition tips', () => {
      expect(aiComponentsSchema.compositionTips.length).toBeGreaterThan(0);
    });

    it('SHOULD have version', () => {
      expect(aiComponentsSchema.version).toBeTruthy();
      expect(typeof aiComponentsSchema.version).toBe('string');
    });

    it('SHOULD have Button component', () => {
      const button = aiComponentsSchema.components.find((c) => c.name === 'Button');
      expect(button).toBeDefined();
      expect(button?.import).toContain('Button');
    });

    it('SHOULD have Input component', () => {
      const input = aiComponentsSchema.components.find((c) => c.name === 'Input');
      expect(input).toBeDefined();
      expect(input?.import).toContain('Input');
    });

    it('SHOULD have Form component', () => {
      const form = aiComponentsSchema.components.find((c) => c.name === 'Form');
      expect(form).toBeDefined();
      expect(form?.import).toContain('Form');
    });
  });

  describe('Component Schema Structure', () => {
    it('SHOULD have required fields for all components', () => {
      aiComponentsSchema.components.forEach((component) => {
        expect(component.name).toBeTruthy();
        expect(component.import).toBeTruthy();
        expect(component.description).toBeTruthy();
        expect(Array.isArray(component.props)).toBe(true);
      });
    });

    it('SHOULD have valid import statements', () => {
      aiComponentsSchema.components.forEach((component) => {
        expect(component.import).toContain("from 'gd-design-library'");
        expect(component.import).toContain('import');
        expect(component.import).toContain(component.name);
      });
    });

    it('SHOULD have props with required fields', () => {
      aiComponentsSchema.components.forEach((component) => {
        component.props.forEach((prop) => {
          expect(prop.name).toBeTruthy();
          expect(prop.type).toBeTruthy();
        });
      });
    });

    it('SHOULD prefer theme token guidance for targeted color props', () => {
      const expectations = [
        ['Icon', 'fill'],
        ['Icon', 'fillSvg'],
        ['Typography', 'color'],
        ['Avatar', 'badgeColor'],
        ['Avatar', 'backgroundColor'],
        ['Separator', 'color'],
        ['Separator', 'labelColor'],
        ['Header', 'bgColor'],
        ['ProgressBar', 'fillColor'],
        ['ProgressBar', 'backgroundColor'],
        ['Chart', 'series'],
        ['Chart', 'colors'],
        ['RadioGroup', 'options'],
        ['AvatarUser', 'badgeColor'],
      ] as const;

      expectations.forEach(([componentName, propName]) => {
        const component = aiComponentsSchema.components.find((item) => item.name === componentName);
        const prop = component?.props.find((item) => item.name === propName);

        expect(prop?.description).toContain('Prefer theme');
      });
    });
  });

  describe('Component Metadata', () => {
    it('SHOULD have metadata for Button', () => {
      const button = aiComponentsSchema.components.find((c) => c.name === 'Button') as any;
      if (button) {
        expect(button.category).toBeTruthy();
        expect(button.complexity).toBeTruthy();
        expect(['Low', 'Medium', 'High']).toContain(button.complexity);
      }
    });

    it('SHOULD have examples for components', () => {
      const componentsWithExamples = aiComponentsSchema.components.filter((c) => {
        const schema = c as any;
        return schema.examples && schema.examples.length > 0;
      });
      expect(componentsWithExamples.length).toBeGreaterThan(0);
    });
  });

  describe('Schema Index', () => {
    it('SHOULD have component index', () => {
      expect(componentIndex).toBeDefined();
      expect(componentIndex.byCategory).toBeDefined();
      expect(componentIndex.byComplexity).toBeDefined();
      expect(componentIndex.byFeature).toBeDefined();
    });

    it('SHOULD have categories', () => {
      const categories = Object.keys(componentIndex.byCategory);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('SHOULD have complexity levels', () => {
      expect(componentIndex.byComplexity.Low).toBeDefined();
      expect(componentIndex.byComplexity.Medium).toBeDefined();
      expect(componentIndex.byComplexity.High).toBeDefined();
    });

    it('SHOULD have features', () => {
      const features = Object.keys(componentIndex.byFeature);
      expect(features.length).toBeGreaterThan(0);
    });

    it('SHOULD have components in categories', () => {
      const layoutComponents = componentIndex.byCategory['Layout & Structure'];
      expect(Array.isArray(layoutComponents)).toBe(true);
      expect(layoutComponents.length).toBeGreaterThan(0);
    });

    it('SHOULD have components in complexity levels', () => {
      const lowComponents = componentIndex.byComplexity.Low;
      expect(Array.isArray(lowComponents)).toBe(true);
    });

    it('SHOULD have components in features', () => {
      const formControls = componentIndex.byFeature['Form Controls'];
      expect(Array.isArray(formControls)).toBe(true);
      expect(formControls.length).toBeGreaterThan(0);
    });
  });

  describe('Composition Tips', () => {
    it('SHOULD have composition tips', () => {
      expect(aiComponentsSchema.compositionTips.length).toBeGreaterThan(0);
    });

    it('SHOULD have tips for Button', () => {
      const buttonTips = aiComponentsSchema.compositionTips.filter((tip) => tip.includes('Button'));
      expect(buttonTips.length).toBeGreaterThan(0);
    });

    it('SHOULD have tips for Form', () => {
      const formTips = aiComponentsSchema.compositionTips.filter((tip) => tip.includes('Form'));
      expect(formTips.length).toBeGreaterThan(0);
    });
  });

  describe('Unique Component Names', () => {
    it('SHOULD have unique component names', () => {
      const names = aiComponentsSchema.components.map((c) => c.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });
  });

  describe('Component Count', () => {
    it('SHOULD have reasonable number of components', () => {
      expect(aiComponentsSchema.components.length).toBeGreaterThanOrEqual(40);
      expect(aiComponentsSchema.components.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Public Export Coverage', () => {
    it('SHOULD cover all public GridKit component exports in the AI schema registry', () => {
      const exportedComponentNames = readPublicComponentExports();
      const schemaNames = new Set(aiComponentsSchema.components.map((component) => component.name));

      const missing = exportedComponentNames.filter((name) => !schemaNames.has(name));

      expect(missing).toEqual([]);
    });
  });
});
