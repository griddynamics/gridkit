/** Storybook `argTypes` entry for a CSS-property argument, matching the shape used by the source stories:
 * `CSS <property> property`, a `text` control (or the given one) and a `table` category and type. */
export const cssArg = (
  property: string,
  category: string,
  extra: { control?: unknown; options?: string[]; type?: string } = {}
) => ({
  description: `CSS ${property} property`,
  control: extra.control ?? 'text',
  ...(extra.options ? { options: extra.options } : {}),
  table: { category, type: { summary: extra.type ?? 'string | number' } },
});

export const BOX_STYLES_SIZING = 'Box Styles - Layout & Sizing';
export const BOX_STYLES_SPACING = 'Box Styles - Spacing';
export const BOX_STYLES_FLEXBOX = 'Box Styles - Flexbox';
export const BOX_STYLES_POSITION = 'Box Styles - Position & Display';
