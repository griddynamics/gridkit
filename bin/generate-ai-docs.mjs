/**
 * Generate AI documentation sections from component schemas.
 *
 * Updates three files (no build required):
 *   - libs/ui/src/ai/README.md                        (## Component Catalog section)
 *   - libs/ui/llms.txt                                (## Available Components section)
 *   - libs/ui/src/ai/a2ui/ui-specification-schema.json (generated from spec-schema.ts)
 *
 * The content between <!-- AUTO-GENERATED:COMPONENTS:START --> and
 * <!-- AUTO-GENERATED:COMPONENTS:END --> markers is replaced entirely.
 *
 * Usage:
 *   node ./bin/generate-ai-docs.mjs
 *   (Typically called via `build:ui` after nx build ui)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as prettier from 'prettier';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Load schemas from source (no build required)
const { aiComponentsSchema } = await import(join(ROOT, 'libs/ui/src/ai/schemas/components.ts'));
const { A2UI_SPEC_SCHEMA } = await import(join(ROOT, 'libs/ui/src/ai/a2ui/spec-schema.ts'));
// Parse icon size tokens directly from source to avoid path-alias resolution issues
const iconTokenSrc = readFileSync(join(ROOT, 'libs/ui/src/tokens/icon.ts'), 'utf8');
const iconTokens = {
  size: Object.fromEntries(
    [...iconTokenSrc.matchAll(/\[SizeVariant\.(\w+)\][^{]*\{[^}]*width:\s*(\d+)/g)].map(([, key, width]) => [
      key.toLowerCase(),
      { width: Number(width) },
    ])
  ),
};

const START_MARKER = '<!-- AUTO-GENERATED:COMPONENTS:START -->';
const END_MARKER = '<!-- AUTO-GENERATED:COMPONENTS:END -->';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function replaceSection(filePath, newContent) {
  const original = readFileSync(filePath, 'utf8');
  const startIdx = original.indexOf(START_MARKER);
  const endIdx = original.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`  ✗ Markers not found in ${filePath}`);
    process.exit(1);
  }

  const before = original.slice(0, startIdx + START_MARKER.length);
  const after = original.slice(endIdx);
  const updated = `${before}\n${newContent}\n${after}`;

  writeFileSync(filePath, updated, 'utf8');
  console.log(`  ✓ Updated ${filePath.replace(ROOT + '/', '')}`);
}

/** Derive the prop summary line (key props only) */
function buildPropSummary(props) {
  if (!props || props.length === 0) return '';
  const parts = props.slice(0, 6).map((p) => {
    if (p.enum && p.enum.length > 0) {
      return `\`${p.name}\`: ${p.enum.map((v) => `"${v}"`).join('|')}`;
    }
    return `\`${p.name}\`: ${p.type}`;
  });
  const suffix = props.length > 6 ? ` *(+${props.length - 6} more)*` : '';
  return `\n  **Props:** ${parts.join(', ')}${suffix}`;
}

/** Format a list of strings as indented bullet points */
function bulletList(items) {
  return items.map((s) => `  - ${s}`).join('\n');
}

/** Format an object as indented key: value lines */
function objectLines(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `  - **${k}:** ${v}`)
    .join('\n');
}

/** Format quickStart object as indented code snippets */
function quickStartLines(qs) {
  return Object.entries(qs)
    .map(([k, v]) => `  - ${k}: \`${v}\``)
    .join('\n');
}

/** Format commonPatterns object as indented entries */
function commonPatternsLines(patterns) {
  return Object.entries(patterns)
    .map(([name, { code, useCase }]) => `  - **${name}** (${useCase}): \`${code}\``)
    .join('\n');
}

