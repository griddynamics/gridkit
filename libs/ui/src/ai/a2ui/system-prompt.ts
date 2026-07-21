/**
 * A2UI System Prompt Builder
 *
 * Generates the LLM system instruction for producing A2UI JSON specs that
 * render correctly with gd-design-library (GridKit) components.
 *
 * Unlike CLAUDE_GRIDKIT_SYSTEM_PROMPT (which targets React/TSX code output),
 * this prompt targets JSON output in the A2UI specification format.
 *
 * Usage:
 *   import { buildA2UISystemPrompt } from 'gd-design-library/ai/a2ui';
 *
 *   const model = genAI.getGenerativeModel({
 *     model: 'gemini-2.5-flash',
 *     systemInstruction: buildA2UISystemPrompt(),
 *     generationConfig: { responseMimeType: 'application/json' },
 *   });
 *
 * A2UI protocol: https://a2ui.org
 * GridKit storybook: https://storybook.cto-rnd-system-design.griddynamics.net
 */

import { A2UI_COMPONENT_MAP, A2UI_AVAILABLE_ICONS, A2UI_BUTTON_VARIANTS, A2UI_ICON_CATALOG } from './component-map';
import { type A2UIImageSources, normalizeImageSources } from './image-policy';
import { type A2UIActionDefinition, type A2UICustomComponentMeta } from './spec-schema';
import {
  FIGMA_COLOR_MAP,
  FIGMA_SPACING_MAP,
  FIGMA_RADIUS_MAP,
  FIGMA_SHADOW_MAP,
  FIGMA_FONT_MAP,
  FIGMA_ICON_MAP,
} from '../figma-maps';

const AGENT_ID_PLACEHOLDER = 'a2ui-agent';
const AGENT_NAME_PLACEHOLDER = 'Grid Dynamics Assistant';

/**
 * Fine-grained price formatting overrides for `priceFormat`.
 * Any omitted field falls back to its default value.
 */
export type PriceFormatCustom = {
  /** Where the currency symbol appears relative to the value.
   *  `'before'` (default) → `"$99.99"` · `'after'` → `"99,99 €"` */
  symbolPosition?: 'before' | 'after';
  /** Decimal separator character. Default: `'.'` */
  decimalSeparator?: '.' | ',';
  /** Thousands separator character. Default: `','` */
  thousandsSeparator?: ',' | ' ' | '.';
  /** Whether to keep trailing zeros for whole amounts.
   *  `false` (default) → `"99"` not `"99.00"` */
  trailingZeros?: boolean;
};

export type A2UISystemPromptOptions = {
  agentId?: string;
  agentName?: string;
  provider?: string;
  scenario?: string;
  segment?: string;
  theme?: 'light' | 'dark' | 'auto';
  imageSources?: A2UIImageSources;
  /** BCP 47 locale code for generated content (e.g. "en-US", "de-DE"). */
  locale?: string;
  /** Free-form description of the use case or application context injected near the top of the prompt. */
  context?: string;
  /** Additional guardrail rules appended to the system-defined guardrails. */
  customGuardrails?: string[];
  /** Additional generation rules appended to the system-defined rules. */
  customRules?: string[];
  /**
   * Application-defined actions available to the LLM.
   * Pass the same array to `renderA2UISpec` to wire up runtime handlers.
   * This is the ONLY way to make action types available — no built-in action types exist.
   */
  actions?: A2UIActionDefinition[];
  /**
   * Custom React components to make available to the LLM and the renderer.
   *
   * Pass an array of `A2UICustomComponentDefinition` objects (which extend this meta type).
   * The prompt will list them under a "Custom Components" section so the LLM knows they exist.
   * Pass the same array to `renderA2UISpec` to wire up runtime rendering.
   * Built-in component types always win on type collisions.
   */
  customComponents?: A2UICustomComponentMeta[];
  /**
   * Explicit price and currency formatting convention for `price` components.
   *
   * - `'us'`  — symbol before, period decimal, comma thousands: `$1,299.99`
   * - `'eu'`  — symbol after with space, comma decimal, space thousands: `1 299,99 €`
   * - object  — fine-grained control: `{ symbolPosition, decimalSeparator, thousandsSeparator, trailingZeros }`
   *
   * When provided, this **overrides** any locale-based price formatting detection.
   * When omitted, formatting is inferred from `locale` (EU languages → EU convention, else US).
   */
  priceFormat?: 'us' | 'eu' | PriceFormatCustom;
};

/**
 * Build the complete A2UI system instruction string.
 *
 * The instruction is derived from the live component map, so it stays in sync
 * automatically whenever `component-map.ts` is updated.
 */
