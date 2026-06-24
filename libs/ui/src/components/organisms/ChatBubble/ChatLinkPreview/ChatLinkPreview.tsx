'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Image } from '@components/atoms/Image';
import { Typography } from '@components/atoms/Typography';
import { get } from '@utils';
import { TypographyVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import { ChatLinkPreviewStyled } from './ChatLinkPreviewStyled';
import type { ChatLinkPreviewProps } from '../ChatBubble.types';

export const ChatLinkPreview = forwardRef<HTMLAnchorElement, ChatLinkPreviewProps>((props, forwardedRef) => {
  const { url, title, description, thumbnail, domain, onClick, ...rest } = props;
  const { theme } = useTheme();

  const thumbnailStyles = get(theme, 'chatbubble.linkPreview.thumbnail', {});
  const contentStyles = get(theme, 'chatbubble.linkPreview.content', {});
  const titleStyles = get(theme, 'chatbubble.linkPreview.title', {});
  const descriptionStyles = get(theme, 'chatbubble.linkPreview.description', {});
  const domainStyles = get(theme, 'chatbubble.linkPreview.domain', {});
  const imgStyles = get(theme, 'chatbubble.linkPreview.imageStyles', {});

  return (
    <ChatLinkPreviewStyled
      ref={forwardedRef}
      theme={theme}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      {thumbnail && (
        <div css={thumbnailStyles}>
          <Image src={thumbnail} alt={title || ''} styles={imgStyles} />
        </div>
      )}
      <div css={contentStyles}>
        {title && (
          <Typography variant={TypographyVariant.Body2} css={titleStyles}>
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="caption" css={descriptionStyles}>
            {description}
          </Typography>
        )}
        {domain && (
          <Typography variant="caption" css={domainStyles}>
            {domain}
          </Typography>
        )}
      </div>
    </ChatLinkPreviewStyled>
  );
});

ChatLinkPreview.displayName = COMPONENT_NAME;
