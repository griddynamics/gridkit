import type { ReactNode } from 'react';
import { Select } from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getMergedComponentStyles,
  getLeadingIconName,
  getTopLevelString,
  renderNamedIcon,
  getSelectItems,
  getSelectedSelectValue,
} from '../helpers';
import { CheckboxDropdownOption } from './checkbox';

export const selectRenderers = {
  select: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Select
      key={component.id}
      items={getSelectItems(component)}
      value={getSelectedSelectValue(component) as never}
      placeholder={component.placeholder}
      disabled={component.disabled}
      multiple={component.multiple}
      searchable={component.searchable}
      searchPlaceholder={component.searchPlaceholder}
      color={component.color as never}
      autoOpen={component.autoOpen}
      activeIndex={component.activeIndex}
      adornmentStart={renderNamedIcon(getLeadingIconName(component))}
      adornmentEnd={renderNamedIcon(getTopLevelString(component, 'iconEnd'))}
      width={
        typeof component.width === 'string'
          ? component.width
          : typeof component.styling?.width === 'string'
            ? component.styling.width
            : undefined
      }
      minWidth={typeof component.styling?.minWidth === 'string' ? component.styling.minWidth : undefined}
      maxWidth={typeof component.styling?.maxWidth === 'string' ? component.styling.maxWidth : undefined}
      styles={getMergedComponentStyles(component)}
      renderOption={
        component.multiple ? ({ item }) => <CheckboxDropdownOption key={String(item.value)} item={item} /> : undefined
      }
      onChange={
        dispatchAction && component.actions?.length
          ? (data) => {
              const value = Array.isArray(data) ? data.map((option) => option.value) : data?.value;
              component.actions!.forEach((id) => dispatchAction(id, { value }));
            }
          : undefined
      }
    />
  ),
};
