import type { ReactNode } from 'react';
import { Image, ImagePreview, InlineNotification } from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getComponentStyles,
  getAttributeString,
  getAttributeNumber,
  getObjectArrayField,
  dispatchComponentActions,
} from '../helpers';

export function getImageSrc(component: A2UIComponent) {
  return component.src || getAttributeString(component, 'src');
}

export function getImageAlt(component: A2UIComponent) {
  return component.alt || getAttributeString(component, 'alt') || component.label || component.id;
}

export function getImageWidth(component: A2UIComponent) {
  if (typeof component.width === 'number') {
    return component.width;
  }

  return getAttributeNumber(component, 'width');
}

export function getImageHeight(component: A2UIComponent) {
  if (typeof component.height === 'number') {
    return component.height;
  }

  return getAttributeNumber(component, 'height');
}

export function getImageObjectFit(component: A2UIComponent) {
  return component.objectFit || getAttributeString(component, 'objectFit');
}

export function getImageStyles(component: A2UIComponent) {
  const componentStyles = getComponentStyles(component.styling);
  const mergedStyles = {
    ...componentStyles,
    ...(typeof component.width === 'string' ? { width: component.width } : {}),
    ...(typeof component.height === 'string' ? { height: component.height } : {}),
    ...(getImageObjectFit(component) ? { objectFit: getImageObjectFit(component) } : {}),
  };

  return Object.keys(mergedStyles).length > 0 ? mergedStyles : undefined;
}

type ImagePreviewItemSpec = {
  src: string;
  alt?: string;
  caption?: string;
};

function normalizeImagePreviewItem(rawItem: Record<string, unknown>): ImagePreviewItemSpec | null {
  if (typeof rawItem['src'] !== 'string') {
    return null;
  }

  return {
    src: rawItem['src'],
    alt: typeof rawItem['alt'] === 'string' ? rawItem['alt'] : undefined,
    caption: typeof rawItem['caption'] === 'string' ? rawItem['caption'] : undefined,
  };
}

function getImagePreviewItems(component: A2UIComponent) {
  return getObjectArrayField(component, 'images')
    .map(normalizeImagePreviewItem)
    .filter((item): item is ImagePreviewItemSpec => item !== null);
}

export const imageRenderers = {
  image: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Image
      key={component.id}
      id={component.id}
      src={getImageSrc(component)}
      alt={getImageAlt(component)}
      caption={component.caption}
      width={getImageWidth(component)}
      height={getImageHeight(component)}
      objectFit={getImageObjectFit(component) as never}
      as={component.as as never}
      captionAs={component.captionAs as never}
      fallbackComponent={
        <InlineNotification variant="warning">
          {`Image unavailable${component.label ? `: ${component.label}` : ''}`}
        </InlineNotification>
      }
      styles={getImageStyles(component) as never}
      onClick={component.actions?.length ? () => component.actions!.forEach((id) => dispatchAction?.(id)) : undefined}
    />
  ),
  'image-preview': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <ImagePreview
      key={component.id}
      images={getImagePreviewItems(component)}
      initialIndex={component.initialIndex}
      showThumbnails={component.showThumbnails}
      showCounter={component.showCounter}
      showArrows={component.showArrows}
      thumbnailPosition={component.thumbnailPosition}
      styles={getComponentStyles(component.styling)}
      onImageChange={
        dispatchAction && component.actions?.length
          ? (index: number) => {
              const items = getImagePreviewItems(component);
              dispatchComponentActions(component, dispatchAction, {
                trigger: 'image-change',
                index,
                image: items[index],
              });
            }
          : undefined
      }
    >
      {renderChildren(component.children)}
    </ImagePreview>
  ),
};
