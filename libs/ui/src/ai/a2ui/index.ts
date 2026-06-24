/**
 * A2UI Integration — GridKit Design System
 *
 * Tools for generating and rendering A2UI JSON specifications using
 * gd-design-library (GridKit) React components.
 *
 * Two integration modes exist in libs/ui/src/ai:
 *
 *   1. CODE MODE (./prompts.ts)
 *      LLM → React/TSX code using GridKit components.
 *      Use buildClaudeSystemPrompt, buildGPT4Prompt, buildGeminiPrompt.
 *
 *   2. A2UI MODE (this module)
 *      LLM → A2UI JSON spec → rendered by GridKit components at runtime.
 *      Use buildA2UISystemPrompt, A2UI_SPEC_SCHEMA, A2UI_COMPONENT_MAP.
 *
 * A2UI protocol: https://a2ui.org
 */

export {
  // Component map
  A2UI_COMPONENT_MAP,
  A2UI_COMPONENT_TYPES,
  A2UI_AVAILABLE_ICONS,
  A2UI_ICON_CATALOG,
  A2UI_BUTTON_VARIANTS,
  getA2UIPropEnum,
  getGridKitComponent,
  type A2UIComponentEntry,
  type A2UIIconName,
  type A2UIIconCatalog,
  type A2UIButtonVariant,
} from './component-map';

export {
  // Schemas
  A2UI_SPEC_SCHEMA,
  A2UI_SPEC_SCHEMA_SIMPLE,
  extendA2UISpecSchema,
  // Types
  type A2UISpec,
  type A2UIMetadata,
  type A2UIComponent,
  type A2UIAction,
  type A2UIStyling,
  type A2UILayoutType,
  type A2UIVariant,
  type A2UIActionDefinition,
  type A2UICustomComponentMeta,
} from './spec-schema';

export {
  // Prompt builders
  buildA2UISystemPrompt,
  buildA2UIGeminiRequest,
  type PriceFormatCustom,
  type A2UISystemPromptOptions,
} from './system-prompt';

export { type A2UIImageSources, normalizeImageSources } from './image-policy';
