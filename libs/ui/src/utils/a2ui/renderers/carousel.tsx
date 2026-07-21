import type { ReactNode } from 'react';
import { Box, Carousel, ContentCarousel } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles, getAttributeObject } from '../helpers';
import { getImageSrc, getImageAlt, getImageWidth, getImageHeight, getImageObjectFit, getImageStyles } from './image';

type SlideEntry = {
  key: string;
  image?: A2UIComponent;
  overlay: A2UIComponent[];
};

function getCarouselSlideEntries(component: A2UIComponent): SlideEntry[] {
  return (component.children || []).flatMap((child, index) => {
    if (child.type === 'image') {
      return [{ key: child.id ?? `image-${index}`, image: child, overlay: [] }];
    }

    if (child.type === 'carousel-slide') {
      const slideChildren = child.children || [];
      const image = slideChildren.find((grandchild) => grandchild.type === 'image');
      const overlay = slideChildren.filter((grandchild) => grandchild.type !== 'image');
      return [{ key: child.id ?? `slide-${index}`, image, overlay }];
    }

    return [];
  });
}

function getCarouselOptions(component: A2UIComponent) {
  const topLevelOptions =
    (component as A2UIComponent & { carouselOptions?: unknown }).carouselOptions ??
    (component as A2UIComponent & { options?: unknown }).options;

  if (topLevelOptions && typeof topLevelOptions === 'object' && !Array.isArray(topLevelOptions)) {
    return topLevelOptions;
  }

  return getAttributeObject<Record<string, unknown>>(component, 'options');
}

export const carouselRenderers = {
  carousel: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => {
    const slideEntries = getCarouselSlideEntries(component);
    const orphanOverlayChildren = (component.children || []).filter(
      (child) => child.type !== 'image' && child.type !== 'carousel-slide'
    );

    if (slideEntries.length === 0) {
      return (
        <ContentCarousel
          key={component.id}
          items={component.children || []}
          renderItem={(item) => (renderChildren([item]) as ReactNode[])[0] ?? null}
          showArrows={component.showArrows}
          showDots={component.showDots}
          isFocusable={component.isFocusable}
          styles={getComponentStyles(component.styling)}
        />
      );
    }

    return (
      <Carousel
        key={component.id}
        layout={component.layout as never}
        variant={component.variant as never}
        showArrows={component.showArrows}
        showDots={component.showDots}
        thumbs={component.thumbs as never}
        isFocusable={component.isFocusable}
        options={getCarouselOptions(component) as never}
        styles={getComponentStyles(component.styling)}
      >
        {slideEntries.map((entry) => {
          const overlayContent = entry.overlay.length > 0 ? renderChildren(entry.overlay) : null;
          const imageProps = entry.image
            ? {
                src: getImageSrc(entry.image),
                alt: getImageAlt(entry.image),
                width: getImageWidth(entry.image),
                height: getImageHeight(entry.image),
                objectFit: getImageObjectFit(entry.image) as never,
                styles: getImageStyles(entry.image) as never,
              }
            : {};

          return (
            <Carousel.Image key={entry.key} {...imageProps}>
              {overlayContent}
            </Carousel.Image>
          );
        })}
        {orphanOverlayChildren.length > 0 ? (
          <Carousel.Content as="div">{renderChildren(orphanOverlayChildren)}</Carousel.Content>
        ) : null}
      </Carousel>
    );
  },
  'carousel-slide': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Box key={component.id} styles={getComponentStyles(component.styling)}>
      {renderChildren(component.children)}
    </Box>
  ),
};