export function buildA2UISystemPrompt(options?: A2UISystemPromptOptions): string {
  const {
    agentId = AGENT_ID_PLACEHOLDER,
    agentName = AGENT_NAME_PLACEHOLDER,
    provider,
    scenario,
    segment,
    theme = 'light',
    imageSources,
    locale,
    context,
    customGuardrails = [],
    customRules = [],
    actions = [],
    customComponents = [],
    priceFormat,
  } = options ?? {};

  const componentList = buildComponentList();
  const customComponentList = buildCustomComponentList(customComponents);
  const guardrails = buildGuardrails(imageSources, customGuardrails);
  const actionTypes = buildActionTypes(actions);
  const allowedHosts = normalizeImageSources(imageSources);

  const sections: string[] = [
    'You are an AI assistant that generates UI specifications in A2UI (Agent-to-UI) format.',
    '',
    'A2UI is a JSON-based protocol that enables AI agents to describe interactive user interfaces.',
    'The client application renders these specs using the GridKit design system (gd-design-library)',
    'from Grid Dynamics — a library of 52 modular, accessible, themeable React components.',
    '',
  ];

  if (context) {
    sections.push('## USE CASE CONTEXT', '', context, '');
  }

  if (provider || scenario || segment) {
    sections.push('## ORCHESTRATION CONTEXT', '');

    if (provider) {
      sections.push(`- Provider: ${provider}`);
    }
    if (scenario) {
      sections.push(`- Scenario: ${scenario}`);
    }
    if (segment) {
      sections.push(`- Segment: ${segment}`);
    }

    sections.push(
      '',
      'If metadata.provider, metadata.scenario, or metadata.segment are included, use exactly these values.',
      ''
    );
  }

  sections.push(
    '',
    '## GENERATION RULES',
    '',
    buildGenerationRules(customRules),
    '## RESPONSE FORMAT',
    '',
    'Always respond with a single valid JSON object matching this structure exactly:',
    'metadata.provider, metadata.scenario, and metadata.segment are optional.',
    'Include them only when the application provides them or when the orchestration context is explicitly known.',
    '',
    JSON.stringify(
      {
        version: '1.0.0',
        metadata: {
          agentId,
          agentName,
          timestamp: '<ISO 8601 timestamp>',
          theme,
          ...(provider ? { provider } : {}),
          ...(scenario ? { scenario } : {}),
          ...(segment ? { segment } : {}),
          ...(locale ? { locale } : {}),
        },
        ui: {
          layout: { type: 'vertical', spacing: '16px' },
          components: ['...see COMPONENT JSON SHAPE below...'],
          actions: ['...see ACTION JSON SHAPE below...'],
        },
      },
      null,
      2
    ),
    '',
    '### COMPONENT JSON SHAPE',
    '',
    'Every entry in ui.components (and recursively in children[]) follows this shape.',
    'Only include fields that are relevant to the component — omit all unused fields.',
    '',
    JSON.stringify(
      {
        id: 'unique_snake_case_id',
        type: '<see AVAILABLE COMPONENT TYPES>',
        label: '<primary visible text>',
        value: '<component value — type depends on component: string | number | boolean | array>',
        caption: '<optional image caption>',
        placeholder: '<input placeholder text>',
        helpText: '<helper text shown below inputs>',
        title: '<widget/upload heading>',
        description: '<supporting widget/upload copy>',
        ariaLabel: '<accessible label when visible text is not enough>',
        required: false,
        disabled: false,
        readOnly: false,
        checked: false,
        variant: '<visual variant — see component definition>',
        appearance: '<secondary appearance modifier — see component definition>',
        size: '"xs" | "sm" | "md" | "lg" | "xl"',
        styleVariant: '"bold" | ["semibold", "italic"]',
        icon: '<icon name from available icons list>',
        iconStart: '<optional leading icon name>',
        iconEnd: '<optional trailing icon name>',
        buttonType: '"button" | "submit" | "reset"',
        labelSide: '"left" | "right"',
        rounded: '"none" | "default" | "round" | "xs" | "sm" | "md" | "lg" | "xl"',
        withWrapper: true,
        wrapperVariant: '"inline" | "section" | "fullPage"',
        WrapperView: '"div" | "section" | "aside"',
        container: '<optional CSS selector for portal target, e.g. "#portal-root">',
        blocksScroll: false,
        animationProps: '<custom CSS animation shorthand>',
        fullWidth: false,
        isIcon: false,
        isOpen: false,
        showSidebarAsideControl: true,
        showSidebarHeaderControl: true,
        vertical: '"hidden" | "visible" | "auto"',
        horizontal: '"hidden" | "visible" | "auto"',
        autoHide: false,
        multiple: false,
        searchable: false,
        searchPlaceholder: '<select search placeholder>',
        accept: '<file MIME types or extensions>',
        capture: '"user" | "environment" | true | false',
        inputFileButtonLabel: '<drag-and-drop button label>',
        acceptedFileTypes: ['image/png', 'application/pdf'],
        maxFileSize: 10000000,
        maxFiles: 3,
        errors: ['<inline validation message>'],
        files: [{ name: 'proposal.pdf', size: 1240000, type: 'application/pdf' }],
        className: '<optional CSS hook>',
        tabIndex: 0,
        htmlFor: '<associated form control id>',
        lines: 2,
        isBordered: false,
        isHighlighted: false,
        withShadowHover: false,
        gap: '<CSS gap for flex-container, e.g. "12px">',
        gutter: '<CSS gap between card children, e.g. "12px">',
        padding: '<CSS inner card padding, e.g. "16px">',
        align: '"start" | "center" | "end" | "stretch"',
        justify: '"start" | "center" | "end" | "space-between" | "space-around"',
        isWrap: true,
        flex: '<CSS flex shorthand, e.g. "1 1 auto">',
        isReversed: false,
        flexDirection: '"row" | "column" | "row-reverse" | "column-reverse"',
        alignItems: '<CSS align-items value>',
        justifyContent: '<CSS justify-content value>',
        options: [{ value: 'val', label: 'Label', disabled: false, icon: 'iconName', href: '/path' }],
        columns: [{ key: 'col_key', label: 'Column Header', sortable: false, width: '120px' }],
        rows: [{ col_key: 'cell value' }],
        attributes: { src: 'https://...', alt: '...', min: 0, max: 100, initial: 1 },
        actions: ['action_id_1'],
        children: ['<nested A2UIComponent objects>'],
        headerContent: ['<chat header A2UIComponent objects>'],
        sidebarContent: ['<chat sidebar A2UIComponent objects>'],
        sidebarMinifiedContent: ['<collapsed chat sidebar A2UIComponent objects>'],
        sidebarHeaderContent: ['<chat sidebar header A2UIComponent objects>'],
        dragOverContent: ['<nested A2UIComponent objects>'],
        loadingOverlay: ['<nested A2UIComponent objects>'],
        styling: {
          margin: '0 0 16px 0',
          marginTop: '8px',
          marginBottom: '12px',
          padding: '16px',
          paddingTop: '8px',
          width: '100%',
          height: 'auto',
          maxWidth: '480px',
          minWidth: '200px',
          maxHeight: '300px',
          minHeight: '120px',
          color: '#333',
          backgroundColor: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '-0.02em',
          lineHeight: '1.5',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          flexWrap: 'nowrap',
          flexShrink: '0',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          overflow: 'hidden',
          opacity: '1',
        },
      },
      null,
      2
    ),
    '',
    '### ACTION JSON SHAPE',
    '',
    'Every entry in ui.actions follows this shape.',
    "Reference an action in a component by placing its id string in the component's actions[] array.",
    '',
    JSON.stringify(
      {
        id: 'unique_action_id',
        type: '<type string from ACTION TYPES>',
        trigger: '"click" | "change" | "submit" | "load" | "blur" | "focus" | "custom"',
        label: '<optional human-readable label>',
        payload: { '<key>': '<value — data passed to the action handler>' },
      },
      null,
      2
    ),
    '',
    '## AVAILABLE COMPONENT TYPES',
    '',
    'All types map to gd-design-library (GridKit) React components. Use snake_case for all IDs.',
    '',
    componentList,
    ...(customComponentList ? [customComponentList] : []),
    '## AVAILABLE LAYOUT TYPES',
    '',
    'These values are ONLY valid for ui.layout.type — they are NOT component types.',
    'NEVER use these as "type" on a component in ui.components[].',
    '',
    '- "vertical": Stack components top to bottom (default). Best for forms and sequential content.',
    '- "horizontal": Stack components left to right. Best for toolbars and inline action groups.',
    '    WARNING: "grid" is NOT a component type. Do not put { "type": "grid" } in ui.components[].',
    '',
    'Additional layout options:',
    '  spacing (string CSS, e.g. "16px") — gap between top-level components',
    '  alignment ("start"|"center"|"end"|"stretch"|"baseline") — cross-axis alignment of children',
    '  justification ("start"|"center"|"end"|"space-between"|"space-around"|"space-evenly") — main-axis distribution',
    '',
    '## ACTION TYPES',
    '',
    actionTypes,
    '',
    '## CRITICAL GUARDRAILS',
    '',
    guardrails,
    '',
    '## FORBIDDEN — NEVER DO THESE',
    '',
    buildForbidden(),
    '',
    '## CSS VALUE RULES — STRICTLY ENFORCED',
    '',
    'ALL values for spacing, margin, padding, width, height, gap, and any sizing/positioning',
    'MUST be real CSS values. NEVER use design token strings.',
    '',
    'ALLOWED — real CSS units:',
    '  "16px", "1rem", "0.5rem", "50%", "100%", "24px", "0", "auto", "8px 16px", "1rem 0"',
    '',
    'FORBIDDEN — design token strings (INVALID, will cause schema validation failure and retry):',
    '  "xs", "sm", "md", "lg", "xl", "none", "small", "medium", "large"',
    '',
    'Applies to: layout.spacing, styling.margin, styling.padding, styling.width, styling.height,',
    'styling.maxHeight, styling.minHeight, styling.gap, gutter and padding props on card.',
    '',
    '## IMAGE URL RULES — STRICTLY ENFORCED',
    '',
    ...(allowedHosts === null
      ? [
          'For image components, attributes.src MUST be a direct browser-loadable image file URL from any public CDN.',
          'Prefer URLs that clearly point to an image asset, ideally ending in .jpg, .jpeg, .png, .webp, or .gif.',
          'Do not link to page URLs, search results, or hotlink-protected content.',
          'If you are not highly confident that a direct image URL will render publicly, do NOT guess. Omit the image component entirely.',
        ]
      : allowedHosts.length === 0
        ? ['Do not include image components with remote src URLs — no image sources are configured.']
        : [
            'For image components, attributes.src MUST be a direct browser-loadable image file URL.',
            '',
            'ALLOWED HOSTS ONLY:',
            ...allowedHosts.map((h) => `  ${h}`),
            '',
            'FORBIDDEN: Any image URL from any other host, plus page URLs, search links, or hotlink-protected content.',
            'If you are not highly confident that a direct image URL will render publicly, do NOT guess. Omit the image component entirely.',
          ]),
    '',
    '## ACCESSIBILITY RULES',
    '',
    '1. Always set a meaningful alt text on image components (attributes.alt).',
    '2. Always add a label to: input, textarea, select, switch, toggle, slider, radio-group.',
    '3. Use semantic typography variants — h1–h6 for headings, "p" or "span" for body text.',
    '4. Use variant="h1" at most once per page.',
    '5. Interactive cards should have tabIndex set for keyboard accessibility.',
    '6. Disabled form controls must still have a visible label.',
    '',
    '## PRICE & CURRENCY FORMATTING RULES',
    '',
    buildPriceFormattingRules(locale, priceFormat)
  );

  return sections.join('\n');
}

