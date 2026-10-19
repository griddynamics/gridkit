/**
 * A CSS-in-JS style block — a flat set of CSS properties, optionally with nested pseudo-
 * selector/pseudo-element keys (e.g. `'&:hover, &.hover'`, `'&::after'`) mapping to another
 * block, exactly like `libs/ui/src/tokens/*.ts`'s own object shape and how Emotion's `css`
 * prop compiles it. Used to serialize resolved React tokens into Lit adopted-stylesheet text.
 */
export interface ButtonCssBlock {
  [property: string]: string | number | ButtonCssBlock;
}

function toKebabCase(property: string): string {
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

// Kept in sync with the unitless-number behavior used by React/Emotion. Numeric values in
// CSS-in-JS are pixels unless the property is intrinsically unitless; emitting `width: 300`
// silently drops the declaration in a browser and breaks the public `styles` contract.
const UNITLESS_CSS_PROPERTIES = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
]);

/** Serialize a CSS-in-JS scalar with the same numeric unit semantics as React/Emotion. */
export function cssPropertyValueToText(property: string, value: string | number): string {
  const unprefixed = property.replace(/^(?:Webkit|Moz|ms|O)(?=[A-Z])/, '');
  const normalizedProperty = unprefixed[0] ? `${unprefixed[0].toLowerCase()}${unprefixed.slice(1)}` : property;
  if (
    typeof value !== 'number' ||
    value === 0 ||
    property.startsWith('--') ||
    UNITLESS_CSS_PROPERTIES.has(normalizedProperty)
  ) {
    return String(value);
  }
  return `${value}px`;
}

/**
 * Serializes one `ButtonCssBlock` (or any nested slice of a token tree) into real CSS
 * text under `selector` — the same compilation Emotion's `css` prop does for the real
 * component's object styles, just done by hand for a Lit adopted stylesheet. Nested
 * selector keys (containing `&`) recurse, replacing `&` with `selector` (so `'&:hover,
 * &.hover'` under `selector='button'` becomes `'button:hover, button.hover'`); plain keys
 * become `kebab-case: value;` declarations. Empty blocks (e.g. `inherit`'s `'&:hover, &.hover':
 * {}`) emit nothing rather than a pointless empty rule.
 */
export function buttonCssBlockToText(selector: string, block: ButtonCssBlock | undefined): string {
  if (!block) return '';

  let declarations = '';
  let nested = '';

  for (const [key, value] of Object.entries(block)) {
    if (value === undefined) continue;
    if (typeof value === 'object') {
      const nestedSelector = key
        .split(',')
        .map((part) => part.trim().replace(/&/g, selector))
        .join(', ');
      nested += buttonCssBlockToText(nestedSelector, value);
    } else {
      declarations += `${toKebabCase(key)}: ${cssPropertyValueToText(key, value)};\n`;
    }
  }

  return (declarations ? `${selector} {\n${declarations}}\n` : '') + nested;
}

/** Serialize resolved design-token keyframes into one valid CSS `@keyframes` rule. */
export function cssKeyframesToText(name: string, frames: Record<string, ButtonCssBlock> | undefined): string {
  if (!name || !frames) return '';

  const steps = Object.entries(frames)
    .map(([selector, block]) => buttonCssBlockToText(selector, block))
    .filter(Boolean)
    .join('');

  return steps ? `@keyframes ${name} {\n${steps}}\n` : '';
}
