import { type A2UIImageSources, normalizeImageSources } from './a2ui/image-policy';
import { aiComponentsSchema, aiPromptGuidelines, type ComponentSchema } from './schemas/components';
import { getComponentSchema } from './discovery';

export type ClaudePromptOptions = {
  imageSources?: A2UIImageSources;
};

function buildImageSourcingGuardrails(imageSources?: A2UIImageSources): string[] {
  const hosts = normalizeImageSources(imageSources);

  if (!hosts?.length) {
    return [
      '- Image/Card.Image: use only direct browser-loadable image asset URLs from any public CDN.',
      '- Image/Card.Image: do not use webpage URLs, product pages, search results, or hotlink-protected links.',
      '- Image/Card.Image: if you cannot provide a high-confidence public image asset URL, omit the image instead of guessing.',
    ];
  }

  const allowedHosts = hosts.join(', ');
  return [
    `- Image/Card.Image: use only direct asset URLs from these hosts: ${allowedHosts}.`,
    '- Image/Card.Image: use direct browser-loadable image asset URLs, not webpage URLs, product pages, search results, or hotlink-protected links.',
    '- Image/Card.Image: if you cannot provide a high-confidence public image asset URL from an allowed host, omit the image instead of guessing.',
  ];
}

/**
 * Generate guardrails from component schemas
 */
function generateGuardrails(imageSources?: A2UIImageSources): string {
  const guardrails: string[] = [];

  // Extract guardrails from component schemas
  aiComponentsSchema.components.forEach((component) => {
    const schema = component as any;

    // Icon name guardrails
    if (component.name === 'Icon' && schema.availableIcons) {
      guardrails.push(
        `- Icon: ONLY use these icon names: ${schema.availableIcons.join(', ')}. ` +
          `Do NOT use: "add" (use plus), "chevronRight" (use arrowRight), "settings", etc.`
      );
    }

    // Extract from best practices (lines starting with CRITICAL:)
    if (schema.bestPractices) {
      schema.bestPractices.forEach((bp: string) => {
        if (bp.startsWith('CRITICAL:') || bp.startsWith('IMPORTANT:')) {
          guardrails.push(`- ${component.name}: ${bp.replace(/^(CRITICAL:|IMPORTANT:)\s*/i, '')}`);
        }
      });
    }
  });

  // Component-specific guardrails (hardcoded for critical ones)
  guardrails.push(
    '- Row/Column/Card.Row/Card.Column: use isWrap (boolean), NOT wrap. IMPORTANT: isWrap defaults to true, use isWrap={false} to prevent wrapping.',
    '- Image and Card.Image: width and height props are numbers only (e.g., width={96}, not width="96px").',
    '- Card: supports withShadowHover for elevation effect on hover. Combine with backgroundColor="#fff" and cursor: "pointer" for interactive cards.',
    '- Card.Title and other Card subcomponents sizeVariant only accepts CardSizeVariant.Default or CardSizeVariant.Sm.',
    '- Counter and Card.Counter use initial (not value) for starting quantity; onCounterChange is the change handler.',
    '- Button variant must be one of: Primary, Secondary, Tertiary, Outlined, Text, Inherit. Do NOT use any other than that.',
    '- Box: use variant="horizontal" or variant="vertical" (defaults to "vertical"). Supports isBordered, isHighlighted, withShadowHover props. Prefer Box over raw divs for all container needs.',
    '- Typography: variant="caption" renders a real <caption> element. Outside actual table captions, always set as="div" for block metadata or as="span" for inline metadata to avoid invalid DOM nesting.',
    '- For any free-form component color props (for example Icon.fill/fillSvg, Typography.color, Avatar backgroundColor/badgeColor, Separator color/labelColor, Header.bgColor, ProgressBar fillColor/backgroundColor, Chart colors and series[].color, RadioGroup options[].hex, and AvatarUser.badgeColor), prefer theme color token paths such as "icon.primary", "text.secondary", or "bg.fill.secondary" before raw CSS or hex colors.'
  );

  guardrails.push(...buildImageSourcingGuardrails(imageSources));

  return guardrails.join('\n');
}

export function buildClaudeGridkitSystemPrompt(options?: ClaudePromptOptions): string {
  const componentsList = aiComponentsSchema.components.map((c) => `- ${c.name}: ${c.description}`).join('\n');
  const compositionTips = aiComponentsSchema.compositionTips.map((t) => `- ${t}`).join('\n');
  const guidelines = aiPromptGuidelines.map((t) => `- ${t}`).join('\n');
  const componentNames = aiComponentsSchema.components.map((c) => c.name).join(', ');
  const guardrails = generateGuardrails(options?.imageSources);

  return [
    'You are Claude Code acting as a senior React UI engineer. Your job is to output production-grade TSX using the GridKit UI package named "gd-design-library".',
    '',
    'Hard requirements:',
    '- Output ONLY valid TSX/TypeScript React code. Do NOT include markdown fences or extra commentary.',
    "- Import UI primitives exclusively from 'gd-design-library' (e.g., import { Form, Input, Button, Typography, Box, FlexContainer, Column, Card, Link } from 'gd-design-library').",
    `- Prefer composition using ALL ${aiComponentsSchema.components.length} available components over custom CSS or HTML elements.`,
    `- Always use the appropriate component from the library: ${componentNames}.`,
    '- Ensure accessibility: use Label components for all form controls, aria attributes, keyboard focus order, and sensible defaults.',
    '- Keep code self-contained as a single React component file where feasible.',
    '',
    'API constraints (must-follow guardrails specific to gd-design-library):',
    guardrails,
    '',
    'Available components (all must be considered for composition):',
    componentsList,
    '',
    'Composition tips:',
    compositionTips,
    '',
    'General guidelines:',
    guidelines,
    '',
    'Output rules:',
    '- No markdown backticks.',
    '- No external CSS files unless strictly necessary; prefer component props and layout primitives.',
    '- Keep imports minimal and from one source: gd-design-library.',
    '- If state is needed, use React useState inside the component.',
    '- Handle forms with <Form> and Input variants (email, password, checkbox, etc.).',
    '- Add basic error placeholders and comments where integration points are expected (e.g., TODO: submit handler).',
  ].join('\n');
}

