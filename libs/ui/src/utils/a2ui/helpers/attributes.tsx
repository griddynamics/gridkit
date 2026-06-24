'use client';

import type { A2UIComponent } from '../../../ai';

export function getAttributeString(component: A2UIComponent, key: string): string | undefined {
  const value = component.attributes?.[key];
  return typeof value === 'string' ? value : undefined;
}

export function getAttributeNumber(component: A2UIComponent, key: string): number | undefined {
  const value = component.attributes?.[key];

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function getAttributeBoolean(component: A2UIComponent, key: string): boolean | undefined {
  const value = component.attributes?.[key];

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }

  return undefined;
}

export function getTopLevelBoolean(component: A2UIComponent, key: string): boolean | undefined {
  const value = (component as A2UIComponent & Record<string, unknown>)[key];

  if (typeof value === 'boolean') {
    return value;
  }

  return getAttributeBoolean(component, key);
}

export function getTopLevelString(component: A2UIComponent, key: string): string | undefined {
  const value = (component as A2UIComponent & Record<string, unknown>)[key];

  if (typeof value === 'string') {
    return value;
  }

  return getAttributeString(component, key);
}

export function getLeadingIconName(component: A2UIComponent) {
  return getTopLevelString(component, 'iconStart') || getTopLevelString(component, 'icon');
}

export function getPortalContainer(component: A2UIComponent) {
  if (typeof document === 'undefined') return undefined;
  const selector = getTopLevelString(component, 'container');
  if (!selector) return undefined;
  return document.querySelector(selector) ?? undefined;
}

export function getAttributeObject<T extends Record<string, unknown>>(
  component: A2UIComponent,
  key: string
): T | undefined {
  const value = component.attributes?.[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as T) : undefined;
}

export function getAttributeStringArray(component: A2UIComponent, key: string): string[] | undefined {
  const value = component.attributes?.[key];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const stringValues = value.filter((item): item is string => typeof item === 'string');
  return stringValues.length > 0 ? stringValues : undefined;
}

export function getComponentStringArray(component: A2UIComponent, key: string): string[] | undefined {
  const value = (component as A2UIComponent & Record<string, unknown>)[key];

  if (Array.isArray(value)) {
    const stringValues = value.filter((item): item is string => typeof item === 'string');
    return stringValues.length > 0 ? stringValues : undefined;
  }

  return getAttributeStringArray(component, key);
}
