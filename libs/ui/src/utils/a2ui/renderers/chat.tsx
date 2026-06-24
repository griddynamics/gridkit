import type { ReactNode } from 'react';
import { ChatBubble, ChatContainer, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import type { ChatImageGalleryImage } from '../../../components/organisms/ChatBubble/ChatBubble.types';
import {
  getMergedComponentStyles,
  getComponentStyles,
  getComponentText,
  getTopLevelBoolean,
  getComponentArrayField,
  getObjectArrayField,
  renderComponentSlot,
  getAttributeString,
  dispatchComponentActions,
} from '../helpers';

function getChatImageGalleryImages(component: A2UIComponent): ChatImageGalleryImage[] {
  const result: ChatImageGalleryImage[] = [];

  for (const item of getObjectArrayField(component, 'images')) {
    if (typeof item['src'] !== 'string') continue;
    const image: ChatImageGalleryImage = { src: item['src'] };
    if (typeof item['alt'] === 'string') image.alt = item['alt'];
    result.push(image);
  }

  return result;
}

export const chatRenderers = {
  'chat-bubble': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <ChatBubble
      key={component.id}
      variant={component.variant as never}
      status={(component.status || getAttributeString(component, 'status')) as never}
      size={
        component.size === 'sm' || component.size === 'md' || component.size === 'lg'
          ? (component.size as 'sm' | 'md' | 'lg')
          : undefined
      }
      actions={
        getComponentArrayField(component, 'actionChildren').length
          ? renderChildren(getComponentArrayField(component, 'actionChildren'))
          : undefined
      }
      styles={getComponentStyles(component.styling)}
    >
      {getComponentText(component) ? <Typography>{getComponentText(component)}</Typography> : null}
      {renderChildren(component.children)}
    </ChatBubble>
  ),
  'chat-image-gallery': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const images = getChatImageGalleryImages(component);
    const rawMaxVisible = (component as Record<string, unknown>)['maxVisible'];
    return (
      <ChatBubble.ImageGallery
        key={component.id}
        images={images}
        maxVisible={typeof rawMaxVisible === 'number' ? rawMaxVisible : undefined}
        onImageClick={
          dispatchAction && component.actions?.length
            ? (index: number) =>
                dispatchComponentActions(component, dispatchAction, {
                  trigger: 'click',
                  index,
                  image: images[index],
                })
            : undefined
        }
        styles={getComponentStyles(component.styling)}
      />
    );
  },
  'chat-container': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <ChatContainer
      key={component.id}
      isOpen={component.isOpen ?? getTopLevelBoolean(component, 'isOpen')}
      showSidebarAsideControl={
        component.showSidebarAsideControl ?? getTopLevelBoolean(component, 'showSidebarAsideControl')
      }
      showSidebarHeaderControl={
        component.showSidebarHeaderControl ?? getTopLevelBoolean(component, 'showSidebarHeaderControl')
      }
      sidebarContent={component.sidebarContent?.length ? renderChildren(component.sidebarContent) : undefined}
      sidebarMinifiedContent={
        component.sidebarMinifiedContent?.length ? renderChildren(component.sidebarMinifiedContent) : undefined
      }
      sidebarHeaderContent={
        component.sidebarHeaderContent?.length ? renderChildren(component.sidebarHeaderContent) : undefined
      }
      headerContent={component.headerContent?.length ? renderChildren(component.headerContent) : undefined}
      className={component.className}
      styles={getMergedComponentStyles(component)}
    >
      {renderChildren(component.children)}
    </ChatContainer>
  ),
};