/** Group components by their `category` field (or 'Other' if absent) */
function groupByCategory(components) {
  const groups = new Map();
  for (const comp of components) {
    const cat = comp.category ?? 'Other';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(comp);
  }
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// README.md  — full catalog with prop tables
// ─────────────────────────────────────────────────────────────────────────────

/** Build an aligned markdown table from a 2D array of cell strings */
function buildAlignedTable(rows) {
  const colWidths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  const pad = (cell, width) => cell.padEnd(width);
  const lines = [];
  lines.push('| ' + rows[0].map((cell, i) => pad(cell, colWidths[i])).join(' | ') + ' |');
  lines.push('| ' + colWidths.map((w) => '-'.repeat(w)).join(' | ') + ' |');
  for (const row of rows.slice(1)) {
    lines.push('| ' + row.map((cell, i) => pad(cell, colWidths[i])).join(' | ') + ' |');
  }
  return lines;
}

function buildReadmeSection(components) {
  const groups = groupByCategory(components);
  const total = components.length;
  const lines = [
    '',
    `_${total} components total — generated from \`libs/ui/src/ai/schemas/\` on ${new Date()
      .toISOString()
      .slice(0, 10)}._`,
    '',
  ];

  for (const [cat, comps] of groups) {
    lines.push(`### ${cat}`, '');
    for (const comp of comps) {
      lines.push(`#### ${comp.name}`, '');
      lines.push(`**Complexity:** ${comp.complexity ?? 'N/A'} | **Import:** \`${comp.import}\``, '');
      lines.push(comp.description, '');

      if (comp.props && comp.props.length > 0) {
        const tableRows = [['Prop', 'Type', 'Description']];
        for (const p of comp.props.slice(0, 8)) {
          const type = p.enum
            ? p.enum.map((v) => `\`"${v}"\``).join(' \\| ')
            : p.type.includes(' | ')
              ? p.type
                  .split(' | ')
                  .map((t) => `\`${t}\``)
                  .join(' \\| ')
              : `\`${p.type}\``;
          const desc = (p.description ?? '').replace(/\|/g, '\\|');
          tableRows.push([`\`${p.name}\``, type, desc]);
        }
        if (comp.props.length > 8) {
          tableRows.push([`_...+${comp.props.length - 8} more_`, '', '']);
        }
        lines.push('<!-- prettier-ignore -->', ...buildAlignedTable(tableRows), '');
      }

      if (comp.examples && comp.examples.length > 0) {
        lines.push('**Example:**', '', '<!-- prettier-ignore -->', '```tsx', comp.examples[0], '```', '');
      }
    }
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// llms.txt  — compact list for LLM consumption
// ─────────────────────────────────────────────────────────────────────────────

function buildLlmsTxtSection(components) {
  const groups = groupByCategory(components);
  const total = components.length;
  const lines = [
    `${total} components total — generated from libs/ui/src/ai/schemas/ on ${new Date().toISOString().slice(0, 10)}.`,
    '',
  ];

  for (const [cat, comps] of groups) {
    lines.push(`## ${cat}`, '');
    for (const comp of comps) {
      lines.push(`### ${comp.name}`, '');
      lines.push(`Import: \`${comp.import}\``, '');
      lines.push(comp.description, '');

      const propSummary = buildPropSummary(comp.props);
      if (propSummary) {
        lines.push(propSummary.trim(), '');
      }

      if (comp.quickStart) {
        lines.push('**Quick Start:**');
        lines.push(quickStartLines(comp.quickStart), '');
      }

      if (comp.commonPatterns) {
        lines.push('**Common Patterns:**');
        lines.push(commonPatternsLines(comp.commonPatterns), '');
      }

      if (comp.bestPractices?.length) {
        lines.push('**Best Practices:**');
        lines.push(bulletList(comp.bestPractices), '');
      }

      if (comp.compositionTips?.length) {
        lines.push('**Composition Tips:**');
        lines.push(bulletList(comp.compositionTips), '');
      }

      if (comp.troubleshooting) {
        lines.push('**Troubleshooting:**');
        lines.push(objectLines(comp.troubleshooting), '');
      }

      if (comp.examples?.length) {
        lines.push('**Examples:**');
        for (const ex of comp.examples) {
          lines.push(`  \`${ex}\``);
        }
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// ui-specification-schema.json — generated from spec-schema.ts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrap the A2UI_SPEC_SCHEMA with standard JSON Schema draft-07 metadata
 * and write it to ui-specification-schema.json.
 *
 * A2UI_SPEC_SCHEMA is already a valid JSON Schema object — it just needs
 * the $schema/$id/title/description envelope to be a complete schema file.
 */
async function writeUiSpecSchema(schema) {
  // Deep-clone so we can mutate without affecting A2UI_SPEC_SCHEMA (used by Gemini as flat schema)
  const s = JSON.parse(JSON.stringify(schema));

  // Enrich the `size` field from icon tokens — adds xxl and describes each token's px dimensions
  const sizeTokenEntries = Object.entries(iconTokens.size);
  const sizeEnum = sizeTokenEntries.map(([key]) => key);
  const sizeDescription = sizeTokenEntries.map(([key, { width }]) => `${key}=${width}px`).join(', ');
  const componentSize = s.properties?.ui?.properties?.components?.items?.properties?.size;
  if (componentSize) {
    componentSize.enum = sizeEnum;
    componentSize.description = `Size token. For icon: resolves to fixed px dimensions (${sizeDescription}). For other components: semantic size (xs–xxl).`;
  }
  const ui = s.properties?.ui?.properties;
  const definitions = {};

  // ── Layout ──────────────────────────────────────────────────────────────────
  if (ui?.layout) {
    const layout = ui.layout;
    // Extract ResponsiveLayout from any one breakpoint (all three are identical)
    const responsive = layout.properties?.responsive?.properties;
    if (responsive?.mobile) {
      definitions.ResponsiveLayout = responsive.mobile;
      responsive.mobile = { $ref: '#/definitions/ResponsiveLayout' };
      responsive.tablet = { $ref: '#/definitions/ResponsiveLayout' };
      responsive.desktop = { $ref: '#/definitions/ResponsiveLayout' };
    }
    definitions.Layout = layout;
    ui.layout = { $ref: '#/definitions/Layout' };
  }

  // ── Component ────────────────────────────────────────────────────────────────
  const componentItem = ui?.components?.items;
  if (componentItem) {
    const props = componentItem.properties;

    // Extract Option
    if (props?.options?.items) {
      definitions.Option = props.options.items;
      props.options.items = { $ref: '#/definitions/Option' };
    }
    // Extract TableColumn
    if (props?.columns?.items) {
      definitions.TableColumn = props.columns.items;
      props.columns.items = { $ref: '#/definitions/TableColumn' };
    }
    // Extract Styling
    if (props?.styling) {
      definitions.Styling = props.styling;
      props.styling = { $ref: '#/definitions/Styling' };
    }

    definitions.Component = componentItem;
    ui.components.items = { $ref: '#/definitions/Component' };
  }

  // ── Action ───────────────────────────────────────────────────────────────────
  if (ui?.actions?.items) {
    definitions.Action = ui.actions.items;
    ui.actions.items = { $ref: '#/definitions/Action' };
  }

  // ── Validation + ValidationRule ──────────────────────────────────────────────
  if (ui?.validations?.items) {
    const validation = ui.validations.items;
    if (validation.properties?.rules?.items) {
      definitions.ValidationRule = validation.properties.rules.items;
      validation.properties.rules.items = { $ref: '#/definitions/ValidationRule' };
    }
    definitions.Validation = validation;
    ui.validations.items = { $ref: '#/definitions/Validation' };
  }

  const jsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://cerebra.griddynamics.net/schemas/ui-specification/v1.0.0',
    title: 'Cerebra Agent UI Specification',
    description:
      'Universal UI specification format for agent-to-UI communication using GD Design Library. Auto-generated from libs/ui/src/ai/a2ui/spec-schema.ts — do not edit manually.',
    ...s,
    definitions,
  };

  const outputPath = join(ROOT, 'libs/ui/src/ai/a2ui/ui-specification-schema.json');
  const prettierConfig = await prettier.resolveConfig(outputPath);
  const formatted = await prettier.format(JSON.stringify(jsonSchema), {
    ...prettierConfig,
    filepath: outputPath,
  });
  writeFileSync(outputPath, formatted, 'utf8');
  console.log(`  ✓ Updated ${outputPath.replace(ROOT + '/', '')}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const components = aiComponentsSchema.components;
console.log(`Loaded ${components.length} components from schemas.`);

replaceSection(join(ROOT, 'libs/ui/src/ai/README.md'), buildReadmeSection(components));

replaceSection(join(ROOT, 'libs/ui/llms.txt'), buildLlmsTxtSection(components));

await writeUiSpecSchema(A2UI_SPEC_SCHEMA);

console.log('\nDone.');
