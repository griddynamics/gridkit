import {
  aiComponentsSchema,
  type A2UISubcomponentSchema,
  type ComponentSchema,
  type PropSchema,
} from './schemas/components';
import { A2UI_SPEC_SCHEMA } from './a2ui/spec-schema';

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  valid: boolean;
}

const A2UI_COMPONENT_PROPERTY_NAMES = new Set(
  Object.keys(A2UI_SPEC_SCHEMA.properties.ui.properties.components.items.properties)
);
const A2UI_ADDITIONAL_SUPPORTED_PROP_NAMES = new Set([
  'align',
  'justify',
  'isWrap',
  'gap',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'maxHeight',
  'title',
  'description',
  'max',
  'min',
  'isLoading',
  'searchValue',
  'noHistoryResultsLabel',
  'noResultsLabel',
  'showSearch',
  'showTopBanner',
  'display',
  'overflow',
  'minWidth',
  'maxWidth',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'zIndex',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'flex',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignContent',
  'justifySelf',
  'alignSelf',
  'order',
  'cursor',
  'role',
]);
const A2UI_RESERVED_PROP_NAMES = new Set(['type']);
const A2UI_NON_JSON_TYPE_PATTERNS = [
  /ReactNode/i,
  /MouseEvent/i,
  /KeyboardEvent/i,
  /ChangeEvent/i,
  /ElementType/i,
  /=>/,
];

function validateA2UIPropCompatibility(
  props: PropSchema[],
  label: string
): Pick<ValidationResult, 'errors' | 'warnings'> {
  const errors: string[] = [];
  const warnings: string[] = [];

  props.forEach((prop) => {
    if (A2UI_RESERVED_PROP_NAMES.has(prop.name)) {
      errors.push(`${label} prop "${prop.name}" is reserved. Use a dedicated field name instead.`);
    }

    if (!A2UI_COMPONENT_PROPERTY_NAMES.has(prop.name) && !A2UI_ADDITIONAL_SUPPORTED_PROP_NAMES.has(prop.name)) {
      warnings.push(`${label} prop "${prop.name}" is not declared in the shared A2UI component schema.`);
    }

    if (A2UI_NON_JSON_TYPE_PATTERNS.some((pattern) => pattern.test(prop.type))) {
      warnings.push(`${label} prop "${prop.name}" uses non-JSON-safe type "${prop.type}".`);
    }
  });

  return { errors, warnings };
}

function validateA2UISchemaCompatibility(schema: ComponentSchema): Pick<ValidationResult, 'errors' | 'warnings'> {
  if (!schema.a2uiName) {
    return { errors: [], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  const mainProps = validateA2UIPropCompatibility(schema.props, 'A2UI');
  errors.push(...mainProps.errors);
  warnings.push(...mainProps.warnings);

  if (schema.a2uiSubcomponents) {
    Object.entries(schema.a2uiSubcomponents).forEach(([a2uiType, subcomponent]: [string, A2UISubcomponentSchema]) => {
      const subResult = validateA2UIPropCompatibility(subcomponent.props, `A2UI subcomponent "${a2uiType}"`);
      errors.push(...subResult.errors);
      warnings.push(...subResult.warnings);
    });
  }

  return { errors, warnings };
}

/**
 * Validate a component schema
 */
export function validateSchema(schema: ComponentSchema): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!schema.name) errors.push('Missing name');
  if (!schema.import) errors.push('Missing import');
  if (!schema.description) errors.push('Missing description');

  const schemaAny = schema as any;

  // Metadata fields
  if (!schemaAny.category) warnings.push('Missing category');
  if (!schemaAny.complexity) warnings.push('Missing complexity');
  if (!schemaAny.accessibility) warnings.push('Missing accessibility info');

  // Props validation
  if (!schema.props || !Array.isArray(schema.props)) {
    errors.push('Props must be an array');
  } else {
    schema.props.forEach((prop: PropSchema, index: number) => {
      if (!prop.name) errors.push(`Prop ${index}: Missing name`);
      if (!prop.type) errors.push(`Prop ${prop.name || index}: Missing type`);
      if (!prop.description) warnings.push(`Prop ${prop.name}: Missing description`);
    });
  }

  // Examples validation
  if (!schemaAny.examples || schemaAny.examples.length < 3) {
    warnings.push('Should have at least 3 examples');
  }

  // Best practices validation
  if (!schemaAny.bestPractices || schemaAny.bestPractices.length < 5) {
    warnings.push('Should have at least 5 best practices');
  }

  // Quick start validation
  if (!schemaAny.quickStart || Object.keys(schemaAny.quickStart).length < 3) {
    warnings.push('Should have at least 3 quick start examples');
  }

  // Common patterns validation
  if (!schemaAny.commonPatterns || Object.keys(schemaAny.commonPatterns).length < 3) {
    warnings.push('Should have at least 3 common patterns');
  }

  const a2uiCompatibility = validateA2UISchemaCompatibility(schema);
  errors.push(...a2uiCompatibility.errors);
  warnings.push(...a2uiCompatibility.warnings);

  return { errors, warnings, valid: errors.length === 0 };
}

