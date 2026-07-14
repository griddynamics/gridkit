'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';

import { COMPONENT_NAME } from './constants';
import { ChatBubbleStyled, ChatContentStyled, ChatActionsStyled } from './ChatBubbleStyled';
import type { ChatBubbleProps } from './ChatBubble.types';
import { ChatImageGallery } from './ChatImageGallery';
import { ChatLinkPreview } from './ChatLinkPreview';

const ChatBubbleBase = forwardRef<HTMLDivElement, ChatBubbleProps>((props, forwardedRef) => {
  const {
    styles = {},
    status = 'fulfilled',
    variant = 'question',
    size = 'md',
    actions = [],
    children,
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <ChatBubbleStyled
      theme={theme}
      styles={styles}
      $variant={variant}
      $size={size}
      ref={forwardedRef}
      $status={status}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      <ChatContentStyled theme={theme} $status={status} data-testid={`${COMPONENT_NAME}-content`}>
        {children}
      </ChatContentStyled>
      {actions?.length ? (
        <ChatActionsStyled theme={theme} data-testid={`${COMPONENT_NAME}-actions`}>
          {actions}
        </ChatActionsStyled>
      ) : null}
    </ChatBubbleStyled>
  );
});

ChatBubbleBase.displayName = COMPONENT_NAME;

export const ChatBubble = Object.assign(ChatBubbleBase, {
  ImageGallery: ChatImageGallery,
  LinkPreview: ChatLinkPreview,
});
