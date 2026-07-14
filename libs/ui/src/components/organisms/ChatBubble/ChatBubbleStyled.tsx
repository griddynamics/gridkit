'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, getMediaQuery, tokensHandler } from '@tokens/utils';
import { Loader } from '@components';

import type { BoxStyles } from '@types';
import type { ChatBubbleStyledProps, ChatBubbleCommonStyledProps } from './';

export const ChatBubbleStyled = forwardRef<HTMLDivElement, ChatBubbleStyledProps>((props, forwardedRef) => {
  const { theme: { chatbubble, ...rest } = {}, styles = {}, $variant, $status, $size, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChatBubble = new Proxy(chatbubble || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeChatBubble, 'default', {}),
    get(themeChatBubble, [$variant, 'default'], {}),
    get(themeChatBubble, $status, {}),
    get(themeChatBubble, ['size', $size], {}),
    getMediaQuery({ min: get(rest, 'breakpoints.xs') }, get(chatbubble, [$variant, 'xs'], {})),
    getMediaQuery({ min: get(rest, 'breakpoints.sm') }, get(chatbubble, [$variant, 'sm'], {})),
    getMediaQuery({ min: get(rest, 'breakpoints.md') }, get(chatbubble, [$variant, 'sm'], {})),
    getMediaQuery({ min: get(rest, 'breakpoints.lg') }, get(chatbubble, [$variant, 'lg'], {})),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const ChatContentStyled = (props: ChatBubbleCommonStyledProps) => {
  const { theme: { chatbubble, ...rest } = {}, $status, children, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChatBubble = new Proxy(chatbubble || {}, tokensHandler(rest));
  const computedLoaderProps = get(themeChatBubble, 'loader.attrs', {});

  const computedStyles = [
    get(themeChatBubble, 'content.default', {}),
    get(themeChatBubble, ['content', $status], {}),
    boxStyles,
    styles,
  ];

  return (
    <div css={computedStyles} {...restNotStyledProps}>
      {$status === 'pending' && <Loader {...computedLoaderProps} />}
      {children}
    </div>
  );
};

export const ChatActionsStyled = (props: ChatBubbleCommonStyledProps) => {
  const { theme: { chatbubble } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const computedStyles = [get(chatbubble, 'actions', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} />;
};
