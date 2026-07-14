import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles, ButtonVariant } from '@types';
import type { IconProps } from '@components/atoms';
import type { AttachmentFileStyledProps, AttachmentFileThemedProps } from './';

export const AttachmentFileStyled = forwardRef<HTMLDivElement, AttachmentFileStyledProps>((props, forwardedRef) => {
  const { theme: { attachmentFile, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAttachmentFile = new Proxy(attachmentFile || {}, tokensHandler(rest));

  const computedStyles = [get(themeAttachmentFile, 'container.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const AttachmentFileInfoStyled = ({ theme, ...props }: AttachmentFileThemedProps) => {
  const { attachmentFile, ...rest } = theme || {};
  const themeAttachmentFile = new Proxy(attachmentFile || {}, tokensHandler(rest));
  return <div css={get(themeAttachmentFile, 'info.default', {})} {...props} />;
};

export const AttachmentFileNameStyled = ({ theme, ...props }: AttachmentFileThemedProps) => {
  const { attachmentFile, ...rest } = theme || {};
  const themeAttachmentFile = new Proxy(attachmentFile || {}, tokensHandler(rest));
  return <div css={get(themeAttachmentFile, 'name.default', {})} {...props} />;
};

export const AttachmentFileMetaRowStyled = ({ theme, ...props }: AttachmentFileThemedProps) => {
  const { attachmentFile, ...rest } = theme || {};
  const themeAttachmentFile = new Proxy(attachmentFile || {}, tokensHandler(rest));
  return <div css={get(themeAttachmentFile, 'meta.row', {})} {...props} />;
};

export const AttachmentFileMetaTextStyled = ({ theme, styles, ...props }: AttachmentFileThemedProps) => {
  const { attachmentFile, ...rest } = theme || {};
  const themeAttachmentFile = new Proxy(attachmentFile || {}, tokensHandler(rest));
  return <span css={[get(themeAttachmentFile, 'meta.text', {}), styles]} {...props} />;
};

export function resolveAttachmentFileTokens(theme: Record<string, unknown> = {}) {
  const { attachmentFile, ...rest } = theme as { attachmentFile?: unknown; [key: string]: unknown };
  const themeAttachmentFile = new Proxy(attachmentFile || {}, tokensHandler(rest));

  return {
    buttonVariant: get(themeAttachmentFile, 'button.variant', 'tertiary') as ButtonVariant,
    buttonStyles: get(themeAttachmentFile, 'button.default', {}),
    fileIconProps: get(themeAttachmentFile, 'icon.file', { name: 'fileCopy', size: 'xl' }) as IconProps,
    removeIconProps: get(themeAttachmentFile, 'icon.remove', { name: 'cross', size: 'lg' }) as IconProps,
  };
}
