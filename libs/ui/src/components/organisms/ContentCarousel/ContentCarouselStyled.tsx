import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import type { ContentCarouselStyledProps } from '@components';

interface ContentSlideStyledProps extends ContentCarouselStyledProps {
  $visibleItems?: number;
}

export const ContentSlideStyled = (props: ContentSlideStyledProps) => {
  const { theme: { carousel, ...rest } = {}, $visibleItems, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  const baseStyles = get(themeCarousel, 'contentSlide', {});

  // Calculate width based on visibleItems
  // If visibleItems is set, each slide takes 100/visibleItems% width
  // If not set, slides use auto width to show all items
  const visibleItemsStyles = $visibleItems
    ? {
        flex: `0 0 ${100 / $visibleItems}%`,
        minWidth: `${100 / $visibleItems}%`,
        maxWidth: `${100 / $visibleItems}%`,
      }
    : {
        flex: '0 0 auto',
        minWidth: 'auto',
        maxWidth: 'none',
      };

  return <div css={[baseStyles, visibleItemsStyles]} {...restProps} />;
};

export const CarouselFooterStyled = (props: ContentCarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'footer', {})} {...restProps} />;
};

export const CarouselFooterControlsStyled = (props: ContentCarouselStyledProps) => {
  const { theme: { carousel, ...rest } = {}, ...restProps } = props;
  const themeCarousel = new Proxy(carousel || {}, tokensHandler(rest));
  return <div css={get(themeCarousel, 'footerControls', {})} {...restProps} />;
};
