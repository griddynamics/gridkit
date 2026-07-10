import type { ReactNode } from 'react';
import { Header } from '@components';
import type { A2UIComponent } from '../../../ai';
import { isSafeA2UIUrl } from '../../../ai';
import {
  getComponentStyles,
  getObjectArrayField,
  getComponentArrayField,
  renderComponentSlot,
  dispatchComponentActions,
} from '../helpers';

type HeaderMobileMenuItemSpec = {
  id?: string;
  title: string;
  path?: string;
  icon?: string;
};

function getHeaderMobileMenuList(component: A2UIComponent) {
  return getObjectArrayField(component, 'mobileMenuList').reduce<HeaderMobileMenuItemSpec[]>((result, item, index) => {
    const title = typeof item['title'] === 'string' ? item['title'] : undefined;
    if (!title) {
      return result;
    }

    result.push({
      id: typeof item['id'] === 'string' ? item['id'] : `${component.id}_mobile_item_${index + 1}`,
      title,
      path: typeof item['path'] === 'string' && isSafeA2UIUrl(item['path']) ? item['path'] : undefined,
      icon: typeof item['icon'] === 'string' ? item['icon'] : undefined,
    });

    return result;
  }, []);
}

export const headerRenderers = {
  header: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Header
      key={component.id}
      bgColor={component.bgColor}
      showSearch={component.showSearch}
      showTopBanner={component.showTopBanner}
      logo={renderComponentSlot(renderChildren, getComponentArrayField(component, 'logoChildren'))}
      menu={renderComponentSlot(renderChildren, getComponentArrayField(component, 'menuChildren'))}
      actions={renderComponentSlot(renderChildren, getComponentArrayField(component, 'actionChildren'))}
      bannerContent={renderComponentSlot(renderChildren, getComponentArrayField(component, 'bannerChildren'))}
      advBlock={renderComponentSlot(renderChildren, getComponentArrayField(component, 'advChildren'))}
      mobileMenuList={getHeaderMobileMenuList(component)}
      onMobileMenuItemClick={
        dispatchAction && component.actions?.length
          ? (_event, item) => dispatchComponentActions(component, dispatchAction, { trigger: 'menu-item', item })
          : undefined
      }
      styles={getComponentStyles(component.styling)}
    >
      {renderChildren(component.children)}
    </Header>
  ),
};