/**
 * Validate all component schemas
 */
export function validateAllSchemas(): {
  results: Map<string, ValidationResult>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    totalErrors: number;
    totalWarnings: number;
  };
} {
  const results = new Map<string, ValidationResult>();

  aiComponentsSchema.components.forEach((component) => {
    const result = validateSchema(component);
    results.set(component.name, result);
  });

  const summary = {
    total: aiComponentsSchema.components.length,
    valid: Array.from(results.values()).filter((r) => r.valid).length,
    invalid: Array.from(results.values()).filter((r) => !r.valid).length,
    totalErrors: Array.from(results.values()).reduce((sum, r) => sum + r.errors.length, 0),
    totalWarnings: Array.from(results.values()).reduce((sum, r) => sum + r.warnings.length, 0),
  };

  return { results, summary };
}

/**
 * Extract imports from code string
 */
export function extractImports(code: string): string[] {
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  const imports: Set<string> = new Set();
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    imports.add(match[1]);
  }

  return Array.from(imports);
}

/**
 * Extract component names from code string
 */
export function extractComponents(code: string): string[] {
  const componentRegex = /<(\w+)[\s>]/g;
  const components: Set<string> = new Set();
  let match;

  while ((match = componentRegex.exec(code)) !== null) {
    const componentName = match[1];
    // Filter out HTML elements (lowercase)
    if (componentName[0] === componentName[0].toUpperCase()) {
      components.add(componentName);
    }
  }

  return Array.from(components);
}

/**
 * Validate generated code
 */
export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check imports
  const imports = extractImports(code);
  const invalidImports = imports.filter(
    (imp) => !imp.includes('gd-design-library') && !imp.includes('react') && !imp.includes('react-dom')
  );
  if (invalidImports.length > 0) {
    errors.push(`Invalid imports detected: ${invalidImports.join(', ')}`);
  }

  // Check component usage
  const usedComponents = extractComponents(code);
  const validComponents = usedComponents.every((comp) => aiComponentsSchema.components.some((c) => c.name === comp));
  if (!validComponents) {
    const invalidComponents = usedComponents.filter(
      (comp) => !aiComponentsSchema.components.some((c) => c.name === comp)
    );
    if (invalidComponents.length > 0) {
      warnings.push(`Using components not in library: ${invalidComponents.join(', ')}`);
    }
  }

  // Check for common HTML elements that should use components
  const htmlElements = ['div', 'span', 'button', 'input', 'form'];
  const usedHtmlElements = htmlElements.filter((el) => code.includes(`<${el}`));
  if (usedHtmlElements.length > 0) {
    warnings.push(`Consider using library components instead of raw HTML: ${usedHtmlElements.join(', ')}`);
  }

  return { errors, warnings, valid: errors.length === 0 };
}