/**
 * Claude Code – System Prompt for generating React/TSX with gd-design-library (GridKit)
 * This constant is intended as the "system" instruction for the LLM.
 */
export const CLAUDE_GRIDKIT_SYSTEM_PROMPT: string = buildClaudeGridkitSystemPrompt();

/**
 * Format component details for contextual prompts
 */
function formatComponentDetails(schema: ComponentSchema): string {
  const schemaAny = schema as any;
  const props = schema.props.map((p) => `- ${p.name}: ${p.type} - ${p.description || ''}`).join('\n');
  const examples = schemaAny.examples?.slice(0, 3).join('\n') || '';
  const quickStart = schemaAny.quickStart ? Object.values(schemaAny.quickStart).slice(0, 2).join('\n') : '';

  return [
    `## ${schema.name}`,
    schema.description,
    '',
    'Props:',
    props,
    '',
    'Quick Start:',
    quickStart,
    '',
    'Examples:',
    examples,
  ].join('\n');
}

/**
 * Builds a task-specific instruction for Claude Code appended after the system prompt.
 */
export function buildClaudeSystemPrompt(userRequest: string, options?: ClaudePromptOptions): string {
  return [buildClaudeGridkitSystemPrompt(options), '', 'Task:', userRequest].join('\n');
}

/**
 * Build contextual prompt with specific component details
 */
export function buildContextualPrompt(
  userRequest: string,
  context?: {
    components?: string[];
    patterns?: string[];
    constraints?: string[];
  },
  options?: ClaudePromptOptions
): string {
  const basePrompt = buildClaudeSystemPrompt(userRequest, options);

  if (context?.components && context.components.length > 0) {
    const componentSchemas = context.components
      .map((name) => getComponentSchema(name))
      .filter((schema): schema is ComponentSchema => schema !== undefined);

    if (componentSchemas.length > 0) {
      const detailedDocs = componentSchemas.map((schema) => formatComponentDetails(schema)).join('\n\n');

      return `${basePrompt}\n\nDetailed Component Documentation:\n${detailedDocs}`;
    }
  }

  return basePrompt;
}

/**
 * Legacy/basic builder retained for compatibility.
 */
export function buildGDLibraryPrompt(userRequest: string): string {
  return buildClaudeSystemPrompt(userRequest);
}

/**
 * Build prompt optimized for GPT-4 (OpenAI)
 */
export function buildGPT4Prompt(
  userRequest: string,
  options?: ClaudePromptOptions
): Array<{ role: string; content: string }> {
  return [
    {
      role: 'system',
      content: buildClaudeGridkitSystemPrompt(options),
    },
    {
      role: 'user',
      content: userRequest,
    },
  ];
}

/**
 * Build prompt optimized for Gemini (Google)
 */
export function buildGeminiPrompt(
  userRequest: string,
  options?: ClaudePromptOptions
): {
  contents: Array<{ parts: Array<{ text: string }> }>;
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
  };
} {
  return {
    contents: [
      {
        parts: [
          {
            text: `${buildClaudeGridkitSystemPrompt(options)}\n\nTask: ${userRequest}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  };
}

export const defaultAIPromptIntro =
  `Use gd-design-library for all UI components. Utilize the available ${aiComponentsSchema.components.length} components from the library itself — do not import from any other UI packages. ` +
  'The library follows Atomic Design methodology with four levels: ' +
  'ATOMS (basic building blocks): Avatar, Badge, Box, Button, Checkbox, Icon, Image, Input, InputFile, Label, Link, Loader, Select, Separator, Skeleton, Slider, SliderDots, Switch, Textarea, Toggle, Truncate, Typography, Wrapper. ' +
  'MOLECULES (simple combinations): Accordion, Breadcrumbs, Counter, Dropdown, DropdownItem, Form, InlineNotification, List, Menu, Price, ProgressBar, RadioGroup, Rating, Snackbar, Stepper, Table, Tabs, Tooltip. ' +
  'ORGANISMS (complex UI sections): Card, Carousel, Chart, ChatBubble, ContentCarousel, DragAndDropFiles, Header, Modal, Search, SearchModal. ' +
  'LAYOUT (structure & arrangement): ChatContainer, Column, FlexContainer, Portal, Row, Scroll. ' +
  'WIDGETS (workflow composites): DragAndDrop. ' +
  'Theme: wrap the app with the ThemeProvider (see useTheme.provider) and access theme via useTheme hook. ' +
  'Prefer composition using these primitives over custom CSS. Always ensure proper accessibility with Label components for form controls. ' +
  'If the UI includes remote images, use only direct public image asset URLs from any public CDN. Omit the image component if a stable direct asset URL is not available.';
