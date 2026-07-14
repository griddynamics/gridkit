import type { ReactNode } from 'react';
import { Icon } from '@components';
import type { A2UIComponent } from '../../../ai';
import type { DispatchAction } from '../types';
import { getAttributeString } from './attributes';

export function getComponentText(component: A2UIComponent): string {
  if (typeof component.label === 'string' && component.label.length > 0) {
    return component.label;
  }

  if (typeof component.value === 'string' || typeof component.value === 'number') {
    return String(component.value);
  }

  return '';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isA2UIChildComponent(value: unknown): value is A2UIComponent {
  return isRecord(value) && typeof value['id'] === 'string' && typeof value['type'] === 'string';
}

export function getComponentArrayField(component: A2UIComponent, fieldName: string): A2UIComponent[] {
  const topLevelValue = (component as Record<string, unknown>)[fieldName];

  if (Array.isArray(topLevelValue)) {
    return topLevelValue.filter(isA2UIChildComponent);
  }

  const attributeValue = component.attributes?.[fieldName];
  if (Array.isArray(attributeValue)) {
    return attributeValue.filter(isA2UIChildComponent);
  }

  return [];
}

export function getObjectField(component: A2UIComponent, fieldName: string): Record<string, unknown> | undefined {
  const topLevelValue = (component as Record<string, unknown>)[fieldName];
  if (isRecord(topLevelValue)) {
    return topLevelValue;
  }

  const attributeValue = component.attributes?.[fieldName];
  return isRecord(attributeValue) ? attributeValue : undefined;
}

export function getObjectArrayField(component: A2UIComponent, fieldName: string): Record<string, unknown>[] {
  const topLevelValue = (component as Record<string, unknown>)[fieldName];

  if (Array.isArray(topLevelValue)) {
    return topLevelValue.filter(isRecord);
  }

  const attributeValue = component.attributes?.[fieldName];
  if (Array.isArray(attributeValue)) {
    return attributeValue.filter(isRecord);
  }

  return [];
}

export function renderComponentSlot(
  renderChildren: (children?: A2UIComponent[]) => ReactNode[],
  children: A2UIComponent[]
): ReactNode | undefined {
  if (children.length === 0) {
    return undefined;
  }

  return <>{renderChildren(children)}</>;
}

export function dispatchComponentActions(
  component: A2UIComponent,
  dispatchAction: DispatchAction | undefined,
  payload?: Record<string, unknown>
) {
  if (!dispatchAction || !component.actions?.length) {
    return;
  }

  component.actions.forEach((id) => dispatchAction(id, payload));
}

export function renderNamedIcon(iconName?: string) {
  return iconName ? <Icon name={iconName as never} /> : undefined;
}

export function getComponentPlacement(component: A2UIComponent) {
  const placement = component.placement || getAttributeString(component, 'placement');
  return typeof placement === 'string' ? placement : undefined;
}

export function normalizeMenuPlacement(
  placement: string | undefined
): 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | undefined {
  switch (placement) {
    case 'top-left':
    case 'top-right':
    case 'bottom-left':
    case 'bottom-right':
      return placement;
    case 'top':
    case 'top-center':
      return 'top-right';
    case 'bottom':
    case 'bottom-center':
      return 'bottom-right';
    case 'left':
      return 'bottom-left';
    case 'right':
      return 'bottom-right';
    default:
      return undefined;
  }
}

export function getNumberLikeValue(value?: string | number) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function getCssLengthValue(value?: string | number) {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return typeof value === 'string' ? value : undefined;
}

export function getNestedComponentArray(component: A2UIComponent, key: 'dragOverContent' | 'loadingOverlay') {
  const value = (component as A2UIComponent & Record<string, unknown>)[key];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const nestedComponents = value.filter(
    (item): item is A2UIComponent => Boolean(item) && typeof item === 'object' && !Array.isArray(item)
  );

  return nestedComponents.length > 0 ? nestedComponents : undefined;
}

export function getArrayValue<T = unknown>(component: A2UIComponent): T[] {
  return Array.isArray(component.value) ? (component.value as T[]) : [];
}

export function findFirstChildOfType(component: A2UIComponent, type: string): A2UIComponent | undefined {
  if (component.type === type) {
    return component;
  }

  for (const child of component.children || []) {
    const match = findFirstChildOfType(child, type);
    if (match) {
      return match;
    }
  }

  return undefined;
}
