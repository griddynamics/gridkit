import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import { TextareaStyledProps, TextareaResize } from './';

export const TextareaStyled = forwardRef<HTMLTextAreaElement, TextareaStyledProps>(
  (
    {
      theme: { textarea, ...rest } = {},
      styles = {},
      $resize = TextareaResize.None,
      $variant,
      $color = 'primary',
      $minHeight,
      $maxHeight,
      ...restProps
    },
    forwardedRef
  ) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeTextarea = new Proxy(textarea || {}, tokensHandler(rest));
    const computedStyles = [
      get(themeTextarea, $variant, {}),
      get(themeTextarea, $color, {}),
      $minHeight ? { minHeight: $minHeight } : {},
      $maxHeight ? { maxHeight: $maxHeight } : {},
      { resize: $resize },
      boxStyles,
      styles,
    ];

    return <textarea css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
  }
);
