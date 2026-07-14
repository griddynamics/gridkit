import type { ReactNode } from 'react';
import { Button, Menu } from '@components';
import { DropdownItem } from '@components/molecules/DropdownItem';
import type { A2UIComponent } from '../../../ai';
import {
  getMergedComponentStyles,
  getLeadingIconName,
  getTopLevelString,
  renderNamedIcon,
  getOptionLikeItems,
  getComponentPlacement,
  normalizeMenuPlacement,
  getNumberLikeValue,
} from '../helpers';

export const menuRenderers = {
  menu: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Menu
      key={component.id}
      placement={normalizeMenuPlacement(getComponentPlacement(component))}
      closeOnSelect={component.closeOnSelect}
      offsetX={getNumberLikeValue((component as A2UIComponent & { offsetX?: number | string }).offsetX)}
      offsetY={getNumberLikeValue((component as A2UIComponent & { offsetY?: number | string }).offsetY)}
      minHeight={getNumberLikeValue(component.minHeight)}
      maxHeight={getNumberLikeValue(component.maxHeight)}
      onSelect={
        dispatchAction && component.actions?.length
          ? ({ data }) =>
              component.actions!.forEach((id) =>
                dispatchAction(id, {
                  value: data?.value,
                  label: data?.name,
                })
              )
          : undefined
      }
      content={
        <>
          {getOptionLikeItems(component).map((option) => (
            <DropdownItem
              key={`${component.id}-${String(option.value)}`}
              name={option.label}
              value={option.value}
              disabled={option.disabled}
            />
          ))}
        </>
      }
      styles={getMergedComponentStyles(component)}
    >
      <Button
        variant={(component.variant as never) || 'text'}
        disabled={component.disabled}
        iconStart={renderNamedIcon(getLeadingIconName(component))}
        iconEnd={renderNamedIcon(getTopLevelString(component, 'iconEnd'))}
      >
        {component.label || 'Open menu'}
      </Button>
    </Menu>
  ),
};
