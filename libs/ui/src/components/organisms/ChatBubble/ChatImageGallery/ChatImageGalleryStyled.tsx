'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { ChatImageGalleryStyledProps } from '../ChatBubble.types';

export const ChatImageGalleryStyled = forwardRef<HTMLDivElement, ChatImageGalleryStyledProps>((props, forwardedRef) => {
  const { theme: { chatbubble, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChatBubble = new Proxy(chatbubble || {}, tokensHandler(rest));
  const computedStyles = [get(themeChatBubble, 'imageGallery.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