// ── Private helpers ────────────────────────────────────────────────────────────

function buildComponentList(): string {
  const lines: string[] = [];
  const groups = new Map<string, string[]>();

  for (const [type, entry] of Object.entries(A2UI_COMPONENT_MAP)) {
    const cat = `### ${entry.category ?? 'Other'}`;
    if (!groups.has(cat)) groups.set(cat, []);
    const propSummary = buildShortPropSummary(type, entry.props);
    groups.get(cat)!.push(`- "${type}": ${entry.description}${propSummary}`);
    const propDetails = buildDetailedPropSummary(entry.props);
    if (propDetails.length > 0) {
      groups.get(cat)!.push('  Prop details:', ...propDetails);
    }
    if (entry.notes) {
      entry.notes.forEach((note) => groups.get(cat)!.push(`  → ${note}`));
    }
  }

  for (const [cat, items] of groups) {
    lines.push(cat, ...items, '');
  }

  return lines.join('\n');
}

function buildShortPropSummary(_type: string, props: Record<string, string>): string {
  const skip = new Set(['styling']);
  const parts: string[] = [];

  for (const [key, rawDesc] of Object.entries(props)) {
    if (skip.has(key)) continue;

    const desc = rawDesc.trim();
    let typeStr: string;

    if (desc.startsWith('"')) {
      // Enum values — remove "(default)" markers, keep all variants
      typeStr = desc
        .split(' — ')[0]
        .replace(/\s*\(default\)/gi, '')
        .trim();
    } else if (desc.startsWith('boolean')) {
      typeStr = 'bool';
    } else if (desc.startsWith('number')) {
      typeStr = 'number';
    } else if (desc.includes('Component[]')) {
      typeStr = 'Component[]';
    } else if (desc.startsWith('string[]')) {
      typeStr = 'string[]';
    } else if (desc.startsWith('Array<')) {
      typeStr = desc.split(' — ')[0].trim();
    } else if (desc.startsWith('string')) {
      typeStr = 'string';
    } else if (desc.startsWith('object')) {
      const shapeMatch = desc.match(/\{[^}]+\}/);
      typeStr = shapeMatch ? shapeMatch[0] : 'object';
    } else {
      typeStr = desc.split(' — ')[0].trim();
    }

    parts.push(`${key} (${typeStr})`);
  }

  if (parts.length === 0) return '';
  return `\n  Props: ${parts.join(', ')}`;
}

function buildDetailedPropSummary(props: Record<string, string>): string[] {
  const skip = new Set(['styling']);

  return Object.entries(props)
    .filter(([key]) => !skip.has(key))
    .map(([key, rawDesc]) => `    - ${key}: ${rawDesc}`);
}

function buildActionTypes(actions: A2UIActionDefinition[] = []): string {
  if (actions.length === 0) {
    return 'No action types are configured for this application. Do NOT include ui.actions in the spec.';
  }

  return [
    '### ACTION TYPES',
    '',
    'The following action types are available for this application. Include only the actions that are relevant to the UI you are generating — do NOT include actions that have no meaningful place in the current response.',
    '',
    'For each action you include:',
    '  1. Add an entry to ui.actions[] with its `type`, a unique snake_case `id`, the correct `trigger`, and a `payload` containing the static data the handler needs.',
    "  2. Wire it to the appropriate component via that component's `actions[]` array.",
    '  3. Choose the component and trigger that best match the action description.',
    '',
    'TRIGGER SELECTION RULES:',
    '  - trigger: "click"  → button, card-button, link, dropdown-item, sidebar, header, image-preview, search-modal — for actions described as: add, submit, confirm, view, navigate, remove, open, close, select',
    '  - trigger: "change" → card-counter, counter, switch, toggle, select, slider, radio-group, search — for actions described as: update quantity, adjust, change, increment, decrement, toggle a value, or react to typed search input',
    '  - trigger: "submit" → form (paired with a submit button) — for actions described as: save, register, login, send form',
    '  - trigger: "load"   → any container component — for actions described as: initialise, prefetch, load data on mount',
    '  - trigger: "custom" → drag-and-drop, drag-and-drop-files, input-area — when payloads represent dropped files or differentiated send/attachment events',
    '',
    'PAYLOAD RULES:',
    '  - Always include a payload object with the data the handler needs (e.g. product id, name, price).',
    '  - For counter/quantity actions, include the static context (e.g. product id) in the spec payload;',
    '    the renderer automatically merges the live { qty } value at runtime — do NOT put qty in the spec payload.',
    '',
    ...actions.map((a) => `- "${a.type}": ${a.description}`),
  ].join('\n');
}

function getUniqueCustomComponents(customComponents: A2UICustomComponentMeta[]): A2UICustomComponentMeta[] {
  const seenTypes = new Set<string>(Object.keys(A2UI_COMPONENT_MAP));
  const uniqueCustomComponents: A2UICustomComponentMeta[] = [];

  for (const customComponent of customComponents) {
    if (seenTypes.has(customComponent.type)) {
      continue;
    }

    seenTypes.add(customComponent.type);
    uniqueCustomComponents.push(customComponent);
  }

  return uniqueCustomComponents;
}

function buildCustomComponentList(customComponents: A2UICustomComponentMeta[]): string {
  const uniqueCustomComponents = getUniqueCustomComponents(customComponents);

  if (uniqueCustomComponents.length === 0) {
    return '';
  }

  const lines: string[] = [];
  const groups = new Map<string, string[]>();

  for (const comp of uniqueCustomComponents) {
    const category = `### ${comp.category ?? 'Custom'}`;

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    const propSummary = comp.props ? buildShortPropSummary(comp.type, comp.props) : '';

    groups.get(category)!.push(`- "${comp.type}": ${comp.description}${propSummary}`);

    if (comp.notes) {
      comp.notes.forEach((note) => groups.get(category)!.push(`  → ${note}`));
    }
  }

  for (const [category, items] of groups) {
    lines.push(category, ...items, '');
  }

  return lines.join('\n');
}

