import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  validateSchema,
  validateAllSchemas,
  validateGeneratedCode,
  extractImports,
  extractComponents,
} from '../validation';
import { aiComponentsSchema, type ComponentSchema } from '../schemas/components';
import { A2UI_COMPONENT_TYPES } from '../a2ui/component-map';

const currentDir = dirname(fileURLToPath(import.meta.url));
const a2uiJsonSchema = JSON.parse(
  readFileSync(resolve(currentDir, '../a2ui/ui-specification-schema.json'), 'utf8')
) as {
  definitions: {
    Component: {
      properties: Record<string, unknown> & {
        type: {
          enum: string[];
        };
        actions: {
          items: {
            type: string;
          };
        };
      };
    };
  };
};

describe('Schema Validation', () => {
  describe('validateSchema', () => {
    it('SHOULD validate a complete schema', () => {
      const validSchema: ComponentSchema = {
        name: 'TestComponent',
        import: "import { TestComponent } from 'gd-design-library'",
        description: 'Test component description',
        props: [
          {
            name: 'prop1',
            type: 'string',
            description: 'Test prop',
          },
        ],
      };

      const result = validateSchema(validSchema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('SHOULD detect missing required fields', () => {
      const invalidSchema = {
        name: 'TestComponent',
        // Missing import and description
        props: [],
      } as ComponentSchema;

      const result = validateSchema(invalidSchema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing import');
      expect(result.errors).toContain('Missing description');
    });

    it('SHOULD detect invalid props', () => {
      const invalidSchema: ComponentSchema = {
        name: 'TestComponent',
        import: "import { TestComponent } from 'gd-design-library'",
        description: 'Test component',
        props: [
          {
            name: '',
            type: 'string',
            description: 'Test',
          } as any,
        ],
      };

      const result = validateSchema(invalidSchema);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Missing name'))).toBe(true);
    });

    it('SHOULD warn about missing examples', () => {
      const schema: ComponentSchema = {
        name: 'TestComponent',
        import: "import { TestComponent } from 'gd-design-library'",
        description: 'Test component',
        props: [],
        examples: [],
      };

      const result = validateSchema(schema);
      expect(result.warnings).toContain('Should have at least 3 examples');
    });

    it('SHOULD validate schema with metadata', () => {
      const schema: ComponentSchema = {
        name: 'TestComponent',
        import: "import { TestComponent } from 'gd-design-library'",
        description: 'Test component',
        props: [],
      };

      const schemaAny = schema as any;
      schemaAny.category = 'Test';
      schemaAny.complexity = 'Low';
      schemaAny.accessibility = 'WCAG 2.1 AA';
      schemaAny.examples = ['example1', 'example2', 'example3'];
      schemaAny.bestPractices = ['practice1', 'practice2', 'practice3', 'practice4', 'practice5'];
      schemaAny.quickStart = {
        basic: 'example',
        variant1: 'example',
        variant2: 'example',
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
    });

    it('SHOULD reject reserved A2UI prop names', () => {
      const schema: ComponentSchema = {
        name: 'BadA2UIButton',
        import: "import { Button } from 'gd-design-library'",
        description: 'Invalid A2UI schema using a reserved prop name',
        a2uiName: 'button',
        props: [
          {
            name: 'type',
            type: 'string',
            description: 'Incorrectly reuses the reserved A2UI component type field',
          },
        ],
      };

      const result = validateSchema(schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('A2UI prop "type" is reserved. Use a dedicated field name instead.');
    });

    it('SHOULD keep aligned atom schemas free of A2UI compatibility warnings', () => {
      const atomNames = [
        'Button',
        'Icon',
        'Label',
        'Link',
        'Loader',
        'Skeleton',
        'Slider',
        'SliderDots',
        'Typography',
        'Wrapper',
      ];

      atomNames.forEach((name) => {
        const schema = aiComponentsSchema.components.find((component) => component.name === name);

        expect(schema, `${name} schema should exist`).toBeDefined();

        if (!schema) {
          return;
        }

        const compatibilityWarnings = validateSchema(schema).warnings.filter((warning) =>
          warning.startsWith('A2UI prop')
        );

        expect(compatibilityWarnings, `${name} should not emit A2UI prop warnings`).toEqual([]);
      });
    });

    it('SHOULD keep layout schemas free of A2UI compatibility warnings', () => {
      const layoutNames = ['FlexContainer', 'Column', 'Row', 'Scroll', 'ChatContainer', 'Portal'];

      layoutNames.forEach((name) => {
        const schema = aiComponentsSchema.components.find((component) => component.name === name);

        expect(schema, `${name} schema should exist`).toBeDefined();

        if (!schema) {
          return;
        }

        const compatibilityWarnings = validateSchema(schema).warnings.filter(
          (warning) => warning.startsWith('A2UI prop') || warning.includes('non-JSON-safe')
        );

        expect(compatibilityWarnings, `${name} should not emit A2UI compatibility warnings`).toEqual([]);
      });
    });

    it('SHOULD keep molecule schemas free of A2UI compatibility warnings', () => {
      const moleculeNames = [
        'Accordion',
        'AvatarUser',
        'Breadcrumbs',
        'Counter',
        'Dropdown',
        'DropdownItem',
        'Form',
        'InlineNotification',
        'List',
        'Menu',
        'Price',
        'ProgressBar',
        'RadioGroup',
        'Rating',
        'Snackbar',
        'Stepper',
        'Table',
        'Tabs',
        'Tooltip',
      ];

      moleculeNames.forEach((name) => {
        const schema = aiComponentsSchema.components.find((component) => component.name === name);

        expect(schema, `${name} schema should exist`).toBeDefined();

        if (!schema) {
          return;
        }

        const compatibilityWarnings = validateSchema(schema).warnings.filter(
          (warning) => warning.startsWith('A2UI prop') || warning.includes('non-JSON-safe')
        );

        expect(compatibilityWarnings, `${name} should not emit A2UI compatibility warnings`).toEqual([]);
      });
    });
  });

  describe('validateAllSchemas', () => {
    it('SHOULD validate all component schemas', () => {
      const { results, summary } = validateAllSchemas();

      expect(summary.total).toBeGreaterThan(0);
      expect(results.size).toBe(summary.total);
      expect(summary.valid).toBeGreaterThanOrEqual(0);
      expect(summary.invalid).toBeGreaterThanOrEqual(0);
    });

    it('SHOULD provide summary statistics', () => {
      const { summary } = validateAllSchemas();

      expect(summary.total).toBe(aiComponentsSchema.components.length);
      expect(summary.valid + summary.invalid).toBe(summary.total);
      expect(typeof summary.totalErrors).toBe('number');
      expect(typeof summary.totalWarnings).toBe('number');
    });

    it('SHOULD validate Button schema', () => {
      const { results } = validateAllSchemas();
      const buttonResult = results.get('Button');

      expect(buttonResult).toBeDefined();
      if (buttonResult) {
        expect(buttonResult.valid).toBe(true);
      }
    });

    it('SHOULD keep DragAndDrop A2UI props JSON-safe and declared in the shared schema', () => {
      const { results } = validateAllSchemas();
      const dragAndDropResult = results.get('DragAndDrop');
      const disallowedWarningFragments = [
        'A2UI prop "inputFileButtonLabel" is not declared',
        'A2UI prop "acceptedFileTypes" is not declared',
        'A2UI prop "maxFileSize" is not declared',
        'A2UI prop "maxFiles" is not declared',
        'A2UI prop "files" is not declared',
        'A2UI prop "errors" is not declared',
        'A2UI prop "loadingOverlay" is not declared',
        'A2UI prop "dragOverContent" is not declared',
        'non-JSON-safe type',
      ];

      expect(dragAndDropResult).toBeDefined();
      if (dragAndDropResult) {
        disallowedWarningFragments.forEach((fragment) => {
          expect(dragAndDropResult.warnings.some((warning) => warning.includes(fragment))).toBe(false);
        });
      }
    });

    it('SHOULD keep every organism schema A2UI-safe and prompt-ready', () => {
      const organismNames = [
        'Card',
        'Carousel',
        'Chart',
        'ChatBubble',
        'ContentCarousel',
        'DragAndDropFiles',
        'Header',
        'ImagePreview',
        'InputArea',
        'Modal',
        'Search',
        'SearchModal',
        'Sidebar',
      ] as const;

      const { results } = validateAllSchemas();

      organismNames.forEach((name) => {
        const schema = aiComponentsSchema.components.find((component) => component.name === name);
        const result = results.get(name);

        expect(schema?.a2uiName, `${name} should be exposed to A2UI`).toBeTruthy();
        expect(result?.errors, `${name} should not have schema errors`).toEqual([]);
        expect(
          result?.warnings.filter((warning) => warning.startsWith('A2UI prop')),
          `${name} should not emit A2UI prop compatibility warnings`
        ).toEqual([]);
      });
    });

    it('SHOULD keep molecule-facing static JSON schema fields aligned with the A2UI contract', () => {
      const moleculeTypes = [
        'accordion',
        'accordion-item',
        'accordion-header',
        'accordion-content',
        'avatar-user',
        'breadcrumbs',
        'counter',
        'dropdown',
        'dropdown-item',
        'form',
        'inline-notification',
        'list',
        'menu',
        'price',
        'progress-bar',
        'radio-group',
        'rating',
        'snackbar',
        'stepper',
        'table',
        'tabs',
        'tooltip',
      ];
      const moleculePropKeys = [
        'subtitle',
        'initial',
        'content',
        'placement',
        'delay',
        'bordered',
        'allowMultipleExpand',
        'withoutSeparator',
        'isInline',
        'defaultValue',
        'separator',
        'separatorIcon',
        'separatorAfterLastItem',
        'min',
        'max',
        'currentValue',
        'oldValue',
        'currencySymbol',
        'currencySymbolPosition',
        'showPercentage',
        'fillColor',
        'closeOnSelect',
        'offsetX',
        'offsetY',
        'gridColumns',
        'gridRows',
        'gridColumnGutter',
        'gridRowGutter',
        'wrapItems',
        'itemWidth',
        'itemHeight',
        'isIconsView',
        'duration',
        'dismissOnClick',
        'colored',
        'isAnimated',
        'stickyHeader',
        'stickyFooter',
        'stickyPagination',
        'pagination',
        'pageSize',
        'pageSizes',
        'virtualized',
        'rowHeight',
        'minVisibleRange',
      ];

      expect(A2UI_COMPONENT_TYPES).toEqual(expect.arrayContaining(moleculeTypes));
      expect(a2uiJsonSchema.definitions.Component.properties.type.enum).toEqual(expect.arrayContaining(moleculeTypes));
      moleculePropKeys.forEach((key) => {
        expect(a2uiJsonSchema.definitions.Component.properties, `JSON schema should expose ${key}`).toHaveProperty(key);
      });
      expect(a2uiJsonSchema.definitions.Component.properties.actions).toMatchObject({
        items: { type: 'string' },
      });
    });
  });
});

describe('Code Validation', () => {
  describe('extractImports', () => {
    it('SHOULD extract import statements', () => {
      const code = `
        import { Button } from 'gd-design-library';
        import { useState } from 'react';
        import { Form, Input } from 'gd-design-library';
      `;

      const imports = extractImports(code);
      expect(imports).toContain('gd-design-library');
      expect(imports).toContain('react');
      expect(imports.length).toBe(2);
    });

    it('SHOULD handle single quotes', () => {
      const code = "import { Button } from 'gd-design-library';";
      const imports = extractImports(code);
      expect(imports).toContain('gd-design-library');
    });

    it('SHOULD handle double quotes', () => {
      const code = 'import { Button } from "gd-design-library";';
      const imports = extractImports(code);
      expect(imports).toContain('gd-design-library');
    });

    it('SHOULD return empty array for no imports', () => {
      const code = 'const x = 1;';
      const imports = extractImports(code);
      expect(imports).toHaveLength(0);
    });
  });

  describe('extractComponents', () => {
    it('SHOULD extract component names from JSX', () => {
      const code = `
        <Button>Click me</Button>
        <Input value="test" />
        <Form onSubmit={handleSubmit}>
          <div>Test</div>
        </Form>
      `;

      const components = extractComponents(code);
      expect(components).toContain('Button');
      expect(components).toContain('Input');
      expect(components).toContain('Form');
      expect(components).not.toContain('div'); // Should filter HTML elements
    });

    it('SHOULD filter out HTML elements', () => {
      const code = `
        <div>Test</div>
        <span>Test</span>
        <Button>Test</Button>
      `;

      const components = extractComponents(code);
      expect(components).toContain('Button');
      expect(components).not.toContain('div');
      expect(components).not.toContain('span');
    });

    it('SHOULD handle self-closing tags', () => {
      const code = '<Button />';
      const components = extractComponents(code);
      expect(components).toContain('Button');
    });

    it('SHOULD return empty array for no components', () => {
      const code = '<div>Test</div>';
      const components = extractComponents(code);
      expect(components).toHaveLength(0);
    });
  });

  describe('validateGeneratedCode', () => {
    it('SHOULD validate code with correct imports', () => {
      const code = `
        import { Button } from 'gd-design-library';
        
        export function MyButton() {
          return <Button variant="primary">Click me</Button>;
        }
      `;

      const result = validateGeneratedCode(code);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('SHOULD detect invalid imports', () => {
      const code = `
        import { Button } from '@mui/material';
        import { Input } from 'gd-design-library';
      `;

      const result = validateGeneratedCode(code);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid imports'))).toBe(true);
    });

    it('SHOULD validate component usage', () => {
      const code = `
        import { Button, Input } from 'gd-design-library';
        
        export function Form() {
          return (
            <>
              <Button>Click</Button>
              <Input />
            </>
          );
        }
      `;

      const result = validateGeneratedCode(code);
      expect(result.valid).toBe(true);
    });

    it('SHOULD warn about raw HTML elements', () => {
      const code = `
        import { Button } from 'gd-design-library';
        
        export function Component() {
          return (
            <div>
              <Button>Click</Button>
            </div>
          );
        }
      `;

      const result = validateGeneratedCode(code);
      expect(result.warnings.some((w) => w.includes('raw HTML'))).toBe(true);
    });

    it('SHOULD allow React imports', () => {
      const code = `
        import React from 'react';
        import { Button } from 'gd-design-library';
        
        export function Component() {
          return <Button>Click</Button>;
        }
      `;

      const result = validateGeneratedCode(code);
      expect(result.valid).toBe(true);
    });

    it('SHOULD handle components not in library', () => {
      const code = `
        import { Button, NonExistentComponent } from 'gd-design-library';
        
        export function Component() {
          return (
            <>
              <Button>Click</Button>
              <NonExistentComponent />
            </>
          );
        }
      `;

      const result = validateGeneratedCode(code);
      expect(result.warnings.some((w) => w.includes('not in library'))).toBe(true);
    });
  });
});
