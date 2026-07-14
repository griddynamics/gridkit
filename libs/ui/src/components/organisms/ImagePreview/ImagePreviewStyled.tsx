'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { ImagePreviewStyledProps } from './ImagePreview.types';

export const ImagePreviewStyled = forwardRef<HTMLDivElement, ImagePreviewStyledProps>((props, forwardedRef) => {
  const { theme: { imagePreview, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themePreview = new Proxy(imagePreview || {}, tokensHandler(rest));

  const computedStyles = [get(themePreview, 'container.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