function buildForbidden(): string {
  return [
    '1. NEVER use design token strings for CSS values ("xs", "sm", "md", "lg", "xl", "none").',
    '   Use real CSS like "8px", "1rem", "16px 24px", "0" instead.',
    '',
    '2. NEVER use a button variant outside of: primary, secondary, tertiary, outlined, text, inherit.',
    '   These are ButtonVariant values — always lowercase.',
    '   NEVER use capitalized forms: Primary, Secondary, Tertiary, Outlined, Text, Inherit.',
    '   NEVER use: danger, success, warning, error, info, default, contained.',
    '',
    '3. NEVER use an icon name not listed in the CRITICAL GUARDRAILS icon list.',
    '   NEVER invent icon names. When in doubt, omit the icon.',
    '',
    '4. NEVER use duplicate component IDs. Every id must be unique across the entire spec,',
    '   including nested children.',
    '',
    '5. NEVER place children[] inside non-container components.',
    '   Only these support children[]: box, wrapper, portal, card, modal, accordion, accordion-item,',
    '   accordion-content, tooltip, scroll, tabs, carousel, content-carousel, dropdown, dropdown-item,',
    '   label, header, search-modal, sidebar, image-preview, input-area, drag-and-drop-files, form,',
    '   row, column, flex-container, chat-bubble, chat-container,',
    '   card-row, card-column.',
    '   chat-container also supports headerContent[], sidebarContent[], sidebarMinifiedContent[],',
    '   and sidebarHeaderContent[] named slot arrays.',
    '',
    '6. NEVER use an image URL that is not a direct public asset URL.',
    '   NEVER use webpage URLs, product pages, search result pages, or URLs requiring auth or redirects.',
    '',
    '7. NEVER include markdown syntax, HTML tags, or code fences inside JSON string values.',
    '   All string values must be plain text.',
    '',
    '8. NEVER use a component type not listed in AVAILABLE COMPONENT TYPES.',
    '   NEVER invent new type names.',
    '',
    '9. NEVER use variant="h1" more than once per page.',
    '',
    '10. NEVER omit the required fields: id and type on every component; id and type on every action.',
    '',
    '11. NEVER use "heading" or "paragraph" as component types — use "typography" instead.',
    '    Set the variant prop ("h1"–"h6" for headings, "p" for paragraphs).',
    '',
    '12. NEVER set attributes.width or attributes.height on an image component.',
    '    Image size is determined solely by the parent container.',
    '    Use styling.width="100%" and styling.height="auto" for responsive sizing if needed.',
    '',
    '13. NEVER omit attributes.xAxis.tickCount on charts with >8 x-axis data points.',
    '    Always cap xAxis.tickCount at 8 or fewer to prevent label overlap.',
    '',
    '14. NEVER use "grid" as a component type in ui.components[].',
    '    "grid" is ONLY valid for ui.layout.type — it controls the page-level layout grid.',
    '    To arrange components in a multi-column grid, use "row" with children[] or "flex-container"',
    '    with styling.display="grid" and styling.gap set appropriately.',
    '    WRONG: { "type": "grid", "gridColumns": 3, "children": [...] }',
    '    RIGHT: { "type": "row", "children": [...] }  or use ui.layout.type = "grid" with gridColumns.',
    '',
    '15. NEVER use generic component types (typography, button, rating, price, counter, image, etc.)',
    '    as children of a card. Inside a card, ONLY use card-* subcomponent types:',
    '    card-title, card-description, card-image, card-price, card-button, card-counter,',
    '    card-row, card-column, card-rating.',
    '    WRONG: { "type": "card", "children": [{ "type": "typography" }, { "type": "button" }] }',
    '    RIGHT: { "type": "card", "children": [{ "type": "card-title" }, { "type": "card-button" }] }',
    '',
    '16. card-* subcomponent types (card-title, card-description, card-image, card-price,',
    '    card-button, card-counter, card-row, card-column, card-rating) are ONLY valid inside',
    '    a card context. NEVER use them outside of a card.',
    '',
    '17. NEVER emit a card component without both padding and gutter props set.',
    '    Both are REQUIRED — use "0" explicitly if no spacing is desired.',
    '',
    '18. NEVER omit a defined action type from the spec.',
    '    Every action listed in ACTION TYPES MUST appear in ui.actions[] AND be wired',
    "    to at least one component via that component's actions[] array.",
    '    WRONG: defining "add-to-cart" but not including it in any component\'s actions[].',
    '    RIGHT: every defined action type has a corresponding entry in ui.actions and a wired component.',
    '',
    '19. NEVER use typography variant="caption" inside normal div/card/row/column/flex layouts without an as override.',
    '    Typography variant="caption" renders a real HTML <caption> element by default.',
    '    Outside true table captions, set as="div" for block metadata or as="span" for inline metadata.',
    '',
    "20. NEVER embed an icon inside a button's label text or as a raw child alongside text.",
    '    For a button with visible text and a leading or trailing icon, ALWAYS use iconStart or iconEnd',
    '    with the icon name string. The renderer handles icon sizing automatically.',
    '    WRONG: { "type": "button", "label": "← Undo" }',
    '    WRONG: { "type": "button", "label": "Undo", "children": [{ "type": "icon", "icon": "arrowLeft" }] }',
    '    RIGHT: { "type": "button", "label": "Undo", "iconStart": "arrowLeft" }',
    '    RIGHT: { "type": "button", "label": "Redo", "iconEnd": "arrowRight" }',
    '',
    '21. Icon-only buttons MUST set isIcon: true and provide the icon via iconStart.',
    '    NEVER pass a bare icon as children without isIcon, and NEVER omit isIcon on a button that has no label text.',
    '    WRONG: { "type": "button", "children": [{ "type": "icon", "icon": "search" }] }',
    '    RIGHT: { "type": "button", "isIcon": true, "iconStart": "search", "ariaLabel": "Search" }',
    '',
    '22. NEVER use JavaScript expressions, function calls, or computed values in any JSON field.',
    '    Every value must be a valid JSON literal: string, number, boolean, array, or object.',
    '    This is the most common source of JSON parse failures — the output is always pure JSON,',
    '    never a mix of JSON and JavaScript.',
    '    WRONG: "value": Math.round((1284590/1500000)*100)',
    '    WRONG: "value": parseInt("86", 10)',
    '    WRONG: "value": 1284590/1500000*100',
    '    RIGHT: "value": 86',
    '',
    '23. table rows[] MUST include an "id" field on every row object.',
    '    WRONG: { "orderId": "#ORD-7291", "customer": "Alice Johnson" }',
    '    RIGHT: { "id": "order_7291", "orderId": "#ORD-7291", "customer": "Alice Johnson" }',
    '',
    '24. NEVER use typography variant names borrowed from other design systems (body1, body2, subtitle1,',
    '    subtitle2, overline, body, inherit, display, bold, italic).',
    '    These are internal TypeScript enum key names, NOT valid A2UI variant values.',
    '    WRONG: { "type": "typography", "variant": "body1" }',
    '    WRONG: { "type": "typography", "variant": "body2" }',
    '    WRONG: { "type": "typography", "variant": "inherit" }',
    '    RIGHT: { "type": "typography", "variant": "p" }      // body paragraph',
    '    RIGHT: { "type": "typography", "variant": "small" }  // secondary/smaller body text',
    '    RIGHT: { "type": "typography", "variant": "span" }   // inline/neutral text',
    '    Valid typography variants: h1|h2|h3|h4|h5|h6|p|span|small|strong|i|code|kbd|caption|header|sup|sub|div',
    '',
    '25. For switch, label is LabelPosition (position), NOT text content.',
    '    Put visible text in value. Put the side ("left"|"right") in label.',
    '    WRONG: { "type": "switch", "label": "Dark mode" }  // "Dark mode" is text, not a position',
    '    WRONG: { "type": "switch", "value": "left" }       // "left" is a position, not text',
    '    RIGHT: { "type": "switch", "value": "Dark mode", "label": "left" }',
    '    RIGHT: { "type": "switch", "value": "Enable notifications" }  // label defaults to "right"',
    '    Valid label (LabelPosition) values: "left" | "right". Default: "right".',
    '    NEVER use: start, end, top, bottom, before, after.',
    '',
    '26. "chat-image-gallery" is ONLY valid as a direct child of "chat-bubble".',
    '    NEVER place it elsewhere in the spec.',
    '    Conversely, NEVER place "image-preview" inside a "chat-bubble" — use "chat-image-gallery"',
    '    for any image gallery / photo grid rendered inside a chat message.',
    '    WRONG: chat-bubble > image-preview',
    '    RIGHT: chat-bubble > chat-image-gallery (with images[] array)',
  ].join('\n');
}

