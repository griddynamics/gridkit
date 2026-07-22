/**
 * A2UI → GridKit Component Map
 *
 * Built dynamically from aiComponentsSchema — the single source of truth.
 * Component metadata (props, notes, category, icons, etc.) lives in the
 * individual schema files under libs/ui/src/ai/schemas/components/.
 *
 * `notes` on each entry is a unified list merged from every guidance source
 * in the schema: compositionTips + commonPatterns (use-case descriptions) +
 * examples + troubleshooting.
 *
 * To add or update a component:
 *   1. Edit its schema file (e.g. Button.ts)
 *   2. Ensure it has `a2uiName` set
 *   3. Update props, compositionTips, commonPatterns, examples, and/or
 *      troubleshooting as needed
 *   4. This map regenerates automatically at runtime
 *
 * A2UI protocol: https://a2ui.org
 */

import type { ComponentSchema, ComponentModule, PropSchema } from '../schemas/components';
import { aiComponentsSchema, componentModulesByName } from '../schemas/components';
import IconSchemaModule from '../schemas/components/Icon';

export type A2UIComponentEntry = {
  /** gd-design-library component name */
  component: string;
  /** npm import statement */
  import: string;
  /** Short description for LLM context */
  description?: string;
  /** Accepted prop shapes (descriptive strings for LLM consumption) */
  props: Record<string, string>;
  /**
   * Unified guidance notes for the LLM — merged from all schema sources:
   * compositionTips, commonPatterns use-case descriptions, examples, and
   * troubleshooting tips.
   */
  notes?: string[];
  /** Component category */
  category?: string;
  /** Component complexity level */
  complexity?: string;
};

// ── Internal types for schema fields not in the base ComponentSchema type ────

type ExtendedComponentSchema = ComponentSchema & {
  category?: string;
  complexity?: string;
};

// ── Prop converter ────────────────────────────────────────────────────────────

/**
 * Convert a PropSchema[] (structured prop definitions) to a flat
 * Record<string, string> suitable for LLM consumption in A2UI JSON mode.
 */
function propSchemasToRecord(props: PropSchema[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const prop of props) {
    let desc: string;
    if (prop.enum && prop.enum.length > 0) {
      desc = prop.enum.map((v) => `"${v}"`).join('|');
    } else {
      desc = prop.type;
    }
    if (prop.description) desc += ` — ${prop.description}`;
    result[prop.name] = desc;
  }
  return result;
}

// ── Note merger ───────────────────────────────────────────────────────────────

/**
 * Build a unified notes array from all guidance sources in the schema.
 * Order: composition tips → common patterns → examples → troubleshooting.
 */
function buildCombinedNotes(schema: ComponentSchema, mod: ComponentModule | undefined): string[] | undefined {
  const notes: string[] = [];
  const s = schema as Record<string, unknown>;

  // 1. Composition tips from the component module
  if (mod && mod.compositionTips.length > 0) notes.push(...mod.compositionTips);

  // 2. Common patterns — include use-case description + code as a single string
  const commonPatterns = s['commonPatterns'] as Record<string, { code?: string; useCase?: string }> | undefined;
  if (commonPatterns) {
    for (const [name, pattern] of Object.entries(commonPatterns)) {
      const useCase = pattern.useCase ?? '';
      const code = pattern.code ? ` Example: ${pattern.code}` : '';
      notes.push(`${name}: ${useCase}${code}`);
    }
  }

  // 3. Code examples
  const examples = s['examples'];
  if (Array.isArray(examples)) {
    for (const ex of examples) {
      if (typeof ex === 'string') notes.push(ex);
    }
  }

  // 4. Troubleshooting tips
  const troubleshooting = s['troubleshooting'] as Record<string, string> | undefined;
  if (troubleshooting) {
    for (const [issue, fix] of Object.entries(troubleshooting)) {
      notes.push(`Troubleshooting — ${issue}: ${fix}`);
    }
  }

  return notes.length > 0 ? notes : undefined;
}

// ── Map builder ───────────────────────────────────────────────────────────────

