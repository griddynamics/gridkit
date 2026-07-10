import type { ReactNode } from 'react';
import { List } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getArrayValue } from '../helpers';

function getListItems(component: A2UIComponent): ReactNode[] {
  if (component.options?.length) {
    return component.options.map((option) => option.label);
  }

  return getArrayValue(component).map((item, index) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return String(item);
    }

    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      const label = String(record['label'] ?? record['name'] ?? record['title'] ?? `Item ${index + 1}`);
      const description = record['description'];
      if (description != null) {
        return `${label} ${String(description)}`;
      }
      return label;
    }

    return `Item ${index + 1}`;
  });
}

export const listRenderers = {
  list: (component: A2UIComponent) => (
    <List
      key={component.id}
      items={getListItems(component)}
      variant={component.variant as never}
      size={component.size === 'sm' || component.size === 'md' ? component.size : undefined}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getMergedComponentStyles(component)}
    />
  ),
};