function buildGuardrails(imageSources?: A2UIImageSources, customGuardrails: string[] = []): string {
  const iconNames = A2UI_AVAILABLE_ICONS.join(', ');
  const buttonVariants = A2UI_BUTTON_VARIANTS.join(' | ');
  const allowedImageHosts = normalizeImageSources(imageSources);

  const builtIn = [
    `1. button variant MUST be one of: ${buttonVariants} — NO other values allowed.`,
    '   Do NOT use: "danger", "success", "warning", "error", "info", "default", "contained".',
    '',
    `2. icon label MUST be one of these exact names:`,
    `   ${iconNames}`,
    '   Do NOT use: "add" (use "plus"), "settings", "close" (use "cross"), "chevronRight" (use "arrowRight").',
    '',
    '   Icon semantic guide (choose the right icon by use case):',
    ...Object.entries(A2UI_ICON_CATALOG).flatMap(([group, icons]) => [
      `   ${group}:`,
      ...Object.entries(icons).map(([name, usage]) => `     "${name}": ${usage}`),
    ]),
    '',
    '3. counter uses top-level initial (not "value") for the starting count.',
    '   attributes.initial is accepted only as a backward-compatible fallback.',
    '',
    '4. card withShadowHover requires styling.backgroundColor (e.g. "#fff") to be visible.',
    '   Pair with styling.cursor = "pointer" for interactive cards.',
    '',
    '5. All component IDs must be unique and use snake_case (e.g. "submit_button", "user_card").',
    '',
    '6. Nest components using children[] inside: box, wrapper, portal, card, modal, accordion,',
    '   accordion-item, accordion-content, tooltip, scroll, tabs, carousel, content-carousel,',
    '   dropdown, dropdown-item, label, header, search-modal, form, row, column, flex-container,',
    '   chat-bubble, chat-container, card-row, card-column.',
    '   chat-container also supports headerContent[], sidebarContent[], sidebarMinifiedContent[],',
    '   and sidebarHeaderContent[] as named slots.',
    '',
    '7. Only use action types listed in ACTION TYPES.',
    '   If no action types are listed, omit ui.actions entirely.',
    '   Reference actions by ID string in component actions[] arrays.',
    '',
    allowedImageHosts === null
      ? '8. Image src values MUST be direct browser-loadable image asset URLs from any public CDN.\n   Do not use page URLs, search results, or hotlink-protected links.\n   If uncertain, omit the image instead of inventing one.'
      : allowedImageHosts.length === 0
        ? '8. No image sources are configured — do NOT include any image components with remote src URLs.'
        : `8. Image src values MUST be direct image asset URLs, not webpage URLs.\n   Allowed hosts only: ${allowedImageHosts.join(
            ', '
          )}.\n   If a stable direct image URL is uncertain, omit the image instead of inventing one.`,
    '',
    '9. menu uses options[] for dropdown items — each item: { value: string, label: string }.',
    '   Do NOT use children[] inside menu; use options[] instead.',
    '',
    '10. select and radio-group both use options[]: [{ value: string|number, label: string }].',
    '',
    '11. table requires both columns[] and rows[].',
    '    columns: [{ key: string, label: string, sortable?: boolean, width?: string }].',
    '    rows: array of objects — each row MUST include an "id" field plus keys matching the column keys.',
    '    WRONG: { "customer": "Alice Johnson", "amount": "$2,400" }',
    '    RIGHT: { "id": "order_7291", "customer": "Alice Johnson", "amount": "$2,400" }',
    '',
    '12. accordion uses children[] of accordion-item objects, and each accordion-item should include',
    '    an accordion-header plus accordion-content child. tabs support children[] for panel content.',
    '    For tabs, also provide options[] to define the tab labels and values.',
    '',
    '13. drag-and-drop is a standalone file upload zone.',
    '    Do not nest it inside other form components.',
    '    Use top-level inputFileButtonLabel, acceptedFileTypes, maxFiles, maxFileSize, errors, files,',
    '    dragOverContent, and loadingOverlay for widget behaviour. NEVER emit React callbacks or refs',
    '    such as onFilesChanged, onError, onDrop, targetRef, or triggerRef. Use actions[] instead.',
    '',
    '14. header is for full page navigation shells only.',
    '    For section headings, use typography with variant="h2" or "h3".',
    '',
    '15. search-modal visibility is controlled by open-modal and close-modal actions.',
    '    Always pair it with a button that has an open-modal action targeting its id.',
    '',
    '16. Image size is always controlled by the parent container — NEVER set attributes.width or',
    '    attributes.height on an image component. Use styling.width="100%" and styling.height="auto"',
    '    for responsive images. Use styling.objectFit="cover" when cropping to a fixed aspect ratio.',
    '',
    '17. chart components with >8 data points on the x-axis MUST set attributes.xAxis.tickCount to',
    '    a value ≤ 8 (e.g. 6) to prevent x-axis label overlap and truncation.',
    '    For charts with many series or long x-axis labels, prefer a higher chartHeight (≥ 350) and',
    '    fewer tick marks so labels remain legible without overlapping.',
    '',
    '18. counter components MUST be wrapped in a container (row or flex-container) that has',
    '    overflow set appropriately. Never place a bare counter at the top level of a scrollable',
    '    list — wrap it with other sibling elements (e.g. a button) inside a row so layout is',
    '    stable and does not trigger unintended page scroll on +/- click.',
    '',
    '19. Card children MUST exclusively use card-* subcomponent types: card-row, card-column,',
    '    card-image, card-title, card-description, card-price, card-button, card-counter, card-rating.',
    '    NEVER place generic types (typography, button, rating, price, counter, image, badge, etc.)',
    '    directly inside a card. card-* types are INVALID outside of a card context.',
    '    Standard product card pattern:',
    '      card > card-image + card-column > card-title + card-description + card-rating',
    '                                       + card-row > card-price + card-counter',
    '                                       + card-button',
    '',
    '20. ALWAYS set both padding and gutter on the card root — NEVER omit either prop.',
    '    padding: "0" when card-image is the first child (image stretches to card edges);',
    '             "16px" or "20px" for content-only cards without an image.',
    '    gutter:  gap between direct card children — use "12px" or "16px" for standard spacing.',
    '    WRONG: { "type": "card", "isBordered": true, "children": [...] }',
    '    RIGHT: { "type": "card", "isBordered": true, "padding": "16px", "gutter": "12px", "children": [...] }',
    '',
    '21. select, toggle, and radio-group use options[] for choice data.',
    '    NEVER emit React-only items[] arrays or render functions in A2UI JSON.',
    '',
    '22. button uses buttonType for submit/reset semantics.',
    '    The top-level type field must ALWAYS stay the A2UI component type string.',
    '',
    '23. label, truncate, and input-file use top-level label for visible text.',
    '    Do NOT put their display text in children unless you are nesting actual child components.',
    '',
    '24. interactive icon, link, slider, and slider-dots components use actions[] for behavior.',
    '    NEVER emit onClick, onChange, or onDotClick callback props in A2UI JSON.',
    '',
    '25. label uses top-level htmlFor, and typography styleVariant may be a single string or an array of strings.',
    '',
    '26. progress-bar value MUST be a literal integer 0–100. Never compute it inline.',
    '    Pre-calculate the percentage yourself and output the plain number.',
    '    WRONG: "value": Math.round((1284590/1500000)*100)',
    '    RIGHT: "value": 86',
    '',
    '27. For an ALWAYS-VISIBLE inline dropdown list with checkboxes (embedded directly in the page, never collapsible),',
    '    use: dropdown → dropdown-item (with children[]) → label (with children[]) → input (variant="checkbox").',
    '    The label top-level label field provides the visible text; the input child provides the checkbox.',
    '    Do NOT use this pattern for collapsible pickers — use select with multiple: true instead (see rule 24 in GENERATION RULES).',
    '    WRONG: { "type": "menu", "children": [{ "type": "checkbox" }] }',
    '    RIGHT (always-visible inline list):',
    '    { "type": "dropdown", "children": [',
    '      { "type": "dropdown-item", "id": "item_opt1", "value": "opt1", "label": "Option 1",',
    '        "children": [{ "type": "label", "id": "label_opt1", "label": "Option 1",',
    '          "children": [{ "type": "input", "id": "input_opt1", "variant": "checkbox" }] }] }',
    '    ] }',
    '',
    '28. For standalone checkbox controls, ALWAYS use { "type": "input", "variant": "checkbox" }.',
    '    Use checked (boolean) for the checked state and indeterminate (boolean) for mixed/partial state.',
    '    Use label for the visible text next to the checkbox. Wire interactions through actions[].',
    '    NEVER emit { "type": "checkbox" } — it is not a valid A2UI component type.',
    '    WRONG: { "type": "checkbox", "label": "Accept terms", "checked": false }',
    '    RIGHT: { "type": "input", "variant": "checkbox", "label": "Accept terms", "checked": false }',
  ];

  if (customGuardrails.length === 0) return builtIn.join('\n');

  return [...builtIn, '', '### ADDITIONAL GUARDRAILS (application-specific)', '', ...customGuardrails].join('\n');
}

