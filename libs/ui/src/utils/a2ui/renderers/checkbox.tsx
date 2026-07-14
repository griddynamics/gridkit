import type { ReactNode } from 'react';
import { Checkbox } from '@components';
import { DropdownItem } from '@components/molecules/DropdownItem';
import { useSelectContext } from '@components/atoms/Select/hooks';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentText } from '../helpers';

export function CheckboxDropdownOption({ item }: { item: { name: string; value?: unknown } }) {
  const { value: selectedValue, itemIdentifier, multiple } = useSelectContext();
  const isSelected =
    multiple && Array.isArray(selectedValue)
      ? selectedValue.some((v) => (itemIdentifier ? itemIdentifier(v, item as never) : v.value === item.value))
      : false;
  return (
    <DropdownItem value={item.value} name={item.name} styles={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Checkbox
        checked={isSelected}
        onValueChange={() => {
          /* empty */
        }}
        styles={{ pointerEvents: 'none' }}
      />
      {item.name}
    </DropdownItem>
  );
}

function getCheckboxChecked(component: A2UIComponent) {
  if (typeof component.checked === 'boolean') {
    return component.checked;
  }

  return typeof component.value === 'boolean' ? component.value : undefined;
}

export const checkboxRenderers = {
  checkbox: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Checkbox
      key={component.id}
      checked={getCheckboxChecked(component)}
      indeterminate={component.indeterminate}
      disabled={component.disabled}
      name={component.name}
      value={typeof component.value === 'string' ? component.value : undefined}
      size={component.size === 'sm' || component.size === 'md' ? component.size : undefined}
      styles={getMergedComponentStyles(component)}
      onValueChange={
        dispatchAction && component.actions?.length
          ? (checked: boolean) => component.actions!.forEach((id) => dispatchAction(id, { checked, value: checked }))
          : undefined
      }
    >
      {getComponentText(component)}
    </Checkbox>
  ),
};
