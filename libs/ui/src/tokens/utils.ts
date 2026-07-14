import { keyframes, type CSSObject } from '@emotion/react';

import { defaultTheme } from '@tokens';
import { TabIndex, type BoxComputedStyles, type BoxStyles, type EnumOrPrimitive, type InlineBoxStyles } from '@types';
import type { DefaultTheme } from '@hooks';
import { get } from '@utils';

import { BOX_STYLE_PROPS } from './constants';
import { colors } from './colors';
import { spacing } from './spacing';

import { Unit, type FocusStyles, type SpacingKey } from './types/index.types';

export const generateStateStyles = (color: keyof typeof colors) => ({
  // hover: { background: get(colors, `types.${color}.dark`, colors?.hover) },
  // active: { background: get(colors, `types.${color}.darker`, colors?.active) },
  focus: { outline: `${convertToUnit(2, Unit.Rem)} solid ${colors?.[color]}` },
  disabled: {
    // background: colors?.disabled,
    // color: colors?.disabledText,
    cursor: 'not-allowed',
    border: 0,
  },
});

export const convertJsonToCssKeyframeCss = (keyframeJson: Record<string, CSSObject> = {}) => {
  const cssString = Object.entries(keyframeJson).reduce((keyframeString: string, keyframe: [string, object]) => {
    const [frameKey, frameVal] = keyframe as [string, Record<string, string>];

    for (const animationKey in frameVal) {
      keyframeString += `${frameKey} { ${animationKey}: ${frameVal[animationKey]} } `;
    }

    return keyframeString;
  }, '');

  return keyframes`${cssString}`;
};

export const convertToUnit = (value: string | number, unit: EnumOrPrimitive<Unit> = Unit.Px) => {
  const formattedValue = typeof value === 'number' ? value : parseFloat(value);
  switch (unit) {
    case Unit.Rem:
      return `${formattedValue / 16}${unit}`; // Assuming 1rem = 16px
    case Unit.Percents:
      return `${formattedValue / 100}${unit}`;
    default:
      return `${formattedValue}${unit}`;
  }
};

export const getSpacing = (
  sizeKey: EnumOrPrimitive<SpacingKey> | number = 'sm',
  unit: EnumOrPrimitive<Unit> = 'px'
): string | number => {
  const value = typeof sizeKey === 'number' ? parseFloat(spacing.xs) * sizeKey : spacing[sizeKey];
  return convertToUnit(value, unit);
};

export const hexToRgba = (hex: string, alpha = 1) => {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return `rgba(${isNaN(r) ? 0 : r}, ${isNaN(g) ? 0 : g}, ${isNaN(b) ? 0 : b}, ${alpha})`;
};

export const getFocusStyles = ({ inset, borderRadius, border }: FocusStyles) => {
  return {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: inset,
      right: inset,
      bottom: inset,
      left: inset,
      border,
      borderRadius,
    },
  };
};

export const getBoxStyles = (
  boxStyles: BoxStyles<number> = {}
): { boxStyles: BoxComputedStyles<TabIndex>; restProps: BoxComputedStyles<TabIndex> } => {
  return Object.entries(boxStyles).reduce(
    (
      computedStyles: { boxStyles: BoxComputedStyles<TabIndex>; restProps: BoxComputedStyles<TabIndex> },
      [selector, value]: [string, string | boolean | TabIndex | undefined]
    ) => {
      const formattedSelector = selector.replace('$', '');
      const isBoxProp = BOX_STYLE_PROPS.includes(formattedSelector);
      if (typeof value !== 'undefined') {
        computedStyles[isBoxProp ? 'boxStyles' : 'restProps'][formattedSelector] = value;
      }

      return computedStyles;
    },
    { boxStyles: {}, restProps: {} }
  );
};

const normalizeBrandScale = (scale: string) => {
  if (scale === '500') {
    return '50';
  }

  if (/^\d00$/.test(scale)) {
    return scale.slice(0, 2);
  }

  return scale;
};

const normalizeThemeColorPath = (color: string) => {
  const normalized = color
    .replace(/^theme\.colors\./, '')
    .replace(/^theme\.palette\./, '')
    .replace(/^colors\./, '')
    .replace(/^color\./, '')
    .replace(/^palette\./, '')
    .replace(/^theme\./, '');

  const paletteMainAliases: Record<string, string> = {
    'primary.main': 'primary.default',
    'secondary.main': 'secondary.default',
    'error.main': 'bg.fill.error.primary.default',
    'success.main': 'bg.fill.success.primary.default',
    'warning.main': 'bg.fill.warning.primary.default',
    'info.main': 'bg.fill.info.primary.default',
  };

  const brandMatch = normalized.match(/^brand\.(\d{2,3})$/);
  if (brandMatch) {
    return `yellow.${normalizeBrandScale(brandMatch[1])}`;
  }

  if (normalized in paletteMainAliases) {
    return paletteMainAliases[normalized];
  }

  return normalized;
};

export const resolveThemeColor = (themeColors: DefaultTheme['colors'] | undefined, color?: string) => {
  if (typeof color !== 'string' || color.length === 0) {
    return color;
  }

  const resolved = get(themeColors, normalizeThemeColorPath(color), color);
  // Color scale names like "blue" or "green" resolve to scale objects, not CSS strings.
  // Fall back to the raw value so they render as valid CSS colors.
  return typeof resolved === 'string' ? resolved : color;
};

export const convertToInlineBoxStyles = (boxStyles: InlineBoxStyles = {}): Record<string, string | number | never> => {
  return Object.entries(boxStyles).reduce(
    (
      computedStyles: Record<string, string | number | never>,
      [selector, value]: [string, string | number | undefined]
    ) => {
      const formattedSelector = BOX_STYLE_PROPS.includes(selector) ? `$${selector}` : selector;

      if (value) {
        computedStyles[formattedSelector] = value;
      }

      return computedStyles;
    },
    {}
  );
};

export const getImgSrc = (src: string, metaData = 'data:image/svg+xml') => {
  return `url("${metaData},${encodeURIComponent(src)}")`;
};

export const getMediaQuery = (breakpoints: { min?: string; max?: string }, styles: CSSObject) => {
  if (!breakpoints.min && !breakpoints.max) return {};

  const breakpointKeys = [
    breakpoints.min && `(min-width: ${breakpoints.min})`,
    breakpoints.max && `(max-width: ${breakpoints.max})`,
  ]
    .filter(Boolean)
    .join(' and ');

  return {
    [`@media ${breakpointKeys}`]: styles,
  };
};

// Create a Proxy to handle 'this' binding
export const tokensHandler = (theme: Partial<DefaultTheme>): ProxyHandler<Record<string, unknown>> => ({
  get(target: Partial<DefaultTheme>, prop: keyof typeof defaultTheme) {
    // Get the value from the target object
    const value = target[prop];
    // If the value is a function, bind its 'this' to objectB
    if (typeof value === 'function') {
      return value.call(null, theme);
    }

    // If the value is an object, wrap it in a new Proxy with the same handler
    if (value && typeof value === 'object') {
      return new Proxy(value, tokensHandler(theme));
    }

    // Otherwise, return the value as-is
    return value;
  },
});
