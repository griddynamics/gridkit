import type { ReactNode } from 'react';
import { SelectContext } from '@components/atoms/Select/hooks';
import { Dropdown } from '@components/molecules/Dropdown';
import { DropdownItem } from '@components/molecules/DropdownItem';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentStyles } from '../helpers';
import { DROPDOWN_SELECT_CONTEXT } from '../constants';

export const dropdownRenderers = {
  dropdown: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <SelectContext.Provider key={component.id} value={DROPDOWN_SELECT_CONTEXT}>
      <Dropdown
        aria-label={component.ariaLabel}
        className={component.className}
        styles={{
          width: component.width,
          maxHeight: component.maxHeight,
          ...getComponentStyles(component.styling),
        }}
      >
        {renderChildren(component.children)}
      </Dropdown>
    </SelectContext.Provider>
  ),
  'dropdown-item': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <DropdownItem
      key={component.id}
      name={component.label || String(component.value ?? '')}
      value={component.value}
      disabled={component.disabled}
      className={component.className}
      styles={getMergedComponentStyles(component)}
      onSelect={
        dispatchAction && component.actions?.length
          ? ({ data }) =>
              component.actions!.forEach((id) =>
                dispatchAction(id, {
                  value: data.value,
                  label: data.name,
                })
              )
          : undefined
      }
    >
      {component.children?.length
        ? renderChildren(component.children)
        : component.label || String(component.value ?? '')}
    </DropdownItem>
  ),
};