/**
 * Returns price and currency formatting rules for the LLM.
 *
 * Resolution order (first match wins):
 *  1. Explicit `priceFormat` option ('us' | 'eu' | custom object)
 *  2. Locale-based detection (EU language codes → 'eu', otherwise 'us')
 *  3. Default: US convention
 */
function buildPriceFormattingRules(locale?: string, priceFormat?: 'us' | 'eu' | PriceFormatCustom): string {
  // Resolve effective format
  let resolved: 'us' | 'eu' | PriceFormatCustom;

  if (priceFormat != null) {
    resolved = priceFormat;
  } else if (
    locale != null &&
    /^(de|fr|it|nl|es|pt|pl|cs|sk|hu|ro|bg|hr|sl|et|lv|lt|fi|sv|da|nb|no|el|uk|ru)\b/i.test(locale)
  ) {
    resolved = 'eu';
  } else {
    resolved = 'us';
  }

  const source =
    priceFormat != null ? 'explicit priceFormat option' : locale ? `inferred from locale "${locale}"` : 'default';

  if (resolved === 'eu') {
    return [
      `Price convention: EU (${source}).`,
      '',
      'Number format:',
      '  - Thousands separator: space  (e.g. 1 299, not 1,299)',
      '  - Decimal separator: comma    (e.g. 1 299,99, not 1 299.99)',
      '  - No trailing zeros: "99" not "99,00"; "1 299" not "1 299,00"',
      '',
      'Currency symbol position: AFTER the value with a space (e.g. "99 €", "1 299,99 €").',
      '',
      'Price component props:',
      '  currencySymbolPosition: "after"',
      '  currencySymbol: "€"  (or "zł", "kr", etc.)',
      '  currentValue: formatted numeric string without the symbol',
      '',
      'Examples:',
      '  { currentValue: "99",       currencySymbol: "€", currencySymbolPosition: "after" }  → "99 €"',
      '  { currentValue: "1 299",    currencySymbol: "€", currencySymbolPosition: "after" }  → "1 299 €"',
      '  { currentValue: "29,99",    currencySymbol: "€", currencySymbolPosition: "after" }  → "29,99 €"',
      '  { currentValue: "1 299,99", currencySymbol: "€", currencySymbolPosition: "after" }  → "1 299,99 €"',
    ].join('\n');
  }

  if (resolved === 'us') {
    return [
      `Price convention: US (${source}).`,
      '',
      'Number format:',
      '  - Thousands separator: comma  (e.g. 1,299, not 1 299)',
      '  - Decimal separator: period   (e.g. 1,299.99, not 1,299,99)',
      '  - No trailing zeros: "99" not "99.00"; "1,299" not "1,299.00"',
      '',
      'Currency symbol position: BEFORE the value (e.g. "$99", "$1,299.99").',
      '',
      'Price component props:',
      '  currencySymbolPosition: "before"  (or omit — it is the default)',
      '  currencySymbol: "$"  (or "€", "£", etc.)',
      '  currentValue: formatted numeric string without the symbol',
      '',
      'Examples:',
      '  { currentValue: "99",       currencySymbol: "$" }  → "$99"',
      '  { currentValue: "1,299",    currencySymbol: "$" }  → "$1,299"',
      '  { currentValue: "29.99",    currencySymbol: "$" }  → "$29.99"',
      '  { currentValue: "1,299.99", currencySymbol: "$" }  → "$1,299.99"',
    ].join('\n');
  }

  // Custom object
  const custom = resolved;
  const symPos = custom.symbolPosition ?? 'before';
  const dec = custom.decimalSeparator ?? '.';
  const thou = custom.thousandsSeparator ?? ',';
  const zeros = custom.trailingZeros ?? false;

  const exampleWhole = thou === ' ' ? '1 299' : thou === '.' ? '1.299' : '1,299';
  const exampleDecimal = `${exampleWhole}${dec}99`;
  const symBefore = symPos === 'before';
  const exDecimal = symBefore ? `"$${exampleDecimal}"` : `"${exampleDecimal} €"`;
  const exZero = zeros
    ? symBefore
      ? `"$${exampleWhole}${dec}00"`
      : `"${exampleWhole}${dec}00 €"`
    : symBefore
      ? `"$${exampleWhole}"`
      : `"${exampleWhole} €"`;

  return [
    `Price convention: custom (${source}).`,
    '',
    'Number format:',
    `  - Thousands separator: "${thou === ' ' ? 'space' : thou}"`,
    `  - Decimal separator: "${dec}"`,
    `  - Trailing zeros for whole amounts: ${
      zeros ? 'YES — always show 2 decimal places' : 'NO — omit trailing zeros (e.g. "99" not "99${dec}00")'
    }`,
    '',
    `Currency symbol position: ${symPos === 'after' ? 'AFTER the value with a space' : 'BEFORE the value'}.`,
    '',
    'Price component props:',
    `  currencySymbolPosition: "${symPos}"`,
    '  currencySymbol: your symbol string',
    '  currentValue: formatted numeric string without the symbol',
    '',
    'Examples:',
    `  Whole number:    ${exZero}`,
    `  With decimals:   ${exDecimal}`,
    `  Large price:     ${symBefore ? `"$${exampleDecimal}"` : `"${exampleDecimal} €"`}`,
  ].join('\n');
}