function buildA2UIComponentMap(): Record<string, A2UIComponentEntry> {
  const result: Record<string, A2UIComponentEntry> = {};

  for (const comp of aiComponentsSchema.components) {
    const schema = comp as ExtendedComponentSchema;
    if (!schema.a2uiName) continue;

    const mod = componentModulesByName.get(schema.name);
    const combinedNotes = buildCombinedNotes(schema, mod);

    // Main component entry
    result[schema.a2uiName] = {
      component: schema.name,
      import: schema.import,
      description: schema.description,
      props: propSchemasToRecord(schema.props),
      notes: combinedNotes,
      category: schema.category,
      complexity: schema.complexity,
    };

    // Subcomponent entries (e.g. Card → card-row, card-column, …)
    if (schema.a2uiSubcomponents) {
      const schemaAny = schema as Record<string, unknown>;
      const subcomponentsField = schemaAny['subcomponents'] as Record<string, { description?: string }> | undefined;

      for (const [a2uiKey, sub] of Object.entries(schema.a2uiSubcomponents)) {
        const subDesc = subcomponentsField?.[sub.component]?.description ?? schema.description;
        result[a2uiKey] = {
          component: sub.component,
          import: schema.import,
          description: subDesc,
          props: propSchemasToRecord(sub.props),
          notes: combinedNotes,
          category: schema.category ? `${schema.category} Subcomponents` : 'Card Subcomponents',
          complexity: schema.complexity,
        };
      }
    }
  }

  return result;
}

/**
 * Complete A2UI type → GridKit component mapping.
 * Every key is a valid A2UI component "type" value.
 * Built from aiComponentsSchema — no manual duplication.
 */
export const A2UI_COMPONENT_MAP: Record<string, A2UIComponentEntry> = buildA2UIComponentMap();

/**
 * All valid A2UI component type strings.
 * Generated from A2UI_COMPONENT_MAP keys.
 */
export const A2UI_COMPONENT_TYPES = Object.keys(A2UI_COMPONENT_MAP) as (keyof typeof A2UI_COMPONENT_MAP)[];

// ── Icon catalog (source: Icon.ts schema) ────────────────────────────────────

/**
 * Available icon names for the "icon" component type.
 * The label prop of an "icon" component MUST be one of these values.
 * Source of truth: libs/ui/src/ai/schemas/components/Icon.ts → availableIcons
 */
export const A2UI_AVAILABLE_ICONS = IconSchemaModule.component.availableIcons as readonly string[] &
  typeof IconSchemaModule.component.availableIcons;

export type A2UIIconName = (typeof A2UI_AVAILABLE_ICONS)[number];

/**
 * Semantic usage guide for each icon, grouped by category.
 * Source of truth: libs/ui/src/ai/schemas/components/Icon.ts → iconCatalog
 */
export const A2UI_ICON_CATALOG = IconSchemaModule.component.iconCatalog;
export type A2UIIconCatalog = typeof A2UI_ICON_CATALOG;

// ── Generic prop-enum helper ──────────────────────────────────────────────────

/**
 * Get the enum values for a named prop of any A2UI component type.
 * Works for any component — no per-component special exports needed.
 *
 * @example
 * getA2UIPropEnum('button', 'variant')  // ['primary', 'secondary', ...]
 * getA2UIPropEnum('badge', 'size')      // ['sm', 'md', 'lg']
 */
export function getA2UIPropEnum(a2uiType: string, propName: string): readonly string[] {
  const schema = aiComponentsSchema.components.find((c) => (c as ExtendedComponentSchema).a2uiName === a2uiType);
  return schema?.props.find((p) => p.name === propName)?.enum ?? [];
}

// ── Button variants ───────────────────────────────────────────────────────────

/**
 * Valid Button variant values.
 * Derived from the 'button' component's variant prop enum via getA2UIPropEnum.
 */
export const A2UI_BUTTON_VARIANTS = getA2UIPropEnum('button', 'variant');
export type A2UIButtonVariant = (typeof A2UI_BUTTON_VARIANTS)[number];

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Get the GridKit component name for a given A2UI type.
 */
export function getGridKitComponent(a2uiType: string): string {
  return A2UI_COMPONENT_MAP[a2uiType]?.component ?? 'Unknown';
}
