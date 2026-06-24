'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { ChatLinkPreviewStyledProps } from '../ChatBubble.types';

export const ChatLinkPreviewStyled = forwardRef<HTMLAnchorElement, ChatLinkPreviewStyledProps>(
  (props, forwardedRef) => {
    const { theme: { chatbubble, ...rest } = {}, styles = {}, ...restProps } = props;
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeChatBubble = new Proxy(chatbubble || {}, tokensHandler(rest));
    const computedStyles = [get(themeChatBubble, 'linkPreview.default', {}), boxStyles, styles];

    return <a css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
  }
);