function buildTokenVocabulary(): string {
  // tokenPath values are theme-invariant (stable across light/dark/custom themes).
  // hex, px, and numeric values shown as [default: ...] are DEFAULT THEME hints only —
  // they change when a different theme is active. Always reference tokenPath in specs,
  // never hardcode a raw hex or px value from this table.
  const lines: string[] = [
    '    ⚠ tokenPath is theme-invariant — ALWAYS use it in specs, never hardcode [default:...] values.',
    '    Default-theme values are shown for context only; they change per active theme.',
    '',
    '  Colors (Figma variable → tokenPath [default hex]):',
  ];

  type ColorEntry = { tokenPath: string; hex?: string };
  type SpacingEntry = { tokenPath: string; value: string };
  type RadiusEntry = { tokenPath: string; value: string };
  type ShadowEntry = { tokenPath: string; tokenValue: string; elevation: string };
  type FontEntry = { tokenPath: string; themeAccess: string; value: string | number; role?: string };
  type ElevationGuide = Record<string, string>;

  // ── Colors ──────────────────────────────────────────────────────────────────
  const colorGroups = FIGMA_COLOR_MAP as unknown as Record<string, Record<string, ColorEntry>>;
  const semanticGroups = ['bg', 'border', 'text', 'icon'];
  for (const group of semanticGroups) {
    const entries = colorGroups[group];
    if (!entries || typeof entries !== 'object') continue;
    for (const [key, entry] of Object.entries(entries)) {
      if (!entry?.tokenPath || !entry?.hex) continue;
      lines.push(`    ${key} → ${entry.tokenPath} [default: ${entry.hex}]`);
    }
  }
  const neutral = colorGroups['neutral'];
  if (neutral && typeof neutral === 'object') {
    const sample = Object.entries(neutral).slice(0, 6);
    for (const [key, entry] of sample) {
      if (!entry?.tokenPath || !entry?.hex) continue;
      lines.push(`    ${key} → ${entry.tokenPath} [default: ${entry.hex}]`);
    }
    lines.push('    ... (plus palette: yellow/orange/red/blue/lightBlue/green/teal/pink/purple, 5–100 steps each)');
  }

  // ── Spacing ──────────────────────────────────────────────────────────────────
  lines.push('', '  Spacing (Figma variable → tokenPath [default px — may vary per theme]):');
  const spacingGroups = FIGMA_SPACING_MAP as unknown as Record<string, Record<string, SpacingEntry>>;
  const spacingEntries = spacingGroups['spacing'];
  if (spacingEntries && typeof spacingEntries === 'object') {
    for (const [key, entry] of Object.entries(spacingEntries)) {
      if (!entry?.tokenPath || !entry?.value) continue;
      lines.push(`    ${key} → ${entry.tokenPath} [default: ${entry.value}]`);
    }
  }

  // ── Radius ───────────────────────────────────────────────────────────────────
  lines.push('', '  Radius (Figma variable → tokenPath [default px — may vary per theme]):');
  const radiusEntries = (FIGMA_RADIUS_MAP as unknown as Record<string, Record<string, RadiusEntry>>)['radius'];
  if (radiusEntries && typeof radiusEntries === 'object') {
    for (const [key, entry] of Object.entries(radiusEntries)) {
      if (!entry?.tokenPath || !entry?.value) continue;
      lines.push(`    ${key} → ${entry.tokenPath} [default: ${entry.value}]`);
    }
  }

  // ── Shadows (light theme only; dark theme shadows have no GridKit tokens) ───
  lines.push('', '  Shadows — light theme only (dark theme shadows have no GridKit tokens):');
  const shadowMap = FIGMA_SHADOW_MAP as unknown as {
    light: Record<string, ShadowEntry>;
    elevationDecisionGuide?: ElevationGuide;
  };
  const shadowEntries = shadowMap['light'];
  if (shadowEntries && typeof shadowEntries === 'object') {
    for (const [key, entry] of Object.entries(shadowEntries)) {
      if (!entry?.tokenPath || !entry?.tokenValue || !entry?.elevation) continue;
      lines.push(`    ${key} → ${entry.tokenPath} — ${entry.elevation}`);
    }
  }
  const elevGuide = shadowMap.elevationDecisionGuide;
  if (elevGuide && typeof elevGuide === 'object') {
    lines.push('    Elevation guide (use-case → recommended token):');
    for (const [ctx, token] of Object.entries(elevGuide)) {
      if (ctx.startsWith('$')) continue;
      lines.push(`      ${ctx}: ${token}`);
    }
  }

  // ── Typography (font tokens are generally stable across themes) ──────────────
  lines.push('', '  Typography (Figma variable → tokenPath [default value]):');
  const fontMap = FIGMA_FONT_MAP as unknown as Record<string, Record<string, FontEntry | unknown>>;
  const fontSections: Array<[string, string]> = [
    ['size', 'font sizes'],
    ['lineHeight', 'line heights'],
    ['weight', 'font weights'],
    ['family', 'font families'],
  ];
  for (const [group, label] of fontSections) {
    const entries = fontMap[group];
    if (!entries || typeof entries !== 'object') continue;
    lines.push(`    ${label}:`);
    for (const [key, raw] of Object.entries(entries)) {
      if (key.startsWith('$')) continue;
      const entry = raw as FontEntry;
      if (!entry?.tokenPath) continue;
      const hint = entry.value !== undefined ? ` [default: ${entry.value}]` : '';
      const role = entry.role ? ` — ${entry.role}` : '';
      lines.push(`      ${key} → ${entry.tokenPath}${hint}${role}`);
    }
  }
  // Known gaps: values that appear in Figma designs but have no GridKit token
  const gaps = (fontMap as unknown as Record<string, Record<string, string>>)['knownGaps'];
  if (gaps && typeof gaps === 'object') {
    const gapEntries = Object.entries(gaps).filter(([k]) => !k.startsWith('$'));
    if (gapEntries.length) {
      lines.push('    font token gaps (no GridKit token — record as unmatched:<value> in tokenBindings):');
      for (const [k, v] of gapEntries) {
        lines.push(`      ${k}: ${v}`);
      }
    }
  }

  // ── Icons (Figma Material icon name → GridKit IconsList key) ─────────────────
  lines.push('', '  Icons (Figma icon name → GridKit <Icon name="..."> value):');
  const iconMap = FIGMA_ICON_MAP as unknown as { figmaNameIndex?: Record<string, string> };
  const iconIndex = iconMap.figmaNameIndex;
  if (iconIndex && typeof iconIndex === 'object') {
    for (const [figmaName, iconsKey] of Object.entries(iconIndex)) {
      if (figmaName.startsWith('$')) continue;
      lines.push(`    ${figmaName} → ${iconsKey}`);
    }
  }

  return lines.join('\n');
}

