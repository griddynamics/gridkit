import type { ReactNode } from 'react';
import { FlexContainer, Icon, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { isRecord } from './misc';
import { getAttributeBoolean } from './attributes';

export function getOptionLikeItems(component: A2UIComponent) {
  if (component.options?.length) {
    return component.options;
  }

  const legacyItems = (component as Record<string, unknown>)['items'];

  if (!Array.isArray(legacyItems)) {
    return [];
  }

  return legacyItems.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const labelSource = item['label'] ?? item['name'] ?? item['value'];

    return [
      {
        value: item['value'] ?? item['name'] ?? item['label'] ?? `${component.id}_option_${index + 1}`,
        label: typeof labelSource === 'string' ? labelSource : String(labelSource ?? `Option ${index + 1}`),
        disabled: typeof item['disabled'] === 'boolean' ? item['disabled'] : undefined,
        icon: typeof item['icon'] === 'string' ? item['icon'] : undefined,
        href: typeof item['href'] === 'string' ? item['href'] : undefined,
        noticeCounter:
          typeof item['noticeCounter'] === 'string' || typeof item['noticeCounter'] === 'number'
            ? item['noticeCounter']
            : undefined,
        hex: typeof item['hex'] === 'string' ? item['hex'] : undefined,
        image: typeof item['image'] === 'string' ? item['image'] : undefined,
        tooltip: typeof item['tooltip'] === 'string' ? item['tooltip'] : undefined,
        validationStatus: typeof item['validationStatus'] === 'string' ? item['validationStatus'] : undefined,
      },
    ];
  });
}

export function getSelectItems(component: A2UIComponent) {
  return getOptionLikeItems(component).map((option) => ({
    name: option.label,
    value: option.value,
  }));
}

export function getSelectedSelectValue(component: A2UIComponent) {
  const items = getSelectItems(component);
  const isMultiple = component.multiple ?? getAttributeBoolean(component, 'multiple');

  if (isMultiple && Array.isArray(component.value)) {
    const selectedValues = component.value as unknown[];
    return items.filter((option) => selectedValues.includes(option.value));
  }

  return items.find((option) => option.value === component.value) ?? null;
}

export function getRadioOptions(component: A2UIComponent) {
  return getOptionLikeItems(component).map((option) => ({
    label: option.label,
    value: String(option.value ?? option.label),
    disabled: option.disabled,
    hex: option.hex,
    image: option.image,
    tooltip: option.tooltip,
  }));
}

export function getToggleItems(component: A2UIComponent) {
  return getOptionLikeItems(component).map((option) => ({
    value: option.value,
    label: option.icon ? (
      <FlexContainer alignItems="center" gap="4px">
        <Icon name={option.icon as never} />
        <Typography as="span">{option.label}</Typography>
      </FlexContainer>
    ) : (
      option.label
    ),
  })) as { value: unknown; label: ReactNode }[];
}
