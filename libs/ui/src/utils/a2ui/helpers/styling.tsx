import type { CSSObject } from '@emotion/react';
import type { A2UIComponent, A2UIStyling } from '../../../ai';
import type { StyleValue, InlineStyleKey } from '../types';
import { INLINE_STYLE_PROP_KEYS } from '../constants';

export function getComponentStyles(styling?: A2UIStyling) {
  return styling as unknown as CSSObject | undefined;
}

export function getLegacyStyles(component: A2UIComponent) {
  const legacyStyles = (component as A2UIComponent & { styles?: A2UIStyling }).styles;
  return legacyStyles && typeof legacyStyles === 'object' && !Array.isArray(legacyStyles) ? legacyStyles : undefined;
}

export function getInlineStyleProps(component: A2UIComponent, excludedKeys: readonly InlineStyleKey[] = []) {
  const inlineStyles: Record<string, StyleValue> = {};
  const componentRecord = component as unknown as Record<InlineStyleKey, StyleValue>;
  const excluded = new Set(excludedKeys);

  INLINE_STYLE_PROP_KEYS.forEach((key) => {
    if (excluded.has(key)) {
      return;
    }

    const value = componentRecord[key];
    if (typeof value === 'string' || typeof value === 'number') {
      inlineStyles[key] = value;
    }
  });

  return Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined;
}

export function getMergedComponentStyles(
  component: A2UIComponent,
  extraStyles?: Record<string, StyleValue>,
  excludedInlineKeys: readonly InlineStyleKey[] = []
) {
  const mergedStyles = {
    ...(getInlineStyleProps(component, excludedInlineKeys) ?? {}),
    ...(getLegacyStyles(component) ?? {}),
    ...(component.styling ?? {}),
    ...(extraStyles ?? {}),
  };

  return Object.keys(mergedStyles).length > 0 ? (mergedStyles as unknown as CSSObject) : undefined;
}
