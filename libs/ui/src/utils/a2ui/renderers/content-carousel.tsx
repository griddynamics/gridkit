import type { ReactNode } from 'react';
import { ContentCarousel } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles, getAttributeNumber, getAttributeString, isRecord } from '../helpers';

type LegacyContentCarouselItem = Partial<A2UIComponent> & {
  type?: string;
  src?: string;
  alt?: string;
  children?: A2UIComponent[];
};

function normalizeLegacyContentCarouselItem(
  item: LegacyContentCarouselItem,
  parentId: string,
  index: number
): A2UIComponent | null {
  if (item.type && typeof item.type === 'string') {
    return item as A2UIComponent;
  }

  if (typeof item.src === 'string') {
    return {
      id: item.id || `${parentId}_item_${index + 1}`,
      type: 'image',
      src: item.src,
      alt: item.alt || `${parentId} item ${index + 1}`,
      styling: item.styling,
    };
  }

  return null;
}

function getContentCarouselItems(component: A2UIComponent) {
  if (component.children?.length) {
    return component.children;
  }

  const legacyItems = (component as Record<string, unknown>)['items'];

  if (!Array.isArray(legacyItems)) {
    return [];
  }

  return legacyItems
    .map((item, index) =>
      isRecord(item) ? normalizeLegacyContentCarouselItem(item as LegacyContentCarouselItem, component.id, index) : null
    )
    .filter((item): item is A2UIComponent => item !== null);
}

function getContentCarouselVisibleItems(component: A2UIComponent) {
  if (typeof component.visibleItems === 'number') {
    return component.visibleItems;
  }

  return getAttributeNumber(component, 'visibleItems');
}

function getContentCarouselScrollStep(component: A2UIComponent) {
  if (typeof component.scrollStep === 'number') {
    return component.scrollStep;
  }

  return getAttributeNumber(component, 'scrollStep');
}

function getContentCarouselScrollAlignment(component: A2UIComponent) {
  const alignment = component.scrollAlignment || getAttributeString(component, 'scrollAlignment');

  return alignment === 'left' || alignment === 'centered' ? alignment : undefined;
}

export const contentCarouselRenderers = {
  'content-carousel': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <ContentCarousel
      key={component.id}
      items={getContentCarouselItems(component)}
      renderItem={(item) => (renderChildren([item]) as ReactNode[])[0] ?? null}
      showArrows={component.showArrows}
      showDots={component.showDots}
      isFocusable={component.isFocusable}
      visibleItems={getContentCarouselVisibleItems(component)}
      scrollStep={getContentCarouselScrollStep(component)}
      scrollAlignment={getContentCarouselScrollAlignment(component)}
      styles={getComponentStyles(component.styling)}
    />
  ),
};
