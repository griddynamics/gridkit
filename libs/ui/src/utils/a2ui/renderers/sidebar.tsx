import type { ReactNode } from 'react';
import { Sidebar } from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getComponentStyles,
  getObjectArrayField,
  getComponentArrayField,
  renderComponentSlot,
  renderNamedIcon,
  isRecord,
  dispatchComponentActions,
} from '../helpers';

type SidebarItemSpec = {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
  children?: SidebarItemSpec[];
};

function normalizeSidebarItem(
  rawItem: Record<string, unknown>,
  parentId: string,
  index: number
): SidebarItemSpec | null {
  const id = typeof rawItem['id'] === 'string' ? rawItem['id'] : `${parentId}_item_${index + 1}`;
  const label = typeof rawItem['label'] === 'string' ? rawItem['label'] : undefined;

  if (!label) {
    return null;
  }

  const children = Array.isArray(rawItem['children'])
    ? rawItem['children']
        .filter(isRecord)
        .map((child, childIndex) => normalizeSidebarItem(child, id, childIndex))
        .filter((item): item is SidebarItemSpec => item !== null)
    : undefined;

  return {
    id,
    label,
    icon: typeof rawItem['icon'] === 'string' ? renderNamedIcon(rawItem['icon']) : undefined,
    href: typeof rawItem['href'] === 'string' ? rawItem['href'] : undefined,
    disabled: typeof rawItem['disabled'] === 'boolean' ? rawItem['disabled'] : undefined,
    children,
  };
}

function getSidebarItems(component: A2UIComponent) {
  return getObjectArrayField(component, 'items')
    .map((item, index) => normalizeSidebarItem(item, component.id, index))
    .filter((item): item is SidebarItemSpec => item !== null);
}

export const sidebarRenderers = {
  sidebar: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Sidebar
      key={component.id}
      items={getSidebarItems(component)}
      activeItemId={component.activeItemId}
      collapsed={component.collapsed}
      width={typeof component.width === 'string' ? component.width : undefined}
      collapsedWidth={component.collapsedWidth}
      header={renderComponentSlot(renderChildren, getComponentArrayField(component, 'headerChildren'))}
      footer={renderComponentSlot(renderChildren, getComponentArrayField(component, 'footerChildren'))}
      styles={getComponentStyles(component.styling)}
      onItemClick={
        dispatchAction && component.actions?.length
          ? (_event, item) => dispatchComponentActions(component, dispatchAction, { trigger: 'item-click', item })
          : undefined
      }
      onCollapsedChange={
        dispatchAction && component.actions?.length
          ? (collapsed: boolean) =>
              dispatchComponentActions(component, dispatchAction, { trigger: 'collapsed-change', collapsed })
          : undefined
      }
    >
      {renderChildren(component.children)}
    </Sidebar>
  ),
};