function buildGenerationRules(customRules: string[] = []): string {
  const builtIn = [
    '1. Output ONLY valid JSON — no markdown, no extra text, no code fences.',
    '2. Always set version to "1.0.0" and populate all required metadata fields.',
    '3. metadata.provider, metadata.scenario, and metadata.segment are optional.',
    '   These optional metadata fields support knowledge sharing, tracing, and orchestration across any LLM vendor.',
    "4. Create meaningful, rich UI that directly addresses the user's request.",
    '5. Use card containers to group related content (set isBordered: true for visual separation).',
    '6. For dashboards and overviews: use grid layout with gridColumns: 2 or 3.',
    '7. For forms and sequential content: use vertical layout.',
    '8. Add interactive buttons with actions wired to the types listed in ACTION TYPES.',
    '9. All component IDs must be unique across the entire spec.',
    '10. Timestamp must be a valid ISO 8601 datetime string.',
    '11. For image src values, return only direct image asset URLs that are likely to render publicly.',
    '12. Prefer typography over inline-notification for descriptive content.',
    '    Use inline-notification only for contextual alerts (success, warning, error, info).',
    '13. Use separator to visually divide distinct content sections.',
    '    separator with no extra props renders a full-width solid horizontal line (the most common case).',
    '    Add variant="dash"|"dot" for softer dividers. Add label="OR" for branching actions.',
    '    For vertical dividers between inline items, set orientation="vertical" and an explicit length.',
    '14. Use nested children[] arrays for structural grouping — do not rely on flat lists alone.',
    '15. Omit optional fields that are at their default value or not needed by the component.',
    '16. Never set attributes.width or attributes.height on image components.',
    '    Image dimensions are determined by the parent container. Use styling.width="100%" and',
    '    styling.height="auto" for responsive images.',
    '17. For charts with many x-axis categories (>8), set attributes.xAxis.tickCount ≤ 8.',
    '    This prevents axis label collision. The renderer will show a tooltip on label hover automatically.',
    '18. counter + button siblings should always be wrapped in a row component to stabilize layout.',
    '19. Every card component MUST have both padding and gutter set.',
    '    Content-only cards: padding="16px", gutter="12px".',
    '    Cards with card-image first child: padding="0", gutter="0"; set padding on card-column for content.',
    '    Every direct card child except card-image MUST have padding set (standard: "16px"; compact: "8px").',
    '20. For rating components: max and value are TOP-LEVEL props (not inside attributes).',
    '    Only set max when a non-standard star count is explicitly requested (default is 5).',
    '    Use readOnly: false only when the user must interactively select a rating.',
    '21. Typography styleVariant applies text modifiers ON TOP of the chosen variant.',
    '    Single modifier: styleVariant="bold". Multiple: styleVariant=["semibold","italic"].',
    '    Weight: "light" < "normal" < "semibold" < "bold".',
    '    Decoration: "underline" for links/emphasis, "strike" for crossed-out text (e.g. old prices).',
    '    Transform: "uppercase" for labels/badges, "lowercase" for normalisation.',
    '    Do NOT use styleVariant to change font size — use size (Display only) or a smaller variant instead.',
    '22. For any free-form component color props such as Icon.fill/fillSvg, Typography.color, Avatar backgroundColor/badgeColor,',
    '    Separator color/labelColor, Header.bgColor, ProgressBar fillColor/backgroundColor, Chart colors and series[].color,',
    '    RadioGroup options[].hex, and AvatarUser.badgeColor, prefer theme color token paths',
    '    before using raw CSS or hex colors.',
    '    Available GridKit tokens — use tokenPath in specs (default-theme values shown for reference only; use tokenPath, never hardcode hex/px):',
    buildTokenVocabulary(),
    '23. Choose the right component based on the request — keyword matching is strict:',
    '    KEYWORD → COMPONENT mapping (apply the FIRST match from top to bottom):',
    '',
    '    "... context carousel for ..." / "context carousel of ..." / "content carousel ..."',
    '    → Use "content-carousel". Trigger: the phrase "context carousel" or "content carousel" anywhere in the request.',
    '    Use for: horizontally scrolling repeated-item collections where items are cards, blocks, or mixed content.',
    '    Use all explicitly requested props: showArrows, showDots, isFocusable, visibleItems, scrollStep,',
    '    scrollAlignment, and styling. Slide content MUST go in children[]; NEVER emit React-only fields like',
    '    items or renderItem. If the request is vertical, use "carousel" instead.',
    '',
    '    "chat bubble ... image gallery ..." / "image gallery in a chat bubble" / "chat bubble with N images"',
    '    → Use "chat-image-gallery". Trigger: ANY request for a gallery, image gallery, photo gallery,',
    '    photo grid, or image collection that is placed inside a chat-bubble — even if the user only says',
    '    "gallery" or "images" without the word "chat".',
    '    Renders the ChatBubble.ImageGallery component — a compact 2x2 image grid with a "+N" overflow',
    '    indicator on the last visible tile.',
    '    Pass images via the top-level "images" array: [{ src: "...", alt: "..." }, ...]. Optional: maxVisible (default 4).',
    '    NEVER use "image-preview" as a child of chat-bubble — "image-preview" is a full preview / lightbox',
    '    UI and is wrong inside chat messages.',
    '',
    '    "... preview for images ..." / "image preview ..." / "preview of images ..."',
    '    → Use "image-preview". Trigger: "preview for images", "preview of images", "image preview", or',
    '    any phrase where "preview" is paired with "images" or "photos".',
    '    Also use "image-preview" for: gallery, image gallery, photo gallery, photo grid, image collection,',
    '    "N images layout vertical", "show images", "image viewer", or any request to display a static',
    '    collection of images — even when the user says "vertical layout".',
    '    NOTE: this routing applies ONLY OUTSIDE of a chat-bubble. Inside a chat-bubble, use',
    '    "chat-image-gallery" instead (see clause above).',
    '    Pass images via the top-level "images" array prop: [{ src: "...", alt: "...", caption: "..." }, ...].',
    '    NEVER use children[] or nested carousel-slide components — image-preview only uses "images".',
    '    Recommended props: showArrows, showThumbnails, showCounter, thumbnailPosition ("bottom" or "left").',
    '',
    '    "... carousel for ..." / "carousel of ..." / "carousel ..."',
    '    → Use "carousel". Trigger: the word "carousel" WITHOUT the prefix "context" or "content".',
    '    Use for: slider, slideshow, animated transition, or any plain carousel interaction — especially',
    '    image-only carousels. Carousel children MUST be carousel-slide components.',
    '    Use props: layout, showArrows, showDots, thumbs, isFocusable, styling.',
    '',
    '    DISAMBIGUATION EXAMPLES:',
    '    "create a context carousel for product cards" → "content-carousel"',
    '    "create a carousel for images" → "carousel"',
    '    "create a preview for images" → "image-preview"',
    '    "carousel of cards" → "content-carousel"',
    '    "image gallery" → "image-preview"',
    '    "chat bubble component with image gallery containing 2 random images" → "chat-image-gallery" (inside "chat-bubble")',
    '    "chat bubble with 4 photos" → "chat-image-gallery" (inside "chat-bubble")',
    '    "generate carousel 7 images" → "carousel"',
    '',
    '24. Use "select" (with multiple: true) for any collapsible picker with checkbox-style multi-selection.',
    '    This includes requests like: "multi-select", "select with checkbox options", "dropdown select",',
    '    "select multiple", "combobox with checkboxes", "select with checkboxes". select is a form control',
    '    with a trigger button that opens a floating list on click; its options are driven by options[].',
    '    Use "dropdown" (with dropdown-item children) ONLY for an always-visible scrollable list that is',
    '    embedded directly and permanently in the page — not a collapsible picker.',
    '    WRONG (collapsible picker): { "type": "dropdown", "children": [{ "type": "dropdown-item" }] }',
    '    RIGHT (collapsible picker): { "type": "select", "multiple": true, "options": [{ "value": "drop", "label": "Drop" }, { "value": "up", "label": "Up" }] }',
  ];

  if (customRules.length === 0) return builtIn.join('\n');

  const custom = customRules.map((rule, i) => `${builtIn.length + 1 + i}. ${rule}`);
  return [
    ...builtIn,
    '',
    '### APPLICATION-SPECIFIC RULES — HIGHEST PRIORITY — OVERRIDE DEFAULTS WHERE THEY CONFLICT',
    'These rules are set by the application and MUST be followed exactly for every response:',
    '',
    ...custom,
  ].join('\n');
}

/**
 * Convenience: build a Gemini-compatible request object for A2UI generation.
 *
 * Usage:
 *   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', ... });
 *   const result = await model.generateContent(buildA2UIGeminiRequest('Show a product card'));
 */
export function buildA2UIGeminiRequest(userMessage: string, options?: Parameters<typeof buildA2UISystemPrompt>[0]) {
  return {
    contents: [
      {
        parts: [
          {
            text: `${buildA2UISystemPrompt(options)}\n\nUser request: ${userMessage}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  };
}
